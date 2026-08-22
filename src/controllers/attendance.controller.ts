import { Response, NextFunction } from 'express';
import { AttendanceService } from '../services/attendance.service';
import { AuthenticatedRequest } from '../types';
import { ValidationError } from '../utils/errors';

export class AttendanceController {
  static async checkIn(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.profileId) {
        throw new ValidationError('User has no linked employee profile');
      }

      const result = await AttendanceService.checkIn(
        req.user.profileId,
        req.body,
        req.ip
      );

      res.status(201).json({
        success: true,
        data: result,
        message: 'Checked in successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async checkOut(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.profileId) {
        throw new ValidationError('User has no linked employee profile');
      }

      const result = await AttendanceService.checkOut(req.user.profileId, req.body);

      res.json({
        success: true,
        data: result,
        message: 'Checked out successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getToday(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.profileId) {
        throw new ValidationError('User has no linked employee profile');
      }

      const result = await AttendanceService.getTodayStatus(req.user.profileId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getMyHistory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.profileId) {
        throw new ValidationError('User has no linked employee profile');
      }

      const month = req.query.month ? parseInt(req.query.month as string, 10) : undefined;
      const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;

      const result = await AttendanceService.getMyHistory(req.user.profileId, month, year);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getTeamAttendance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { date, department, status } = req.query;
      const result = await AttendanceService.getTeamAttendance({
        date: date as string,
        department: department as string,
        status: status as string,
      });

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async manualEntry(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await AttendanceService.manualEntry(
        req.body,
        req.user!.userId,
        req.user!.email,
        req.ip
      );

      res.json({
        success: true,
        data: result,
        message: 'Manual attendance adjustment saved with audit log',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const analytics = await AttendanceService.getAnalytics();
      res.json({ success: true, data: analytics });
    } catch (error) {
      next(error);
    }
  }
}
