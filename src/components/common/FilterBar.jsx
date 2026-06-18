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
  const filters = ['All', 'New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];

  // Calculates counts of leads mapping to a specific status key
  const getFilterCount = (filter) => {
    if (filter === 'All') return leads.length;
    return leads.filter((lead) => lead.status === filter).length;
  };

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none select-none">
      {filters.map((filter) => {
        const isActive = activeFilter === filter;
        return (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer focus:outline-hidden ${
              isActive
                ? 'bg-primary text-white shadow-xs'
                : 'bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-hover-dark'
            }`}
          >
            <span>{filter}</span>
            {/* Lead count badge */}
            <span className={`ml-1.5 px-1.5 py-0.2 text-[10px] rounded-md ${
              isActive 
                ? 'bg-blue-700 text-white' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-450'
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
