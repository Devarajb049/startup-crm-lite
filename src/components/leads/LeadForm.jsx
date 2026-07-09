import { useState } from 'react';
import { STATUS_OPTIONS, SOURCE_OPTIONS } from '../../constants';
import ShimmerButton from '../common/ShimmerButton';

/**
 * @typedef {Object} LeadData
 * @property {string} [id] - Lead identifier
 * @property {string} name - Contact person's name
 * @property {string} company - Organization name
 * @property {string} email - Contact email address
 * @property {string} phone - Contact phone number
 * @property {number|string} value - Deal estimate value
 * @property {string} status - Pipeline stage status
 * @property {string} source - Lead generation acquisition channel
 */

/**
 * @typedef {Object} LeadFormProps
 * @property {LeadData} [initialData] - Existing lead data to load in edit mode
 * @property {function} onSubmit - Submit callback passing form inputs
 * @property {function} onCancel - Cancel callback
 */

/**
 * LeadForm Component
 * Renders the form inputs for lead creation and modification.
 * Integrates error states and required validators.
 */
const LeadForm = ({ initialData = null, onSubmit, onCancel }) => {
  // Local state initialized with defaults or editing fields
  const [formData, setFormData] = useState(() => ({
    name: initialData?.name || '',
    company: initialData?.company || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    value: initialData?.value || '',
    status: initialData?.status || 'New',
    source: initialData?.source || 'Website',
  }));

  const [errors, setErrors] = useState({});

  // Centralized status and source options
  const statusOptions = STATUS_OPTIONS;
  const sourceOptions = SOURCE_OPTIONS;

  // Handle standard input updates
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error if typing in the field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Run validation
  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    if (!formData.company.trim()) tempErrors.company = 'Company is required';
    
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email address is invalid';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden text-left">
      {/* Scrollable form body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
          
          {/* 1. Name Input */}
          <div>
            <label htmlFor="form-name" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Contact Name *
            </label>
            <input
              type="text"
              id="form-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sarah Connor"
              className={`w-full px-3.5 py-2.5 text-xs rounded-xl glass-input ${
                errors.name ? 'border-danger focus:border-danger' : ''
              } text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500`}
            />
            {errors.name && <p className="mt-1 text-[10px] font-bold text-danger">{errors.name}</p>}
          </div>
 
          {/* 2. Company Input */}
          <div>
            <label htmlFor="form-company" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Company *
            </label>
            <input
              type="text"
              id="form-company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Cyberdyne Systems"
              className={`w-full px-3.5 py-2.5 text-xs rounded-xl glass-input ${
                errors.company ? 'border-danger focus:border-danger' : ''
              } text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500`}
            />
            {errors.company && <p className="mt-1 text-[10px] font-bold text-danger">{errors.company}</p>}
          </div>
 
          {/* 3. Email Input */}
          <div>
            <label htmlFor="form-email" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="form-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="sarah@cyberdyne.com"
              className={`w-full px-3.5 py-2.5 text-xs rounded-xl glass-input ${
                errors.email ? 'border-danger focus:border-danger' : ''
              } text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500`}
            />
            {errors.email && <p className="mt-1 text-[10px] font-bold text-danger">{errors.email}</p>}
          </div>
 
          {/* 4. Phone Input */}
          <div>
            <label htmlFor="form-phone" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              id="form-phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 0144"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>
 
          {/* 5. Est Value Input */}
          <div>
            <label htmlFor="form-value" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Estimated Value (USD)
            </label>
            <input
              type="number"
              id="form-value"
              name="value"
              value={formData.value}
              onChange={handleChange}
              placeholder="25000"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>
 
          {/* 6. Status Stage */}
          <div>
            <label htmlFor="form-status" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Status Stage
            </label>
            <select
              id="form-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2.5 text-xs rounded-xl glass-input text-slate-800 dark:text-white cursor-pointer"
            >
              {statusOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">{opt}</option>
              ))}
            </select>
          </div>
 
          {/* 7. Source Channel (full-width on desktop) */}
          <div className="sm:col-span-2">
            <label htmlFor="form-source" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Source Channel
            </label>
            <select
              id="form-source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="w-full px-3 py-2.5 text-xs rounded-xl glass-input text-slate-800 dark:text-white cursor-pointer"
            >
              {sourceOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">{opt}</option>
              ))}
            </select>
          </div>
 
        </div>
      </div>
 
      {/* Fixed footer CTA */}
      <div className="flex justify-end gap-3 p-6 border-t border-border/40 dark:border-border/10 bg-bg/20 dark:bg-surface/20 shrink-0">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-body dark:text-muted border border-border/60 dark:border-border/10 hover:bg-hover dark:hover:bg-hover rounded-xl cursor-pointer transition-all active:scale-97"
        >
          Cancel
        </button>
        <ShimmerButton
          type="submit"
          px="px-4"
          py="py-2"
          className="border border-blue-400/20"
        >
          {initialData ? 'Save Changes' : 'Create Lead'}
        </ShimmerButton>
      </div>
    </form>
  );
};

export default LeadForm;
