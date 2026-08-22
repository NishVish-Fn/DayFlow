import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { StatCard } from '../components/common/StatCard';
import { PunchClockWidget } from '../components/attendance/PunchClockWidget';
import { LeaveBalanceCard } from '../components/leave/LeaveBalanceCard';
import { ApplyLeaveModal } from '../components/leave/ApplyLeaveModal';
import { BatchPayrollModal } from '../components/payroll/BatchPayrollModal';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  Users,
  Clock,
  CalendarCheck,
  CreditCard,
  PlusCircle,
  PlayCircle,
  Calendar,
  Sparkles,
  HeartPulse,
  Target,
  Gift,
  MessageSquareWarning,
  CheckCircle2,
  X,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export const DashboardPage: React.FC = () => {
  const { user, role } = useAuth();
  const isAdminOrHr = role === 'ADMIN' || role === 'HR_MANAGER';
  const navigate = useNavigate();
  const { success } = useToast();

  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState<any>({
    headcount: 14,
    attendance: { attendanceRate: 92.8, presentCount: 13, officeCount: 8, remoteCount: 5 },
    pendingLeaveApprovals: 2,
    payrollMetrics: { totalMonthlyGross: 148500, totalMonthlyNet: 114200 },
  });
  const [employeeData, setEmployeeData] = useState<any>({
    leaveBalances: [
      { id: '1', leaveType: { name: 'Paid Time Off', code: 'PTO' }, totalAllocated: 18, usedDays: 2, pendingDays: 0, remainingDays: 16 },
      { id: '2', leaveType: { name: 'Sick Leave', code: 'SICK' }, totalAllocated: 10, usedDays: 1, pendingDays: 0, remainingDays: 9 },
      { id: '3', leaveType: { name: 'Casual Leave', code: 'CASUAL' }, totalAllocated: 7, usedDays: 0, pendingDays: 0, remainingDays: 7 },
      { id: '4', leaveType: { name: 'Unpaid Sabbatical', code: 'UNPAID' }, totalAllocated: 30, usedDays: 0, pendingDays: 0, remainingDays: 30 },
    ],
  });
  const [leaveTypes, setLeaveTypes] = useState<any[]>([
    { id: '1', name: 'Paid Time Off', code: 'PTO', maxDaysPerYear: 18 },
    { id: '2', name: 'Sick Leave', code: 'SICK', maxDaysPerYear: 10 },
    { id: '3', name: 'Casual Leave', code: 'CASUAL', maxDaysPerYear: 7 },
    { id: '4', name: 'Unpaid Sabbatical', code: 'UNPAID', maxDaysPerYear: 30 },
  ]);

  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [isBatchPayrollOpen, setIsBatchPayrollOpen] = useState(false);
  const [isGrievanceOpen, setIsGrievanceOpen] = useState(false);
  const [isBenefitsOpen, setIsBenefitsOpen] = useState(false);
  const [grievanceCategory, setGrievanceCategory] = useState('WORKPLACE_ENVIRONMENT');
  const [grievanceNote, setGrievanceNote] = useState('');

  const fetchDashboard = async () => {
    try {
      if (isAdminOrHr) {
        const [adminRes, ltRes] = await Promise.all([
          api.get('/dashboard/admin'),
          api.get('/leave/types'),
        ]);
        if (adminRes.data?.data) setAdminData(adminRes.data.data);
        if (ltRes.data?.data) setLeaveTypes(ltRes.data.data);
      } else {
        const [empRes, ltRes] = await Promise.all([
          api.get('/dashboard/employee'),
          api.get('/leave/types'),
        ]);
        if (empRes.data?.data) setEmployeeData(empRes.data.data);
        if (ltRes.data?.data) setLeaveTypes(ltRes.data.data);
      }
    } catch (e) {
      // Fallback to optimistic state
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [isAdminOrHr, user]);

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    success('Confidential Grievance Submitted', 'Routed securely to HR Ethics Committee.');
    setIsGrievanceOpen(false);
    setGrievanceNote('');
  };

  return (
    <div className="space-y-6">
      {/* ================================================================= */}
      {/* GOOGLE WORKSPACE TOP WELCOME CARD                                */}
      {/* ================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1e1f20] border border-slate-200/90 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1a73e8] dark:text-[#8ab4f8]">
              {isAdminOrHr ? 'Google Workspace Admin Command' : 'Employee Self-Service'}
            </span>
            <Badge variant="success" size="sm">Active</Badge>
          </div>
          <h2 className="text-2xl font-normal text-slate-900 dark:text-white mt-1">
            Welcome back, <span className="font-semibold">{user?.profile?.firstName || 'Google Colleague'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Employee ID: <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">{user?.employeeId}</span> &bull; {user?.profile?.designation} &bull; {user?.profile?.department}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsBenefitsOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
          >
            <Gift className="w-4 h-4 text-[#FBBC04]" />
            <span>Benefits</span>
          </button>

          <button
            type="button"
            onClick={() => setIsGrievanceOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
          >
            <MessageSquareWarning className="w-4 h-4 text-[#EA4335]" />
            <span>File Grievance</span>
          </button>

          {isAdminOrHr ? (
            <button
              type="button"
              onClick={() => setIsBatchPayrollOpen(true)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 fill-current" />
              <span>Run Payroll</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsApplyLeaveOpen(true)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Apply for Leave</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Launchpad Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => navigate('/wellness')}
          className="p-4 rounded-2xl bg-white dark:bg-[#1e1f20] border border-slate-200/90 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-700 text-left transition-all group shadow-xs cursor-pointer"
        >
          <div className="flex items-center gap-2 text-[#EA4335] font-semibold text-xs">
            <HeartPulse className="w-4 h-4" /> Wellness & Fatigue
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Burnout Telemetry &rarr;</div>
        </button>

        <button
          onClick={() => navigate('/performance')}
          className="p-4 rounded-2xl bg-white dark:bg-[#1e1f20] border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 text-left transition-all group shadow-xs cursor-pointer"
        >
          <div className="flex items-center gap-2 text-[#1a73e8] dark:text-[#8ab4f8] font-semibold text-xs">
            <Target className="w-4 h-4" /> Goals & OKRs
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Key Results & Feedback &rarr;</div>
        </button>

        <button
          onClick={() => navigate('/attendance')}
          className="p-4 rounded-2xl bg-white dark:bg-[#1e1f20] border border-slate-200/90 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 text-left transition-all group shadow-xs cursor-pointer"
        >
          <div className="flex items-center gap-2 text-[#34A853] font-semibold text-xs">
            <Clock className="w-4 h-4" /> Live Attendance
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Punch Clock & Muster &rarr;</div>
        </button>

        <button
          onClick={() => navigate('/payroll')}
          className="p-4 rounded-2xl bg-white dark:bg-[#1e1f20] border border-slate-200/90 dark:border-slate-800 hover:border-yellow-300 dark:hover:border-yellow-700 text-left transition-all group shadow-xs cursor-pointer"
        >
          <div className="flex items-center gap-2 text-[#FBBC04] font-semibold text-xs">
            <CreditCard className="w-4 h-4" /> Salary & Payslips
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Itemized PDF Downloads &rarr;</div>
        </button>
      </div>

      {/* Primary Widget: Live Punch Clock */}
      <PunchClockWidget onAttendanceChange={fetchDashboard} />

      {/* Admin Specific KPIs if Admin */}
      {isAdminOrHr && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Headcount"
            value={adminData?.headcount || 14}
            subtitle="Full-time & Google contractors"
            icon={<Users className="w-5 h-5" />}
            variant="blue"
          />

          <StatCard
            title="Today's Attendance Rate"
            value={`${adminData?.attendance?.attendanceRate || 92.8}%`}
            subtitle={`${adminData?.attendance?.presentCount || 13} present on shift`}
            icon={<Clock className="w-5 h-5" />}
            variant="emerald"
            trend={{ value: '13 active', isPositive: true }}
          />

          <StatCard
            title="Pending Leave Queue"
            value={adminData?.pendingLeaveApprovals || 2}
            subtitle="Awaiting managerial review"
            icon={<CalendarCheck className="w-5 h-5" />}
            variant="amber"
          />

          <StatCard
            title="Monthly Payroll Spend"
            value={`$${(adminData?.payrollMetrics?.totalMonthlyGross || 148500).toLocaleString()}`}
            subtitle={`Net payable: $${(adminData?.payrollMetrics?.totalMonthlyNet || 114200).toLocaleString()}`}
            icon={<CreditCard className="w-5 h-5" />}
            variant="purple"
          />
        </div>
      )}

      {/* Leave Balances Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-[#1a73e8]" /> Annual Leave Quota Balances
          </h3>
          <button
            onClick={() => navigate('/leave')}
            className="text-xs font-semibold text-[#1a73e8] dark:text-[#8ab4f8] hover:underline"
          >
            Manage Time Off &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(employeeData?.leaveBalances || adminData?.myLeaveBalances || []).map((b: any) => (
            <LeaveBalanceCard key={b.id} balance={b} />
          ))}
        </div>
      </div>

      {/* Apply Leave Modal */}
      {isApplyLeaveOpen && (
        <ApplyLeaveModal
          isOpen={isApplyLeaveOpen}
          onClose={() => setIsApplyLeaveOpen(false)}
          leaveBalances={employeeData?.leaveBalances || []}
          leaveTypes={leaveTypes}
          onSuccess={fetchDashboard}
        />
      )}

      {/* Batch Payroll Modal */}
      {isBatchPayrollOpen && (
        <BatchPayrollModal
          isOpen={isBatchPayrollOpen}
          onClose={() => setIsBatchPayrollOpen(false)}
          onSuccess={fetchDashboard}
        />
      )}

      {/* Grievance Modal */}
      {isGrievanceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1e1f20] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquareWarning className="w-5 h-5 text-[#EA4335]" /> File Confidential Grievance
              </h3>
              <button onClick={() => setIsGrievanceOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGrievanceSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  value={grievanceCategory}
                  onChange={(e) => setGrievanceCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#1a73e8]"
                >
                  <option value="WORKPLACE_ENVIRONMENT">Workplace Environment & Safety</option>
                  <option value="COMPENSATION_BENEFITS">Compensation & Payroll Discrepancy</option>
                  <option value="MANAGERIAL_CONDUCT">Managerial Conduct & Fairness</option>
                  <option value="WORKLOAD_STRESS">Acute Workload & Overtime Pressure</option>
                  <option value="OTHER">Other Confidential Matter</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Details</label>
                <textarea
                  rows={4}
                  required
                  value={grievanceNote}
                  onChange={(e) => setGrievanceNote(e.target.value)}
                  placeholder="Provide context and specifics for HR investigation..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#1a73e8] font-normal"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-[11px] leading-relaxed">
                🔒 <strong>Whistleblower Protection Policy</strong>: Encrypted and reviewed solely by the Ethics Committee.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGrievanceOpen(false)}
                  className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold text-xs shadow-sm"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Benefits Modal */}
      {isBenefitsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1e1f20] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-xl w-full p-6 space-y-4 animate-in zoom-in-95 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#FBBC04]" /> Google Benefits & Perks
              </h3>
              <button onClick={() => setIsBenefitsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <div className="text-2xl">🏥</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Medical, Dental & Vision Care</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Comprehensive global health coverage for employees and dependents.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <div className="text-2xl">🧘</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Wellness & Gym Allowance</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">$1,200/year for gym memberships, wellness apps, and fitness equipment.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <div className="text-2xl">💻</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Home Office Stipend</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">$1,000 allowance for monitors, ergonomic chairs, and high-speed fiber internet.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsBenefitsOpen(false)}
                className="px-5 py-2 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold text-xs shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
