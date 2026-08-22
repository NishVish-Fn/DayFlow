import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  User,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  Users,
  CreditCard,
  Clock,
  Briefcase,
  Globe2,
  Zap,
  Check,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { CorporateGlobeLogo } from '../components/common/CorporateGlobeLogo';

export const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Sign In State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('ENGINEERING');
  const [designation, setDesignation] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(identifier, password);
      navigate('/');
    } catch (error) {
      // Handled in context toast
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await register({
        firstName,
        lastName,
        email,
        employeeId,
        department,
        designation,
        password: signupPassword,
      });
      navigate('/');
    } catch (error) {
      // Handled in context toast
    } finally {
      setLoading(false);
    }
  };

  const setQuickFill = (roleEmail: string, roleBadge: string) => {
    setMode('signin');
    setIdentifier(roleEmail);
    setPassword('Password@123');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans selection:bg-blue-600 selection:text-white">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.08)] border border-slate-200/90 overflow-hidden min-h-[640px]">
        
        {/* ================================================================= */}
        {/* LEFT HERO: EXECUTIVE CORPORATE SHOWCASE                            */}
        {/* ================================================================= */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] p-8 sm:p-10 flex flex-col justify-between text-white border-b lg:border-b-0 lg:border-r border-slate-800 relative overflow-hidden">
          
          {/* Subtle background mesh */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10 space-y-4">
            <CorporateGlobeLogo size="md" variant="light" />

            <div className="pt-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display leading-tight">
                Enterprise workforce management, refined.
              </h1>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed font-medium">
                Unified punch clock attendance, auditable versioned compensation, balance-tracked leaves, and tamper-evident governance.
              </p>
            </div>
          </div>

          {/* Feature Checklist */}
          <div className="my-8 space-y-3 relative z-10">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
              <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-100">Live Punch Clock & Attendance</div>
                <div className="text-[11px] text-slate-400">Geofenced daily attendance with automated duration logs</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-100">Versioned Payroll Architecture</div>
                <div className="text-[11px] text-slate-400">Immutable salary history with 1-click PDF/HTML payslips</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-100">Leave Balance Reservations</div>
                <div className="text-[11px] text-slate-400">Annual quota enforcement & manager approval workflows</div>
              </div>
            </div>
          </div>

          {/* Security Standard Footer */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Bcrypt Cost 12 &bull; JWT Tokens</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">PostgreSQL 3NF</span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* RIGHT AUTH CARD: HIGH-CONVERTING CORPORATE FORM                   */}
        {/* ================================================================= */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-white">
          <div className="space-y-6">
            
            {/* Header & Segmented Tab */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight font-display">
                  {mode === 'signin' ? 'Sign In to Dayflow' : 'Create Corporate Profile'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {mode === 'signin'
                    ? 'Enter your corporate credentials to continue'
                    : 'Register your staff account in the organization directory'}
                </p>
              </div>

              {/* Segmented Control */}
              <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs shrink-0">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    mode === 'signin'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            {/* FORM: SIGN IN */}
            {mode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Corporate Email or Badge ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. admin@dayflow.internal or EMP-0001"
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">Password</label>
                    <span className="text-[11px] text-blue-600 hover:text-blue-700 cursor-pointer font-semibold">
                      Forgot Password?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-1 font-medium">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span>Remember this device</span>
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20 py-2.5 text-xs"
                  isLoading={loading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Sign In to Workplace
                </Button>
              </form>
            )}

            {/* FORM: REGISTER */}
            {mode === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Alex"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Chen"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@dayflow.internal"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Staff Badge ID</label>
                    <input
                      type="text"
                      required
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      placeholder="EMP-1008"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    >
                      <option value="ENGINEERING">Engineering</option>
                      <option value="PRODUCT">Product</option>
                      <option value="DESIGN">Design</option>
                      <option value="HUMAN_RESOURCES">Human Resources</option>
                      <option value="MARKETING">Marketing</option>
                      <option value="SALES">Sales</option>
                      <option value="FINANCE">Finance</option>
                      <option value="OPERATIONS">Operations</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Job Designation</label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-700">Password</label>
                    <span className="text-[10px] text-slate-500 font-medium">Min 8 chars, 1 uppercase, 1 number</span>
                  </div>
                  <input
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="e.g. Dayflow@2026"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20 py-2.5 text-xs mt-1"
                  isLoading={loading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Create Account
                </Button>
              </form>
            )}
          </div>

          {/* Quick-Fill Persona Selector */}
          <div className="pt-5 border-t border-slate-100 mt-5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <span>Quick Test Personas (1-Click Fill)</span>
              <span className="font-normal lowercase text-slate-400">pwd: Password@123</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setQuickFill('admin@dayflow.internal', 'EMP-0001')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-left transition-all group cursor-pointer"
              >
                <div className="font-bold text-[11px] text-slate-800 group-hover:text-blue-700 flex items-center gap-1">
                  👑 Admin
                </div>
                <div className="text-[10px] text-slate-500 truncate">Sarah Connor</div>
              </button>

              <button
                type="button"
                onClick={() => setQuickFill('hr@dayflow.internal', 'EMP-0002')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-left transition-all group cursor-pointer"
              >
                <div className="font-bold text-[11px] text-slate-800 group-hover:text-blue-700 flex items-center gap-1">
                  💼 HR Lead
                </div>
                <div className="text-[10px] text-slate-500 truncate">Marcus Vance</div>
              </button>

              <button
                type="button"
                onClick={() => setQuickFill('alex.chen@dayflow.internal', 'EMP-1001')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-left transition-all group cursor-pointer"
              >
                <div className="font-bold text-[11px] text-slate-800 group-hover:text-blue-700 flex items-center gap-1">
                  💻 Engineer
                </div>
                <div className="text-[10px] text-slate-500 truncate">Alex Chen</div>
              </button>

              <button
                type="button"
                onClick={() => setQuickFill('elena.rodriguez@dayflow.internal', 'EMP-1002')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-left transition-all group cursor-pointer"
              >
                <div className="font-bold text-[11px] text-slate-800 group-hover:text-blue-700 flex items-center gap-1">
                  🎨 Designer
                </div>
                <div className="text-[10px] text-slate-500 truncate">Elena Rodriguez</div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
