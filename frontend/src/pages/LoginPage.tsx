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
  Cpu,
  Flame,
} from 'lucide-react';
import { CorporateGlobeLogo } from '../components/common/CorporateGlobeLogo';
import { AICopilotDrawer } from '../components/ai/AICopilotDrawer';

export const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [isAIOpen, setIsAIOpen] = useState(false);

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
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950 font-sans relative overflow-x-hidden">
      
      {/* Background Micro-Dot Mesh & Cyber Gradients */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-orange-600/12 rounded-full blur-[140px]" />
      </div>

      {/* Top Cyber Navigation Bar */}
      <header className="relative z-20 flex items-center justify-between px-6 sm:px-12 py-6 border-b border-white/5 bg-[#07090e]/80 backdrop-blur-md">
        <CorporateGlobeLogo size="md" />

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAIOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-slate-200 transition-all cursor-pointer shadow-sm hover:border-cyan-400/40"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Launch AI Copilot ↗</span>
          </button>
        </div>
      </header>

      {/* ================================================================= */}
      {/* MAIN HERO: CELESTIAL AI CONSTELLATION SPHERE & HEADLINE           */}
      {/* ================================================================= */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full flex flex-col items-center text-center">
        
        {/* Constellation Glow Aura Circle */}
        <div className="relative w-full max-w-3xl flex flex-col items-center justify-center pt-2 pb-8">
          
          {/* Subtle Wireframe Constellation Sphere Graphic in Center */}
          <div className="absolute inset-0 -top-12 flex items-center justify-center pointer-events-none opacity-30 select-none">
            <svg viewBox="0 0 500 500" className="w-[440px] h-[440px] animate-[spin_60s_linear_infinite]">
              <circle cx="250" cy="250" r="220" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
              <ellipse cx="250" cy="250" rx="220" ry="80" stroke="#38bdf8" strokeWidth="1" />
              <ellipse cx="250" cy="250" rx="80" ry="220" stroke="#f97316" strokeWidth="1" strokeOpacity="0.7" />
              <line x1="250" y1="30" x2="250" y2="470" stroke="#38bdf8" strokeWidth="1" />
              <line x1="30" y1="250" x2="470" y2="250" stroke="#38bdf8" strokeWidth="1" />
            </svg>
          </div>

          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-cyan-300 text-xs font-bold tracking-wide uppercase mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>• CURRENTLY BUILDING AI WORKFORCE OS</span>
          </div>

          {/* Bold Multicolored Headline Matching Reference Image */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-display leading-[1.1] max-w-4xl">
            Building AI Systems <br className="hidden sm:inline" />
            That Make <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300">AI</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300">
              Unbreakable
            </span>
          </h1>

          {/* High-Impact Subtitle */}
          <p className="text-sm sm:text-base text-slate-400 mt-5 max-w-2xl font-medium leading-relaxed">
            Dayflow HRMS &bull; Autonomous Workforce Telemetry &bull; Predictive Burnout Intelligence &bull; Open-Source Foundation Models (LLaMA 3.3 & DeepSeek-R1)
          </p>

          {/* Action CTA Pill Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
            <a
              href="#auth-card"
              className="px-7 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-950 text-xs sm:text-sm font-extrabold transition-all shadow-lg hover:shadow-cyan-500/20 cursor-pointer flex items-center gap-2"
            >
              <span>Sign In to Workplace ↓</span>
            </a>

            <button
              type="button"
              onClick={() => setIsAIOpen(true)}
              className="px-7 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 hover:border-cyan-400/50"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Ask Open-Source AI ↗</span>
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* INTERACTIVE AUTHENTICATION CARD (Cyber Glass Aesthetic)          */}
        {/* ================================================================= */}
        <div
          id="auth-card"
          className="w-full max-w-md mt-12 bg-[#0c1017]/90 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-left"
        >
          {/* Switcher Tab */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                {mode === 'signin' ? 'Sign In to Workspace' : 'Create Staff Profile'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {mode === 'signin' ? 'Access your punch clock & salary ledger' : 'Join the Dayflow organization directory'}
              </p>
            </div>

            {/* Segmented Control */}
            <div className="flex p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* SIGN IN FORM */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                  Corporate Email or Staff Badge ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. admin@dayflow.internal or EMP-0001"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all font-semibold"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block font-bold text-slate-300 uppercase tracking-wider text-[11px]">Password</label>
                  <span className="text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer font-semibold">
                    Forgot Password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold py-3 text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? 'Authenticating...' : 'Sign In to Workplace'}
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          )}

          {/* SIGN UP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Alex"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Chen"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Corporate Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@dayflow.internal"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Badge ID</label>
                  <input
                    type="text"
                    required
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="EMP-1008"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-2 text-white font-semibold focus:outline-none focus:border-cyan-400"
                  >
                    <option value="ENGINEERING">Engineering</option>
                    <option value="PRODUCT">Product</option>
                    <option value="DESIGN">Design</option>
                    <option value="HUMAN_RESOURCES">HR Management</option>
                    <option value="MARKETING">Marketing</option>
                    <option value="SALES">Sales</option>
                    <option value="FINANCE">Finance</option>
                    <option value="OPERATIONS">Operations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Job Designation</label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Senior Software Architect"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Min 8 chars, 1 capital, 1 number"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold py-2.5 text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                {loading ? 'Creating...' : 'Create Account'}
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          )}

          {/* Quick-Fill Persona Selector */}
          <div className="pt-4 border-t border-white/10 mt-5 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1 text-cyan-400">
                <Zap className="w-3 h-3 fill-current" /> Instant Test Personas
              </span>
              <span className="font-mono text-slate-500">Password@123</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
              <button
                type="button"
                onClick={() => setQuickFill('admin@dayflow.internal', 'EMP-0001')}
                className="p-2 rounded-xl bg-white/[0.03] hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-400/40 transition-all group cursor-pointer"
              >
                <div className="font-bold text-[11px] text-white group-hover:text-cyan-300">👑 Admin</div>
                <div className="text-[10px] text-slate-400 truncate">Sarah Connor</div>
              </button>

              <button
                type="button"
                onClick={() => setQuickFill('hr@dayflow.internal', 'EMP-0002')}
                className="p-2 rounded-xl bg-white/[0.03] hover:bg-purple-500/10 border border-white/10 hover:border-purple-400/40 transition-all group cursor-pointer"
              >
                <div className="font-bold text-[11px] text-white group-hover:text-purple-300">💼 HR Lead</div>
                <div className="text-[10px] text-slate-400 truncate">Marcus Vance</div>
              </button>

              <button
                type="button"
                onClick={() => setQuickFill('alex.chen@dayflow.internal', 'EMP-1001')}
                className="p-2 rounded-xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-400/40 transition-all group cursor-pointer"
              >
                <div className="font-bold text-[11px] text-white group-hover:text-emerald-300">💻 Engineer</div>
                <div className="text-[10px] text-slate-400 truncate">Alex Chen</div>
              </button>

              <button
                type="button"
                onClick={() => setQuickFill('elena.rodriguez@dayflow.internal', 'EMP-1002')}
                className="p-2 rounded-xl bg-white/[0.03] hover:bg-orange-500/10 border border-white/10 hover:border-orange-400/40 transition-all group cursor-pointer"
              >
                <div className="font-bold text-[11px] text-white group-hover:text-orange-300">🎨 Designer</div>
                <div className="text-[10px] text-slate-400 truncate">Elena Rodriguez</div>
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* Cyber Footer */}
      <footer className="relative z-20 py-6 border-t border-white/5 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 Dayflow HRMS &bull; Autonomous Workforce Operating System</span>
          <span className="font-mono text-[11px] text-slate-400">PostgreSQL 3NF &bull; LLaMA 3.3 70B &bull; DeepSeek-R1</span>
        </div>
      </footer>

      {/* Dayflow AI Copilot Drawer */}
      <AICopilotDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
};
