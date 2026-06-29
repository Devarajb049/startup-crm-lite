import { useState, useMemo, useCallback } from 'react';
import { useLeads } from '../context/LeadContext';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import EmptyState from '../components/common/EmptyState';
import LeadTable from '../components/leads/LeadTable';
import LeadForm from '../components/leads/LeadForm';
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
  const { leads, addLead, updateLead, deleteLead, loadDemoLeads } = useLeads();

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
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
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all duration-150 active:scale-98 focus:outline-hidden shrink-0"
        >
          <Plus size={16} />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* 2. Search & Filter Bar Group */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white dark:bg-card-dark p-4 rounded-xl border border-slate-200 dark:border-border-dark shadow-xs">
        
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
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={handleCloseModal}
            aria-hidden="true"
          />

          {/* Modal content body card: full screen on mobile, centered max-w-lg on tablet+ */}
          <div className="relative w-full h-full sm:h-auto sm:max-w-lg bg-white dark:bg-gray-800 border-0 sm:border border-slate-200 dark:border-gray-700 sm:rounded-xl shadow-xl z-10 overflow-hidden transform transition-all max-h-screen sm:max-h-[90vh] flex flex-col animate-fade-in">
            
            {/* Title Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {selectedLead ? 'Modify Lead Details' : 'Register New Lead'}
              </h2>
              <button 
                type="button"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-500 dark:hover:text-slate-350 hover:bg-slate-100 dark:hover:bg-hover-dark transition-colors duration-150 focus:outline-hidden"
                onClick={handleCloseModal}
                aria-label="Close dialog modal"
              >
                <X size={17} />
              </button>
            </div>

            {/* Scrollable Form Body Container */}
            <div className="flex-1 overflow-y-auto p-6">
              <LeadForm 
                key={selectedLead?.id || 'new'}
                initialData={selectedLead} 
                onSubmit={handleFormSubmit} 
                onCancel={handleCloseModal} 
              />
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Leads;
