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
    blue: 'bg-blue-50 dark:bg-blue-950/60 text-[#1a73e8] dark:text-[#8ab4f8]',
    indigo: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/60 text-[#34a853] dark:text-emerald-400',
    amber: 'bg-amber-50 dark:bg-amber-950/60 text-[#fbbc04] dark:text-amber-400',
    purple: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="bg-white dark:bg-[#1e1f20] border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
            {title}
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-sans tracking-tight">
            {value}
          </div>
        </div>

        <div className={`p-3 rounded-2xl ${iconVariants[variant]}`}>
          {icon}
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
          {subtitle && <span className="text-slate-500 dark:text-slate-400 text-[11px] font-normal">{subtitle}</span>}
          {trend && (
            <span
              className={`font-semibold text-[11px] ${
                trend.isPositive ? 'text-[#34a853]' : 'text-[#ea4335]'
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
