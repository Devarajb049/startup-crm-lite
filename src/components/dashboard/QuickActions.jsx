import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../../context/LeadContext';
import { Plus, Users, Download, ArrowRight } from 'lucide-react';

/**
 * @typedef {Object} QuickActionsProps
 * @property {Function} onAddLeadClick - Callback function to show the lead registry modal dialog
 */

/**
 * QuickActions Component
 * Renders quick buttons for key CRM workflows:
 * 1. Register a new lead (triggers layout modal dialog)
 * 2. Navigate to the leads table view
 * 3. Export all lead entries to a download-ready CSV file.
 * 
 * @param {QuickActionsProps} props
 */
const QuickActions = ({ onAddLeadClick }) => {
  const navigate = useNavigate();
  const { leads } = useLeads();

  // Downloads leads database as a spreadsheet-compatible CSV file in the browser
  const handleExportCSV = () => {
    if (!leads || leads.length === 0) return;
    
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
  };

  return (
    <div className="p-5 bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-xs">
      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
        Quick Actions
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
        Accelerate standard lead workflows with one-click routines.
      </p>

      {/* Grid of actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Action 1: Add New Lead */}
        <button
          type="button"
          onClick={onAddLeadClick}
          className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/40 text-blue-800 dark:text-blue-300 rounded-xl cursor-pointer transition-all border border-blue-100/50 dark:border-blue-900/30 group focus:outline-hidden"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary text-white shadow-xs">
              <Plus size={16} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold">Add New Lead</p>
              <p className="text-[10px] text-blue-600/80 dark:text-blue-400/80 mt-0.5">Register a contact</p>
            </div>
          </div>
          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all duration-150" />
        </button>

        {/* Action 2: View Leads list */}
        <button
          type="button"
          onClick={() => navigate('/leads')}
          className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-xl cursor-pointer transition-all border border-emerald-100/50 dark:border-emerald-900/30 group focus:outline-hidden"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success text-white shadow-xs">
              <Users size={16} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold">View Leads Directory</p>
              <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">Manage pipeline rows</p>
            </div>
          </div>
          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all duration-150" />
        </button>

        {/* Action 3: Export CSV spreadsheet */}
        <button
          type="button"
          onClick={handleExportCSV}
          className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-amber-800 dark:text-amber-300 rounded-xl cursor-pointer transition-all border border-amber-100/50 dark:border-amber-900/30 group focus:outline-hidden"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning text-white shadow-xs">
              <Download size={16} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold">Export Pipeline Data</p>
              <p className="text-[10px] text-amber-600/80 dark:text-amber-400/80 mt-0.5">Download CSV tables</p>
            </div>
          </div>
          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all duration-150" />
        </button>

      </div>
    </div>
  );
};

export default QuickActions;
