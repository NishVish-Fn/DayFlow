import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BatchPayrollModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const currentDate = new Date();
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [department, setDepartment] = useState('ALL');
  const [notes, setNotes] = useState('Automated monthly payroll disbursement');
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.post('/payroll/generate-batch', {
        month,
        year,
        department: department !== 'ALL' ? department : undefined,
        notes,
      });

      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      success('Batch Payroll Executed', data.data.message);
      onSuccess();
      onClose();
    } catch (err: any) {
      error('Batch Run Error', err.response?.data?.error?.message || 'Failed to execute batch run');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Execute Batch Payroll Run"
      subtitle="Disburse monthly salary compensation and generate audit records for all active employees"
      maxWidth="md"
    >
      <form onSubmit={handleRun} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Billing Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value, 10))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {monthNames.map((name, i) => (
                <option key={name} value={i + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Billing Year</label>
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value, 10))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Department Scope</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Departments (Entire Organization)</option>
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
          <label className="block text-xs font-semibold text-slate-300 mb-1">Disbursement Notes</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
          ⚠️ <strong>Financial Notice:</strong> This action creates permanent, auditable payslip records from the latest versioned salary structure and notifies all eligible employees.
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={loading}>
            Process & Disburse Payroll
          </Button>
        </div>
      </form>
    </Modal>
  );
};
