import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Target,
  Award,
  TrendingUp,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
  PlusCircle,
  BarChart3,
  ThumbsUp,
  Star,
  Users,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

interface OKRGoal {
  id: string;
  title: string;
  category: 'ENGINEERING' | 'PRODUCT' | 'OPERATIONS' | 'LEADERSHIP';
  owner: string;
  progress: number; // 0 - 100
  dueDate: string;
  status: 'ON_TRACK' | 'AT_RISK' | 'COMPLETED';
  keyResults: string[];
}

interface ContinuousFeedback {
  id: string;
  fromName: string;
  fromRole: string;
  toName: string;
  category: 'INNOVATION' | 'COLLABORATION' | 'SPEED' | 'LEADERSHIP';
  message: string;
  date: string;
  stars: number;
}

export const PerformancePage: React.FC = () => {
  const { user, role } = useAuth();
  const isAdminOrHr = role === 'ADMIN' || role === 'HR_MANAGER';

  const [goals, setGoals] = useState<OKRGoal[]>([
    {
      id: '1',
      title: 'Architect PostgreSQL 3NF Real-Time Query Cache',
      category: 'ENGINEERING',
      owner: 'Alex Chen',
      progress: 85,
      dueDate: 'Sep 30, 2026',
      status: 'ON_TRACK',
      keyResults: [
        'Reduce database query latency under 12ms',
        'Implement Redis write-through cache layer',
        'Zero schema regression across 100+ unit tests',
      ],
    },
    {
      id: '2',
      title: 'Redesign Enterprise Employee 360 Self-Service Portal',
      category: 'PRODUCT',
      owner: 'Elena Rodriguez',
      progress: 92,
      dueDate: 'Aug 31, 2026',
      status: 'COMPLETED',
      keyResults: [
        'Achieve 98% positive UX usability index',
        'Streamline payslip print & download flow to 1-click',
        'Support light & institutional enterprise themes',
      ],
    },
    {
      id: '3',
      title: 'Attain SOC-2 Type II Compliance & Audit Trail Hardening',
      category: 'LEADERSHIP',
      owner: 'Sarah Connor',
      progress: 60,
      dueDate: 'Oct 15, 2026',
      status: 'AT_RISK',
      keyResults: [
        '100% immutable tamper-evident audit logging on all auth events',
        'Enforce mandatory multi-factor token rotation',
      ],
    },
  ]);

  const [feedbacks, setFeedbacks] = useState<ContinuousFeedback[]>([
    {
      id: '1',
      fromName: 'Sarah Connor (Admin)',
      fromRole: 'VP Operations',
      toName: 'Alex Chen',
      category: 'INNOVATION',
      message:
        'Alex demonstrated incredible technical leadership by automating the entire PostgreSQL migration pipeline with zero downtime. Exemplary engineering execution!',
      date: 'Yesterday at 4:30 PM',
      stars: 5,
    },
    {
      id: '2',
      fromName: 'Marcus Vance (HR)',
      fromRole: 'HR Lead',
      toName: 'Elena Rodriguez',
      category: 'SPEED',
      message:
        'Elena turned around the complete corporate design system in record time. The new employee directory and split-screen portal look world-class.',
      date: '2 days ago',
      stars: 5,
    },
  ]);

  const [newFeedbackTo, setNewFeedbackTo] = useState('Alex Chen');
  const [newFeedbackMsg, setNewFeedbackMsg] = useState('');
  const [newFeedbackCat, setNewFeedbackCat] = useState<'INNOVATION' | 'COLLABORATION' | 'SPEED' | 'LEADERSHIP'>('COLLABORATION');

  const handlePostFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedbackMsg.trim()) return;

    const item: ContinuousFeedback = {
      id: Date.now().toString(),
      fromName: `${user?.profile?.firstName || 'User'} (${user?.role})`,
      fromRole: user?.profile?.designation || 'Staff',
      toName: newFeedbackTo,
      category: newFeedbackCat,
      message: newFeedbackMsg,
      date: 'Just now',
      stars: 5,
    };

    setFeedbacks([item, ...feedbacks]);
    setNewFeedbackMsg('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="success" size="sm">Completed</Badge>;
      case 'AT_RISK':
        return <Badge variant="danger" size="sm">At Risk</Badge>;
      default:
        return <Badge variant="primary" size="sm">On Track</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-display">
            <Target className="w-5 h-5 text-indigo-600" /> Performance Intelligence & OKRs
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Continuous 360 feedback, milestone tracking, and AI-assisted performance appraisal generation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Create New OKR Goal
          </Button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Organizational OKRs</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-display">12 Goals</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">82% on schedule</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Continuous Feedback Given</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-display">48 Praises</div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">+14 this quarter</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg High-Performer Index</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-display">4.8 / 5.0</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Based on peer & lead reviews</div>
        </div>
      </div>

      {/* Main Grid: OKR List on Left, Continuous Feedback on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: OKR Goals & Progress (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" /> Active Strategic Objectives
            </h3>
            <span className="text-xs text-slate-400 font-medium">Q3 2026 Cycle</span>
          </div>

          <div className="space-y-3.5">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3 hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                      {goal.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{goal.title}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Owner: <span className="text-slate-800 font-semibold">{goal.owner}</span> &bull; Target: {goal.dueDate}
                    </p>
                  </div>
                  {getStatusBadge(goal.status)}
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Key Results Completion</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        goal.progress >= 90
                          ? 'bg-emerald-500'
                          : goal.progress >= 70
                          ? 'bg-blue-600'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {/* Key Results Checklist */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  {goal.keyResults.map((kr, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{kr}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Continuous 360 Feedback Stream (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 text-emerald-600" /> Continuous 360 Peer Feedback
          </h3>

          {/* Quick Feedback Form */}
          <form
            onSubmit={handlePostFeedback}
            className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3"
          >
            <div className="text-xs font-bold text-slate-800">Send Instant Peer Praise / Feedback</div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newFeedbackTo}
                onChange={(e) => setNewFeedbackTo(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-blue-600"
              >
                <option value="Alex Chen">Alex Chen (Engineer)</option>
                <option value="Elena Rodriguez">Elena Rodriguez (Design)</option>
                <option value="Marcus Vance">Marcus Vance (HR)</option>
                <option value="David Kim">David Kim (Backend)</option>
              </select>

              <select
                value={newFeedbackCat}
                onChange={(e) => setNewFeedbackCat(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-blue-600"
              >
                <option value="INNOVATION">💡 Innovation</option>
                <option value="COLLABORATION">🤝 Collaboration</option>
                <option value="SPEED">⚡ Speed & Execution</option>
                <option value="LEADERSHIP">👑 Leadership</option>
              </select>
            </div>

            <textarea
              rows={2}
              value={newFeedbackMsg}
              onChange={(e) => setNewFeedbackMsg(e.target.value)}
              placeholder="What awesome contribution or help did they deliver?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium"
            />

            <Button type="submit" variant="primary" size="sm" className="w-full">
              Post Recognition Note
            </Button>
          </form>

          {/* Feedback Feed */}
          <div className="space-y-3 max-h-[480px] overflow-y-auto">
            {feedbacks.map((fb) => (
              <div
                key={fb.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{fb.fromName}</span>
                    <span className="text-slate-400"> &rarr; </span>
                    <span className="font-bold text-blue-600">{fb.toName}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{fb.date}</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                  "{fb.message}"
                </p>

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                    🏷️ {fb.category}
                  </span>
                  <div className="flex text-amber-400">
                    {Array.from({ length: fb.stars }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
