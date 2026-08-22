import { Router } from 'express';
import { PayrollController } from '../controllers/payroll.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRoles, requireSelfOrRoles } from '../middlewares/rbac.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  createSalaryStructureSchema,
  generateBatchPayrollSchema,
  updatePayrollStatusSchema,
} from '../validators/payroll.validator';

const router = Router();

router.use(authenticate);

// Employee payslips
router.get('/my-payslips', PayrollController.getMyPayslips);

// Salary structure version history (Self or Admin/HR)
router.get(
  '/structures/:employeeId',
  requireSelfOrRoles((req) => req.params.employeeId),
  PayrollController.getStructures
);

// Create new versioned salary structure (Admin/HR only)
router.post(
  '/structures/:employeeId',
  requireRoles(['ADMIN', 'HR_MANAGER']),
  validateRequest({ body: createSalaryStructureSchema }),
  PayrollController.createStructure
);

// Admin/HR payslips query & batch generation
router.get(
  '/payslips',
  requireRoles(['ADMIN', 'HR_MANAGER']),
  PayrollController.getPayslips
);

router.post(
  '/generate-batch',
  requireRoles(['ADMIN', 'HR_MANAGER']),
  validateRequest({ body: generateBatchPayrollSchema }),
  PayrollController.generateBatch
);

// Payslip details and printable HTML/PDF
router.get(
  '/payslips/:id',
  PayrollController.getPayslipById
);

router.get(
  '/payslips/:id/pdf',
  PayrollController.getPayslipPDF
);

router.patch(
  '/payslips/:id/status',
  requireRoles(['ADMIN', 'HR_MANAGER']),
  validateRequest({ body: updatePayrollStatusSchema }),
  PayrollController.updateStatus
);

export default router;
