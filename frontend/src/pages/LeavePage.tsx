import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LeaveBalanceCard } from '../components/leave/LeaveBalanceCard';
import { ApplyLeaveModal } from '../components/leave/ApplyLeaveModal';
import { LeaveApprovalModal } from '../components/leave/LeaveApprovalModal';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  CalendarCheck,
  Calendar,
  ShieldCheck,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Ban,
} from 'lucide-react';
import { LeaveBalance, LeaveRequest, LeaveType } from '../types';
import { useToast } from '../context/ToastContext';

export const LeavePage: React.FC = () => {
  const { role } = useAuth();
  const isAdminOrHr = role === 'ADMIN' || role === 'HR_MANAGER';

  const [activeTab, setActiveTab] = useState<'my-leaves' | 'admin-approvals'>(
    isAdminOrHr ? 'admin-approvals' : 'my-leaves'
  );

  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [myRequests, setMyRequests] = useState<LeaveRequest[]>([]);
  const [adminRequests, setAdminRequests] = useState<LeaveRequest[]>([]);
  const [adminStatusFilter, setAdminStatusFilter] = useState('PENDING');

  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [selectedReviewRequest, setSelectedReviewRequest] = useState<LeaveRequest | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const fetchMyLeaves = async () => {
    try {
      setLoading(true);
      const [balRes, typeRes, reqRes] = await Promise.all([
        api.get('/leave/my-balances'),
        api.get('/leave/types'),
        api.get('/leave/my-requests'),
      ]);
      setLeaveBalances(balRes.data.data);
      setLeaveTypes(typeRes.data.data);
      setMyRequests(reqRes.data.data);
    } catch (e) {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminRequests = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (adminStatusFilter !== 'ALL') params.status = adminStatusFilter;
      const { data } = await api.get('/leave/admin/requests', { params });
      setAdminRequests(data.data.requests);
    } catch (e) {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'my-leaves') {
      fetchMyLeaves();
    } else if (isAdminOrHr && activeTab === 'admin-approvals') {
      fetchAdminRequests();
    }
  }, [activeTab, adminStatusFilter]);

  const handleCancelRequest = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this pending leave request?')) return;
    try {
      await api.delete(`/leave/requests/${id}`);
      success('Cancelled', 'Leave request cancelled and quota restored.');
      fetchMyLeaves();
    } catch (err: any) {
      error('Error', err.response?.data?.error?.message || 'Could not cancel request');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="success" size="sm">APPROVED</Badge>;
      case 'PENDING':
        return <Badge variant="warning" size="sm">PENDING REVIEW</Badge>;
      case 'REJECTED':
        return <Badge variant="danger" size="sm">REJECTED</Badge>;
      case 'CANCELLED':
        return <Badge variant="neutral" size="sm">CANCELLED</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-indigo-400" /> Leave Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Annual quota allocations, employee requests, and managerial approval workflows.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsApplyOpen(true)}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Apply for Leave
        </Button>
      </div>

      {/* Tabs */}
      {isAdminOrHr && (
        <div className="flex border-b border-slate-800 gap-4">
          <button
            onClick={() => setActiveTab('admin-approvals')}
            className={`flex items-center gap-2 py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'admin-approvals'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Managerial Approval Queue
          </button>

          <button
            onClick={() => setActiveTab('my-leaves')}
            className={`flex items-center gap-2 py-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'my-leaves'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" /> My Personal Leave Quotas
          </button>
        </div>
      )}

      {/* TAB 1: ADMIN APPROVALS QUEUE */}
      {activeTab === 'admin-approvals' && isAdminOrHr && (
        <div className="space-y-6">
          {/* Status Filter */}
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="flex gap-2">
              {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((st) => (
                <button
                  key={st}
                  onClick={() => setAdminStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    adminStatusFilter === st
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {st === 'ALL' ? 'All Applications' : st}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-400">
              {adminRequests.length} applications in queue
            </span>
          </div>

          {/* Queue Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Applicant</th>
                    <th className="py-3.5 px-4">Leave Type</th>
                    <th className="py-3.5 px-4">Dates & Duration</th>
                    <th className="py-3.5 px-4">Reason</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        Loading requests queue...
                      </td>
                    </tr>
                  ) : adminRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        No leave applications found matching filter criteria.
                      </td>
                    </tr>
                  ) : (
                    adminRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={
                                req.employee?.avatarUrl ||
                                `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.employee?.firstName}`
                              }
                              alt="Avatar"
                              className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700"
                            />
                            <div>
                              <div className="font-bold text-slate-100">
                                {req.employee?.firstName} {req.employee?.lastName}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {req.employee?.department} &bull; {req.employee?.designation}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-200">{req.leaveType?.name}</span>
                          <span className="text-[10px] text-indigo-400 block font-mono">
                            {req.leaveType?.code}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-200">
                            {new Date(req.startDate).toLocaleDateString()} &rarr; {new Date(req.endDate).toLocaleDateString()}
                          </div>
                          <div className="text-[10px] text-indigo-300 font-mono mt-0.5">
                            {req.totalDays} Day(s)
                          </div>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs truncate text-slate-300">
                          {req.reason}
                        </td>

                        <td className="py-3.5 px-4">
                          {getStatusBadge(req.status)}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {req.status === 'PENDING' ? (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                setSelectedReviewRequest(req);
                                setIsReviewOpen(true);
                              }}
                            >
                              Review & Decision
                            </Button>
                          ) : (
                            <span className="text-[11px] text-slate-500 italic">
                              Reviewed on {req.reviewedAt ? new Date(req.reviewedAt).toLocaleDateString() : 'N/A'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY LEAVES (Employee / Self) */}
      {activeTab === 'my-leaves' && (
        <div className="space-y-6">
          {/* Annual Quotas Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {leaveBalances.map((b) => (
              <LeaveBalanceCard key={b.id} balance={b} />
            ))}
          </div>

          {/* My Applications History */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" /> My Leave Application History
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Dates</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">Status / Admin Remarks</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {myRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        You have not submitted any leave requests.
                      </td>
                    </tr>
                  ) : (
                    myRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-200">
                          {req.leaveType?.name}
                        </td>
                        <td className="py-3.5 px-4">
                          {new Date(req.startDate).toLocaleDateString()} &rarr; {new Date(req.endDate).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-indigo-300 font-mono">
                          {req.totalDays} Day(s)
                        </td>
                        <td className="py-3.5 px-4 max-w-xs truncate text-slate-400">
                          {req.reason}
                        </td>
                        <td className="py-3.5 px-4">
                          <div>
                            {getStatusBadge(req.status)}
                            {req.adminRemarks && (
                              <div className="text-[10px] text-slate-400 italic mt-0.5">
                                Note: "{req.adminRemarks}"
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {req.status === 'PENDING' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-rose-400 hover:text-rose-300"
                              onClick={() => handleCancelRequest(req.id)}
                              leftIcon={<Ban className="w-3.5 h-3.5" />}
                            >
                              Cancel Request
                            </Button>
                          ) : (
                            <span className="text-[11px] text-slate-500">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {isApplyOpen && (
        <ApplyLeaveModal
          isOpen={isApplyOpen}
          onClose={() => setIsApplyOpen(false)}
          leaveBalances={leaveBalances}
          leaveTypes={leaveTypes}
          onSuccess={() => {
            fetchMyLeaves();
            if (isAdminOrHr) fetchAdminRequests();
          }}
        />
      )}

      {/* Leave Approval Modal */}
      {isReviewOpen && (
        <LeaveApprovalModal
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          request={selectedReviewRequest}
          onProcessed={() => {
            fetchAdminRequests();
            fetchMyLeaves();
          }}
        />
      )}
    </div>
  );
};
