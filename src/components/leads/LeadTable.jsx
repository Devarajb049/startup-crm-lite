import { useState } from 'react';
import { LayoutGrid, Table, Edit, Trash2, Building, Calendar, Landmark } from 'lucide-react';
import StatusBadge from './StatusBadge';
import LeadCard from './LeadCard';
import { useLeads } from '../../context/LeadContext';

/**
 * @typedef {Object} Lead
 * @property {string} id - Lead identifier
 * @property {string} name - Contact person's name
 * @property {string} company - Organization name
 * @property {string} email - Contact email address
 * @property {string} phone - Contact phone number
 * @property {number} value - Opportunity value
 * @property {string} status - Pipeline status
 * @property {string} source - Acquisition source channel
 * @property {string} date - Creation date
 */

/**
 * @typedef {Object} LeadTableProps
 * @property {Lead[]} leads - List of leads to render
 * @property {function} onEditLead - Callback function to edit a lead
 * @property {function} onDeleteLead - Callback function to delete a lead
 */

/**
 * LeadTable Component
 * Renders the leads database. Supports toggling between standard desktop-oriented Table list
 * and modern responsive Card grid layouts.
 * 
 * @param {LeadTableProps} props
 */
const LeadTable = ({ leads, onEditLead, onDeleteLead }) => {
  const { formatCurrency } = useLeads();
  // Local state to toggle between table format ('table') and card format ('card')
  const [viewMode, setViewMode] = useState('table');

  return (
    <div className="space-y-4">
      {/* View Switcher Toolbar (Hidden on mobile as mobile always defaults to card view for usability) */}
      <div className="hidden md:flex items-center justify-end gap-2">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mr-1 select-none">
          Layout View:
        </span>
        
        {/* Table Toggle Button */}
        <button
          type="button"
          onClick={() => setViewMode('table')}
          className={`p-2 rounded-xl border transition-all cursor-pointer focus:outline-hidden ${
            viewMode === 'table'
              ? 'bg-hover text-primary border-border font-semibold shadow-xs'
              : 'bg-card text-slate-400 border-border hover:bg-hover'
          }`}
          title="Table View"
          aria-label="Table layout view"
        >
          <Table size={16} />
        </button>
 
        {/* Card Toggle Button */}
        <button
          type="button"
          onClick={() => setViewMode('card')}
          className={`p-2 rounded-xl border transition-all cursor-pointer focus:outline-hidden ${
            viewMode === 'card'
              ? 'bg-hover text-primary border-border font-semibold shadow-xs'
              : 'bg-card text-slate-400 border-border hover:bg-hover'
          }`}
          title="Card View"
          aria-label="Card grid layout view"
        >
          <LayoutGrid size={16} />
        </button>
      </div>

      {/* Main Content Layout Renderer */}
      {leads.length > 0 ? (
        <>
          {/* Mobile View: Force Card Stack (always active on narrow screens) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onEdit={() => onEditLead(lead)}
                onDelete={() => onDeleteLead(lead.id)}
              />
            ))}
          </div>

          {/* Desktop View: Respect viewMode state */}
          <div className="hidden md:block">
            {viewMode === 'table' ? (
              /* Table Layout */
              <div className="bg-card/80 dark:bg-card/80 backdrop-blur-2xl border border-border/40 dark:border-border/10 rounded-2xl shadow-xs overflow-hidden">
                <table className="min-w-full divide-y divide-border/30 dark:divide-border/10 text-left">
                  <thead className="bg-bg/60 dark:bg-surface/40 text-[10px] font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider sticky top-0 z-10 backdrop-blur-md">
                    <tr>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Company</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Estimated Value</th>
                      <th className="px-6 py-4">Source Channel</th>
                      <th className="px-6 py-4">Date Added</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20 dark:divide-border/10 text-xs text-slate-700 dark:text-slate-300">
                    {leads.map((lead) => (
                      <tr 
                        key={lead.id} 
                        className="hover:bg-hover/40 dark:hover:bg-hover/10 transition-colors duration-100 text-slate-700 dark:text-slate-300"
                      >
                        {/* Contact info details */}
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/40 text-primary flex items-center justify-center font-bold text-xs select-none shrink-0">
                              {lead.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 dark:text-white truncate">
                                {lead.name}
                              </p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                                {lead.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Company */}
                        <td className="px-6 py-3.5 text-slate-600 dark:text-slate-400 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Building size={14} className="text-slate-400" />
                            <span>{lead.company}</span>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="px-6 py-3.5">
                          <StatusBadge status={lead.status} />
                        </td>

                        {/* Value */}
                        <td className="px-6 py-3.5 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-1">
                            <Landmark size={14} className="text-slate-400 font-normal" />
                            <span>{formatCurrency(lead.value)}</span>
                          </div>
                        </td>

                        {/* Source channel */}
                        <td className="px-6 py-3.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                            {lead.source}
                          </span>
                        </td>

                        {/* Date added */}
                        <td className="px-6 py-3.5 text-slate-500 dark:text-slate-400 font-medium">
                          <div className="flex items-center gap-1">
                            <Calendar size={13} className="text-slate-400" />
                            <span>{lead.date || (lead.createdAt ? lead.createdAt.split('T')[0] : '')}</span>
                          </div>
                        </td>

                        {/* Row actions */}
                        <td className="px-6 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* Edit Action Button */}
                            <button
                              type="button"
                              onClick={() => onEditLead(lead)}
                              className="p-1.5 rounded-xl border border-border text-slate-500 dark:text-slate-400 hover:bg-hover transition-colors duration-150 active:scale-95 group/edit focus:outline-hidden"
                              title="Edit Lead"
                              aria-label={`Edit ${lead.name}`}
                            >
                              <Edit size={14} className="transition-transform duration-200 group-hover/edit:scale-110 group-hover/edit:rotate-6" />
                            </button>
                            
                            {/* Delete Action Button */}
                            <button
                              type="button"
                              onClick={() => onDeleteLead(lead.id)}
                              className="p-1.5 rounded-xl border border-border text-danger hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-200/50 transition-colors duration-150 active:scale-95 group/del focus:outline-hidden"
                              title="Delete Lead"
                              aria-label={`Delete ${lead.name}`}
                            >
                              <Trash2 size={14} className="transition-transform duration-200 group-hover/del:scale-110 group-hover/del:-rotate-6" />
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Card Grid Layout */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {leads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onEdit={() => onEditLead(lead)}
                    onDelete={() => onDeleteLead(lead.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default LeadTable;
