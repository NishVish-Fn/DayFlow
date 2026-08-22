import React from 'react';
import { SalaryStructure } from '../../types';
import { Badge } from '../common/Badge';

export const SalaryBreakdownCard: React.FC<{ structure: SalaryStructure | null }> = ({
  structure,
}) => {
  if (!structure) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-xs">
        No active salary structure found for this employee.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 font-display">Compensation Overview</h4>
          <p className="text-[11px] text-slate-500">
            Effective from {new Date(structure.effectiveDate).toLocaleDateString()}
          </p>
        </div>
        <Badge variant="success" size="sm">
          {structure.isCurrent ? 'Active Structure' : 'Archived Structure'}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Monthly Gross</div>
          <div className="text-xl font-extrabold text-slate-900 mt-1">
            ${structure.grossSalary.toLocaleString()}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
          <div className="text-[11px] text-blue-700 uppercase font-bold tracking-wider">Net Take-Home</div>
          <div className="text-xl font-extrabold text-blue-700 mt-1">
            ${structure.netSalary.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Itemized Line Items */}
      <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
        <div className="flex justify-between text-slate-700">
          <span className="text-slate-500">Basic Pay</span>
          <span className="font-semibold">${structure.baseSalary.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-slate-700">
          <span className="text-slate-500">House Rent Allowance (HRA)</span>
          <span className="font-semibold">${structure.hra.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-slate-700">
          <span className="text-slate-500">Special Allowances</span>
          <span className="font-semibold">${structure.allowances.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-rose-600 border-t border-slate-100 pt-2 font-medium">
          <span>Standard Deductions (Taxes & PF)</span>
          <span className="font-bold">-${structure.deductions.toLocaleString()}</span>
        </div>
      </div>

      {structure.remarks && (
        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 italic">
          Note: "{structure.remarks}"
        </div>
      )}
    </div>
  );
};
