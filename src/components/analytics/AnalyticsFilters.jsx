import React from 'react';
import { Calendar } from 'lucide-react';

/**
 * AnalyticsFilters Component
 * Renders date range options (preset buttons & custom range inputs).
 */
const AnalyticsFilters = ({ filterRange, onFilterRangeChange, customRange, onCustomRangeChange }) => {
  const presets = ['All Time', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Year', 'Custom Range'];

  const handleStartDateChange = (e) => {
    onCustomRangeChange({ ...customRange, startDate: e.target.value });
  };

  const handleEndDateChange = (e) => {
    onCustomRangeChange({ ...customRange, endDate: e.target.value });
  };

  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-card-dark p-4 rounded-2xl border border-slate-200 dark:border-border-dark shadow-sm transition-all duration-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Preset Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 dark:bg-slate-950/40 p-1 rounded-xl border border-slate-100 dark:border-slate-800">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onFilterRangeChange(preset)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-all duration-150 active:scale-95 ${
                filterRange === preset
                  ? 'bg-white dark:bg-slate-850 text-primary shadow-xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Calendar Icon Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
          <Calendar size={15} />
          <span>Calculated in real-time</span>
        </div>
      </div>

      {/* Custom Date Picker Inputs: Visible only if 'Custom Range' is active */}
      {filterRange === 'Custom Range' && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 border-t border-slate-150 dark:border-slate-800 animate-fade-in">
          <div className="flex-1 flex flex-col gap-1">
            <label htmlFor="start-date" className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              Start Date
            </label>
            <input
              id="start-date"
              type="date"
              value={customRange.startDate}
              onChange={handleStartDateChange}
              className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-hidden focus:border-primary w-full"
            />
          </div>

          <div className="flex-1 flex flex-col gap-1">
            <label htmlFor="end-date" className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              End Date
            </label>
            <input
              id="end-date"
              type="date"
              value={customRange.endDate}
              onChange={handleEndDateChange}
              className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-hidden focus:border-primary w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsFilters;
