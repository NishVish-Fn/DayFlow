import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Dayflow HRMS Database Seed...');

  // Clean existing tables in proper order
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.leaveBalance.deleteMany();
  await prisma.leaveType.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.payrollRecord.deleteMany();
  await prisma.salaryStructure.deleteMany();
  await prisma.employeeProfile.deleteMany();
  await prisma.user.deleteMany();

  const defaultPasswordHash = await bcrypt.hash('Password@123', 12);
  const currentYear = new Date().getFullYear();

  // 1. Create Standard Leave Types
  console.log('🔹 Creating Leave Types...');
  const pto = await prisma.leaveType.create({
    data: {
      name: 'Paid Time Off',
      code: 'PTO',
      maxDaysPerYear: 18,
      isPaid: true,
      description: 'Annual standard vacation and personal time off.',
    },
  });

  const sickLeave = await prisma.leaveType.create({
    data: {
      name: 'Sick Leave',
      code: 'SL',
      maxDaysPerYear: 12,
      isPaid: true,
      description: 'Leave for medical recovery, appointments, and wellness.',
    },
  });

  const casualLeave = await prisma.leaveType.create({
    data: {
      name: 'Casual Leave',
      code: 'CL',
      maxDaysPerYear: 8,
      isPaid: true,
      description: 'Short notice personal errands and urgent matters.',
    },
  });

  const parentalLeave = await prisma.leaveType.create({
    data: {
      name: 'Parental Leave',
      code: 'PL',
      maxDaysPerYear: 60,
      isPaid: true,
      description: 'Maternity, paternity, and adoption leave entitlements.',
    },
  });

  const leaveTypesList = [pto, sickLeave, casualLeave, parentalLeave];

  // 2. Create Users and Employee Profiles
  console.log('🔹 Creating Users & Organization Structure...');

  // User 1: Admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@dayflow.internal',
      employeeId: 'EMP-0001',
      passwordHash: defaultPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      isEmailVerified: true,
      profile: {
        create: {
          firstName: 'Sarah',
          lastName: 'Connor',
          phone: '+1 (555) 019-2831',
          dateOfBirth: new Date('1986-04-12'),
          gender: 'Female',
          address: '742 Evergreen Terrace, San Francisco, CA',
          department: 'OPERATIONS',
          designation: 'VP of People & Operations',
          dateOfJoining: new Date('2021-01-15'),
          employmentType: 'FULL_TIME',
          emergencyContact: 'John Connor (+1 555-019-9999)',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          documents: JSON.stringify([
            { name: 'Passport.pdf', type: 'IDENTITY', uploadDate: '2021-01-15' },
            { name: 'Employment_Contract.pdf', type: 'CONTRACT', uploadDate: '2021-01-15' },
          ]),
        },
      },
    },
    include: { profile: true },
  });

  // User 2: HR Manager
  const hrUser = await prisma.user.create({
    data: {
      email: 'hr@dayflow.internal',
      employeeId: 'EMP-0002',
      passwordHash: defaultPasswordHash,
      role: 'HR_MANAGER',
      status: 'ACTIVE',
      isEmailVerified: true,
      profile: {
        create: {
          firstName: 'Marcus',
          lastName: 'Vance',
          phone: '+1 (555) 024-8841',
          dateOfBirth: new Date('1990-08-22'),
          gender: 'Male',
          address: '1048 Market St, San Francisco, CA',
          department: 'HUMAN_RESOURCES',
          designation: 'Lead People Operations Manager',
          dateOfJoining: new Date('2022-03-01'),
          employmentType: 'FULL_TIME',
          reportingManagerId: adminUser.profile?.id,
          emergencyContact: 'Elena Vance (+1 555-024-7733)',
          avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
          documents: JSON.stringify([
            { name: 'ID_Proof.pdf', type: 'IDENTITY', uploadDate: '2022-03-01' },
          ]),
        },
      },
    },
    include: { profile: true },
  });

  // User 3: Employee - Staff Architect (Engineering)
  const alexUser = await prisma.user.create({
    data: {
      email: 'alex.chen@dayflow.internal',
      employeeId: 'EMP-1001',
      passwordHash: defaultPasswordHash,
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      isEmailVerified: true,
      profile: {
        create: {
          firstName: 'Alex',
          lastName: 'Chen',
          phone: '+1 (555) 392-1082',
          dateOfBirth: new Date('1992-11-04'),
          gender: 'Male',
          address: '320 Mission Bay Blvd, San Francisco, CA',
          department: 'ENGINEERING',
          designation: 'Staff Software Architect',
          dateOfJoining: new Date('2022-06-15'),
          employmentType: 'FULL_TIME',
          reportingManagerId: adminUser.profile?.id,
          emergencyContact: 'Mei Chen (+1 555-392-9011)',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          documents: JSON.stringify([
            { name: 'Degree_Certificate.pdf', type: 'ACADEMIC', uploadDate: '2022-06-15' },
          ]),
        },
      },
    },
    include: { profile: true },
  });

  // User 4: Employee - Principal Product Designer
  const elenaUser = await prisma.user.create({
    data: {
      email: 'elena.rodriguez@dayflow.internal',
      employeeId: 'EMP-1002',
      passwordHash: defaultPasswordHash,
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      isEmailVerified: true,
      profile: {
        create: {
          firstName: 'Elena',
          lastName: 'Rodriguez',
          phone: '+1 (555) 481-9920',
          dateOfBirth: new Date('1994-02-18'),
          gender: 'Female',
          address: '582 Valencia St, San Francisco, CA',
          department: 'DESIGN',
          designation: 'Principal Product Designer',
          dateOfJoining: new Date('2023-01-10'),
          employmentType: 'FULL_TIME',
          reportingManagerId: hrUser.profile?.id,
          emergencyContact: 'Carlos Rodriguez (+1 555-481-1100)',
          avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        },
      },
    },
    include: { profile: true },
  });

  // User 5: Employee - Senior Backend Engineer
  const davidUser = await prisma.user.create({
    data: {
      email: 'david.kim@dayflow.internal',
      employeeId: 'EMP-1003',
      passwordHash: defaultPasswordHash,
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      isEmailVerified: true,
      profile: {
        create: {
          firstName: 'David',
          lastName: 'Kim',
          phone: '+1 (555) 712-4491',
          dateOfBirth: new Date('1995-07-09'),
          gender: 'Male',
          address: '1440 Bush St, San Francisco, CA',
          department: 'ENGINEERING',
          designation: 'Senior Backend Engineer',
          dateOfJoining: new Date('2023-08-01'),
          employmentType: 'FULL_TIME',
          reportingManagerId: alexUser.profile?.id,
          emergencyContact: 'Grace Kim (+1 555-712-8822)',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        },
      },
    },
    include: { profile: true },
  });

  // User 6: Employee - Marketing Lead
  const rachelUser = await prisma.user.create({
    data: {
      email: 'rachel.green@dayflow.internal',
      employeeId: 'EMP-1004',
      passwordHash: defaultPasswordHash,
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      isEmailVerified: true,
      profile: {
        create: {
          firstName: 'Rachel',
          lastName: 'Green',
          phone: '+1 (555) 902-3344',
          dateOfBirth: new Date('1993-09-30'),
          gender: 'Female',
          address: '210 Columbus Ave, San Francisco, CA',
          department: 'MARKETING',
          designation: 'Growth Marketing Lead',
          dateOfJoining: new Date('2023-11-15'),
          employmentType: 'FULL_TIME',
          reportingManagerId: adminUser.profile?.id,
          emergencyContact: 'Monica Geller (+1 555-902-5566)',
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        },
      },
    },
    include: { profile: true },
  });

  const allProfiles = [
    adminUser.profile!,
    hrUser.profile!,
    alexUser.profile!,
    elenaUser.profile!,
    davidUser.profile!,
    rachelUser.profile!,
  ];

  // 3. Create Leave Balances for all employees for current year
  console.log('🔹 Creating Annual Leave Balances...');
  for (const profile of allProfiles) {
    for (const lt of leaveTypesList) {
      await prisma.leaveBalance.create({
        data: {
          employeeId: profile.id,
          leaveTypeId: lt.id,
          year: currentYear,
          totalAllocated: lt.maxDaysPerYear,
          usedDays: lt.code === 'PTO' ? 2 : 0,
          pendingDays: 0,
          remainingDays: lt.code === 'PTO' ? lt.maxDaysPerYear - 2 : lt.maxDaysPerYear,
        },
      });
    }
  }

  // 4. Create Versioned Salary Structures
  console.log('🔹 Creating Versioned Salary Structures...');
  const salaryConfigs = [
    { profile: adminUser.profile!, base: 14000, hra: 4000, allowances: 2000, deductions: 3500, oldBase: 12500 },
    { profile: hrUser.profile!, base: 9500, hra: 2800, allowances: 1200, deductions: 2200, oldBase: 8500 },
    { profile: alexUser.profile!, base: 13500, hra: 3800, allowances: 1800, deductions: 3200, oldBase: 11800 },
    { profile: elenaUser.profile!, base: 10500, hra: 3000, allowances: 1400, deductions: 2500, oldBase: 9200 },
    { profile: davidUser.profile!, base: 9000, hra: 2500, allowances: 1100, deductions: 2000, oldBase: 8000 },
    { profile: rachelUser.profile!, base: 8500, hra: 2400, allowances: 1000, deductions: 1900, oldBase: 7500 },
  ];

  const currentSalaryStructures: Record<string, any> = {};

  for (const cfg of salaryConfigs) {
    // 2025 Historical Version (Inactive)
    await prisma.salaryStructure.create({
      data: {
        employeeId: cfg.profile.id,
        effectiveDate: new Date('2025-01-01'),
        baseSalary: cfg.oldBase,
        hra: cfg.hra * 0.85,
        allowances: cfg.allowances * 0.85,
        deductions: cfg.deductions * 0.85,
        grossSalary: cfg.oldBase + cfg.hra * 0.85 + cfg.allowances * 0.85,
        netSalary: (cfg.oldBase + cfg.hra * 0.85 + cfg.allowances * 0.85) - (cfg.deductions * 0.85),
        isCurrent: false,
        currency: 'USD',
        remarks: 'Initial compensation structure for 2025',
        createdById: adminUser.id,
      },
    });

    // 2026 Active Version (Current)
    const gross = cfg.base + cfg.hra + cfg.allowances;
    const net = gross - cfg.deductions;
    const currentStructure = await prisma.salaryStructure.create({
      data: {
        employeeId: cfg.profile.id,
        effectiveDate: new Date('2026-01-01'),
        baseSalary: cfg.base,
        hra: cfg.hra,
        allowances: cfg.allowances,
        deductions: cfg.deductions,
        grossSalary: gross,
        netSalary: net,
        isCurrent: true,
        currency: 'USD',
        remarks: 'Annual merit appraisal and standard market adjustment',
        createdById: adminUser.id,
      },
    });

    currentSalaryStructures[cfg.profile.id] = currentStructure;
  }

  // 5. Generate Past Payroll Records (Jan 2026 & Feb 2026)
  console.log('🔹 Generating Historical Payroll Records & Payslips...');
  for (const profile of allProfiles) {
    const struct = currentSalaryStructures[profile.id];
    
    // Jan 2026 Payslip
    await prisma.payrollRecord.create({
      data: {
        employeeId: profile.id,
        salaryStructureId: struct.id,
        month: 1,
        year: 2026,
        paymentDate: new Date('2026-01-31'),
        baseAmount: struct.baseSalary,
        hraAmount: struct.hra,
        allowancesBreakdown: JSON.stringify({
          transport: struct.allowances * 0.4,
          wellness: struct.allowances * 0.3,
          special: struct.allowances * 0.3,
        }),
        deductionsBreakdown: JSON.stringify({
          incomeTax: struct.deductions * 0.7,
          socialSecurityPF: struct.deductions * 0.25,
          insurance: struct.deductions * 0.05,
        }),
        grossAmount: struct.grossSalary,
        netAmount: struct.netSalary,
        status: 'PAID',
        transactionReference: `ACH-DAYFLOW-${202601}-${profile.id.slice(0, 6).toUpperCase()}`,
        notes: 'Disbursed via automated direct deposit.',
      },
    });

    // Feb 2026 Payslip
    await prisma.payrollRecord.create({
      data: {
        employeeId: profile.id,
        salaryStructureId: struct.id,
        month: 2,
        year: 2026,
        paymentDate: new Date('2026-02-28'),
        baseAmount: struct.baseSalary,
        hraAmount: struct.hra,
        allowancesBreakdown: JSON.stringify({
          transport: struct.allowances * 0.4,
          wellness: struct.allowances * 0.3,
          special: struct.allowances * 0.3,
        }),
        deductionsBreakdown: JSON.stringify({
          incomeTax: struct.deductions * 0.7,
          socialSecurityPF: struct.deductions * 0.25,
          insurance: struct.deductions * 0.05,
        }),
        grossAmount: struct.grossSalary,
        netAmount: struct.netSalary,
        status: 'PAID',
        transactionReference: `ACH-DAYFLOW-${202602}-${profile.id.slice(0, 6).toUpperCase()}`,
        notes: 'Disbursed via automated direct deposit.',
      },
    });
  }

  // 6. Generate Realistic Attendance Logs (Last 14 Days)
  console.log('🔹 Generating 14-Day Attendance Logs...');
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  for (let i = 13; i >= 0; i--) {
    const dayDate = new Date(today);
    dayDate.setUTCDate(today.getUTCDate() - i);
    const dayOfWeek = dayDate.getUTCDay();

    // Skip weekends (0 = Sun, 6 = Sat)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      continue;
    }

    for (const profile of allProfiles) {
      const isToday = i === 0;
      let status = 'PRESENT';
      let workMode = 'OFFICE';
      let checkIn: Date | null = null;
      let checkOut: Date | null = null;
      let hours = 8.5;

      // Seed varied patterns for realism
      if (profile.department === 'ENGINEERING' && i % 3 === 0) {
        workMode = 'REMOTE';
      }

      if (isToday) {
        // Today's live check-in
        checkIn = new Date(dayDate);
        checkIn.setUTCHours(9, 15, 0, 0);
        checkOut = null; // Currently clocked in
        hours = 0;
      } else {
        checkIn = new Date(dayDate);
        checkIn.setUTCHours(9, Math.floor(Math.random() * 20), 0, 0);
        checkOut = new Date(dayDate);
        checkOut.setUTCHours(17, 30 + Math.floor(Math.random() * 30), 0, 0);
        hours = parseFloat(((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60)).toFixed(2));
      }

      await prisma.attendanceRecord.create({
        data: {
          employeeId: profile.id,
          date: dayDate,
          checkInTime: checkIn,
          checkOutTime: checkOut,
          status,
          workMode,
          totalHours: hours,
          notes: isToday ? 'Live clocked in from Headquarters' : 'Standard business day',
          ipAddress: '192.168.1.104',
        },
      });
    }
  }

  // 7. Seed Sample Leave Requests
  console.log('🔹 Creating Leave Requests...');
  // Alex Chen approved PTO
  await prisma.leaveRequest.create({
    data: {
      employeeId: alexUser.profile!.id,
      leaveTypeId: pto.id,
      startDate: new Date('2026-03-10'),
      endDate: new Date('2026-03-11'),
      totalDays: 2,
      reason: 'Attending Next-Gen Cloud Distributed Systems Conference',
      status: 'APPROVED',
      approvedById: adminUser.id,
      adminRemarks: 'Approved. Enjoy the conference!',
      reviewedAt: new Date('2026-02-15'),
    },
  });

  // Elena Rodriguez pending PTO
  await prisma.leaveRequest.create({
    data: {
      employeeId: elenaUser.profile!.id,
      leaveTypeId: pto.id,
      startDate: new Date('2026-04-01'),
      endDate: new Date('2026-04-03'),
      totalDays: 3,
      reason: 'Family vacation and personal downtime',
      status: 'PENDING',
      appliedAt: new Date(),
    },
  });

  // David Kim pending Sick Leave
  await prisma.leaveRequest.create({
    data: {
      employeeId: davidUser.profile!.id,
      leaveTypeId: sickLeave.id,
      startDate: new Date('2026-03-05'),
      endDate: new Date('2026-03-05'),
      totalDays: 1,
      reason: 'Scheduled dental procedure and recovery',
      status: 'PENDING',
      appliedAt: new Date(),
    },
  });

  // 8. Seed Initial Audit Logs
  console.log('🔹 Logging Administrative Audit Trail...');
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      userEmail: adminUser.email,
      action: 'SYSTEM_INITIALIZATION',
      resourceType: 'SYSTEM',
      resourceId: 'SYS-BOOT',
      changesDiff: JSON.stringify({ event: 'Dayflow HRMS seed initialization & schema validation completed' }),
      ipAddress: '127.0.0.1',
      userAgent: 'Dayflow-Seed-Engine/1.0',
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      userEmail: adminUser.email,
      action: 'SALARY_REVISION',
      resourceType: 'PAYROLL',
      resourceId: alexUser.profile!.id,
      changesDiff: JSON.stringify({
        employee: 'Alex Chen',
        oldGross: 13500,
        newGross: 19100,
        reason: 'Promotion to Staff Software Architect',
      }),
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 Dayflow-Client',
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: hrUser.id,
      userEmail: hrUser.email,
      action: 'LEAVE_APPROVAL',
      resourceType: 'LEAVE',
      resourceId: alexUser.profile!.id,
      changesDiff: JSON.stringify({
        employee: 'Alex Chen',
        type: 'PTO',
        days: 2,
        status: 'APPROVED',
      }),
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 Dayflow-Client',
    },
  });

  // 9. Seed Notifications
  console.log('🔹 Creating In-App Notifications...');
  await prisma.notification.create({
    data: {
      userId: alexUser.id,
      title: 'Leave Request Approved',
      message: 'Your PTO request for Mar 10 - Mar 11 has been approved by Sarah Connor.',
      type: 'SUCCESS',
      isRead: false,
      linkUrl: '/leave',
    },
  });

  await prisma.notification.create({
    data: {
      userId: hrUser.id,
      title: 'Action Required: Pending Leave Applications',
      message: '2 leave applications are awaiting your managerial review (Elena Rodriguez, David Kim).',
      type: 'ACTION_REQUIRED',
      isRead: false,
      linkUrl: '/admin/leave-approvals',
    },
  });

  await prisma.notification.create({
    data: {
      userId: adminUser.id,
      title: 'February Payroll Finalized',
      message: 'Payroll run for February 2026 has been successfully processed and disbursed.',
      type: 'INFO',
      isRead: true,
      linkUrl: '/admin/payroll',
    },
  });

  console.log('✅ Dayflow HRMS Database seeded successfully!');
  console.log('----------------------------------------------------');
  console.log('Demo Credentials (All accounts use password: Password@123):');
  console.log('👑 Admin:        admin@dayflow.internal');
  console.log('💼 HR Manager:   hr@dayflow.internal');
  console.log('💻 Engineer:     alex.chen@dayflow.internal');
  console.log('🎨 Designer:     elena.rodriguez@dayflow.internal');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
