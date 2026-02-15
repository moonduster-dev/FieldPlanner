import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION_NAME = 'fieldLayouts';
const LOCAL_STORAGE_KEY = 'fieldPlanner_items';

/**
 * Hook for syncing field items with Firestore
 * Uses a layout ID to identify the current layout
 * Falls back to localStorage if Firestore is unavailable
 */
export const useFirestoreSync = (layoutId = 'default') => {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);

  // Load from localStorage first (for offline support)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${layoutId}`);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Failed to load from localStorage:', err);
    }
    setIsLoaded(true);
  }, [layoutId]);

  // Subscribe to Firestore updates
  useEffect(() => {
    const docRef = doc(db, COLLECTION_NAME, layoutId);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.items) {
            setItems(data.items);
            // Also save to localStorage for offline access
            localStorage.setItem(
              `${LOCAL_STORAGE_KEY}_${layoutId}`,
              JSON.stringify(data.items)
            );
          }
        }
        setError(null);
      },
      (err) => {
        console.error('Firestore sync error:', err);
        setError(err.message);
        // Continue using localStorage data on error
      }
    );

    return () => unsubscribe();
  }, [layoutId]);

  // Save items to both Firestore and localStorage
  const saveItems = useCallback(async (newItems) => {
    setItems(newItems);

    // Save to localStorage immediately
    localStorage.setItem(
      `${LOCAL_STORAGE_KEY}_${layoutId}`,
      JSON.stringify(newItems)
    );

    // Sync to Firestore
    setIsSyncing(true);
    try {
      const docRef = doc(db, COLLECTION_NAME, layoutId);
      await setDoc(docRef, {
        items: newItems,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setError(null);
    } catch (err) {
      console.error('Failed to sync to Firestore:', err);
      setError(err.message);
    } finally {
      setIsSyncing(false);
    }
  }, [layoutId]);

  // Generate unique ID for items
  const generateId = useCallback(() => {
    return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Add item
  const addItem = useCallback((itemData) => {
    const newItem = {
      id: generateId(),
      ...itemData,
      createdAt: Date.now(),
    };
    const newItems = [...items, newItem];
    saveItems(newItems);
    return newItem.id;
  }, [items, saveItems, generateId]);

  // Update item
  const updateItem = useCallback((itemId, updates) => {
    const newItems = items.map((item) =>
      item.id === itemId ? { ...item, ...updates } : item
    );
    saveItems(newItems);
  }, [items, saveItems]);

  // Move item
  const moveItem = useCallback((itemId, x, y) => {
    const newItems = items.map((item) =>
      item.id === itemId ? { ...item, x, y } : item
    );
    saveItems(newItems);
  }, [items, saveItems]);

  // Remove item
  const removeItem = useCallback((itemId) => {
    const newItems = items.filter((item) => item.id !== itemId);
    saveItems(newItems);
  }, [items, saveItems]);

  // Clear all items
  const clearAll = useCallback(() => {
    saveItems([]);
  }, [saveItems]);

  // Load items (for import)
  const loadItems = useCallback((importedItems) => {
    saveItems(importedItems);
  }, [saveItems]);

  return {
    items,
    isLoaded,
    isSyncing,
    error,
    addItem,
    updateItem,
    moveItem,
    removeItem,
    clearAll,
    loadItems,
  };
};

export default useFirestoreSync;
