/**
 * Centralized Constants for AuraCRM
 */

/**
 * Standard Status Options for sales pipeline stages
 * @type {string[]}
 */
export const STATUS_OPTIONS = [
  'New',
  'Contacted',
  'Meeting Scheduled',
  'Proposal Sent',
  'Won',
  'Lost'
];

/**
 * Standard Acquisition Channel Sources for leads
 * @type {string[]}
 */
export const SOURCE_OPTIONS = [
  'Website',
  'Referral',
  'LinkedIn',
  'Cold Call',
  'Email Campaign',
  'Other'
];

/**
 * Color mappings for StatusBadge components
 * @type {Object<string, string>}
 */
export const STATUS_COLORS = {
  'New': 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/40 dark:text-slate-350 dark:border-slate-700/60',
  'Contacted': 'bg-amber-50 text-warning border-amber-200/50 dark:bg-amber-950/20 dark:border-amber-900/30',
  'Meeting Scheduled': 'bg-indigo-50 text-indigo-600 border-indigo-200/50 dark:bg-indigo-950/20 dark:border-indigo-900/30',
  'Proposal Sent': 'bg-blue-50 text-primary border-blue-200/50 dark:bg-blue-950/20 dark:border-blue-900/30',
  'Won': 'bg-green-50 text-success border-green-200/50 dark:bg-green-950/20 dark:border-green-900/30',
  'Lost': 'bg-red-50 text-danger border-red-200/50 dark:bg-red-950/20 dark:border-red-900/30',
};
