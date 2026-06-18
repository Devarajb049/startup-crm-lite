import React from 'react';
import { useLeads } from '../../context/LeadContext';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import LeadForm from './LeadForm';

/**
 * AddLeadModal Component
 * A wrapper modal window rendered globally (e.g. from the top Navbar or Dashboard quick actions).
 * It mounts the modular LeadForm, handles onSubmit by routing to global CRMContext modifiers,
 * and launches corresponding success toasts.
 * 
 * Props:
 * - isOpen (boolean): Modal display control flag
 * - onClose (function): Hides modal drawer
 * - leadToEdit (object, optional): Loads fields with existing values if editing
 */
const AddLeadModal = ({ isOpen, onClose, leadToEdit = null }) => {
  const { addLead, updateLead } = useLeads();

  if (!isOpen) return null;

  // Form submit interceptor
  const handleFormSubmit = (formData) => {
    if (leadToEdit) {
      updateLead(leadToEdit.id, formData);
      toast.success(`Updated lead details for "${formData.name}"`, {
        style: {
          background: '#22C55E',
          color: '#FFFFFF',
          fontWeight: 'bold',
        },
        duration: 3000,
      });
    } else {
      addLead(formData);
      toast.success(`Registered new lead: "${formData.name}"`, {
        style: {
          background: '#22C55E',
          color: '#FFFFFF',
          fontWeight: 'bold',
        },
        duration: 3000,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card content wrapper: full screen on mobile, centered max-w-lg on tablet+ */}
      <div className="relative w-full h-full sm:h-auto sm:max-w-lg bg-white dark:bg-gray-800 border-0 sm:border border-slate-200 dark:border-gray-700 sm:rounded-xl shadow-xl z-10 overflow-hidden transform transition-all max-h-screen sm:max-h-[90vh] flex flex-col animate-fade-in">

        {/* Title Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            {leadToEdit ? 'Modify Lead Details' : 'Register New Lead'}
          </h2>
          <button
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-500 dark:hover:text-slate-350 hover:bg-slate-100 dark:hover:bg-hover-dark transition-colors focus:outline-hidden"
            onClick={onClose}
            aria-label="Close dialog modal"
          >
            <X size={17} />
          </button>
        </div>

        {/* Form area */}
        <div className="flex-1 overflow-y-auto p-6">
          <LeadForm
            key={leadToEdit?.id || 'new'}
            initialData={leadToEdit}
            onSubmit={handleFormSubmit}
            onCancel={onClose}
          />
        </div>

      </div>

    </div>
  );
};

export default AddLeadModal;
