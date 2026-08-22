import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LeaveBalance, LeaveType } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  leaveBalances: LeaveBalance[];
  leaveTypes: LeaveType[];
  onSuccess: () => void;
}

export const ApplyLeaveModal: React.FC<Props> = ({
  isOpen,
  onClose,
  leaveBalances,
  leaveTypes,
  onSuccess,
}) => {
  const [leaveTypeId, setLeaveTypeId] = useState(leaveTypes[0]?.id || '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const selectedBalance = leaveBalances.find((b) => b.leaveTypeId === leaveTypeId);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return 0;
    const diff = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const requestedDays = calculateDays();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!leaveTypeId) {
      error('Validation Error', 'Please select a leave category');
      return;
    }
    if (requestedDays <= 0) {
      error('Invalid Date Range', 'End date must be on or after start date');
      return;
    }
    if (selectedBalance && selectedBalance.remainingDays < requestedDays) {
      error(
        'Insufficient Balance',
        `You requested ${requestedDays} days, but have only ${selectedBalance.remainingDays} days available.`
      );
      return;
    }

    try {
      setLoading(true);
      await api.post('/leave/requests', {
        leaveTypeId,
        startDate,
        endDate,
        reason,
      });

      success('Leave Application Submitted', 'Your request has been routed to HR for review.');
      onSuccess();
      onClose();
    } catch (err: any) {
      error('Application Failed', err.response?.data?.error?.message || 'Could not submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for Leave"
      subtitle="Submit a formal time-off request with automated quota verification"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Leave Category</label>
          <select
            value={leaveTypeId}
            onChange={(e) => setLeaveTypeId(e.target.value)}
            required
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            {leaveTypes.map((t) => {
              const bal = leaveBalances.find((b) => b.leaveTypeId === t.id);
              return (
                <option key={t.id} value={t.id}>
                  {t.name} ({bal ? `${bal.remainingDays} days available` : `${t.maxDaysPerYear} days quota`})
                </option>
              );
            })}
          </select>
        </div>

        {selectedBalance && (
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs flex justify-between items-center">
            <span className="text-slate-400">Available Quota for this type:</span>
            <span className="font-bold text-emerald-400">{selectedBalance.remainingDays} Days</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {requestedDays > 0 && (
          <div className="text-xs text-indigo-300 font-semibold bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-500/20 flex justify-between">
            <span>Duration:</span>
            <span>{requestedDays} Day(s)</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Reason / Notes</label>
          <textarea
            rows={3}
            placeholder="Please detail your reason for taking leave..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={loading}>
            Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  );
};
