import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  AlertTriangle,
  Users,
  Flame,
  UserX,
  FileWarning,
  TrendingUp,
  Clock,
  CheckCircle2,
  CalendarX,
  ArrowRight,
  Sparkles,
  X,
  RotateCcw,
  Check,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useToast } from '../context/ToastContext';

interface RiskItem {
  id: string;
  employeeName: string;
  department: string;
  riskType: 'ATTRITION_RISK' | 'HIGH_ABSENTEEISM' | 'OVERTIME_FATIGUE' | 'EXPIRING_DOCUMENT';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  signal: string;
  recommendation: string;
  lastUpdated: string;
  isResolved?: boolean;
  resolutionNote?: string;
}

const DEFAULT_RISK_ALERTS: RiskItem[] = [
  {
    id: '1',
    employeeName: 'Marcus Vance',
    department: 'HR Management',
    riskType: 'ATTRITION_RISK',
    severity: 'HIGH',
    signal: 'Decreased internal collaboration by 40% & 3 consecutive single-day leaves.',
    recommendation: 'Conduct skip-level career alignment session and review incentive vesting schedule.',
    lastUpdated: 'Today at 9:15 AM',
    isResolved: false,
  },
  {
    id: '2',
    employeeName: 'David Kim',
    department: 'Engineering',
    riskType: 'OVERTIME_FATIGUE',
    severity: 'HIGH',
    signal: '18.5 overtime hours logged across sprint with 12 consecutive active punch days.',
    recommendation: 'Enforce mandatory weekend shift blackout and rebalance Jira sprint tickets.',
    lastUpdated: 'Yesterday at 5:40 PM',
    isResolved: false,
  },
  {
    id: '3',
    employeeName: 'Jessica Taylor',
    department: 'Sales',
    riskType: 'HIGH_ABSENTEEISM',
    severity: 'MEDIUM',
    signal: 'Unplanned absence rate exceeded 15% threshold over the past 30 days.',
    recommendation: 'Check-in on personal circumstance support and offer flexible remote work schedule.',
    lastUpdated: '2 days ago',
    isResolved: false,
  },
  {
    id: '4',
    employeeName: 'Elena Rodriguez',
    department: 'Design',
    riskType: 'EXPIRING_DOCUMENT',
    severity: 'LOW',
    signal: 'Corporate Work Authorization / Visa credential expires in 28 days.',
    recommendation: 'Send automated document renewal reminder and trigger Legal counsel renewal workflow.',
    lastUpdated: '3 days ago',
    isResolved: false,
  },
];

export const HRRiskRadarPage: React.FC = () => {
  const { user } = useAuth();
  const { success } = useToast();

  // Persistent Risk Alerts across page reloads
  const [riskAlerts, setRiskAlerts] = useState<RiskItem[]>(() => {
    try {
      const saved = localStorage.getItem('worknest_risk_radar_state');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return DEFAULT_RISK_ALERTS;
  });

  const [selectedAlert, setSelectedAlert] = useState<RiskItem | null>(null);
  const [resolutionAction, setResolutionAction] = useState('RETENTION_PACKAGE');
  const [resolutionNote, setResolutionNote] = useState('');
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('worknest_risk_radar_state', JSON.stringify(riskAlerts));
  }, [riskAlerts]);

  // Derived metrics from persistent alerts
  const activeSignalsCount = riskAlerts.filter((a) => !a.isResolved).length;
  const flightRiskCount = riskAlerts.filter((a) => a.riskType === 'ATTRITION_RISK' && !a.isResolved).length;
  const burnoutSpikeCount = riskAlerts.filter((a) => a.riskType === 'OVERTIME_FATIGUE' && !a.isResolved).length;
  const absenteeismCount = riskAlerts.filter((a) => a.riskType === 'HIGH_ABSENTEEISM' && !a.isResolved).length;
  const expiringDocCount = riskAlerts.filter((a) => a.riskType === 'EXPIRING_DOCUMENT' && !a.isResolved).length;

  const handleOpenResolve = (alert: RiskItem) => {
    setSelectedAlert(alert);
    setResolutionNote(`Resolved crisis for ${alert.employeeName}: Executed ${alert.recommendation}`);
    setIsResolveModalOpen(true);
  };

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlert) return;

    const updatedAlerts = riskAlerts.map((a) => {
      if (a.id === selectedAlert.id) {
        return {
          ...a,
          isResolved: true,
          resolutionNote: `Resolved by HR Admin: ${resolutionNote}`,
          lastUpdated: 'Just now',
        };
      }
      return a;
    });

    setRiskAlerts(updatedAlerts);
    localStorage.setItem('worknest_risk_radar_state', JSON.stringify(updatedAlerts));

    success('Crisis Resolved Successfully', `Risk signal for ${selectedAlert.employeeName} has been resolved and archived.`);
    setIsResolveModalOpen(false);
  };

  const handleResetData = () => {
    setRiskAlerts(DEFAULT_RISK_ALERTS);
    localStorage.setItem('worknest_risk_radar_state', JSON.stringify(DEFAULT_RISK_ALERTS));
    success('Risk Radar Reset', 'Restored initial anomaly alerts.');
  };

  const getSeverityBadge = (sev: string, isResolved?: boolean) => {
    if (isResolved) {
      return <Badge variant="success" size="sm">✓ Resolved & Closed</Badge>;
    }
    switch (sev) {
      case 'HIGH':
        return <Badge variant="danger" size="sm">Critical Priority</Badge>;
      case 'MEDIUM':
        return <Badge variant="warning" size="sm">Elevated Risk</Badge>;
      default:
        return <Badge variant="neutral" size="sm">Routine Notice</Badge>;
    }
  };

  const getRiskTypeLabel = (t: string) => {
    switch (t) {
      case 'ATTRITION_RISK':
        return '🚨 Early Attrition / Flight Risk';
      case 'OVERTIME_FATIGUE':
        return '🔥 Overtime Strain & Burnout';
      case 'HIGH_ABSENTEEISM':
        return '📉 High Absenteeism Pattern';
      case 'EXPIRING_DOCUMENT':
        return '📄 Expiring Compliance Document';
      default:
        return t;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
            <ShieldAlert className="w-5 h-5 text-rose-600" /> HR Risk & Attrition Radar
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            AI-powered anomaly detection for flight risk, unplanned absenteeism, compliance expirations, and acute strain.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetData}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white bg-black/5 dark:bg-white/5 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            title="Reset alerts to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Alerts</span>
          </button>
          <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold flex items-center gap-1.5 font-mono">
            <AlertTriangle className="w-3.5 h-3.5" /> {activeSignalsCount} Active Signals
          </span>
        </div>
      </div>

      {/* Dynamic Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Flight-Risk Indicators</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-display font-mono">{flightRiskCount} Staff</div>
          <div className="text-[11px] text-rose-600 font-semibold mt-1">
            {flightRiskCount > 0 ? 'High retention priority' : 'All flight risks mitigated ✓'}
          </div>
        </div>

        <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Burnout & Overtime Spikes</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-display font-mono">{burnoutSpikeCount} Staff</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">
            {burnoutSpikeCount > 0 ? 'Overtime > 12h/wk' : 'Workload balanced ✓'}
          </div>
        </div>

        <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Absenteeism Anomalies</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CalendarX className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-display font-mono">{absenteeismCount} Pattern</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {absenteeismCount > 0 ? 'Unplanned Monday/Friday absences' : 'Normal attendance rhythm ✓'}
          </div>
        </div>

        <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Compliance Expirations</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileWarning className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-display font-mono">{expiringDocCount} Document</div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">
            {expiringDocCount > 0 ? 'Renewal required in < 30d' : 'All credentials verified ✓'}
          </div>
        </div>
      </div>

      {/* Risk Signals Table with Active Resolve Crisis Triggers */}
      <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Real-Time Anomaly & Attrition Ledger</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Cross-references punch clock anomalies, PTO gaps, and team collaboration signals with permanent resolution triggers.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-black/[0.05] dark:border-white/[0.06] text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Risk Category</th>
                <th className="py-3.5 px-4">Priority Level</th>
                <th className="py-3.5 px-4">Telemetry Signal</th>
                <th className="py-3.5 px-4">AI Recommended Intervention</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
              {riskAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{alert.employeeName}</span>
                      <span className="text-[10px] text-slate-400 block">{alert.department}</span>
                      {alert.isResolved && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Resolved
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                    {getRiskTypeLabel(alert.riskType)}
                  </td>
                  <td className="py-3.5 px-4">
                    {getSeverityBadge(alert.severity, alert.isResolved)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 max-w-xs leading-relaxed font-medium">
                    {alert.signal}
                  </td>
                  <td className="py-3.5 px-4 text-blue-900 dark:text-blue-200 bg-blue-50/40 dark:bg-blue-950/20 p-2.5 rounded-xl border border-blue-100 dark:border-blue-900 text-[11px] leading-relaxed font-medium max-w-sm">
                    {alert.isResolved ? alert.resolutionNote : alert.recommendation}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {!alert.isResolved ? (
                      <button
                        type="button"
                        onClick={() => handleOpenResolve(alert)}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                      >
                        Resolve Crisis
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-600 font-semibold font-mono">
                        Archived ✓
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resolve Crisis Intervention Modal */}
      {isResolveModalOpen && selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1e1f20] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.08] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-600 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Resolve Crisis & Mitigate Risk</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Employee: {selectedAlert.employeeName} ({selectedAlert.department})</p>
                </div>
              </div>
              <button
                onClick={() => setIsResolveModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmResolve} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select HR Mitigation Action</label>
                <select
                  value={resolutionAction}
                  onChange={(e) => setResolutionAction(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-black/[0.1] dark:border-white/[0.15] rounded-xl px-3 py-2 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#0071e3]"
                >
                  <option value="RETENTION_PACKAGE">💼 Deploy Retention Package & Vesting Alignment</option>
                  <option value="SHIFT_BLACKOUT">🛑 Enforce Mandatory Shift Blackout & Rest</option>
                  <option value="SCHEDULE_FLEXIBILITY">🏠 Grant Flexible Remote / Hybrid Schedule</option>
                  <option value="VISA_RENEWAL">📄 Trigger Expedited Document Renewal Protocol</option>
                  <option value="ONE_ON_ONE_SYNC">💬 Complete Executive 1:1 Check-in</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Resolution Protocol Notes</label>
                <textarea
                  rows={3}
                  required
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-black/[0.1] dark:border-white/[0.15] rounded-xl p-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0071e3] font-medium"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200 text-[11px] leading-relaxed">
                ✓ <strong>Permanent Persistence</strong>: Resolving will archive this crisis, reduce active priority counters, and save the resolution record permanently across all sessions.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResolveModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-black/[0.05] dark:bg-white/[0.08] text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md cursor-pointer"
                >
                  Confirm Crisis Resolution &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
