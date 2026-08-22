import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
  Plus,
  Compass,
} from 'lucide-react';
import { AICopilotDrawer } from '../ai/AICopilotDrawer';

export const Sidebar: React.FC = () => {
  const { role } = useAuth();
  const isAdminOrHr = role === 'ADMIN' || role === 'HR_MANAGER';
  const isAdmin = role === 'ADMIN';
  const [isAIOpen, setIsAIOpen] = useState(false);
  const navigate = useNavigate();

  const mainNav = [
    {
      label: 'Overview',
      path: '/',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      label: isAdminOrHr ? 'Directory' : 'Team Members',
      path: '/employees',
      icon: <Users className="w-4 h-4" />,
    },
    {
      label: 'Attendance',
      path: '/attendance',
      icon: <Clock className="w-4 h-4" />,
    },
    {
      label: 'Leaves & Time Off',
      path: '/leave',
      icon: <CalendarCheck className="w-4 h-4" />,
    },
    {
      label: 'Payroll Ledger',
      path: '/payroll',
      icon: <CreditCard className="w-4 h-4" />,
    },
  ];

  const intelligenceNav = [
    {
      label: 'Wellness Radar',
      path: '/wellness',
      icon: <HeartPulse className="w-4 h-4 text-[#ea4335]" />,
      badge: 'AI',
    },
    {
      label: 'Goals & OKRs',
      path: '/performance',
      icon: <Target className="w-4 h-4 text-[#1a73e8]" />,
    },
    ...(isAdminOrHr
      ? [
          {
            label: 'Risk Signals',
            path: '/risk-radar',
            icon: <AlertTriangle className="w-4 h-4 text-[#fbbc04]" />,
            badge: 'Alerts',
          },
        ]
      : []),
  ];

  const adminNav = [
    ...(isAdmin
      ? [
          {
            label: 'Security Audit',
            path: '/audit-logs',
            icon: <ShieldAlert className="w-4 h-4" />,
          },
        ]
      : []),
    {
      label: 'Google Profile',
      path: '/profile',
      icon: <User className="w-4 h-4" />,
    },
  ];

  return (
    <>
      <aside className="w-60 bg-white dark:bg-[#1f1f1f] border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] text-slate-700 dark:text-slate-200 select-none">
        
        <div className="p-3 space-y-4">
          
          {/* Google "+ New" Action Button (FAB style from Google Drive/Gmail) */}
          <div className="px-1 pt-1">
            <button
              onClick={() => setIsAIOpen(true)}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-[#28292a] hover:bg-slate-50 dark:hover:bg-[#333537] border border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-white font-semibold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer w-full group"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#c2e7ff] text-[#001d35]">
                <Plus className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="font-semibold text-xs tracking-tight">Ask Gemini AI</span>
            </button>
          </div>

          {/* Section 1: Main Core */}
          <div className="space-y-0.5">
            {mainNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-2.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#d3e3fd] dark:bg-[#004a77] text-[#041e49] dark:text-[#c2e7ff] font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-[#f0f4f9] dark:hover:bg-[#28292a]'
                  }`
                }
              >
                <div className="shrink-0">{item.icon}</div>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Section 2: Workforce Intelligence */}
          <div className="space-y-0.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Workforce Intelligence
            </div>
            {intelligenceNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-2.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#d3e3fd] dark:bg-[#004a77] text-[#041e49] dark:text-[#c2e7ff] font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-[#f0f4f9] dark:hover:bg-[#28292a]'
                  }`
                }
              >
                <div className="flex items-center gap-3.5">
                  <div className="shrink-0">{item.icon}</div>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] bg-blue-100 dark:bg-blue-950 text-[#1a73e8] dark:text-[#8ab4f8] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Section 3: Governance */}
          <div className="space-y-0.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Governance
            </div>
            {adminNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-2.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#d3e3fd] dark:bg-[#004a77] text-[#041e49] dark:text-[#c2e7ff] font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-[#f0f4f9] dark:hover:bg-[#28292a]'
                  }`
                }
              >
                <div className="shrink-0">{item.icon}</div>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

        </div>

        {/* Google Workspace Storage Status at Bottom */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Organization Cloud</span>
            <span className="font-medium">100% Free Tier</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#4285F4] h-1.5 rounded-full w-2/5" />
          </div>
        </div>

      </aside>

      {/* Gemini AI Drawer */}
      <AICopilotDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </>
  );
};
