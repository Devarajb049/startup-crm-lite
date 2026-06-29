import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DarkModeToggle from '../components/common/DarkModeToggle';
import { User, Mail, Lock, UserPlus, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Waitlist flows
  const [isWaitlisted, setIsWaitlisted] = useState(false);
  const [waitlistNumber, setWaitlistNumber] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Field validations
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    // Minor delay for premium loading experience
    setTimeout(() => {
      try {
        // Save to waitlist in local storage for simulated data record
        const storedWaitlist = localStorage.getItem('startup-crm-waitlist') || '[]';
        const waitlist = JSON.parse(storedWaitlist);
        
        const alreadyWaitlisted = waitlist.some((u) => u.email.toLowerCase() === email.toLowerCase());
        if (alreadyWaitlisted) {
          throw new Error('This email is already in our priority waitlist.');
        }

        const newWaitlistUser = { name, email, registeredAt: new Date().toISOString() };
        waitlist.push(newWaitlistUser);
        localStorage.setItem('startup-crm-waitlist', JSON.stringify(waitlist));

        // Generate a random high-quality queue number
        const randomQueueNum = Math.floor(Math.random() * 850) + 1240;
        setWaitlistNumber(randomQueueNum);
        setIsWaitlisted(true);

        toast.success("Joined priority waitlist!", {
          style: {
            background: '#22C55E',
            color: '#FFFFFF',
            fontWeight: 'bold',
          },
          duration: 4000,
        });
      } catch (err) {
        setError(err.message || 'Registration failed.');
        toast.error(err.message || 'Registration failed.', {
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
    }, 600);
  };

  if (isWaitlisted) {
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

        {/* Success Card */}
        <div className="w-full max-w-md bg-white/85 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 p-8 rounded-3xl shadow-xl dark:shadow-2xl relative z-10 text-center animate-fade-in transition-all">
          <div className="w-16 h-16 rounded-full bg-green-500/10 dark:bg-green-500/15 text-green-500 flex items-center justify-center mx-auto mb-4 border border-green-500/20 dark:border-green-500/30">
            <CheckCircle size={28} className="animate-pulse" />
          </div>
          
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            You're on the Waitlist! 🎉
          </h2>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
            Thank you for registering, <strong className="text-slate-805 dark:text-white">{name}</strong>! 
            AuraCRM is currently in invite-only private beta. We've reserved your slot.
          </p>

          {/* Position Number Card */}
          <div className="my-6 p-4.5 bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">
              Your Reserved Position
            </span>
            <span className="text-2xl font-black text-primary block mt-1">
              #{waitlistNumber}
            </span>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-1 block">
              Estimated access: 4-7 business days
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            We will send access instructions to <strong className="text-slate-700 dark:text-slate-300">{email}</strong> as soon as a workspace seat opens.
          </p>

          <Link
            to="/login"
            className="w-full inline-flex items-center justify-center gap-2 py-3 bg-primary hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all duration-150 active:scale-98 focus:outline-hidden"
          >
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    );
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

      {/* Registration Card */}
      <div className="w-full max-w-md bg-white/85 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 p-8 rounded-3xl shadow-xl dark:shadow-2xl relative z-10 animate-fade-in transition-all">
        
        {/* Header Title */}
        <div className="flex flex-col items-center text-center mb-8 select-none">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 mb-3.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className="w-7 h-7 text-white">
              <path 
                d="M16 7L22.5 20.5C23 21.5 22.2 22.5 21 22.5H11C9.8 22.5 9 21.5 9.5 20.5L16 7Z" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinejoin="round" 
              />
              <path 
                d="M12.8 16.5H19.2" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
              />
            </svg>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Create an Account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Get started with your free AuraCRM workspace
          </p>
        </div>

        {/* Inline Error Alert */}
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 text-red-600 dark:text-red-400 rounded-xl text-xs mb-6 animate-fade-in">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4.5">
          {/* Name Input */}
          <div className="space-y-1.5">
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
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-10.5 pr-4 py-3 text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:bg-white dark:focus:bg-slate-950/40 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
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
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10.5 pr-4 py-3 text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:bg-white dark:focus:bg-slate-950/40 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
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
                className="block w-full pl-10.5 pr-10 py-3 text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:bg-white dark:focus:bg-slate-950/40 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150"
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
          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                <Lock size={16} />
              </span>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-10.5 pr-10 py-3 text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:bg-white dark:focus:bg-slate-950/40 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350 focus:outline-hidden cursor-pointer"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all duration-150 active:scale-98 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none mt-4"
          >
            {isLoading ? (
              <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <UserPlus size={15} />
                <span>Sign Up</span>
              </>
            )}
          </button>
        </form>

        {/* Switch Link */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6 select-none">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-bold transition-all">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
