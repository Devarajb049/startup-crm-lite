import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Database, Lock } from 'lucide-react';
import DarkModeToggle from '../components/common/DarkModeToggle';
import Logo from '../components/common/Logo';
import useDocumentMetadata from '../hooks/useDocumentMetadata';

const Privacy = () => {
  const navigate = useNavigate();

  useDocumentMetadata(
    'Privacy Policy | AuraCRM',
    'Understand how AuraCRM collects, secures, and handles user account credentials and workspace databases.'
  );

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
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

          {/* Heading */}
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-[10px] text-slate-455 dark:text-slate-500 font-mono mt-0.5">
                Last updated: July 10, 2026
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
            At AuraCRM, privacy and user safety is our highest priority. This Privacy Policy documents how we qualify, store, and utilize workspace sessions, lead profiles, and account authentication records.
          </p>

          {/* Privacy sections */}
          <div className="space-y-8 text-xs leading-relaxed text-slate-650 dark:text-slate-355">
            {/* Section 1 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <Eye size={14} className="text-indigo-500 shrink-0" />
                <span>1. Information We Collect</span>
              </div>
              <p>
                We collect only minimal configurations required to deliver standard CRM functionalities and statistics:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <li><strong>Account Credentials:</strong> Email, full name, profile picture, and Google account unique ID (in case of Google sign-in).</li>
                <li><strong>Workspace Records:</strong> Leads directory, contact logs, pipeline stages, status tags, and acquisition channel references.</li>
                <li><strong>Telemetry & Session Keys:</strong> Local storage cached theme options, dark mode configurations, and signed JWT tokens.</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <Database size={14} className="text-indigo-500 shrink-0" />
                <span>2. How We Utilize Workspace Information</span>
              </div>
              <p>
                AuraCRM processes lead metrics and attributes exclusively to output user-facing analytics reports, source conversion graphs, and qualified status badges. All inputs remain isolated strictly inside your owner workspace directory context. We do not inspect, crawl, or monetize your lead records.
              </p>
            </div>

            {/* Section 3 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <Lock size={14} className="text-indigo-500 shrink-0" />
                <span>3. Data Retention & Workspace Deletion</span>
              </div>
              <p>
                Your session JWT is stored locally inside your browser cache. You can immediately delete active session contexts by logging out. Lead entries and databases reside on our cloud databases and can be cleared instantly from the workspace administration page.
              </p>
            </div>
          </div>

          {/* Footer divider button */}
          <div className="mt-12 pt-6 border-t border-border/40 dark:border-border/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[10px] text-slate-450 dark:text-slate-500 font-mono">
              &copy; 2026 AuraCRM Systems, Inc.
            </span>
            <div className="flex gap-4">
              <Link
                to="/terms"
                className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
              >
                Terms of Service
              </Link>
              <Link
                to="/security"
                className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
              >
                Security Details
              </Link>
              <Link
                to="/login"
                className="text-[10px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
              >
                Sign In Page
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
