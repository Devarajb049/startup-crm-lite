import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the Context for CRM state
const CRMContext = createContext();

// Mock Initial Leads data updated with exact status and source requirements
const INITIAL_LEADS = [
  {
    id: 'lead-1',
    name: 'Sarah Connor',
    company: 'Cyberdyne Systems',
    email: 'sarah@cyberdyne.com',
    phone: '+1 (555) 0144',
    value: 32000,
    status: 'Proposal Sent',
    source: 'LinkedIn',
    date: '2026-06-05',
  },
  {
    id: 'lead-2',
    name: 'Bruce Wayne',
    company: 'Wayne Enterprises',
    email: 'bruce@wayne.co',
    phone: '+1 (555) 0100',
    value: 85000,
    status: 'New',
    source: 'Referral',
    date: '2026-06-12',
  },
  {
    id: 'lead-3',
    name: 'Clark Kent',
    company: 'Daily Planet',
    email: 'clark@dailyplanet.com',
    phone: '+1 (555) 0121',
    value: 5000,
    status: 'Contacted',
    source: 'Email Campaign',
    date: '2026-06-14',
  },
  {
    id: 'lead-4',
    name: 'Tony Stark',
    company: 'Stark Industries',
    email: 'tony@stark.com',
    phone: '+1 (555) 0111',
    value: 120000,
    status: 'Won',
    source: 'Referral',
    date: '2026-06-02',
  },
  {
    id: 'lead-5',
    name: 'Peter Parker',
    company: 'Oscorp Labs',
    email: 'peter@bugle.com',
    phone: '+1 (555) 0188',
    value: 12500,
    status: 'Lost',
    source: 'Website',
    date: '2026-05-28',
  },
  {
    id: 'lead-6',
    name: 'Natasha Romanoff',
    company: 'SHIELD Tech',
    email: 'nat@shield.org',
    phone: '+1 (555) 0177',
    value: 45000,
    status: 'Proposal Sent',
    source: 'LinkedIn',
    date: '2026-06-08',
  },
  {
    id: 'lead-7',
    name: 'Barry Allen',
    company: 'STAR Laboratories',
    email: 'barry@starlabs.com',
    phone: '+1 (555) 0155',
    value: 18000,
    status: 'New',
    source: 'Website',
    date: '2026-06-15',
  },
  {
    id: 'lead-8',
    name: 'Diana Prince',
    company: 'Themyscira Museum',
    email: 'diana@museum.org',
    phone: '+1 (555) 0166',
    value: 25000,
    status: 'Meeting Scheduled',
    source: 'Other',
    date: '2026-06-10',
  },
  {
    id: 'lead-9',
    name: 'Arthur Curry',
    company: 'Atlantis Marine',
    email: 'arthur@atlantis.com',
    phone: '+1 (555) 0133',
    value: 9500,
    status: 'Lost',
    source: 'Cold Call',
    date: '2026-05-20',
  },
  {
    id: 'lead-10',
    name: 'Dev Johnson',
    company: 'Acme Corp',
    email: 'dev@acme.com',
    phone: '+1 (555) 0199',
    value: 15000,
    status: 'Won',
    source: 'Website',
    date: '2026-06-01',
  }
];

export const CRMProvider = ({ children }) => {
  // Leads state
  const [leads, setLeads] = useState(() => {
    const savedLeads = localStorage.getItem('aura-crm-leads');
    // Check if saved leads exist and have the 'status' key, else load updated mock data
    if (savedLeads) {
      try {
        const parsed = JSON.parse(savedLeads);
        if (parsed.length > 0 && 'status' in parsed[0]) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved leads', e);
      }
    }
    return INITIAL_LEADS;
  });

  // Global filters
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All');

  // Theme state: light or dark
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('aura-crm-theme');
    if (savedTheme) return savedTheme;
    return 'light';
  });

  // Save leads database change to local storage
  useEffect(() => {
    localStorage.setItem('aura-crm-leads', JSON.stringify(leads));
  }, [leads]);

  // Synchronize CSS class for theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('aura-crm-theme', theme);
  }, [theme]);

  // Toggle Theme helper
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Add a new lead
  const addLead = (newLead) => {
    const lead = {
      id: `lead-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...newLead,
      value: Number(newLead.value) || 0,
    };
    setLeads((prev) => [lead, ...prev]);
    return lead; // Return to allow toast messages or details
  };

  // Update an existing lead
  const updateLead = (id, updatedFields) => {
    let updatedLeadObj = null;
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === id) {
          updatedLeadObj = {
            ...lead,
            ...updatedFields,
            value: updatedFields.value !== undefined ? Number(updatedFields.value) : lead.value,
          };
          return updatedLeadObj;
        }
        return lead;
      })
    );
    return updatedLeadObj;
  };

  // Delete lead from registry
  const deleteLead = (id) => {
    let deletedLeadObj = leads.find(l => l.id === id);
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    return deletedLeadObj;
  };

  return (
    <CRMContext.Provider
      value={{
        leads,
        setLeads,
        searchQuery,
        setSearchQuery,
        stageFilter,
        setStageFilter,
        theme,
        toggleTheme,
        addLead,
        updateLead,
        deleteLead,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

// Hook for consuming the CRM Context
export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};
