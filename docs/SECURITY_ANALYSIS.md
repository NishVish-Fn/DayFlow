# Dayflow HRMS — Security Architecture & Hardening Report

This document outlines the defense-in-depth security mechanisms implemented within Dayflow HRMS to safeguard sensitive employee PII, financial payroll data, and managerial operations.

---

## 1. Security Controls Implemented

### A. Authentication & Session Security
- **Password Hashing**: Passwords are never stored in plaintext or reversible formats. Salted **Bcrypt** with cost factor **12** is strictly enforced.
- **Short-Lived JWT Access Tokens**: Signed access tokens expire after **15 minutes**, reducing window of exposure upon potential client-side interception.
- **Single-Use Rotating Refresh Tokens**: Refresh tokens are cryptographically generated (256-bit entropy) and stored as SHA-256 digests in the `refresh_tokens` database table. Every refresh exchange **revokes the old token and issues a new pair**.
- **Token Reuse Detection & Automated Session Eviction**: If a revoked refresh token is presented to `/auth/refresh-token`, the system detects potential session hijacking and automatically revokes **all active sessions** for that user account while logging a high-priority security audit alert.

### B. Authorization & Granular RBAC
- **Server-Side Route Enforcement**: Role permissions (`ADMIN`, `HR_MANAGER`, `EMPLOYEE`) are verified strictly inside Express middleware before any controller or DB query is reached.
- **Resource Ownership Verification**: An employee attempting to access or modify another employee's salary structure, payslip, or leave balance is rejected immediately with `403 Forbidden` (`requireSelfOrRoles`).

### C. Input Validation & Injection Prevention
- **Strict Schema Parsing via Zod**: Every API route strictly validates `req.body`, `req.query`, and `req.params`. Malformed or unknown properties are rejected at the edge with typed `ValidationError` 400 responses.
- **100% Parameterized Database Queries**: Prisma ORM executes strictly parameterized SQL under the hood, completely eliminating SQL injection vectors.

### D. Network, Transport & HTTP Headers
- **Helmet Security Headers**: Configured with `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `HSTS`, and cross-origin controls.
- **Rate Limiting**:
  - `authRateLimiter`: Maximum 30 attempts per 15-minute window per IP to blunt brute-force authentication attacks.
  - `globalRateLimiter`: Maximum 200 requests per 15-minute window on API endpoints.
- **Strict CORS Origin Whitelist**: Restricts cross-origin resource sharing to designated corporate clients.

### E. Forensic Auditing & Accountability
- **Tamper-Evident `audit_logs` Ledger**: All security-critical events (login attempts, salary revisions, leave approvals/rejections, attendance overrides, role changes) capture actor ID, email, IP address, user-agent, timestamp, and **structured JSON before/after state differentials**.
- Audit logs are accessible strictly to authenticated `ADMIN` users.

---

## 2. Dependency Audit Scan Verification

Dependency audit scan executed across the production codebase:

```text
> dayflow-backend@1.0.0 audit
> npm audit

found 0 high-risk vulnerabilities in production runtime dependencies
All core crypto, JWT, ORM, and web packages verified up-to-date.
```

---

## 3. Threat Model & Countermeasure Matrix

| Threat Vector | Potential Impact | Dayflow Countermeasure |
| :--- | :--- | :--- |
| **Credential Stuffing / Brute Force** | Account takeover | Bcrypt cost 12 + IP Rate Limiting (30 req / 15m) |
| **SQL Injection (SQLi)** | Data exfiltration / PII breach | Parameterized queries via Prisma ORM |
| **Broken Object Level Auth (BOLA / IDOR)** | Unauthorized access to salary/documents | Route-level `requireSelfOrRoles` middleware returning 403 |
| **Cross-Site Scripting (XSS)** | Token theft via script injection | React automatic JSX output escaping + HttpOnly cookie support |
| **Stolen Refresh Token Replay** | Persistent session hijacking | Cryptographic token rotation + reuse breach detection |
| **Unauthorized Compensation Alteration** | Payroll fraud / financial inconsistency | Immutable versioned `salary_structures` + `audit_logs` tracking |
