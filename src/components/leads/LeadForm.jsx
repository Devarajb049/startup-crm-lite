import { useState } from 'react';
import { STATUS_OPTIONS, SOURCE_OPTIONS } from '../../constants';

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
 * @property {function} onCancel - Cancel cancel callback
 */

/**
 * LeadForm Component
 * Renders the form inputs for lead creation and modification.
 * Integrates error states and required validators.
 * 
 * @param {LeadFormProps} props
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 1. Name Input */}
      <div>
        <label htmlFor="form-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Contact Name *
        </label>
        <input
          type="text"
          id="form-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Sarah Connor"
          className={`w-full px-3.5 py-2 text-sm rounded-lg bg-white dark:bg-slate-950 border ${
            errors.name ? 'border-danger focus:ring-danger' : 'border-slate-200 dark:border-border-dark focus:ring-primary'
          } text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 transition-all placeholder-slate-400`}
        />
        {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
      </div>

      {/* 2. Company Input */}
      <div>
        <label htmlFor="form-company" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Company *
        </label>
        <input
          type="text"
          id="form-company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="e.g. Cyberdyne Systems"
          className={`w-full px-3.5 py-2 text-sm rounded-lg bg-white dark:bg-slate-950 border ${
            errors.company ? 'border-danger focus:ring-danger' : 'border-slate-200 dark:border-border-dark focus:ring-primary'
          } text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 transition-all placeholder-slate-400`}
        />
        {errors.company && <p className="mt-1 text-xs text-danger">{errors.company}</p>}
      </div>

      {/* 3. Email Input */}
      <div>
        <label htmlFor="form-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Email Address *
        </label>
        <input
          type="email"
          id="form-email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="sarah@cyberdyne.com"
          className={`w-full px-3.5 py-2 text-sm rounded-lg bg-white dark:bg-slate-950 border ${
            errors.email ? 'border-danger focus:ring-danger' : 'border-slate-200 dark:border-border-dark focus:ring-primary'
          } text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 transition-all placeholder-slate-400`}
        />
        {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
      </div>

      {/* 4. Phone Input */}
      <div>
        <label htmlFor="form-phone" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Phone Number
        </label>
        <input
          type="text"
          id="form-phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1 (555) 0144"
          className="w-full px-3.5 py-2 text-sm rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary transition-all placeholder-slate-400"
        />
      </div>

      {/* 5. Est Value Input */}
      <div>
        <label htmlFor="form-value" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Estimated Value (USD)
        </label>
        <input
          type="number"
          id="form-value"
          name="value"
          value={formData.value}
          onChange={handleChange}
          placeholder="25000"
          className="w-full px-3.5 py-2 text-sm rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary transition-all placeholder-slate-400"
        />
      </div>

      {/* 6. Dropdowns grid: Status and Source */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="form-status" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Status Stage
          </label>
          <select
            id="form-status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3.5 py-2 text-sm rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary transition-all"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="form-source" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Source Channel
          </label>
          <select
            id="form-source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full px-3.5 py-2 text-sm rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary transition-all"
          >
            {sourceOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 7. Action CTA buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold border border-slate-200 dark:border-border-dark hover:bg-slate-100 dark:hover:bg-hover-dark text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer transition-all active:scale-98"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-blue-700 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-98"
        >
          {initialData ? 'Save Changes' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;
