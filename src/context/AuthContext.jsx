import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

// Initial registered users list containing the demo credentials
const defaultUsers = [
  {
    name: 'John Doe',
    email: 'admin@auracrm.com',
    password: 'password123'
  }
];

/**
 * AuthProvider Component
 * Exposes active session states, credentials verification, and account registration.
 * Persists session state in localStorage.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize registered users and check active sessions from localStorage
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('startup-crm-registered-users');
      if (storedUsers) {
        setRegisteredUsers(JSON.parse(storedUsers));
      } else {
        localStorage.setItem('startup-crm-registered-users', JSON.stringify(defaultUsers));
        setRegisteredUsers(defaultUsers);
      }

      const activeUser = localStorage.getItem('startup-crm-auth-user');
      if (activeUser) {
        setUser(JSON.parse(activeUser));
      }
    } catch (e) {
      console.error('Error initializing Auth context:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logs a user in with given credentials.
   * Throws an error if details are incorrect.
   * 
   * @param {string} email
   * @param {string} password
   */
  const login = (email, password) => {
    const matchedUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!matchedUser) {
      throw new Error('Invalid email or password. Hint: admin@auracrm.com / password123');
    }

    setUser(matchedUser);
    localStorage.setItem('startup-crm-auth-user', JSON.stringify(matchedUser));
  };

  /**
   * Registers a new user account and logs them in immediately.
   * Throws an error if the email is already in use.
   * 
   * @param {string} name
   * @param {string} email
   * @param {string} password
   */
  const register = (name, email, password) => {
    const emailExists = registeredUsers.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
      throw new Error('Email address is already in use.');
    }

    const newUser = { name, email, password };
    const updatedUsers = [...registeredUsers, newUser];

    setRegisteredUsers(updatedUsers);
    localStorage.setItem('startup-crm-registered-users', JSON.stringify(updatedUsers));
    
    // Automatically log in the newly registered user
    setUser(newUser);
    localStorage.setItem('startup-crm-auth-user', JSON.stringify(newUser));
  };

  /**
   * Logs out the current user, clearing session states.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('startup-crm-auth-user');
  };

  /**
   * Updates current user profile details in both active state and users database registry.
   * 
   * @param {Object} updatedFields
   */
  const updateProfile = (updatedFields) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      ...updatedFields
    };

    setUser(updatedUser);
    localStorage.setItem('startup-crm-auth-user', JSON.stringify(updatedUser));

    const updatedUsersList = registeredUsers.map((u) => 
      u.email.toLowerCase() === user.email.toLowerCase() ? { ...u, ...updatedFields } : u
    );
    setRegisteredUsers(updatedUsersList);
    localStorage.setItem('startup-crm-registered-users', JSON.stringify(updatedUsersList));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile
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
 * @returns {{ user: Object|null, isAuthenticated: boolean, isLoading: boolean, login: (email, password) => void, register: (name, email, password) => void, logout: () => void, updateProfile: (fields: Object) => void }}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be consumed inside an AuthProvider');
  }
  return context;
};
