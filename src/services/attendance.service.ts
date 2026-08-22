import { prisma } from '../config/db';
import { ConflictError, NotFoundError, ValidationError } from '../utils/errors';
import { AuditService } from './audit.service';

export class AttendanceService {
  private static getTodayMidnightUTC(): Date {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  static async checkIn(
    employeeId: string,
    data: { workMode?: string; notes?: string },
    ipAddress?: string
  ) {
    const today = this.getTodayMidnightUTC();

    // Check if record already exists for today
    const existing = await prisma.attendanceRecord.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: today,
        },
      },
    });

    if (existing && existing.checkInTime) {
      throw new ConflictError(
        `Already checked in today at ${existing.checkInTime.toLocaleTimeString()}. Duplicate check-in is not permitted.`
      );
    }

    const now = new Date();

    if (existing) {
      return prisma.attendanceRecord.update({
        where: { id: existing.id },
        data: {
          checkInTime: now,
          status: 'PRESENT',
          workMode: data.workMode || 'OFFICE',
          notes: data.notes || existing.notes,
          ipAddress,
        },
      });
    }

    return prisma.attendanceRecord.create({
      data: {
        employeeId,
        date: today,
        checkInTime: now,
        status: 'PRESENT',
        workMode: data.workMode || 'OFFICE',
        notes: data.notes,
        ipAddress,
        totalHours: 0,
      },
    });
  }

  static async checkOut(employeeId: string, data: { notes?: string }) {
    const today = this.getTodayMidnightUTC();

    const existing = await prisma.attendanceRecord.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: today,
        },
      },
    });

    if (!existing || !existing.checkInTime) {
      throw new ValidationError('Cannot check out without an active check-in record for today.');
    }

    if (existing.checkOutTime) {
      throw new ConflictError(
        `Already checked out today at ${existing.checkOutTime.toLocaleTimeString()}.`
      );
    }

    const now = new Date();
    const durationMs = now.getTime() - existing.checkInTime.getTime();
    const hoursWorked = parseFloat((durationMs / (1000 * 60 * 60)).toFixed(2));

    let calculatedStatus = 'PRESENT';
    if (hoursWorked < 4) {
      calculatedStatus = 'HALF_DAY';
    }

    return prisma.attendanceRecord.update({
      where: { id: existing.id },
      data: {
        checkOutTime: now,
        totalHours: hoursWorked,
        status: calculatedStatus,
        notes: data.notes ? `${existing.notes ? existing.notes + ' | ' : ''}${data.notes}` : existing.notes,
      },
    });
  }

  static async getTodayStatus(employeeId: string) {
    const today = this.getTodayMidnightUTC();
    const record = await prisma.attendanceRecord.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: today,
        },
      },
    });

    return {
      date: today,
      record: record || null,
      isCheckedIn: !!(record && record.checkInTime && !record.checkOutTime),
      isCheckedOut: !!(record && record.checkOutTime),
    };
  }

  static async getMyHistory(employeeId: string, month?: number, year?: number) {
    const targetYear = year || new Date().getFullYear();
    const targetMonth = month !== undefined ? month : new Date().getMonth() + 1;

    const startDate = new Date(Date.UTC(targetYear, targetMonth - 1, 1));
    const endDate = new Date(Date.UTC(targetYear, targetMonth, 0, 23, 59, 59));

    const records = await prisma.attendanceRecord.findMany({
      where: {
        employeeId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    const totalDaysPresent = records.filter(
      (r) => r.status === 'PRESENT' || r.status === 'HALF_DAY'
    ).length;
    const totalHours = records.reduce((sum, r) => sum + r.totalHours, 0);
    const avgHours = totalDaysPresent > 0 ? parseFloat((totalHours / totalDaysPresent).toFixed(2)) : 0;

    return {
      month: targetMonth,
      year: targetYear,
      metrics: {
        totalRecords: records.length,
        totalDaysPresent,
        totalHours: parseFloat(totalHours.toFixed(2)),
        averageHoursPerDay: avgHours,
      },
      records,
    };
  }

  static async getTeamAttendance(filters: {
    date?: string;
    department?: string;
    status?: string;
  }) {
    const targetDate = filters.date ? new Date(filters.date) : this.getTodayMidnightUTC();
    targetDate.setUTCHours(0, 0, 0, 0);

    const where: any = {
      date: targetDate,
    };

    if (filters.status && filters.status !== 'ALL') {
      where.status = filters.status;
    }

    if (filters.department && filters.department !== 'ALL') {
      where.employee = { department: filters.department };
    }

    const records = await prisma.attendanceRecord.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            department: true,
            designation: true,
            avatarUrl: true,
            user: { select: { employeeId: true, email: true } },
          },
        },
      },
      orderBy: { checkInTime: 'desc' },
    });

    return {
      date: targetDate,
      totalEntries: records.length,
      records,
    };
  }

  static async manualEntry(
    data: {
      employeeId: string;
      date: string;
      checkInTime?: string | null;
      checkOutTime?: string | null;
      status: string;
      workMode?: string;
      notes: string;
    },
    adminUserId: string,
    adminEmail: string,
    ipAddress?: string
  ) {
    const targetDate = new Date(data.date);
    targetDate.setUTCHours(0, 0, 0, 0);

    const checkIn = data.checkInTime ? new Date(data.checkInTime) : null;
    const checkOut = data.checkOutTime ? new Date(data.checkOutTime) : null;

    let hours = 0;
    if (checkIn && checkOut) {
      hours = parseFloat(((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60)).toFixed(2));
    } else if (data.status === 'PRESENT') {
      hours = 8;
    } else if (data.status === 'HALF_DAY') {
      hours = 4;
    }

    const result = await prisma.attendanceRecord.upsert({
      where: {
        employeeId_date: {
          employeeId: data.employeeId,
          date: targetDate,
        },
      },
      create: {
        employeeId: data.employeeId,
        date: targetDate,
        checkInTime: checkIn,
        checkOutTime: checkOut,
        status: data.status,
        workMode: data.workMode || 'OFFICE',
        totalHours: hours,
        notes: `[Manual Admin Override by ${adminEmail}]: ${data.notes}`,
        ipAddress,
      },
      update: {
        checkInTime: checkIn,
        checkOutTime: checkOut,
        status: data.status,
        workMode: data.workMode || 'OFFICE',
        totalHours: hours,
        notes: `[Manual Admin Override by ${adminEmail}]: ${data.notes}`,
      },
    });

    await AuditService.log({
      userId: adminUserId,
      userEmail: adminEmail,
      action: 'ATTENDANCE_MANUAL_OVERRIDE',
      resourceType: 'ATTENDANCE',
      resourceId: result.id,
      changesDiff: data,
      ipAddress,
    });

    return result;
  }

  static async getAnalytics() {
    const today = this.getTodayMidnightUTC();
    const totalEmployees = await prisma.employeeProfile.count({
      where: { user: { status: 'ACTIVE' } },
    });

    const todayRecords = await prisma.attendanceRecord.findMany({
      where: { date: today },
    });

    const presentCount = todayRecords.filter(
      (r) => r.status === 'PRESENT' || r.status === 'HALF_DAY'
    ).length;
    const remoteCount = todayRecords.filter((r) => r.workMode === 'REMOTE').length;
    const officeCount = todayRecords.filter((r) => r.workMode === 'OFFICE').length;
    const onLeaveCount = todayRecords.filter((r) => r.status === 'ON_LEAVE').length;

    const attendanceRate =
      totalEmployees > 0 ? parseFloat(((presentCount / totalEmployees) * 100).toFixed(1)) : 0;

    return {
      date: today,
      totalEmployees,
      presentCount,
      absentCount: Math.max(0, totalEmployees - presentCount - onLeaveCount),
      onLeaveCount,
      remoteCount,
      officeCount,
      attendanceRate,
    };
  }
}
