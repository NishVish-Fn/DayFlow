import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/config/db';

const app = createApp();

let adminToken: string;
let employeeToken: string;
let employeeProfileId: string;
let ptoLeaveTypeId: string;

describe('💼 Business Logic & Workflow Suite', () => {
  beforeAll(async () => {
    await prisma.$connect();

    // Clean up any previous test leave requests
    await prisma.leaveRequest.deleteMany({
      where: {
        reason: {
          contains: 'Quarterly decompression',
        },
      },
    });

    // Login Admin
    const adminLogin = await request(app).post('/api/v1/auth/login').send({
      identifier: 'admin@dayflow.internal',
      password: 'Password@123',
    });
    adminToken = adminLogin.body.data.tokens.accessToken;

    // Login Employee
    const empLogin = await request(app).post('/api/v1/auth/login').send({
      identifier: 'alex.chen@dayflow.internal',
      password: 'Password@123',
    });
    employeeToken = empLogin.body.data.tokens.accessToken;
    employeeProfileId = empLogin.body.data.user.profile.id;

    // Reset leave balance for testing
    await prisma.leaveBalance.updateMany({
      where: { employeeId: employeeProfileId },
      data: { pendingDays: 0, remainingDays: 16 },
    });

    // Get PTO leave type ID
    const typesRes = await request(app)
      .get('/api/v1/leave/types')
      .set('Authorization', `Bearer ${employeeToken}`);
    const pto = typesRes.body.data.find((t: any) => t.code === 'PTO');
    ptoLeaveTypeId = pto.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Attendance Business Rules', () => {
    it('should retrieve today status for employee', async () => {
      const res = await request(app)
        .get('/api/v1/attendance/today')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('isCheckedIn');
    });

    it('should prevent employee from viewing admin muster roll (403)', async () => {
      const res = await request(app)
        .get('/api/v1/attendance/team')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(403);
    });

    it('should allow Admin to view team attendance analytics', async () => {
      const res = await request(app)
        .get('/api/v1/attendance/analytics')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('totalEmployees');
      expect(res.body.data).toHaveProperty('attendanceRate');
    });
  });

  describe('Leave Management & Quota Reservation', () => {
    const testYear = new Date().getFullYear() + 1; // Future year
    const startStr = `${testYear}-11-10`;
    const endStr = `${testYear}-11-12`;

    it('should fetch personal leave balances accurately', async () => {
      const res = await request(app)
        .get('/api/v1/leave/my-balances')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should submit a valid leave request and reserve pending quota', async () => {
      const res = await request(app)
        .post('/api/v1/leave/requests')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          leaveTypeId: ptoLeaveTypeId,
          startDate: startStr,
          endDate: endStr,
          reason: 'Quarterly decompression and personal wellness days',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.status).toBe('PENDING');
      expect(res.body.data.totalDays).toBe(3);
    });

    it('should reject overlapping leave request for the same dates (409 Conflict)', async () => {
      const res = await request(app)
        .post('/api/v1/leave/requests')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          leaveTypeId: ptoLeaveTypeId,
          startDate: `${testYear}-11-11`,
          endDate: `${testYear}-11-13`,
          reason: 'Attempting conflicting duplicate request',
        });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('CONFLICT');
    });
  });

  describe('Versioned Salary & Payroll Architecture', () => {
    it('should create new versioned salary structure and archive previous one', async () => {
      const createRes = await request(app)
        .post(`/api/v1/payroll/structures/${employeeProfileId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          baseSalary: 15000,
          hra: 4500,
          allowances: 2500,
          deductions: 3800,
          remarks: 'Mid-year performance excellence increment',
        });

      expect(createRes.status).toBe(201);
      expect(createRes.body.data.grossSalary).toBe(22000);
      expect(createRes.body.data.netSalary).toBe(18200);
      expect(createRes.body.data.isCurrent).toBe(true);

      // Verify structures list has multiple revisions
      const historyRes = await request(app)
        .get(`/api/v1/payroll/structures/${employeeProfileId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(historyRes.status).toBe(200);
      const activeStructures = historyRes.body.data.filter((s: any) => s.isCurrent);
      expect(activeStructures.length).toBe(1);
    });

    it('should allow employee to view their own payslips', async () => {
      const res = await request(app)
        .get('/api/v1/payroll/my-payslips')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should generate printable payslip HTML/PDF preview', async () => {
      const payslipsRes = await request(app)
        .get('/api/v1/payroll/my-payslips')
        .set('Authorization', `Bearer ${employeeToken}`);

      const firstPayslipId = payslipsRes.body.data[0].id;

      const pdfRes = await request(app)
        .get(`/api/v1/payroll/payslips/${firstPayslipId}/pdf`)
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(pdfRes.status).toBe(200);
      expect(pdfRes.text).toContain('DAYFLOW');
      expect(pdfRes.text).toContain('MONTHLY PAYSLIP');
    });
  });
});
