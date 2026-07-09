import React from 'react';

/**
 * @typedef {Object} Lead
 * @property {string} status - Pipeline stage status
 */

/**
 * @typedef {Object} FilterBarProps
 * @property {string} activeFilter - Active selected pipeline status filter
 * @property {function} onFilterChange - Callback when a new filter is clicked
 * @property {Lead[]} leads - Entire leads collection to aggregate count indicators
 */

/**
 * FilterBar Component
 * Horizontal row of lead status categories.
 * Renders the count of leads associated with each stage in parentheses.
 * 
 * @param {FilterBarProps} props
 */
const FilterBar = ({ activeFilter, onFilterChange, leads }) => {
  // Available status filters according to specification
  const filters = ['All', 'New', 'Contacted', 'Qualified', 'Meeting Scheduled', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];

  // Calculates counts of leads mapping to a specific status key
  const getFilterCount = (filter) => {
    if (filter === 'All') return leads.length;
    return leads.filter((lead) => lead.status === filter).length;
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 select-none w-full">
      {filters.map((filter) => {
        const isActive = activeFilter === filter;
        return (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 active:scale-95 cursor-pointer focus:outline-hidden border ${
              isActive
                ? 'bg-primary text-white border-blue-400/20 shadow-md shadow-primary/10'
                : 'glass-card border-border/40 dark:border-border/10 text-slate-600 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-white/5'
            }`}
          >
            <span>{filter}</span>
            {/* Lead count badge */}
            <span className={`ml-1.5 px-1.5 py-0.2 text-[10px] font-bold rounded-md ${
              isActive 
                ? 'bg-blue-700 text-white' 
                : 'bg-slate-200/40 dark:bg-white/10 text-slate-500 dark:text-slate-400'
            }`}>
              {getFilterCount(filter)}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;
