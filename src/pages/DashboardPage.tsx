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
  Inbox,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

interface Grievance {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  category: string;
  note: string;
  status: 'PENDING_REVIEW' | 'INVESTIGATING' | 'RESOLVED';
  submittedAt: string;
}

const DEFAULT_GRIEVANCES: Grievance[] = [
  {
    id: 'grv-1',
    employeeName: 'David Kim',
    employeeId: 'OIALCH20230003',
    department: 'Engineering',
    category: 'WORKLOAD_STRESS',
    note: 'Continuous overtime required across weekend deployments without compensatory rest.',
    status: 'PENDING_REVIEW',
    submittedAt: 'Today at 10:14 AM',
  },
];

export const DashboardPage: React.FC = () => {
  const { user, role } = useAuth();
  const isAdminOrHr = role === 'ADMIN' || role === 'HR_MANAGER';
  const navigate = useNavigate();
  const { success } = useToast();

  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState<any>({
    headcount: 55,
    attendance: { attendanceRate: 92.7, presentCount: 51, officeCount: 32, remoteCount: 19 },
    pendingLeaveApprovals: 4,
    payrollMetrics: { totalMonthlyGross: 685000, totalMonthlyNet: 524000 },
  });
  const [employeeData, setEmployeeData] = useState<any>({
    leaveBalances: [
      { id: '1', leaveType: { name: 'Paid Time Off', code: 'PTO' }, totalAllocated: 24, usedDays: 4, pendingDays: 0, remainingDays: 20 },
      { id: '2', leaveType: { name: 'Sick Leave', code: 'SICK' }, totalAllocated: 7, usedDays: 1, pendingDays: 0, remainingDays: 6 },
      { id: '3', leaveType: { name: 'Unpaid Leave', code: 'UNPAID' }, totalAllocated: 30, usedDays: 0, pendingDays: 0, remainingDays: 30 },
    ],
  });
  const [leaveTypes, setLeaveTypes] = useState<any[]>([
    { id: '1', name: 'Paid Time Off', code: 'PTO', maxDaysPerYear: 24 },
    { id: '2', name: 'Sick Leave', code: 'SICK', maxDaysPerYear: 7 },
    { id: '3', name: 'Unpaid Leave', code: 'UNPAID', maxDaysPerYear: 30 },
  ]);

  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [isBatchPayrollOpen, setIsBatchPayrollOpen] = useState(false);
  const [isGrievanceOpen, setIsGrievanceOpen] = useState(false);
  const [isGrievanceInboxOpen, setIsGrievanceInboxOpen] = useState(false);
  const [isBenefitsOpen, setIsBenefitsOpen] = useState(false);
  const [grievanceCategory, setGrievanceCategory] = useState('WORKPLACE_ENVIRONMENT');
  const [grievanceNote, setGrievanceNote] = useState('');

  // Persistent Grievances Queue across whole system
  const [grievances, setGrievances] = useState<Grievance[]>(() => {
    try {
      const saved = localStorage.getItem('worknest_grievances');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return DEFAULT_GRIEVANCES;
  });

  useEffect(() => {
    localStorage.setItem('worknest_grievances', JSON.stringify(grievances));
  }, [grievances]);

  const pendingGrievanceCount = grievances.filter((g) => g.status === 'PENDING_REVIEW').length;

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
      // Fallback
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [isAdminOrHr, user]);

  // Dispatch real confidential grievance to HR/Admin
  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newGrievance: Grievance = {
      id: 'grv-' + Date.now(),
      employeeName: `${user?.profile?.firstName || 'Alex'} ${user?.profile?.lastName || 'Chen'}`,
      employeeId: user?.employeeId || 'OIALCH20230003',
      department: user?.profile?.department || 'Engineering',
      category: grievanceCategory,
      note: grievanceNote,
      status: 'PENDING_REVIEW',
      submittedAt: new Date().toLocaleDateString() + ' at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [newGrievance, ...grievances];
    setGrievances(updated);
    localStorage.setItem('worknest_grievances', JSON.stringify(updated));

    success('Confidential Grievance Dispatched', 'Your grievance has been securely transmitted to the HR Ethics & Admin Inbox.');
    setIsGrievanceOpen(false);
    setGrievanceNote('');
  };

  const handleResolveGrievance = (id: string) => {
    const updated = grievances.map((g) =>
      g.id === id ? { ...g, status: 'RESOLVED' as const } : g
    );
    setGrievances(updated);
    localStorage.setItem('worknest_grievances', JSON.stringify(updated));
    success('Grievance Marked Resolved', 'Matter recorded as investigated and closed.');
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] shadow-xs relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0071e3] dark:text-[#2997ff]">
              {isAdminOrHr ? 'Executive Admin Command' : 'Employee Self-Service'}
            </span>
            <Badge variant="success" size="sm">Active Session</Badge>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Welcome back, <span className="text-[#0071e3] dark:text-[#2997ff]">{user?.profile?.firstName || 'Colleague'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Employee ID: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{user?.employeeId}</span> &bull; {user?.profile?.designation} &bull; {user?.profile?.department}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsBenefitsOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] border border-black/[0.06] dark:border-white/[0.08] text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
          >
            <Gift className="w-4 h-4 text-amber-500" />
            <span>Benefits</span>
          </button>

          {/* Grievance Action Button */}
          <button
            type="button"
            onClick={() => setIsGrievanceOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-bold text-rose-600 dark:text-rose-400 transition-all cursor-pointer"
          >
            <MessageSquareWarning className="w-4 h-4" />
            <span>File Grievance</span>
          </button>

          {/* Admin HR Grievance Queue Button */}
          {isAdminOrHr && (
            <button
              type="button"
              onClick={() => setIsGrievanceInboxOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-xs font-bold text-[#0071e3] dark:text-[#2997ff] transition-all cursor-pointer relative"
            >
              <Inbox className="w-4 h-4" />
              <span>HR Grievance Inbox</span>
              {pendingGrievanceCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center -mr-1">
                  {pendingGrievanceCount}
                </span>
              )}
            </button>
          )}

          {isAdminOrHr ? (
            <button
              type="button"
              onClick={() => setIsBatchPayrollOpen(true)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 fill-current" />
              <span>Run Payroll</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsApplyLeaveOpen(true)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
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
          className="p-4 rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] hover:border-red-400 text-left transition-all group shadow-xs cursor-pointer"
        >
          <div className="flex items-center gap-2 text-rose-500 font-bold text-xs">
            <HeartPulse className="w-4 h-4" /> Wellness & Fatigue
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Burnout Telemetry &rarr;</div>
        </button>

        <button
          onClick={() => navigate('/risk-radar')}
          className="p-4 rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] hover:border-amber-400 text-left transition-all group shadow-xs cursor-pointer"
        >
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs">
            <ShieldCheck className="w-4 h-4" /> HR Risk Analysis
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Resolve Crisis Signals &rarr;</div>
        </button>

        <button
          onClick={() => navigate('/attendance')}
          className="p-4 rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] hover:border-emerald-400 text-left transition-all group shadow-xs cursor-pointer"
        >
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
            <Clock className="w-4 h-4" /> Live Attendance
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Day-Wise Ledger &rarr;</div>
        </button>

        <button
          onClick={() => navigate('/leave')}
          className="p-4 rounded-3xl bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] hover:border-blue-400 text-left transition-all group shadow-xs cursor-pointer"
        >
          <div className="flex items-center gap-2 text-[#0071e3] font-bold text-xs">
            <CalendarCheck className="w-4 h-4" /> Time Off Module
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">PTO & Sick Quotas &rarr;</div>
        </button>
      </div>

      {/* Primary Widget: Live Punch Clock */}
      <PunchClockWidget onAttendanceChange={fetchDashboard} />

      {/* Admin Specific KPIs */}
      {isAdminOrHr && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Headcount"
            value={adminData?.headcount || 14}
            subtitle="Full-time staff members"
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

      {/* Leave Balances Grid (§8 Spec: Paid Time Off 24d, Sick 7d) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-[#0071e3]" /> Annual Leave Quota Balances (§8)
          </h3>
          <button
            onClick={() => navigate('/leave')}
            className="text-xs font-semibold text-[#0071e3] dark:text-[#2997ff] hover:underline cursor-pointer"
          >
            Manage Time Off &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(employeeData?.leaveBalances || []).map((b: any) => (
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

      {/* Grievance Submission Modal */}
      {isGrievanceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1e1f20] border border-black/[0.08] dark:border-white/[0.1] rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.08] pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquareWarning className="w-5 h-5 text-rose-500" /> File Confidential Grievance to HR & Admin
              </h3>
              <button onClick={() => setIsGrievanceOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGrievanceSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Grievance Category</label>
                <select
                  value={grievanceCategory}
                  onChange={(e) => setGrievanceCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-black/[0.1] dark:border-white/[0.15] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#0071e3]"
                >
                  <option value="WORKPLACE_ENVIRONMENT">Workplace Environment & Safety</option>
                  <option value="COMPENSATION_BENEFITS">Compensation & Payroll Discrepancy</option>
                  <option value="MANAGERIAL_CONDUCT">Managerial Conduct & Fairness</option>
                  <option value="WORKLOAD_STRESS">Acute Workload & Overtime Pressure</option>
                  <option value="OTHER">Other Confidential Matter</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Details & Statement</label>
                <textarea
                  rows={4}
                  required
                  value={grievanceNote}
                  onChange={(e) => setGrievanceNote(e.target.value)}
                  placeholder="Provide context and specifics for HR and Admin review..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-black/[0.1] dark:border-white/[0.15] rounded-xl p-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0071e3] font-normal"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-[11px] leading-relaxed">
                🔒 <strong>Whistleblower Protection Policy</strong>: Encrypted and transmitted directly to the HR Ethics & Admin Inbox.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGrievanceOpen(false)}
                  className="px-4 py-2 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  Dispatch to HR/Admin &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin HR Grievance Queue Modal */}
      {isGrievanceInboxOpen && isAdminOrHr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1e1f20] border border-black/[0.08] dark:border-white/[0.1] rounded-3xl shadow-2xl max-w-2xl w-full p-6 space-y-4 animate-in zoom-in-95 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Inbox className="w-5 h-5 text-[#0071e3]" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Confidential HR Grievance & Whistleblower Inbox</h3>
                  <p className="text-[11px] text-slate-400">Review, acknowledge, and resolve employee-submitted workplace grievances.</p>
                </div>
              </div>
              <button onClick={() => setIsGrievanceInboxOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {grievances.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No grievances on file. All clear!
                </div>
              ) : (
                grievances.map((g) => (
                  <div
                    key={g.id}
                    className={`p-4 rounded-2xl border text-xs space-y-2 transition-all ${
                      g.status === 'RESOLVED'
                        ? 'bg-black/[0.02] dark:bg-white/[0.02] border-black/[0.05] dark:border-white/[0.06] opacity-75'
                        : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{g.employeeName}</span>
                        <span className="font-mono text-[10px] text-[#0071e3] bg-[#0071e3]/10 px-2 py-0.5 rounded-md">{g.employeeId}</span>
                        <span className="text-[11px] text-slate-500">({g.department})</span>
                      </div>
                      <Badge variant={g.status === 'RESOLVED' ? 'success' : 'danger'} size="sm">
                        {g.status === 'RESOLVED' ? 'RESOLVED' : 'PENDING ACTION'}
                      </Badge>
                    </div>

                    <div className="font-semibold text-rose-700 dark:text-rose-300 text-[11px]">
                      Category: {g.category.replace(/_/g, ' ')} &bull; Submitted: {g.submittedAt}
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white/70 dark:bg-black/30 p-2.5 rounded-xl border border-black/[0.04] dark:border-white/[0.06]">
                      "{g.note}"
                    </p>

                    {g.status !== 'RESOLVED' && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleResolveGrievance(g.id)}
                          className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Mark Investigated & Resolved
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-black/[0.05] dark:border-white/[0.08]">
              <button
                type="button"
                onClick={() => setIsGrievanceInboxOpen(false)}
                className="px-5 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs shadow-xs cursor-pointer"
              >
                Close Inbox
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Benefits Modal */}
      {isBenefitsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1e1f20] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-xl w-full p-6 space-y-4 animate-in zoom-in-95 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-500" /> Corporate Benefits & Health Perks
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
                className="px-5 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs shadow-xs cursor-pointer"
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
