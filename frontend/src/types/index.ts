export type Role = 'ADMIN' | 'HR_MANAGER' | 'EMPLOYEE';
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  email: string;
  employeeId: string;
  role: Role;
  status: AccountStatus;
  isEmailVerified: boolean;
  profile?: EmployeeProfile;
  createdAt: string;
}

export interface EmployeeProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  employmentType: string;
  reportingManagerId?: string;
  reportingManager?: {
    id: string;
    firstName: string;
    lastName: string;
    designation: string;
    department?: string;
    user?: { email: string };
  };
  directReports?: Array<{
    id: string;
    firstName: string;
    lastName: string;
    designation: string;
    department: string;
  }>;
  emergencyContact?: string;
  avatarUrl?: string;
  documents?: string;
  user?: User;
  currentSalary?: SalaryStructure;
  salaryStructures?: SalaryStructure[];
  leaveBalances?: LeaveBalance[];
  attendanceRecords?: AttendanceRecord[];
}

export interface SalaryStructure {
  id: string;
  employeeId: string;
  effectiveDate: string;
  baseSalary: number;
  hra: number;
  allowances: number;
  deductions: number;
  grossSalary: number;
  netSalary: number;
  isCurrent: boolean;
  currency: string;
  remarks?: string;
  createdById?: string;
  createdAt: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  salaryStructureId: string;
  month: number;
  year: number;
  paymentDate?: string;
  baseAmount: number;
  hraAmount: number;
  allowancesBreakdown?: string;
  deductionsBreakdown?: string;
  grossAmount: number;
  netAmount: number;
  status: 'DRAFT' | 'PROCESSED' | 'PAID';
  transactionReference?: string;
  notes?: string;
  employee?: EmployeeProfile;
  salaryStructure?: SalaryStructure;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'ON_LEAVE' | 'HOLIDAY' | 'WEEKEND';
  totalHours: number;
  workMode: 'OFFICE' | 'REMOTE' | 'HYBRID';
  notes?: string;
  ipAddress?: string;
  employee?: EmployeeProfile;
}

export interface LeaveType {
  id: string;
  name: string;
  code: string;
  maxDaysPerYear: number;
  isPaid: boolean;
  description?: string;
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  year: number;
  totalAllocated: number;
  usedDays: number;
  pendingDays: number;
  remainingDays: number;
  leaveType: LeaveType;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  appliedAt: string;
  approvedById?: string;
  adminRemarks?: string;
  reviewedAt?: string;
  leaveType: LeaveType;
  employee: EmployeeProfile;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userEmail?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  changesDiff?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ACTION_REQUIRED';
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
}
