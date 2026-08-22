import React from 'react';
import { LeaveBalance } from '../../types';

export const LeaveBalanceCard: React.FC<{ balance: LeaveBalance }> = ({ balance }) => {
  const percentUsed = Math.min(
    100,
    Math.round(((balance.usedDays + balance.pendingDays) / balance.totalAllocated) * 100)
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-200">{balance.leaveType.name}</span>
          <span className="ml-1.5 text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {balance.leaveType.code}
          </span>
        </div>
        <span className="text-xs font-bold text-slate-400">
          {balance.totalAllocated} Days Total
        </span>
      </div>

      <div className="my-3">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-2xl font-black text-white">{balance.remainingDays}</span>
          <span className="text-[11px] text-slate-400">Days Available</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
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

      <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
        <span>Used: <strong className="text-emerald-400">{balance.usedDays}</strong></span>
        <span>Pending: <strong className="text-amber-400">{balance.pendingDays}</strong></span>
        <span>{percentUsed}% Utilized</span>
      </div>
    </div>
  );
};
