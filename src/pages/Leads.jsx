import { useState, useMemo, useCallback, useEffect } from 'react';
import { useLeads } from '../context/LeadContext';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import EmptyState from '../components/common/EmptyState';
import LeadTable from '../components/leads/LeadTable';
import LeadForm from '../components/leads/LeadForm';
import ShimmerButton from '../components/common/ShimmerButton';
import { toast } from 'react-hot-toast';
import { Plus, X, Download, Settings, Check, Info, FileSpreadsheet, AlertCircle, RefreshCw } from 'lucide-react';
import useDocumentMetadata from '../hooks/useDocumentMetadata';

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
  const { leads, addLead, updateLead, deleteLead, loadDemoLeads, searchQuery, setSearchQuery, fetchLeads } = useLeads();

  useDocumentMetadata(
    'Lead Directory | AuraCRM',
    'Search, filter, and manage your lead database, edit lead profiles, initiate contacts, and export to CSV.'
  );

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

  // State to track leads list refreshing
  const [isRefreshingLeads, setIsRefreshingLeads] = useState(false);

  // Trigger leads database update
  const handleRefreshLeads = useCallback(async () => {
    setIsRefreshingLeads(true);
    try {
      await fetchLeads();
      toast.success('Leads list updated.');
    } catch (e) {
      toast.error('Failed to update leads list.');
    } finally {
      setIsRefreshingLeads(false);
    }
  }, [fetchLeads]);

  // Available columns mapping for Export CSV selector
  const ALL_COLUMNS = useMemo(() => [
    { id: 'id', label: 'Lead ID' },
    { id: 'name', label: 'Lead Name' },
    { id: 'company', label: 'Company' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'source', label: 'Source Channel' },
    { id: 'status', label: 'Lead Status' },
    { id: 'priority', label: 'Priority' },
    { id: 'assignedTo', label: 'Assigned To' },
    { id: 'createdAt', label: 'Created Date' },
    { id: 'lastContact', label: 'Last Contact' },
    { id: 'updatedAt', label: 'Updated Date' },
    { id: 'tags', label: 'Tags' },
    { id: 'notes', label: 'Notes' }
  ], []);

  // Premium CSV Export Modal states
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportScope, setExportScope] = useState('filtered'); // 'all' | 'filtered' | 'page'
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [exportFilename, setExportFilename] = useState('');
  const [exportDelimiter, setExportDelimiter] = useState(',');
  const [exportEncoding, setExportEncoding] = useState('UTF-8');
  const [exportProgress, setExportProgress] = useState(null); // null | 'collecting' | 'formatting' | 'generating' | 'ready'
  const [exportProgressStep, setExportProgressStep] = useState(0); // 0 to 4

  // Open Export Modal setup
  const handleOpenExportModal = useCallback(() => {
    if (leads.length === 0) {
      toast.error('No leads available to export.', { id: 'no-leads-export' });
      return;
    }
    const dateStr = new Date().toISOString().split('T')[0];
    setExportFilename(`leads_${dateStr}.csv`);
    setExportScope(filteredLeads.length > 0 ? 'filtered' : 'all');
    setSelectedColumns(ALL_COLUMNS.map(c => c.id));
    setExportProgress(null);
    setExportProgressStep(0);
    setIsExportModalOpen(true);
  }, [leads, filteredLeads, ALL_COLUMNS]);

  // Execute export download pipeline with animations
  const triggerActualCSVExport = useCallback(async () => {
    // Progress Step animations
    setExportProgress('collecting');
    setExportProgressStep(1);
    await new Promise(r => setTimeout(r, 600));

    setExportProgress('formatting');
    setExportProgressStep(2);
    await new Promise(r => setTimeout(r, 600));

    setExportProgress('generating');
    setExportProgressStep(3);
    await new Promise(r => setTimeout(r, 650));

    setExportProgress('ready');
    setExportProgressStep(4);
    await new Promise(r => setTimeout(r, 350));

    try {
      // Resolve scope records
      let records = [];
      if (exportScope === 'all') {
        records = leads;
      } else if (exportScope === 'filtered') {
        records = filteredLeads;
      } else {
        // Current Page: top 25 records
        records = filteredLeads.slice(0, 25);
      }

      // Compile active columns headers and mappings
      const activeHeaders = ALL_COLUMNS.filter(c => selectedColumns.includes(c.id));
      const headersRow = activeHeaders.map(c => c.label).join(exportDelimiter);

      const escapeCSVValue = (val) => {
        if (val === null || val === undefined) return '';
        let strVal = String(val);
        strVal = strVal.replace(/"/g, '""');
        if (strVal.includes(exportDelimiter) || strVal.includes('"') || strVal.includes('\n') || strVal.includes('\r')) {
          return `"${strVal}"`;
        }
        return strVal;
      };

      const rows = records.map(lead => {
        return activeHeaders.map(col => {
          switch (col.id) {
            case 'id': return lead.id || lead._id || '';
            case 'name': return lead.name || '';
            case 'company': return lead.company || '';
            case 'email': return lead.email || '';
            case 'phone': return lead.phone || '';
            case 'source': return lead.source || '';
            case 'status': return lead.status || '';
            case 'value': return lead.value || 0;
            case 'createdAt': return lead.createdAt ? new Date(lead.createdAt).toISOString().split('T')[0] : '';
            case 'updatedAt': return lead.updatedAt ? new Date(lead.updatedAt).toISOString().split('T')[0] : '';
            case 'notes': return lead.notes || '';
            // Mapped schema placeholders
            case 'priority': return '';
            case 'assignedTo': return '';
            case 'lastContact': return '';
            case 'tags': return '';
            default: return '';
          }
        });
      });

      const csvContent = [
        headersRow,
        ...rows.map(r => r.map(escapeCSVValue).join(exportDelimiter))
      ].join('\r\n');

      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: `text/csv;charset=${exportEncoding === 'UTF-8' ? 'utf-8' : 'ascii'};` });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', exportFilename || `leads_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`CSV exported successfully. (File: ${exportFilename}, Records: ${records.length})`);
      setIsExportModalOpen(false);
    } catch (e) {
      console.error(e);
      toast.error('Failed to generate export file.');
    } finally {
      setExportProgress(null);
      setExportProgressStep(0);
    }
  }, [exportScope, selectedColumns, exportFilename, exportDelimiter, exportEncoding, leads, filteredLeads, ALL_COLUMNS]);

  return (
    <div className="space-y-6">
      
      {/* 1. Page Header Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl tracking-tight">
            Lead Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Register and qualify opportunities. Track win rates, sources, and status transitions.
          </p>
        </div>
        
        {/* Actions Button Group */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Refresh button */}
          <button
            type="button"
            onClick={handleRefreshLeads}
            disabled={isRefreshingLeads}
            className="p-2.5 rounded-xl border border-border/80 dark:border-border/10 text-slate-500 hover:text-slate-905 dark:text-slate-400 dark:hover:text-white bg-surface dark:bg-card hover:bg-hover active:scale-95 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            title="Refresh leads list"
          >
            <RefreshCw size={15} className={isRefreshingLeads ? 'animate-spin' : ''} />
          </button>

          {/* Download CSV Button */}
          <button
            type="button"
            onClick={handleOpenExportModal}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border border-border/80 dark:border-border/10 text-slate-805 dark:text-white bg-surface dark:bg-card hover:bg-hover active:scale-97 transition-all cursor-pointer shadow-xs"
            title="Download CSV"
          >
            <Download size={15} />
            <span className="text-[11px] tracking-wide">Download CSV</span>
          </button>

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
      </div>

      {/* 2. Search & Filter Bar Group */}
      <div className="flex flex-col gap-6 w-full glass-card p-6 rounded-2xl border border-border/40 dark:border-border/10 shadow-xs">
        
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
          <div className="relative w-full sm:max-w-2xl bg-card/85 dark:bg-card/85 backdrop-blur-2xl border border-border/40 dark:border-border/10 rounded-2xl shadow-2xl z-10 overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col animate-fade-in">
            
            {/* Title Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 dark:border-border/10 bg-bg/20 dark:bg-surface/20 shrink-0">
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

      {/* 5. PREMIUM ENTERPRISE EXPORT CSV MODAL */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300"
            onClick={() => !exportProgress && setIsExportModalOpen(false)}
            aria-hidden="true"
          />

          {/* Modal content body card: scrollable layout centered on screen */}
          <div className="relative w-full max-w-4xl bg-card/85 dark:bg-card/85 backdrop-blur-2xl border border-border/40 dark:border-border/10 rounded-2xl shadow-2xl z-10 overflow-hidden max-h-[92vh] flex flex-col animate-fade-in text-left">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 dark:border-border/10 bg-bg/20 dark:bg-surface/20 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                  <Download size={16} />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-extrabold tracking-wider uppercase text-slate-909 dark:text-white">
                    Export Leads Database
                  </h2>
                  <p className="text-[10px] text-slate-500 dark:text-slate-405 mt-0.5">
                    Export your lead data as a CSV file for reporting, analytics, or backup.
                  </p>
                </div>
              </div>
              <button 
                type="button"
                disabled={exportProgress !== null}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-white/5 transition-colors focus:outline-hidden cursor-pointer disabled:opacity-30"
                onClick={() => setIsExportModalOpen(false)}
                aria-label="Close export modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Side options: Scope and settings (5 cols) */}
                <div className="lg:col-span-5 space-y-5">
                  {/* Export Options */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-450 block">Export Scope Range</span>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2.5 p-3 rounded-xl border border-border/60 dark:border-border/10 bg-surface/30 dark:bg-surface/5 cursor-pointer hover:bg-hover transition-colors">
                        <input
                          type="radio"
                          name="exportScope"
                          checked={exportScope === 'all'}
                          onChange={() => setExportScope('all')}
                          disabled={exportProgress !== null}
                          className="w-3.5 h-3.5 text-primary border-border cursor-pointer focus:ring-0 focus:outline-hidden"
                        />
                        <div className="text-left">
                          <span className="text-xs font-bold text-slate-800 dark:text-white block">All Leads</span>
                          <span className="text-[9px] text-slate-500 font-semibold uppercase">{leads.length} Records</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 p-3 rounded-xl border border-border/60 dark:border-border/10 bg-surface/30 dark:bg-surface/5 cursor-pointer hover:bg-hover transition-colors">
                        <input
                          type="radio"
                          name="exportScope"
                          checked={exportScope === 'filtered'}
                          onChange={() => setExportScope('filtered')}
                          disabled={exportProgress !== null}
                          className="w-3.5 h-3.5 text-primary border-border cursor-pointer focus:ring-0 focus:outline-hidden"
                        />
                        <div className="text-left">
                          <span className="text-xs font-bold text-slate-800 dark:text-white block">Filtered Results Only</span>
                          <span className="text-[9px] text-slate-500 font-semibold uppercase">{filteredLeads.length} Records matching active searches/filters</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 p-3 rounded-xl border border-border/60 dark:border-border/10 bg-surface/30 dark:bg-surface/5 cursor-pointer hover:bg-hover transition-colors">
                        <input
                          type="radio"
                          name="exportScope"
                          checked={exportScope === 'page'}
                          onChange={() => setExportScope('page')}
                          disabled={exportProgress !== null}
                          className="w-3.5 h-3.5 text-primary border-border cursor-pointer focus:ring-0 focus:outline-hidden"
                        />
                        <div className="text-left">
                          <span className="text-xs font-bold text-slate-800 dark:text-white block">Current View Limit</span>
                          <span className="text-[9px] text-slate-500 font-semibold uppercase">First {Math.min(25, filteredLeads.length)} records list</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* File Settings */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-450 block">File Configurations</span>
                    
                    <div className="space-y-1.5">
                      <label htmlFor="filename" className="block text-[8px] font-bold text-slate-450 uppercase">Filename</label>
                      <input
                        id="filename"
                        type="text"
                        disabled={exportProgress !== null}
                        value={exportFilename}
                        onChange={(e) => setExportFilename(e.target.value)}
                        placeholder="leads_2026-07-10.csv"
                        className="block w-full px-3 py-2 text-xs rounded-xl glass-input text-slate-800 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="space-y-1.5">
                        <label htmlFor="delimiter" className="block text-[8px] font-bold text-slate-450 uppercase">Delimiter</label>
                        <select
                          id="delimiter"
                          disabled={exportProgress !== null}
                          value={exportDelimiter}
                          onChange={(e) => setExportDelimiter(e.target.value)}
                          className="block w-full px-2.5 py-1.5 text-xs rounded-xl glass-input text-slate-800 dark:text-white cursor-pointer"
                        >
                          <option value=",">Comma (,)</option>
                          <option value=";">Semicolon (;)</option>
                          <option value="&#9;">Tab (\t)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="encoding" className="block text-[8px] font-bold text-slate-450 uppercase">Encoding</label>
                        <select
                          id="encoding"
                          disabled={exportProgress !== null}
                          value={exportEncoding}
                          onChange={(e) => setExportEncoding(e.target.value)}
                          className="block w-full px-2.5 py-1.5 text-xs rounded-xl glass-input text-slate-800 dark:text-white cursor-pointer"
                        >
                          <option value="UTF-8">UTF-8</option>
                          <option value="ASCII">ASCII</option>
                        </select>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Side: Columns checklist grid (7 cols) */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-450 block">Select Columns to Export</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={exportProgress !== null}
                          onClick={() => setSelectedColumns(ALL_COLUMNS.map(c => c.id))}
                          className="text-[9px] font-bold text-primary hover:underline cursor-pointer disabled:opacity-30"
                        >
                          Select All
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          disabled={exportProgress !== null}
                          onClick={() => setSelectedColumns([])}
                          className="text-[9px] font-bold text-slate-450 hover:underline cursor-pointer disabled:opacity-30"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-border/40 dark:border-border/10 bg-surface/35 dark:bg-card/25 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {ALL_COLUMNS.map((col) => (
                        <label key={col.id} className="flex items-center gap-2.5 cursor-pointer text-xs select-none">
                          <input
                            type="checkbox"
                            checked={selectedColumns.includes(col.id)}
                            disabled={exportProgress !== null}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedColumns([...selectedColumns, col.id]);
                              } else {
                                setSelectedColumns(selectedColumns.filter(id => id !== col.id));
                              }
                            }}
                            className="w-3.5 h-3.5 text-primary border-border rounded-sm cursor-pointer focus:ring-0 focus:outline-hidden"
                          />
                          <span className="font-medium text-slate-700 dark:text-slate-350 truncate">{col.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Summary Glass Card */}
                  <div className="p-4 glass-card border border-border/40 dark:border-border/10 rounded-2xl bg-surface/40 dark:bg-card/15 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[8px] font-black text-slate-450 uppercase block">Selected Count</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {exportScope === 'all' ? leads.length : exportScope === 'filtered' ? filteredLeads.length : Math.min(25, filteredLeads.length)} Leads
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] font-black text-slate-450 uppercase block">Format & Encoding</span>
                      <span className="font-bold text-slate-900 dark:text-white">CSV ({exportEncoding})</span>
                    </div>
                    <div>
                      <span className="text-[8px] font-black text-slate-450 uppercase block">Active Filters</span>
                      <span className="font-semibold text-slate-600 dark:text-slate-400 block truncate">
                        Status: {activeFilter}, Query: "{searchQuery || 'None'}"
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] font-black text-slate-450 uppercase block font-mono">Est File Size</span>
                      <span className="font-semibold text-slate-650 dark:text-slate-400 block font-mono">
                        ~{(((exportScope === 'all' ? leads.length : filteredLeads.length) * selectedColumns.length * 15) / 1024).toFixed(2)} KB
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Live Preview Miniature Grid */}
              <div className="space-y-2">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-450 block">Leads CSV Live Export Preview (Top 5 rows)</span>
                <div className="rounded-2xl border border-border/30 dark:border-border/10 bg-bg/50 dark:bg-surface/30 overflow-hidden overflow-x-auto text-[10px]">
                  <table className="min-w-full divide-y divide-border/20 dark:divide-border/10 text-left">
                    <thead className="bg-bg/60 dark:bg-surface/45 uppercase text-[9px] font-bold text-slate-500">
                      <tr>
                        {ALL_COLUMNS.filter(c => selectedColumns.includes(c.id)).map(col => (
                          <th key={col.id} className="px-4 py-2 font-black">{col.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/10 dark:divide-border/5 text-slate-650 dark:text-slate-400">
                      {previewRows.map((lead, rIdx) => (
                        <tr key={rIdx} className="hover:bg-hover/20">
                          {ALL_COLUMNS.filter(c => selectedColumns.includes(c.id)).map(col => {
                            let text = '';
                            switch (col.id) {
                              case 'id': text = lead.id || lead._id || ''; break;
                              case 'name': text = lead.name || ''; break;
                              case 'company': text = lead.company || ''; break;
                              case 'email': text = lead.email || ''; break;
                              case 'phone': text = lead.phone || ''; break;
                              case 'source': text = lead.source || ''; break;
                              case 'status': text = lead.status || ''; break;
                              case 'value': text = lead.value || 0; break;
                              case 'createdAt': text = lead.createdAt ? new Date(lead.createdAt).toISOString().split('T')[0] : ''; break;
                              case 'updatedAt': text = lead.updatedAt ? new Date(lead.updatedAt).toISOString().split('T')[0] : ''; break;
                              case 'notes': text = lead.notes || ''; break;
                              default: text = ''; break;
                            }
                            return <td key={col.id} className="px-4 py-2 truncate max-w-[120px]" title={text}>{text}</td>;
                          })}
                        </tr>
                      ))}
                      {previewRows.length === 0 && (
                        <tr>
                          <td colSpan={selectedColumns.length || 1} className="px-4 py-6 text-center text-slate-450 italic">No records to preview. Change search range options.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Information Card */}
              <div className="p-3.5 bg-blue-50/40 dark:bg-blue-950/10 border border-blue-200/30 dark:border-blue-900/20 text-slate-700 dark:text-slate-350 rounded-xl text-[10px] leading-relaxed flex gap-2.5">
                <Info size={14} className="text-primary shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold">Export Helper Advice:</p>
                  <p>CSV files generated are fully compatible with Microsoft Excel, Google Sheets, LibreOffice, and Salesforce. Active filters currently selected in leads toolbar will restrict records in the "Filtered Results Only" scope.</p>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border/40 dark:border-border/10 bg-bg/20 dark:bg-surface/20 shrink-0 flex justify-end gap-3">
              <button
                type="button"
                disabled={exportProgress !== null}
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-border dark:border-border/20 text-slate-500 hover:text-slate-905 bg-surface dark:bg-card hover:bg-hover transition-all cursor-pointer disabled:opacity-30"
              >
                Cancel
              </button>
              
              <ShimmerButton
                type="button"
                disabled={selectedColumns.length === 0 || exportProgress !== null}
                onClick={triggerActualCSVExport}
                className="border border-blue-400/20 shadow-md disabled:opacity-40"
              >
                <Download size={14} />
                <span>Export CSV File</span>
              </ShimmerButton>
            </div>

            {/* PROGRESS LOADING OVERLAY SCREEN */}
            {exportProgress !== null && (
              <div className="absolute inset-0 z-40 bg-slate-950/75 backdrop-blur-md flex flex-col items-center justify-center text-white text-center p-6 animate-fade-in select-none">
                <div className="max-w-sm space-y-6">
                  
                  {/* Rotating status wheel */}
                  <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <FileSpreadsheet size={24} className="text-primary" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold tracking-wider uppercase">Preparing your CSV...</h4>
                    <p className="text-[10px] text-slate-400">Attributing columns and formatting database records.</p>
                  </div>

                  {/* Progress stages timeline */}
                  <div className="space-y-2.5 text-xs text-left bg-white/5 border border-white/5 p-4.5 rounded-2xl w-64 mx-auto select-none">
                    <div className="flex items-center gap-3">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-black ${
                        exportProgressStep >= 1 ? 'bg-success text-white' : 'bg-white/15 text-white/50'
                      }`}>✓</span>
                      <span className={exportProgressStep === 1 ? 'font-bold text-primary animate-pulse' : 'text-slate-350 font-medium'}>Collecting database records</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-black ${
                        exportProgressStep >= 2 ? 'bg-success text-white' : 'bg-white/15 text-white/50'
                      }`}>✓</span>
                      <span className={exportProgressStep === 2 ? 'font-bold text-primary animate-pulse' : 'text-slate-350 font-medium'}>Formatting values & cells</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-black ${
                        exportProgressStep >= 3 ? 'bg-success text-white' : 'bg-white/15 text-white/50'
                      }`}>✓</span>
                      <span className={exportProgressStep === 3 ? 'font-bold text-primary animate-pulse' : 'text-slate-350 font-medium'}>Generating UTF-8 Blob file</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-black ${
                        exportProgressStep >= 4 ? 'bg-success text-white' : 'bg-white/15 text-white/50'
                      }`}>✓</span>
                      <span className={exportProgressStep === 4 ? 'font-bold text-success' : 'text-white/40 font-medium'}>File download ready</span>
                    </div>
                  </div>

                  {/* Animated Bar progress indicator */}
                  <div className="w-64 mx-auto bg-white/10 h-1.5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${(exportProgressStep / 4) * 100}%` }}
                    />
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Leads;
