import React from 'react';
import { Users, FilterX, Plus } from 'lucide-react';

/**
 * @typedef {Object} EmptyStateProps
 * @property {number} totalLeadsCount - Total leads count in active workspace database
 * @property {function} onClearFilters - Callback to clear active search query and stage filters
 * @property {function} onAddLeadClick - Callback to display lead creation modal dialog
 */

/**
 * EmptyState Component
 * Displays contextual friendly messages and action hooks when the lead list is empty.
 * Maps two scenarios:
 * 1. CRM database is totally empty (renders creation instructions & CTA)
 * 2. Active search or stage filter yields zero matches (renders filter reset CTA)
 * 
 * @param {EmptyStateProps} props
 */
const EmptyState = ({ totalLeadsCount, onClearFilters, onAddLeadClick, onLoadDemoClick }) => {
  const isCrmEmpty = totalLeadsCount === 0;

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-xs animate-fade-in">
      {isCrmEmpty ? (
        <>
          {/* Scenario A: CRM Database is empty */}
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/40 text-primary border border-blue-100 dark:border-blue-900/30 mb-4 select-none">
            <Users size={24} />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
            Your CRM directory is empty
          </h3>
          <p className="max-w-md text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Get started by adding your first lead! Track contact details, deal sizes, pipeline statuses, and sources in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-5">
            <button
              type="button"
              onClick={onAddLeadClick}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-blue-700 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all duration-150 active:scale-98 focus:outline-hidden"
            >
              <Plus size={15} />
              <span>Create First Lead</span>
            </button>
            <button
              type="button"
              onClick={onLoadDemoClick}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-border-dark bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-hover-dark rounded-lg cursor-pointer transition-all duration-150 active:scale-98 focus:outline-hidden"
            >
              <span>Load Sample Leads</span>
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Scenario B: Leads are hidden by filters */}
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-900/60 text-slate-450 border border-slate-200 dark:border-slate-800 mb-4 select-none">
            <FilterX size={24} />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
            No leads match active filters
          </h3>
          <p className="max-w-md text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-medium">
            No records matched your search query or status criteria. Try typing a different keyword or resetting your filters.
          </p>
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-5 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-border-dark bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-hover-dark rounded-lg cursor-pointer transition-all duration-150 active:scale-98 focus:outline-hidden"
          >
            Clear Search & Filters
          </button>
        </>
      )}
    </div>
  );
};

export default EmptyState;
