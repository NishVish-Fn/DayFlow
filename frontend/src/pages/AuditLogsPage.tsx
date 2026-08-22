import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { AuditLogViewer } from '../components/audit/AuditLogViewer';
import { ShieldAlert, Filter, Search } from 'lucide-react';
import { AuditLog } from '../types';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (actionFilter) params.action = actionFilter;
      if (resourceFilter && resourceFilter !== 'ALL') params.resourceType = resourceFilter;

      const { data } = await api.get('/audit-logs', { params });
      setLogs(data.data.logs);
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
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-400" /> Tamper-Evident System Audit Trail
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable administrative and security ledger recording state mutation diffs, actor IPs, and timestamps.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search action event (e.g. SALARY, LEAVE, AUTH)..."
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </form>

        <select
          value={resourceFilter}
          onChange={(e) => setResourceFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
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
        <div className="p-12 text-center text-slate-500 text-xs">Loading audit ledger...</div>
      ) : logs.length === 0 ? (
        <div className="p-12 text-center text-slate-500 text-xs">No audit logs matching query.</div>
      ) : (
        <AuditLogViewer logs={logs} />
      )}
    </div>
  );
};
