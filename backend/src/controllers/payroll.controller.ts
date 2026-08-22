import { Response, NextFunction } from 'express';
import { PayrollService } from '../services/payroll.service';
import { AuthenticatedRequest } from '../types';
import { ValidationError } from '../utils/errors';

export class PayrollController {
  static async getStructures(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const structures = await PayrollService.getSalaryStructures(req.params.employeeId);
      res.json({ success: true, data: structures });
    } catch (error) {
      next(error);
    }
  }

  static async createStructure(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const created = await PayrollService.createSalaryStructure(
        req.params.employeeId,
        req.body,
        req.user!.userId,
        req.user!.email
      );

      res.status(201).json({
        success: true,
        data: created,
        message: 'New versioned salary structure created and activated',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMyPayslips(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.profileId) {
        throw new ValidationError('User has no linked employee profile');
      }

      const payslips = await PayrollService.getMyPayslips(req.user.profileId);
      res.json({ success: true, data: payslips });
    } catch (error) {
      next(error);
    }
  }

  static async getPayslips(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { month, year, department, status, page, limit } = req.query;
      const result = await PayrollService.getPayslips({
        month: month ? parseInt(month as string, 10) : undefined,
        year: year ? parseInt(year as string, 10) : undefined,
        department: department as string,
        status: status as string,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      });

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getPayslipById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const payslip = await PayrollService.getPayslipById(req.params.id);
      res.json({ success: true, data: payslip });
    } catch (error) {
      next(error);
    }
  }

  static async getPayslipPDF(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const html = await PayrollService.getPayslipPDF(req.params.id);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      if (req.query.download === 'true') {
        res.setHeader('Content-Disposition', `attachment; filename="Dayflow-Payslip-${req.params.id.slice(0, 8)}.html"`);
      }
      res.send(html);
    } catch (error) {
      next(error);
    }
  }

  static async generateBatch(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await PayrollService.generateBatchPayroll(
        req.body,
        req.user!.userId,
        req.user!.email
      );

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await PayrollService.updatePayrollStatus(
        req.params.id,
        req.body,
        req.user!.userId,
        req.user!.email
      );

      res.json({
        success: true,
        data: updated,
        message: 'Payroll status updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
