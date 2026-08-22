import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  Shield,
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
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] text-slate-900 dark:text-[#f5f5f7] flex flex-col justify-between selection:bg-[#0071e3]/20 selection:text-[#0071e3] font-sans relative antialiased">
      
      {/* Background Soft Mesh Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-[#0071e3]/10 via-[#34a853]/5 to-transparent rounded-full blur-[100px]" />
      </div>

      {/* Top Apple / Google Bar */}
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-12 py-4 bg-transparent">
        <CorporateGlobeLogo size="sm" />

        <button
          onClick={() => setIsAIOpen(true)}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 border border-black/5 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all shadow-xs backdrop-blur-md cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#0071e3] dark:text-[#2997ff] animate-pulse" />
          <span>WorkNest AI</span>
        </button>
      </header>

      {/* Centered Apple ID / Google Workspace Glass Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-[420px] bg-white/80 dark:bg-[#161618]/85 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-3xl p-8 sm:p-9 shadow-[0_4px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_40px_rgba(0,0,0,0.6)] transition-all">
          
          {/* Card Brand Header */}
          <div className="text-center mb-6 space-y-1.5">
            <div className="flex justify-center mb-3">
              <CorporateGlobeLogo size="md" showText={false} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {mode === 'signin' ? 'Sign in to WorkNest' : 'Create your Profile'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
              {mode === 'signin' ? 'Access your employee workspace & services' : 'Setup your credentials'}
            </p>
          </div>

          {/* Apple Segmented Switcher */}
          <div className="flex p-1 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] text-xs mb-6">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 py-1.5 rounded-xl font-semibold transition-all cursor-pointer text-center ${
                mode === 'signin'
                  ? 'bg-white dark:bg-[#2c2c2e] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-1.5 rounded-xl font-semibold transition-all cursor-pointer text-center ${
                mode === 'signup'
                  ? 'bg-white dark:bg-[#2c2c2e] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Register
            </button>
          </div>

          {/* SIGN IN FORM */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email or Badge ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="admin@dayflow.internal or EMP-0001"
                    className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 font-normal transition-all text-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">Password</label>
                  <span className="text-xs text-[#0071e3] dark:text-[#2997ff] hover:underline cursor-pointer font-medium">
                    Forgot?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-10 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 font-normal transition-all text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs tracking-wide transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </form>
          )}

          {/* SIGN UP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Sarah"
                    className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Connor"
                    className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Corporate Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@dayflow.internal"
                  className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#0071e3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Badge ID</label>
                  <input
                    type="text"
                    required
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="EMP-1008"
                    className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#0071e3]"
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
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Designation</label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Senior Software Architect"
                  className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#0071e3]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#0071e3]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs tracking-wide transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? 'Creating...' : 'Create Account'}
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </form>
          )}

          {/* Quick-Fill Persona Passkey Cards */}
          <div className="pt-5 border-t border-black/[0.06] dark:border-white/[0.08] mt-6 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
              <span className="flex items-center gap-1 text-[#0071e3] dark:text-[#2997ff]">
                <Zap className="w-3.5 h-3.5 fill-current" /> Fast Passkey Sign-In
              </span>
              <span className="font-mono text-[10px]">Password@123</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
              <button
                type="button"
                onClick={() => setQuickFill('admin@dayflow.internal')}
                className="p-2.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] hover:bg-[#0071e3]/10 dark:hover:bg-[#0071e3]/20 border border-black/[0.05] dark:border-white/[0.08] hover:border-[#0071e3]/30 transition-all group cursor-pointer"
              >
                <div className="font-bold text-[11px] text-slate-900 dark:text-white group-hover:text-[#0071e3]">👑 Admin</div>
                <div className="text-[10px] text-slate-400 truncate">Sarah Connor</div>
              </button>

              <button
                type="button"
                onClick={() => setQuickFill('hr@dayflow.internal')}
                className="p-2.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] hover:bg-purple-500/10 dark:hover:bg-purple-500/20 border border-black/[0.05] dark:border-white/[0.08] hover:border-purple-500/30 transition-all group cursor-pointer"
              >
                <div className="font-bold text-[11px] text-slate-900 dark:text-white group-hover:text-purple-600">💼 HR Lead</div>
                <div className="text-[10px] text-slate-400 truncate">Marcus Vance</div>
              </button>

              <button
                type="button"
                onClick={() => setQuickFill('alex.chen@dayflow.internal')}
                className="p-2.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 border border-black/[0.05] dark:border-white/[0.08] hover:border-emerald-500/30 transition-all group cursor-pointer"
              >
                <div className="font-bold text-[11px] text-slate-900 dark:text-white group-hover:text-emerald-600">💻 Engineer</div>
                <div className="text-[10px] text-slate-400 truncate">Alex Chen</div>
              </button>

              <button
                type="button"
                onClick={() => setQuickFill('elena.rodriguez@dayflow.internal')}
                className="p-2.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] hover:bg-amber-500/10 dark:hover:bg-amber-500/20 border border-black/[0.05] dark:border-white/[0.08] hover:border-amber-500/30 transition-all group cursor-pointer"
              >
                <div className="font-bold text-[11px] text-slate-900 dark:text-white group-hover:text-amber-600">🎨 Designer</div>
                <div className="text-[10px] text-slate-400 truncate">Elena Rodriguez</div>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 sm:px-12 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 border-t border-black/[0.04] dark:border-white/[0.06]">
        <span>&copy; 2026 WorkNest &bull; Apple & Google Enterprise Standard</span>
        <div className="flex items-center gap-6 mt-2 sm:mt-0">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Support</a>
        </div>
      </footer>

      {/* AI Copilot Drawer */}
      <AICopilotDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
};
