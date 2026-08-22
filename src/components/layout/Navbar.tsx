import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Bell,
  LogOut,
  CheckCheck,
  Sparkles,
  Search,
  User as UserIcon,
  Play,
  Square,
  Clock,
  ChevronDown,
} from 'lucide-react';
import api from '../../services/api';
import { Notification } from '../../types';
import { CorporateGlobeLogo } from '../common/CorporateGlobeLogo';
import { AICopilotDrawer } from '../ai/AICopilotDrawer';
import { useToast } from '../../context/ToastContext';

export const Navbar: React.FC = () => {
  const { user, logout, role } = useAuth();
  const isAdmin = role === 'ADMIN';
  const isAdminOrHr = role === 'ADMIN' || role === 'HR_MANAGER';
  const navigate = useNavigate();
  const { success } = useToast();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Systray-style quick check-in state (persists across logouts)
  const userKey = user?.email || user?.employeeId || user?.id || localStorage.getItem('dayflow_last_user_email') || 'active_user';

  const readIsCheckedIn = () => {
    try {
      const userSpecific = localStorage.getItem(`worknest_punch_${userKey}`);
      if (userSpecific) {
        return JSON.parse(userSpecific).isCheckedIn === true;
      }
      const globalActive = localStorage.getItem('worknest_punch_current');
      if (globalActive) {
        return JSON.parse(globalActive).isCheckedIn === true;
      }
    } catch (e) {}
    return false;
  };

  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(readIsCheckedIn);

  const fetchAttendanceStatus = async () => {
    try {
      setIsCheckedIn(readIsCheckedIn());
      const res = await api.get('/attendance/today');
      if (res.data?.data) {
        if (res.data.data.isCheckedIn || res.data.data.isCheckedOut) {
          setIsCheckedIn(res.data.data.isCheckedIn);
        }
      }
    } catch (e) {
      // Keep persistent local state
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.data || []);
    } catch (e) {
      // Ignore
    }
  };

  useEffect(() => {
    fetchAttendanceStatus();
    fetchNotifications();

    const handleSync = () => {
      fetchAttendanceStatus();
    };

    window.addEventListener('attendance-sync', handleSync);
    const interval = setInterval(() => {
      fetchNotifications();
      fetchAttendanceStatus();
    }, 20000);

    return () => {
      window.removeEventListener('attendance-sync', handleSync);
      clearInterval(interval);
    };
  }, [user]);

  const handleQuickClockToggle = async () => {
    if (!isCheckedIn) {
      setIsCheckedIn(true);
      const updateData = {
        isCheckedIn: true,
        isCheckedOut: false,
        record: { checkInTime: new Date().toISOString(), status: 'PRESENT', workMode: 'OFFICE', totalHours: 0 },
      };
      localStorage.setItem(`worknest_punch_${userKey}`, JSON.stringify(updateData));
      localStorage.setItem('worknest_punch_current', JSON.stringify(updateData));
      window.dispatchEvent(new Event('attendance-sync'));
      success('Checked In', 'Recorded office attendance.');
      try {
        await api.post('/attendance/check-in', { workMode: 'OFFICE' });
      } catch (e) {}
    } else {
      setIsCheckedIn(false);
      const updateData = {
        isCheckedIn: false,
        isCheckedOut: true,
        record: { checkOutTime: new Date().toISOString(), status: 'PRESENT', workMode: 'OFFICE', totalHours: 8.0 },
      };
      localStorage.setItem(`worknest_punch_${userKey}`, JSON.stringify(updateData));
      localStorage.setItem('worknest_punch_current', JSON.stringify(updateData));
      window.dispatchEvent(new Event('attendance-sync'));
      success('Checked Out', 'Shift attendance finalized for today.');
      try {
        await api.post('/attendance/check-out', {});
      } catch (e) {}
    }
  };

  const navLinks = [
    { label: 'Employees', path: '/employees' },
    { label: 'Attendance', path: '/attendance' },
    { label: 'Time Off', path: '/leave' },
    ...(isAdminOrHr ? [{ label: 'Payroll', path: '/payroll' }] : []),
    { label: 'Wellness Radar', path: '/wellness' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 bg-white/90 dark:bg-[#161618]/90 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.08] text-slate-900 dark:text-white transition-all select-none">
        
        {/* Left: Company Logo + Main Top Navigation (§0 Spec: Logo | Employees | Attendance | Time Off) */}
        <div className="flex items-center gap-8">
          <NavLink to="/employees" className="shrink-0">
            <CorporateGlobeLogo size="sm" />
          </NavLink>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all ${
                    isActive
                      ? 'bg-[#0071e3]/10 dark:bg-[#0071e3]/20 text-[#0071e3] dark:text-[#2997ff]'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-xs mx-6">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search directory..."
              className="w-full bg-black/[0.03] dark:bg-white/[0.05] border border-transparent focus:border-[#0071e3] rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Right: Systray Clock In/Out + Gemini AI + Notifications + Profile Avatar Dropdown */}
        <div className="flex items-center gap-3">
          
          {/* Systray Check In / Check Out Status Pill (§7 Spec) */}
          <button
            onClick={handleQuickClockToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 ${
              isCheckedIn
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
            }`}
            title="Toggle Check In / Out"
          >
            <span className={`w-2 h-2 rounded-full ${isCheckedIn ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>{isCheckedIn ? 'Present in Office' : 'Check In'}</span>
          </button>

          {/* AI Copilot Button */}
          <button
            onClick={() => setIsAIOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#1e1f20] border border-slate-200 dark:border-slate-800 shadow-xl p-3.5 z-50 animate-in fade-in">
                <div className="text-xs font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                  Notifications
                </div>
                <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto mt-2 text-xs">
                  {notifications.length === 0 ? (
                    <div className="py-4 text-center text-slate-400">No notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <div className="font-semibold text-slate-900 dark:text-white">{n.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{n.message}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar with Dropdown: My Profile & Log Out (§0 Spec) */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              <img
                src={
                  user?.profile?.avatarUrl ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
                }
                alt="Avatar"
                className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 bg-slate-100 object-cover"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#1c1c1e] border border-black/[0.06] dark:border-white/[0.1] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 text-xs">
                <div className="px-3 py-2 border-b border-black/[0.04] dark:border-white/[0.06]">
                  <div className="font-bold text-slate-900 dark:text-white truncate">
                    {user?.profile?.firstName} {user?.profile?.lastName}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">
                    {user?.employeeId}
                  </div>
                </div>

                <div className="py-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/profile');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] font-medium text-left transition-colors cursor-pointer"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-[#0071e3]" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#ea4335] hover:bg-red-50 dark:hover:bg-red-950/30 font-medium text-left transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* AI Copilot Drawer */}
      <AICopilotDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </>
  );
};
