import { prisma } from '../config/db';
import { ConflictError, NotFoundError, ValidationError } from '../utils/errors';
import { AuditService } from './audit.service';
import { NotificationService } from './notification.service';

export class LeaveService {
  static async getLeaveTypes() {
    return prisma.leaveType.findMany({
      orderBy: { name: 'asc' },
    });
  }

  static async getMyBalances(employeeId: string, year?: number) {
    const targetYear = year || new Date().getFullYear();

    const balances = await prisma.leaveBalance.findMany({
      where: {
        employeeId,
        year: targetYear,
      },
      include: {
        leaveType: true,
      },
      orderBy: { leaveType: { name: 'asc' } },
    });

    return balances;
  }

  static async getMyRequests(employeeId: string) {
    return prisma.leaveRequest.findMany({
      where: { employeeId },
      include: { leaveType: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async applyLeave(
    employeeId: string,
    data: {
      leaveTypeId: string;
      startDate: string;
      endDate: string;
      reason: string;
    }
  ) {
    const start = new Date(data.startDate);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(data.endDate);
    end.setUTCHours(0, 0, 0, 0);

    if (end < start) {
      throw new ValidationError('End date cannot be prior to start date');
    }

    const currentYear = start.getFullYear();

    // Calculate duration in days (inclusive)
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // 1. Check for overlapping requests
    const overlapping = await prisma.leaveRequest.findFirst({
      where: {
        employeeId,
        status: { in: ['PENDING', 'APPROVED'] },
        OR: [
          {
            startDate: { lte: end },
            endDate: { gte: start },
          },
        ],
      },
    });

    if (overlapping) {
      throw new ConflictError(
        `You already have an active or pending leave application covering dates within this period (${overlapping.startDate.toISOString().slice(0, 10)} to ${overlapping.endDate.toISOString().slice(0, 10)}).`
      );
    }

    // 2. Fetch and check leave balance
    let balance = await prisma.leaveBalance.findUnique({
      where: {
        employeeId_leaveTypeId_year: {
          employeeId,
          leaveTypeId: data.leaveTypeId,
          year: currentYear,
        },
      },
      include: { leaveType: true },
    });

    if (!balance) {
      // Auto initialize if missing
      const lt = await prisma.leaveType.findUnique({ where: { id: data.leaveTypeId } });
      if (!lt) throw new NotFoundError('Leave type does not exist');

      balance = await prisma.leaveBalance.create({
        data: {
          employeeId,
          leaveTypeId: data.leaveTypeId,
          year: currentYear,
          totalAllocated: lt.maxDaysPerYear,
          usedDays: 0,
          pendingDays: 0,
          remainingDays: lt.maxDaysPerYear,
        },
        include: { leaveType: true },
      });
    }

    if (balance.remainingDays < totalDays) {
      throw new ValidationError(
        `Insufficient leave balance. You requested ${totalDays} day(s), but have only ${balance.remainingDays} remaining day(s) for ${balance.leaveType.name}.`
      );
    }

    // 3. Create request and reserve quota in transaction
    const newRequest = await prisma.$transaction(async (tx) => {
      // Deduct from remaining and add to pending
      await tx.leaveBalance.update({
        where: { id: balance.id },
        data: {
          pendingDays: balance.pendingDays + totalDays,
          remainingDays: balance.remainingDays - totalDays,
        },
      });

      return tx.leaveRequest.create({
        data: {
          employeeId,
          leaveTypeId: data.leaveTypeId,
          startDate: start,
          endDate: end,
          totalDays,
          reason: data.reason,
          status: 'PENDING',
        },
        include: {
          leaveType: true,
          employee: {
            include: { user: true },
          },
        },
      });
    });

    // Notify HR / Admins
    const hrUsers = await prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'HR_MANAGER'] } },
    });

    for (const hr of hrUsers) {
      await NotificationService.sendNotification({
        userId: hr.id,
        title: 'New Leave Application',
        message: `${newRequest.employee.firstName} ${newRequest.employee.lastName} applied for ${totalDays} day(s) of ${newRequest.leaveType.name}.`,
        type: 'ACTION_REQUIRED',
        linkUrl: '/admin/leave-approvals',
      });
    }

    return newRequest;
  }

  static async cancelRequest(requestId: string, employeeId: string) {
    const request = await prisma.leaveRequest.findUnique({
      where: { id: requestId },
      include: { employee: true },
    });

    if (!request) {
      throw new NotFoundError('Leave request not found');
    }

    if (request.employeeId !== employeeId) {
      throw new ValidationError('You can only cancel your own leave requests');
    }

    if (request.status !== 'PENDING') {
      throw new ValidationError(`Cannot cancel a leave request with status '${request.status}'`);
    }

    const currentYear = request.startDate.getFullYear();

    await prisma.$transaction(async (tx) => {
      await tx.leaveRequest.update({
        where: { id: requestId },
        data: { status: 'CANCELLED' },
      });

      // Restore quota
      const balance = await tx.leaveBalance.findUnique({
        where: {
          employeeId_leaveTypeId_year: {
            employeeId,
            leaveTypeId: request.leaveTypeId,
            year: currentYear,
          },
        },
      });

      if (balance) {
        await tx.leaveBalance.update({
          where: { id: balance.id },
          data: {
            pendingDays: Math.max(0, balance.pendingDays - request.totalDays),
            remainingDays: balance.remainingDays + request.totalDays,
          },
        });
      }
    });

    return { success: true, message: 'Leave request cancelled and quota restored.' };
  }

  static async getAdminRequests(filters: {
    status?: string;
    department?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.status && filters.status !== 'ALL') {
      where.status = filters.status;
    }
    if (filters.department && filters.department !== 'ALL') {
      where.employee = { department: filters.department };
    }

    const [total, requests] = await Promise.all([
      prisma.leaveRequest.count({ where }),
      prisma.leaveRequest.findMany({
        where,
        include: {
          leaveType: true,
          employee: {
            include: {
              user: { select: { employeeId: true, email: true } },
            },
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
      requests,
    };
  }

  static async updateStatus(
    requestId: string,
    status: 'APPROVED' | 'REJECTED',
    adminRemarks: string | undefined,
    adminUserId: string,
    adminEmail: string
  ) {
    const request = await prisma.leaveRequest.findUnique({
      where: { id: requestId },
      include: {
        leaveType: true,
        employee: { include: { user: true } },
      },
    });

    if (!request) {
      throw new NotFoundError('Leave request not found');
    }

    if (request.status !== 'PENDING') {
      throw new ValidationError(`This request has already been reviewed (${request.status}).`);
    }

    const currentYear = request.startDate.getFullYear();

    await prisma.$transaction(async (tx) => {
      // 1. Update Request
      await tx.leaveRequest.update({
        where: { id: requestId },
        data: {
          status,
          adminRemarks: adminRemarks || null,
          approvedById: adminUserId,
          reviewedAt: new Date(),
        },
      });

      const balance = await tx.leaveBalance.findUnique({
        where: {
          employeeId_leaveTypeId_year: {
            employeeId: request.employeeId,
            leaveTypeId: request.leaveTypeId,
            year: currentYear,
          },
        },
      });

      if (balance) {
        if (status === 'APPROVED') {
          // Transfer from pending to used
          await tx.leaveBalance.update({
            where: { id: balance.id },
            data: {
              pendingDays: Math.max(0, balance.pendingDays - request.totalDays),
              usedDays: balance.usedDays + request.totalDays,
            },
          });

          // Auto-mark attendance records as ON_LEAVE for all days in range
          const curr = new Date(request.startDate);
          while (curr <= request.endDate) {
            const dayOfWeek = curr.getUTCDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
              const dayDate = new Date(curr);
              dayDate.setUTCHours(0, 0, 0, 0);

              await tx.attendanceRecord.upsert({
                where: {
                  employeeId_date: {
                    employeeId: request.employeeId,
                    date: dayDate,
                  },
                },
                create: {
                  employeeId: request.employeeId,
                  date: dayDate,
                  status: 'ON_LEAVE',
                  workMode: 'OFFICE',
                  notes: `Approved ${request.leaveType.name}`,
                  totalHours: 0,
                },
                update: {
                  status: 'ON_LEAVE',
                  notes: `Approved ${request.leaveType.name}`,
                },
              });
            }
            curr.setUTCDate(curr.getUTCDate() + 1);
          }
        } else if (status === 'REJECTED') {
          // Restore pending days back to remaining
          await tx.leaveBalance.update({
            where: { id: balance.id },
            data: {
              pendingDays: Math.max(0, balance.pendingDays - request.totalDays),
              remainingDays: balance.remainingDays + request.totalDays,
            },
          });
        }
      }
    });

    // Send In-App Notification to employee
    await NotificationService.sendNotification({
      userId: request.employee.userId,
      title: `Leave Request ${status}`,
      message: `Your ${request.leaveType.name} request for ${request.startDate.toISOString().slice(0, 10)} to ${request.endDate.toISOString().slice(0, 10)} was ${status.toLowerCase()}.${adminRemarks ? ` Note: "${adminRemarks}"` : ''}`,
      type: status === 'APPROVED' ? 'SUCCESS' : 'WARNING',
      linkUrl: '/leave',
    });

    await AuditService.log({
      userId: adminUserId,
      userEmail: adminEmail,
      action: `LEAVE_${status}`,
      resourceType: 'LEAVE',
      resourceId: request.id,
      changesDiff: {
        employee: `${request.employee.firstName} ${request.employee.lastName}`,
        leaveType: request.leaveType.name,
        days: request.totalDays,
        status,
        remarks: adminRemarks,
      },
    });

    return { success: true, status };
  }
}
