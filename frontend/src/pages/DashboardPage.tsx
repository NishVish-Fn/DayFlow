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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user, role } = useAuth();
  const isAdminOrHr = role === 'ADMIN' || role === 'HR_MANAGER';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState<any>(null);
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);

  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [isBatchPayrollOpen, setIsBatchPayrollOpen] = useState(false);

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

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-slate-900 rounded-2xl border border-slate-800" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-900 rounded-2xl border border-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // ADMIN & HR COMMAND CENTER
  // --------------------------------------------------------------------------
  if (isAdminOrHr && adminData) {
    return (
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/20 shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Executive Command Center
              </span>
              <Badge variant="primary" size="sm">HQ LIVE</Badge>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Welcome back, {user?.profile?.firstName}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Organization workforce metrics, live attendance rates, and pending approval queues.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsBatchPayrollOpen(true)}
              leftIcon={<PlayCircle className="w-4 h-4 text-indigo-400" />}
            >
              Run Batch Payroll
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/employees')}
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Onboard Employee
            </Button>
          </div>
        </div>

        {/* Top KPI Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Headcount"
            value={adminData.headcount}
            subtitle="Active full-time & contract staff"
            icon={<Users className="w-5 h-5" />}
            variant="indigo"
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

        {/* Section 2: Department Distribution & Quick Approvals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" /> Department Distribution
              </h3>
              <span className="text-[11px] text-slate-400">
                {adminData.departmentBreakdown.length} Departments
              </span>
            </div>

            <div className="space-y-3">
              {adminData.departmentBreakdown.map((dept: any) => {
                const percentage = Math.round((dept.count / adminData.headcount) * 100);
                return (
                  <div key={dept.department} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">{dept.department}</span>
                      <span className="text-slate-400">{dept.count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-1.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's Operational Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" /> Today's Presence Roll
                </h3>
                <Badge variant="success" size="sm">LIVE TODAY</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="text-slate-400">Clocked In (Office)</div>
                  <div className="text-xl font-bold text-white mt-1">
                    {adminData.attendance?.officeCount}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="text-slate-400">Clocked In (Remote)</div>
                  <div className="text-xl font-bold text-indigo-300 mt-1">
                    {adminData.attendance?.remoteCount}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="text-slate-400">On Approved Leave</div>
                  <div className="text-xl font-bold text-amber-300 mt-1">
                    {adminData.attendance?.onLeaveCount}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="text-slate-400">Unaccounted / Absent</div>
                  <div className="text-xl font-bold text-rose-400 mt-1">
                    {adminData.attendance?.absentCount}
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              onClick={() => navigate('/attendance')}
            >
              View Full Team Attendance Grid &rarr;
            </Button>
          </div>

          {/* Pending Approval Shortcut Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-amber-400" /> Pending Workflows
                </h3>
                <Badge variant="warning" size="sm">
                  {adminData.pendingLeaveApprovals} Pending
                </Badge>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Employees have submitted leave requests that require managerial verification of quotas and scheduling overlap checks.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              className="w-full mt-4"
              onClick={() => navigate('/leave')}
            >
              Open Leave Approvals Queue &rarr;
            </Button>
          </div>
        </div>

        {/* Section 3: Live Punch Clock for the Admin + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PunchClockWidget onAttendanceChange={fetchDashboard} />
          </div>

          {/* Recent Audit Trail Snippet */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-400" /> Recent System Audit Logs
              </h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/audit-logs')}>
                View All
              </Button>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto">
              {adminData.recentActivity?.map((act: any) => (
                <div
                  key={act.id}
                  className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-200">{act.action}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{act.userEmail || 'System'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isBatchPayrollOpen && (
          <BatchPayrollModal
            isOpen={isBatchPayrollOpen}
            onClose={() => setIsBatchPayrollOpen(false)}
            onSuccess={fetchDashboard}
          />
        )}
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // EMPLOYEE SELF-SERVICE DASHBOARD
  // --------------------------------------------------------------------------
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Employee Portal
            </span>
            <Badge variant="primary" size="sm">{user?.profile?.department}</Badge>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Welcome back, {user?.profile?.firstName}!
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Staff Badge: <span className="font-mono text-slate-300">{user?.employeeId}</span> &bull; {user?.profile?.designation}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsApplyLeaveOpen(true)}
            leftIcon={<Calendar className="w-4 h-4" />}
          >
            Apply for Leave
          </Button>
        </div>
      </div>

      {/* Primary Widget: Live Punch Clock */}
      <PunchClockWidget onAttendanceChange={fetchDashboard} />

      {/* Leave Balances Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-indigo-400" /> My Annual Leave Quotas
          </h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/leave')}>
            Manage Leaves &rarr;
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {employeeData?.leaveBalances?.map((b: any) => (
            <LeaveBalanceCard key={b.id} balance={b} />
          ))}
        </div>
      </div>

      {/* Bottom Grid: Recent Payslips & Public Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payslips */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-400" /> Recent Payslips
              </h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/payroll')}>
                View All
              </Button>
            </div>

            <div className="space-y-2.5">
              {employeeData?.recentPayslips?.map((p: any) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-100">
                      Period: {p.month}/{p.year}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Disbursed on {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : 'Pending'}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-indigo-300 block font-mono">
                      ${p.netAmount.toLocaleString()}
                    </span>
                    <Badge variant="success" size="sm">{p.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-4"
            onClick={() => navigate('/payroll')}
            leftIcon={<FileText className="w-4 h-4" />}
          >
            Access Full Payroll Archive
          </Button>
        </div>

        {/* Upcoming Holidays */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Company Public Holidays
            </h3>
            <Badge variant="neutral" size="sm">2026 Calendar</Badge>
          </div>

          <div className="space-y-2.5">
            {employeeData?.holidays?.map((h: any) => (
              <div
                key={h.name}
                className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-200">{h.name}</span>
                  <div className="text-[11px] text-slate-400 mt-0.5">Official Company Holiday</div>
                </div>
                <Badge variant="purple" size="sm">
                  {new Date(h.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isApplyLeaveOpen && (
        <ApplyLeaveModal
          isOpen={isApplyLeaveOpen}
          onClose={() => setIsApplyLeaveOpen(false)}
          leaveBalances={employeeData?.leaveBalances || []}
          leaveTypes={leaveTypes}
          onSuccess={fetchDashboard}
        />
      )}
    </div>
  );
};
