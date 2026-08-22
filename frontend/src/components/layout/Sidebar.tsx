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
      label: 'Command Center',
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
      icon: <HeartPulse className="w-4 h-4 text-rose-400" />,
      badge: 'AI',
    },
    {
      label: 'Performance & OKRs',
      path: '/performance',
      icon: <Target className="w-4 h-4 text-indigo-400" />,
    },
    ...(isAdminOrHr
      ? [
          {
            label: 'HR Risk Radar',
            path: '/risk-radar',
            icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
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
      <aside className="w-64 bg-[#0a0d14]/90 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between shrink-0 min-h-screen text-slate-200 shadow-xl">
        {/* Brand Header */}
        <div className="overflow-y-auto flex-1">
          <div className="px-6 h-18 border-b border-white/5 flex items-center">
            <CorporateGlobeLogo size="sm" />
          </div>

          {/* AI Copilot Highlight Button */}
          <div className="p-3.5 pb-1">
            <button
              type="button"
              onClick={() => setIsAIOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-[#00f0ff]/15 via-blue-500/15 to-indigo-500/15 text-[#00f0ff] border border-[#00f0ff]/30 hover:border-[#00f0ff]/60 font-bold text-xs shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#00f0ff] animate-pulse" />
                <span>WorkNest AI Copilot</span>
              </div>
              <span className="text-[9px] bg-[#00f0ff] text-slate-950 px-1.5 py-0.5 rounded font-mono font-extrabold uppercase">
                LLaMA 3.3
              </span>
            </button>
          </div>

          {/* Section 1: Core Operations */}
          <nav className="p-3.5 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
              Core Operations
            </div>
            {mainNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#00f0ff]/15 to-blue-500/15 text-[#00f0ff] border border-[#00f0ff]/30 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`
                }
              >
                <div className="shrink-0">{item.icon}</div>
                <span>{item.label}</span>
              </NavLink>
            ))}

            {/* Section 2: AI Workforce Intelligence */}
            <div className="pt-3 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
              Workforce Intelligence
            </div>
            {intelligenceNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#00f0ff]/15 to-blue-500/15 text-[#00f0ff] border border-[#00f0ff]/30 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <div className="shrink-0">{item.icon}</div>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] bg-black/50 text-[#00f0ff] border border-[#00f0ff]/30 px-1.5 py-0.5 rounded font-mono font-extrabold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}

            {/* Section 3: Governance */}
            <div className="pt-3 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
              Security & Ledger
            </div>
            {adminNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#00f0ff]/15 to-blue-500/15 text-[#00f0ff] border border-[#00f0ff]/30 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`
                }
              >
                <div className="shrink-0">{item.icon}</div>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Status Footer */}
        <div className="p-3.5 border-t border-white/5">
          <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-white">
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold text-[11px] text-white flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5 text-[#00f0ff]" /> Neo-Workforce
              </span>
              <span className="text-[9px] bg-[#00ffc2]/20 text-[#00ffc2] font-mono font-bold px-1.5 py-0.5 rounded border border-[#00ffc2]/30">
                Online
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono leading-relaxed">
              PostgreSQL 3NF &bull; LLaMA 3.3
            </p>
          </div>
        </div>
      </aside>

      {/* WorkNest AI Copilot Drawer */}
      <AICopilotDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </>
  );
};
