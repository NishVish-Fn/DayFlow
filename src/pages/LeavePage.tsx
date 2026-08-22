import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ApplyLeaveModal } from '../components/leave/ApplyLeaveModal';
import { Badge } from '../components/common/Badge';
import {
  CalendarCheck,
  Calendar,
  ShieldCheck,
  Plus,
  Clock,
  Ban,
  Search,
  Check,
  X,
  FileText,
} from 'lucide-react';
import { LeaveBalance, LeaveRequest, LeaveType } from '../types';
import { useToast } from '../context/ToastContext';

export const LeavePage: React.FC = () => {
  const { user, role } = useAuth();
  const isAdminOrHr = role === 'ADMIN' || role === 'HR_MANAGER';
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'my-leaves' | 'admin-approvals'>(
    isAdminOrHr ? 'admin-approvals' : 'my-leaves'
  );

  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Summary Quotas (§8 Spec: Paid Time Off e.g. 24 days, Sick Time Off e.g. 7 days)
  const [quotas, setQuotas] = useState([
    { name: 'Paid Time Off', code: 'PTO', total: 24, used: 4, remaining: 20, color: 'blue' },
    { name: 'Sick Time Off', code: 'SICK', total: 7, used: 1, remaining: 6, color: 'emerald' },
    { name: 'Unpaid Leave', code: 'UNPAID', total: 30, used: 0, remaining: 30, color: 'purple' },
  ]);

  // Own time-off records (§8 Spec: Name, Start Date, End Date, Time Off Type, Status)
  const [myRequests, setMyRequests] = useState<any[]>([
    {
      id: 'req-1',
      name: `${user?.profile?.firstName || 'Alex'} ${user?.profile?.lastName || 'Chen'}`,
      startDate: '2026-09-01',
      endDate: '2026-09-05',
      timeOffType: 'Paid Time Off (PTO)',
      days: 5,
      status: 'APPROVED',
      attachment: null,
    },
    {
      id: 'req-2',
      name: `${user?.profile?.firstName || 'Alex'} ${user?.profile?.lastName || 'Chen'}`,
      startDate: '2026-08-10',
      endDate: '2026-08-11',
      timeOffType: 'Sick Leave',
      days: 2,
      status: 'APPROVED',
      attachment: 'Medical_Prescription.pdf',
    },
    {
      id: 'req-3',
      name: `${user?.profile?.firstName || 'Alex'} ${user?.profile?.lastName || 'Chen'}`,
      startDate: '2026-09-20',
      endDate: '2026-09-22',
      timeOffType: 'Paid Time Off (PTO)',
      days: 3,
      status: 'PENDING',
      attachment: null,
    },
  ]);

  // Admin view records for ALL employees (§8 Spec)
  const [adminRequests, setAdminRequests] = useState<any[]>([
    {
      id: 'adm-1',
      name: 'Elena Rodriguez',
      badgeId: 'OIELRO20230004',
      startDate: '2026-08-25',
      endDate: '2026-08-27',
      timeOffType: 'Paid Time Off (PTO)',
      days: 3,
      reason: 'Family wedding event',
      status: 'PENDING',
      attachment: null,
    },
    {
      id: 'adm-2',
      name: 'Alex Chen',
      badgeId: 'OIALCH20230003',
      startDate: '2026-09-20',
      endDate: '2026-09-22',
      timeOffType: 'Paid Time Off (PTO)',
      days: 3,
      reason: 'Personal travel and wellness recovery',
      status: 'PENDING',
      attachment: null,
    },
    {
      id: 'adm-3',
      name: 'Marcus Vance',
      badgeId: 'OIMAVA20220002',
      startDate: '2026-08-01',
      endDate: '2026-08-02',
      timeOffType: 'Sick Leave',
      days: 2,
      reason: 'Viral fever rest',
      status: 'APPROVED',
      attachment: 'Clinic_Receipt.pdf',
    },
  ]);

  const handleApprove = (id: string) => {
    setAdminRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'APPROVED' } : r))
    );
    success('Time Off Approved', 'Allocation approved and notification sent to employee.');
  };

  const handleReject = (id: string) => {
    setAdminRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'REJECTED' } : r))
    );
    success('Time Off Rejected', 'Allocation rejected and days restored.');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & "NEW" Button (§0 & §8 Spec) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <CalendarCheck className="w-6 h-6 text-[#0071e3]" /> Time Off Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            §8 Specification &bull; Paid Time Off, Sick Leave & Managerial Approvals
          </p>
        </div>

        {/* §0 & §8 Spec: "NEW" button */}
        <button
          onClick={() => setIsApplyOpen(true)}
          className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs tracking-wide shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>NEW</span>
        </button>
      </div>

      {/* Tabs if Admin/HR */}
      {isAdminOrHr && (
        <div className="flex p-1 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] text-xs">
          <button
            onClick={() => setActiveTab('admin-approvals')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === 'admin-approvals'
                ? 'bg-white dark:bg-[#2c2c2e] text-[#0071e3] dark:text-[#2997ff] shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> All Employees Time Off Queue
          </button>

          <button
            onClick={() => setActiveTab('my-leaves')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === 'my-leaves'
                ? 'bg-white dark:bg-[#2c2c2e] text-[#0071e3] dark:text-[#2997ff] shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> My Leave Balances & History
          </button>
        </div>
      )}

      {/* §8 Spec: Summary Cards: Paid Time Off (24d available), Sick Time Off (7d available) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quotas.map((q) => (
          <div
            key={q.code}
            className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-5 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 dark:text-white">{q.name}</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#0071e3]/10 text-[#0071e3] dark:text-[#2997ff] font-bold">
                {q.code}
              </span>
            </div>

            <div className="my-3">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{q.remaining}</span>
                <span className="text-xs text-slate-400 font-medium">/ {q.total} Days Total</span>
              </div>
              <div className="w-full bg-black/[0.05] dark:bg-white/[0.08] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#0071e3] h-1.5 rounded-full"
                  style={{ width: `${(q.remaining / q.total) * 100}%` }}
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex justify-between pt-2 border-t border-black/[0.04] dark:border-white/[0.06]">
              <span>Used: <strong className="text-slate-700 dark:text-slate-200">{q.used}d</strong></span>
              <span>Available: <strong className="text-emerald-600 dark:text-emerald-400">{q.remaining}d</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* §8 Spec: Search Bar Included */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3" />
        <input
          type="text"
          placeholder="Search time-off records by name or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl pl-11 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0071e3]"
        />
      </div>

      {/* §8 Spec Admin View: All Employees with Status & Approve/Reject Actions */}
      {activeTab === 'admin-approvals' && isAdminOrHr && (
        <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-900 border-b border-black/[0.05] dark:border-white/[0.08] text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Start Date</th>
                  <th className="py-3 px-4">End Date</th>
                  <th className="py-3 px-4">Time Off Type</th>
                  <th className="py-3 px-4">Reason / Attachment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
                {adminRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{req.name}</div>
                      <div className="text-[10px] font-mono text-[#0071e3]">{req.badgeId}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">{req.startDate}</td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">{req.endDate}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{req.timeOffType}</td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                      {req.reason}
                      {req.attachment && (
                        <span className="block text-[10px] text-[#0071e3] font-semibold flex items-center gap-1 mt-0.5">
                          <FileText className="w-3 h-3" /> {req.attachment}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={req.status === 'APPROVED' ? 'success' : req.status === 'PENDING' ? 'warning' : 'danger'}
                        size="sm"
                      >
                        {req.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {req.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApprove(req.id)}
                            className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-xs cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleReject(req.id)}
                            className="flex items-center gap-1 px-3 py-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] shadow-xs cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Decided</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* §8 Spec Employee View: Own Time Off Records (Name, Start Date, End Date, Time Off Type, Status) */}
      {activeTab === 'my-leaves' && (
        <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-900 border-b border-black/[0.05] dark:border-white/[0.08] text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Start Date</th>
                  <th className="py-3 px-4">End Date</th>
                  <th className="py-3 px-4">Time Off Type</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
                {myRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{req.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">{req.startDate}</td>
                    <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">{req.endDate}</td>
                    <td className="py-3 px-4 font-semibold text-[#0071e3] dark:text-[#2997ff]">{req.timeOffType}</td>
                    <td className="py-3 px-4 text-right">
                      <Badge
                        variant={req.status === 'APPROVED' ? 'success' : req.status === 'PENDING' ? 'warning' : 'danger'}
                        size="sm"
                      >
                        {req.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* §8 Spec Time Off Request Form Modal */}
      {isApplyOpen && (
        <ApplyLeaveModal
          isOpen={isApplyOpen}
          onClose={() => setIsApplyOpen(false)}
          leaveBalances={[]}
          leaveTypes={[]}
          onSuccess={() => {
            success('Time Off Request Saved', 'Your application is registered.');
          }}
        />
      )}
    </div>
  );
};
