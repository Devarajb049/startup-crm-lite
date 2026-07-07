import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(undefined);

/**
 * AuthProvider Component
 * Exposes active session states, credentials verification, and account registration.
 * Synchronizes and persists session JWT token in localStorage under key 'crm-token'.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on component mount
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('crm-token');
      if (storedToken) {
        try {
          setToken(storedToken);
          // Restore user details from the /profile route
          const profileData = await authService.getProfile();
          // API returns response as success: true, data: user
          setUser(profileData.data || profileData);
        } catch (error) {
          console.error('Failed to restore user session:', error.message);
          // Token is invalid/expired; clear local credentials
          localStorage.removeItem('crm-token');
          localStorage.removeItem('startup-crm-auth-user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    restoreSession();
  }, []);

  /**
   * Logs a user in with given credentials.
   *
   * @param {string} email
   * @param {string} password
   */
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      // The API response contains { success: true, data: { token, user } }
      const { token: receivedToken, user: receivedUser } = response.data || response;
      
      localStorage.setItem('crm-token', receivedToken);
      localStorage.setItem('startup-crm-auth-user', JSON.stringify(receivedUser));
      
      setToken(receivedToken);
      setUser(receivedUser);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register a new user account.
   *
   * @param {string} name
   * @param {string} email
   * @param {string} password
   */
  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const response = await authService.register(name, email, password);
      // The API response contains { success: true, data: { token, user } }
      const { token: receivedToken, user: receivedUser } = response.data || response;
      
      localStorage.setItem('crm-token', receivedToken);
      localStorage.setItem('startup-crm-auth-user', JSON.stringify(receivedUser));
      
      setToken(receivedToken);
      setUser(receivedUser);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logs out the current user and clears session states.
   */
  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    setIsLoading(false);
    
    // Redirect to login screen
    if (window.location.hash) {
      window.location.href = '/#/login';
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth Custom Hook
 * Consumer hook allowing immediate access to AuthContext states and helpers.
 *
 * @returns {{ user: Object|null, token: string|null, isAuthenticated: boolean, isLoading: boolean, login: (email, password) => Promise<any>, register: (name, email, password) => Promise<any>, logout: () => void }}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be consumed inside an AuthProvider');
  }
  return context;
};
