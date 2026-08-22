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
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

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

  const [myMood, setMyMood] = useState<'great' | 'good' | 'neutral' | 'stressed' | 'exhausted' | null>(null);
  const [moodSubmitted, setMoodSubmitted] = useState(false);

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
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-display">
            <HeartPulse className="w-5 h-5 text-rose-500" /> Employee Wellness & Burnout Prediction
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            AI-driven continuous workload telemetry, fatigue indices, and proactive HR intervention triggers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> AI Model v2.4 Active
          </span>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Burnout Index</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-display">42.8%</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-semibold">
            <TrendingDown className="w-3 h-3" /> -3.4% vs last sprint (Improving)
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Critical Fatigue Alerts</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2 font-display">2 Staff</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Interventions recommended</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Weekly Overtime</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-display">6.2 hrs</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Per employee threshold: 8.0h</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rest Days Adherence</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Coffee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-display">94.1%</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-semibold">
            <CheckCircle2 className="w-3 h-3" /> Healthy organization pacing
          </div>
        </div>
      </div>

      {/* Daily Wellness Pulse Survey (Employee Self-Service Widget) */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5" /> Anonymous Daily Pulse
            </div>
            <h3 className="text-lg font-extrabold text-white">How energized are you feeling today, {user?.profile?.firstName}?</h3>
            <p className="text-xs text-slate-300">
              Your response helps the AI workforce model optimize workload distribution and prevent burnout.
            </p>
          </div>

          {!moodSubmitted ? (
            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: 'great', label: 'Energized ⚡', icon: <Smile className="w-4 h-4 text-emerald-400" /> },
                { key: 'good', label: 'Good 😊', icon: <Smile className="w-4 h-4 text-cyan-400" /> },
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
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold transition-all cursor-pointer hover:scale-105"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-4 py-2 rounded-xl text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" /> Pulse recorded! Thanks for checking in.
            </div>
          )}
        </div>
      </div>

      {/* Burnout Risk Radar & Intervention Table (HR / Admin View) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Workforce Burnout Telemetry & Intervention Engine</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Identifies employees with excessive overtime, delayed vacation utilization, or consecutive sprint fatigue.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
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
            <tbody className="divide-y divide-slate-100">
              {wellnessLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={log.avatar} alt="Avatar" className="w-8 h-8 rounded-xl bg-slate-100 object-cover" />
                      <span className="font-bold text-slate-900">{log.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-600">{log.department}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-slate-900">{log.burnoutRisk}%</span>
                        {getRiskBadge(log.riskLevel)}
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            log.burnoutRisk > 75
                              ? 'bg-rose-500'
                              : log.burnoutRisk > 50
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${log.burnoutRisk}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                    {log.consecutiveDays} days
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                    {log.overtimeHours} hrs
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs leading-relaxed font-medium">
                    {log.suggestedAction}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button variant="secondary" size="sm" className="text-xs">
                      Trigger Support
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
