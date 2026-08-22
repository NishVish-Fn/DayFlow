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
  Database,
  Shield,
  Layers,
  Terminal,
  Activity,
  Code2,
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
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-[#00f0ff] selection:text-slate-950 font-sans relative overflow-x-hidden">
      
      {/* Background Dot-Matrix Mesh Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-35">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#00f0ff]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#00ffc2]/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Neo Navigation Bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 sm:px-12 h-16 border-b border-white/5 bg-[#07090e]/90 backdrop-blur-md">
        <CorporateGlobeLogo size="sm" />

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-400">
          <a href="#primitives" className="hover:text-white transition-colors">Primitives</a>
          <a href="#telemetry" className="hover:text-white transition-colors">Autoscaling</a>
          <a href="#branching" className="hover:text-white transition-colors">Workflows</a>
          <button onClick={() => setIsAIOpen(true)} className="hover:text-[#00f0ff] transition-colors flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#00f0ff]" /> AI Gateway
          </button>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAIOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-all cursor-pointer hover:border-[#00f0ff]/40"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>AI Copilot</span>
          </button>

          <a
            href="#auth-card"
            className="px-4 py-1.5 rounded-full bg-[#00f0ff] hover:bg-[#33f3ff] text-slate-950 text-xs font-extrabold transition-all shadow-sm shadow-[#00f0ff]/30 cursor-pointer"
          >
            Sign In
          </a>
        </div>
      </header>

      {/* ================================================================= */}
      {/* HERO SECTION: GOOGLE-WORLD WIREFRAME GLOBE & NEO-SQL HEADLINE     */}
      {/* ================================================================= */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16 text-center flex flex-col items-center">
        
        {/* Glowing Google-World Wireframe Globe Hero Icon */}
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full bg-[#00f0ff]/10 flex items-center justify-center p-2.5 shadow-[0_0_30px_rgba(0,240,255,0.4)] border border-[#00f0ff]/40">
            <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="20" stroke="#00f0ff" strokeWidth="1.5" strokeOpacity="0.9" />
              <ellipse cx="24" cy="24" rx="9" ry="20" stroke="#00f0ff" strokeWidth="1.25" strokeOpacity="0.8" />
              <ellipse cx="24" cy="24" rx="16" ry="20" stroke="#00f0ff" strokeWidth="0.9" strokeOpacity="0.4" strokeDasharray="3 2" />
              <line x1="4" y1="24" x2="44" y2="24" stroke="#00f0ff" strokeWidth="1.25" strokeOpacity="0.8" />
              <ellipse cx="24" cy="24" rx="20" ry="9" stroke="#00f0ff" strokeWidth="1" strokeOpacity="0.6" />
              <circle cx="24" cy="24" r="2.5" fill="#00ffc2" />
            </svg>
          </div>
        </div>

        {/* Databricks / Neo-SQL Style Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] font-mono text-[11px] font-bold tracking-wider uppercase mb-5">
          <span className="w-2 h-2 rounded-full bg-[#00ffc2] animate-pulse" />
          <span>WORKNEST IS POWERED BY NEXT-GEN AI WORKFORCE ENGINE</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-display leading-[1.15] max-w-4xl">
          The workforce platform for apps and agents, <br className="hidden sm:inline" />
          built to scale on <span className="text-[#00f0ff]">Neo-Workforce</span>.
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-slate-400 mt-4 max-w-2xl font-medium leading-relaxed">
          Serverless HRMS and workforce operating system with predictive burnout telemetry and autonomous open-source AI models. Powered by WorkNest.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-7">
          <a
            href="#auth-card"
            className="text-xs font-bold text-white hover:text-[#00f0ff] flex items-center gap-1.5 transition-colors"
          >
            <span>Get started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          <a
            href="#primitives"
            className="px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono font-bold text-slate-200 transition-all hover:border-[#00f0ff]/40"
          >
            Read the docs
          </a>
        </div>
      </section>

      {/* ================================================================= */}
      {/* CORE PRIMITIVES CARDS (Matching Neo-SQL Databricks Style)         */}
      {/* ================================================================= */}
      <section id="primitives" className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-4">
          <h2 className="text-base font-bold text-white font-display">Core Primitives</h2>
          <p className="text-xs text-slate-500 font-medium">Workforce cloud primitives for the AI Engineering era.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Card 1: Lakebase Neo-Workforce */}
          <div className="bg-[#0e1217] border border-white/10 hover:border-[#00f0ff]/40 rounded-2xl p-5 relative overflow-hidden transition-all group flex flex-col justify-between min-h-[190px]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] font-bold text-[#00ffc2] bg-[#00ffc2]/10 px-2 py-0.5 rounded border border-[#00ffc2]/20">
                  01 // 06
                </span>
                <Database className="w-5 h-5 text-slate-700 group-hover:text-[#00f0ff] transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-white">Lakebase Neo-Workforce</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Serverless database with instant branching. Separates compute and storage for infinite employee scale.
              </p>
            </div>
            <div className="font-mono text-[11px] text-[#00f0ff] bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 mt-4">
              $ worknest init db
            </div>
          </div>

          {/* Card 2: Managed Auth */}
          <div className="bg-[#0e1217] border border-white/10 hover:border-[#00f0ff]/40 rounded-2xl p-5 relative overflow-hidden transition-all group flex flex-col justify-between min-h-[190px]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  02 // SEC
                </span>
                <Shield className="w-5 h-5 text-slate-700 group-hover:text-[#00ffc2] transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-white">Managed Auth & RBAC</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Enterprise JWT token rotation, cryptographic hashing, and role-based permissions built into your database.
              </p>
            </div>
            <div className="font-mono text-[11px] text-slate-400 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 mt-4">
              Bcrypt Cost 12 &bull; 0% Leakage
            </div>
          </div>

          {/* Card 3: AI Gateway */}
          <div className="bg-[#0e1217] border border-[#00f0ff]/40 hover:border-[#00f0ff] rounded-2xl p-5 relative overflow-hidden transition-all group flex flex-col justify-between min-h-[190px] shadow-[0_0_25px_rgba(0,240,255,0.08)]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] font-bold text-[#00f0ff] bg-[#00f0ff]/10 px-2 py-0.5 rounded border border-[#00f0ff]/30">
                  03 // AI
                </span>
                <Sparkles className="w-5 h-5 text-[#00f0ff]" />
              </div>
              <h3 className="text-sm font-bold text-[#00f0ff] flex items-center gap-1.5">
                AI Gateway & Copilot
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Meta LLaMA 3.3 & DeepSeek-R1 multi-model inference optimized for autonomous HR operations.
              </p>
            </div>
            <div className="font-mono text-[11px] text-[#00ffc2] bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 mt-4">
              One API for all models. &lt; 15ms
            </div>
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* INTERACTIVE WORKNEST AUTHENTICATION PORTAL                        */}
      {/* ================================================================= */}
      <section id="auth-card" className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-[#0e1217] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                {mode === 'signin' ? 'Sign In to WorkNest' : 'Create Staff Account'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {mode === 'signin' ? 'Enter corporate credentials to access workforce portal' : 'Join the WorkNest organization directory'}
              </p>
            </div>

            {/* Segmented Switcher (Design system style from reference image) */}
            <div className="flex p-1 rounded-xl bg-black/50 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-[#00f0ff] text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-[#00f0ff] text-slate-950 shadow-sm'
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
                  Corporate Email or Badge ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#00f0ff] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. admin@dayflow.internal or EMP-0001"
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#00f0ff] focus:ring-2 focus:ring-[#00f0ff]/20 font-semibold transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block font-bold text-slate-300 uppercase tracking-wider text-[11px]">Password</label>
                  <span className="text-[11px] text-[#00f0ff] hover:underline cursor-pointer font-semibold">
                    Forgot Password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#00f0ff] absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#00f0ff] focus:ring-2 focus:ring-[#00f0ff]/20 font-semibold transition-all"
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

              {/* Primary Cyan Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#00f0ff] hover:bg-[#38f8ff] text-slate-950 font-extrabold py-3 text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#00f0ff]/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
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
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-[#00f0ff]"
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
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-[#00f0ff]"
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
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-[#00f0ff]"
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
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-2 text-white font-semibold focus:outline-none focus:border-[#00f0ff]"
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
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-[#00f0ff]"
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
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#00ffc2] hover:bg-[#38ffd0] text-slate-950 font-extrabold py-2.5 text-xs uppercase tracking-wider transition-all shadow-md shadow-[#00ffc2]/25 flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                {loading ? 'Creating...' : 'Create Account'}
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          )}

          {/* Quick-Fill Persona Selector */}
          <div className="pt-4 border-t border-white/10 mt-5 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1 text-[#00f0ff]">
                <Zap className="w-3 h-3 fill-current" /> Instant Test Personas
              </span>
              <span>pwd: Password@123</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
              <button
                type="button"
                onClick={() => setQuickFill('admin@dayflow.internal', 'EMP-0001')}
                className="p-2 rounded-xl bg-white/[0.03] hover:bg-[#00f0ff]/10 border border-white/10 hover:border-[#00f0ff]/40 transition-all group cursor-pointer"
              >
                <div className="font-bold text-[11px] text-white group-hover:text-[#00f0ff]">👑 Admin</div>
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
                className="p-2 rounded-xl bg-white/[0.03] hover:bg-[#00ffc2]/10 border border-white/10 hover:border-[#00ffc2]/40 transition-all group cursor-pointer"
              >
                <div className="font-bold text-[11px] text-white group-hover:text-[#00ffc2]">💻 Engineer</div>
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
      </section>

      {/* ================================================================= */}
      {/* LOWER SECTION: ADVANCED TELEMETRY & INSTANT BRANCHING SHOWCASE   */}
      {/* ================================================================= */}
      <section id="telemetry" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 border-t border-white/5">
        
        {/* Autoscaling Card */}
        <div className="bg-[#0e1217] border border-white/10 rounded-3xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-6">
          <div className="lg:col-span-6 space-y-3">
            <span className="font-mono text-[10px] font-bold text-[#00f0ff] uppercase tracking-wider">PERFORMANCE</span>
            <h3 className="text-2xl font-bold text-white font-display">Advanced Autoscaling & Telemetry.</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Keep workforce operations running without worrying about capacity. WorkNest autoscales CPU, memory, and database connection pools for real-time punch clocks.
            </p>
            <div className="flex gap-8 pt-3">
              <div>
                <div className="text-xl font-mono font-bold text-white">54,210</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Degradations Prevented</div>
              </div>
              <div>
                <div className="text-xl font-mono font-bold text-[#00ffc2]">Zero</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Overprovisioning</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-black/60 border border-white/10 rounded-2xl p-5 text-center relative overflow-hidden">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-white/5 pb-2 mb-4">
              <span>SERVER TRAFFIC LOAD (84cps)</span>
              <span className="text-[#00ffc2]">● 100% HEALTH</span>
            </div>
            <div className="h-32 flex items-center justify-center text-xs font-mono text-[#00f0ff]/80 bg-[#00f0ff]/5 rounded-xl border border-[#00f0ff]/20">
              [ Real-Time Workforce Telemetry Graph Active ]
            </div>
          </div>
        </div>

        {/* Instant Branching Card */}
        <div id="branching" className="bg-[#0e1217] border border-white/10 rounded-3xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 bg-black/60 border border-white/10 rounded-2xl p-5 font-mono text-xs text-slate-300 space-y-2">
            <div className="text-slate-500">// Create an isolated workforce branch instantly</div>
            <div className="text-[#00f0ff]">$ worknest branch create payroll-q3</div>
            <div className="text-slate-400 pl-2">&bull; Branch created in 0.8s</div>
            <div className="text-slate-400 pl-2">&bull; Copied relational 3NF schema</div>
            <div className="text-slate-400 pl-2">&bull; Anonymized PII tokens</div>
            <div className="text-[#00ffc2] pt-2">// Ready for staging simulation</div>
          </div>

          <div className="lg:col-span-6 space-y-3">
            <span className="font-mono text-[10px] font-bold text-[#00ffc2] uppercase tracking-wider">WORKFLOW</span>
            <h3 className="text-2xl font-bold text-white font-display">Instant Shift & Policy Branching.</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Develop and test new compensation bands, PTO carry-forward policies, and shift rosters with isolated copies of your organizational schema.
            </p>
            <div className="space-y-2 pt-2 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00ffc2]" /> Copy-on-write simulation engines
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00ffc2]" /> Automatic PII masking for safe staging
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-xs text-slate-500 font-medium">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CorporateGlobeLogo size="sm" />
            <span>&copy; 2026 WorkNest Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <a href="#primitives" className="hover:text-white">Primitives</a>
            <a href="#telemetry" className="hover:text-white">Telemetry</a>
            <a href="#auth-card" className="hover:text-white">Sign In</a>
            <span className="text-[#00f0ff] font-mono">v2.6.0-prod</span>
          </div>
        </div>
      </footer>

      {/* Dayflow AI Copilot Drawer */}
      <AICopilotDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
};
