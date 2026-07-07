import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

/**
 * @typedef {Object} SearchBarProps
 * @property {string} value - Parent state query value
 * @property {function} onChange - Change callback passing the search string
 */

/**
 * SearchBar Component
 * Controlled input offering debounced filtering for performance optimization.
 * Clears on X button click.
 * 
 * @param {SearchBarProps} props
 */
const SearchBar = ({ value, onChange }) => {
  // Local input value state to capture keystrokes immediately
  const [inputValue, setInputValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  // Synchronize local input state with parent state when modified externally (e.g. clear filters)
  if (value !== prevValue) {
    setInputValue(value);
    setPrevValue(value);
  }

  // Debouncing effect: updates parent state 300ms after user pauses typing
  useEffect(() => {
    const delayDebounceTimer = setTimeout(() => {
      // Avoid firing redundant triggers if text already matches
      if (inputValue !== value) {
        onChange(inputValue);
      }
    }, 300);

    // Cleanup timer on component unmount or state change
    return () => clearTimeout(delayDebounceTimer);
  }, [inputValue, onChange, value]);

  // Clears the input directly
  const handleClear = () => {
    setInputValue('');
    onChange('');
  };

  return (
    <div className="relative w-full">
      {/* Visual Search magnifying glass icon */}
      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 dark:text-slate-550">
        <Search size={15} />
      </span>

      {/* Interactive Search Input */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search by name, company, or email..."
        aria-label="Search leads, companies, and emails"
        className="w-full pl-9.5 pr-9 py-2.5 text-xs rounded-xl glass-input text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden"
      />

      {/* Clear Button (appears when input is not empty) */}
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer focus:outline-hidden"
          aria-label="Clear search input"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
