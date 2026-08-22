import { z } from 'zod';

export const applyLeaveSchema = z.object({
  leaveTypeId: z.string().uuid('Valid leave type ID is required'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be formatted as YYYY-MM-DD'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be formatted as YYYY-MM-DD'),
  reason: z.string().min(5, 'Reason must be at least 5 characters long'),
});

export const updateLeaveStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  adminRemarks: z.string().optional(),
});
