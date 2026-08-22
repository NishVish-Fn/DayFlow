import { z } from 'zod';

export const checkInSchema = z.object({
  workMode: z.enum(['OFFICE', 'REMOTE', 'HYBRID']).default('OFFICE'),
  notes: z.string().max(255).optional(),
});

export const checkOutSchema = z.object({
  notes: z.string().max(255).optional(),
});

export const manualAttendanceSchema = z.object({
  employeeId: z.string().uuid('Valid employee profile ID required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'),
  checkInTime: z.string().optional().nullable(),
  checkOutTime: z.string().optional().nullable(),
  status: z.enum(['PRESENT', 'ABSENT', 'HALF_DAY', 'ON_LEAVE', 'HOLIDAY', 'WEEKEND']),
  workMode: z.enum(['OFFICE', 'REMOTE', 'HYBRID']).default('OFFICE'),
  notes: z.string().min(1, 'Reason/Note is mandatory for manual adjustments'),
});

export const attendanceQuerySchema = z.object({
  month: z.string().optional(),
  year: z.string().optional(),
  department: z.string().optional(),
  status: z.string().optional(),
  employeeId: z.string().optional(),
});
