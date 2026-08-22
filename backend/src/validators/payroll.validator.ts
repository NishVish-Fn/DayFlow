import { z } from 'zod';

export const createSalaryStructureSchema = z.object({
  effectiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD').optional(),
  baseSalary: z.number().positive('Base salary must be greater than 0'),
  hra: z.number().nonnegative('HRA cannot be negative').default(0),
  allowances: z.number().nonnegative('Allowances cannot be negative').default(0),
  deductions: z.number().nonnegative('Deductions cannot be negative').default(0),
  currency: z.string().default('USD'),
  remarks: z.string().optional(),
});

export const generateBatchPayrollSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2020).max(2035),
  department: z.string().optional(),
  notes: z.string().optional(),
});

export const updatePayrollStatusSchema = z.object({
  status: z.enum(['DRAFT', 'PROCESSED', 'PAID']),
  transactionReference: z.string().optional(),
  paymentDate: z.string().optional(),
});
