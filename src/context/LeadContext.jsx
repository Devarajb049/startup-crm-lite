import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { sampleLeads } from '../data/sampleLeads';

/**
 * shape definition of the Lead object
 * 
 * @typedef {Object} Lead
 * @property {string} id - Unique identifier (generates via Date.now())
 * @property {string} name - Full name of the contact person
 * @property {string} company - Name of the startup/organization
 * @property {string} email - Contact email address
 * @property {string} phone - Contact telephone number
 * @property {'New' | 'Contacted' | 'Meeting Scheduled' | 'Proposal Sent' | 'Won' | 'Lost'} status - Active stage of sales pipeline
 * @property {'Website' | 'Referral' | 'LinkedIn' | 'Cold Call' | 'Email Campaign' | 'Other'} source - Channel channel
 * @property {number} value - Estimated deal size value in INR
 * @property {string} createdAt - ISO date string timestamp
 */

// Create the Context object
const LeadContext = createContext(undefined);

/**
 * LeadProvider Component
 * Exposes opportunity leads database operations and recent notifications to child consumer layouts.
 * Isolates data scoped by the currently logged-in user email.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements
 */
export const LeadProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [leads, setLeads] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currency, setCurrencyState] = useState('₹');

  // Dynamically load leads, notifications and currency when the user session changes
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLeads([]);
      setNotifications([]);
      setCurrencyState('₹');
      return;
    }

    const emailKey = user.email.toLowerCase();
    const leadsKey = `startup-crm-leads-${emailKey}`;
    const notifsKey = `startup-crm-notifications-${emailKey}`;
    const currencyKey = `startup-crm-currency-${emailKey}`;

    // Load currency preference
    const storedCurrency = localStorage.getItem(currencyKey) || '₹';
    setCurrencyState(storedCurrency);

    // Load leads
    try {
      const storedLeads = localStorage.getItem(leadsKey);
      if (storedLeads) {
        setLeads(JSON.parse(storedLeads));
      } else {
        // Pre-populate only if default admin; otherwise clean slate
        const initialLeads = emailKey === 'admin@auracrm.com' ? sampleLeads : [];
        localStorage.setItem(leadsKey, JSON.stringify(initialLeads));
        setLeads(initialLeads);
      }
    } catch (e) {
      console.error('Failed to parse leads from local storage:', e);
      setLeads([]);
    }

    // Load notifications
    try {
      const storedNotifs = localStorage.getItem(notifsKey);
      if (storedNotifs) {
        setNotifications(JSON.parse(storedNotifs));
      } else {
        localStorage.setItem(notifsKey, JSON.stringify([]));
        setNotifications([]);
      }
    } catch (e) {
      console.error('Failed to parse notifications from local storage:', e);
      setNotifications([]);
    }
  }, [user, isAuthenticated]);

  /**
   * Helper: Saves leads to local storage under user-specific key.
   */
  const saveLeads = (updatedLeads) => {
    if (!user) return;
    const emailKey = user.email.toLowerCase();
    const leadsKey = `startup-crm-leads-${emailKey}`;
    localStorage.setItem(leadsKey, JSON.stringify(updatedLeads));
    setLeads(updatedLeads);
  };

  /**
   * Helper: Saves notifications to local storage under user-specific key.
   */
  const saveNotifications = (updatedNotifs) => {
    if (!user) return;
    const emailKey = user.email.toLowerCase();
    const notifsKey = `startup-crm-notifications-${emailKey}`;
    localStorage.setItem(notifsKey, JSON.stringify(updatedNotifs));
    setNotifications(updatedNotifs);
  };

  /**
   * Update active display currency symbol.
   */
  const changeCurrency = (newSymbol) => {
    if (!user) return;
    const emailKey = user.email.toLowerCase();
    const currencyKey = `startup-crm-currency-${emailKey}`;
    localStorage.setItem(currencyKey, newSymbol);
    setCurrencyState(newSymbol);
  };

  /**
   * Formats standard numbers into localized currency display representation.
   */
  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    if (currency === '₹') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(num);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(num);
    }
  };

  /**
   * Formats numbers into a shortened string with currency symbols (e.g. ₹12L, $1.2M, $50k) for chart axes.
   */
  const formatCurrencyShort = (val) => {
    const num = Number(val) || 0;
    if (currency === '₹') {
      if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
      if (num >= 1000) return `₹${(num / 1000).toFixed(0)}k`;
      return `₹${num}`;
    } else {
      if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `$${(num / 1000).toFixed(0)}k`;
      return `$${num}`;
    }
  };

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
      date: new Date().toISOString().split('T')[0]
    };

    const updatedLeads = [lead, ...leads];
    saveLeads(updatedLeads);

    // Create a new unread notification
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: 'New Lead Registered',
      message: `${lead.name} from ${lead.company} was added to the pipeline (${formatCurrency(lead.value)}).`,
      type: 'info',
      read: false,
      time: 'Just now'
    };
    saveNotifications([newNotif, ...notifications]);

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
    const oldLead = leads.find((l) => l.id === id);

    const updatedLeads = leads.map((lead) => {
      if (lead.id === id) {
        updatedLead = {
          ...lead,
          ...updatedFields,
          value: updatedFields.value !== undefined ? Number(updatedFields.value) : lead.value
        };
        return updatedLead;
      }
      return lead;
    });

    saveLeads(updatedLeads);

    // Create a status change notification if stage modified
    if (updatedLead && oldLead && updatedFields.status && oldLead.status !== updatedFields.status) {
      let title = 'Lead Status Updated';
      let type = 'info';
      if (updatedFields.status === 'Won') {
        title = 'Deal Won! 🚀';
        type = 'success';
      } else if (updatedFields.status === 'Lost') {
        title = 'Deal Lost 😔';
        type = 'danger';
      } else if (updatedFields.status === 'Meeting Scheduled') {
        title = 'Meeting Scheduled 📅';
        type = 'warning';
      }

      const newNotif = {
        id: `notif-${Date.now()}`,
        title,
        message: `${updatedLead.name} (${updatedLead.company}) is now in stage "${updatedFields.status}".`,
        type,
        read: false,
        time: 'Just now'
      };
      saveNotifications([newNotif, ...notifications]);
    }

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

    const updatedLeads = leads.filter((lead) => lead.id !== id);
    saveLeads(updatedLeads);

    // Create a lead deletion notification
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: 'Lead Deleted',
      message: `${leadToDelete.name} from ${leadToDelete.company} was removed from opportunities.`,
      type: 'danger',
      read: false,
      time: 'Just now'
    };
    saveNotifications([newNotif, ...notifications]);

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

  // Notification action handlers
  const markNotificationAsRead = (id) => {
    const updatedNotifs = notifications.map((notif) =>
      notif.id === id ? { ...notif, read: true } : notif
    );
    saveNotifications(updatedNotifs);
  };

  const markAllNotificationsAsRead = () => {
    const updatedNotifs = notifications.map((notif) => ({ ...notif, read: true }));
    saveNotifications(updatedNotifs);
  };

  const clearNotifications = () => {
    saveNotifications([]);
  };

  const deleteNotification = (id) => {
    const updatedNotifs = notifications.filter((notif) => notif.id !== id);
    saveNotifications(updatedNotifs);
  };

  /**
   * Pre-populates the workspace leads database with rich sample data.
   */
  const loadDemoLeads = () => {
    // Generate fresh IDs/timestamps for current user instance
    const freshSampleLeads = sampleLeads.map((lead, idx) => ({
      ...lead,
      id: `lead-${Date.now()}-${idx}`,
      createdAt: new Date(Date.now() - idx * 24 * 60 * 60 * 1000).toISOString(),
      date: new Date(Date.now() - idx * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));

    saveLeads(freshSampleLeads);

    const newNotif = {
      id: `notif-${Date.now()}`,
      title: 'Sample Workspace Seeded 🎉',
      message: 'Workspace leads database initialized with 10 enterprise opportunities.',
      type: 'success',
      read: false,
      time: 'Just now'
    };
    saveNotifications([newNotif, ...notifications]);
  };

  return (
    <LeadContext.Provider
      value={{
        leads,
        addLead,
        updateLead,
        deleteLead,
        getLeadById,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        deleteNotification,
        currency,
        changeCurrency,
        formatCurrency,
        formatCurrencyShort,
        loadDemoLeads
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};

/**
 * useLeads custom hook
 * Consumer hook allowing immediate access to LeadContext getters, mutators, and notification history.
 * Throws a descriptive developer exception if used outside LeadProvider.
 * 
 * @returns {{ leads: Lead[], addLead: (data: Omit<Lead, 'id' | 'createdAt'>) => Lead, updateLead: (id: string, data: Partial<Lead>) => Lead, deleteLead: (id: string) => Lead, getLeadById: (id: string) => Lead, notifications: Array, markNotificationAsRead: (id: string) => void, markAllNotificationsAsRead: () => void, clearNotifications: () => void, deleteNotification: (id: string) => void, currency: string, changeCurrency: (symbol: string) => void, formatCurrency: (val: number) => string, formatCurrencyShort: (val: number) => string, loadDemoLeads: () => void }}
 */
export const useLeads = () => {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error('useLeads must be consumed inside a LeadProvider');
  }
  return context;
};
