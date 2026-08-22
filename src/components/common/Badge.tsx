import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'purple' | 'blue';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
}) => {
  const base = 'inline-flex items-center font-bold rounded-lg tracking-wider uppercase border select-none font-mono';

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  const variantClasses = {
    primary: 'bg-purple-950/60 text-purple-300 border-purple-500/40',
    purple: 'bg-purple-950/60 text-purple-300 border-purple-500/40',
    blue: 'bg-blue-950/60 text-blue-300 border-blue-500/40',
    success: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
    warning: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
    danger: 'bg-rose-950/60 text-rose-300 border-rose-500/40',
    neutral: 'bg-slate-900 text-slate-300 border-slate-800',
  };

  return (
    <span className={`${base} ${sizeClasses[size]} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};
