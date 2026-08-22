import React, { useState } from 'react';
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
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useToast } from '../context/ToastContext';

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
}

export const WellnessPage: React.FC = () => {
  const { user, role } = useAuth();
  const { success } = useToast();
  const isAdminOrHr = role === 'ADMIN' || role === 'HR_MANAGER';

  const [wellnessLogs, setWellnessLogs] = useState<WellnessScore[]>([
    {
      name: 'Elena Rodriguez',
      department: 'Design',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena_Rodriguez',
      burnoutRisk: 84,
      overtimeHours: 18.5,
      consecutiveDays: 12,
      lastLeaveDaysAgo: 140,
      riskLevel: 'CRITICAL',
      suggestedAction: 'Enforce 2-day mandatory rest break and rebalance sprint deliverable load.',
    },
    {
      name: 'David Kim',
      department: 'Engineering',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David_Kim',
      burnoutRisk: 68,
      overtimeHours: 12.0,
      consecutiveDays: 9,
      lastLeaveDaysAgo: 95,
      riskLevel: 'HIGH',
      suggestedAction: 'Schedule 1:1 check-in; reassign pending pull request reviews.',
    },
    {
      name: 'Alex Chen',
      department: 'Engineering',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex_Chen',
      burnoutRisk: 38,
      overtimeHours: 4.5,
      consecutiveDays: 5,
      lastLeaveDaysAgo: 24,
      riskLevel: 'MEDIUM',
      suggestedAction: 'Workload healthy; monitor weekend slack notifications.',
    },
    {
      name: 'Sarah Connor',
      department: 'Operations',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah_Connor',
      burnoutRisk: 18,
      overtimeHours: 1.0,
      consecutiveDays: 4,
      lastLeaveDaysAgo: 12,
      riskLevel: 'LOW',
      suggestedAction: 'Optimal stamina index; steady work-life rhythm.',
    },
  ]);

  const [selectedStaff, setSelectedStaff] = useState<WellnessScore | null>(null);
  const [interventionType, setInterventionType] = useState('MANDATORY_REST');
  const [interventionNote, setInterventionNote] = useState('');
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false);

  const [myMood, setMyMood] = useState<'great' | 'good' | 'neutral' | 'stressed' | 'exhausted' | null>(null);
  const [moodSubmitted, setMoodSubmitted] = useState(false);

  const handleOpenIntervention = (staff: WellnessScore) => {
    setSelectedStaff(staff);
    setInterventionNote(`Approved proactive intervention for ${staff.name}: ${staff.suggestedAction}`);
    setIsInterventionModalOpen(true);
  };

  const handleExecuteIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;

    // Update staff in list to healthy / managed
    setWellnessLogs((prev) =>
      prev.map((log) =>
        log.name === selectedStaff.name
          ? { ...log, burnoutRisk: Math.max(20, log.burnoutRisk - 35), riskLevel: 'LOW', suggestedAction: 'Intervention Active: Workload rebalanced & rest granted.' }
          : log
      )
    );

    success('HR Wellness Intervention Dispatched', `Proactive care protocol successfully initiated for ${selectedStaff.name}.`);
    setIsInterventionModalOpen(false);
  };

  const getRiskBadge = (level: string) => {
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
            AI-driven continuous workload telemetry, fatigue indices, and proactive HR intervention triggers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#00ffc2]/10 text-[#00ffc2] border border-[#00ffc2]/30 text-xs font-mono font-bold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> AI Model Active
          </span>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0e1217] border border-white/10 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Burnout Index</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2 font-display font-mono">42.8%</div>
          <div className="flex items-center gap-1 text-[11px] text-[#00ffc2] mt-1 font-semibold">
            <TrendingDown className="w-3 h-3" /> -3.4% vs last sprint (Improving)
          </div>
        </div>

        <div className="bg-[#0e1217] border border-white/10 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Critical Fatigue Alerts</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400 mt-2 font-display font-mono">2 Staff</div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">Interventions recommended</div>
        </div>

        <div className="bg-[#0e1217] border border-white/10 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Weekly Overtime</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-[#00f0ff] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2 font-display font-mono">6.2 hrs</div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">Per employee threshold: 8.0h</div>
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

      {/* Daily Wellness Pulse Survey (Employee Self-Service Widget) */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-black rounded-3xl p-6 text-white border border-white/10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00f0ff]/15 text-[#00f0ff] text-[11px] font-bold border border-[#00f0ff]/30">
              <Sparkles className="w-3.5 h-3.5" /> Anonymous Daily Pulse
            </div>
            <h3 className="text-lg font-extrabold text-white">How energized are you feeling today, {user?.profile?.firstName}?</h3>
            <p className="text-xs text-slate-400">
              Your response helps the AI workforce model optimize workload distribution and prevent burnout.
            </p>
          </div>

          {!moodSubmitted ? (
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
                  onClick={() => {
                    setMyMood(item.key as any);
                    setMoodSubmitted(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-bold transition-all cursor-pointer hover:scale-105"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-[#00ffc2]/20 border border-[#00ffc2]/40 text-[#00ffc2] px-4 py-2 rounded-xl text-xs font-bold font-mono">
              <CheckCircle2 className="w-4 h-4" /> Pulse recorded! Thanks for checking in.
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
              Identifies employees with excessive overtime, delayed vacation utilization, or consecutive sprint fatigue.
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
                      <span className="font-bold text-white">{log.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-300">{log.department}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-white font-mono">{log.burnoutRisk}%</span>
                        {getRiskBadge(log.riskLevel)}
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
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
                      className="px-3 py-1.5 rounded-xl bg-[#00f0ff]/15 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-slate-950 border border-[#00f0ff]/40 text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      Trigger Support
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
                ⚡ <strong>Instant Automated Dispatch</strong>: Submitting this form will automatically notify {selectedStaff.name}'s manager, adjust sprint load, and credit necessary recovery balance.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInterventionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00f0ff] hover:bg-[#38f8ff] text-slate-950 font-extrabold text-xs shadow-md shadow-[#00f0ff]/25"
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
