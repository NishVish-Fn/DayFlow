import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, LogOut, CheckCheck, Sparkles, Search, Command } from 'lucide-react';
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
      <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-5 bg-[#0b0f19]/95 backdrop-blur-xl border-b border-slate-800 text-white shadow-xs">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <CorporateGlobeLogo size="sm" />
        </div>

        {/* Outlook-Style Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search people, policies, attendance, or ask Copilot..."
              className="w-full bg-[#111827] border border-slate-800 focus:border-purple-500 rounded-xl pl-9.5 pr-14 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all font-medium"
            />
            <div className="absolute right-2.5 top-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
              <Command className="w-2.5 h-2.5" /> K
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Ask WorkNest AI Copilot Button */}
          <button
            onClick={() => setIsAIOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all cursor-pointer group"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-200 animate-pulse" />
            <span className="hidden sm:inline">Ask Copilot</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-[#111827] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[10px] font-extrabold text-white shadow-md">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#111827] border border-slate-800 shadow-2xl p-3.5 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between px-2 pb-2.5 border-b border-slate-800">
                  <span className="text-xs font-bold text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-[11px] font-bold text-purple-400 hover:underline cursor-pointer"
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
                            ? 'bg-slate-900/40 border-slate-800/60 text-slate-400'
                            : 'bg-gradient-to-r from-purple-950/60 to-blue-950/60 border-purple-500/30 text-white font-semibold'
                        }`}
                      >
                        <div className="font-bold text-white">{n.title}</div>
                        <div className="text-[11px] mt-0.5 text-slate-300 font-normal">{n.message}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Badge */}
          <div className="flex items-center gap-2.5 pl-2.5 border-l border-slate-800">
            <img
              src={
                user?.profile?.avatarUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
              }
              alt="Avatar"
              className="w-8 h-8 rounded-xl border border-purple-500/30 bg-slate-800 object-cover"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-white leading-tight">
                {user?.profile?.firstName} {user?.profile?.lastName}
              </div>
              <div className="text-[10px] text-purple-400 font-mono">
                {user?.role}
              </div>
            </div>

            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Copilot Drawer */}
      <AICopilotDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </>
  );
};
