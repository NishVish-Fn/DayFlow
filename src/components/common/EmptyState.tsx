import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon = <Inbox className="w-10 h-10 text-slate-500" />,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40">
      <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/40 mb-4">{icon}</div>
      <h3 className="text-base font-bold text-slate-200">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">{description}</p>
      {action}
    </div>
  );
};
