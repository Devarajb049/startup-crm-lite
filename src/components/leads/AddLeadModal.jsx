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

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

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
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card content wrapper */}
      <div className="relative w-full sm:max-w-2xl bg-card/85 dark:bg-card/85 backdrop-blur-2xl border border-border/40 dark:border-border/10 rounded-2xl shadow-2xl z-10 overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col animate-fade-in">

        {/* Title Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 dark:border-border/10 bg-bg/20 dark:bg-surface/20 shrink-0">
          <h2 className="text-xs sm:text-sm font-extrabold tracking-wider uppercase text-slate-900 dark:text-white">
            {leadToEdit ? 'Modify Lead Details' : 'Register New Lead'}
          </h2>
          <button
            type="button"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-white/5 transition-colors focus:outline-hidden cursor-pointer"
            onClick={onClose}
            aria-label="Close dialog modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form area */}
        <LeadForm
          key={leadToEdit?.id || 'new'}
          initialData={leadToEdit}
          onSubmit={handleFormSubmit}
          onCancel={onClose}
        />

      </div>

    </div>
  );
};

export default AddLeadModal;
