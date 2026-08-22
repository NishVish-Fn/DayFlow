import { Router } from 'express';
import { AuditController } from '../controllers/audit.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRoles } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);
// Audit log viewing is restricted strictly to ADMIN
router.get('/', requireRoles(['ADMIN']), AuditController.getLogs);

export default router;
