import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Ban } from 'lucide-react';

/**
 * NotFound Component
 * Custom fallback view for invalid endpoints (404 Page).
 * Displays a descriptive error message and provides a navigation hook back to the landing Dashboard.
 */
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      
      {/* 1. Large Visual Alert Block */}
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/40 text-danger border border-red-100 dark:border-red-900/30 mb-5 animate-pulse">
        <Ban size={28} />
      </div>

      {/* 2. Error Code Header */}
      <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
        404
      </h2>
      
      {/* 3. Text Descriptions */}
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mt-3 sm:text-lg">
        Page Not Found
      </h3>
      <p className="max-w-md text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
        We couldn't locate the page you requested. It might have been moved, deleted, or the address URL was entered incorrectly.
      </p>

      {/* 4. Action CTA back to Dashboard */}
      <Link
        to="/"
        className="flex items-center gap-2 mt-6 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all duration-150 active:scale-98 focus:outline-hidden"
      >
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </Link>
      
    </div>
  );
};

export default NotFound;
