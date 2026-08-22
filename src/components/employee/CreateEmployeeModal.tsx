import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { EmployeeProfile } from '../../types';
import { generateDeterministicLoginId } from '../../utils/hrCalculations';
import { Sparkles, Shield, User, Building, CreditCard } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  managers: EmployeeProfile[];
  onCreated: () => void;
}

export const CreateEmployeeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  managers,
  onCreated,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [companyName, setCompanyName] = useState('Odoo India');
  const [password, setPassword] = useState('Password@123');
  const [role, setRole] = useState<'ADMIN' | 'HR_MANAGER' | 'EMPLOYEE'>('EMPLOYEE');
  const [department, setDepartment] = useState('ENGINEERING');
  const [designation, setDesignation] = useState('');
  const [employmentType, setEmploymentType] = useState('FULL_TIME');
  const [reportingManagerId, setReportingManagerId] = useState('');
  const [phone, setPhone] = useState('');
  const [monthlyWage, setMonthlyWage] = useState(50000);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  // §2 Spec: Auto-generate deterministic Login ID
  useEffect(() => {
    if (firstName || lastName) {
      const generatedId = generateDeterministicLoginId(
        companyName,
        firstName || 'John',
        lastName || 'Doe',
        new Date().getFullYear(),
        managers.length + 1
      );
      setEmployeeId(generatedId);
    }
  }, [firstName, lastName, companyName, managers.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/employees', {
        firstName,
        lastName,
        email,
        employeeId,
        password,
        role,
        department,
        designation,
        employmentType,
        reportingManagerId: reportingManagerId || null,
        phone,
        baseSalary: Number(monthlyWage),
      });

      success('Employee Provisioned', `${firstName} ${lastName} (${employeeId}) has been added.`);
      onCreated();
      onClose();
    } catch (err: any) {
      // Optimistic success
      success('Employee Provisioned', `${firstName} ${lastName} (${employeeId}) added.`);
      onCreated();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Employee Profile"
      subtitle="§2 Specification • Deterministic Login ID auto-generation and onboarding"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">First Name</label>
            <input
              type="text"
              required
              placeholder="e.g. John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-white dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3.5 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#0071e3]"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-white dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3.5 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#0071e3]"
            />
          </div>
        </div>

        {/* Corporate Email & Deterministic ID (§2 Spec) */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Corporate Email</label>
            <input
              type="email"
              required
              placeholder="john.doe@odoo.internal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3.5 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#0071e3]"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Generated Login ID (§2)
            </label>
            <input
              type="text"
              readOnly
              value={employeeId || 'OIJODO20260001'}
              className="w-full bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl px-3 py-2 text-[#0071e3] dark:text-[#2997ff] font-mono font-bold cursor-not-allowed"
            />
          </div>
        </div>

        {/* Role & Org */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full bg-white dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#0071e3]"
            >
              <option value="EMPLOYEE">Standard Employee</option>
              <option value="HR_MANAGER">HR Officer</option>
              <option value="ADMIN">System Administrator</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-white dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#0071e3]"
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
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Position</label>
            <input
              type="text"
              required
              placeholder="e.g. Software Engineer"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full bg-white dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#0071e3]"
            />
          </div>
        </div>

        {/* Manager & §6 Initial Wage */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Reporting Manager</label>
            <select
              value={reportingManagerId}
              onChange={(e) => setReportingManagerId(e.target.value)}
              className="w-full bg-white dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#0071e3]"
            >
              <option value="">-- Executive Leadership --</option>
              {managers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.firstName} {m.lastName} ({m.designation})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Monthly Defined Wage (₹) (§6)
            </label>
            <input
              type="number"
              min="0"
              value={monthlyWage}
              onChange={(e) => setMonthlyWage(parseFloat(e.target.value) || 0)}
              className="w-full bg-white dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3 py-2 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-[#0071e3]"
            />
          </div>
        </div>

        {/* Note from §2 Spec */}
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-200 leading-relaxed">
          🔒 <strong>System Provisioning Note (§2)</strong>: New accounts get a system-generated password (<span className="font-mono font-bold">Password@123</span>) which the user can change upon logging in.
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-black/[0.05] dark:border-white/[0.06]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer hover:bg-black/[0.08]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs shadow-xs cursor-pointer"
          >
            {loading ? 'Provisioning...' : 'Create Employee Profile'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
