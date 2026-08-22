import React from 'react';
import { LeaveBalance } from '../../types';

export const LeaveBalanceCard: React.FC<{ balance: LeaveBalance }> = ({ balance }) => {
  const percentUsed = Math.min(
    100,
    Math.round(((balance.usedDays + balance.pendingDays) / balance.totalAllocated) * 100)
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-800">{balance.leaveType.name}</span>
          <span className="ml-1.5 text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
            {balance.leaveType.code}
          </span>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          {balance.totalAllocated} Days Total
        </span>
      </div>

      <div className="my-3">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-2xl font-black text-slate-900 font-display">{balance.remainingDays}</span>
          <span className="text-[11px] font-semibold text-slate-500">Days Available</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
          {/* Used portion */}
          <div
            className="bg-emerald-500 h-2 transition-all"
            style={{ width: `${(balance.usedDays / balance.totalAllocated) * 100}%` }}
            title={`Used: ${balance.usedDays} days`}
          />
          {/* Pending portion */}
          <div
            className="bg-amber-400 h-2 transition-all"
            style={{ width: `${(balance.pendingDays / balance.totalAllocated) * 100}%` }}
            title={`Pending: ${balance.pendingDays} days`}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2 font-medium">
        <span>Used: <strong className="text-emerald-600">{balance.usedDays}</strong></span>
        <span>Pending: <strong className="text-amber-600">{balance.pendingDays}</strong></span>
        <span className="font-semibold">{percentUsed}% Utilized</span>
      </div>
    </div>
  );
};
