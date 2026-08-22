import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { EmployeeProfile } from '../types';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { CreateEmployeeModal } from '../components/employee/CreateEmployeeModal';
import { EmployeeDetailDrawer } from '../components/employee/EmployeeDetailDrawer';
import {
  Users,
  Search,
  PlusCircle,
  Mail,
  Building,
  ArrowUpDown,
  MoreVertical,
  Eye,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const EmployeesPage: React.FC = () => {
  const { role } = useAuth();
  const isAdminOrHr = role === 'ADMIN' || role === 'HR_MANAGER';

  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('ALL');
  const [status, setStatus] = useState('ALL');

  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeProfile | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { success, error } = useToast();

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search) params.search = search;
      if (department !== 'ALL') params.department = department;
      if (status !== 'ALL') params.status = status;

      const { data } = await api.get('/employees', { params });
      setEmployees(data.data.employees);
    } catch (err: any) {
      error('Failed to load employees', err.response?.data?.error?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [department, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEmployees();
  };

  const handleOpenDetail = async (id: string) => {
    try {
      const { data } = await api.get(`/employees/${id}`);
      setSelectedEmployee(data.data);
      setIsDetailOpen(true);
    } catch (e) {
      error('Error', 'Could not fetch full employee profile');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-display">
            <Users className="w-5 h-5 text-blue-600" /> Employee Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Browse and manage organizational profiles, roles, and compensation structures.
          </p>
        </div>

        {isAdminOrHr && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Onboard New Employee
          </Button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, role, email, or badge ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </form>

        <div className="flex gap-2">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-600"
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

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Employees Table Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Badge / Role</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Current Compensation</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Loading directory...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No employees matching filter criteria found.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                    onClick={() => handleOpenDetail(emp.id)}
                  >
                    {/* Employee Profile */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            emp.avatarUrl ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.firstName}_${emp.lastName}`
                          }
                          alt="Avatar"
                          className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 object-cover"
                        />
                        <div>
                          <div className="font-bold text-slate-900">
                            {emp.firstName} {emp.lastName}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {emp.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Badge & Role */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-blue-700 font-bold">{emp.user?.employeeId}</div>
                      <div className="text-[11px] text-slate-600">{emp.designation}</div>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4">
                      <Badge variant="neutral" size="sm">
                        {emp.department}
                      </Badge>
                    </td>

                    {/* Compensation */}
                    <td className="py-3.5 px-4">
                      {emp.currentSalary ? (
                        <div>
                          <span className="font-bold text-slate-900">
                            ${emp.currentSalary.grossSalary.toLocaleString()}/mo
                          </span>
                          <div className="text-[10px] text-slate-500">
                            Net: ${emp.currentSalary.netSalary.toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Unassigned</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={emp.user?.status === 'ACTIVE' ? 'success' : 'danger'}
                        size="sm"
                      >
                        {emp.user?.status}
                      </Badge>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenDetail(emp.id)}
                        leftIcon={<Eye className="w-3.5 h-3.5 text-blue-600" />}
                      >
                        View 360
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 360 Detail Drawer */}
      {isDetailOpen && (
        <EmployeeDetailDrawer
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          employee={selectedEmployee}
          isAdminOrHr={isAdminOrHr}
          onRefresh={fetchEmployees}
        />
      )}

      {/* Create Employee Modal */}
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
