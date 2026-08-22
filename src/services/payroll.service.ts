import { prisma } from '../config/db';
import { ConflictError, NotFoundError, ValidationError } from '../utils/errors';
import { AuditService } from './audit.service';
import { NotificationService } from './notification.service';
import { generatePayslipHTML } from '../utils/pdfGenerator';

export class PayrollService {
  static async getSalaryStructures(employeeId: string) {
    return prisma.salaryStructure.findMany({
      where: { employeeId },
      orderBy: { effectiveDate: 'desc' },
    });
  }

  static async createSalaryStructure(
    employeeId: string,
    data: {
      effectiveDate?: string;
      baseSalary: number;
      hra: number;
      allowances: number;
      deductions: number;
      currency?: string;
      remarks?: string;
    },
    adminUserId: string,
    adminEmail: string
  ) {
    const profile = await prisma.employeeProfile.findUnique({
      where: { id: employeeId },
      include: { user: true },
    });

    if (!profile) {
      throw new NotFoundError('Employee profile not found');
    }

    const gross = data.baseSalary + (data.hra || 0) + (data.allowances || 0);
    const net = gross - (data.deductions || 0);

    const result = await prisma.$transaction(async (tx) => {
      // Archive previous active structures
      const previousActive = await tx.salaryStructure.findFirst({
        where: { employeeId, isCurrent: true },
      });

      if (previousActive) {
        await tx.salaryStructure.update({
          where: { id: previousActive.id },
          data: { isCurrent: false },
        });
      }

      const newStructure = await tx.salaryStructure.create({
        data: {
          employeeId,
          effectiveDate: data.effectiveDate ? new Date(data.effectiveDate) : new Date(),
          baseSalary: data.baseSalary,
          hra: data.hra || 0,
          allowances: data.allowances || 0,
          deductions: data.deductions || 0,
          grossSalary: gross,
          netSalary: net,
          isCurrent: true,
          currency: data.currency || 'USD',
          remarks: data.remarks,
          createdById: adminUserId,
        },
      });

      return { previousActive, newStructure };
    });

    await AuditService.log({
      userId: adminUserId,
      userEmail: adminEmail,
      action: 'SALARY_STRUCTURE_REVISED',
      resourceType: 'PAYROLL',
      resourceId: result.newStructure.id,
      changesDiff: {
        employee: `${profile.firstName} ${profile.lastName}`,
        previousGross: result.previousActive?.grossSalary || 0,
        newGross: result.newStructure.grossSalary,
        previousNet: result.previousActive?.netSalary || 0,
        newNet: result.newStructure.netSalary,
        remarks: data.remarks,
      },
    });

    return result.newStructure;
  }

  static async getMyPayslips(employeeId: string) {
    return prisma.payrollRecord.findMany({
      where: { employeeId },
      include: { salaryStructure: true },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }

  static async getPayslips(filters: {
    month?: number;
    year?: number;
    department?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.month) where.month = filters.month;
    if (filters.year) where.year = filters.year;
    if (filters.status && filters.status !== 'ALL') where.status = filters.status;
    if (filters.department && filters.department !== 'ALL') {
      where.employee = { department: filters.department };
    }

    const [total, payslips] = await Promise.all([
      prisma.payrollRecord.count({ where }),
      prisma.payrollRecord.findMany({
        where,
        include: {
          employee: {
            include: { user: { select: { employeeId: true, email: true } } },
          },
          salaryStructure: true,
        },
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
        skip,
        take: limit,
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      payslips,
    };
  }

  static async getPayslipById(id: string) {
    const record = await prisma.payrollRecord.findUnique({
      where: { id },
      include: {
        employee: {
          include: { user: { select: { employeeId: true, email: true } } },
        },
        salaryStructure: true,
      },
    });

    if (!record) {
      throw new NotFoundError('Payslip record not found');
    }

    return record;
  }

  static async getPayslipPDF(id: string) {
    const record = await this.getPayslipById(id);

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    const allowances = record.allowancesBreakdown
      ? JSON.parse(record.allowancesBreakdown)
      : { transport: record.salaryStructure.allowances * 0.5, bonus: record.salaryStructure.allowances * 0.5 };

    const deductions = record.deductionsBreakdown
      ? JSON.parse(record.deductionsBreakdown)
      : { incomeTax: record.salaryStructure.deductions * 0.7, pf: record.salaryStructure.deductions * 0.3 };

    return generatePayslipHTML({
      companyName: 'DAYFLOW ENTERPRISE HRMS',
      companyAddress: '100 Innovation Way, Suite 400, San Francisco, CA 94107',
      payslipId: record.id.slice(0, 8).toUpperCase(),
      employeeName: `${record.employee.firstName} ${record.employee.lastName}`,
      employeeId: record.employee.user.employeeId,
      designation: record.employee.designation,
      department: record.employee.department,
      monthYear: `${monthNames[record.month - 1]} ${record.year}`,
      paymentDate: record.paymentDate ? record.paymentDate.toISOString().slice(0, 10) : 'Pending Disbursement',
      transactionRef: record.transactionReference || `TXN-${record.id.slice(0, 6).toUpperCase()}`,
      baseAmount: record.baseAmount,
      hraAmount: record.hraAmount,
      allowances,
      deductions,
      grossAmount: record.grossAmount,
      netAmount: record.netAmount,
    });
  }

  static async generateBatchPayroll(
    data: {
      month: number;
      year: number;
      department?: string;
      notes?: string;
    },
    adminUserId: string,
    adminEmail: string
  ) {
    // 1. Fetch active employees who have a current salary structure
    const where: any = {
      user: { status: 'ACTIVE' },
    };

    if (data.department && data.department !== 'ALL') {
      where.department = data.department;
    }

    const employees = await prisma.employeeProfile.findMany({
      where,
      include: {
        salaryStructures: {
          where: { isCurrent: true },
          take: 1,
        },
        user: true,
      },
    });

    if (employees.length === 0) {
      throw new ValidationError('No active employees found matching criteria');
    }

    let createdCount = 0;
    let skippedCount = 0;

    for (const emp of employees) {
      const activeStructure = emp.salaryStructures[0];
      if (!activeStructure) {
        skippedCount++;
        continue;
      }

      // Check if payslip already exists for this cycle
      const existing = await prisma.payrollRecord.findUnique({
        where: {
          employeeId_month_year: {
            employeeId: emp.id,
            month: data.month,
            year: data.year,
          },
        },
      });

      if (existing) {
        skippedCount++;
        continue;
      }

      const gross = activeStructure.grossSalary;
      const net = activeStructure.netSalary;

      await prisma.payrollRecord.create({
        data: {
          employeeId: emp.id,
          salaryStructureId: activeStructure.id,
          month: data.month,
          year: data.year,
          paymentDate: new Date(),
          baseAmount: activeStructure.baseSalary,
          hraAmount: activeStructure.hra,
          allowancesBreakdown: JSON.stringify({
            transport: activeStructure.allowances * 0.4,
            wellness: activeStructure.allowances * 0.3,
            special: activeStructure.allowances * 0.3,
          }),
          deductionsBreakdown: JSON.stringify({
            incomeTax: activeStructure.deductions * 0.7,
            socialSecurityPF: activeStructure.deductions * 0.25,
            insurance: activeStructure.deductions * 0.05,
          }),
          grossAmount: gross,
          netAmount: net,
          status: 'PAID',
          transactionReference: `ACH-DAYFLOW-${data.year}${String(data.month).padStart(2, '0')}-${emp.id.slice(0, 6).toUpperCase()}`,
          notes: data.notes || 'Automated monthly batch payroll generation.',
        },
      });

      // Send In-App notification to employee
      await NotificationService.sendNotification({
        userId: emp.userId,
        title: 'Monthly Payslip Disbursed',
        message: `Your payslip for ${data.month}/${data.year} ($${net.toLocaleString()}) has been generated and disbursed.`,
        type: 'SUCCESS',
        linkUrl: '/payroll',
      });

      createdCount++;
    }

    await AuditService.log({
      userId: adminUserId,
      userEmail: adminEmail,
      action: 'BATCH_PAYROLL_GENERATED',
      resourceType: 'PAYROLL',
      changesDiff: {
        month: data.month,
        year: data.year,
        createdCount,
        skippedCount,
      },
    });

    return {
      message: `Batch payroll run completed. ${createdCount} payslip(s) generated, ${skippedCount} skipped (already existing or missing salary setup).`,
      createdCount,
      skippedCount,
    };
  }

  static async updatePayrollStatus(
    id: string,
    data: { status: string; transactionReference?: string; paymentDate?: string },
    adminUserId: string,
    adminEmail: string
  ) {
    const existing = await prisma.payrollRecord.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Payroll record not found');
    }

    const updated = await prisma.payrollRecord.update({
      where: { id },
      data: {
        status: data.status,
        transactionReference: data.transactionReference || existing.transactionReference,
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : existing.paymentDate,
      },
    });

    await AuditService.log({
      userId: adminUserId,
      userEmail: adminEmail,
      action: 'PAYROLL_STATUS_UPDATE',
      resourceType: 'PAYROLL',
      resourceId: id,
      changesDiff: { before: existing.status, after: data.status },
    });

    return updated;
  }
}
