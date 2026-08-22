import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, LogOut, CheckCheck, Sparkles, Search, Grip, HelpCircle, Settings } from 'lucide-react';
import api from '../../services/api';
import { Notification } from '../../types';
import { CorporateGlobeLogo } from '../common/CorporateGlobeLogo';
import { AICopilotDrawer } from '../ai/AICopilotDrawer';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.data);
    } catch (e) {
      // Ignore
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      // Ignore
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-5 bg-white dark:bg-[#1f1f1f] border-b border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white shadow-xs">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <CorporateGlobeLogo size="sm" />
        </div>

        {/* Signature Google Search Pill */}
        <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in WorkNest (employees, leaves, salary, policies)..."
              className="w-full bg-[#f0f4f9] dark:bg-[#28292a] hover:bg-[#e9eef6] dark:hover:bg-[#333537] focus:bg-white dark:focus:bg-[#1e1f20] border border-transparent focus:border-slate-300 dark:focus:border-slate-700 rounded-full pl-11 pr-12 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:shadow-md transition-all font-medium"
            />
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Ask Gemini AI Action */}
          <button
            onClick={() => setIsAIOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#c2e7ff] hover:bg-[#b3dfff] text-[#001d35] font-semibold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#004a77] animate-pulse" />
            <span className="hidden sm:inline">Ask Gemini</span>
          </button>

          {/* Google 9-Dot App Launcher */}
          <button
            onClick={() => setIsAIOpen(true)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Google Workspace Apps"
          >
            <Grip className="w-5 h-5" />
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute 1 top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ea4335] text-[10px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#1e1f20] border border-slate-200 dark:border-slate-800 shadow-xl p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-[11px] font-semibold text-[#1a73e8] dark:text-[#8ab4f8] hover:underline cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto mt-2">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-500 font-medium">No new notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border text-xs transition-colors ${
                          n.isRead
                            ? 'bg-slate-50 dark:bg-slate-900/60 border-slate-100 dark:border-slate-800 text-slate-500'
                            : 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-slate-900 dark:text-white font-semibold'
                        }`}
                      >
                        <div className="font-bold">{n.title}</div>
                        <div className="text-[11px] mt-0.5 text-slate-600 dark:text-slate-300 font-normal">{n.message}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar (Google Account Circle) */}
          <div className="flex items-center gap-2 pl-2">
            <img
              src={
                user?.profile?.avatarUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
              }
              alt="Avatar"
              className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 object-cover cursor-pointer"
              title={`${user?.profile?.firstName} ${user?.profile?.lastName} (${user?.email})`}
            />

            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-2 rounded-full text-slate-500 hover:text-[#ea4335] hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Gemini AI Drawer */}
      <AICopilotDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </>
  );
};
