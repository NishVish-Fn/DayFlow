import { Router } from 'express';
import { LeaveController } from '../controllers/leave.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRoles } from '../middlewares/rbac.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  applyLeaveSchema,
  updateLeaveStatusSchema,
} from '../validators/leave.validator';

const router = Router();

router.use(authenticate);

router.get('/types', LeaveController.getTypes);
router.get('/my-balances', LeaveController.getMyBalances);
router.get('/my-requests', LeaveController.getMyRequests);
router.post(
  '/requests',
  validateRequest({ body: applyLeaveSchema }),
  LeaveController.applyLeave
);
router.delete('/requests/:id', LeaveController.cancelRequest);

// Admin & HR managerial approval routes
router.get(
  '/admin/requests',
  requireRoles(['ADMIN', 'HR_MANAGER']),
  LeaveController.getAdminRequests
);
router.patch(
  '/admin/requests/:id/status',
  requireRoles(['ADMIN', 'HR_MANAGER']),
  validateRequest({ body: updateLeaveStatusSchema }),
  LeaveController.updateStatus
);

export default router;
