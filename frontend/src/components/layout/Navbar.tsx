import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, LogOut, CheckCheck, Shield, Building2, Globe2 } from 'lucide-react';
import api from '../../services/api';
import { Notification } from '../../types';
import { Badge } from '../common/Badge';
import { CorporateGlobeLogo } from '../common/CorporateGlobeLogo';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

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

  const getRoleBadgeVariant = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return 'danger';
      case 'HR_MANAGER':
        return 'purple';
      default:
        return 'primary';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Corporate Logo & World Status */}
      <div className="flex items-center gap-4">
        <CorporateGlobeLogo size="sm" showText={false} />
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black text-slate-900 tracking-tight font-display">
            DAYFLOW <span className="text-blue-600 font-extrabold uppercase text-[10px] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">Global HRMS</span>
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 transition-all cursor-pointer shadow-sm"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-[10px] font-extrabold text-white shadow-md">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-3.5 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between px-2 pb-2.5 border-b border-slate-100">
                <span className="text-xs font-black text-slate-900">Notifications Center</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto mt-2">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400 font-medium">No new notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border text-xs transition-colors ${
                        n.isRead
                          ? 'bg-slate-50/50 border-slate-100 text-slate-500'
                          : 'bg-gradient-to-r from-blue-50 to-indigo-50/60 border-blue-200 text-slate-900 font-semibold'
                      }`}
                    >
                      <div className="font-extrabold text-slate-900">{n.title}</div>
                      <div className="text-[11px] mt-0.5 text-slate-600 font-normal">{n.message}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Badge Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <img
            src={
              user?.profile?.avatarUrl ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
            }
            alt="Avatar"
            className="w-9 h-9 rounded-xl border-2 border-blue-500/30 bg-slate-100 object-cover shadow-sm"
          />
          <div className="hidden sm:block text-left">
            <div className="text-xs font-black text-slate-900 leading-tight">
              {user?.profile?.firstName} {user?.profile?.lastName}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Badge variant={getRoleBadgeVariant(user?.role)} size="sm">
                {user?.role}
              </Badge>
            </div>
          </div>

          <button
            onClick={() => logout()}
            title="Sign Out"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
