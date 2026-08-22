import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { PunchClockWidget } from '../components/attendance/PunchClockWidget';
import { Badge } from '../components/common/Badge';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle2,
  CalendarDays,
  Filter,
} from 'lucide-react';
import { ENTERPRISE_EMPLOYEES } from '../utils/mockEnterpriseData';

export const AttendancePage: React.FC = () => {
  const { user, role } = useAuth();
  const isAdminOrHr = role === 'ADMIN' || role === 'HR_MANAGER';

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0-indexed (7 = August)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
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

  // Generate dynamic, realistic daily attendance records for the selected month and year
  const allMonthlyRecords = useMemo(() => {
    const records: any[] = [];
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Iterate through all days of the selected month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(currentYear, currentMonth, day);
      const dayOfWeek = dateObj.getDay(); // 0 = Sun, 6 = Sat
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      ENTERPRISE_EMPLOYEES.forEach((emp, empIdx) => {
        // Deterministic pseudo-randomness based on date and employee index
        const hash = (day * 31 + empIdx * 17 + currentMonth * 7) % 100;
        
        let status: 'PRESENT' | 'ON_LEAVE' | 'WEEKEND' = 'PRESENT';
        let checkIn = '09:00 AM';
        let checkOut = '05:30 PM';
        let workHours = '8.5 hrs';
        let extraHours = '0.5 hrs';
        let workMode = empIdx % 3 === 0 ? 'REMOTE' : 'OFFICE';

        if (isWeekend) {
          status = 'WEEKEND';
          checkIn = '—';
          checkOut = '—';
          workHours = '0.0 hrs';
          extraHours = '0.0 hrs';
        } else if (hash < 8) {
          // 8% chance of on leave
          status = 'ON_LEAVE';
          checkIn = '—';
          checkOut = '—';
          workHours = '0.0 hrs';
          extraHours = '0.0 hrs';
        } else {
          // Present
          const checkInMins = 45 + (hash % 30); // 08:45 to 09:15
          const hourIn = checkInMins >= 60 ? '09' : '08';
          const minIn = String(checkInMins % 60).padStart(2, '0');
          checkIn = `${hourIn}:${minIn} AM`;

          const checkOutMins = 15 + (hash % 45); // 05:15 to 06:00
          checkOut = `05:${String(checkOutMins).padStart(2, '0')} PM`;

          const totalH = 8.0 + (hash % 5) * 0.25;
          workHours = `${totalH.toFixed(1)} hrs`;
          extraHours = totalH > 8.0 ? `${(totalH - 8.0).toFixed(1)} hrs` : '0.0 hrs';
        }

        records.push({
          id: `att-${dateStr}-${emp.id}`,
          date: dateStr,
          dayNumber: day,
          employeeName: `${emp.firstName} ${emp.lastName}`,
          badgeId: emp.user?.employeeId || `EMP-10${empIdx}`,
          department: emp.department,
          workLocation: emp.workLocation,
          checkIn,
          checkOut,
          workHours,
          extraHours,
          workMode,
          status,
          employeeId: emp.id,
          userEmail: emp.user?.email,
        });
      });
    }

    return records;
  }, [currentMonth, currentYear]);

  // Filter records based on role, selectedDate, search string, and department
  const filteredRecords = useMemo(() => {
    let list = allMonthlyRecords;

    // If regular employee, only show their own records
    if (!isAdminOrHr) {
      list = list.filter(
        (r) =>
          r.userEmail === user?.email ||
          r.employeeName.toLowerCase().includes((user?.profile?.firstName || '').toLowerCase())
      );
    }

    // Filter by specific Date Picker if selected
    if (selectedDate) {
      list = list.filter((r) => r.date === selectedDate);
    }

    // Filter by Department
    if (departmentFilter !== 'ALL') {
      list = list.filter((r) => r.department === departmentFilter);
    }

    // Filter by Search text
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.employeeName.toLowerCase().includes(q) ||
          r.badgeId.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          r.date.includes(q)
      );
    }

    // Sort newest date first
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }, [allMonthlyRecords, selectedDate, search, departmentFilter, isAdminOrHr, user]);

  // Calculate dynamic metrics for the active view
  const metrics = useMemo(() => {
    const presentCount = filteredRecords.filter((r) => r.status === 'PRESENT').length;
    const leaveCount = filteredRecords.filter((r) => r.status === 'ON_LEAVE').length;
    const workingDays = filteredRecords.filter((r) => r.status !== 'WEEKEND').length;

    return {
      present: presentCount,
      leaves: leaveCount,
      total: workingDays,
    };
  }, [filteredRecords]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-[#0071e3]" /> Attendance & Telemetry Ledger
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            §7 Specification &bull; Day-Wise Check In/Out Ledger, Overtime Tracking & Payable Days
          </p>
        </div>
      </div>

      {/* Systray Live Punch Clock Widget */}
      <PunchClockWidget />

      {/* §7 Summary Metrics dynamically calculated from the filtered view */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
              Count of Days Present
            </span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
              {metrics.present} {selectedDate ? 'Staff' : 'Entries'}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
              Leaves Count
            </span>
            <div className="text-2xl font-bold text-[#0071e3] dark:text-[#2997ff] mt-1 font-mono">
              {metrics.leaves} {selectedDate ? 'Staff' : 'Days'}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/10 text-[#0071e3] font-bold">
            <CalendarDays className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
              Total Logged Records
            </span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-mono">
              {filteredRecords.length} Records
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Date Navigation & Search Controls */}
      <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-bold text-xs text-slate-900 dark:text-white px-3 py-1.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04]">
            {monthNames[currentMonth]} {currentYear}
          </span>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Date Filter, Department & Search */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Exact Date Picker */}
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0071e3]"
            />
            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate('')}
                className="text-[11px] text-[#0071e3] hover:underline cursor-pointer font-medium"
              >
                Clear Date
              </button>
            )}
          </div>

          {/* Department Filter */}
          {isAdminOrHr && (
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0071e3]"
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
          )}

          {/* Search Input */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search employee / badge..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.08] rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0071e3]"
            />
          </div>
        </div>
      </div>

      {/* §7 Table: Date | Employee | Check In | Check Out | Work Hours | Extra Hours | Status */}
      <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-900 sticky top-0 z-10 border-b border-black/[0.05] dark:border-white/[0.08] text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Check In</th>
                <th className="py-3 px-4">Check Out</th>
                <th className="py-3 px-4">Work Hours</th>
                <th className="py-3 px-4">Extra Hours</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No attendance records matching the selected date or search criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.slice(0, 100).map((row) => (
                  <tr key={row.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {row.date}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{row.employeeName}</div>
                      <div className="text-[10px] font-mono text-slate-400">{row.badgeId}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {row.department}
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
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Badge
                        variant={
                          row.status === 'PRESENT'
                            ? 'success'
                            : row.status === 'ON_LEAVE'
                            ? 'purple'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {row.status === 'PRESENT'
                          ? `🟢 ${row.workMode}`
                          : row.status === 'ON_LEAVE'
                          ? '✈️ On Leave'
                          : '🗓️ Weekend'}
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
  );
};
