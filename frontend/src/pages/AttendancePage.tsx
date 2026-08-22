import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { PunchClockWidget } from '../components/attendance/PunchClockWidget';
import { ManualAttendanceModal } from '../components/attendance/ManualAttendanceModal';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  Clock,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
  CheckCircle2,
  CalendarDays,
  Plus,
} from 'lucide-react';
import { AttendanceRecord, EmployeeProfile } from '../types';
import { ENTERPRISE_ATTENDANCE } from '../utils/mockEnterpriseData';

export const AttendancePage: React.FC = () => {
  const { user, role } = useAuth();
  const isAdminOrHr = role === 'ADMIN' || role === 'HR_MANAGER';

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  const [records, setRecords] = useState<any[]>([
    {
      id: 'att-1',
      date: '2026-08-22',
      employeeName: `${user?.profile?.firstName || 'Alex'} ${user?.profile?.lastName || 'Chen'}`,
      checkIn: '09:02 AM',
      checkOut: '05:32 PM',
      workHours: '8.0 hrs',
      extraHours: '0.5 hrs',
      status: 'PRESENT',
    },
    {
      id: 'att-2',
      date: '2026-08-21',
      employeeName: `${user?.profile?.firstName || 'Alex'} ${user?.profile?.lastName || 'Chen'}`,
      checkIn: '09:15 AM',
      checkOut: '06:00 PM',
      workHours: '8.2 hrs',
      extraHours: '0.75 hrs',
      status: 'PRESENT',
    },
    {
      id: 'att-3',
      date: '2026-08-20',
      employeeName: `${user?.profile?.firstName || 'Alex'} ${user?.profile?.lastName || 'Chen'}`,
      checkIn: '08:55 AM',
      checkOut: '05:10 PM',
      workHours: '7.8 hrs',
      extraHours: '0.0 hrs',
      status: 'PRESENT',
    },
    {
      id: 'att-4',
      date: '2026-08-19',
      employeeName: `${user?.profile?.firstName || 'Alex'} ${user?.profile?.lastName || 'Chen'}`,
      checkIn: '—',
      checkOut: '—',
      workHours: '0.0 hrs',
      extraHours: '0.0 hrs',
      status: 'ON_LEAVE',
    },
  ]);

  const [adminTeamRecords, setAdminTeamRecords] = useState<any[]>(ENTERPRISE_ATTENDANCE);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-[#0071e3]" /> Attendance Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            §7 Specification &bull; Day-Wise Check In/Out Ledger & Payable Days Engine
          </p>
        </div>
      </div>

      {/* Systray Live Punch Clock Widget */}
      <PunchClockWidget />

      {/* §7 Admin Summary Metrics: Count of days present | Leaves count | Total working days */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Count of Days Present</span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">19 Days</div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Leaves Count</span>
            <div className="text-2xl font-bold text-[#0071e3] dark:text-[#2997ff] mt-1 font-mono">2 Days</div>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/10 text-[#0071e3] font-bold">
            <CalendarDays className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Total Working Days</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-mono">22 Days</div>
          </div>
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Date Navigation & Search Controls (§7 Spec) */}
      <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-bold text-xs text-slate-900 dark:text-white px-3 py-1.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04]">
            {monthNames[currentMonth]} {currentYear}
          </span>

          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Date Picker & Search (§7 Spec) */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0071e3]"
          />

          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search employee / date..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.08] rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0071e3]"
            />
          </div>
        </div>
      </div>

      {/* §7 Spec Table Columns: Employee | Check In | Check Out | Work Hours | Extra Hours */}
      <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-900 border-b border-black/[0.05] dark:border-white/[0.08] text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Check In</th>
                <th className="py-3 px-4">Check Out</th>
                <th className="py-3 px-4">Work Hours</th>
                <th className="py-3 px-4">Extra Hours</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
              {(isAdminOrHr ? adminTeamRecords : records).map((row) => (
                <tr key={row.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {row.date}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    {row.employeeName}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                    {row.checkIn}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                    {row.checkOut}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {row.workHours}
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {row.extraHours}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant={row.status === 'PRESENT' ? 'success' : 'purple'} size="sm">
                      {row.status === 'PRESENT' ? '🟢 Present' : '✈️ On Leave'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
