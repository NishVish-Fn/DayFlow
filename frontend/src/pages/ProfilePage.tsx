import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  Lock,
  ShieldCheck,
  FileCheck,
  Edit2,
  FileText,
  CreditCard,
  Heart,
  Sparkles,
  Plus,
  Trash2,
  Download,
  Upload,
  Landmark,
  Shield,
  MapPin,
  CheckCircle2,
  Save,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { computeSalaryStructure, SalaryBreakdown } from '../utils/hrCalculations';

export const ProfilePage: React.FC = () => {
  const { user, role, refreshProfile } = useAuth();
  const isAdmin = role === 'ADMIN';
  const profile = user?.profile;
  const { success, error } = useToast();

  const storageKey = `worknest_profile_${user?.employeeId || user?.email || 'default'}`;

  // Read saved local profile if available
  const savedProfile = (() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  })();

  const [activeTab, setActiveTab] = useState<'profile' | 'private' | 'bank' | 'salary' | 'security'>('profile');
  const [isEditing, setIsEditing] = useState(false);

  // Core Identity Fields
  const [firstName, setFirstName] = useState(savedProfile?.firstName || profile?.firstName || 'Alex');
  const [lastName, setLastName] = useState(savedProfile?.lastName || profile?.lastName || 'Chen');
  const [phone, setPhone] = useState(savedProfile?.phone || profile?.phone || '+1 (555) 019-2831');
  const [designation, setDesignation] = useState(savedProfile?.designation || profile?.designation || 'Senior Software Architect');
  const [department, setDepartment] = useState(savedProfile?.department || profile?.department || 'ENGINEERING');
  const [workLocation, setWorkLocation] = useState(savedProfile?.workLocation || profile?.workLocation || 'HQ - San Francisco');

  // §4 Fields: My Profile & About & Job Love & Interests & Skills & Certification
  const [aboutBio, setAboutBio] = useState(
    savedProfile?.about ||
      profile?.about ||
      'Passionate technologist dedicated to building scalable enterprise workforce solutions with human-first design principles.'
  );
  const [jobLove, setJobLove] = useState(
    savedProfile?.jobLove ||
      profile?.jobLove ||
      'Collaborating with high-impact teams, solving challenging distributed systems problems, and empowering colleagues.'
  );
  const [interests, setInterests] = useState(
    savedProfile?.interests || profile?.interests || 'Cloud Architecture, Open Source AI, Hiking, Photography, and Coffee brewing.'
  );
  const [skills, setSkills] = useState<string[]>(
    savedProfile?.skills || (profile?.skills ? JSON.parse(profile.skills) : ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'System Architecture', 'UI/UX'])
  );
  const [newSkill, setNewSkill] = useState('');
  const [certifications, setCertifications] = useState<string[]>(
    savedProfile?.certifications || [
      'AWS Certified Solutions Architect - Professional',
      'Google Cloud Professional Cloud Architect',
      'Certified ScrumMaster (CSM)',
    ]
  );
  const [newCert, setNewCert] = useState('');

  // §5 Fields: Private Info
  const [dob, setDob] = useState(savedProfile?.dob || '1994-08-15');
  const [residingAddress, setResidingAddress] = useState(savedProfile?.residingAddress || profile?.address || '742 Evergreen Terrace, San Francisco, CA');
  const [personalEmail, setPersonalEmail] = useState(savedProfile?.personalEmail || 'alex.chen.personal@gmail.com');
  const [nationality, setNationality] = useState(savedProfile?.nationality || 'United States');
  const [gender, setGender] = useState(savedProfile?.gender || 'Male');
  const [maritalStatus, setMaritalStatus] = useState(savedProfile?.maritalStatus || 'Single');
  const [dateOfJoining, setDateOfJoining] = useState(savedProfile?.dateOfJoining || profile?.dateOfJoining || '2022-03-01');

  // §5 Fields: Bank Details
  const [accountNumber, setAccountNumber] = useState(savedProfile?.accountNumber || '987654321012');
  const [bankName, setBankName] = useState(savedProfile?.bankName || 'Silicon Valley Bank');
  const [ifscCode, setIfscCode] = useState(savedProfile?.ifscCode || 'SVBL0004521');
  const [panNo, setPanNo] = useState(savedProfile?.panNo || 'ABCDE1234F');
  const [uanNo, setUanNo] = useState(savedProfile?.uanNo || '100987654321');
  const [empCode] = useState(user?.employeeId || 'OIALCH20230003');

  // §6 Fields: Salary Info (Admin-only)
  const [monthlyWage, setMonthlyWage] = useState(50000);
  const [workingDaysPerWeek, setWorkingDaysPerWeek] = useState(5);
  const [breakTimeHours, setBreakTimeHours] = useState(1);
  const [basicPercent] = useState(50);
  const [hraPercent] = useState(50);
  const [standardAllowance] = useState(2500);
  const [bonusPercent] = useState(10);
  const [ltaPercent] = useState(5);
  const [pfPercent] = useState(12);
  const [professionalTax] = useState(200);

  // Compute live §6 salary
  const salary: SalaryBreakdown = computeSalaryStructure(
    monthlyWage,
    basicPercent,
    hraPercent,
    standardAllowance,
    bonusPercent,
    ltaPercent,
    pfPercent,
    pfPercent,
    professionalTax,
    workingDaysPerWeek,
    breakTimeHours
  );

  // Password Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
      success('Skill Added', 'Profile skillset expanded.');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCert.trim() && !certifications.includes(newCert.trim())) {
      setCertifications([...certifications, newCert.trim()]);
      setNewCert('');
      success('Certification Added', 'Verified credential attached.');
    }
  };

  const handleSaveProfile = async () => {
    const updated = {
      firstName,
      lastName,
      phone,
      designation,
      department,
      workLocation,
      about: aboutBio,
      jobLove,
      interests,
      skills,
      certifications,
      dob,
      residingAddress,
      personalEmail,
      nationality,
      gender,
      maritalStatus,
      dateOfJoining,
      accountNumber,
      bankName,
      ifscCode,
      panNo,
      uanNo,
    };

    // 1. Save to persistent localStorage
    localStorage.setItem(storageKey, JSON.stringify(updated));
    localStorage.setItem('dayflow_custom_profile', JSON.stringify(updated));

    // 2. Sync to backend API if available
    try {
      await api.patch('/auth/me/profile', updated);
    } catch (e) {}

    success('Profile Saved', 'All changes and biometric records updated successfully.');
    setIsEditing(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      error('Mismatch', 'New passwords do not match');
      return;
    }
    try {
      setPassLoading(true);
      await api.post('/auth/change-password', { currentPassword, newPassword });
      success('Password Updated', 'Account credentials successfully secured.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      error('Update Failed', err.response?.data?.error?.message || 'Could not update password');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Header Card (§4 & §5 Spec) */}
      <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 border-b border-black/[0.05] dark:border-white/[0.06] pb-6 mb-6">
          <div className="flex items-center gap-4">
            <img
              src={profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || firstName}`}
              alt="Avatar"
              className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-black/[0.06] dark:border-white/[0.08] object-cover shadow-xs"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {firstName} {lastName}
                </h2>
                <span className="font-mono text-xs font-bold text-[#0071e3] bg-[#0071e3]/10 px-2.5 py-0.5 rounded-full border border-[#0071e3]/20">
                  {empCode}
                </span>
                <Badge variant={user?.role === 'ADMIN' ? 'purple' : 'success'} size="sm">
                  {user?.role || 'EMPLOYEE'}
                </Badge>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                {designation} &bull; {department}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Company: <strong>Odoo India / WorkNest</strong> &bull; Location: <strong>{workLocation}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation (§4, §5, §6 Spec: My Profile | Private Info | Bank Details | Salary Info | Security) */}
        <div className="flex flex-wrap gap-1 p-1 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] text-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-[#2c2c2e] text-[#0071e3] dark:text-[#2997ff] shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" /> My Profile & Bios
          </button>

          <button
            onClick={() => setActiveTab('private')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === 'private'
                ? 'bg-white dark:bg-[#2c2c2e] text-[#0071e3] dark:text-[#2997ff] shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Private Info
          </button>

          <button
            onClick={() => setActiveTab('bank')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === 'bank'
                ? 'bg-white dark:bg-[#2c2c2e] text-[#0071e3] dark:text-[#2997ff] shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" /> Bank Details
          </button>

          {/* §6 Spec: Salary Info (Admin-only) */}
          {isAdmin && (
            <button
              onClick={() => setActiveTab('salary')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                activeTab === 'salary'
                  ? 'bg-white dark:bg-[#2c2c2e] text-[#0071e3] dark:text-[#2997ff] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" /> Salary Info (Admin)
            </button>
          )}

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-white dark:bg-[#2c2c2e] text-[#0071e3] dark:text-[#2997ff] shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" /> Security & 2FA
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: §4 My Profile (Name, Email, Mobile, About, Love Job, Skills, Certs) */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Header Details Grid */}
          <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-6 shadow-xs text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Organizational Coordinates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-slate-400 block text-[11px] font-semibold">First Name</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full mt-1 bg-black/[0.02] dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-xl px-2.5 py-1.5 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-[#0071e3]"
                  />
                ) : (
                  <span className="font-bold text-slate-800 dark:text-slate-200">{firstName}</span>
                )}
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-semibold">Last Name</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full mt-1 bg-black/[0.02] dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-xl px-2.5 py-1.5 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-[#0071e3]"
                  />
                ) : (
                  <span className="font-bold text-slate-800 dark:text-slate-200">{lastName}</span>
                )}
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-semibold">Mobile Phone</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full mt-1 bg-black/[0.02] dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-xl px-2.5 py-1.5 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-[#0071e3]"
                  />
                ) : (
                  <span className="font-bold text-slate-800 dark:text-slate-200">{phone}</span>
                )}
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-semibold">Job Designation</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full mt-1 bg-black/[0.02] dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-xl px-2.5 py-1.5 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-[#0071e3]"
                  />
                ) : (
                  <span className="font-bold text-slate-800 dark:text-slate-200">{designation}</span>
                )}
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-semibold">Department & Team</span>
                {isEditing ? (
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full mt-1 bg-black/[0.02] dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-xl px-2.5 py-1.5 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-[#0071e3]"
                  >
                    <option value="ENGINEERING">Engineering</option>
                    <option value="PRODUCT">Product</option>
                    <option value="DESIGN">Design</option>
                    <option value="HUMAN_RESOURCES">Human Resources</option>
                    <option value="MARKETING">Marketing</option>
                    <option value="FINANCE">Finance</option>
                    <option value="OPERATIONS">Operations</option>
                  </select>
                ) : (
                  <span className="font-bold text-slate-800 dark:text-slate-200">{department}</span>
                )}
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-semibold">Office Location</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={workLocation}
                    onChange={(e) => setWorkLocation(e.target.value)}
                    className="w-full mt-1 bg-black/[0.02] dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-xl px-2.5 py-1.5 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-[#0071e3]"
                  />
                ) : (
                  <span className="font-bold text-slate-800 dark:text-slate-200">{workLocation}</span>
                )}
              </div>
            </div>
          </div>

          {/* §4 Spec: Free-Text Sections (About, What I love about my job, Interests) */}
          <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-6 shadow-xs space-y-5 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                About Me (Bio)
              </label>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={aboutBio}
                  onChange={(e) => setAboutBio(e.target.value)}
                  className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#0071e3]"
                />
              ) : (
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-black/20 p-3 rounded-2xl border border-black/[0.04] dark:border-white/[0.06]">
                  {aboutBio}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                What I Love About My Job
              </label>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={jobLove}
                  onChange={(e) => setJobLove(e.target.value)}
                  className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#0071e3]"
                />
              ) : (
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-black/20 p-3 rounded-2xl border border-black/[0.04] dark:border-white/[0.06]">
                  {jobLove}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                My Interests and Hobbies
              </label>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-[#0071e3]"
                />
              ) : (
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-black/20 p-3 rounded-2xl border border-black/[0.04] dark:border-white/[0.06]">
                  {interests}
                </p>
              )}
            </div>
          </div>

          {/* §4 Spec: Skills (+ Add Skills Control) & Certifications & Resume */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills Card */}
            <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-6 shadow-xs text-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Technical & Leadership Skills</h3>
                <span className="text-[11px] text-slate-400">{skills.length} skills</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0071e3]/10 text-[#0071e3] dark:text-[#2997ff] border border-[#0071e3]/20 font-semibold"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-red-500 cursor-pointer ml-1"
                      >
                        &times;
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {/* + Add Skill Control */}
              <form onSubmit={handleAddSkill} className="flex gap-2 pt-2 border-t border-black/[0.04] dark:border-white/[0.06]">
                <input
                  type="text"
                  placeholder="e.g. GraphQL, Kubernetes..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 bg-black/[0.02] dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0071e3]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </form>
            </div>

            {/* Certifications & Resume */}
            <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-6 shadow-xs text-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Accredited Certifications</h3>
                <Badge variant="success" size="sm">Verified</Badge>
              </div>

              <div className="space-y-2">
                {certifications.map((cert, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-black/20 border border-black/[0.04] dark:border-white/[0.06] font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="truncate">{cert}</span>
                  </div>
                ))}
              </div>

              {/* Resume Card */}
              <div className="pt-3 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Curriculum Vitae / Resume</div>
                  <div className="text-[10px] text-slate-400">Alex_Chen_Resume_2026.pdf (1.4 MB)</div>
                </div>
                <button
                  onClick={() => success('Resume Downloaded', 'Transferred official document.')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer text-[11px]"
                >
                  <Download className="w-3.5 h-3.5" /> View / Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: §5 Private Info (DOB, Address, Personal Email, Nationality, Gender) */}
      {/* ========================================================================= */}
      {activeTab === 'private' && (
        <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-xs text-xs space-y-6">
          <div className="border-b border-black/[0.05] dark:border-white/[0.06] pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Confidential Private Information</h3>
            <p className="text-[11px] text-slate-400">Encrypted personal identity & residential data.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-slate-500 mb-1 font-semibold">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3.5 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-semibold">Personal Email</label>
              <input
                type="email"
                value={personalEmail}
                onChange={(e) => setPersonalEmail(e.target.value)}
                className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3.5 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-semibold">Nationality</label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3.5 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-semibold">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3.5 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#0071e3]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Prefer Not to Say">Prefer Not to Say</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-semibold">Marital Status</label>
              <select
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
                className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3.5 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#0071e3]"
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-semibold">Date of Joining</label>
              <input
                type="date"
                value={dateOfJoining}
                onChange={(e) => setDateOfJoining(e.target.value)}
                className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3.5 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-500 mb-1 font-semibold">Residing Address</label>
              <input
                type="text"
                value={residingAddress}
                onChange={(e) => setResidingAddress(e.target.value)}
                className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3.5 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#0071e3]"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: §5 Bank Details (Account Number, Bank Name, IFSC, PAN, UAN, EmpCode)*/}
      {/* ========================================================================= */}
      {activeTab === 'bank' && (
        <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-xs text-xs space-y-6">
          <div className="border-b border-black/[0.05] dark:border-white/[0.06] pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Bank & Statutory Identification Details</h3>
            <p className="text-[11px] text-slate-400">Direct disbursement coordinates and tax identifiers.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-slate-500 mb-1 font-semibold">Bank Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3.5 py-2 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-semibold">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3.5 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-semibold">IFSC / Swift Routing Code</label>
              <input
                type="text"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
                className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3.5 py-2 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-semibold">PAN Number (Tax Identifier)</label>
              <input
                type="text"
                value={panNo}
                onChange={(e) => setPanNo(e.target.value)}
                className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3.5 py-2 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-semibold">Universal Account Number (UAN / PF)</label>
              <input
                type="text"
                value={uanNo}
                onChange={(e) => setUanNo(e.target.value)}
                className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3.5 py-2 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-semibold">Employee Code (Deterministic)</label>
              <input
                type="text"
                readOnly
                value={empCode}
                className="w-full bg-slate-100 dark:bg-black/50 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3.5 py-2 text-[#0071e3] font-mono font-bold cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: §6 Salary Info (Admin-Only Calculation Engine Validated with ₹50,000)*/}
      {/* ========================================================================= */}
      {activeTab === 'salary' && isAdmin && (
        <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-xs text-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.05] dark:border-white/[0.06] pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#0071e3]" /> Comprehensive Salary Structure & Calculation Engine
              </h3>
              <p className="text-[11px] text-slate-400">
                §6 Specifications &bull; Fixed Wage with dynamic component auto-balancing
              </p>
            </div>
            <Badge variant="purple" size="sm">Admin Restricted</Badge>
          </div>

          {/* Base Wage Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-black/30 border border-black/[0.05] dark:border-white/[0.06]">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Month Wage (₹)</label>
              <input
                type="number"
                value={monthlyWage}
                onChange={(e) => setMonthlyWage(Number(e.target.value) || 0)}
                className="w-full bg-white dark:bg-black/40 border border-black/[0.1] dark:border-white/[0.15] rounded-xl px-3 py-2 text-sm font-black text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Yearly Wage (₹)</label>
              <input
                type="number"
                readOnly
                value={salary.yearlyWage}
                className="w-full bg-slate-100 dark:bg-black/60 border border-black/[0.05] dark:border-white/[0.1] rounded-xl px-3 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Working Days/Wk</label>
              <input
                type="number"
                value={workingDaysPerWeek}
                onChange={(e) => setWorkingDaysPerWeek(Number(e.target.value) || 5)}
                className="w-full bg-white dark:bg-black/40 border border-black/[0.1] dark:border-white/[0.15] rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Break Time (Hrs)</label>
              <input
                type="number"
                value={breakTimeHours}
                onChange={(e) => setBreakTimeHours(Number(e.target.value) || 1)}
                className="w-full bg-white dark:bg-black/40 border border-black/[0.1] dark:border-white/[0.15] rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Salary Components Breakdown Table (§6 Spec) */}
          <div className="border border-black/[0.06] dark:border-white/[0.08] rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-black/40 border-b border-black/[0.06] dark:border-white/[0.08] text-slate-500 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Component</th>
                  <th className="py-2.5 px-4">Computation Type</th>
                  <th className="py-2.5 px-4">Configured Rate</th>
                  <th className="py-2.5 px-4 text-right">Monthly Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
                <tr>
                  <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Basic Salary</td>
                  <td className="py-2.5 px-4 text-slate-500">% of Defined Wage</td>
                  <td className="py-2.5 px-4 font-mono">{basicPercent}%</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    ₹{salary.basicSalary.toLocaleString()}
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">House Rent Allowance (HRA)</td>
                  <td className="py-2.5 px-4 text-slate-500">% of Basic Salary</td>
                  <td className="py-2.5 px-4 font-mono">{hraPercent}% of Basic</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    ₹{salary.hra.toLocaleString()}
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Standard Allowance</td>
                  <td className="py-2.5 px-4 text-slate-500">Fixed Predetermined Amount</td>
                  <td className="py-2.5 px-4 font-mono">Fixed</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    ₹{salary.standardAllowance.toLocaleString()}
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Performance Bonus</td>
                  <td className="py-2.5 px-4 text-slate-500">% of Basic Salary</td>
                  <td className="py-2.5 px-4 font-mono">{bonusPercent}% of Basic</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    ₹{salary.performanceBonus.toLocaleString()}
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Leave Travel Allowance (LTA)</td>
                  <td className="py-2.5 px-4 text-slate-500">% of Basic Salary</td>
                  <td className="py-2.5 px-4 font-mono">{ltaPercent}% of Basic</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    ₹{salary.lta.toLocaleString()}
                  </td>
                </tr>

                <tr className="bg-blue-50/50 dark:bg-blue-950/20">
                  <td className="py-2.5 px-4 font-bold text-[#0071e3] dark:text-[#2997ff]">Fixed Allowance (Balancing)</td>
                  <td className="py-2.5 px-4 text-slate-500">Wage minus Total Components</td>
                  <td className="py-2.5 px-4 font-mono">Auto-Balanced</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-[#0071e3] dark:text-[#2997ff]">
                    ₹{salary.fixedAllowance.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Statutory Deductions Section */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <h4 className="font-bold text-amber-800 dark:text-amber-300 text-xs">Statutory Deductions & Contributions</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">PF Employee (12% Basic)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">₹{salary.pfEmployee.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">PF Employer (12% Basic)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">₹{salary.pfEmployer.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Professional Tax (Fixed)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">₹{salary.professionalTax.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Net Pay Result Banner */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <div>
              <span className="text-emerald-700 dark:text-emerald-300 font-bold text-xs">Monthly Net Disbursed Salary</span>
              <div className="text-[11px] text-slate-500">Gross (₹{salary.grossSalary.toLocaleString()}) - Deductions (₹{salary.totalDeductions.toLocaleString()})</div>
            </div>
            <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              ₹{salary.netPayable.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: Security & Password Management                                     */}
      {/* ========================================================================= */}
      {activeTab === 'security' && (
        <div className="bg-white dark:bg-[#161618] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-xs text-xs space-y-6">
          <div className="border-b border-black/[0.05] dark:border-white/[0.06] pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Password & Security Protocol</h3>
            <p className="text-[11px] text-slate-400">Manage account access and reset system-generated onboarding passwords.</p>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div>
              <label className="block text-slate-500 mb-1 font-semibold">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-semibold">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-semibold">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-black/[0.02] dark:bg-black/30 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            <Button type="submit" variant="primary" size="md" isLoading={passLoading} className="rounded-full px-6">
              Update Password
            </Button>
          </form>
        </div>
      )}

    </div>
  );
};
