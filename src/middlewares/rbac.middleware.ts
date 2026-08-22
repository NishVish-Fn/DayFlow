import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserRole } from '../types';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';

/**
 * Restricts endpoint to specific user roles.
 */
export const requireRoles = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(`Forbidden: Requires one of [${allowedRoles.join(', ')}] role privileges`)
      );
    }

    next();
  };
};

/**
 * Allows access if user is Admin/HR, or if accessing their own resource (by employeeProfile ID or userId).
 */
export const requireSelfOrRoles = (
  getTargetId: (req: AuthenticatedRequest) => string | undefined,
  allowedElevatedRoles: UserRole[] = ['ADMIN', 'HR_MANAGER']
) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    const targetId = getTargetId(req);
    const isSelf =
      targetId &&
      (req.user.userId === targetId ||
        req.user.profileId === targetId ||
        req.user.employeeId === targetId);

    const hasElevatedRole = allowedElevatedRoles.includes(req.user.role);

    if (isSelf || hasElevatedRole) {
      return next();
    }

    return next(new ForbiddenError('Forbidden: You do not have permission to access or modify this resource'));
  };
};
