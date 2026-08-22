import bcrypt from 'bcryptjs';
import { prisma } from '../config/db';
import { config } from '../config';
import { ConflictError, NotFoundError } from '../utils/errors';
import { AuditService } from './audit.service';
import { NotificationService } from './notification.service';

export class EmployeeService {
  static async getEmployees(filters: {
    department?: string;
    status?: string;
    role?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.department && filters.department !== 'ALL') {
      where.department = filters.department;
    }

    if (filters.status && filters.status !== 'ALL') {
      where.user = { status: filters.status };
    }

    if (filters.role && filters.role !== 'ALL') {
      where.user = { ...(where.user || {}), role: filters.role };
    }

    if (filters.search) {
      where.OR = [
        { firstName: { contains: filters.search } },
        { lastName: { contains: filters.search } },
        { designation: { contains: filters.search } },
        { user: { email: { contains: filters.search } } },
        { user: { employeeId: { contains: filters.search } } },
      ];
    }

    const [total, profiles] = await Promise.all([
      prisma.employeeProfile.count({ where }),
      prisma.employeeProfile.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              employeeId: true,
              role: true,
              status: true,
              isEmailVerified: true,
              createdAt: true,
            },
          },
          reportingManager: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              designation: true,
            },
          },
          salaryStructures: {
            where: { isCurrent: true },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      employees: profiles.map((p) => ({
        ...p,
        currentSalary: p.salaryStructures[0] || null,
      })),
    };
  }

  static async getEmployeeById(id: string) {
    const profile = await prisma.employeeProfile.findFirst({
      where: {
        OR: [{ id }, { userId: id }],
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            employeeId: true,
            role: true,
            status: true,
            createdAt: true,
          },
        },
        reportingManager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            designation: true,
            department: true,
          },
        },
        directReports: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            designation: true,
            department: true,
          },
        },
        salaryStructures: {
          orderBy: { effectiveDate: 'desc' },
        },
        leaveBalances: {
          where: { year: new Date().getFullYear() },
          include: { leaveType: true },
        },
        attendanceRecords: {
          orderBy: { date: 'desc' },
          take: 30,
        },
      },
    });

    if (!profile) {
      throw new NotFoundError(`Employee profile with ID ${id} not found.`);
    }

    return profile;
  }

  static async createEmployee(
    data: any,
    creatorUserId?: string,
    creatorEmail?: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    // Check duplicates
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { employeeId: data.employeeId }],
      },
    });

    if (existingUser) {
      if (existingUser.email === data.email) {
        throw new ConflictError('A user with this corporate email already exists.');
      }
      throw new ConflictError('A user with this badge ID already exists.');
    }

    const rawPassword = data.password || 'Password@123';
    const passwordHash = await bcrypt.hash(rawPassword, config.bcryptSaltRounds);
    const currentYear = new Date().getFullYear();
    const leaveTypes = await prisma.leaveType.findMany();

    // Create User, Profile, Initial Salary, and Balances transactionally
    const createdProfile = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          employeeId: data.employeeId,
          passwordHash,
          role: data.role || 'EMPLOYEE',
          status: 'ACTIVE',
          isEmailVerified: true,
        },
      });

      const profile = await tx.employeeProfile.create({
        data: {
          userId: user.id,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          gender: data.gender,
          address: data.address,
          department: data.department,
          designation: data.designation,
          dateOfJoining: data.dateOfJoining ? new Date(data.dateOfJoining) : new Date(),
          employmentType: data.employmentType || 'FULL_TIME',
          reportingManagerId: data.reportingManagerId || null,
          emergencyContact: data.emergencyContact,
          avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.firstName}_${data.lastName}`,
        },
      });

      // Initialize Leave Balances
      for (const lt of leaveTypes) {
        await tx.leaveBalance.create({
          data: {
            employeeId: profile.id,
            leaveTypeId: lt.id,
            year: currentYear,
            totalAllocated: lt.maxDaysPerYear,
            usedDays: 0,
            pendingDays: 0,
            remainingDays: lt.maxDaysPerYear,
          },
        });
      }

      // If initial salary parameters supplied, create initial salary structure
      if (data.baseSalary) {
        const base = data.baseSalary;
        const hra = data.hra || base * 0.3;
        const allowances = data.allowances || base * 0.15;
        const deductions = data.deductions || base * 0.2;
        const gross = base + hra + allowances;
        const net = gross - deductions;

        await tx.salaryStructure.create({
          data: {
            employeeId: profile.id,
            effectiveDate: new Date(),
            baseSalary: base,
            hra,
            allowances,
            deductions,
            grossSalary: gross,
            netSalary: net,
            isCurrent: true,
            currency: 'USD',
            remarks: 'Initial compensation on hire',
            createdById: creatorUserId,
          },
        });
      }

      return profile;
    });

    await AuditService.log({
      userId: creatorUserId,
      userEmail: creatorEmail,
      action: 'EMPLOYEE_CREATE',
      resourceType: 'EMPLOYEE',
      resourceId: createdProfile.id,
      changesDiff: {
        name: `${createdProfile.firstName} ${createdProfile.lastName}`,
        department: createdProfile.department,
        designation: createdProfile.designation,
      },
      ipAddress,
      userAgent,
    });

    return this.getEmployeeById(createdProfile.id);
  }

  static async updateEmployee(
    id: string,
    data: any,
    modifierUserId?: string,
    modifierEmail?: string,
    ipAddress?: string,
    userAgent?: string
  ) {
    const existing = await prisma.employeeProfile.findFirst({
      where: { OR: [{ id }, { userId: id }] },
    });

    if (!existing) {
      throw new NotFoundError('Employee profile not found');
    }

    const updated = await prisma.employeeProfile.update({
      where: { id: existing.id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        gender: data.gender,
        address: data.address,
        department: data.department,
        designation: data.designation,
        employmentType: data.employmentType,
        reportingManagerId: data.reportingManagerId !== undefined ? data.reportingManagerId : undefined,
        emergencyContact: data.emergencyContact,
        avatarUrl: data.avatarUrl,
      },
    });

    await AuditService.log({
      userId: modifierUserId,
      userEmail: modifierEmail,
      action: 'EMPLOYEE_UPDATE',
      resourceType: 'EMPLOYEE',
      resourceId: updated.id,
      changesDiff: { before: existing, after: updated },
      ipAddress,
      userAgent,
    });

    return this.getEmployeeById(updated.id);
  }

  static async updateStatus(
    id: string,
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
    adminUserId: string,
    adminEmail: string
  ) {
    const profile = await prisma.employeeProfile.findFirst({
      where: { OR: [{ id }, { userId: id }] },
      include: { user: true },
    });

    if (!profile) {
      throw new NotFoundError('Employee not found');
    }

    const previousStatus = profile.user.status;

    await prisma.user.update({
      where: { id: profile.userId },
      data: { status },
    });

    if (status !== 'ACTIVE') {
      // Invalidate active sessions
      await prisma.refreshToken.updateMany({
        where: { userId: profile.userId },
        data: { revoked: true },
      });
    }

    await AuditService.log({
      userId: adminUserId,
      userEmail: adminEmail,
      action: 'EMPLOYEE_STATUS_CHANGE',
      resourceType: 'EMPLOYEE',
      resourceId: profile.id,
      changesDiff: { previousStatus, newStatus: status },
    });

    return { success: true, status };
  }
}
