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
  Eye,
  EyeOff,
  Sparkles,
  Zap,
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
      // Handled in toast
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
      // Handled in toast
    } finally {
      setLoading(false);
    }
  };

  const setQuickFill = (roleEmail: string) => {
    setMode('signin');
    setIdentifier(roleEmail);
    setPassword('Password@123');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col justify-between selection:bg-purple-500 selection:text-white font-sans relative overflow-hidden">
      
      {/* Background Ambient Purple & Blue Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-purple-600/20 via-blue-600/15 to-transparent rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 right-10 w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[140px]" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-12 py-5 border-b border-white/5 bg-[#0b0f19]/80 backdrop-blur-md">
        <CorporateGlobeLogo size="sm" />

        <button
          onClick={() => setIsAIOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-xs font-semibold text-purple-300 transition-all cursor-pointer shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span>WorkNest AI Copilot</span>
        </button>
      </header>

      {/* Centered Direct Microsoft Outlook / 365 Style Sign-In Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-[440px] bg-[#111827]/95 backdrop-blur-2xl border border-slate-800 hover:border-purple-500/30 rounded-3xl p-7 sm:p-9 shadow-[0_20px_70px_rgba(0,0,0,0.7)] transition-all">
          
          {/* Card Brand Header */}
          <div className="text-center mb-6 space-y-2">
            <div className="flex justify-center mb-3">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-blue-600/20 border border-purple-500/30 shadow-inner">
                <CorporateGlobeLogo size="sm" showText={false} />
              </div>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">
              {mode === 'signin' ? 'Sign in to WorkNest' : 'Create Staff Profile'}
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              {mode === 'signin' ? 'Enterprise workforce and self-service workspace' : 'Join your organization directory'}
            </p>
          </div>

          {/* Segmented Sign In / Register Tab */}
          <div className="flex p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs mb-6">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer text-center ${
                mode === 'signin'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer text-center ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* SIGN IN FORM */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[10px]">
                  Corporate Email or Staff Badge ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. admin@dayflow.internal or EMP-0001"
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 font-medium transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block font-bold text-slate-300 uppercase tracking-wider text-[10px]">Password</label>
                  <span className="text-[11px] text-purple-400 hover:text-purple-300 cursor-pointer font-semibold">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 font-medium transition-all"
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
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? 'Signing In...' : 'Sign In'}
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
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 font-medium"
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
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 font-medium"
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
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 font-medium"
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
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-purple-500 font-medium"
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
                <label className="block font-bold text-slate-300 mb-1">Designation</label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Senior Software Architect"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          )}

          {/* Quick-Fill Test Personas */}
          <div className="pt-5 border-t border-slate-800 mt-6 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1 text-purple-400">
                <Zap className="w-3 h-3 fill-current" /> Instant Test Personas
              </span>
              <span className="font-mono text-slate-500">Password@123</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
              <button
                type="button"
                onClick={() => setQuickFill('admin@dayflow.internal')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-500/40 transition-all group cursor-pointer text-left"
              >
                <div className="font-bold text-[11px] text-white group-hover:text-purple-300">👑 Admin</div>
                <div className="text-[10px] text-slate-400 truncate">Sarah Connor</div>
              </button>

              <button
                type="button"
                onClick={() => setQuickFill('hr@dayflow.internal')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-blue-950/60 border border-slate-800 hover:border-blue-500/40 transition-all group cursor-pointer text-left"
              >
                <div className="font-bold text-[11px] text-white group-hover:text-blue-300">💼 HR Lead</div>
                <div className="text-[10px] text-slate-400 truncate">Marcus Vance</div>
              </button>

              <button
                type="button"
                onClick={() => setQuickFill('alex.chen@dayflow.internal')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/40 transition-all group cursor-pointer text-left"
              >
                <div className="font-bold text-[11px] text-white group-hover:text-emerald-300">💻 Engineer</div>
                <div className="text-[10px] text-slate-400 truncate">Alex Chen</div>
              </button>

              <button
                type="button"
                onClick={() => setQuickFill('elena.rodriguez@dayflow.internal')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-500/40 transition-all group cursor-pointer text-left"
              >
                <div className="font-bold text-[11px] text-white group-hover:text-amber-300">🎨 Designer</div>
                <div className="text-[10px] text-slate-400 truncate">Elena Rodriguez</div>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 border-t border-white/5 text-center text-xs text-slate-500 font-medium">
        <span>&copy; 2026 WorkNest &bull; Microsoft 365 / Outlook Enterprise Tier Workspace</span>
      </footer>

      {/* AI Copilot Drawer */}
      <AICopilotDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
};
