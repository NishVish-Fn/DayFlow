import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PayrollRecord } from '../../types';
import { Printer, Download, Building2, ExternalLink } from 'lucide-react';
import { Badge } from '../common/Badge';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  payslip: PayrollRecord | null;
}

export const PayslipModal: React.FC<Props> = ({ isOpen, onClose, payslip }) => {
  const [downloading, setDownloading] = useState(false);
  const [printing, setPrinting] = useState(false);
  const { success, error } = useToast();

  if (!payslip) return null;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const allowances = payslip.allowancesBreakdown
    ? JSON.parse(payslip.allowancesBreakdown)
    : {};

  const deductions = payslip.deductionsBreakdown
    ? JSON.parse(payslip.deductionsBreakdown)
    : {};

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const res = await api.get(`/payroll/payslips/${payslip.id}/pdf?download=true`, {
        responseType: 'blob',
      });

      const blob = new Blob([res.data], { type: 'text/html;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Dayflow-Payslip-${monthNames[payslip.month - 1]}-${payslip.year}-${payslip.id.slice(0, 6)}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      success('Downloaded', 'Payslip document saved to your device.');
    } catch (err: any) {
      error('Download Failed', 'Could not download payslip file.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = async () => {
    try {
      setPrinting(true);
      const res = await api.get(`/payroll/payslips/${payslip.id}/pdf`);
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(res.data);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 300);
      }
    } catch (err) {
      error('Print Error', 'Could not open printable document.');
    } finally {
      setPrinting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Payslip: ${monthNames[payslip.month - 1]} ${payslip.year}`}
      subtitle={`Reference: ${payslip.id.slice(0, 8).toUpperCase()}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Company Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 tracking-tight font-display">DAYFLOW HRMS</div>
              <div className="text-[11px] text-slate-500">Enterprise Workforce &bull; Global Payroll Operations</div>
            </div>
          </div>

          <div className="text-right">
            <Badge variant="success" size="md">
              {payslip.status}
            </Badge>
            <div className="text-[11px] text-slate-500 mt-1">
              Disbursed: {payslip.paymentDate ? new Date(payslip.paymentDate).toLocaleDateString() : 'Direct Transfer'}
            </div>
          </div>
        </div>

        {/* Employee Details Grid */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Employee</span>
            <span className="font-bold text-slate-900 mt-0.5 block">
              {payslip.employee?.firstName} {payslip.employee?.lastName}
            </span>
            <span className="text-slate-500 text-[11px]">Badge: {payslip.employee?.user?.employeeId}</span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Department</span>
            <span className="font-bold text-slate-900 mt-0.5 block">{payslip.employee?.designation}</span>
            <span className="text-slate-500 text-[11px]">Division: {payslip.employee?.department}</span>
          </div>
        </div>

        {/* Itemized Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Earnings */}
          <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200">
            <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 border-b border-emerald-200 pb-1.5">
              Earnings
            </h5>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-700">
                <span>Basic Salary</span>
                <span className="font-semibold">${payslip.baseAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>House Rent Allowance</span>
                <span className="font-semibold">${payslip.hraAmount.toLocaleString()}</span>
              </div>
              {Object.entries(allowances).map(([k, v]) => (
                <div key={k} className="flex justify-between text-slate-700 capitalize">
                  <span>{k}</span>
                  <span className="font-semibold">${Number(v).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between text-emerald-800 font-bold border-t border-emerald-200 pt-2 mt-2">
                <span>Gross Earnings</span>
                <span>${payslip.grossAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200">
            <h5 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-3 border-b border-rose-200 pb-1.5">
              Deductions
            </h5>
            <div className="space-y-2 text-xs">
              {Object.entries(deductions).map(([k, v]) => (
                <div key={k} className="flex justify-between text-slate-700 capitalize">
                  <span>{k}</span>
                  <span className="font-semibold text-rose-600">-${Number(v).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between text-rose-800 font-bold border-t border-rose-200 pt-2 mt-2">
                <span>Total Deductions</span>
                <span>-${(payslip.grossAmount - payslip.netAmount).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Take-Home Highlight */}
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-blue-800 uppercase font-bold tracking-wider">Net Disbursed</div>
            <div className="text-[11px] text-slate-500">
              Transfer Ref: <span className="font-mono font-semibold">{payslip.transactionReference || 'ACH-DIRECT'}</span>
            </div>
          </div>
          <div className="text-2xl font-black text-blue-700 font-mono">
            ${payslip.netAmount.toLocaleString()}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Done
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePrint}
              isLoading={printing}
              leftIcon={<Printer className="w-3.5 h-3.5 text-blue-600" />}
            >
              Print / Save PDF
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleDownload}
              isLoading={downloading}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Download Payslip
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
