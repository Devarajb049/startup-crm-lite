import { useMemo } from 'react';
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
  const recentLeads = useMemo(() => {
    return [...leads]
      .sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime())
      .slice(0, 5);
  }, [leads]);

  return (
    <div className="p-6 rounded-2xl glass-card border border-border/40 dark:border-border/10 shadow-xs">
      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
        Recent Leads
      </h3>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 mb-6 leading-relaxed">
        Overview of the latest opportunities in the acquisition funnel.
      </p>
 
      {/* Table grid wrapper */}
      <div className="overflow-x-auto -mx-6">
        <div className="inline-block min-w-full align-middle px-6">
          {recentLeads.length > 0 ? (
            <table className="min-w-full divide-y divide-border/30 dark:divide-border/10 text-left">
              <thead>
                <tr className="text-[10px] font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider">
                  <th className="pb-3 font-bold">Contact</th>
                  <th className="pb-3 font-bold">Company</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 text-right font-bold">Date Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 dark:divide-border/10 text-xs text-slate-700 dark:text-slate-300">
                {recentLeads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    className="hover:bg-hover/40 dark:hover:bg-hover/10 transition-colors duration-100"
                  >
                    {/* Contact Name */}
                    <td className="py-3.5 font-semibold text-slate-900 dark:text-white">
                      {lead.name}
                    </td>
                    
                    {/* Organization Company */}
                    <td className="py-3.5 text-slate-500 dark:text-slate-400">
                      {lead.company}
                    </td>
                    
                    {/* Status Badge */}
                    <td className="py-3.5">
                      <StatusBadge status={lead.status} />
                    </td>
                    
                    {/* Calendar Registration Date */}
                    <td className="py-3.5 text-right text-slate-400 dark:text-slate-500 font-semibold whitespace-nowrap">
                      {lead.date || (lead.createdAt ? lead.createdAt.split('T')[0] : '')}
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
