import { useState, useCallback } from 'react';

/**
 * useLocalStorage custom hook
 * Syncs state with window.localStorage to persist preferences and data across browser sessions.
 * Fallbacks gracefully if localStorage is blocked (e.g. Incognito mode or private browsing configurations).
 * 
 * @template T
 * @param {string} key - LocalStorage registry key
 * @param {T} initialValue - Default state value to use if key is unassigned
 * @returns {[T, (value: T | ((val: T) => T)) => void]} - state value and state updater function
 */
const useLocalStorage = (key, initialValue) => {
  // Read state from localStorage
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue;
      }
      
      const item = window.localStorage.getItem(key);
      // Parse item if found, else fall back to initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a memoized setter function that handles function updates and localStorage writes
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error writing localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

export default useLocalStorage;
