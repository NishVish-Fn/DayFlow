import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRoles } from '../middlewares/rbac.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  checkInSchema,
  checkOutSchema,
  manualAttendanceSchema,
} from '../validators/attendance.validator';

const router = Router();

router.use(authenticate);

router.post('/check-in', validateRequest({ body: checkInSchema }), AttendanceController.checkIn);
router.post('/check-out', validateRequest({ body: checkOutSchema }), AttendanceController.checkOut);
router.get('/today', AttendanceController.getToday);
router.get('/my-history', AttendanceController.getMyHistory);

// Admin/HR endpoints
router.get('/team', requireRoles(['ADMIN', 'HR_MANAGER']), AttendanceController.getTeamAttendance);
router.post(
  '/manual-entry',
  requireRoles(['ADMIN', 'HR_MANAGER']),
  validateRequest({ body: manualAttendanceSchema }),
  AttendanceController.manualEntry
);
router.get('/analytics', requireRoles(['ADMIN', 'HR_MANAGER']), AttendanceController.getAnalytics);

export default router;
