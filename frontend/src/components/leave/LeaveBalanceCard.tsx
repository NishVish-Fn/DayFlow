import React from 'react';
import { LeaveBalance } from '../../types';

export const LeaveBalanceCard: React.FC<{ balance: LeaveBalance }> = ({ balance }) => {
  const percentUsed = Math.min(
    100,
    Math.round(((balance.usedDays + balance.pendingDays) / balance.totalAllocated) * 100)
  );

  return (
    <div className="bg-[#0e1217] border border-white/10 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-[#00f0ff]/40 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-white">{balance.leaveType.name}</span>
          <span className="ml-1.5 text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 font-bold">
            {balance.leaveType.code}
          </span>
        </div>
        <span className="text-xs font-mono font-semibold text-slate-400">
          {balance.totalAllocated}d Total
        </span>
      </div>

      <div className="my-3">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-2xl font-black text-white font-mono">{balance.remainingDays}</span>
          <span className="text-[11px] font-semibold text-slate-400">Days Available</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
          {/* Used portion */}
          <div
            className="bg-[#00ffc2] h-2 transition-all"
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

      <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/5 pt-2 font-medium">
        <span>Used: <strong className="text-[#00ffc2] font-mono">{balance.usedDays}</strong></span>
        <span>Pending: <strong className="text-amber-400 font-mono">{balance.pendingDays}</strong></span>
        <span className="font-mono">{percentUsed}% Utilized</span>
      </div>
    </div>
  );
};
