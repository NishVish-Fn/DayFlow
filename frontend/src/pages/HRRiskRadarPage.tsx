import React, { useState } from 'react';
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
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

interface RiskItem {
  id: string;
  employeeName: string;
  department: string;
  riskType: 'ATTRITION_RISK' | 'HIGH_ABSENTEEISM' | 'OVERTIME_FATIGUE' | 'EXPIRING_DOCUMENT';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  signal: string;
  recommendation: string;
  lastUpdated: string;
}

export const HRRiskRadarPage: React.FC = () => {
  const { user } = useAuth();

  const [riskAlerts, setRiskAlerts] = useState<RiskItem[]>([
    {
      id: '1',
      employeeName: 'Marcus Vance',
      department: 'HR Management',
      riskType: 'ATTRITION_RISK',
      severity: 'HIGH',
      signal: 'Decreased internal collaboration by 40% & 3 consecutive single-day leaves.',
      recommendation: 'Conduct skip-level career alignment session and review incentive vesting schedule.',
      lastUpdated: 'Today at 9:15 AM',
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
    },
  ]);

  const getSeverityBadge = (sev: string) => {
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
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-display">
            <ShieldAlert className="w-5 h-5 text-rose-600" /> HR Risk & Attrition Radar
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            AI-powered anomaly detection for flight risk, unplanned absenteeism, compliance expirations, and acute strain.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> 4 Active Signals
          </span>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Flight-Risk Indicators</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-display">1 Employee</div>
          <div className="text-[11px] text-rose-600 font-semibold mt-1">High retention priority</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Burnout & Overtime Spikes</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-display">2 Staff</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">Overtime &gt; 12h/wk</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Absenteeism Anomalies</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CalendarX className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-display">1 Pattern</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Unplanned Monday/Friday absences</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Compliance Expirations</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileWarning className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-display">1 Document</div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">Renewal required in &lt; 30d</div>
        </div>
      </div>

      {/* Risk Signals Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Active Real-Time Anomaly & Attrition Ledger</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Continuously cross-references punch clock anomalies, PTO gaps, and team collaboration signals.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Risk Category</th>
                <th className="py-3.5 px-4">Priority Level</th>
                <th className="py-3.5 px-4">Telemetry Signal</th>
                <th className="py-3.5 px-4">AI Recommended Intervention</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {riskAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div>
                      <span className="font-bold text-slate-900">{alert.employeeName}</span>
                      <span className="text-[10px] text-slate-400 block">{alert.department}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {getRiskTypeLabel(alert.riskType)}
                  </td>
                  <td className="py-3.5 px-4">
                    {getSeverityBadge(alert.severity)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 max-w-xs leading-relaxed font-medium">
                    {alert.signal}
                  </td>
                  <td className="py-3.5 px-4 text-blue-900 bg-blue-50/40 p-2.5 rounded-xl border border-blue-100 text-[11px] leading-relaxed font-medium max-w-sm">
                    {alert.recommendation}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button variant="secondary" size="sm" className="text-xs">
                      Resolve Signal
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
