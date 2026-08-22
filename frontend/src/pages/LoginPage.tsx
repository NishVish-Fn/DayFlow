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
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f19] via-[#0f172a] to-[#1e1b4b] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background Glowing Mesh Orbs */}
      <div className="fixed top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-white/20 overflow-hidden min-h-[660px] relative z-10">
        
        {/* ================================================================= */}
        {/* LEFT HERO & CORPORATE WORLD SHOWCASE PANEL (Vibrant Bold Theme)   */}
        {/* ================================================================= */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#172554] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden text-white border-b lg:border-b-0 lg:border-r border-slate-800">
          
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 blur-3xl pointer-events-none" />

          {/* Top Brand Logo & Header */}
          <div className="relative z-10 space-y-4">
            <CorporateGlobeLogo size="lg" textClassName="text-white" />

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Next-Gen Enterprise Workforce Hub</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display leading-tight">
              Empowering global teams with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
                precision, trust & speed.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md font-medium">
              Seamlessly unify attendance punch clocks, automated versioned payroll dispatches, quota-balanced leaves, and tamper-evident audit logs across worldwide operations.
            </p>
          </div>

          {/* Center Interactive Live Pulse Cards (Bold Highlights) */}
          <div className="my-8 space-y-3 relative z-10">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/80 to-blue-950/80 border border-blue-500/30 backdrop-blur-md flex items-center justify-between hover:border-blue-400/50 transition-all group shadow-lg">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20">
                  <Clock className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    Live Geofenced Punch Clock
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <div className="text-[11px] text-slate-300">Compound unique constraints &bull; 0% duplicate entries</div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase border border-emerald-500/30">
                Real-Time
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/80 to-indigo-950/80 border border-indigo-500/30 backdrop-blur-md flex items-center justify-between hover:border-indigo-400/50 transition-all group shadow-lg">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                  <CreditCard className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-white">Versioned Salary Architecture</div>
                  <div className="text-[11px] text-slate-300">Immutable compensation logs &bull; 1-click payslips</div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold uppercase border border-indigo-500/30">
                Audited
              </span>
            </div>
          </div>

          {/* Bottom Trust & Compliance Footer */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Bcrypt Cost 12 &bull; JWT Token Rotation</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-blue-300 font-bold bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-500/20">
              <Globe2 className="w-3.5 h-3.5" />
              <span>PostgreSQL 3NF Cloud</span>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* RIGHT AUTH CARD (Bright Bold Office Aesthetics)                   */}
        {/* ================================================================= */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between bg-white">
          <div className="space-y-6">
            
            {/* Top Switcher Segmented Control */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight font-display">
                  {mode === 'signin' ? 'Sign in to your workplace' : 'Create new corporate profile'}
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {mode === 'signin'
                    ? 'Access your employee portal, punch clock & salary ledger'
                    : 'Join your organization directory on Dayflow HRMS'}
                </p>
              </div>

              {/* Segmented Pill */}
              <div className="flex p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs shrink-0 shadow-inner">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    mode === 'signin'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
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
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                    Corporate Email or Staff Badge ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-blue-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. admin@dayflow.internal or EMP-0001"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                      Account Password
                    </label>
                    <span className="text-[11px] text-blue-600 hover:text-blue-700 cursor-pointer font-bold">
                      Forgot Password?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-blue-500 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-1 font-medium">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4" />
                    <span>Keep me signed in on this workstation</span>
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold shadow-lg shadow-blue-600/25 py-3 text-sm"
                  isLoading={loading}
                  rightIcon={<ArrowRight className="w-4 h-4 stroke-[2.5]" />}
                >
                  Sign In to Enterprise Workspace
                </Button>
              </form>
            )}

            {/* FORM: REGISTER / SIGN UP */}
            {mode === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Alex"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Chen"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Corporate Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@dayflow.internal"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Staff Badge ID</label>
                    <input
                      type="text"
                      required
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      placeholder="EMP-1008"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
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
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Job Title / Designation</label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Senior Software Architect"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">Password</label>
                    <span className="text-[10px] text-slate-500 font-medium">Min 8 chars, 1 uppercase, 1 number</span>
                  </div>
                  <input
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="e.g. Dayflow@2026"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold shadow-md shadow-blue-600/25 mt-1"
                  isLoading={loading}
                  rightIcon={<ArrowRight className="w-4 h-4 stroke-[2.5]" />}
                >
                  Create Corporate Account
                </Button>
              </form>
            )}
          </div>

          {/* Quick-Fill Persona Selector (Convenience for testing) */}
          <div className="pt-6 border-t border-slate-100 mt-6 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              <span className="flex items-center gap-1 text-blue-700">
                <Zap className="w-3.5 h-3.5 fill-current" /> Instant Test Personas
              </span>
              <span className="font-semibold lowercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">pwd: Password@123</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setQuickFill('admin@dayflow.internal', 'EMP-0001')}
                className="p-2.5 rounded-2xl bg-gradient-to-b from-blue-50 to-indigo-50/50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 hover:border-blue-400 text-left transition-all group cursor-pointer shadow-sm"
              >
                <div className="font-extrabold text-xs text-blue-900 group-hover:text-blue-700 flex items-center gap-1">
                  👑 Admin
                </div>
                <div className="text-[10px] font-semibold text-slate-600 truncate">Sarah Connor</div>
              </button>

              <button
                type="button"
                onClick={() => setQuickFill('hr@dayflow.internal', 'EMP-0002')}
                className="p-2.5 rounded-2xl bg-gradient-to-b from-purple-50 to-indigo-50/50 hover:from-purple-100 hover:to-indigo-100 border border-purple-200 hover:border-purple-400 text-left transition-all group cursor-pointer shadow-sm"
              >
                <div className="font-extrabold text-xs text-purple-900 group-hover:text-purple-700 flex items-center gap-1">
                  💼 HR Lead
                </div>
                <div className="text-[10px] font-semibold text-slate-600 truncate">Marcus Vance</div>
              </button>

              <button
                type="button"
                onClick={() => setQuickFill('alex.chen@dayflow.internal', 'EMP-1001')}
                className="p-2.5 rounded-2xl bg-gradient-to-b from-emerald-50 to-teal-50/50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200 hover:border-emerald-400 text-left transition-all group cursor-pointer shadow-sm"
              >
                <div className="font-extrabold text-xs text-emerald-900 group-hover:text-emerald-700 flex items-center gap-1">
                  💻 Engineer
                </div>
                <div className="text-[10px] font-semibold text-slate-600 truncate">Alex Chen</div>
              </button>

              <button
                type="button"
                onClick={() => setQuickFill('elena.rodriguez@dayflow.internal', 'EMP-1002')}
                className="p-2.5 rounded-2xl bg-gradient-to-b from-amber-50 to-orange-50/50 hover:from-amber-100 hover:to-orange-100 border border-amber-200 hover:border-amber-400 text-left transition-all group cursor-pointer shadow-sm"
              >
                <div className="font-extrabold text-xs text-amber-900 group-hover:text-amber-700 flex items-center gap-1">
                  🎨 Designer
                </div>
                <div className="text-[10px] font-semibold text-slate-600 truncate">Elena Rodriguez</div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
