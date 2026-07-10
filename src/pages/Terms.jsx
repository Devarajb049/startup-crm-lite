import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Scale, FileText, Globe } from 'lucide-react';
import DarkModeToggle from '../components/common/DarkModeToggle';
import Logo from '../components/common/Logo';

const Terms = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="relative min-h-screen bg-bg text-slate-900 dark:text-white flex flex-col transition-colors duration-200">
      {/* Floating background glowing mesh elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none -z-10">
        <div className="absolute -top-20 -left-20 w-[450px] h-[450px] rounded-full bg-primary/6 dark:bg-primary/4 blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] rounded-full bg-indigo-500/6 dark:bg-indigo-500/4 blur-3xl animate-float-reverse" />
        <div className="absolute -bottom-20 left-1/4 w-[450px] h-[450px] rounded-full bg-pink-500/6 dark:bg-pink-500/4 blur-3xl animate-float-alternate" />
      </div>

      {/* Header bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-bg/60 dark:bg-bg/40 border-b border-border/40 dark:border-border/10 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between select-none">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <Logo className="w-6 h-6 text-primary" />
          <span className="text-sm font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
            AuraCRM
          </span>
        </div>
        <div className="flex items-center gap-3">
          <DarkModeToggle />
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/40 dark:border-border/10 text-[10px] font-bold bg-surface/50 dark:bg-card/20 hover:bg-hover active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft size={12} />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      {/* Content wrapper */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 text-left">
        <div className="glass-card border border-border/40 dark:border-border/10 rounded-3xl p-6 sm:p-10 bg-surface/40 dark:bg-card/25 shadow-xl relative overflow-hidden backdrop-blur-xl">
          {/* Accent light indicator */}
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

          {/* Heading */}
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
              <Scale size={20} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Terms of Service
              </h1>
              <p className="text-[10px] text-slate-450 dark:text-slate-500 font-mono mt-0.5">
                Last updated: July 10, 2026
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
            Welcome to AuraCRM. Please read these Terms of Service carefully before subscribing, signing up, or creating dynamic workspaces. By accessing or using the platform services, you agree to be bound by these provisions.
          </p>

          {/* Terms sections */}
          <div className="space-y-8 text-xs leading-relaxed text-slate-650 dark:text-slate-355">
            {/* Section 1 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <Globe size={14} className="text-primary shrink-0" />
                <span>1. Use of Our Services</span>
              </div>
              <p>
                AuraCRM grants you a limited, non-exclusive, non-transferable, revocable license to access lead qualifying, performance monitoring, and source channel statistics management workspaces according to your subscription tier plan limits.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <li>You must be at least 18 years of age to register an active administrative user profile account.</li>
                <li>You are solely responsible for all actions taken and leads records data uploaded under your JWT session credentials.</li>
                <li>You may not use our services for spamming, automated cold phishing, or illegal lead harvesting.</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <FileText size={14} className="text-primary shrink-0" />
                <span>2. Account Registration & Data Protection</span>
              </div>
              <p>
                To utilize workspace instances, users must sign up using verified email addresses or Google Sign-In identity tokens. All customer data, leads attributes, database schemas, and session telemetry records are isolated securely under our encryption protocol layers.
              </p>
              <p>
                We do not sell, trade, or distribute lead database configurations. We preserve workspace records only to output standard reports and graphs.
              </p>
            </div>

            {/* Section 3 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <ShieldCheck size={14} className="text-primary shrink-0" />
                <span>3. Billing, Fees & Account Upgrades</span>
              </div>
              <p>
                AuraCRM provides Starter, Professional, and custom Enterprise subscription workspace plans. Subscriptions auto-renew monthly on the respective billing date. Fees are non-refundable once processed.
              </p>
              <p>
                Starter accounts that exceed the 100 leads storage capacity boundary guidelines may be prompted to upgrade to prevent data ingestion pauses.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <Scale size={14} className="text-primary shrink-0" />
                <span>4. Limitation of Liabilities</span>
              </div>
              <p>
                AuraCRM is provided on an "as is" and "as available" basis without warranties of any kind. Under no circumstances shall AuraCRM Systems, Inc. be liable for any direct, indirect, or incidental loss of lead deals, workspace availability, or database records.
              </p>
            </div>
          </div>

          {/* Footer divider button */}
          <div className="mt-12 pt-6 border-t border-border/40 dark:border-border/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[10px] text-slate-450 dark:text-slate-500 font-mono">
              &copy; 2026 AuraCRM Systems, Inc.
            </span>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/privacy')}
                className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => navigate('/login')}
                className="text-[10px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
              >
                Sign In Page
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Terms;
