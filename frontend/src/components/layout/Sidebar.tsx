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
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { AICopilotDrawer } from '../ai/AICopilotDrawer';

export const Sidebar: React.FC = () => {
  const { role } = useAuth();
  const isAdminOrHr = role === 'ADMIN' || role === 'HR_MANAGER';
  const isAdmin = role === 'ADMIN';
  const [isAIOpen, setIsAIOpen] = useState(false);

  const mainNav = [
    {
      label: 'Dashboard',
      path: '/',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      label: isAdminOrHr ? 'Employees' : 'People Directory',
      path: '/employees',
      icon: <Users className="w-4 h-4" />,
    },
    {
      label: 'Attendance',
      path: '/attendance',
      icon: <Clock className="w-4 h-4" />,
    },
    {
      label: 'Leave & Time Off',
      path: '/leave',
      icon: <CalendarCheck className="w-4 h-4" />,
    },
    {
      label: 'Payroll',
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
      icon: <Target className="w-4 h-4 text-purple-400" />,
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
            label: 'Audit Logs',
            path: '/audit-logs',
            icon: <ShieldAlert className="w-4 h-4" />,
          },
        ]
      : []),
    {
      label: 'My Profile',
      path: '/profile',
      icon: <User className="w-4 h-4" />,
    },
  ];

  return (
    <>
      <aside className="w-56 bg-[#0b0f19] border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-[calc(100vh-3.5rem)] text-slate-300">
        
        {/* Navigation Groups */}
        <div className="p-3 space-y-4">
          
          {/* Section 1: Main */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Core
            </div>
            {mainNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold shadow-md shadow-purple-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <div className="shrink-0">{item.icon}</div>
                  <span>{item.label}</span>
                </div>
              </NavLink>
            ))}
          </div>

          {/* Section 2: Workforce Intelligence */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Intelligence
            </div>
            {intelligenceNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold shadow-md shadow-purple-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <div className="shrink-0">{item.icon}</div>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] bg-purple-950 text-purple-300 border border-purple-500/40 px-1.5 py-0.5 rounded font-mono font-bold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Section 3: Account */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Account
            </div>
            {adminNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold shadow-md shadow-purple-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <div className="shrink-0">{item.icon}</div>
                  <span>{item.label}</span>
                </div>
              </NavLink>
            ))}
          </div>

        </div>

        {/* AI Quick Trigger Button at Bottom */}
        <div className="p-3 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setIsAIOpen(true)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-purple-950/60 to-blue-950/60 border border-purple-500/30 hover:border-purple-500/60 text-purple-200 text-xs font-bold transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
              <span>WorkNest Copilot</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
          </button>
        </div>

      </aside>

      {/* AI Copilot Drawer */}
      <AICopilotDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </>
  );
};
