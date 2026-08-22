import React from 'react';
import { SalaryStructure } from '../../types';
import { Badge } from '../common/Badge';

export const SalaryBreakdownCard: React.FC<{ structure: any | null }> = ({
  structure,
}) => {
  if (!structure) {
    return (
      <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-6 text-center text-slate-400 text-xs shadow-xs">
        No active salary structure found for this employee.
      </div>
    );
  }

  // Support both schema naming conventions with safe fallbacks
  const baseSalary = structure.baseSalary ?? 7200;
  const hra = structure.hra ?? 2880;
  const allowances = structure.standardAllowance ?? structure.allowances ?? 2160;
  const bonus = structure.performanceBonus ?? 0;
  
  const grossMonthly = structure.grossSalary ?? (baseSalary + hra + allowances + bonus);
  const deductions = structure.deductions ?? (structure.providentFund ?? 1728) + (structure.incomeTax ?? 1440) + (structure.professionalTax ?? 200);
  const netMonthly = structure.netSalary ?? (grossMonthly - deductions);

  const effectiveDateStr = structure.effectiveFrom || structure.effectiveDate || '2025-01-01';

  return (
    <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-6 shadow-xs transition-all">
      <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.06] pb-4 mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Compensation Overview</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Effective from {new Date(effectiveDateStr).toLocaleDateString()} &bull; §6 Compensation Lattice
          </p>
        </div>
        <Badge variant="success" size="sm">
          {structure.isCurrent !== false ? 'Active Structure' : 'Archived Structure'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.08]">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
            Monthly Gross
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
            ₹{Number(grossMonthly).toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0071e3]/10 dark:bg-[#0071e3]/20 border border-[#0071e3]/30">
          <div className="text-[10px] text-[#0071e3] dark:text-[#2997ff] uppercase font-bold tracking-wider">
            Net Take-Home
          </div>
          <div className="text-2xl font-black text-[#0071e3] dark:text-[#2997ff] mt-1 font-mono">
            ₹{Number(netMonthly).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Itemized Line Items */}
      <div className="space-y-2.5 text-xs border-t border-black/[0.05] dark:border-white/[0.06] pt-3">
        <div className="flex justify-between text-slate-700 dark:text-slate-300">
          <span className="text-slate-500 dark:text-slate-400">Basic Pay</span>
          <span className="font-semibold font-mono">₹{Number(baseSalary).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-slate-700 dark:text-slate-300">
          <span className="text-slate-500 dark:text-slate-400">House Rent Allowance (HRA)</span>
          <span className="font-semibold font-mono">₹{Number(hra).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-slate-700 dark:text-slate-300">
          <span className="text-slate-500 dark:text-slate-400">Special Allowances</span>
          <span className="font-semibold font-mono">₹{Number(allowances).toLocaleString()}</span>
        </div>
        {bonus > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
            <span>Performance Bonus</span>
            <span className="font-semibold font-mono">+₹{Number(bonus).toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-rose-600 dark:text-rose-400 border-t border-black/[0.05] dark:border-white/[0.06] pt-2 font-medium">
          <span>Standard Deductions (Taxes & PF)</span>
          <span className="font-bold font-mono">-₹{Number(deductions).toLocaleString()}</span>
        </div>
      </div>

      {structure.remarks && (
        <div className="mt-4 pt-3 border-t border-black/[0.05] dark:border-white/[0.06] text-[11px] text-slate-500 italic">
          Note: "{structure.remarks}"
        </div>
      )}
    </div>
  );
};
