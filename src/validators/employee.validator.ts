import { z } from 'zod';

export const createEmployeeSchema = z.object({
  email: z.string().email('Invalid email format'),
  employeeId: z.string().min(3, 'Employee badge ID must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  role: z.enum(['ADMIN', 'HR_MANAGER', 'EMPLOYEE']).default('EMPLOYEE'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  department: z.enum([
    'ENGINEERING',
    'PRODUCT',
    'DESIGN',
    'HUMAN_RESOURCES',
    'MARKETING',
    'SALES',
    'FINANCE',
    'OPERATIONS',
  ]),
  designation: z.string().min(1, 'Designation is required'),
  dateOfJoining: z.string().optional(),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN']).default('FULL_TIME'),
  reportingManagerId: z.string().uuid().optional().nullable(),
  emergencyContact: z.string().optional(),
  avatarUrl: z.string().url().optional().nullable(),
  baseSalary: z.number().positive('Base salary must be positive').optional(),
  hra: z.number().nonnegative().optional(),
  allowances: z.number().nonnegative().optional(),
  deductions: z.number().nonnegative().optional(),
});

export const updateEmployeeSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  department: z
    .enum([
      'ENGINEERING',
      'PRODUCT',
      'DESIGN',
      'HUMAN_RESOURCES',
      'MARKETING',
      'SALES',
      'FINANCE',
      'OPERATIONS',
    ])
    .optional(),
  designation: z.string().min(1).optional(),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN']).optional(),
  reportingManagerId: z.string().uuid().optional().nullable(),
  emergencyContact: z.string().optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
});

export const updateEmployeeStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
  reason: z.string().optional(),
});
