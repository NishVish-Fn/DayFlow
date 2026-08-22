import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRoles } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

router.get('/employee', DashboardController.getEmployeeDashboard);
router.get('/admin', requireRoles(['ADMIN', 'HR_MANAGER']), DashboardController.getAdminDashboard);

export default router;
