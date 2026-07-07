import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../../context/LeadContext';
import { Plus, Users, Download, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

/**
 * @typedef {Object} QuickActionsProps
 * @property {Function} onAddLeadClick - Callback function to show the lead registry modal dialog
 */

/**
 * QuickActions Component
 * Renders quick buttons for key CRM workflows in a premium vertical list.
 * 
 * @param {QuickActionsProps} props
 */
const QuickActions = ({ onAddLeadClick }) => {
  const navigate = useNavigate();
  const { leads } = useLeads();

  // Downloads leads database as a spreadsheet-compatible CSV file in the browser
  const handleExportCSV = () => {
    if (!leads || leads.length === 0) {
      toast.error('No leads available to export', {
        style: {
          background: '#EF4444',
          color: '#FFFFFF',
          fontWeight: 'bold',
        },
        duration: 3000,
      });
      return;
    }
    
    // Headers layout array
    const csvHeaders = ['ID', 'Name', 'Company', 'Email', 'Phone', 'Value (USD)', 'Status', 'Source', 'Date Created'];
    
    // Row mappings
    const csvRows = [
      csvHeaders,
      ...leads.map((lead) => [
        lead.id,
        lead.name,
        lead.company,
        lead.email,
        lead.phone || '',
        lead.value,
        lead.status,
        lead.source,
        lead.date
      ])
    ];

    // Build the raw CSV text, escaping quotes where appropriate
    const csvString = csvRows
      .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    // Create href reference link
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Anchor trick for client-side download trigger
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `auracrm_leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show success toast notification
    toast.success(`Successfully exported ${leads.length} leads to CSV`, {
      style: {
        background: '#22C55E',
        color: '#FFFFFF',
        fontWeight: 'bold',
      },
      duration: 3000,
    });
  };

  return (
    <div className="p-6 rounded-2xl glass-card border border-slate-200/40 dark:border-white/5 shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Quick Actions
        </h3>
        <p className="text-[11px] text-slate-450 dark:text-slate-500 mt-1 mb-5 leading-relaxed">
          Accelerate standard lead workflows with one-click routines.
        </p>
      </div>

      {/* Vertical list of actions */}
      <div className="flex flex-col gap-3">
        
        {/* Action 1: Add New Lead */}
        <button
          type="button"
          onClick={onAddLeadClick}
          className="flex items-center justify-between p-4 bg-blue-500/5 dark:bg-blue-500/10 hover:bg-blue-500/10 dark:hover:bg-blue-500/15 text-blue-600 dark:text-blue-400 rounded-xl cursor-pointer transition-all duration-155 border border-blue-500/10 dark:border-blue-500/15 focus:outline-hidden hover:translate-x-0.5 group w-full text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
              <Plus size={16} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                Add New Lead
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed font-semibold">
                Register a new opportunity contact
              </p>
            </div>
          </div>
          <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform duration-155 shrink-0" />
        </button>

        {/* Action 2: View Leads list */}
        <button
          type="button"
          onClick={() => navigate('/leads')}
          className="flex items-center justify-between p-4 bg-emerald-500/5 dark:bg-emerald-500/10 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-xl cursor-pointer transition-all duration-155 border border-emerald-500/10 dark:border-emerald-500/15 focus:outline-hidden hover:translate-x-0.5 group w-full text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-success text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
              <Users size={16} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white group-hover:text-success transition-colors">
                View Directory
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed font-semibold">
                Manage your sales pipeline rows
              </p>
            </div>
          </div>
          <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform duration-155 shrink-0" />
        </button>

        {/* Action 3: Export CSV spreadsheet */}
        <button
          type="button"
          onClick={handleExportCSV}
          className="flex items-center justify-between p-4 bg-amber-500/5 dark:bg-amber-500/10 hover:bg-amber-500/10 dark:hover:bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-xl cursor-pointer transition-all duration-155 border border-amber-500/10 dark:border-amber-500/15 focus:outline-hidden hover:translate-x-0.5 group w-full text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-warning text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
              <Download size={16} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white group-hover:text-warning transition-colors">
                Export Data
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed font-semibold">
                Download database as CSV file
              </p>
            </div>
          </div>
          <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform duration-155 shrink-0" />
        </button>

      </div>
    </div>
  );
};

export default QuickActions;
