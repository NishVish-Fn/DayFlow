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
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-screen">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-100">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/30">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="font-extrabold text-sm tracking-tight text-slate-900 font-display">
              Dayflow
            </div>
            <div className="text-[10px] tracking-wider uppercase font-semibold text-blue-600">
              Workforce OS
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3.5 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Workspace
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
          <div className="flex items-center justify-between text-slate-700 mb-1">
            <span className="font-bold text-slate-800 text-[11px]">Enterprise Secure</span>
            <span className="text-[10px] text-emerald-600 font-bold">Online</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Normalized 3NF &bull; Bcrypt SHA-256
          </p>
        </div>
      </div>
    </aside>
  );
};
