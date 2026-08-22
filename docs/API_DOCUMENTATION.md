# Dayflow HRMS — RESTful API Specification

Base URL: `/api/v1`

All responses follow a consistent JSON response envelope:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional descriptive status message"
}
```

Error responses follow a standardized error structure:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | UNAUTHORIZED | FORBIDDEN | NOT_FOUND | CONFLICT | INTERNAL_SERVER_ERROR",
    "message": "Human readable explanation",
    "details": []
  }
}
```

---

## 1. Authentication Domain (`/auth`)

| Method | Endpoint | Auth Required | Allowed Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | None | Public | Register new user account (with initial profile link) |
| `POST` | `/auth/login` | None | Public | Sign in with email/employeeId + password. Returns JWT access token and sets secure refresh token |
| `POST` | `/auth/refresh-token` | None | Public | Issue new access token + rotate refresh token |
| `POST` | `/auth/logout` | Optional | Any Authenticated | Invalidate refresh token and clear cookies |
| `GET` | `/auth/me` | Bearer JWT | Any Authenticated | Get current authenticated user profile & permissions |
| `POST` | `/auth/change-password` | Bearer JWT | Any Authenticated | Update user password with current verification |

---

## 2. Employee Profile Management (`/employees`)

| Method | Endpoint | Auth Required | Allowed Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/employees` | Bearer JWT | `ADMIN`, `HR_MANAGER`, `EMPLOYEE` | List active employees with search & filter by department/role/status |
| `POST` | `/employees` | Bearer JWT | `ADMIN`, `HR_MANAGER` | Onboard new employee (creates User + Profile + Default Leave balances) |
| `GET` | `/employees/:id` | Bearer JWT | `ADMIN`, `HR_MANAGER`, Self | Get comprehensive employee 360 profile |
| `PUT` | `/employees/:id` | Bearer JWT | `ADMIN`, `HR_MANAGER`, Self (restricted fields) | Update employee profile details |
| `PATCH` | `/employees/:id/status` | Bearer JWT | `ADMIN`, `HR_MANAGER` | Activate, deactivate, or suspend employee account |
| `GET` | `/employees/:id/stats` | Bearer JWT | `ADMIN`, `HR_MANAGER`, Self | Get employee dashboard summary (attendance %, leave balances, current salary) |

---

## 3. Attendance Management (`/attendance`)

| Method | Endpoint | Auth Required | Allowed Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/attendance/check-in` | Bearer JWT | Any Authenticated | Clock in for the day (records timestamp, work mode, IP) |
| `POST` | `/attendance/check-out` | Bearer JWT | Any Authenticated | Clock out for the day (computes total hours) |
| `GET` | `/attendance/today` | Bearer JWT | Any Authenticated | Fetch today's punch status for current user |
| `GET` | `/attendance/my-history` | Bearer JWT | Any Authenticated | Fetch current user's monthly attendance logs |
| `GET` | `/attendance/team` | Bearer JWT | `ADMIN`, `HR_MANAGER` | Muster roll view of all employees with date & department filters |
| `POST` | `/attendance/manual-entry` | Bearer JWT | `ADMIN`, `HR_MANAGER` | Admin attendance override/adjustment with mandatory audit log |
| `GET` | `/attendance/analytics` | Bearer JWT | `ADMIN`, `HR_MANAGER` | Organization-wide daily and monthly attendance analytics |

---

## 4. Leave Management (`/leave`)

| Method | Endpoint | Auth Required | Allowed Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/leave/types` | Bearer JWT | Any Authenticated | Get all active leave categories (PTO, Sick, Casual, Maternity) |
| `GET` | `/leave/my-balances` | Bearer JWT | Any Authenticated | Get current year's leave quotas, used, pending, and remaining days |
| `GET` | `/leave/my-requests` | Bearer JWT | Any Authenticated | Get list of user's past and pending leave requests |
| `POST` | `/leave/requests` | Bearer JWT | Any Authenticated | Apply for leave (validates balance and overlaps, updates pending quota) |
| `DELETE` | `/leave/requests/:id` | Bearer JWT | Self (Pending only) | Cancel pending leave request and restore pending quota |
| `GET` | `/leave/admin/requests` | Bearer JWT | `ADMIN`, `HR_MANAGER` | Query all organization leave applications with status filters |
| `PATCH` | `/leave/admin/requests/:id/status` | Bearer JWT | `ADMIN`, `HR_MANAGER` | Approve or reject leave request with reviewer notes & balance deduction |

---

## 5. Payroll & Salary Management (`/payroll`)

| Method | Endpoint | Auth Required | Allowed Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/payroll/structures/:employeeId`| Bearer JWT | `ADMIN`, `HR_MANAGER`, Self | Get versioned salary compensation history |
| `POST` | `/payroll/structures/:employeeId`| Bearer JWT | `ADMIN`, `HR_MANAGER` | Create new versioned salary structure (archives previous active version) |
| `GET` | `/payroll/my-payslips` | Bearer JWT | Any Authenticated | View logged-in employee's monthly payslips |
| `GET` | `/payroll/payslips` | Bearer JWT | `ADMIN`, `HR_MANAGER` | Query all payslips with month/year/department filters |
| `POST` | `/payroll/generate-batch` | Bearer JWT | `ADMIN`, `HR_MANAGER` | Trigger batch payroll calculation and payslip generation for a billing cycle |
| `GET` | `/payroll/payslips/:id` | Bearer JWT | `ADMIN`, `HR_MANAGER`, Self | Get itemized payslip breakdown |
| `GET` | `/payroll/payslips/:id/pdf` | Bearer JWT | `ADMIN`, `HR_MANAGER`, Self | Generate printable / downloadable official PDF payslip receipt |

---

## 6. Audit & System Monitoring (`/audit-logs`)

| Method | Endpoint | Auth Required | Allowed Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/audit-logs` | Bearer JWT | `ADMIN` | Fetch immutable audit trail with filters by action, resource, actor, and date |

---

## 7. In-App Notifications (`/notifications`)

| Method | Endpoint | Auth Required | Allowed Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/notifications` | Bearer JWT | Any Authenticated | Fetch user notifications |
| `PATCH` | `/notifications/:id/read` | Bearer JWT | Self | Mark specific notification as read |
| `PATCH` | `/notifications/read-all` | Bearer JWT | Self | Mark all notifications as read |

---

## 8. Dashboard Analytics (`/dashboard`)

| Method | Endpoint | Auth Required | Allowed Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/dashboard/employee` | Bearer JWT | Any Authenticated | Employee personal metrics (today's status, leave balance, upcoming holidays) |
| `GET` | `/dashboard/admin` | Bearer JWT | `ADMIN`, `HR_MANAGER` | Organization metrics (headcount, attendance rate %, pending leaves, payroll expense, department charts) |
