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
  payslip: any | null;
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

  const monthIdx = (payslip.month ? payslip.month - 1 : new Date().getMonth()) % 12;
  const yearNum = payslip.year || new Date().getFullYear();

  const baseAmt = payslip.baseAmount ?? payslip.baseSalary ?? 7200;
  const hraAmt = payslip.hraAmount ?? payslip.hra ?? 2880;
  const stdAllowance = payslip.standardAllowance ?? 2160;
  const perfBonus = payslip.performanceBonus ?? 0;
  const pfAmt = payslip.providentFund ?? 1728;
  const taxAmt = payslip.incomeTax ?? 1440;
  const pTaxAmt = payslip.professionalTax ?? 200;

  const grossAmt = payslip.grossAmount ?? (baseAmt + hraAmt + stdAllowance + perfBonus);
  const netAmt = payslip.netAmount ?? (grossAmt - (pfAmt + taxAmt + pTaxAmt));
  const totalDeductions = grossAmt - netAmt;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const htmlContent = `
        <html>
          <head>
            <title>Payslip - ${monthNames[monthIdx]} ${yearNum}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #111; }
              .header { border-bottom: 2px solid #0071e3; padding-bottom: 15px; margin-bottom: 20px; }
              .title { font-size: 24px; font-weight: bold; color: #0071e3; }
              .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              .table th, .table td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
              .table th { background: #f8fafc; font-weight: 600; }
              .total { font-weight: bold; font-size: 16px; background: #eff6ff; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="title">WorkNest HRMS &bull; Enterprise Payslip</div>
              <div>Period: ${monthNames[monthIdx]} ${yearNum}</div>
              <div>Employee: ${payslip.employee?.firstName || 'Staff'} ${payslip.employee?.lastName || 'Member'} (${payslip.employee?.user?.employeeId || 'EMP-1001'})</div>
              <div>Department: ${payslip.employee?.department || 'Engineering'} &bull; Designation: ${payslip.employee?.designation || 'Specialist'}</div>
            </div>
            <table class="table">
              <tr><th>Earnings Component</th><th>Amount (USD)</th></tr>
              <tr><td>Basic Salary</td><td>$${Number(baseAmt).toLocaleString()}</td></tr>
              <tr><td>House Rent Allowance (HRA)</td><td>$${Number(hraAmt).toLocaleString()}</td></tr>
              <tr><td>Standard Allowance</td><td>$${Number(stdAllowance).toLocaleString()}</td></tr>
              ${perfBonus > 0 ? `<tr><td>Performance Bonus</td><td>$${Number(perfBonus).toLocaleString()}</td></tr>` : ''}
              <tr class="total"><td>Gross Earnings</td><td>$${Number(grossAmt).toLocaleString()}</td></tr>
            </table>
            <table class="table">
              <tr><th>Deductions Component</th><th>Amount (USD)</th></tr>
              <tr><td>Provident Fund (PF)</td><td>-$${Number(pfAmt).toLocaleString()}</td></tr>
              <tr><td>Income Tax (TDS)</td><td>-$${Number(taxAmt).toLocaleString()}</td></tr>
              <tr><td>Professional Tax</td><td>-$${Number(pTaxAmt).toLocaleString()}</td></tr>
              <tr class="total"><td>Total Deductions</td><td>-$${Number(totalDeductions).toLocaleString()}</td></tr>
            </table>
            <div style="margin-top: 30px; font-size: 18px; font-weight: bold; color: #0071e3;">
              Net Disbursed Take-Home: $${Number(netAmt).toLocaleString()}
            </div>
          </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `DayFlow-Payslip-${monthNames[monthIdx]}-${yearNum}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      success('Downloaded', 'Official payslip document saved.');
    } catch (err: any) {
      error('Download Failed', 'Could not download payslip.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    try {
      setPrinting(true);
      window.print();
    } catch (err) {
      // Ignore
    } finally {
      setPrinting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Payslip: ${monthNames[monthIdx]} ${yearNum}`}
      subtitle={`Reference: ${(payslip.disbursementRef || payslip.id || 'ACH-WF').slice(0, 16).toUpperCase()}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Company Header */}
        <div className="flex items-start justify-between border-b border-black/[0.05] dark:border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0071e3]/10 dark:bg-[#0071e3]/20 flex items-center justify-center text-[#0071e3] dark:text-[#2997ff]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 dark:text-white tracking-tight">WORKNEST HRMS</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Enterprise Workforce &bull; Global Payroll Operations</div>
            </div>
          </div>

          <div className="text-right">
            <Badge variant="success" size="md">
              {payslip.status || 'PAID'}
            </Badge>
            <div className="text-[11px] text-slate-500 mt-1">
              Disbursed: {payslip.paymentDate || '2026-08-20'}
            </div>
          </div>
        </div>

        {/* Employee Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.08] text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Employee</span>
            <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
              {payslip.employee?.firstName || 'Staff'} {payslip.employee?.lastName || 'Member'}
            </span>
            <span className="text-slate-500 text-[11px]">Badge: {payslip.employee?.user?.employeeId || 'EMP-1001'}</span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Department</span>
            <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{payslip.employee?.designation || 'Specialist'}</span>
            <span className="text-slate-500 text-[11px]">Division: {payslip.employee?.department || 'Engineering'}</span>
          </div>
        </div>

        {/* Itemized Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Earnings */}
          <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
            <h5 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-3 border-b border-emerald-200 dark:border-emerald-800 pb-1.5">
              Earnings
            </h5>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Basic Salary</span>
                <span className="font-semibold font-mono">${Number(baseAmt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>House Rent Allowance (HRA)</span>
                <span className="font-semibold font-mono">${Number(hraAmt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Standard Allowance</span>
                <span className="font-semibold font-mono">${Number(stdAllowance).toLocaleString()}</span>
              </div>
              {perfBonus > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Performance Bonus</span>
                  <span className="font-semibold font-mono">+${Number(perfBonus).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-emerald-800 dark:text-emerald-300 font-bold border-t border-emerald-200 dark:border-emerald-800 pt-2 mt-2 font-mono">
                <span>Gross Earnings</span>
                <span>${Number(grossAmt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900">
            <h5 className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider mb-3 border-b border-rose-200 dark:border-rose-800 pb-1.5">
              Deductions
            </h5>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Provident Fund (PF)</span>
                <span className="font-semibold font-mono text-rose-600 dark:text-rose-400">-${Number(pfAmt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Income Tax (TDS)</span>
                <span className="font-semibold font-mono text-rose-600 dark:text-rose-400">-${Number(taxAmt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Professional Tax</span>
                <span className="font-semibold font-mono text-rose-600 dark:text-rose-400">-${Number(pTaxAmt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-rose-800 dark:text-rose-300 font-bold border-t border-rose-200 dark:border-rose-800 pt-2 mt-2 font-mono">
                <span>Total Deductions</span>
                <span>-${Number(totalDeductions).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Take-Home Highlight */}
        <div className="p-4 rounded-2xl bg-[#0071e3]/10 dark:bg-[#0071e3]/20 border border-[#0071e3]/30 flex items-center justify-between">
          <div>
            <div className="text-xs text-[#0071e3] dark:text-[#2997ff] uppercase font-bold tracking-wider">Net Disbursed Take-Home</div>
            <div className="text-[11px] text-slate-500">
              Transfer Ref: <span className="font-mono font-semibold">{payslip.disbursementRef || 'ACH-DIRECT-WF'}</span>
            </div>
          </div>
          <div className="text-2xl font-black text-[#0071e3] dark:text-[#2997ff] font-mono">
            ${Number(netAmt).toLocaleString()}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-black/[0.05] dark:border-white/[0.06]">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePrint}
              isLoading={printing}
              leftIcon={<Printer className="w-3.5 h-3.5 text-[#0071e3]" />}
            >
              Print
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleDownload}
              isLoading={downloading}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Download HTML/PDF Slip
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
