import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DarkModeToggle from '../components/common/DarkModeToggle';
import ShimmerButton from '../components/common/ShimmerButton';
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Logo from '../components/common/Logo';

/**
 * Login Component
 * Renders a premium split-screen glassmorphism login interface.
 */
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back to your workspace!', {
        style: {
          background: '#22C55E',
          color: '#FFFFFF',
          fontWeight: 'bold',
        },
        duration: 3000,
      });
      navigate('/');
    } catch (err) {
      let errorMsg = 'Login failed.';
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        errorMsg = err.response.data.errors.map((e) => e.message).join(', ');
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }

      setError(errorMsg);
      toast.error(errorMsg, {
        style: {
          background: '#EF4444',
          color: '#FFFFFF',
          fontWeight: 'bold',
        },
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-tr from-[#EDF2F7] via-[#F8FAFC] to-[#E2E8F0] dark:from-[#05070B] dark:via-[#080C14] dark:to-[#0E1524] relative overflow-x-hidden transition-colors duration-200">

      {/* 1. BRANDING COLUMN (Left Panel) - Visible on large screens */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-[#080C16] via-[#0D1224] to-[#060910] border-r border-white/5 relative overflow-hidden select-none">

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

        {/* Glowing aura spheres */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none animate-float-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none animate-float-reverse" />

        {/* Top: Brand Header */}
        <div className="flex items-center gap-3 relative z-10">
          <Logo className="w-9 h-9 text-primary" />
          <span className="text-base font-extrabold tracking-tight text-white uppercase">
            AURA<span className="text-primary">CRM</span>
          </span>
          <span className="text-[9px] bg-white/50  text-slate-405 px-1.5 py-0.2 rounded font-mono font-semibold uppercase tracking-wider">
            Lite
          </span>
        </div>

        {/* Center: Pitch Value Propositions */}
        <div className="space-y-6 my-auto relative z-10 max-w-md">
          <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            Qualify leads. <br />
            Track performance. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              Close deals faster.
            </span>
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Manage your startup leads, track pipeline stages, and visualize CRM performance with our sleek, high-performance portal.
          </p>

          <div className="space-y-3.5 pt-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={16} className="text-success shrink-0" />
              <span>Real-time Sales Conversion Funnels</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={16} className="text-success shrink-0" />
              <span>Beautiful Glassmorphism Dashboard Cards</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={16} className="text-success shrink-0" />
              <span>Zero setup, fully optimized client experience</span>
            </div>
          </div>
        </div>

        {/* Bottom: Footnote */}
        <div className="text-[10px] text-slate-500 font-mono relative z-10 flex flex-col gap-1">
          <span>&copy; 2026 AuraCRM Systems, Inc. All rights reserved.</span>
          <span className="text-slate-650">
            Developed by{' '}
            <a
              href="https://bhojanapudevaraj.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary dark:text-blue-400 hover:underline font-bold"
            >
              Deva Raj Bhojanapu
            </a>
          </span>
        </div>
      </div>

      {/* 2. LOGIN FORM COLUMN (Right Panel) - Full screen on mobile */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative min-h-screen overflow-y-auto">

        {/* Theme Toggle Positioned in Top Right */}
        <div className="absolute top-4 right-4 z-20">
          <DarkModeToggle />
        </div>

        {/* Dynamic ambient color glows - brighter in light mode, glowing in dark mode */}
        <div className="absolute top-1/6 right-1/6 w-96 h-96 rounded-full bg-blue-300/25 dark:bg-blue-600/15 blur-[120px] pointer-events-none animate-float-slow" />
        <div className="absolute bottom-1/6 left-1/6 w-96 h-96 rounded-full bg-purple-300/20 dark:bg-purple-600/12 blur-[120px] pointer-events-none animate-float-reverse" />

        {/* Floating frosted glass login card */}
        <div className="w-full max-w-md bg-white/45 dark:bg-[#0F131C]/65 backdrop-blur-2xl border border-slate-200/40 dark:border-white/5 p-6 sm:p-8 rounded-3xl shadow-2xl relative z-10 animate-fade-in transition-all duration-200 my-auto">

          {/* Header Mobile Brand details */}
          <div className="flex flex-col items-center text-center mb-8 select-none">
            <div className="w-12 h-12 mb-3 flex items-center justify-center lg:hidden">
              <Logo className="w-11 h-11 text-primary" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 justify-center">
              Welcome back
            </h2>
            <p className="text-xs text-slate-550 dark:text-slate-400 mt-1 max-w-xs">
              Sign in to manage your startup CRM and track daily sales touchpoints.
            </p>
          </div>

          {/* Inline Error alert */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-50/50 dark:bg-red-950/20 border border-red-200/40 dark:border-red-900/30 text-red-650 dark:text-red-400 rounded-xl text-xs mb-6 animate-fade-in">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form fields */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-450 dark:text-slate-550">
                  <Mail size={15} />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10.5 pr-4 py-3 text-xs rounded-xl glass-input text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-450 dark:text-slate-550">
                  <Lock size={15} />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10.5 pr-10 py-3 text-xs rounded-xl glass-input text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-650 dark:text-slate-500 dark:hover:text-slate-350 focus:outline-hidden cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit ShimmerButton */}
            <ShimmerButton
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 shadow-md shadow-primary/10 border border-blue-400/20"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={15} />
                  <span>Sign In</span>
                </>
              )}
            </ShimmerButton>
          </form>

          {/* Credits footer */}
          <div className="mt-8 pt-6 border-t border-slate-200/40 dark:border-white/5 text-center">
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              Developed by{' '}
              <a
                href="https://bhojanapudevaraj.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="font-extrabold text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-blue-400 hover:underline"
              >
                Deva Raj Bhojanapu
              </a>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;