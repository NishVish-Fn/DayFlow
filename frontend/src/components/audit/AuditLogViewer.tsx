import React, { useState } from 'react';
import { AuditLog } from '../../types';
import { Badge } from '../common/Badge';
import { Shield, ChevronDown, ChevronUp, Clock, User, Globe } from 'lucide-react';

export const AuditLogViewer: React.FC<{ logs: AuditLog[] }> = ({ logs }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getActionBadgeVariant = (action: string) => {
    if (action.includes('AUTH') || action.includes('LOGIN')) return 'primary';
    if (action.includes('SALARY') || action.includes('PAYROLL')) return 'purple';
    if (action.includes('LEAVE')) return 'success';
    if (action.includes('STATUS') || action.includes('SECURITY')) return 'danger';
    return 'neutral';
  };

  return (
    <div className="space-y-3">
      {logs.map((log) => {
        const isExpanded = expandedId === log.id;
        let parsedDiff: any = null;
        if (log.changesDiff) {
          try {
            parsedDiff = JSON.parse(log.changesDiff);
          } catch (e) {
            parsedDiff = log.changesDiff;
          }
        }

        return (
          <div
            key={log.id}
            className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition-all text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
                  <Shield className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100">{log.action}</span>
                    <Badge variant={getActionBadgeVariant(log.action)} size="sm">
                      {log.resourceType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-500" /> {log.userEmail || 'System / Anonymous'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" /> {new Date(log.createdAt).toLocaleString()}
                    </span>
                    {log.ipAddress && (
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3 text-slate-500" /> {log.ipAddress}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {parsedDiff && (
                <button
                  onClick={() => setExpandedId(isExpanded ? null : log.id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 transition-colors text-[11px]"
                >
                  {isExpanded ? 'Hide Payload Diff' : 'View Payload Diff'}
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>

            {/* Expandable JSON Diff */}
            {isExpanded && parsedDiff && (
              <div className="mt-3 pt-3 border-t border-slate-800/80">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                  State Mutation Snapshot (JSON Diff):
                </div>
                <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-indigo-300 font-mono text-[11px] overflow-x-auto">
                  {JSON.stringify(parsedDiff, null, 2)}
                </pre>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
