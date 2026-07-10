import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import DarkModeToggle from '../components/common/DarkModeToggle';
import Logo from '../components/common/Logo';
import { Mail, Shield, AlertCircle, RefreshCw, CheckCircle2, Lock, Key } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useDocumentMetadata from '../hooks/useDocumentMetadata';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const [step, setStep] = useState(1); // 1 = Request OTP, 2 = Verify & Reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [resendLoading, setResendLoading] = useState(false);

  const inputRefs = useRef([]);

  useDocumentMetadata(
    'Reset Password | AuraCRM',
    'Reset your AuraCRM account password securely using a 6-digit OTP verification code.'
  );

  // Handle Google Auth Pop-up communication
  useEffect(() => {
    const handleGoogleAuthMessage = async (event) => {
      if (event.origin !== window.location.origin) return;

      if (event.data && event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        const { idToken } = event.data;
        setIsLoading(true);
        setError('');
        try {
          await loginWithGoogle(idToken);
          toast.success('Signed in with Google successfully!');
          navigate('/dashboard');
        } catch (err) {
          console.error(err);
          setError(err.response?.data?.message || 'Google authentication failed.');
        } finally {
          setIsLoading(false);
        }
      } else if (event.data && event.data.type === 'GOOGLE_AUTH_FAILURE') {
        toast.error('Google authorization pop-up cancelled or failed.');
      }
    };

    window.addEventListener('message', handleGoogleAuthMessage);
    return () => window.removeEventListener('message', handleGoogleAuthMessage);
  }, [loginWithGoogle, navigate]);

  const handleGoogleSignIn = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '851802631699-u6s2tbcfv8nf3ts6k8j2ofv5couu37fm.apps.googleusercontent.com';
    const redirectUri = window.location.origin + '/google-callback.html';
    
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=id_token&scope=openid%20email%20profile&nonce=authnonce_${Date.now()}`;
    
    window.open(
      oauthUrl,
      'google-auth-popup',
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
    );
  };

  // Countdown timer for resend delay
  useEffect(() => {
    if (step === 2 && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, step]);

  // Handle character input for OTP
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

  // Handle keypress controls for OTP
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

  // Handle clipboard paste for OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (pastedData.length === 6 && /^\d+$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs.current[5].focus();
    }
  };

  // Submit stage 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success('A reset verification code has been sent to your email.');
      setStep(2);
      setCountdown(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request password reset.');
      toast.error(err.response?.data?.message || 'Request failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend reset code
  const handleResend = async () => {
    if (countdown > 0) return;

    setError('');
    setResendLoading(true);
    try {
      await authService.resendOtp(email, 'forgot');
      setOtp(['', '', '', '', '', '']);
      setCountdown(60);
      toast.success('A new reset verification code has been sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code.');
      toast.error(err.response?.data?.message || 'Resend failed.');
    } finally {
      setResendLoading(false);
    }
  };

  // Submit stage 2: Verify OTP and reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(email, otpString, newPassword);
      toast.success('Password reset successfully! You can now login with your new password.', {
        style: {
          background: '#22C55E',
          color: '#FFFFFF',
          fontWeight: 'bold',
        },
        duration: 4000,
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed.');
      toast.error(err.response?.data?.message || 'Password reset failed.');
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
              Regain access <br />
              to your sales <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-650 to-purple-650 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                Performance metrics.
              </span>
            </h1>
            <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
              We send a unique, secure OTP to ensure only authorized account administrators can modify or restore passwords.
            </p>
          </div>

          <div className="space-y-2.5 text-[11px] font-semibold text-slate-700 dark:text-slate-350">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={15} className="text-success shrink-0" />
              <span>Verifies account owner identity</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={15} className="text-success shrink-0" />
              <span>Invalidates previous codes immediately</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={15} className="text-success shrink-0" />
              <span>Protects data isolation security parameters</span>
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
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6 select-none">
            <div className="w-12 h-12 mb-3 flex items-center justify-center lg:hidden">
              <Logo className="w-11 h-11 text-primary" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-3">
              <Key size={22} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Reset Password
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              {step === 1 
                ? <>Enter your registered email address to receive a password reset code. Please check your inbox (and <span className="font-bold text-primary dark:text-blue-400">spam folder</span>).</>
                : <>Enter the code and your new password to restore account access. Please check your inbox (and <span className="font-bold text-primary dark:text-blue-400">spam folder</span>).</>
              }
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-50/50 dark:bg-red-950/20 border border-red-200/40 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-xs mb-6 animate-fade-in text-left">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            /* Step 1: Request OTP Form */
            <form onSubmit={handleRequestOtp} className="space-y-4 text-left">
              <div className="space-y-1">
                <label htmlFor="email" className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500 z-10 pointer-events-none">
                    <Mail size={15} />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="Enter your workspace email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 text-xs rounded-xl glass-input text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <span>Send Verification Code</span>
                )}
              </button>
            </form>

            {/* Social login mock separator */}
            <div className="relative my-5 select-none">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/40 dark:border-border/10"></div>
              </div>
              <div className="relative flex justify-center text-[9px] font-extrabold uppercase tracking-wider">
                <span className="px-3 bg-card/90 dark:bg-card/90 text-slate-500 dark:text-slate-400">or continue with</span>
              </div>
            </div>

            {/* Social login Google button */}
            <div className="w-full">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 border border-border/80 dark:border-border/30 rounded-xl text-[10px] font-bold bg-surface dark:bg-card hover:bg-hover dark:hover:bg-hover active:scale-97 transition-all cursor-pointer text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>
            </div>
          ) : (
            /* Step 2: Input OTP and New Password Form */
            <form onSubmit={handleResetPassword} className="space-y-5 text-left">
              <div className="space-y-2">
                <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                  Verification Code
                </label>
                <div className="flex justify-between gap-2">
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

              <div className="space-y-1">
                <label htmlFor="newPassword" className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                  New Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500 z-10 pointer-events-none">
                    <Lock size={15} />
                  </span>
                  <input
                    id="newPassword"
                    type="password"
                    required
                    placeholder="Min. 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 text-xs rounded-xl glass-input text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500 z-10 pointer-events-none">
                    <Lock size={15} />
                  </span>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    placeholder="Verify new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 text-xs rounded-xl glass-input text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.join('').length !== 6 || !newPassword || !confirmPassword}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-border/40 dark:border-border/10 flex flex-col items-center gap-3 text-xs">
            {step === 2 && (
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
            )}
            
            <Link to="/login" className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:underline transition-all">
              Back to Sign In
            </Link>
          </div>

          <p className="mt-6 text-[9px] text-slate-500 dark:text-slate-400 text-center leading-relaxed">
            Protecting your account with industry standard security parameters.
          </p>

        </div>
      </div>

    </div>
  );
};

export default ForgotPassword;
