import React, { useState, useEffect } from 'react';
import { Clock, Play, Square, Building2, Home, Laptop } from 'lucide-react';
import api from '../../services/api';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';

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
  const [data, setData] = useState<TodayAttendanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [workMode, setWorkMode] = useState<'OFFICE' | 'REMOTE' | 'HYBRID'>('OFFICE');
  const [notes, setNotes] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const { success, error } = useToast();

  const fetchToday = async () => {
    try {
      setLoading(true);
      const res = await api.get('/attendance/today');
      setData(res.data.data);
      if (res.data.data.record?.workMode) {
        setWorkMode(res.data.data.record.workMode);
      }
    } catch (e) {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToday();
    const clockTimer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Compute live elapsed time if checked in
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
  }, [data]);

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      await api.post('/attendance/check-in', { workMode, notes });
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.85 } });
      success('Punch In Recorded', `Checked in for work mode: ${workMode}`);
      setNotes('');
      await fetchToday();
      onAttendanceChange?.();
    } catch (err: any) {
      error('Punch In Failed', err.response?.data?.error?.message || 'Could not record check-in');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      await api.post('/attendance/check-out', { notes });
      success('Punch Out Recorded', 'Your working hours have been finalized.');
      await fetchToday();
      onAttendanceChange?.();
    } catch (err: any) {
      error('Punch Out Failed', err.response?.data?.error?.message || 'Could not record check-out');
    } finally {
      setActionLoading(false);
    }
  };

  const formatElapsed = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-pulse h-64 flex items-center justify-center">
        <div className="text-slate-500 text-sm">Loading attendance status...</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-slate-100">Live Attendance Tracker</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {currentTime.toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Live Clock Display */}
        <div className="text-right">
          <div className="text-2xl font-black font-mono tracking-tight text-indigo-300">
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Local Time</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 items-center">
        {/* Status Display */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-semibold uppercase">Status Today:</span>
            {data?.isCheckedIn && <Badge variant="success" size="md">Clocked In &bull; Active</Badge>}
            {data?.isCheckedOut && <Badge variant="neutral" size="md">Day Completed</Badge>}
            {!data?.isCheckedIn && !data?.isCheckedOut && (
              <Badge variant="warning" size="md">Not Clocked In</Badge>
            )}
          </div>

          {/* Running Timer */}
          {data?.isCheckedIn && (
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
              <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                Shift Elapsed Time
              </div>
              <div className="text-3xl font-black font-mono text-white mt-1">
                {formatElapsed(elapsedSeconds)}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Checked in at: {new Date(data.record!.checkInTime!).toLocaleTimeString()}
              </div>
            </div>
          )}

          {data?.isCheckedOut && (
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Completed Shift Duration
              </div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">
                {data.record?.totalHours} hrs
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Clocked out at: {new Date(data.record!.checkOutTime!).toLocaleTimeString()}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-3">
          {!data?.isCheckedIn && !data?.isCheckedOut && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Select Work Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setWorkMode('OFFICE')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      workMode === 'OFFICE'
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" /> Office
                  </button>

                  <button
                    type="button"
                    onClick={() => setWorkMode('REMOTE')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      workMode === 'REMOTE'
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5" /> Remote
                  </button>

                  <button
                    type="button"
                    onClick={() => setWorkMode('HYBRID')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      workMode === 'HYBRID'
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5" /> Hybrid
                  </button>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Optional check-in note (e.g. Office HQ Desk #4)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleCheckIn}
                isLoading={actionLoading}
                leftIcon={<Play className="w-4 h-4 fill-current" />}
              >
                Punch In for Today
              </Button>
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
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <Button
                variant="danger"
                size="lg"
                onClick={handleCheckOut}
                isLoading={actionLoading}
                leftIcon={<Square className="w-4 h-4 fill-current" />}
              >
                Punch Out & End Shift
              </Button>
            </>
          )}

          {data?.isCheckedOut && (
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-center text-xs text-slate-400">
              🎉 All shifts recorded for today. Great job!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
