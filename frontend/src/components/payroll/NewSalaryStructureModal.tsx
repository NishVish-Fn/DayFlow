import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { EmployeeProfile } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeProfile | null;
  onSuccess: () => void;
}

export const NewSalaryStructureModal: React.FC<Props> = ({
  isOpen,
  onClose,
  employee,
  onSuccess,
}) => {
  const currentSalary = employee?.currentSalary || employee?.salaryStructures?.[0];

  const [baseSalary, setBaseSalary] = useState<number>(currentSalary?.baseSalary || 10000);
  const [hra, setHra] = useState<number>(currentSalary?.hra || 3000);
  const [allowances, setAllowances] = useState<number>(currentSalary?.allowances || 1500);
  const [deductions, setDeductions] = useState<number>(currentSalary?.deductions || 2000);
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().slice(0, 10));
  const [remarks, setRemarks] = useState('Annual appraisal compensation adjustment');
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  if (!employee) return null;

  const grossSalary = (Number(baseSalary) || 0) + (Number(hra) || 0) + (Number(allowances) || 0);
  const netSalary = grossSalary - (Number(deductions) || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await api.post(`/payroll/structures/${employee.id}`, {
        baseSalary: Number(baseSalary),
        hra: Number(hra),
        allowances: Number(allowances),
        deductions: Number(deductions),
        effectiveDate,
        remarks,
      });

      success(
        'Salary Revision Activated',
        `New versioned salary structure saved. Previous structure archived.`
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      error('Revision Failed', err.response?.data?.error?.message || 'Could not update salary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Versioned Salary Structure"
      subtitle={`Employee: ${employee.firstName} ${employee.lastName} (${employee.designation})`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="text-slate-500 font-medium">Current Gross Baseline:</div>
          <div className="text-base font-bold text-slate-900 mt-0.5">
            ${currentSalary ? currentSalary.grossSalary.toLocaleString() : 'N/A'}{' '}
            <span className="text-slate-500 text-xs font-normal">
              (Net: ${currentSalary ? currentSalary.netSalary.toLocaleString() : 'N/A'})
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Effective Date</label>
          <input
            type="date"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Base Salary ($)</label>
            <input
              type="number"
              min="0"
              step="100"
              value={baseSalary}
              onChange={(e) => setBaseSalary(parseFloat(e.target.value) || 0)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">HRA ($)</label>
            <input
              type="number"
              min="0"
              step="50"
              value={hra}
              onChange={(e) => setHra(parseFloat(e.target.value) || 0)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Allowances ($)</label>
            <input
              type="number"
              min="0"
              step="50"
              value={allowances}
              onChange={(e) => setAllowances(parseFloat(e.target.value) || 0)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Deductions ($)</label>
            <input
              type="number"
              min="0"
              step="50"
              value={deductions}
              onChange={(e) => setDeductions(parseFloat(e.target.value) || 0)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>

        {/* Calculated New Compensation Preview */}
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs flex justify-between items-center">
          <div>
            <span className="text-blue-800 block font-bold">New Gross: ${grossSalary.toLocaleString()}</span>
            <span className="text-slate-500">Total Deductions: -${deductions.toLocaleString()}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">New Net Take-Home</span>
            <span className="text-base font-extrabold text-emerald-700">${netSalary.toLocaleString()}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Reason / Revision Notes</label>
          <input
            type="text"
            placeholder="e.g. Promotion to Staff Architect, market hike"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={loading}>
            Activate New Salary Version
          </Button>
        </div>
      </form>
    </Modal>
  );
};
