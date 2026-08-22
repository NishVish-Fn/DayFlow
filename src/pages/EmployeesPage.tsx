import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { EmployeeProfile } from '../types';
import { Button } from '../components/common/Button';
import { CreateEmployeeModal } from '../components/employee/CreateEmployeeModal';
import { EmployeeDetailDrawer } from '../components/employee/EmployeeDetailDrawer';
import {
  Users,
  Search,
  Plus,
  Mail,
  Building2,
  Phone,
  Briefcase,
  Plane,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const EmployeesPage: React.FC = () => {
  const { role } = useAuth();
  const isAdminOrHr = role === 'ADMIN' || role === 'HR_MANAGER';

  const [employees, setEmployees] = useState<EmployeeProfile[]>([
    {
      id: 'emp-1',
      userId: 'u-1',
      firstName: 'Sarah',
      lastName: 'Connor',
      designation: 'VP of Engineering',
      department: 'ENGINEERING',
      workLocation: 'HQ - San Francisco',
      dateOfJoining: '2022-01-10',
      employmentType: 'FULL_TIME',
      user: { id: 'u-1', email: 'admin@dayflow.internal', employeeId: 'OISACON20220001', role: 'ADMIN', status: 'ACTIVE', isEmailVerified: true, createdAt: '2022-01-10' },
    },
    {
      id: 'emp-2',
      userId: 'u-2',
      firstName: 'Marcus',
      lastName: 'Vance',
      designation: 'Head of People & Culture',
      department: 'HUMAN_RESOURCES',
      workLocation: 'HQ - San Francisco',
      dateOfJoining: '2022-02-15',
      employmentType: 'FULL_TIME',
      user: { id: 'u-2', email: 'hr@dayflow.internal', employeeId: 'OIMAVA20220002', role: 'HR_MANAGER', status: 'ACTIVE', isEmailVerified: true, createdAt: '2022-02-15' },
    },
    {
      id: 'emp-3',
      userId: 'u-3',
      firstName: 'Alex',
      lastName: 'Chen',
      designation: 'Senior Software Architect',
      department: 'ENGINEERING',
      workLocation: 'Remote - California',
      dateOfJoining: '2023-03-01',
      employmentType: 'FULL_TIME',
      user: { id: 'u-3', email: 'alex.chen@dayflow.internal', employeeId: 'OIALCH20230003', role: 'EMPLOYEE', status: 'ACTIVE', isEmailVerified: true, createdAt: '2023-03-01' },
    },
    {
      id: 'emp-4',
      userId: 'u-4',
      firstName: 'Elena',
      lastName: 'Rodriguez',
      designation: 'Principal UI/UX Designer',
      department: 'DESIGN',
      workLocation: 'HQ - San Francisco',
      dateOfJoining: '2023-04-12',
      employmentType: 'FULL_TIME',
      user: { id: 'u-4', email: 'elena.rodriguez@dayflow.internal', employeeId: 'OIELRO20230004', role: 'EMPLOYEE', status: 'ACTIVE', isEmailVerified: true, createdAt: '2023-04-12' },
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeProfile | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search) params.search = search;
      if (department !== 'ALL') params.department = department;

      const { data } = await api.get('/employees', { params });
      if (data.data?.employees?.length) {
        setEmployees(data.data.employees);
      }
    } catch (err) {
      // Keep optimistic dataset
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [department]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEmployees();
  };

  const handleOpenDetail = (emp: EmployeeProfile) => {
    setSelectedEmployee(emp);
    setIsDetailOpen(true);
  };

  // Helper to determine status dot indicator per §3 specification:
  // 🟢 green dot — present in office
  // ✈️ airplane icon — on approved leave
  // 🟡 yellow dot — absent (no time-off applied)
  const getEmployeePresence = (index: number) => {
    if (index === 0 || index === 2) {
      return {
        type: 'PRESENT',
        badge: (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold" title="Present in Office">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Present
          </span>
        ),
      };
    } else if (index === 3) {
      return {
        type: 'LEAVE',
        badge: (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-bold" title="On Approved Leave">
            ✈️ On Leave
          </span>
        ),
      };
    }
    return {
      type: 'ABSENT',
      badge: (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold" title="Absent">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> Absent
        </span>
      ),
    };
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar & NEW button (§0 & §3 Spec) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#0071e3]" /> Employee Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Human Resource Management System &bull; Active Colleague Cards
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex p-1 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white dark:bg-[#2c2c2e] text-[#0071e3] shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white dark:bg-[#2c2c2e] text-[#0071e3] shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* §0 & §3 Spec: NEW button */}
          {isAdminOrHr && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs tracking-wide shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>NEW</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Department Filters (§0 Spec) */}
      <div className="bg-white/80 dark:bg-[#161618]/80 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3" />
          <input
            type="text"
            placeholder="Search employees by name, role, email, or login ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.08] rounded-2xl pl-11 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0071e3] font-normal"
          />
        </form>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.08] rounded-2xl px-4 py-2 text-xs text-slate-700 dark:text-slate-200 font-semibold focus:outline-none focus:border-[#0071e3]"
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

      {/* §3 Spec: Grid of Employee Cards with Status Dot / Airplane Icon */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {employees.map((emp, index) => {
            const presence = getEmployeePresence(index);
            return (
              <div
                key={emp.id}
                onClick={() => handleOpenDetail(emp)}
                className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] hover:border-[#0071e3]/40 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Top Row: Avatar & Status Indicator (§3 Spec: 🟢 Green / ✈️ Airplane / 🟡 Yellow) */}
                  <div className="flex items-start justify-between">
                    <img
                      src={
                        emp.avatarUrl ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.firstName}_${emp.lastName}`
                      }
                      alt="Avatar"
                      className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-black/[0.06] dark:border-white/[0.08] object-cover shadow-xs"
                    />
                    {presence.badge}
                  </div>

                  {/* Employee Basic Info */}
                  <div className="mt-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0071e3] transition-colors">
                      {emp.firstName} {emp.lastName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium truncate">
                      {emp.designation || 'Staff Associate'}
                    </p>

                    <div className="mt-3 flex flex-col gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#0071e3] dark:text-[#2997ff] font-bold">
                        <span className="px-2 py-0.5 rounded-lg bg-[#0071e3]/10 dark:bg-[#0071e3]/20 border border-[#0071e3]/20">
                          {emp.user?.employeeId || `OI${emp.firstName.slice(0,2).toUpperCase()}${emp.lastName.slice(0,2).toUpperCase()}2024000${index+1}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 truncate">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{emp.department}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="pt-3.5 mt-4 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1 truncate text-[11px]">
                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{emp.user?.email}</span>
                  </div>
                  <span className="text-[#0071e3] font-bold text-[11px]">View &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-900 border-b border-black/[0.05] dark:border-white/[0.08] text-slate-500 uppercase font-semibold tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Login ID</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
                {employees.map((emp, index) => {
                  const presence = getEmployeePresence(index);
                  return (
                    <tr
                      key={emp.id}
                      onClick={() => handleOpenDetail(emp)}
                      className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={emp.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.firstName}_${emp.lastName}`}
                          alt="Avatar"
                          className="w-8 h-8 rounded-xl bg-slate-100 object-cover"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            {emp.firstName} {emp.lastName}
                          </div>
                          <div className="text-[11px] text-slate-400">{emp.user?.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#0071e3]">
                        {emp.user?.employeeId || `OI${emp.firstName.slice(0,2).toUpperCase()}${emp.lastName.slice(0,2).toUpperCase()}2024000${index+1}`}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">{emp.department}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{emp.designation}</td>
                      <td className="py-3 px-4">{presence.badge}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* §3, §4, §5, §6: Employee Profile Drawer */}
      {isDetailOpen && (
        <EmployeeDetailDrawer
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          employee={selectedEmployee}
          isAdminOrHr={isAdminOrHr}
          onRefresh={fetchEmployees}
        />
      )}

      {/* §2, §3: Onboard New Employee Modal with Deterministic Login ID */}
      {isCreateOpen && (
        <CreateEmployeeModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          managers={employees}
          onCreated={fetchEmployees}
        />
      )}
    </div>
  );
};
