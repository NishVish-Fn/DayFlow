export interface PayslipTemplateData {
  companyName: string;
  companyAddress: string;
  payslipId: string;
  employeeName: string;
  employeeId: string;
  designation: string;
  department: string;
  monthYear: string;
  paymentDate: string;
  transactionRef: string;
  baseAmount: number;
  hraAmount: number;
  allowances: Record<string, number>;
  deductions: Record<string, number>;
  grossAmount: number;
  netAmount: number;
}

export const generatePayslipHTML = (data: PayslipTemplateData): string => {
  const allowanceRows = Object.entries(data.allowances)
    .map(
      ([key, val]) => `
      <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #e2e8f0;">
        <span style="color: #475569; text-transform: capitalize;">${key.replace(/([A-Z])/g, ' $1')}</span>
        <span style="font-weight: 600; color: #1e293b;">$${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
      </div>`
    )
    .join('');

  const deductionRows = Object.entries(data.deductions)
    .map(
      ([key, val]) => `
      <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #e2e8f0;">
        <span style="color: #475569; text-transform: capitalize;">${key.replace(/([A-Z])/g, ' $1')}</span>
        <span style="font-weight: 600; color: #e11d48;">-$${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
      </div>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Payslip - ${data.employeeName} (${data.monthYear})</title>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none; }
    }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; margin: 0; padding: 30px; color: #0f172a; }
    .slip-container { max-width: 800px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 25px; }
    .brand { font-size: 26px; font-weight: 800; color: #4338ca; letter-spacing: -0.5px; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; background: #f8fafc; padding: 20px; border-radius: 8px; }
    .earnings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
    .column-box { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; }
    .summary-box { background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 8px; padding: 20px; text-align: right; }
    .net-salary { font-size: 28px; font-weight: 800; color: #4338ca; }
  </style>
</head>
<body>
  <div class="no-print" style="max-width: 800px; margin: 0 auto 15px auto; text-align: right;">
    <button onclick="window.print()" style="background: #4f46e5; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer;">
      🖨️ Print / Save as PDF
    </button>
  </div>
  <div class="slip-container">
    <div class="header">
      <div>
        <div class="brand">DAYFLOW HRMS</div>
        <div style="color: #64748b; font-size: 13px; margin-top: 4px;">${data.companyAddress}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 18px; font-weight: 700; color: #1e293b;">MONTHLY PAYSLIP</div>
        <div style="font-size: 14px; font-weight: 600; color: #6366f1;">Period: ${data.monthYear}</div>
        <div style="font-size: 11px; color: #94a3b8;">Receipt: ${data.payslipId}</div>
      </div>
    </div>

    <div class="meta-grid">
      <div>
        <div style="font-size: 12px; color: #64748b;">EMPLOYEE NAME</div>
        <div style="font-size: 16px; font-weight: 700; color: #0f172a;">${data.employeeName}</div>
        <div style="font-size: 13px; color: #475569; margin-top: 4px;">ID: <b>${data.employeeId}</b></div>
      </div>
      <div>
        <div style="font-size: 12px; color: #64748b;">DEPARTMENT & ROLE</div>
        <div style="font-size: 15px; font-weight: 600; color: #0f172a;">${data.designation}</div>
        <div style="font-size: 13px; color: #475569; margin-top: 4px;">Dept: ${data.department}</div>
      </div>
    </div>

    <div class="earnings-grid">
      <div class="column-box">
        <h4 style="margin: 0 0 15px 0; color: #166534; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #bbf7d0; padding-bottom: 8px;">Earnings</h4>
        <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #e2e8f0;">
          <span style="color: #475569;">Basic Salary</span>
          <span style="font-weight: 600;">$${data.baseAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #e2e8f0;">
          <span style="color: #475569;">House Rent Allowance (HRA)</span>
          <span style="font-weight: 600;">$${data.hraAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        ${allowanceRows}
        <div style="display: flex; justify-content: space-between; padding: 10px 0 0 0; margin-top: 10px; border-top: 2px solid #e2e8f0; font-weight: 700;">
          <span>Gross Earnings</span>
          <span style="color: #15803d;">$${data.grossAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div class="column-box">
        <h4 style="margin: 0 0 15px 0; color: #991b1b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #fecaca; padding-bottom: 8px;">Deductions</h4>
        ${deductionRows}
        <div style="display: flex; justify-content: space-between; padding: 10px 0 0 0; margin-top: 10px; border-top: 2px solid #e2e8f0; font-weight: 700;">
          <span>Total Deductions</span>
          <span style="color: #b91c1c;">-$${(data.grossAmount - data.netAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>

    <div class="summary-box">
      <div style="font-size: 13px; font-weight: 600; color: #4338ca; text-transform: uppercase;">Net Disbursed Amount</div>
      <div class="net-salary">$${data.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
      <div style="font-size: 12px; color: #64748b; margin-top: 6px;">Disbursed via direct transfer ref: <b>${data.transactionRef}</b> on ${data.paymentDate}</div>
    </div>

    <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px; display: flex; justify-content: space-between; font-size: 12px; color: #94a3b8;">
      <div>This is a system-generated document and does not require physical signature.</div>
      <div>Dayflow Enterprise HRMS v1.0</div>
    </div>
  </div>
</body>
</html>
  `;
};
