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
  Download,
  Building2,
  Filter,
  DollarSign,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { PayrollRecord, SalaryStructure } from '../types';

export const PayrollPage: React.FC = () => {
  const { user, role } = useAuth();
  const isAdminOrHr = role === 'ADMIN' || role === 'HR_MANAGER';

  const [activeTab, setActiveTab] = useState<'my-payslips' | 'admin-payroll'>(
    isAdminOrHr ? 'admin-payroll' : 'my-payslips'
  );

  // Employee Data
  const [myPayslips, setMyPayslips] = useState<PayrollRecord[]>([]);
  const [mySalaryStructure, setMySalaryStructure] = useState<SalaryStructure | null>(null);

  // Admin Data
  const [adminPayslips, setAdminPayslips] = useState<PayrollRecord[]>([]);
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
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-400" /> Payroll & Compensation Engine
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
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
        <div className="flex border-b border-slate-800 gap-4">
          <button
            onClick={() => setActiveTab('admin-payroll')}
            className={`flex items-center gap-2 py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'admin-payroll'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Organization Payroll Ledger
          </button>

          <button
            onClick={() => setActiveTab('my-payslips')}
            className={`flex items-center gap-2 py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'my-payslips'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
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
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-indigo-400" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
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
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
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
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
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
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-semibold">
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
                <tbody className="divide-y divide-slate-800/80">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        Loading payroll ledger...
                      </td>
                    </tr>
                  ) : adminPayslips.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        No payslip records found for this billing cycle. Run a batch payroll above!
                      </td>
                    </tr>
                  ) : (
                    adminPayslips.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-100">
                            {p.employee?.firstName} {p.employee?.lastName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {p.employee?.department} &bull; {p.employee?.user?.employeeId}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-200">
                          {monthNames[p.month - 1]} {p.year}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-semibold text-emerald-400">
                          ${p.grossAmount.toLocaleString()}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-rose-400">
                          -${(p.grossAmount - p.netAmount).toLocaleString()}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-black text-indigo-300 text-sm">
                          ${p.netAmount.toLocaleString()}
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge variant="success" size="sm">{p.status}</Badge>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
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
                            leftIcon={<FileText className="w-3.5 h-3.5 text-indigo-400" />}
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
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" /> Historical Payslips Archive
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Period</th>
                    <th className="py-3 px-4">Gross Salary</th>
                    <th className="py-3 px-4">Deductions</th>
                    <th className="py-3 px-4">Net Disbursed</th>
                    <th className="py-3 px-4">Disbursed Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {myPayslips.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No payslips found in your archive.
                      </td>
                    </tr>
                  ) : (
                    myPayslips.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-100">
                          {monthNames[p.month - 1]} {p.year}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">
                          ${p.grossAmount.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-rose-400">
                          -${(p.grossAmount - p.netAmount).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-black text-indigo-300 text-sm">
                          ${p.netAmount.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
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
                            leftIcon={<FileText className="w-3.5 h-3.5 text-indigo-400" />}
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
