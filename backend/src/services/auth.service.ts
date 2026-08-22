import bcrypt from 'bcryptjs';
import { prisma } from '../config/db';
import { config } from '../config';
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from '../utils/jwt';
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../utils/errors';
import { AuditService } from './audit.service';
import { TokenPayload, UserRole } from '../types';

export class AuthService {
  static async register(data: {
    email: string;
    employeeId: string;
    password: string;
    role?: 'ADMIN' | 'HR_MANAGER' | 'EMPLOYEE';
    firstName: string;
    lastName: string;
    department: string;
    designation: string;
  }, clientIp?: string, userAgent?: string) {
    // Check if user or badge ID already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { employeeId: data.employeeId }],
      },
    });

    if (existingUser) {
      if (existingUser.email === data.email) {
        throw new ConflictError('A user with this corporate email already exists.');
      }
      throw new ConflictError('A user with this Employee Badge ID already exists.');
    }

    const passwordHash = await bcrypt.hash(data.password, config.bcryptSaltRounds);
    const currentYear = new Date().getFullYear();

    // Fetch leave types to initialize default balances
    const leaveTypes = await prisma.leaveType.findMany();

    const user = await prisma.user.create({
      data: {
        email: data.email,
        employeeId: data.employeeId,
        passwordHash,
        role: data.role || 'EMPLOYEE',
        status: 'ACTIVE',
        isEmailVerified: true,
        profile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
            department: data.department,
            designation: data.designation,
            employmentType: 'FULL_TIME',
          },
        },
      },
      include: { profile: true },
    });

    // Create leave balances for the newly registered employee
    if (user.profile) {
      for (const lt of leaveTypes) {
        await prisma.leaveBalance.create({
          data: {
            employeeId: user.profile.id,
            leaveTypeId: lt.id,
            year: currentYear,
            totalAllocated: lt.maxDaysPerYear,
            usedDays: 0,
            pendingDays: 0,
            remainingDays: lt.maxDaysPerYear,
          },
        });
      }
    }

    await AuditService.log({
      userId: user.id,
      userEmail: user.email,
      action: 'AUTH_REGISTER',
      resourceType: 'USER',
      resourceId: user.id,
      changesDiff: { email: user.email, employeeId: user.employeeId, role: user.role },
      ipAddress: clientIp,
      userAgent,
    });

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
      employeeId: user.employeeId,
      profileId: user.profile?.id,
    };

    const accessToken = generateAccessToken(payload);
    const refreshTokenData = generateRefreshToken();

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshTokenData.tokenHash,
        expiresAt: refreshTokenData.expiresAt,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        employeeId: user.employeeId,
        role: user.role,
        status: user.status,
        profile: user.profile,
      },
      tokens: {
        accessToken,
        refreshToken: refreshTokenData.token,
      },
    };
  }

  static async login(identifier: string, password: string, clientIp?: string, userAgent?: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { employeeId: identifier }],
      },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email/badge ID or password.');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedError(`Account is ${user.status.toLowerCase()}. Please contact HR.`);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email/badge ID or password.');
    }

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
      employeeId: user.employeeId,
      profileId: user.profile?.id,
    };

    const accessToken = generateAccessToken(payload);
    const refreshTokenData = generateRefreshToken();

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshTokenData.tokenHash,
        expiresAt: refreshTokenData.expiresAt,
      },
    });

    await AuditService.log({
      userId: user.id,
      userEmail: user.email,
      action: 'AUTH_LOGIN',
      resourceType: 'AUTH',
      resourceId: user.id,
      ipAddress: clientIp,
      userAgent,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        employeeId: user.employeeId,
        role: user.role,
        status: user.status,
        profile: user.profile,
      },
      tokens: {
        accessToken,
        refreshToken: refreshTokenData.token,
      },
    };
  }

  static async refreshTokens(rawRefreshToken: string, clientIp?: string, userAgent?: string) {
    const incomingHash = hashRefreshToken(rawRefreshToken);

    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash: incomingHash },
      include: { user: { include: { profile: true } } },
    });

    if (!storedToken) {
      throw new UnauthorizedError('Invalid or unrecognized refresh token.');
    }

    // Reuse detection: if token is already revoked, potential breach!
    if (storedToken.revoked) {
      // Invalidate all active tokens for this user for security
      await prisma.refreshToken.updateMany({
        where: { userId: storedToken.userId },
        data: { revoked: true },
      });

      await AuditService.log({
        userId: storedToken.userId,
        userEmail: storedToken.user.email,
        action: 'SECURITY_TOKEN_REUSE_DETECTED',
        resourceType: 'AUTH',
        resourceId: storedToken.id,
        changesDiff: { warning: 'Revoked refresh token presented. All active sessions invalidated.' },
        ipAddress: clientIp,
        userAgent,
      });

      throw new UnauthorizedError('Security breach detected: Revoked token presented. Sessions cleared.');
    }

    if (new Date() > storedToken.expiresAt) {
      await prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revoked: true },
      });
      throw new UnauthorizedError('Refresh token expired. Please log in again.');
    }

    // Token Rotation: Issue new tokens and revoke old one
    const newRefreshTokenData = generateRefreshToken();

    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: {
          revoked: true,
          replacedByToken: newRefreshTokenData.tokenHash,
        },
      }),
      prisma.refreshToken.create({
        data: {
          userId: storedToken.userId,
          tokenHash: newRefreshTokenData.tokenHash,
          expiresAt: newRefreshTokenData.expiresAt,
        },
      }),
    ]);

    const payload: TokenPayload = {
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role as UserRole,
      employeeId: storedToken.user.employeeId,
      profileId: storedToken.user.profile?.id,
    };

    const newAccessToken = generateAccessToken(payload);

    return {
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshTokenData.token,
      },
    };
  }

  static async logout(rawRefreshToken?: string, userId?: string) {
    if (rawRefreshToken) {
      const incomingHash = hashRefreshToken(rawRefreshToken);
      await prisma.refreshToken.updateMany({
        where: { tokenHash: incomingHash },
        data: { revoked: true },
      });
    } else if (userId) {
      await prisma.refreshToken.updateMany({
        where: { userId, revoked: false },
        data: { revoked: true },
      });
    }
    return { success: true };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            reportingManager: {
              include: { user: { select: { email: true } } },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User account not found');
    }

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  static async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isMatch = await bcrypt.compare(currentPass, user.passwordHash);
    if (!isMatch) {
      throw new ValidationError('Current password is incorrect');
    }

    const newHash = await bcrypt.hash(newPass, config.bcryptSaltRounds);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    // Invalidate old refresh tokens
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true },
    });

    return { success: true };
  }
}
