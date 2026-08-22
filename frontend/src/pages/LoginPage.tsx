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
    <div className="min-h-screen bg-[#f8fafd] dark:bg-[#131314] text-slate-900 dark:text-white flex flex-col justify-between selection:bg-[#c2e7ff] selection:text-[#001d35] font-sans relative">
      
      {/* Top Google Header */}
      <header className="flex items-center justify-between px-6 sm:px-12 py-4 bg-transparent">
        <CorporateGlobeLogo size="sm" />

        <button
          onClick={() => setIsAIOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#1e1f20] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-xs cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#4285F4] animate-pulse" />
          <span>Ask Gemini AI</span>
        </button>
      </header>

      {/* Centered Google Accounts Style Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-[440px] bg-white dark:bg-[#1e1f20] border border-slate-200/90 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-lg shadow-slate-200/50 dark:shadow-none transition-all">
          
          {/* Logo & Headline */}
          <div className="text-center mb-6 space-y-2">
            <div className="flex justify-center mb-4">
              <CorporateGlobeLogo size="md" showText={false} />
            </div>
            <h1 className="text-2xl font-normal text-slate-900 dark:text-white tracking-tight">
              {mode === 'signin' ? 'Sign in' : 'Create an account'}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              to continue to <span className="font-semibold text-slate-900 dark:text-white">WorkNest Workspace</span>
            </p>
          </div>

          {/* Segmented Switcher */}
          <div className="flex p-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs mb-6">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 py-1.5 rounded-full font-semibold transition-all cursor-pointer text-center ${
                mode === 'signin'
                  ? 'bg-white dark:bg-[#28292a] text-[#1a73e8] dark:text-[#c2e7ff] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-1.5 rounded-full font-semibold transition-all cursor-pointer text-center ${
                mode === 'signup'
                  ? 'bg-white dark:bg-[#28292a] text-[#1a73e8] dark:text-[#c2e7ff] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Create account
            </button>
          </div>

          {/* SIGN IN FORM */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email or Employee ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="admin@dayflow.internal or EMP-0001"
                    className="w-full bg-transparent border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 transition-all font-normal text-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                  <span className="text-xs text-[#1a73e8] dark:text-[#8ab4f8] hover:underline cursor-pointer font-medium">
                    Forgot password?
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
                    className="w-full bg-transparent border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 transition-all font-normal text-xs"
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
                  className="w-full py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? 'Authenticating...' : 'Next'}
                  <ArrowRight className="w-4 h-4" />
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
                    placeholder="Alex"
                    className="w-full bg-transparent border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#1a73e8]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Chen"
                    className="w-full bg-transparent border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#1a73e8]"
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
                  className="w-full bg-transparent border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#1a73e8]"
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
                    className="w-full bg-transparent border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#1a73e8]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#1a73e8]"
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
                  placeholder="Software Engineer"
                  className="w-full bg-transparent border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#1a73e8]"
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
                  className="w-full bg-transparent border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#1a73e8]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? 'Creating...' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Quick-Fill Test Personas */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 mt-6 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
              <span className="flex items-center gap-1 text-[#1a73e8] dark:text-[#8ab4f8]">
                <Zap className="w-3.5 h-3.5 fill-current" /> Instant Google Test Personas
              </span>
              <span className="font-mono text-[10px]">Password@123</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
              <button
                type="button"
                onClick={() => setQuickFill('admin@dayflow.internal')}
                className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-800 hover:border-blue-300 transition-all group cursor-pointer"
              >
                <div className="font-bold text-[11px] text-slate-900 dark:text-white group-hover:text-[#1a73e8]">👑 Admin</div>
                <div className="text-[10px] text-slate-500 truncate">Sarah Connor</div>
              </button>

              <button
                type="button"
                onClick={() => setQuickFill('hr@dayflow.internal')}
                className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-800 hover:border-purple-300 transition-all group cursor-pointer"
              >
                <div className="font-bold text-[11px] text-slate-900 dark:text-white group-hover:text-purple-600">💼 HR Lead</div>
                <div className="text-[10px] text-slate-500 truncate">Marcus Vance</div>
              </button>

              <button
                type="button"
                onClick={() => setQuickFill('alex.chen@dayflow.internal')}
                className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 transition-all group cursor-pointer"
              >
                <div className="font-bold text-[11px] text-slate-900 dark:text-white group-hover:text-emerald-600">💻 Engineer</div>
                <div className="text-[10px] text-slate-500 truncate">Alex Chen</div>
              </button>

              <button
                type="button"
                onClick={() => setQuickFill('elena.rodriguez@dayflow.internal')}
                className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-800 hover:border-amber-300 transition-all group cursor-pointer"
              >
                <div className="font-bold text-[11px] text-slate-900 dark:text-white group-hover:text-amber-600">🎨 Designer</div>
                <div className="text-[10px] text-slate-500 truncate">Elena Rodriguez</div>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Google Footer */}
      <footer className="px-6 sm:px-12 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 border-t border-slate-200/60 dark:border-slate-800/60">
        <span>&copy; 2026 Google Workspace Tier &bull; WorkNest HRMS</span>
        <div className="flex items-center gap-6 mt-2 sm:mt-0">
          <a href="#" className="hover:underline">Help</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
        </div>
      </footer>

      {/* AI Copilot Drawer */}
      <AICopilotDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
};
