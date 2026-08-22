import { Response, NextFunction } from 'express';
import { LeaveService } from '../services/leave.service';
import { AuthenticatedRequest } from '../types';
import { ValidationError } from '../utils/errors';

export class LeaveController {
  static async getTypes(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const types = await LeaveService.getLeaveTypes();
      res.json({ success: true, data: types });
    } catch (error) {
      next(error);
    }
  }

  static async getMyBalances(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.profileId) {
        throw new ValidationError('User has no linked employee profile');
      }

      const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;
      const balances = await LeaveService.getMyBalances(req.user.profileId, year);
      res.json({ success: true, data: balances });
    } catch (error) {
      next(error);
    }
  }

  static async getMyRequests(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.profileId) {
        throw new ValidationError('User has no linked employee profile');
      }

      const requests = await LeaveService.getMyRequests(req.user.profileId);
      res.json({ success: true, data: requests });
    } catch (error) {
      next(error);
    }
  }

  static async applyLeave(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.profileId) {
        throw new ValidationError('User has no linked employee profile');
      }

      const request = await LeaveService.applyLeave(req.user.profileId, req.body);
      res.status(201).json({
        success: true,
        data: request,
        message: 'Leave application submitted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async cancelRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.profileId) {
        throw new ValidationError('User has no linked employee profile');
      }

      const result = await LeaveService.cancelRequest(req.params.id, req.user.profileId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getAdminRequests(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { status, department, page, limit } = req.query;
      const result = await LeaveService.getAdminRequests({
        status: status as string,
        department: department as string,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      });

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { status, adminRemarks } = req.body;
      const result = await LeaveService.updateStatus(
        req.params.id,
        status,
        adminRemarks,
        req.user!.userId,
        req.user!.email
      );

      res.json({
        success: true,
        data: result,
        message: `Leave application status updated to ${status}`,
      });
    } catch (error) {
      next(error);
    }
  }
}
