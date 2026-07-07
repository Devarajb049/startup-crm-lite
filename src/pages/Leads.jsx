import { useState, useMemo, useCallback, useEffect } from 'react';
import { useLeads } from '../context/LeadContext';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import EmptyState from '../components/common/EmptyState';
import LeadTable from '../components/leads/LeadTable';
import LeadForm from '../components/leads/LeadForm';
import ShimmerButton from '../components/common/ShimmerButton';
import { toast } from 'react-hot-toast';
import { Plus, X } from 'lucide-react';

/**
 * Leads Page Component
 * Manages the lead registration directory.
 * - Maintains search query & stage filter states
 * - Performs responsive CRUD tasks:
 *   - Create leads (launches LeadForm in modal)
 *   - Edit details (retrieves record and launches LeadForm in modal)
 *   - Delete records (dispatches action to global CRM state)
 * - Renders Toasts upon updates (green for success, red for deletion)
 */
const Leads = () => {
  // Pull database elements from Lead context
  const { leads, addLead, updateLead, deleteLead, loadDemoLeads, searchQuery, setSearchQuery } = useLeads();

  // Search and Filter states
  const [activeFilter, setActiveFilter] = useState('All');

  // Modal display and selection control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  // Derived filtered leads collection based on search keywords and status clicks
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => activeFilter === 'All' || lead.status === activeFilter)
      .filter((lead) =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [leads, activeFilter, searchQuery]);

  // Triggered when clicking + Add Lead
  const handleOpenAddModal = useCallback(() => {
    setSelectedLead(null);
    setIsModalOpen(true);
  }, []);

  // Triggered when clicking inline Edit button
  const handleOpenEditModal = useCallback((lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  }, []);

  // Closes form sheet and flushes selection memory
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedLead(null);
  }, []);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, handleCloseModal]);

  // Handles form submit (Creation or Updating)
  const handleFormSubmit = useCallback((data) => {
    if (selectedLead) {
      // Update action
      updateLead(selectedLead.id, data);
      toast.success(`Updated lead details for "${data.name}"`, {
        style: {
          background: '#22C55E',
          color: '#FFFFFF',
          fontWeight: 'bold',
        },
        duration: 3000,
      });
    } else {
      // Create action
      addLead(data);
      toast.success(`Registered new lead: "${data.name}"`, {
        style: {
          background: '#22C55E',
          color: '#FFFFFF',
          fontWeight: 'bold',
        },
        duration: 3000,
      });
    }
    handleCloseModal();
  }, [selectedLead, updateLead, addLead, handleCloseModal]);

  // Handles record deletion trigger
  const handleDeleteLead = useCallback((id) => {
    const deletedObj = deleteLead(id);
    if (deletedObj) {
      toast.error(`Removed lead record: "${deletedObj.name}"`, {
        style: {
          background: '#EF4444',
          color: '#FFFFFF',
          fontWeight: 'bold',
        },
        duration: 3000,
      });
    }
  }, [deleteLead]);

  // Reset filters helper
  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setActiveFilter('All');
  }, []);

  return (
    <div className="space-y-6">
      
      {/* 1. Page Header Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
            Lead Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Register and qualify opportunities. Track win rates, sources, and status transitions.
          </p>
        </div>
        
        {/* + Add Lead button */}
        <ShimmerButton
          onClick={handleOpenAddModal}
          className="shadow-md shadow-primary/10 border border-blue-400/20 shrink-0"
          title="Create New Lead"
          aria-label="Create New Lead"
        >
          <Plus size={16} />
          <span className="text-[11px] tracking-wide">Add New Lead</span>
        </ShimmerButton>
      </div>

      {/* 2. Search & Filter Bar Group */}
      <div className="flex flex-col gap-4 w-full glass-card p-4 rounded-2xl border border-slate-200/40 dark:border-white/5 shadow-xs">
        
        {/* Search Bar Input */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {/* Categories filters */}
        <FilterBar 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
          leads={leads} 
        />
        
      </div>

      {/* 3. Data Presentation Area */}
      {filteredLeads.length > 0 ? (
        <LeadTable 
          leads={filteredLeads} 
          onEditLead={handleOpenEditModal} 
          onDeleteLead={handleDeleteLead} 
        />
      ) : (
        <EmptyState 
          totalLeadsCount={leads.length} 
          onClearFilters={handleResetFilters} 
          onAddLeadClick={handleOpenAddModal} 
          onLoadDemoClick={loadDemoLeads}
        />
      )}

      {/* 4. CRUD Modal Sheet wrapper */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300"
            onClick={handleCloseModal}
            aria-hidden="true"
          />

          {/* Modal content body card: full screen on mobile, centered max-w-lg on tablet+ */}
          <div className="relative w-full sm:max-w-2xl bg-white/80 dark:bg-[#0F131C]/80 backdrop-blur-2xl border border-slate-200/40 dark:border-white/5 rounded-2xl shadow-2xl z-10 overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col animate-fade-in">
            
            {/* Title Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/40 dark:border-white/5 bg-slate-50/20 dark:bg-slate-950/20 shrink-0">
              <h2 className="text-xs sm:text-sm font-extrabold tracking-wider uppercase text-slate-900 dark:text-white">
                {selectedLead ? 'Modify Lead Details' : 'Register New Lead'}
              </h2>
              <button 
                type="button"
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-white/5 transition-colors focus:outline-hidden cursor-pointer"
                onClick={handleCloseModal}
                aria-label="Close dialog modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form Area */}
            <LeadForm 
              key={selectedLead?.id || 'new'}
              initialData={selectedLead} 
              onSubmit={handleFormSubmit} 
              onCancel={handleCloseModal} 
            />

          </div>

        </div>
      )}

    </div>
  );
};

export default Leads;
