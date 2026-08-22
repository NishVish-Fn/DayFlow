import { prisma } from '../config/db';
import { AttendanceService } from './attendance.service';

export class DashboardService {
  static async getEmployeeDashboard(userId: string, employeeId: string) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const [todayAttendance, balances, recentPayslips, notifications] = await Promise.all([
      AttendanceService.getTodayStatus(employeeId),
      prisma.leaveBalance.findMany({
        where: { employeeId, year: today.getFullYear() },
        include: { leaveType: true },
      }),
      prisma.payrollRecord.findMany({
        where: { employeeId },
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
        take: 3,
      }),
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    return {
      todayAttendance,
      leaveBalances: balances,
      recentPayslips,
      notifications,
      holidays: [
        { name: 'Memorial Day', date: '2026-05-25' },
        { name: 'Independence Day', date: '2026-07-04' },
        { name: 'Labor Day', date: '2026-09-07' },
        { name: 'Thanksgiving Day', date: '2026-11-26' },
      ],
    };
  }

  static async getAdminDashboard() {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const [
      totalEmployees,
      departmentCounts,
      attendanceSummary,
      pendingLeavesCount,
      activeSalaries,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.employeeProfile.count({ where: { user: { status: 'ACTIVE' } } }),
      prisma.employeeProfile.groupBy({
        by: ['department'],
        _count: { id: true },
        where: { user: { status: 'ACTIVE' } },
      }),
      AttendanceService.getAnalytics(),
      prisma.leaveRequest.count({ where: { status: 'PENDING' } }),
      prisma.salaryStructure.findMany({
        where: { isCurrent: true, employee: { user: { status: 'ACTIVE' } } },
        select: { grossSalary: true, netSalary: true },
      }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
      }),
    ]);

    const totalMonthlyPayrollGross = activeSalaries.reduce((sum, s) => sum + s.grossSalary, 0);
    const totalMonthlyPayrollNet = activeSalaries.reduce((sum, s) => sum + s.netSalary, 0);

    return {
      headcount: totalEmployees,
      departmentBreakdown: departmentCounts.map((d) => ({
        department: d.department,
        count: d._count.id,
      })),
      attendance: attendanceSummary,
      pendingLeaveApprovals: pendingLeavesCount,
      payrollMetrics: {
        totalMonthlyGross: totalMonthlyPayrollGross,
        totalMonthlyNet: totalMonthlyPayrollNet,
        activePayees: activeSalaries.length,
      },
      recentActivity: recentAuditLogs,
    };
  }
}
