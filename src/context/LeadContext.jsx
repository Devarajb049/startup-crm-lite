import React, { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { sampleLeads } from '../data/sampleLeads';

/**
 * TypeScript-style shape definition of the Lead object
 * 
 * @typedef {Object} Lead
 * @property {string} id - Unique identifier (generates via Date.now())
 * @property {string} name - Full name of the contact person
 * @property {string} company - Name of the startup/organization
 * @property {string} email - Contact email address
 * @property {string} phone - Contact telephone number
 * @property {'New' | 'Contacted' | 'Meeting Scheduled' | 'Proposal Sent' | 'Won' | 'Lost'} status - Active stage of sales pipeline
 * @property {'Website' | 'Referral' | 'LinkedIn' | 'Cold Call' | 'Email Campaign' | 'Other'} source - Channel channel
 * @property {number} value - Estimated deal size value in USD
 * @property {string} createdAt - ISO date string timestamp
 */

// Create the Context object
const LeadContext = createContext(undefined);

/**
 * LeadProvider Component
 * Exposes opportunity leads database operations to child consumer layouts.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements
 */
export const LeadProvider = ({ children }) => {
  // Sync leads list to local storage utilizing our useLocalStorage custom hook
  const [leads, setLeads] = useLocalStorage('startup-crm-leads', sampleLeads);

  /**
   * Registers a new lead.
   * Generates a unique ID and attaches a createdAt timestamp.
   * 
   * @param {Omit<Lead, 'id' | 'createdAt'>} newLeadData - Lead input parameters
   * @returns {Lead} The created lead object
   */
  const addLead = (newLeadData) => {
    const lead = {
      ...newLeadData,
      id: `lead-${Date.now()}`,
      value: Number(newLeadData.value) || 0,
      createdAt: new Date().toISOString(),
      // Backward compatibility hook: date field
      date: new Date().toISOString().split('T')[0]
    };

    setLeads((prevLeads) => [lead, ...prevLeads]);
    return lead;
  };

  /**
   * Updates an existing lead record.
   * 
   * @param {string} id - Target lead identifier to search
   * @param {Partial<Lead>} updatedFields - Key-value map of updated parameters
   * @returns {Lead|null} The updated lead object, or null if not found
   */
  const updateLead = (id, updatedFields) => {
    let updatedLead = null;
    
    setLeads((prevLeads) =>
      prevLeads.map((lead) => {
        if (lead.id === id) {
          updatedLead = {
            ...lead,
            ...updatedFields,
            value: updatedFields.value !== undefined ? Number(updatedFields.value) : lead.value
          };
          return updatedLead;
        }
        return lead;
      })
    );

    return updatedLead;
  };

  /**
   * Deletes a lead record from the database.
   * 
   * @param {string} id - Target lead identifier to delete
   * @returns {Lead|null} The deleted lead object, or null if not found
   */
  const deleteLead = (id) => {
    const leadToDelete = leads.find((l) => l.id === id);
    if (!leadToDelete) return null;

    setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== id));
    return leadToDelete;
  };

  /**
   * Queries and returns a single lead by its identifier.
   * 
   * @param {string} id - Target lead identifier
   * @returns {Lead|undefined} The matched lead object, or undefined
   */
  const getLeadById = (id) => {
    return leads.find((lead) => lead.id === id);
  };

  return (
    <LeadContext.Provider
      value={{
        leads,
        addLead,
        updateLead,
        deleteLead,
        getLeadById
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};

/**
 * useLeads custom hook
 * Consumer hook allowing immediate access to LeadContext getters and mutators.
 * Throws a descriptive developer exception if used outside LeadProvider.
 * 
 * @returns {{ leads: Lead[], addLead: (data: Omit<Lead, 'id' | 'createdAt'>) => Lead, updateLead: (id: string, data: Partial<Lead>) => Lead, deleteLead: (id: string) => Lead, getLeadById: (id: string) => Lead }}
 */
export const useLeads = () => {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error('useLeads must be consumed inside a LeadProvider');
  }
  return context;
};
