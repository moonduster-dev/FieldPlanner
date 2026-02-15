import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'fieldPlanner_customEquipment';

/**
 * Hook for managing custom equipment items
 * Saves user-entered equipment names so they can be reused across stations
 */
export const useCustomEquipment = () => {
  const [customEquipment, setCustomEquipment] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load custom equipment from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCustomEquipment(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load custom equipment:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save custom equipment to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customEquipment));
      } catch (error) {
        console.error('Failed to save custom equipment:', error);
      }
    }
  }, [customEquipment, isLoaded]);

  /**
   * Add a new custom equipment item
   * @param {string} equipmentName - Name of the equipment to add
   */
  const addEquipment = useCallback((equipmentName) => {
    const trimmed = equipmentName.trim();
    if (!trimmed) return;

    setCustomEquipment((prev) => {
      // Don't add duplicates (case-insensitive)
      if (prev.some(e => e.toLowerCase() === trimmed.toLowerCase())) {
        return prev;
      }
      return [...prev, trimmed];
    });
  }, []);

  /**
   * Remove a custom equipment item
   * @param {string} equipmentName - Name of the equipment to remove
   */
  const removeEquipment = useCallback((equipmentName) => {
    setCustomEquipment((prev) =>
      prev.filter((e) => e !== equipmentName)
    );
  }, []);

  /**
   * Clear all custom equipment
   */
  const clearAll = useCallback(() => {
    setCustomEquipment([]);
  }, []);

  return {
    customEquipment,
    isLoaded,
    addEquipment,
    removeEquipment,
    clearAll,
  };
};

export default useCustomEquipment;
