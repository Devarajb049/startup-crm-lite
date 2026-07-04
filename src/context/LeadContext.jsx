import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as leadService from '../services/leadService';
import { toast } from 'react-hot-toast';

const LeadContext = createContext(undefined);

/**
 * LeadProvider Component
 * Exposes opportunity leads database operations from the API and notifies components.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements
 */
export const LeadProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, pages: 1 });
  const [notifications, setNotifications] = useState([]);
  const [currency, setCurrencyState] = useState('₹');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically load currency preference and notifications from localStorage when user session changes
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLeads([]);
      setNotifications([]);
      setCurrencyState('₹');
      return;
    }

    const emailKey = user.email.toLowerCase();
    const currencyKey = `startup-crm-currency-${emailKey}`;
    const notifsKey = `startup-crm-notifications-${emailKey}`;

    // Load currency preference
    const storedCurrency = localStorage.getItem(currencyKey) || '₹';
    setCurrencyState(storedCurrency);

    // Load local notification history
    try {
      const storedNotifs = localStorage.getItem(notifsKey);
      if (storedNotifs) {
        setNotifications(JSON.parse(storedNotifs));
      } else {
        setNotifications([]);
      }
    } catch (e) {
      console.error('Failed to parse notifications:', e);
      setNotifications([]);
    }

    // Load initial leads from the server API
    fetchLeads();
  }, [user, isAuthenticated]);

  /**
   * Helper: Saves notifications to local storage.
   */
  const saveNotifications = (updatedNotifs) => {
    if (!user) return;
    const emailKey = user.email.toLowerCase();
    const notifsKey = `startup-crm-notifications-${emailKey}`;
    localStorage.setItem(notifsKey, JSON.stringify(updatedNotifs));
    setNotifications(updatedNotifs);
  };

  const fetchLeads = async (params) => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const response = await leadService.getLeads({
        search: searchQuery || undefined,
        limit: 1000, // Load all leads to correctly drive local UI search, filters, and analytics
        ...params,
      });
      // The API response is: { success: true, data: [...], pagination: { ... } }
      setLeads(response.data || []);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to fetch leads from server';
      console.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch leads when the global search query changes
  useEffect(() => {
    if (isAuthenticated) {
      const delayDebounce = setTimeout(() => {
        fetchLeads();
      }, 350);
      return () => clearTimeout(delayDebounce);
    }
  }, [searchQuery, isAuthenticated]);

  /**
   * Add a new lead.
   * 
   * @param {Object} data - Lead input parameters
   * @returns {Promise<Object>} The created lead object
   */
  const addLead = async (data) => {
    setIsLoading(true);
    try {
      const response = await leadService.createLead(data);
      const newLead = response.data || response;
      setLeads((prev) => [newLead, ...prev]);
      
      toast.success('Lead created successfully');

      // Create a local notification
      const newNotif = {
        id: `notif-${Date.now()}`,
        title: 'New Lead Registered',
        message: `${newLead.name} from ${newLead.company} was added to the pipeline (${formatCurrency(newLead.value)}).`,
        type: 'info',
        read: false,
        time: 'Just now',
      };
      saveNotifications([newNotif, ...notifications]);

      return newLead;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to create lead';
      toast.error(errorMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update an existing lead record.
   * 
   * @param {string} id - Lead ID
   * @param {Object} updatedFields - Fields to update
   * @returns {Promise<Object>} The updated lead object
   */
  const updateLead = async (id, updatedFields) => {
    setIsLoading(true);
    try {
      let response;
      // Optimize: If updating only the status, call status update patch endpoint
      if (Object.keys(updatedFields).length === 1 && updatedFields.status) {
        response = await leadService.updateLeadStatus(id, updatedFields.status);
      } else {
        response = await leadService.updateLead(id, updatedFields);
      }
      const updated = response.data || response;
      
      // Update local state array
      setLeads((prev) => prev.map((l) => (l._id === id || l.id === id ? updated : l)));
      toast.success('Lead updated successfully');

      // Generate status change notification if stage modified
      const oldLead = leads.find((l) => l._id === id || l.id === id);
      if (oldLead && updatedFields.status && oldLead.status !== updatedFields.status) {
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
          message: `${updated.name} (${updated.company}) is now in stage "${updatedFields.status}".`,
          type,
          read: false,
          time: 'Just now',
        };
        saveNotifications([newNotif, ...notifications]);
      }

      return updated;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update lead';
      toast.error(errorMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Deletes a lead record.
   * 
   * @param {string} id - Target lead ID
   */
  const deleteLead = async (id) => {
    setIsLoading(true);
    try {
      const leadToDelete = leads.find((l) => l._id === id || l.id === id);
      await leadService.deleteLead(id);
      
      setLeads((prev) => prev.filter((l) => l._id !== id && l.id !== id));
      toast.success('Lead deleted successfully');

      // Generate deletion notification
      if (leadToDelete) {
        const newNotif = {
          id: `notif-${Date.now()}`,
          title: 'Lead Deleted',
          message: `${leadToDelete.name} from ${leadToDelete.company} was removed.`,
          type: 'danger',
          read: false,
          time: 'Just now',
        };
        saveNotifications([newNotif, ...notifications]);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to delete lead';
      toast.error(errorMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get a single lead from local state.
   */
  const getLeadById = (id) => {
    return leads.find((l) => l._id === id || l.id === id);
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
   * Formats numbers into currency text.
   */
  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    if (currency === '₹') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(num);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(num);
    }
  };

  /**
   * Formats numbers into shortened representations.
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
   * Seeding helper. Since we use a real DB backend, this will register sample leads on the API database.
   */
  const loadDemoLeads = async () => {
    setIsLoading(true);
    try {
      const sampleLeads = [
        { name: 'Amit Sharma', company: 'Zenith Tech', email: 'amit@zenith.com', phone: '9876543210', value: 85000, status: 'New', source: 'LinkedIn' },
        { name: 'Priya Patel', company: 'Nova Retail', email: 'priya@novaretail.com', phone: '9123456789', value: 120000, status: 'Contacted', source: 'Referral' },
        { name: 'Rahul Verma', company: 'Apex Ventures', email: 'rahul@apex.co', phone: '8888888888', value: 300000, status: 'Meeting Scheduled', source: 'Cold Call' },
      ];
      for (const sample of sampleLeads) {
        await leadService.createLead(sample);
      }
      await fetchLeads();
      toast.success('Sample Workspace Seeded 🎉');
    } catch (error) {
      toast.error('Failed to seed demo leads');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LeadContext.Provider
      value={{
        leads,
        isLoading,
        pagination,
        fetchLeads,
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
        loadDemoLeads,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};

/**
 * useLeads custom hook
 */
export const useLeads = () => {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error('useLeads must be consumed inside a LeadProvider');
  }
  return context;
};
