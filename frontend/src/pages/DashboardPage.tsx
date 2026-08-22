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
  GraduationCap,
  Gift,
  HelpCircle,
  MessageSquareWarning,
  CheckCircle2,
  X,
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
        <div className="h-24 bg-white rounded-2xl border border-slate-200" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200" />
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              {isAdminOrHr ? 'Executive Command Center' : 'Employee Self-Service (ESS) Hub'}
            </span>
            <Badge variant="success" size="sm">Operational</Badge>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1 font-display tracking-tight">
            Welcome back, {user?.profile?.firstName}!
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Staff Badge: <span className="font-mono text-slate-700 font-semibold">{user?.employeeId}</span> &bull; {user?.profile?.designation} &bull; {user?.profile?.department}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsBenefitsOpen(true)}
            leftIcon={<Gift className="w-4 h-4 text-purple-600" />}
          >
            My Benefits
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsGrievanceOpen(true)}
            leftIcon={<MessageSquareWarning className="w-4 h-4 text-amber-600" />}
          >
            File Grievance
          </Button>

          {isAdminOrHr ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsBatchPayrollOpen(true)}
              leftIcon={<PlayCircle className="w-4 h-4" />}
            >
              Run Batch Payroll
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsApplyLeaveOpen(true)}
              leftIcon={<Calendar className="w-4 h-4" />}
            >
              Apply Leave
            </Button>
          )}
        </div>
      </div>

      {/* Quick Launchpad Chips for USP Features */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => navigate('/wellness')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-rose-300 hover:bg-rose-50/40 text-left transition-all group shadow-sm cursor-pointer"
        >
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs">
            <HeartPulse className="w-4 h-4" /> Wellness & Fatigue
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Burnout Score & Surveys &rarr;</div>
        </button>

        <button
          onClick={() => navigate('/performance')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-left transition-all group shadow-sm cursor-pointer"
        >
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
            <Target className="w-4 h-4" /> Performance & OKRs
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">KPIs & Continuous Feedback &rarr;</div>
        </button>

        <button
          onClick={() => navigate('/learning')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-left transition-all group shadow-sm cursor-pointer"
        >
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
            <GraduationCap className="w-4 h-4" /> Skill Gap Matrix
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">AI Learning & Certifications &rarr;</div>
        </button>

        <button
          onClick={() => navigate('/payroll')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-left transition-all group shadow-sm cursor-pointer"
        >
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
            <CreditCard className="w-4 h-4" /> Salary & Payslips
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">1-Click PDF Downloads &rarr;</div>
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
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-display">
            <CalendarCheck className="w-5 h-5 text-blue-600" /> Annual Leave Quota Balances
          </h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/leave')}>
            Manage Leaves &rarr;
          </Button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageSquareWarning className="w-5 h-5 text-amber-500" /> File Confidential Grievance
              </h3>
              <button onClick={() => setIsGrievanceOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGrievanceSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Grievance Category</label>
                <select
                  value={grievanceCategory}
                  onChange={(e) => setGrievanceCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:border-blue-600"
                >
                  <option value="WORKPLACE_ENVIRONMENT">Workplace Environment & Safety</option>
                  <option value="COMPENSATION_BENEFITS">Compensation & Payroll Discrepancy</option>
                  <option value="MANAGERIAL_CONDUCT">Managerial Conduct & Fairness</option>
                  <option value="WORKLOAD_STRESS">Acute Workload & Overtime Pressure</option>
                  <option value="OTHER">Other Confidential Matter</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Particulars</label>
                <textarea
                  rows={4}
                  required
                  value={grievanceNote}
                  onChange={(e) => setGrievanceNote(e.target.value)}
                  placeholder="Provide objective context, dates, and specifics for HR investigation..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                🔒 <strong>Whistleblower Protection Policy</strong>: Submissions are encrypted and reviewed solely by the Ethics & Compliance Committee.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => setIsGrievanceOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Submit Grievance
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Benefits Modal */}
      {isBenefitsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-600" /> Employee Benefits & Wellness Perks
              </h3>
              <button onClick={() => setIsBenefitsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="text-2xl">🏥</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Comprehensive Health & Dental Coverage</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">$500,000 corporate medical coverage for you and direct dependents.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="text-2xl">🧘</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Annual Wellness & Gym Stipend</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">$1,200/year reimbursement for gym memberships, therapy, and fitness gear.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="text-2xl">📚</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Learning & Certification Budget</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">$2,000/year for accredited conferences, books, and university credentials.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={() => setIsBenefitsOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
