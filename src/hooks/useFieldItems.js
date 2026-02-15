import { useState, useCallback, useEffect } from 'react';
import { loadFromLocalStorage } from '../utils/storage';

/**
 * Generate unique ID for items
 */
const generateId = () => `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Hook for managing placed items on the field
 */
export const useFieldItems = () => {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load items from localStorage on mount
  useEffect(() => {
    const savedItems = loadFromLocalStorage();
    if (savedItems && savedItems.length > 0) {
      setItems(savedItems);
    }
    setIsLoaded(true);
  }, []);

  /**
   * Add a new item to the field
   * @param {Object} item - Item data (type, x, y, label, etc.)
   * @returns {string} The ID of the new item
   */
  const addItem = useCallback((item) => {
    const id = generateId();
    const newItem = {
      id,
      ...item,
      createdAt: Date.now(),
    };

    setItems((prev) => [...prev, newItem]);
    return id;
  }, []);

  /**
   * Update an existing item
   * @param {string} id - Item ID
   * @param {Object} updates - Partial item data to update
   */
  const updateItem = useCallback((id, updates) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...updates, updatedAt: Date.now() }
          : item
      )
    );
  }, []);

  /**
   * Move an item to new coordinates
   * @param {string} id - Item ID
   * @param {number} x - New X position
   * @param {number} y - New Y position
   */
  const moveItem = useCallback((id, x, y) => {
    updateItem(id, { x, y });
  }, [updateItem]);

  /**
   * Remove an item from the field
   * @param {string} id - Item ID to remove
   */
  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  /**
   * Clear all items from the field
   */
  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  /**
   * Load items from external source (e.g., imported JSON)
   * @param {Array} newItems - Array of items to load
   */
  const loadItems = useCallback((newItems) => {
    // Ensure all items have valid IDs
    const itemsWithIds = newItems.map((item) => ({
      ...item,
      id: item.id || generateId(),
    }));
    setItems(itemsWithIds);
  }, []);

  /**
   * Get an item by ID
   * @param {string} id - Item ID
   * @returns {Object|undefined} The item or undefined
   */
  const getItem = useCallback((id) => {
    return items.find((item) => item.id === id);
  }, [items]);

  return {
    items,
    isLoaded,
    addItem,
    updateItem,
    moveItem,
    removeItem,
    clearAll,
    loadItems,
    getItem,
  };
};

export default useFieldItems;
