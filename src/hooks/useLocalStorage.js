import { useEffect, useRef, useCallback } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storage';

/**
 * Hook for auto-saving to localStorage with debounce
 * @param {Array} items - Items to save
 * @param {number} delay - Debounce delay in milliseconds
 */
export const useAutoSave = (items, delay = 1000) => {
  const timeoutRef = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip saving on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced save
    timeoutRef.current = setTimeout(() => {
      saveToLocalStorage(items);
    }, delay);

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [items, delay]);
};

/**
 * Hook to load initial items from localStorage
 * @returns {Array|null} Loaded items or null
 */
export const useLoadFromStorage = () => {
  return useCallback(() => {
    return loadFromLocalStorage();
  }, []);
};

export default useAutoSave;
