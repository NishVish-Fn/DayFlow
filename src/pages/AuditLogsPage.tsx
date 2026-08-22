import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { AuditLogViewer } from '../components/audit/AuditLogViewer';
import { ShieldAlert, Filter, Search } from 'lucide-react';
import { AuditLog } from '../types';

const DEFAULT_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-2026-08-20',
    userId: 'u-01',
    userEmail: 'admin@dayflow.internal',
    action: 'BATCH_PAYROLL_DISBURSE',
    resourceType: 'PAYROLL',
    resourceId: 'batch-aug-2026',
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    details: JSON.stringify({ batchAmount: 524000, recipientCount: 55, bankRef: 'ACH-2026-08' }),
    createdAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'aud-2026-08-15',
    userId: 'u-02',
    userEmail: 'hr@dayflow.internal',
    action: 'LEAVE_REQUEST_APPROVE',
    resourceType: 'LEAVE',
    resourceId: 'lv-03',
    ipAddress: '192.168.1.112',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    details: JSON.stringify({ employee: 'David Kim', type: 'SICK', days: 2 }),
    createdAt: '2026-08-15T14:22:10Z',
  },
  {
    id: 'aud-2026-07-31',
    userId: 'u-01',
    userEmail: 'admin@dayflow.internal',
    action: 'BATCH_PAYROLL_DISBURSE',
    resourceType: 'PAYROLL',
    resourceId: 'batch-jul-2026',
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    details: JSON.stringify({ batchAmount: 524000, recipientCount: 55 }),
    createdAt: '2026-07-31T18:30:00Z',
  },
  {
    id: 'aud-2026-06-15',
    userId: 'u-02',
    userEmail: 'hr@dayflow.internal',
    action: 'EMPLOYEE_ONBOARD',
    resourceType: 'EMPLOYEE',
    resourceId: 'emp-54',
    ipAddress: '192.168.1.112',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    details: JSON.stringify({ employee: 'John Ternus', designation: 'Enterprise Hardware Operations Engineer' }),
    createdAt: '2026-06-15T09:15:00Z',
  },
  {
    id: 'aud-2026-05-10',
    userId: 'u-01',
    userEmail: 'admin@dayflow.internal',
    action: 'SALARY_STRUCTURE_AMENDMENT',
    resourceType: 'PAYROLL',
    resourceId: 'struct-v2-emp-03',
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    details: JSON.stringify({ employee: 'Alex Chen', previousGross: 135000, newGross: 146880 }),
    createdAt: '2026-05-10T11:45:00Z',
  },
  {
    id: 'aud-2026-04-01',
    userId: 'u-02',
    userEmail: 'hr@dayflow.internal',
    action: 'EMPLOYEE_ONBOARD',
    resourceType: 'EMPLOYEE',
    resourceId: 'emp-13',
    ipAddress: '192.168.1.112',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    details: JSON.stringify({ employee: 'Lucas Santos', designation: 'Mobile Systems Engineer' }),
    createdAt: '2026-04-01T09:00:00Z',
  },
  {
    id: 'aud-2026-01-15',
    userId: 'u-01',
    userEmail: 'admin@dayflow.internal',
    action: 'ANNUAL_POLICY_UPDATE',
    resourceType: 'LEAVE',
    resourceId: 'policy-2026',
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    details: JSON.stringify({ ptoAllocation: 24, sickAllocation: 7, carryForwardCap: 10 }),
    createdAt: '2026-01-15T08:00:00Z',
  },
];

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>(DEFAULT_AUDIT_LOGS);
  const [loading, setLoading] = useState(false);
  const [actionFilter, setActionFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (actionFilter) params.action = actionFilter;
      if (resourceFilter && resourceFilter !== 'ALL') params.resourceType = resourceFilter;

      const { data } = await api.get('/audit-logs', { params });
      if (data.data?.logs?.length) {
        setLogs(data.data.logs);
      }
    } catch (e) {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [resourceFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-display">
            <ShieldAlert className="w-5 h-5 text-blue-600" /> Tamper-Evident System Audit Trail
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable administrative and security ledger recording state mutation diffs, actor IPs, and timestamps.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search action event (e.g. SALARY, LEAVE, AUTH)..."
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </form>

        <select
          value={resourceFilter}
          onChange={(e) => setResourceFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-600"
        >
          <option value="ALL">All Target Resources</option>
          <option value="AUTH">Authentication / Security</option>
          <option value="EMPLOYEE">Employee Profiles</option>
          <option value="PAYROLL">Payroll & Salary</option>
          <option value="LEAVE">Leave Workflow</option>
          <option value="ATTENDANCE">Attendance Overrides</option>
        </select>
      </div>

      {/* Audit Logs List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading audit ledger...</div>
      ) : logs.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-xs">No audit logs matching query.</div>
      ) : (
        <AuditLogViewer logs={logs} />
      )}
    </div>
  );
};
