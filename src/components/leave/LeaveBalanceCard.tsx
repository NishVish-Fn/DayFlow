import React from 'react';
import { LeaveBalance } from '../../types';

export const LeaveBalanceCard: React.FC<{ balance: LeaveBalance }> = ({ balance }) => {
  const percentUsed = Math.min(
    100,
    Math.round(((balance.usedDays + balance.pendingDays) / balance.totalAllocated) * 100)
  );

  return (
    <div className="bg-white dark:bg-[#1e1f20] border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-800 dark:text-white">{balance.leaveType.name}</span>
          <span className="ml-1.5 text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-[#1a73e8] dark:text-[#8ab4f8] font-bold">
            {balance.leaveType.code}
          </span>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          {balance.totalAllocated}d total
        </span>
      </div>

      <div className="my-3">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-2xl font-bold text-slate-900 dark:text-white font-sans">{balance.remainingDays}</span>
          <span className="text-xs font-medium text-slate-500">Days Available</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden flex">
          {/* Used portion */}
          <div
            className="bg-[#34a853] h-2 transition-all"
            style={{ width: `${(balance.usedDays / balance.totalAllocated) * 100}%` }}
            title={`Used: ${balance.usedDays} days`}
          />
          {/* Pending portion */}
          <div
            className="bg-[#fbbc04] h-2 transition-all"
            style={{ width: `${(balance.pendingDays / balance.totalAllocated) * 100}%` }}
            title={`Pending: ${balance.pendingDays} days`}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 font-medium">
        <span>Used: <strong className="text-[#34a853]">{balance.usedDays}</strong></span>
        <span>Pending: <strong className="text-[#fbbc04]">{balance.pendingDays}</strong></span>
        <span>{percentUsed}%</span>
      </div>
    </div>
  );
};
