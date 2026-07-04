import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DarkModeToggle from '../components/common/DarkModeToggle';
import { Mail, Lock, User, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

/**
 * Register Component
 * Renders a premium, glassmorphism registration interface.
 * Connects directly to the AuthContext backend signup validation.
 */
const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password);
      toast.success('Successfully registered!', {
        style: {
          background: '#22C55E',
          color: '#FFFFFF',
          fontWeight: 'bold',
        },
        duration: 3000,
      });
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed.';
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
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#090D16] relative overflow-hidden px-4 py-12 transition-colors duration-200">
      {/* Theme Toggle Positioned in Top Right Corner */}
      <div className="absolute top-4 right-4 z-20">
        <DarkModeToggle />
      </div>

      {/* Background Glowing Gradients */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-blue-600/5 dark:bg-blue-600/10 blur-3xl animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-600/5 dark:bg-purple-600/10 blur-3xl animate-float-reverse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-pink-500/5 blur-3xl animate-float-alternate" />

      {/* Register Card */}
      <div className="w-full max-w-md bg-white/85 dark:bg-[#1C1C1C]/90 backdrop-blur-xl border border-slate-100 dark:border-slate-800/40 p-8 rounded-3xl shadow-xl dark:shadow-2xl relative z-10 animate-fade-in transition-all">
        
        {/* Brand/Logo Header */}
        <div className="flex flex-col items-center text-center mb-6 select-none">
          <div className="w-10 h-10 mb-3 flex items-center justify-center">
            {/* Brand Logo - Styled as futuristic A geometry */}
            <svg viewBox="0 0 32 32" fill="none" className="w-10 h-10 text-primary">
              <g stroke="currentColor" strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round">
                <path d="M 6 26 L 18 5 L 21 11" />
                <path d="M 22.5 14.5 L 27 26" />
                <path d="M 8 20 L 29 11 M 29 11 L 23 8 M 29 11 L 26 17" />
              </g>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 justify-center">
            Join AURA<span className="text-primary">CRM</span>
            <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-400 px-1.5 py-0.2 rounded font-mono font-semibold uppercase tracking-wider select-none">
              Lite
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create a new account to manage your CRM workspace
          </p>
        </div>

        {/* Inline Error Alert */}
        {error && (
          <div className="flex items-start gap-2.5 p-3 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 text-red-600 dark:text-red-400 rounded-xl text-xs mb-5 animate-fade-in">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div className="space-y-1">
            <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                <User size={16} />
              </span>
              <input
                id="name"
                type="text"
                required
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-10.5 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:bg-white dark:focus:bg-slate-950/40 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                <Mail size={16} />
              </span>
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10.5 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:bg-white dark:focus:bg-slate-950/40 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                <Lock size={16} />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10.5 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:bg-white dark:focus:bg-slate-950/40 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350 focus:outline-hidden cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                <Lock size={16} />
              </span>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-10.5 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:bg-white dark:focus:bg-slate-950/40 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all duration-150 active:scale-98 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            {isLoading ? (
              <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn size={15} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Link back to Login */}
        <div className="text-center mt-5 border-t border-slate-100 dark:border-slate-800/40 pt-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-semibold ml-1">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
