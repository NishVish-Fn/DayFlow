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
  Globe2,
} from 'lucide-react';
import { CorporateGlobeLogo } from '../common/CorporateGlobeLogo';

export const Sidebar: React.FC = () => {
  const { role } = useAuth();
  const isAdminOrHr = role === 'ADMIN' || role === 'HR_MANAGER';
  const isAdmin = role === 'ADMIN';

  const navItems = [
    {
      label: 'Executive Overview',
      path: '/',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      label: isAdminOrHr ? 'Employee Directory' : 'People Directory',
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
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-screen shadow-sm">
      {/* Brand Header with Corporate Globe Logo */}
      <div>
        <div className="px-6 h-18 border-b border-slate-100 flex items-center">
          <CorporateGlobeLogo size="sm" />
        </div>

        {/* Navigation Items */}
        <nav className="p-3.5 space-y-1">
          <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Workforce Workspace
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25'
                    : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50/70'
                }`
              }
            >
              <div className="shrink-0">{item.icon}</div>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Corporate Security Footer */}
      <div className="p-4 border-t border-slate-100">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-lg border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-extrabold text-[11px] text-white flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5 text-cyan-400" /> Multi-Region
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
              Live
            </span>
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed font-medium">
            PostgreSQL 3NF &bull; Bcrypt SHA-256 &bull; Immutable Audit Logs
          </p>
        </div>
      </div>
    </aside>
  );
};
