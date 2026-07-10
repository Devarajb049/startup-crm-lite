import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as authService from '../services/authService';
import DarkModeToggle from '../components/common/DarkModeToggle';
import Logo from '../components/common/Logo';
import { Mail, Shield, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useDocumentMetadata from '../hooks/useDocumentMetadata';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { verifyOtp } = useAuth();
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [resendLoading, setResendLoading] = useState(false);

  const inputRefs = useRef([]);

  useDocumentMetadata(
    'Verify Email | AuraCRM',
    'Verify your email address to activate your AuraCRM workspace.'
  );

  // Retrieve verification target email on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem('pending-verify-email');
    if (!storedEmail) {
      toast.error('No pending registration found. Please register.');
      navigate('/register');
    } else {
      setEmail(storedEmail);
    }
  }, [navigate]);

  // Countdown timer for resend delay
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle character input
  const handleChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(val)) return; // Restrict to numbers only

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1); // Keep only the latest digit
    setOtp(newOtp);

    // Focus next box if current is filled
    if (val && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle keypress controls (backspace logic)
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  // Handle clipboard paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (pastedData.length === 6 && /^\d+$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs.current[5].focus();
    }
  };

  // Resend code to user email
  const handleResend = async () => {
    if (countdown > 0) return;
    
    setError('');
    setResendLoading(true);
    try {
      await authService.resendOtp(email, 'register');
      setOtp(['', '', '', '', '', '']);
      setCountdown(60);
      inputRefs.current[0].focus();
      toast.success('A new verification code has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend verification code.');
      toast.error(err.response?.data?.message || 'Failed to resend code.');
    } finally {
      setResendLoading(false);
    }
  };

  // Submit OTP for validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsLoading(true);
    try {
      await verifyOtp(email, otpString, 'register');
      toast.success('Email verified successfully! Welcome to AuraCRM.', {
        style: {
          background: '#22C55E',
          color: '#FFFFFF',
          fontWeight: 'bold',
        },
        duration: 3000,
      });
      // Clear pending state
      localStorage.removeItem('pending-verify-email');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please check the code.');
      toast.error(err.response?.data?.message || 'Incorrect verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-tr from-border/50 via-bg to-border dark:from-bg dark:via-surface dark:to-card relative overflow-x-hidden transition-colors duration-200">
      
      {/* BRANDING SHOWCASE (Left Panel) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-sidebar via-surface to-bg border-r border-border/10 relative overflow-hidden select-none animate-slide-in-left">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none animate-float-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none animate-float-reverse" />

        <div className="flex items-center gap-3 relative z-10">
          <Logo className="w-9 h-9 text-primary" />
          <span className="text-base font-extrabold tracking-tight text-slate-905 dark:text-white uppercase">
            AURA<span className="text-primary">CRM</span>
          </span>
          <span className="text-[9px] bg-slate-100 dark:bg-white/10 text-slate-650 dark:text-slate-355 px-1.5 py-0.2 rounded font-mono font-semibold uppercase tracking-wider">
            Lite
          </span>
        </div>

        <div className="my-auto space-y-7 relative z-10 max-w-lg text-left">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-slate-905 dark:text-white tracking-tight leading-tight">
              One step away <br />
              from your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-650 to-purple-650 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                CRM Workspace.
              </span>
            </h1>
            <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
              We take security seriously. Verify your email to protect your leads, metrics, and customer conversation databases.
            </p>
          </div>

          <div className="space-y-2.5 text-[11px] font-semibold text-slate-700 dark:text-slate-350">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={15} className="text-success shrink-0" />
              <span>Protects against automated fake signups</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={15} className="text-success shrink-0" />
              <span>Ensures secure alerts and notifications</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={15} className="text-success shrink-0" />
              <span>Enables seamless password recovery options</span>
            </div>
          </div>
        </div>

        <div className="text-[9px] text-slate-500 font-mono relative z-10 flex flex-col gap-0.5 text-left">
          <span>&copy; 2026 AuraCRM Systems, Inc. All rights reserved.</span>
          <span>
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

      {/* USER ACTION AREA (Right Panel) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative min-h-screen overflow-y-auto animate-slide-in-right">
        
        <div className="absolute top-4 right-4 z-20">
          <DarkModeToggle />
        </div>

        <div className="absolute top-1/6 right-1/6 w-96 h-96 rounded-full bg-blue-300/20 dark:bg-blue-600/10 blur-[120px] pointer-events-none animate-float-slow" />
        <div className="absolute bottom-1/6 left-1/6 w-96 h-96 rounded-full bg-purple-300/15 dark:bg-purple-600/8 blur-[120px] pointer-events-none animate-float-reverse" />

        <div className="w-full max-w-md glass-card p-6 sm:p-8 rounded-3xl shadow-2xl relative z-10 my-auto animate-fade-in">
          <div className="flex flex-col items-center text-center mb-6 select-none">
            <div className="w-12 h-12 mb-3 flex items-center justify-center lg:hidden">
              <Logo className="w-11 h-11 text-primary" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-3">
              <Shield size={22} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Email Verification
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-xs">
              We sent a 6-digit verification code to <span className="font-extrabold text-slate-800 dark:text-slate-200">{email}</span>. Please check your inbox (and <span className="font-bold text-primary dark:text-blue-400">spam folder</span>).
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-50/50 dark:bg-red-950/20 border border-red-200/40 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-xs mb-6 animate-fade-in text-left">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-450 text-left">
                Enter Verification Code
              </label>
              
              <div className="flex justify-between gap-2.5">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    onPaste={idx === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-lg font-bold rounded-xl glass-input text-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.join('').length !== 6}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <span>Verify & Activate Workspace</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-border/40 dark:border-border/10 flex flex-col items-center gap-3 text-xs">
            <div className="text-slate-500">
              Didn't receive the code?{' '}
              {countdown > 0 ? (
                <span className="font-bold text-primary">
                  Resend in {countdown}s
                </span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="font-bold text-primary hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  {resendLoading && <RefreshCw size={10} className="animate-spin" />}
                  <span>Resend Code</span>
                </button>
              )}
            </div>
            
            <Link to="/register" className="text-slate-450 hover:text-slate-700 dark:hover:text-slate-200 hover:underline">
              Back to Registration
            </Link>
          </div>

          <p className="mt-6 text-[9px] text-slate-450 dark:text-slate-550 text-center leading-relaxed">
            By verifying, you agree to our <Link to="/terms" className="hover:underline">Terms of Service</Link> and <Link to="/privacy" className="hover:underline">Privacy Policy</Link>.
          </p>

        </div>
      </div>

    </div>
  );
};

export default VerifyEmail;
