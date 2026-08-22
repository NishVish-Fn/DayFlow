import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarCheck,
  CreditCard,
  ShieldAlert,
  User,
  Zap,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role } = useAuth();
  const isAdminOrHr = role === 'ADMIN' || role === 'HR_MANAGER';
  const isAdmin = role === 'ADMIN';

  const navItems = [
    {
      label: 'Overview',
      path: '/',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      label: isAdminOrHr ? 'Team Directory' : 'People Directory',
      path: '/employees',
      icon: <Users className="w-4 h-4" />,
    },
    {
      label: 'Time & Attendance',
      path: '/attendance',
      icon: <Clock className="w-4 h-4" />,
    },
    {
      label: 'Time Off & Leaves',
      path: '/leave',
      icon: <CalendarCheck className="w-4 h-4" />,
    },
    {
      label: 'Payroll & Earnings',
      path: '/payroll',
      icon: <CreditCard className="w-4 h-4" />,
    },
    ...(isAdmin
      ? [
          {
            label: 'Security & Audit Logs',
            path: '/audit-logs',
            icon: <ShieldAlert className="w-4 h-4" />,
          },
        ]
      : []),
    {
      label: 'Account Settings',
      path: '/profile',
      icon: <User className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-64 bg-slate-950/80 border-r border-white/[0.06] backdrop-blur-2xl flex flex-col justify-between shrink-0 min-h-screen">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 px-6 h-16 border-b border-white/[0.06]">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white shadow-md">
            <Zap className="w-4 h-4 fill-indigo-400 text-indigo-400" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-white font-sans">
              Dayflow
            </div>
            <div className="text-[10px] tracking-wider uppercase font-semibold text-slate-400">
              Workforce OS
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3.5 space-y-1">
          <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Workspace
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white/[0.08] text-white border border-white/[0.1] shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`
              }
            >
              <div className="text-slate-400 group-hover:text-white">{item.icon}</div>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Corporate Security Footer */}
      <div className="p-4 border-t border-white/[0.06]">
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs">
          <div className="flex items-center justify-between text-slate-300 mb-1">
            <span className="font-semibold text-slate-200 text-[11px]">Dayflow Network</span>
            <span className="text-[10px] text-emerald-400 font-semibold">Protected</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Enterprise Cloud Engine &bull; Version 1.0
          </p>
        </div>
      </div>
    </aside>
  );
};
