import { Request } from 'express';

export type UserRole = 'ADMIN' | 'HR_MANAGER' | 'EMPLOYEE';
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  employeeId: string;
  profileId?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}
