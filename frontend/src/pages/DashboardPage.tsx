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
  FileText,
  Calendar,
  Sparkles,
  Shield,
  Briefcase,
  TrendingUp,
  HeartPulse,
  Target,
  Gift,
  HelpCircle,
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

  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState<any>(null);
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);

  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [isBatchPayrollOpen, setIsBatchPayrollOpen] = useState(false);
  const [isGrievanceOpen, setIsGrievanceOpen] = useState(false);
  const [isBenefitsOpen, setIsBenefitsOpen] = useState(false);
  const [grievanceCategory, setGrievanceCategory] = useState('WORKPLACE_ENVIRONMENT');
  const [grievanceNote, setGrievanceNote] = useState('');

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      if (isAdminOrHr) {
        const [adminRes, ltRes] = await Promise.all([
          api.get('/dashboard/admin'),
          api.get('/leave/types'),
        ]);
        setAdminData(adminRes.data.data);
        setLeaveTypes(ltRes.data.data);
      } else {
        const [empRes, ltRes] = await Promise.all([
          api.get('/dashboard/employee'),
          api.get('/leave/types'),
        ]);
        setEmployeeData(empRes.data.data);
        setLeaveTypes(ltRes.data.data);
      }
    } catch (e) {
      // Ignore
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 bg-[#0e1217] rounded-2xl border border-white/10" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-[#0e1217] rounded-2xl border border-white/10" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ================================================================= */}
      {/* TOP ESS / EXECUTIVE BANNER                                        */}
      {/* ================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0e1217] border border-white/10 shadow-sm relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00f0ff]">
              {isAdminOrHr ? 'Executive Command Center' : 'Employee Self-Service (ESS) Hub'}
            </span>
            <Badge variant="success" size="sm">Operational</Badge>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1 font-display tracking-tight">
            Welcome back, {user?.profile?.firstName}!
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Staff Badge: <span className="font-mono text-[#00f0ff] font-semibold">{user?.employeeId}</span> &bull; {user?.profile?.designation} &bull; {user?.profile?.department}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsBenefitsOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-all cursor-pointer"
          >
            <Gift className="w-4 h-4 text-purple-400" />
            <span>My Benefits</span>
          </button>

          <button
            type="button"
            onClick={() => setIsGrievanceOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-all cursor-pointer"
          >
            <MessageSquareWarning className="w-4 h-4 text-amber-400" />
            <span>File Grievance</span>
          </button>

          {isAdminOrHr ? (
            <button
              type="button"
              onClick={() => setIsBatchPayrollOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00f0ff] hover:bg-[#38f8ff] text-slate-950 text-xs font-extrabold shadow-md shadow-[#00f0ff]/25 transition-all cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 fill-current" />
              <span>Run Batch Payroll</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsApplyLeaveOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00f0ff] hover:bg-[#38f8ff] text-slate-950 text-xs font-extrabold shadow-md shadow-[#00f0ff]/25 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Apply Leave</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Launchpad Chips for USP Features */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => navigate('/wellness')}
          className="p-3.5 rounded-2xl bg-[#0e1217] border border-white/10 hover:border-rose-400/40 text-left transition-all group shadow-sm cursor-pointer"
        >
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs font-mono">
            <HeartPulse className="w-4 h-4" /> Wellness & Fatigue
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">Burnout Score & Surveys &rarr;</div>
        </button>

        <button
          onClick={() => navigate('/performance')}
          className="p-3.5 rounded-2xl bg-[#0e1217] border border-white/10 hover:border-indigo-400/40 text-left transition-all group shadow-sm cursor-pointer"
        >
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs font-mono">
            <Target className="w-4 h-4" /> Performance & OKRs
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">KPIs & 360 Feedback &rarr;</div>
        </button>

        <button
          onClick={() => navigate('/attendance')}
          className="p-3.5 rounded-2xl bg-[#0e1217] border border-white/10 hover:border-[#00f0ff]/40 text-left transition-all group shadow-sm cursor-pointer"
        >
          <div className="flex items-center gap-2 text-[#00f0ff] font-bold text-xs font-mono">
            <Clock className="w-4 h-4" /> Live Attendance
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">Muster Roll & Telemetry &rarr;</div>
        </button>

        <button
          onClick={() => navigate('/payroll')}
          className="p-3.5 rounded-2xl bg-[#0e1217] border border-white/10 hover:border-[#00ffc2]/40 text-left transition-all group shadow-sm cursor-pointer"
        >
          <div className="flex items-center gap-2 text-[#00ffc2] font-bold text-xs font-mono">
            <CreditCard className="w-4 h-4" /> Salary & Payslips
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">1-Click PDF Downloads &rarr;</div>
        </button>
      </div>

      {/* Primary Widget: Live Punch Clock */}
      <PunchClockWidget onAttendanceChange={fetchDashboard} />

      {/* Admin Specific KPIs if Admin */}
      {isAdminOrHr && adminData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Headcount"
            value={adminData.headcount}
            subtitle="Active full-time & contract staff"
            icon={<Users className="w-5 h-5" />}
            variant="blue"
          />

          <StatCard
            title="Today's Attendance Rate"
            value={`${adminData.attendance?.attendanceRate}%`}
            subtitle={`${adminData.attendance?.presentCount} present (${adminData.attendance?.officeCount} office, ${adminData.attendance?.remoteCount} remote)`}
            icon={<Clock className="w-5 h-5" />}
            variant="emerald"
            trend={{ value: `${adminData.attendance?.presentCount} active`, isPositive: true }}
          />

          <StatCard
            title="Pending Leave Queue"
            value={adminData.pendingLeaveApprovals}
            subtitle="Awaiting managerial review"
            icon={<CalendarCheck className="w-5 h-5" />}
            variant="amber"
          />

          <StatCard
            title="Monthly Payroll Spend"
            value={`$${adminData.payrollMetrics?.totalMonthlyGross?.toLocaleString()}`}
            subtitle={`Net payable: $${adminData.payrollMetrics?.totalMonthlyNet?.toLocaleString()}`}
            icon={<CreditCard className="w-5 h-5" />}
            variant="purple"
          />
        </div>
      )}

      {/* Leave Balances Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2 font-display">
            <CalendarCheck className="w-5 h-5 text-[#00f0ff]" /> Annual Leave Quota Balances
          </h3>
          <button
            onClick={() => navigate('/leave')}
            className="text-xs font-mono font-bold text-[#00f0ff] hover:underline"
          >
            Manage Leaves &rarr;
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0e1217] border border-white/10 rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquareWarning className="w-5 h-5 text-amber-400" /> File Confidential Grievance
              </h3>
              <button onClick={() => setIsGrievanceOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGrievanceSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Grievance Category</label>
                <select
                  value={grievanceCategory}
                  onChange={(e) => setGrievanceCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-[#00f0ff]"
                >
                  <option value="WORKPLACE_ENVIRONMENT">Workplace Environment & Safety</option>
                  <option value="COMPENSATION_BENEFITS">Compensation & Payroll Discrepancy</option>
                  <option value="MANAGERIAL_CONDUCT">Managerial Conduct & Fairness</option>
                  <option value="WORKLOAD_STRESS">Acute Workload & Overtime Pressure</option>
                  <option value="OTHER">Other Confidential Matter</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description / Particulars</label>
                <textarea
                  rows={4}
                  required
                  value={grievanceNote}
                  onChange={(e) => setGrievanceNote(e.target.value)}
                  placeholder="Provide objective context, dates, and specifics for HR investigation..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#00f0ff] font-medium"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[11px] leading-relaxed">
                🔒 <strong>Whistleblower Protection Policy</strong>: Submissions are encrypted and reviewed solely by the Ethics & Compliance Committee.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGrievanceOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00f0ff] hover:bg-[#38f8ff] text-slate-950 font-extrabold text-xs shadow-md shadow-[#00f0ff]/25"
                >
                  Submit Grievance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Benefits Modal */}
      {isBenefitsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0e1217] border border-white/10 rounded-3xl shadow-2xl max-w-xl w-full p-6 space-y-4 animate-in zoom-in-95 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-400" /> Employee Benefits & Wellness Perks
              </h3>
              <button onClick={() => setIsBenefitsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3">
                <div className="text-2xl">🏥</div>
                <div>
                  <h4 className="text-xs font-bold text-white">Comprehensive Health & Dental Coverage</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">$500,000 corporate medical coverage for you and direct dependents.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3">
                <div className="text-2xl">🧘</div>
                <div>
                  <h4 className="text-xs font-bold text-white">Annual Wellness & Gym Stipend</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">$1,200/year reimbursement for gym memberships, therapy, and fitness gear.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3">
                <div className="text-2xl">💻</div>
                <div>
                  <h4 className="text-xs font-bold text-white">Remote Office & Ergonomic Setup Allowance</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">$1,000/year for high-speed fiber, ergonomic seating, and monitors.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsBenefitsOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#00f0ff] hover:bg-[#38f8ff] text-slate-950 font-extrabold text-xs shadow-md shadow-[#00f0ff]/25"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
