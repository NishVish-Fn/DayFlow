import { Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { AuthenticatedRequest } from '../types';
import { ValidationError } from '../utils/errors';

export class DashboardController {
  static async getEmployeeDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.profileId) {
        throw new ValidationError('User has no linked employee profile');
      }

      const summary = await DashboardService.getEmployeeDashboard(
        req.user.userId,
        req.user.profileId
      );

      res.json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  }

  static async getAdminDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const summary = await DashboardService.getAdminDashboard();
      res.json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  }
}
