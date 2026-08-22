import React from 'react';
import { SalaryStructure } from '../../types';
import { Badge } from '../common/Badge';

export const SalaryBreakdownCard: React.FC<{ structure: SalaryStructure | null }> = ({
  structure,
}) => {
  if (!structure) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-500 text-xs">
        No active salary structure found for this employee.
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-100">Compensation Overview</h4>
          <p className="text-[11px] text-slate-400">
            Effective from {new Date(structure.effectiveDate).toLocaleDateString()}
          </p>
        </div>
        <Badge variant="success" size="sm">
          {structure.isCurrent ? 'Active Structure' : 'Archived Structure'}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="text-[11px] text-slate-400 uppercase font-semibold">Monthly Gross</div>
          <div className="text-xl font-extrabold text-white mt-1">
            ${structure.grossSalary.toLocaleString()}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
          <div className="text-[11px] text-indigo-300 uppercase font-semibold">Net Take-Home</div>
          <div className="text-xl font-extrabold text-indigo-300 mt-1">
            ${structure.netSalary.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Itemized Line Items */}
      <div className="space-y-2 text-xs border-t border-slate-800/80 pt-3">
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-400">Basic Pay</span>
          <span className="font-semibold">${structure.baseSalary.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-400">House Rent Allowance (HRA)</span>
          <span className="font-semibold">${structure.hra.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-400">Special Allowances</span>
          <span className="font-semibold">${structure.allowances.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-rose-400 border-t border-slate-800/50 pt-2">
          <span>Standard Deductions (Taxes & PF)</span>
          <span className="font-semibold">-${structure.deductions.toLocaleString()}</span>
        </div>
      </div>

      {structure.remarks && (
        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 italic">
          Note: "{structure.remarks}"
        </div>
      )}
    </div>
  );
};
