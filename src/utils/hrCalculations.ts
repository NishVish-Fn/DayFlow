/**
 * Deterministic Login ID Generator conforming to Specification:
 * Format: [CompanyPrefix (2 chars)] + [First 2 letters of First Name] + [First 2 letters of Last Name] + [Year of Joining (4 digits)] + [Serial No (4 digits)]
 * Example: Odoo India + John Doe + 2022 + 1 -> OIJODO20220001
 */
export const generateDeterministicLoginId = (
  companyName: string = 'Odoo India',
  firstName: string = 'John',
  lastName: string = 'Doe',
  joiningYear: number = new Date().getFullYear(),
  serialNumber: number = 1
): string => {
  const compPrefix = companyName
    .replace(/[^a-zA-Z]/g, '')
    .slice(0, 2)
    .toUpperCase() || 'OI';

  const fnPrefix = firstName
    .replace(/[^a-zA-Z]/g, '')
    .slice(0, 2)
    .toUpperCase()
    .padEnd(2, 'X');

  const lnPrefix = lastName
    .replace(/[^a-zA-Z]/g, '')
    .slice(0, 2)
    .toUpperCase()
    .padEnd(2, 'X');

  const yearStr = String(joiningYear);
  const serialStr = String(serialNumber).padStart(4, '0');

  return `${compPrefix}${fnPrefix}${lnPrefix}${yearStr}${serialStr}`;
};

/**
 * Exact Salary Computation Engine per §6 Worked Example:
 * Wage = ₹50,000
 * - Basic Salary = 50% of Wage = ₹25,000
 * - HRA = 50% of Basic = ₹12,500
 * - Standard Allowance = ₹2,500
 * - Performance Bonus = 10% of Basic = ₹2,500
 * - LTA = 5% of Basic = ₹1,250
 * - Fixed Allowance = Wage - (Basic + HRA + Standard + Bonus + LTA) = ₹6,250
 * Deductions:
 * - PF Employee (12% of Basic) = ₹3,000
 * - PF Employer (12% of Basic) = ₹3,000
 * - Professional Tax = ₹200
 */
export interface SalaryBreakdown {
  monthlyWage: number;
  yearlyWage: number;
  workingDaysPerWeek: number;
  breakTimeHours: number;
  basicSalary: number;
  hra: number;
  standardAllowance: number;
  performanceBonus: number;
  lta: number;
  fixedAllowance: number;
  grossSalary: number;
  pfEmployee: number;
  pfEmployer: number;
  professionalTax: number;
  totalDeductions: number;
  netPayable: number;
}

export const computeSalaryStructure = (
  monthlyWage: number = 50000,
  basicPercent: number = 50,
  hraPercentOfBasic: number = 50,
  standardAllowance: number = 2500,
  bonusPercentOfBasic: number = 10,
  ltaPercentOfBasic: number = 5,
  pfEmployeePercent: number = 12,
  pfEmployerPercent: number = 12,
  professionalTax: number = 200,
  workingDaysPerWeek: number = 5,
  breakTimeHours: number = 1
): SalaryBreakdown => {
  const yearlyWage = monthlyWage * 12;
  const basicSalary = (monthlyWage * basicPercent) / 100;
  const hra = (basicSalary * hraPercentOfBasic) / 100;
  const performanceBonus = (basicSalary * bonusPercentOfBasic) / 100;
  const lta = (basicSalary * ltaPercentOfBasic) / 100;

  const allocatedSum = basicSalary + hra + standardAllowance + performanceBonus + lta;
  const fixedAllowance = Math.max(0, monthlyWage - allocatedSum);
  const grossSalary = basicSalary + hra + standardAllowance + performanceBonus + lta + fixedAllowance;

  const pfEmployee = (basicSalary * pfEmployeePercent) / 100;
  const pfEmployer = (basicSalary * pfEmployerPercent) / 100;
  const totalDeductions = pfEmployee + professionalTax;
  const netPayable = grossSalary - totalDeductions;

  return {
    monthlyWage,
    yearlyWage,
    workingDaysPerWeek,
    breakTimeHours,
    basicSalary,
    hra,
    standardAllowance,
    performanceBonus,
    lta,
    fixedAllowance,
    grossSalary,
    pfEmployee,
    pfEmployer,
    professionalTax,
    totalDeductions,
    netPayable,
  };
};
