import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, UserCircle, LogOut, CheckCheck } from 'lucide-react';
import api from '../../services/api';
import { Notification } from '../../types';
import { Badge } from '../common/Badge';

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
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-slate-950/70 backdrop-blur-2xl border-b border-white/[0.06]">
      {/* Corporate Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-semibold text-slate-300 tracking-tight">
            Dayflow <span className="text-slate-500 font-normal">Internal Enterprise Network</span>
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-all"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900/95 border border-white/[0.1] shadow-2xl p-3 z-50 backdrop-blur-2xl animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between px-2 pb-2 border-b border-white/[0.06]">
                <span className="text-xs font-semibold text-slate-200">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto mt-2">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">No new notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border text-xs transition-colors ${
                        n.isRead
                          ? 'bg-transparent border-transparent text-slate-400'
                          : 'bg-white/[0.04] border-white/[0.08] text-slate-200'
                      }`}
                    >
                      <div className="font-semibold text-slate-100">{n.title}</div>
                      <div className="text-[11px] mt-0.5 opacity-90">{n.message}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Badge Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-white/[0.08]">
          <img
            src={
              user?.profile?.avatarUrl ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
            }
            alt="Avatar"
            className="w-8 h-8 rounded-full border border-white/[0.1] bg-slate-800 object-cover"
          />
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-200 leading-tight">
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
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-white/[0.05] transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
