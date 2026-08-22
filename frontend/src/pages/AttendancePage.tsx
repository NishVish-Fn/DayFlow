import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { PunchClockWidget } from '../components/attendance/PunchClockWidget';
import { ManualAttendanceModal } from '../components/attendance/ManualAttendanceModal';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Clock, Calendar, ShieldCheck, Filter, PlusCircle } from 'lucide-react';
import { AttendanceRecord, EmployeeProfile } from '../types';

export const AttendancePage: React.FC = () => {
  const { role } = useAuth();
  const isAdminOrHr = role === 'ADMIN' || role === 'HR_MANAGER';

  const [activeTab, setActiveTab] = useState<'my-attendance' | 'team-muster'>(
    isAdminOrHr ? 'team-muster' : 'my-attendance'
  );

  // My Attendance States
  const [myHistory, setMyHistory] = useState<{
    metrics: any;
    records: AttendanceRecord[];
  } | null>(null);

  // Team Muster States
  const [teamRecords, setTeamRecords] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [department, setDepartment] = useState('ALL');
  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMyHistory = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/attendance/my-history');
      setMyHistory(data.data);
    } catch (e) {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMuster = async () => {
    try {
      setLoading(true);
      const params: any = { date: selectedDate };
      if (department !== 'ALL') params.department = department;

      const [teamRes, empRes] = await Promise.all([
        api.get('/attendance/team', { params }),
        api.get('/employees'),
      ]);

      setTeamRecords(teamRes.data.data.records);
      setEmployees(empRes.data.data.employees);
    } catch (e) {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'my-attendance') {
      fetchMyHistory();
    } else if (isAdminOrHr && activeTab === 'team-muster') {
      fetchTeamMuster();
    }
  }, [activeTab, selectedDate, department]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'success';
      case 'HALF_DAY':
        return 'warning';
      case 'ON_LEAVE':
        return 'purple';
      case 'ABSENT':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-display">
            <Clock className="w-5 h-5 text-blue-600" /> Attendance Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time punch clock, monthly muster logs, and administrative attendance adjustments.
          </p>
        </div>

        {isAdminOrHr && activeTab === 'team-muster' && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsManualModalOpen(true)}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Manual Adjustment Override
          </Button>
        )}
      </div>

      {/* Tabs */}
      {isAdminOrHr && (
        <div className="flex border-b border-slate-200 gap-4">
          <button
            onClick={() => setActiveTab('team-muster')}
            className={`flex items-center gap-2 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'team-muster'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Team Attendance Muster Roll
          </button>

          <button
            onClick={() => setActiveTab('my-attendance')}
            className={`flex items-center gap-2 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'my-attendance'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" /> My Personal Punch Clock
          </button>
        </div>
      )}

      {/* TAB 1: TEAM MUSTER ROLL (Admin / HR) */}
      {activeTab === 'team-muster' && isAdminOrHr && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Muster Roll Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
              />
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

          {/* Team Muster Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Employee</th>
                    <th className="py-3.5 px-4">Department / Badge</th>
                    <th className="py-3.5 px-4">Clock In</th>
                    <th className="py-3.5 px-4">Clock Out</th>
                    <th className="py-3.5 px-4">Total Hours</th>
                    <th className="py-3.5 px-4">Work Mode</th>
                    <th className="py-3.5 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        Loading muster roll...
                      </td>
                    </tr>
                  ) : teamRecords.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        No attendance records logged for {selectedDate}.
                      </td>
                    </tr>
                  ) : (
                    teamRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={
                                r.employee?.avatarUrl ||
                                `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.employee?.firstName}`
                              }
                              alt="Avatar"
                              className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200"
                            />
                            <div>
                              <div className="font-bold text-slate-900">
                                {r.employee?.firstName} {r.employee?.lastName}
                              </div>
                              <div className="text-[10px] text-slate-500 font-medium">
                                {r.employee?.designation}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge variant="neutral" size="sm">
                            {r.employee?.department}
                          </Badge>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            {r.employee?.user?.employeeId}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-700 font-medium">
                          {r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-700 font-medium">
                          {r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {r.totalHours > 0 ? `${r.totalHours} hrs` : 'In Progress'}
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge variant={r.workMode === 'REMOTE' ? 'primary' : 'neutral'} size="sm">
                            {r.workMode}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <Badge variant={getStatusBadgeVariant(r.status)} size="sm">
                            {r.status}
                          </Badge>
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

      {/* TAB 2: MY PERSONAL ATTENDANCE */}
      {activeTab === 'my-attendance' && (
        <div className="space-y-6">
          <PunchClockWidget onAttendanceChange={fetchMyHistory} />

          {/* Monthly Log Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" /> Monthly Punch Log
              </h3>
              {myHistory?.metrics && (
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>
                    Days Present: <strong className="text-emerald-600 font-bold">{myHistory.metrics.totalDaysPresent}</strong>
                  </span>
                  <span>
                    Total Hours: <strong className="text-slate-900 font-bold">{myHistory.metrics.totalHours} hrs</strong>
                  </span>
                  <span>
                    Average/Day: <strong className="text-blue-600 font-bold">{myHistory.metrics.averageHoursPerDay} hrs</strong>
                  </span>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Clock In</th>
                    <th className="py-3 px-4">Clock Out</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Work Mode</th>
                    <th className="py-3 px-4">Notes</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myHistory?.records.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {new Date(r.date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString() : '—'}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString() : '—'}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {r.totalHours} hrs
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={r.workMode === 'REMOTE' ? 'primary' : 'neutral'} size="sm">
                          {r.workMode}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                        {r.notes || '—'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Badge variant={getStatusBadgeVariant(r.status)} size="sm">
                          {r.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Manual Attendance Modal */}
      {isManualModalOpen && (
        <ManualAttendanceModal
          isOpen={isManualModalOpen}
          onClose={() => setIsManualModalOpen(false)}
          employees={employees}
          onSaved={fetchTeamMuster}
        />
      )}
    </div>
  );
};
