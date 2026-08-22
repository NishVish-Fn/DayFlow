import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, LogOut, CheckCheck, Sparkles, Globe2 } from 'lucide-react';
import api from '../../services/api';
import { Notification } from '../../types';
import { Badge } from '../common/Badge';
import { CorporateGlobeLogo } from '../common/CorporateGlobeLogo';
import { AICopilotDrawer } from '../ai/AICopilotDrawer';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

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
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-[#0a0d14]/90 backdrop-blur-xl border-b border-white/10 text-white shadow-sm">
        {/* WorkNest Logo & Google World Status */}
        <div className="flex items-center gap-4">
          <CorporateGlobeLogo size="sm" showText={false} />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ffc2] animate-pulse" />
            <span className="text-xs font-black tracking-tight font-display text-white">
              WORKNEST <span className="text-[#00f0ff] font-extrabold uppercase text-[10px] bg-[#00f0ff]/10 px-2 py-0.5 rounded-md border border-[#00f0ff]/30">AI Workforce OS</span>
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Dayflow AI Copilot Button */}
          <button
            onClick={() => setIsAIOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00f0ff] hover:bg-[#38f8ff] text-slate-950 font-extrabold text-xs shadow-md shadow-[#00f0ff]/20 hover:shadow-[#00f0ff]/40 transition-all cursor-pointer group"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
            <span>Ask WorkNest AI</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#00f0ff] text-[10px] font-extrabold text-slate-950 shadow-md">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0f172a] border border-white/10 shadow-2xl p-3.5 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between px-2 pb-2.5 border-b border-white/10">
                  <span className="text-xs font-bold text-white">Notifications Center</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#00f0ff] hover:underline cursor-pointer"
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
                            ? 'bg-white/[0.02] border-white/5 text-slate-400'
                            : 'bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border-[#00f0ff]/30 text-white font-semibold'
                        }`}
                      >
                        <div className="font-extrabold text-white">{n.title}</div>
                        <div className="text-[11px] mt-0.5 text-slate-300 font-normal">{n.message}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Badge */}
          <div className="flex items-center gap-3 pl-3 border-l border-white/10">
            <img
              src={
                user?.profile?.avatarUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
              }
              alt="Avatar"
              className="w-9 h-9 rounded-xl border border-[#00f0ff]/30 bg-slate-800 object-cover"
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-white leading-tight">
                {user?.profile?.firstName} {user?.profile?.lastName}
              </div>
              <div className="text-[10px] text-[#00f0ff] font-mono mt-0.5">
                {user?.role}
              </div>
            </div>

            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* WorkNest AI Copilot Drawer */}
      <AICopilotDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </>
  );
};
