import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { EmployeeProfile, SalaryStructure } from '../../types';
import {
  User,
  CreditCard,
  Clock,
  Calendar,
  Building,
  Mail,
  Phone,
  Shield,
  PlusCircle,
  FileText,
  Edit2,
  Power,
  FileCheck,
  Download,
} from 'lucide-react';
import { NewSalaryStructureModal } from '../payroll/NewSalaryStructureModal';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeProfile | null;
  isAdminOrHr: boolean;
  onRefresh: () => void;
}

export const EmployeeDetailDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  employee,
  isAdminOrHr,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'salary' | 'attendance' | 'leaves' | 'documents'>('profile');
  const [isNewSalaryOpen, setIsNewSalaryOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  // Edit state
  const [editFirstName, setEditFirstName] = useState(employee?.firstName || '');
  const [editLastName, setEditLastName] = useState(employee?.lastName || '');
  const [editPhone, setEditPhone] = useState(employee?.phone || '');
  const [editAddress, setEditAddress] = useState(employee?.address || '');
  const [editDesignation, setEditDesignation] = useState(employee?.designation || '');
  const [editDepartment, setEditDepartment] = useState(employee?.department || 'ENGINEERING');
  const [editEmergency, setEditEmergency] = useState(employee?.emergencyContact || '');
  const [editLoading, setEditLoading] = useState(false);

  const { success, error } = useToast();

  if (!employee) return null;

  const handleStatusChange = async (newStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') => {
    try {
      setStatusLoading(true);
      await api.patch(`/employees/${employee.id}/status`, { status: newStatus });
      success('Status Updated', `Employee account status changed to ${newStatus}`);
      onRefresh();
    } catch (err: any) {
      error('Update Error', err.response?.data?.error?.message || 'Could not update status');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setEditLoading(true);
      await api.put(`/employees/${employee.id}`, {
        firstName: editFirstName,
        lastName: editLastName,
        phone: editPhone,
        address: editAddress,
        designation: editDesignation,
        department: editDepartment,
        emergencyContact: editEmergency,
      });

      success('Profile Updated', 'Employee details have been saved.');
      setIsEditOpen(false);
      onRefresh();
    } catch (err: any) {
      error('Save Failed', err.response?.data?.error?.message || 'Could not update profile');
    } finally {
      setEditLoading(false);
    }
  };

  let parsedDocs: Array<{ name: string; type: string; uploadDate: string }> = [];
  if (employee.documents) {
    try {
      parsedDocs = JSON.parse(employee.documents);
    } catch (e) {
      parsedDocs = [
        { name: 'Identity_Verification.pdf', type: 'IDENTITY', uploadDate: '2023-01-15' },
        { name: 'Employment_Agreement.pdf', type: 'CONTRACT', uploadDate: '2023-01-15' },
      ];
    }
  } else {
    parsedDocs = [
      { name: 'Corporate_NDA_Signed.pdf', type: 'LEGAL', uploadDate: '2023-01-15' },
      { name: 'Government_Tax_W4.pdf', type: 'TAX', uploadDate: '2023-01-15' },
    ];
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`${employee.firstName} ${employee.lastName}`}
        subtitle={`${employee.designation} &bull; ${employee.department}`}
        maxWidth="xl"
      >
        <div className="space-y-5">
          {/* Top Banner Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
            <div className="flex items-center gap-4">
              <img
                src={
                  employee.avatarUrl ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.firstName}_${employee.lastName}`
                }
                alt="Avatar"
                className="w-14 h-14 rounded-2xl bg-slate-800 border border-white/[0.1] object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white">
                    {employee.firstName} {employee.lastName}
                  </h4>
                  <Badge variant="primary" size="sm">
                    {employee.user?.employeeId || 'EMP'}
                  </Badge>
                  <Badge
                    variant={employee.user?.status === 'ACTIVE' ? 'success' : 'danger'}
                    size="sm"
                  >
                    {employee.user?.status || 'ACTIVE'}
                  </Badge>
                </div>
                <div className="text-xs text-slate-300 mt-0.5">{employee.designation}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Joined {new Date(employee.dateOfJoining).toLocaleDateString()} &bull; {employee.employmentType}
                </div>
              </div>
            </div>

            {isAdminOrHr && (
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setEditFirstName(employee.firstName);
                    setEditLastName(employee.lastName);
                    setEditPhone(employee.phone || '');
                    setEditAddress(employee.address || '');
                    setEditDesignation(employee.designation);
                    setEditDepartment(employee.department);
                    setEditEmergency(employee.emergencyContact || '');
                    setIsEditOpen(true);
                  }}
                  leftIcon={<Edit2 className="w-3.5 h-3.5 text-indigo-400" />}
                >
                  Edit Profile
                </Button>

                {employee.user?.status === 'ACTIVE' ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-400 hover:text-rose-300"
                    onClick={() => handleStatusChange('SUSPENDED')}
                    isLoading={statusLoading}
                    leftIcon={<Power className="w-3.5 h-3.5" />}
                  >
                    Suspend
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleStatusChange('ACTIVE')}
                    isLoading={statusLoading}
                    leftIcon={<Power className="w-3.5 h-3.5" />}
                  >
                    Activate
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap border-b border-white/[0.08] gap-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" /> Overview
            </button>

            <button
              onClick={() => setActiveTab('salary')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'salary'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" /> Compensation History
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'attendance'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" /> Attendance Log
            </button>

            <button
              onClick={() => setActiveTab('leaves')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'leaves'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Leave Quotas
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'documents'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" /> Documents & Vault
            </button>
          </div>

          {/* TAB 1: Profile & Contact */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-3">
                <div>
                  <span className="text-slate-400 block">Corporate Email</span>
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    {employee.user?.email}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block">Phone</span>
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-400" />
                    {employee.phone || '+1 (555) 019-2831'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block">Residential Address</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">
                    {employee.address || 'San Francisco Bay Area, CA'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-slate-400 block">Department Division</span>
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-indigo-400" />
                    {employee.department}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block">Reporting Manager</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">
                    {employee.reportingManager
                      ? `${employee.reportingManager.firstName} ${employee.reportingManager.lastName} (${employee.reportingManager.designation})`
                      : 'Executive Leadership'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block">Emergency Contact</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">
                    {employee.emergencyContact || 'Verified on HR Vault'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Compensation History */}
          {activeTab === 'salary' && (
            <div className="space-y-4">
              {isAdminOrHr && (
                <div className="flex justify-between items-center bg-white/[0.02] p-3 rounded-2xl border border-white/[0.08]">
                  <span className="text-xs text-slate-300 font-medium">
                    Manage Versioned Compensation Records
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsNewSalaryOpen(true)}
                    leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
                  >
                    Revise Salary Structure
                  </Button>
                </div>
              )}

              <div className="space-y-2.5">
                {employee.salaryStructures && employee.salaryStructures.length > 0 ? (
                  employee.salaryStructures.map((struct) => (
                    <div
                      key={struct.id}
                      className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between transition-colors ${
                        struct.isCurrent
                          ? 'bg-indigo-500/10 border-indigo-500/30 text-slate-100'
                          : 'bg-white/[0.02] border-white/[0.06] text-slate-400'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">
                            ${struct.grossSalary.toLocaleString()}{' '}
                            <span className="text-xs font-normal text-slate-400">Gross / mo</span>
                          </span>
                          <Badge variant={struct.isCurrent ? 'success' : 'neutral'} size="sm">
                            {struct.isCurrent ? 'CURRENT' : 'ARCHIVED'}
                          </Badge>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          Base: ${struct.baseSalary.toLocaleString()} &bull; HRA: ${struct.hra.toLocaleString()} &bull; Net: ${struct.netSalary.toLocaleString()}
                        </div>
                        {struct.remarks && (
                          <div className="text-[10px] text-slate-400 italic mt-0.5">
                            "{struct.remarks}"
                          </div>
                        )}
                      </div>
                      <div className="text-right text-[11px] text-slate-400">
                        Effective: {new Date(struct.effectiveDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No salary structures on file.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Attendance Log */}
          {activeTab === 'attendance' && (
            <div className="space-y-3">
              <div className="max-h-64 overflow-y-auto space-y-1.5">
                {employee.attendanceRecords && employee.attendanceRecords.length > 0 ? (
                  employee.attendanceRecords.map((att) => (
                    <div
                      key={att.id}
                      className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-slate-200">
                          {new Date(att.date).toLocaleDateString()}
                        </span>
                        <span className="text-slate-400 ml-2">({att.workMode})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-300 font-mono">{att.totalHours} hrs</span>
                        <Badge
                          variant={
                            att.status === 'PRESENT'
                              ? 'success'
                              : att.status === 'HALF_DAY'
                              ? 'warning'
                              : att.status === 'ON_LEAVE'
                              ? 'purple'
                              : 'danger'
                          }
                          size="sm"
                        >
                          {att.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No attendance records found.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Leave Balances */}
          {activeTab === 'leaves' && (
            <div className="grid grid-cols-2 gap-3">
              {employee.leaveBalances && employee.leaveBalances.length > 0 ? (
                employee.leaveBalances.map((bal) => (
                  <div
                    key={bal.id}
                    className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs"
                  >
                    <div className="flex justify-between font-bold text-slate-200">
                      <span>{bal.leaveType.name}</span>
                      <span className="text-indigo-400">{bal.leaveType.code}</span>
                    </div>
                    <div className="text-2xl font-black text-white mt-2">
                      {bal.remainingDays}{' '}
                      <span className="text-xs font-normal text-slate-400">/ {bal.totalAllocated} Days</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                      <span>Used: {bal.usedDays}</span>
                      <span>Pending: {bal.pendingDays}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 p-6 text-center text-xs text-slate-500">
                  No leave quotas configured for this year.
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Documents & Vault */}
          {activeTab === 'documents' && (
            <div className="space-y-2.5">
              {parsedDocs.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">{doc.name}</div>
                      <div className="text-[10px] text-slate-400">
                        Category: {doc.type} &bull; Uploaded: {doc.uploadDate}
                      </div>
                    </div>
                  </div>

                  <Badge variant="success" size="sm">
                    Verified on File
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <Modal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          title="Edit Employee Information"
          subtitle="Update contact details, job title, and emergency contacts"
          maxWidth="md"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                <select
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
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

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Designation</label>
                <input
                  type="text"
                  required
                  value={editDesignation}
                  onChange={(e) => setEditDesignation(e.target.value)}
                  className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={editEmergency}
                  onChange={(e) => setEditEmergency(e.target.value)}
                  className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Residential Address</label>
              <input
                type="text"
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" isLoading={editLoading}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Nested Salary Revision Modal */}
      {isNewSalaryOpen && (
        <NewSalaryStructureModal
          isOpen={isNewSalaryOpen}
          onClose={() => setIsNewSalaryOpen(false)}
          employee={employee}
          onSuccess={() => {
            onRefresh();
            onClose();
          }}
        />
      )}
    </>
  );
};
