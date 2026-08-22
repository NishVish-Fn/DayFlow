import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Play, Square, Building2, Home, Laptop, Sparkles, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { Badge } from '../common/Badge';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

interface TodayAttendanceData {
  isCheckedIn: boolean;
  isCheckedOut: boolean;
  record?: {
    checkInTime?: string;
    checkOutTime?: string;
    status: string;
    workMode: string;
    totalHours: number;
    notes?: string;
  } | null;
}

export const PunchClockWidget: React.FC<{ onAttendanceChange?: () => void }> = ({
  onAttendanceChange,
}) => {
  const { user } = useAuth();
  
  // Resolve unique user identifier that survives logouts
  const userKey = useMemo(() => {
    return user?.email || user?.employeeId || user?.id || localStorage.getItem('dayflow_last_user_email') || 'active_user';
  }, [user]);

  // Read persistent attendance punch state strictly for this specific user
  const loadLocalPunchState = (): TodayAttendanceData => {
    try {
      const userSpecific = localStorage.getItem(`worknest_punch_${userKey}`);
      if (userSpecific) {
        return JSON.parse(userSpecific);
      }
    } catch (e) {
      // fallback
    }
    return {
      isCheckedIn: false,
      isCheckedOut: false,
      record: null,
    };
  };

  const [data, setData] = useState<TodayAttendanceData>(loadLocalPunchState);
  const [actionLoading, setActionLoading] = useState(false);
  const [workMode, setWorkMode] = useState<'OFFICE' | 'REMOTE' | 'HYBRID'>('OFFICE');
  const [notes, setNotes] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const { success } = useToast();

  // Save current user email to persist across page reloads
  useEffect(() => {
    if (user?.email) {
      localStorage.setItem('dayflow_last_user_email', user.email);
    }
  }, [user]);

  // Re-read user's punch state whenever auth finishes loading or user changes
  useEffect(() => {
    const punch = loadLocalPunchState();
    setData(punch);
    if (punch.record?.workMode) {
      setWorkMode(punch.record.workMode as any);
    }
  }, [userKey]);

  const fetchTodayServerState = async () => {
    try {
      const res = await api.get('/attendance/today');
      if (res.data?.data) {
        const serverData = res.data.data;
        // If server confirms check-in or if local state is already checked in, preserve checked in
        if (serverData.isCheckedIn || serverData.isCheckedOut) {
          setData(serverData);
          localStorage.setItem(`worknest_punch_${userKey}`, JSON.stringify(serverData));
          localStorage.setItem('worknest_punch_current', JSON.stringify(serverData));
          if (serverData.record?.workMode) {
            setWorkMode(serverData.record.workMode);
          }
        }
      }
    } catch (e) {
      // Keep persistent local state
    }
  };

  useEffect(() => {
    fetchTodayServerState();
    const clockTimer = setInterval(() => setCurrentTime(new Date()), 1000);

    const handleSync = () => {
      const punch = loadLocalPunchState();
      setData(punch);
    };
    window.addEventListener('attendance-sync', handleSync);

    return () => {
      clearInterval(clockTimer);
      window.removeEventListener('attendance-sync', handleSync);
    };
  }, [userKey]);

  // Compute live elapsed time if clocked in
  useEffect(() => {
    if (data?.isCheckedIn && data?.record?.checkInTime) {
      const checkInDate = new Date(data.record.checkInTime).getTime();
      const updateElapsed = () => {
        const now = Date.now();
        setElapsedSeconds(Math.max(0, Math.floor((now - checkInDate) / 1000)));
      };
      updateElapsed();
      const timer = setInterval(updateElapsed, 1000);
      return () => clearInterval(timer);
    } else {
      setElapsedSeconds(0);
    }
  }, [data?.isCheckedIn, data?.record?.checkInTime]);

  // Instant 0ms Zero-Latency Punch In (Persists across logout/login until user Punches Out)
  const handleCheckIn = async () => {
    const nowIso = new Date().toISOString();
    const updatedData: TodayAttendanceData = {
      isCheckedIn: true,
      isCheckedOut: false,
      record: {
        checkInTime: nowIso,
        status: 'PRESENT',
        workMode,
        totalHours: 0,
        notes,
      },
    };

    // 1. Instant Local State & Persistent Storage Update
    setData(updatedData);
    localStorage.setItem(`worknest_punch_${userKey}`, JSON.stringify(updatedData));
    localStorage.setItem('worknest_punch_current', JSON.stringify(updatedData));
    window.dispatchEvent(new Event('attendance-sync'));

    success('Shift Started', `Logged ${workMode} check-in at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    const currentNotes = notes;
    setNotes('');
    onAttendanceChange?.();

    // 2. Background Server Sync
    try {
      setActionLoading(true);
      await api.post('/attendance/check-in', { workMode, notes: currentNotes });
    } catch (err: any) {
      // Ignore
    } finally {
      setActionLoading(false);
    }
  };

  // Instant 0ms Zero-Latency Punch Out (Only when user explicitly clicks Punch Out)
  const handleCheckOut = async () => {
    const checkInTime = data.record?.checkInTime ? new Date(data.record.checkInTime).getTime() : Date.now();
    const diffMs = Math.max(1000, Date.now() - checkInTime);
    const hoursWorked = Number((diffMs / 3600000).toFixed(2));
    const minsWorked = Math.max(1, Math.round(diffMs / 60000));

    const updatedData: TodayAttendanceData = {
      isCheckedIn: false,
      isCheckedOut: true,
      record: {
        ...data.record!,
        checkOutTime: new Date().toISOString(),
        totalHours: hoursWorked,
      },
    };

    // 1. Instant Local State & Persistent Storage Update
    setData(updatedData);
    localStorage.setItem(`worknest_punch_${userKey}`, JSON.stringify(updatedData));
    localStorage.setItem('worknest_punch_current', JSON.stringify(updatedData));
    window.dispatchEvent(new Event('attendance-sync'));

    const displayDuration = hoursWorked >= 0.1 ? `${hoursWorked} hrs` : `${minsWorked} min(s)`;
    success('Shift Finalized', `${displayDuration} logged successfully.`);
    onAttendanceChange?.();

    // 2. Background Server Sync
    try {
      setActionLoading(true);
      await api.post('/attendance/check-out', { notes });
    } catch (err: any) {
      // Ignore
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetShift = () => {
    const emptyData: TodayAttendanceData = {
      isCheckedIn: false,
      isCheckedOut: false,
      record: null,
    };
    setData(emptyData);
    localStorage.removeItem(`worknest_punch_${userKey}`);
    localStorage.removeItem('worknest_punch_current');
    window.dispatchEvent(new Event('attendance-sync'));
    success('Shift Reset', 'You can now punch in again.');
    onAttendanceChange?.();
  };

  const formatElapsed = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-none relative overflow-hidden transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/[0.05] dark:border-white/[0.06] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-[#0071e3]/10 dark:bg-[#0071e3]/20 text-[#0071e3] dark:text-[#2997ff] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">Smart Attendance & Telemetry</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentTime.toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Live Clock Display */}
        <div className="text-right">
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Telemetry Persistent
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 items-center">
        {/* Status Display */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status:</span>
            {data?.isCheckedIn && <Badge variant="success" size="md">🟢 Present &bull; Clocked In</Badge>}
            {data?.isCheckedOut && <Badge variant="neutral" size="md">✓ Shift Completed Today</Badge>}
            {!data?.isCheckedIn && !data?.isCheckedOut && (
              <Badge variant="warning" size="md">Ready to Check In</Badge>
            )}
          </div>

          {/* Running Timer Card */}
          {data?.isCheckedIn && (
            <div className="p-4 rounded-2xl bg-[#0071e3]/5 dark:bg-[#0071e3]/10 border border-[#0071e3]/20">
              <div className="text-xs font-semibold text-[#0071e3] dark:text-[#2997ff] uppercase tracking-wider">
                Shift Elapsed Time (Persists Across Logins)
              </div>
              <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white mt-1 tracking-tight">
                {formatElapsed(elapsedSeconds)}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Started at: {new Date(data.record!.checkInTime!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          )}

          {data?.isCheckedOut && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
              <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                Logged Duration for Today
              </div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                {data.record?.totalHours && data.record.totalHours >= 0.1
                  ? `${data.record.totalHours} hrs`
                  : `${Math.max(1, Math.round(((new Date(data.record?.checkOutTime || Date.now()).getTime() - new Date(data.record?.checkInTime || Date.now()).getTime())) / 60000))} min(s)`}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Completed at: {new Date(data.record!.checkOutTime!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-3">
          {!data?.isCheckedIn && !data?.isCheckedOut && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Work Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setWorkMode('OFFICE')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
                      workMode === 'OFFICE'
                        ? 'bg-[#0071e3] text-white border-[#0071e3] shadow-xs'
                        : 'bg-slate-50 dark:bg-white/[0.04] border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" /> Office
                  </button>

                  <button
                    type="button"
                    onClick={() => setWorkMode('REMOTE')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
                      workMode === 'REMOTE'
                        ? 'bg-[#0071e3] text-white border-[#0071e3] shadow-xs'
                        : 'bg-slate-50 dark:bg-white/[0.04] border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5" /> Remote
                  </button>

                  <button
                    type="button"
                    onClick={() => setWorkMode('HYBRID')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
                      workMode === 'HYBRID'
                        ? 'bg-[#0071e3] text-white border-[#0071e3] shadow-xs'
                        : 'bg-slate-50 dark:bg-white/[0.04] border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5" /> Hybrid
                  </button>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Optional check-in notes (e.g. Desk #4)..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/[0.08] rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0071e3] font-normal"
                />
              </div>

              <button
                type="button"
                onClick={handleCheckIn}
                className="w-full py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs tracking-wide shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Clock In / Punch In</span>
              </button>
            </>
          )}

          {data?.isCheckedIn && (
            <>
              <div>
                <input
                  type="text"
                  placeholder="Optional wrap-up notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/[0.08] rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0071e3] font-normal"
                />
              </div>

              <button
                type="button"
                onClick={handleCheckOut}
                className="w-full py-2.5 rounded-full bg-[#ea4335] hover:bg-[#d93025] text-white font-semibold text-xs tracking-wide shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Punch Out & Complete Shift</span>
              </button>
            </>
          )}

          {data?.isCheckedOut && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center text-xs text-emerald-800 dark:text-emerald-300 font-medium space-y-2">
              <div className="font-bold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Daily Shift Completed</span>
              </div>
              <p className="text-[11px] text-slate-500">Your attendance punch has been recorded for today.</p>
              <button
                type="button"
                onClick={handleResetShift}
                className="mt-1 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold cursor-pointer transition-all"
              >
                <span>Punch In Again / Reset Shift</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
