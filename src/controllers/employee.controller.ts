import { Response, NextFunction } from 'express';
import { EmployeeService } from '../services/employee.service';
import { AuthenticatedRequest } from '../types';

export class EmployeeController {
  static async getEmployees(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { department, status, role, search, page, limit } = req.query;
      const result = await EmployeeService.getEmployees({
        department: department as string,
        status: status as string,
        role: role as string,
        search: search as string,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      });

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getEmployeeById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const profile = await EmployeeService.getEmployeeById(req.params.id);
      res.json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  }

  static async createEmployee(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const created = await EmployeeService.createEmployee(
        req.body,
        req.user?.userId,
        req.user?.email,
        req.ip,
        req.headers['user-agent']
      );

      res.status(201).json({
        success: true,
        data: created,
        message: 'Employee created and onboarded successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateEmployee(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await EmployeeService.updateEmployee(
        req.params.id,
        req.body,
        req.user?.userId,
        req.user?.email,
        req.ip,
        req.headers['user-agent']
      );

      res.json({
        success: true,
        data: updated,
        message: 'Employee profile updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await EmployeeService.updateStatus(
        req.params.id,
        req.body.status,
        req.user!.userId,
        req.user!.email
      );

      res.json({
        success: true,
        data: result,
        message: `Employee account status updated to ${req.body.status}`,
      });
    } catch (error) {
      next(error);
    }
  }
}
