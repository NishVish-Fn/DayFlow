import React, { useState } from 'react';
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
  Sparkles,
  HeartPulse,
  Target,
  GraduationCap,
  AlertTriangle,
  Globe2,
} from 'lucide-react';
import { CorporateGlobeLogo } from '../common/CorporateGlobeLogo';
import { AICopilotDrawer } from '../ai/AICopilotDrawer';

export const Sidebar: React.FC = () => {
  const { role } = useAuth();
  const isAdminOrHr = role === 'ADMIN' || role === 'HR_MANAGER';
  const isAdmin = role === 'ADMIN';
  const [isAIOpen, setIsAIOpen] = useState(false);

  const mainNav = [
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
  ];

  const intelligenceNav = [
    {
      label: 'Wellness & Fatigue',
      path: '/wellness',
      icon: <HeartPulse className="w-4 h-4 text-rose-500" />,
      badge: 'AI',
    },
    {
      label: 'Performance & OKRs',
      path: '/performance',
      icon: <Target className="w-4 h-4 text-indigo-500" />,
    },
    {
      label: 'Skills & Learning',
      path: '/learning',
      icon: <GraduationCap className="w-4 h-4 text-blue-500" />,
    },
    ...(isAdminOrHr
      ? [
          {
            label: 'HR Risk Radar',
            path: '/risk-radar',
            icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
            badge: 'Alerts',
          },
        ]
      : []),
  ];

  const adminNav = [
    ...(isAdmin
      ? [
          {
            label: 'Security Audit Logs',
            path: '/audit-logs',
            icon: <ShieldAlert className="w-4 h-4" />,
          },
        ]
      : []),
    {
      label: 'Account Profile',
      path: '/profile',
      icon: <User className="w-4 h-4" />,
    },
  ];

  return (
    <>
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-screen shadow-sm">
        {/* Brand Header */}
        <div className="overflow-y-auto flex-1">
          <div className="px-6 h-18 border-b border-slate-100 flex items-center">
            <CorporateGlobeLogo size="sm" />
          </div>

          {/* AI Copilot Highlight Banner */}
          <div className="p-3.5 pb-1">
            <button
              type="button"
              onClick={() => setIsAIOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-blue-600/20 hover:shadow-blue-600/35 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                <span>Dayflow AI Copilot</span>
              </div>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md font-extrabold uppercase">
                Active
              </span>
            </button>
          </div>

          {/* Section 1: Core Operations */}
          <nav className="p-3.5 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Core Operations
            </div>
            {mainNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                  }`
                }
              >
                <div className="shrink-0">{item.icon}</div>
                <span>{item.label}</span>
              </NavLink>
            ))}

            {/* Section 2: AI Workforce Intelligence */}
            <div className="pt-3 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Workforce Intelligence
            </div>
            {intelligenceNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <div className="shrink-0">{item.icon}</div>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-extrabold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}

            {/* Section 3: Governance & Security */}
            <div className="pt-3 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Governance & Settings
            </div>
            {adminNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
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
        <div className="p-3.5 border-t border-slate-100">
          <div className="p-3 rounded-2xl bg-slate-900 text-white border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold text-[11px] text-white flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5 text-cyan-400" /> PostgreSQL 3NF
              </span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                Live
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
              Bcrypt 12 &bull; JWT Rotation &bull; Audit Trail
            </p>
          </div>
        </div>
      </aside>

      {/* Dayflow AI Copilot Drawer */}
      <AICopilotDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </>
  );
};
