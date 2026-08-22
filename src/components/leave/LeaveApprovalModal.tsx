import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LeaveRequest } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  request: LeaveRequest | null;
  onProcessed: () => void;
}

export const LeaveApprovalModal: React.FC<Props> = ({
  isOpen,
  onClose,
  request,
  onProcessed,
}) => {
  const [adminRemarks, setAdminRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  if (!request) return null;

  const handleAction = async (status: 'APPROVED' | 'REJECTED') => {
    try {
      setLoading(true);
      await api.patch(`/leave/admin/requests/${request.id}/status`, {
        status,
        adminRemarks,
      });

      success(
        `Leave Request ${status}`,
        `Successfully ${status.toLowerCase()} leave request for ${request.employee?.firstName} ${request.employee?.lastName}.`
      );
      onProcessed();
      onClose();
    } catch (err: any) {
      error('Action Failed', err.response?.data?.error?.message || 'Could not process request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Review Leave Application"
      subtitle={`Applicant: ${request.employee?.firstName} ${request.employee?.lastName} (${request.employee?.department})`}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Request Overview */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Leave Category:</span>
            <span className="font-bold text-slate-900">{request.leaveType?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Duration:</span>
            <span className="font-bold text-blue-700">
              {new Date(request.startDate).toLocaleDateString()} &rarr; {new Date(request.endDate).toLocaleDateString()} ({request.totalDays} Days)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Application Date:</span>
            <span className="text-slate-700 font-medium">{new Date(request.appliedAt).toLocaleDateString()}</span>
          </div>
          <div className="pt-2 border-t border-slate-200">
            <span className="text-slate-500 block mb-1">Applicant's Stated Reason:</span>
            <p className="italic text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200">
              "{request.reason}"
            </p>
          </div>
        </div>

        {/* Manager Remarks */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Manager Review Commentary (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="Add comments or justification visible to the employee..."
            value={adminRemarks}
            onChange={(e) => setAdminRemarks(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
            Dismiss
          </Button>
          <div className="flex gap-2">
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleAction('REJECTED')}
              isLoading={loading}
            >
              Reject Application
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={() => handleAction('APPROVED')}
              isLoading={loading}
            >
              Approve Leave
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
