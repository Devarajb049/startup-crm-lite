import React from 'react';
import StatusBadge from '../leads/StatusBadge';

/**
 * @typedef {Object} Lead
 * @property {string} id - Unique lead identifier
 * @property {string} name - Contact person's name
 * @property {string} company - Organization name
 * @property {string} status - Active pipeline status
 * @property {string} date - Calendar date added (YYYY-MM-DD)
 */

/**
 * @typedef {Object} RecentLeadsProps
 * @property {Lead[]} leads - List of leads in active workspace
 */

/**
 * RecentLeads Component
 * Renders the latest 5 leads in a clean datatable list.
 * Includes status colors and responsive styling tags.
 * 
 * @param {RecentLeadsProps} props
 */
const RecentLeads = ({ leads }) => {
  // Sort by calendar date in descending order and extract the top 5 records
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="p-5 bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-xs">
      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
        Recent Leads
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
        Overview of the latest opportunities in the acquisition funnel.
      </p>

      {/* Table grid wrapper */}
      <div className="overflow-x-auto -mx-5">
        <div className="inline-block min-w-full align-middle px-5">
          {recentLeads.length > 0 ? (
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left">
              <thead>
                <tr className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Company</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Date Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-755 dark:text-slate-300">
                {recentLeads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors duration-100"
                  >
                    {/* Contact Name */}
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">
                      {lead.name}
                    </td>
                    
                    {/* Organization Company */}
                    <td className="py-3 text-slate-500 dark:text-slate-400">
                      {lead.company}
                    </td>
                    
                    {/* Status Badge */}
                    <td className="py-3">
                      <StatusBadge status={lead.status} />
                    </td>
                    
                    {/* Calendar Registration Date */}
                    <td className="py-3 text-right text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
                      {lead.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-6 text-center">
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                No recent leads created.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentLeads;
