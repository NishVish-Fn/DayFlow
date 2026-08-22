import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRoles, requireSelfOrRoles } from '../middlewares/rbac.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  updateEmployeeStatusSchema,
} from '../validators/employee.validator';

const router = Router();

// All employee routes require authentication
router.use(authenticate);

router.get('/', EmployeeController.getEmployees);

router.post(
  '/',
  requireRoles(['ADMIN', 'HR_MANAGER']),
  validateRequest({ body: createEmployeeSchema }),
  EmployeeController.createEmployee
);

router.get(
  '/:id',
  requireSelfOrRoles((req) => req.params.id),
  EmployeeController.getEmployeeById
);

router.put(
  '/:id',
  requireSelfOrRoles((req) => req.params.id),
  validateRequest({ body: updateEmployeeSchema }),
  EmployeeController.updateEmployee
);

router.patch(
  '/:id/status',
  requireRoles(['ADMIN', 'HR_MANAGER']),
  validateRequest({ body: updateEmployeeStatusSchema }),
  EmployeeController.updateStatus
);

export default router;
