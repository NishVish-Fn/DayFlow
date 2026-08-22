import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { SalaryBreakdownCard } from '../components/payroll/SalaryBreakdownCard';
import { PayslipModal } from '../components/payroll/PayslipModal';
import { BatchPayrollModal } from '../components/payroll/BatchPayrollModal';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  CreditCard,
  FileText,
  PlayCircle,
  Filter,
  ShieldCheck,
} from 'lucide-react';
import { PayrollRecord, SalaryStructure } from '../types';
import { ENTERPRISE_EMPLOYEES, ENTERPRISE_PAYROLL_RUNS } from '../utils/mockEnterpriseData';

const GENERATE_MY_PAYSLIPS = (user: any): PayrollRecord[] => {
  const months = [
    { m: 8, y: 2026 }, { m: 7, y: 2026 }, { m: 6, y: 2026 }, { m: 5, y: 2026 },
    { m: 4, y: 2026 }, { m: 3, y: 2026 }, { m: 2, y: 2026 }, { m: 1, y: 2026 },
    { m: 12, y: 2025 }, { m: 11, y: 2025 }, { m: 10, y: 2025 }, { m: 9, y: 2025 },
  ];

  return months.map((date, idx) => ({
    id: `my-ps-${idx + 1}`,
    employeeProfileId: user?.profile?.id || 'prof-01',
    month: date.m,
    year: date.y,
    baseSalary: 7200,
    hra: 2880,
    standardAllowance: 2160,
    performanceBonus: idx % 3 === 0 ? 1500 : 0,
    providentFund: 1728,
    professionalTax: 200,
    incomeTax: 1440,
    grossAmount: 12240 + (idx % 3 === 0 ? 1500 : 0),
    netAmount: 8872 + (idx % 3 === 0 ? 1500 : 0),
    status: 'PAID',
    paymentDate: `${date.y}-${String(date.m).padStart(2, '0')}-28`,
    disbursementRef: `ACH-WF-${date.y}${date.m}890`,
    employee: user?.profile,
  } as any));
};

const DEFAULT_ADMIN_PAYSLIPS: PayrollRecord[] = ENTERPRISE_EMPLOYEES.map((emp, index) => {
  const baseSalary = 110000 + (index % 10) * 9500;
  const grossMonthly = Math.round(baseSalary / 12);
  const deductions = Math.round(grossMonthly * 0.24);
  const netMonthly = grossMonthly - deductions;

  return {
    id: `ps-${index + 1}`,
    employeeProfileId: emp.id,
    month: 8,
    year: 2026,
    baseSalary: Math.round(grossMonthly * 0.5),
    hra: Math.round(grossMonthly * 0.2),
    standardAllowance: Math.round(grossMonthly * 0.15),
    performanceBonus: index % 4 === 0 ? 1500 : 0,
    providentFund: Math.round(grossMonthly * 0.12),
    professionalTax: 200,
    incomeTax: Math.round(grossMonthly * 0.12),
    grossAmount: grossMonthly,
    netAmount: netMonthly,
    status: 'PAID',
    paymentDate: '2026-08-20',
    disbursementRef: `ACH-WF-${202608000 + index}`,
    employee: emp,
  } as any;
});

export const PayrollPage: React.FC = () => {
  const { user, role } = useAuth();
  const isAdminOrHr = role === 'ADMIN' || role === 'HR_MANAGER';

  const [activeTab, setActiveTab] = useState<'my-payslips' | 'admin-payroll'>(
    isAdminOrHr ? 'admin-payroll' : 'my-payslips'
  );

  // Employee Data
  const [myPayslips, setMyPayslips] = useState<PayrollRecord[]>(() => GENERATE_MY_PAYSLIPS(user));
  const [mySalaryStructure, setMySalaryStructure] = useState<SalaryStructure | null>({
    id: 'struct-current',
    employeeProfileId: user?.profile?.id || 'prof-01',
    baseSalary: 86400,
    hra: 34560,
    standardAllowance: 25920,
    performanceBonus: 18000,
    providentFund: 20736,
    professionalTax: 2400,
    incomeTax: 17280,
    effectiveFrom: '2025-01-01',
    isCurrent: true,
    version: 2,
  });

  // Admin Data
  const [adminPayslips, setAdminPayslips] = useState<PayrollRecord[]>(DEFAULT_ADMIN_PAYSLIPS);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [department, setDepartment] = useState('ALL');

  // Modals
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMyPayroll = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/payroll/my-payslips');
      setMyPayslips(data.data);
      if (user?.profile?.id) {
        const structRes = await api.get(`/payroll/structures/${user.profile.id}`);
        const active = structRes.data.data.find((s: any) => s.isCurrent);
        setMySalaryStructure(active || structRes.data.data[0] || null);
      }
    } catch (e) {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminPayroll = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedMonth) params.month = selectedMonth;
      if (selectedYear) params.year = selectedYear;
      if (department !== 'ALL') params.department = department;

      const { data } = await api.get('/payroll/payslips', { params });
      setAdminPayslips(data.data.payslips);
    } catch (e) {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'my-payslips') {
      fetchMyPayroll();
    } else if (isAdminOrHr && activeTab === 'admin-payroll') {
      fetchAdminPayroll();
    }
  }, [activeTab, selectedMonth, selectedYear, department]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-display">
            <CreditCard className="w-5 h-5 text-blue-600" /> Payroll & Compensation Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Auditable salary versioning, automated monthly batch disbursements, and downloadable payslips.
          </p>
        </div>

        {isAdminOrHr && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsBatchOpen(true)}
            leftIcon={<PlayCircle className="w-4 h-4" />}
          >
            Execute Batch Payroll Run
          </Button>
        )}
      </div>

      {/* Tabs */}
      {isAdminOrHr && (
        <div className="flex border-b border-slate-200 gap-4">
          <button
            onClick={() => setActiveTab('admin-payroll')}
            className={`flex items-center gap-2 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'admin-payroll'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Organization Payroll Ledger
          </button>

          <button
            onClick={() => setActiveTab('my-payslips')}
            className={`flex items-center gap-2 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'my-payslips'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" /> My Personal Payslips & Salary
          </button>
        </div>
      )}

      {/* TAB 1: ADMIN PAYROLL LEDGER */}
      {activeTab === 'admin-payroll' && isAdminOrHr && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-blue-600" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-600"
              >
                {monthNames.map((name, i) => (
                  <option key={name} value={i + 1}>
                    {name}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-600"
              >
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
              </select>
            </div>

            <div>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-600"
              >
                <option value="ALL">All Departments</option>
                <option value="ENGINEERING">Engineering</option>
                <option value="PRODUCT">Product</option>
                <option value="DESIGN">Design</option>
                <option value="HUMAN_RESOURCES">Human Resources</option>
                <option value="MARKETING">Marketing</option>
                <option value="SALES">Sales</option>
                <option value="FINANCE">Finance</option>
                <option value="OPERATIONS">Operations</option>
              </select>
            </div>
          </div>

          {/* Payslips Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Employee</th>
                    <th className="py-3.5 px-4">Cycle</th>
                    <th className="py-3.5 px-4">Gross Earnings</th>
                    <th className="py-3.5 px-4">Total Deductions</th>
                    <th className="py-3.5 px-4">Net Take-Home</th>
                    <th className="py-3.5 px-4">Status / Ref</th>
                    <th className="py-3.5 px-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        Loading payroll ledger...
                      </td>
                    </tr>
                  ) : adminPayslips.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        No payslip records found for this billing cycle. Run a batch payroll above!
                      </td>
                    </tr>
                  ) : (
                    adminPayslips.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">
                            {p.employee?.firstName} {p.employee?.lastName}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {p.employee?.department} &bull; {p.employee?.user?.employeeId}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-700">
                          {monthNames[p.month - 1]} {p.year}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                          ${p.grossAmount.toLocaleString()}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-rose-600 font-medium">
                          -${(p.grossAmount - p.netAmount).toLocaleString()}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-extrabold text-blue-700 text-sm">
                          ${p.netAmount.toLocaleString()}
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge variant="success" size="sm">{p.status}</Badge>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {p.transactionReference || 'ACH-DIRECT'}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedPayslip(p);
                              setIsPayslipOpen(true);
                            }}
                            leftIcon={<FileText className="w-3.5 h-3.5 text-blue-600" />}
                          >
                            View Slip
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY PERSONAL PAYROLL */}
      {activeTab === 'my-payslips' && (
        <div className="space-y-6">
          {/* Active Structure Card */}
          <SalaryBreakdownCard structure={mySalaryStructure} />

          {/* Historical Payslips Archive */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-display">
                <FileText className="w-4 h-4 text-blue-600" /> Historical Payslips Archive
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Period</th>
                    <th className="py-3 px-4">Gross Salary</th>
                    <th className="py-3 px-4">Deductions</th>
                    <th className="py-3 px-4">Net Disbursed</th>
                    <th className="py-3 px-4">Disbursed Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myPayslips.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No payslips found in your archive.
                      </td>
                    </tr>
                  ) : (
                    myPayslips.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {monthNames[p.month - 1]} {p.year}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-emerald-700 font-bold">
                          ${p.grossAmount.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-rose-600 font-medium">
                          -${(p.grossAmount - p.netAmount).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-extrabold text-blue-700 text-sm">
                          ${p.netAmount.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : 'Pending'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedPayslip({ ...p, employee: user?.profile });
                              setIsPayslipOpen(true);
                            }}
                            leftIcon={<FileText className="w-3.5 h-3.5 text-blue-600" />}
                          >
                            View & Print PDF
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Payslip Modal */}
      {isPayslipOpen && (
        <PayslipModal
          isOpen={isPayslipOpen}
          onClose={() => setIsPayslipOpen(false)}
          payslip={selectedPayslip}
        />
      )}

      {/* Batch Payroll Modal */}
      {isBatchOpen && (
        <BatchPayrollModal
          isOpen={isBatchOpen}
          onClose={() => setIsBatchOpen(false)}
          onSuccess={() => {
            fetchAdminPayroll();
            fetchMyPayroll();
          }}
        />
      )}
    </div>
  );
};
