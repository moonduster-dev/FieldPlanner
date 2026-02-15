import { useState, useEffect, useCallback } from 'react';
import {
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION_NAME = 'equipmentTemplates';
const LOCAL_STORAGE_KEY = 'fieldPlanner_equipmentTemplates';

/**
 * Generate unique ID for templates
 */
const generateId = () => `equipment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Hook for managing saved equipment templates with Firestore sync
 */
export const useEquipmentTemplates = (templateDocId = 'default') => {
  const [templates, setTemplates] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);

  // Load templates from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${templateDocId}`);
      if (saved) {
        const parsedTemplates = JSON.parse(saved);
        setTemplates(parsedTemplates);
      }
    } catch (err) {
      console.error('Failed to load equipment templates:', err);
    }
    setIsLoaded(true);
  }, [templateDocId]);

  // Subscribe to Firestore updates
  useEffect(() => {
    const docRef = doc(db, COLLECTION_NAME, templateDocId);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.templates) {
            setTemplates(data.templates);
            localStorage.setItem(
              `${LOCAL_STORAGE_KEY}_${templateDocId}`,
              JSON.stringify(data.templates)
            );
          }
        }
        setError(null);
      },
      (err) => {
        console.error('Firestore equipment templates sync error:', err);
        setError(err.message);
      }
    );

    return () => unsubscribe();
  }, [templateDocId]);

  // Save templates to both Firestore and localStorage
  const saveTemplates = useCallback(async (newTemplates) => {
    setTemplates(newTemplates);

    localStorage.setItem(
      `${LOCAL_STORAGE_KEY}_${templateDocId}`,
      JSON.stringify(newTemplates)
    );

    setIsSyncing(true);
    try {
      const docRef = doc(db, COLLECTION_NAME, templateDocId);
      await setDoc(docRef, {
        templates: newTemplates,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setError(null);
    } catch (err) {
      console.error('Failed to sync equipment templates to Firestore:', err);
      setError(err.message);
    } finally {
      setIsSyncing(false);
    }
  }, [templateDocId]);

  /**
   * Save a new equipment template
   */
  const saveTemplate = useCallback((template) => {
    const newTemplate = {
      id: generateId(),
      ...template,
      createdAt: Date.now(),
    };
    const newTemplates = [...templates, newTemplate];
    saveTemplates(newTemplates);
    return newTemplate.id;
  }, [templates, saveTemplates]);

  /**
   * Delete an equipment template
   */
  const deleteTemplate = useCallback((templateId) => {
    const newTemplates = templates.filter((t) => t.id !== templateId);
    saveTemplates(newTemplates);
  }, [templates, saveTemplates]);

  /**
   * Update an equipment template
   */
  const updateTemplate = useCallback((templateId, updates) => {
    const newTemplates = templates.map((t) =>
      t.id === templateId ? { ...t, ...updates } : t
    );
    saveTemplates(newTemplates);
  }, [templates, saveTemplates]);

  return {
    templates,
    isLoaded,
    isSyncing,
    error,
    saveTemplate,
    deleteTemplate,
    updateTemplate,
  };
};

export default useEquipmentTemplates;
