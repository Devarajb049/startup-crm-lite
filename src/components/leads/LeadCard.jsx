import React from 'react';
import { Mail, Phone, Edit, Trash2, Building, DollarSign, Calendar } from 'lucide-react';
import StatusBadge from './StatusBadge';
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
 * @typedef {Object} LeadCardProps
 * @property {Lead} lead - Individual lead object to render
 * @property {function} onEdit - Callback function triggered on edit click
 * @property {function} onDelete - Callback function triggered on delete click
 */

/**
 * LeadCard Component
 * Displays a single lead entry inside a graphical card container.
 * 
 * @param {LeadCardProps} props
 */
const LeadCard = ({ lead, onEdit, onDelete }) => {
  const { formatCurrency } = useLeads();

  return (
    <div className="p-5 glass-card border border-slate-200/40 dark:border-white/5 rounded-2xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between text-left">
      
      {/* 1. Header Section (Avatar circle + Title Name + Actions) */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/40 text-primary flex items-center justify-center font-bold text-sm select-none shrink-0">
            {lead.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {lead.name}
            </h4>
            <div className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <Building size={12} className="text-slate-400 shrink-0 mt-0.5" />
              <span className="break-words whitespace-normal leading-tight">{lead.company}</span>
            </div>
          </div>
        </div>

        {/* Edit & Delete Action Panel */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-border-dark text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-hover-dark transition-colors focus:outline-hidden"
            title="Edit Lead"
            aria-label={`Edit ${lead.name}`}
          >
            <Edit size={13} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-border-dark text-danger hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-200/50 transition-colors focus:outline-hidden"
            title="Delete Lead"
            aria-label={`Delete ${lead.name}`}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* 2. Status Badge and Value */}
      <div className="flex items-center justify-between mt-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <StatusBadge status={lead.status} />
        <span className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center">
          <DollarSign size={13} className="text-slate-400 font-normal" />
          {formatCurrency(lead.value)}
        </span>
      </div>

      {/* 3. Contact Info details list */}
      <div className="mt-3.5 space-y-2 text-xs text-slate-600 dark:text-slate-400">
        <a 
          href={`mailto:${lead.email}`}
          className="flex items-center gap-2 hover:text-primary transition-colors truncate"
          title={`Email ${lead.name}`}
        >
          <Mail size={13} className="text-slate-400" />
          <span className="truncate">{lead.email}</span>
        </a>
        
        {lead.phone ? (
          <a 
            href={`tel:${lead.phone}`}
            className="flex items-center gap-2 hover:text-primary transition-colors"
            title={`Call ${lead.name}`}
          >
            <Phone size={13} className="text-slate-400" />
            <span>{lead.phone}</span>
          </a>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-600 italic">
            <Phone size={13} />
            <span>No phone added</span>
          </div>
        )}
      </div>

      {/* 4. Footer info: source & date */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
        <span className="font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 px-1.5 py-0.5 rounded uppercase tracking-wider">
          {lead.source}
        </span>
        <span className="flex items-center gap-1 font-medium">
          <Calendar size={10} />
          {lead.date}
        </span>
      </div>

    </div>
  );
};

export default LeadCard;
