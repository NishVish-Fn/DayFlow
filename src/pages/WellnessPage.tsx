import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  HeartPulse,
  AlertTriangle,
  Smile,
  Frown,
  Meh,
  Activity,
  Flame,
  Clock,
  Calendar,
  Sparkles,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  Coffee,
  CheckCircle2,
  Users,
  X,
  Send,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useToast } from '../context/ToastContext';
import { ENTERPRISE_EMPLOYEES } from '../utils/mockEnterpriseData';

interface WellnessScore {
  name: string;
  department: string;
  avatar: string;
  burnoutRisk: number; // 0 - 100
  overtimeHours: number;
  consecutiveDays: number;
  lastLeaveDaysAgo: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  suggestedAction: string;
  isSupportActive?: boolean;
}

const GENERATE_ENTERPRISE_WELLNESS = (): WellnessScore[] => {
  return ENTERPRISE_EMPLOYEES.map((emp, index) => {
    let risk = 15 + ((index * 7) % 75);
    if (emp.firstName === 'Elena') risk = 84;
    if (emp.firstName === 'David') risk = 68;

    let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (risk > 75) level = 'CRITICAL';
    else if (risk > 50) level = 'HIGH';
    else if (risk > 30) level = 'MEDIUM';

    return {
      name: `${emp.firstName} ${emp.lastName}`,
      department: emp.department,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.firstName}_${emp.lastName}`,
      burnoutRisk: risk,
      overtimeHours: Number(((risk / 100) * 18).toFixed(1)),
      consecutiveDays: Math.max(3, Math.round((risk / 100) * 12)),
      lastLeaveDaysAgo: Math.max(10, Math.round((risk / 100) * 150)),
      riskLevel: level,
      suggestedAction:
        level === 'CRITICAL'
          ? 'Enforce 2-day mandatory rest break and rebalance sprint deliverable load.'
          : level === 'HIGH'
          ? 'Schedule 1:1 check-in; reassign pending backlog items.'
          : level === 'MEDIUM'
          ? 'Workload healthy; monitor weekend slack activity.'
          : 'Optimal stamina index; steady work-life rhythm.',
      isSupportActive: false,
    };
  });
};

const DEFAULT_WELLNESS_LOGS: WellnessScore[] = GENERATE_ENTERPRISE_WELLNESS();

export const WellnessPage: React.FC = () => {
  const { user, role } = useAuth();
  const { success } = useToast();
  const isAdminOrHr = role === 'ADMIN' || role === 'HR_MANAGER';

  // Persistent Wellness Logs across page reloads
  const [wellnessLogs, setWellnessLogs] = useState<WellnessScore[]>(() => {
    try {
      const saved = localStorage.getItem('worknest_wellness_state') || localStorage.getItem('dayflow_wellness_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_WELLNESS_LOGS;
  });

  // Daily Punch-In: Once Per Calendar Day
  const todayStr = new Date().toISOString().slice(0, 10);
  const [lastCheckinDate, setLastCheckinDate] = useState<string | null>(() => {
    return localStorage.getItem('worknest_wellness_checkin_date');
  });
  const [savedMood, setSavedMood] = useState<string | null>(() => {
    return localStorage.getItem('worknest_wellness_checkin_mood');
  });

  const isCheckedInToday = lastCheckinDate === todayStr;

  const [selectedStaff, setSelectedStaff] = useState<WellnessScore | null>(null);
  const [interventionType, setInterventionType] = useState('MANDATORY_REST');
  const [interventionNote, setInterventionNote] = useState('');
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false);

  // Synchronize state changes to localStorage whenever wellnessLogs updates
  useEffect(() => {
    localStorage.setItem('worknest_wellness_state', JSON.stringify(wellnessLogs));
  }, [wellnessLogs]);

  // Dynamic Metrics derived directly from live persistent wellnessLogs
  const avgBurnout = wellnessLogs.length
    ? Math.round((wellnessLogs.reduce((acc, log) => acc + log.burnoutRisk, 0) / wellnessLogs.length) * 10) / 10
    : 0;
  const criticalStaffCount = wellnessLogs.filter((log) => log.burnoutRisk >= 75 && !log.isSupportActive).length;
  const avgOvertime = wellnessLogs.length
    ? Math.round((wellnessLogs.reduce((acc, log) => acc + log.overtimeHours, 0) / wellnessLogs.length) * 10) / 10
    : 0;

  const handleOpenIntervention = (staff: WellnessScore) => {
    setSelectedStaff(staff);
    setInterventionNote(`Approved proactive intervention for ${staff.name}: ${staff.suggestedAction}`);
    setIsInterventionModalOpen(true);
  };

  // Trigger Support Action - Updates state, recalculates stats & persists permanently
  const handleExecuteIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;

    const updatedLogs: WellnessScore[] = wellnessLogs.map((log) => {
      if (log.name === selectedStaff.name) {
        return {
          ...log,
          burnoutRisk: 15,
          overtimeHours: Math.max(0, log.overtimeHours - 10),
          riskLevel: 'LOW',
          isSupportActive: true,
          suggestedAction: `✓ Active HR Support Protocol Dispatched: ${
            interventionType === 'MANDATORY_REST'
              ? '2-Day Recovery Leave Activated'
              : interventionType === 'WORKLOAD_REASSIGN'
              ? 'Sprint Load Reassigned'
              : 'Wellbeing 1:1 Synchronized'
          }.`,
        };
      }
      return log;
    });

    setWellnessLogs(updatedLogs);
    localStorage.setItem('worknest_wellness_state', JSON.stringify(updatedLogs));

    success('HR Support Protocol Dispatched', `Proactive care protocol successfully initiated for ${selectedStaff.name}. Burnout index reduced to 15%.`);
    setIsInterventionModalOpen(false);
  };

  // Reset demo state helper
  const handleResetWellnessData = () => {
    setWellnessLogs(DEFAULT_WELLNESS_LOGS);
    localStorage.setItem('worknest_wellness_state', JSON.stringify(DEFAULT_WELLNESS_LOGS));
    success('Wellness Radar Reset', 'Restored initial telemetry values.');
  };

  // Handle Daily Wellness Check-In (Strictly Once Per Day)
  const handleDailyCheckin = (moodKey: string, label: string) => {
    if (isCheckedInToday) return;

    localStorage.setItem('worknest_wellness_checkin_date', todayStr);
    localStorage.setItem('worknest_wellness_checkin_mood', label);
    setLastCheckinDate(todayStr);
    setSavedMood(label);

    success('Daily Pulse Recorded', `Your wellbeing pulse (${label}) was logged for today (${todayStr}).`);
  };

  const getRiskBadge = (level: string, isSupportActive?: boolean) => {
    if (isSupportActive) {
      return <Badge variant="success" size="sm">✓ Active Support (15%)</Badge>;
    }
    switch (level) {
      case 'CRITICAL':
        return <Badge variant="danger" size="sm">Critical Risk (80%+)</Badge>;
      case 'HIGH':
        return <Badge variant="warning" size="sm">High Risk (65-79%)</Badge>;
      case 'MEDIUM':
        return <Badge variant="purple" size="sm">Moderate Strain</Badge>;
      default:
        return <Badge variant="success" size="sm">Healthy (Optimal)</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 font-display">
            <HeartPulse className="w-5 h-5 text-rose-500" /> Employee Wellness & Burnout Prediction
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            AI-driven continuous workload telemetry, fatigue indices, and persistent proactive HR support.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetWellnessData}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            title="Reset telemetry to default demo state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Stats</span>
          </button>
          <span className="px-3 py-1 rounded-full bg-[#00ffc2]/10 text-[#00ffc2] border border-[#00ffc2]/30 text-xs font-mono font-bold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> Live Sync Active
          </span>
        </div>
      </div>

      {/* Dynamic Overview Stat Cards (Always in sync with persistent state) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0e1217] border border-white/10 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Burnout Index</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2 font-display font-mono">{avgBurnout}%</div>
          <div className="flex items-center gap-1 text-[11px] text-[#00ffc2] mt-1 font-semibold">
            <TrendingDown className="w-3 h-3" /> Live calculation from {wellnessLogs.length} members
          </div>
        </div>

        <div className="bg-[#0e1217] border border-white/10 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Critical Fatigue Alerts</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400 mt-2 font-display font-mono">{criticalStaffCount} Staff</div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            {criticalStaffCount > 0 ? 'Proactive intervention required' : 'All critical strains resolved ✓'}
          </div>
        </div>

        <div className="bg-[#0e1217] border border-white/10 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Weekly Overtime</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-[#00f0ff] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2 font-display font-mono">{avgOvertime} hrs</div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">Overtime threshold: 8.0h/wk</div>
        </div>

        <div className="bg-[#0e1217] border border-white/10 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rest Days Adherence</span>
            <div className="w-8 h-8 rounded-xl bg-[#00ffc2]/10 text-[#00ffc2] flex items-center justify-center">
              <Coffee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2 font-display font-mono">94.1%</div>
          <div className="flex items-center gap-1 text-[11px] text-[#00ffc2] mt-1 font-semibold">
            <CheckCircle2 className="w-3 h-3" /> Healthy organization pacing
          </div>
        </div>
      </div>

      {/* Daily Wellness Pulse Survey (Strictly Once Per Calendar Day) */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-black rounded-3xl p-6 text-white border border-white/10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00f0ff]/15 text-[#00f0ff] text-[11px] font-bold border border-[#00f0ff]/30">
              <Sparkles className="w-3.5 h-3.5" /> Anonymous Daily Pulse
            </div>
            <h3 className="text-lg font-extrabold text-white">How energized are you feeling today, {user?.profile?.firstName}?</h3>
            <p className="text-xs text-slate-400">
              Employees can punch in wellness status once per day. Your submission optimizes workload distribution.
            </p>
          </div>

          {!isCheckedInToday ? (
            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: 'great', label: 'Energized ⚡', icon: <Smile className="w-4 h-4 text-[#00ffc2]" /> },
                { key: 'good', label: 'Good 😊', icon: <Smile className="w-4 h-4 text-[#00f0ff]" /> },
                { key: 'neutral', label: 'Okay 😐', icon: <Meh className="w-4 h-4 text-amber-400" /> },
                { key: 'stressed', label: 'Stressed 😫', icon: <Frown className="w-4 h-4 text-orange-400" /> },
                { key: 'exhausted', label: 'Burned Out 🔥', icon: <Frown className="w-4 h-4 text-rose-400" /> },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleDailyCheckin(item.key, item.label)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-bold transition-all cursor-pointer hover:scale-105"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-[#00ffc2]/15 border border-[#00ffc2]/30 text-[#00ffc2] px-5 py-2.5 rounded-2xl text-xs font-bold font-mono">
              <CheckCircle2 className="w-5 h-5 text-[#00ffc2]" />
              <div>
                <div>✓ Today's Wellness Pulse Completed ({savedMood || 'Logged'})</div>
                <div className="text-[10px] text-slate-400 font-sans mt-0.5">You can punch in your next pulse check-in tomorrow.</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Burnout Risk Radar & Intervention Table (HR / Admin View) */}
      <div className="bg-[#0e1217] border border-white/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Workforce Burnout Telemetry & Proactive Intervention Engine</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Persistent state tracking &bull; Trigger support reduces strain and recalculates organizational index instantly.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Burnout Risk Score</th>
                <th className="py-3.5 px-4">Consecutive Days</th>
                <th className="py-3.5 px-4">Overtime (MTD)</th>
                <th className="py-3.5 px-4">AI Suggested Intervention</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {wellnessLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={log.avatar} alt="Avatar" className="w-8 h-8 rounded-xl bg-slate-800 object-cover" />
                      <div>
                        <span className="font-bold text-white block">{log.name}</span>
                        {log.isSupportActive && (
                          <span className="text-[10px] text-[#00ffc2] font-semibold flex items-center gap-1 mt-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Support Active
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-300">{log.department}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-white font-mono">{log.burnoutRisk}%</span>
                        {getRiskBadge(log.riskLevel, log.isSupportActive)}
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            log.burnoutRisk > 75
                              ? 'bg-rose-500'
                              : log.burnoutRisk > 50
                              ? 'bg-amber-500'
                              : 'bg-[#00ffc2]'
                          }`}
                          style={{ width: `${log.burnoutRisk}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-300">
                    {log.consecutiveDays} days
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-300">
                    {log.overtimeHours} hrs
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 max-w-xs leading-relaxed font-medium">
                    {log.suggestedAction}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenIntervention(log)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs cursor-pointer ${
                        log.isSupportActive
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-[#00f0ff]/15 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-slate-950 border-[#00f0ff]/40'
                      }`}
                    >
                      {log.isSupportActive ? 'Update Support' : 'Trigger Support'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* HR Intervention Dispatch Modal */}
      {isInterventionModalOpen && selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0e1217] border border-white/10 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Trigger HR Support Protocol</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Employee: {selectedStaff.name} ({selectedStaff.department})</p>
                </div>
              </div>
              <button
                onClick={() => setIsInterventionModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteIntervention} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Select HR Intervention Action</label>
                <select
                  value={interventionType}
                  onChange={(e) => setInterventionType(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-[#00f0ff]"
                >
                  <option value="MANDATORY_REST">🌴 Enforce Mandatory 2-Day Paid Recovery Leave</option>
                  <option value="WORKLOAD_REASSIGN">🔄 Rebalance Sprint Deliverables & PR Backlog</option>
                  <option value="ONE_ON_ONE_SYNC">💬 Schedule Skip-Level 1:1 Wellbeing Check-in</option>
                  <option value="WELLNESS_STIPEND">🧘 Grant $250 Wellness & Therapy Allowance</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">HR Commentary & Instructions</label>
                <textarea
                  rows={3}
                  required
                  value={interventionNote}
                  onChange={(e) => setInterventionNote(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#00f0ff] font-medium"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/20 text-slate-300 text-[11px] leading-relaxed">
                ⚡ <strong>Persistent Execution</strong>: Submitting will update {selectedStaff.name}'s burnout risk index, permanently persist across reloads, and update overall organizational stats.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInterventionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00f0ff] hover:bg-[#38f8ff] text-slate-950 font-extrabold text-xs shadow-md shadow-[#00f0ff]/25 cursor-pointer"
                >
                  Dispatch Support Protocol &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
