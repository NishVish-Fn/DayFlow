import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: 'indigo' | 'emerald' | 'amber' | 'purple' | 'blue';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'blue',
}) => {
  const iconVariants = {
    blue: 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    emerald: 'bg-[#00ffc2]/10 text-[#00ffc2] border-[#00ffc2]/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  };

  return (
    <div className="bg-[#0e1217] border border-white/10 rounded-2xl p-5 shadow-sm hover:border-[#00f0ff]/40 transition-all">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            {title}
          </span>
          <div className="text-2xl font-black text-white font-mono tracking-tight">
            {value}
          </div>
        </div>

        <div className={`p-2.5 rounded-xl border ${iconVariants[variant]} shadow-sm`}>
          {icon}
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-white/5">
          {subtitle && <span className="text-slate-400 text-[11px] font-medium">{subtitle}</span>}
          {trend && (
            <span
              className={`font-mono font-bold text-[11px] ${
                trend.isPositive ? 'text-[#00ffc2]' : 'text-rose-400'
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
