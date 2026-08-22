import { prisma } from '../config/db';
import { logger } from '../utils/logger';

export interface CreateAuditLogParams {
  userId?: string | null;
  userEmail?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  changesDiff?: any;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export class AuditService {
  static async log(params: CreateAuditLogParams) {
    try {
      return await prisma.auditLog.create({
        data: {
          userId: params.userId,
          userEmail: params.userEmail,
          action: params.action,
          resourceType: params.resourceType,
          resourceId: params.resourceId,
          changesDiff: params.changesDiff ? JSON.stringify(params.changesDiff) : null,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
        },
      });
    } catch (error) {
      logger.error('Failed to persist audit log entry:', error);
      // Non-blocking for primary transaction unless strict compliance requested
      return null;
    }
  }

  static async getLogs(filters: {
    userId?: string;
    action?: string;
    resourceType?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = { contains: filters.action };
    if (filters.resourceType) where.resourceType = filters.resourceType;

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
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
      logs,
    };
  }
}
