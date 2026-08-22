import { Response, NextFunction } from 'express';
import { AuditService } from '../services/audit.service';
import { AuthenticatedRequest } from '../types';

export class AuditController {
  static async getLogs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { userId, action, resourceType, page, limit } = req.query;
      const result = await AuditService.getLogs({
        userId: userId as string,
        action: action as string,
        resourceType: resourceType as string,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      });

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
