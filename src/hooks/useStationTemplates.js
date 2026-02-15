import { useState, useEffect, useCallback } from 'react';
import { seedStationTemplates } from '../data/seedStationTemplates';

const STORAGE_KEY = 'fieldPlanner_stationTemplates';

/**
 * Generate unique ID for templates
 */
const generateId = () => `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Hook for managing saved station templates
 */
export const useStationTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load templates from localStorage on mount, fall back to seed data
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedTemplates = JSON.parse(saved);
        if (parsedTemplates.length > 0) {
          setTemplates(parsedTemplates);
        } else {
          // No saved templates, use seed data
          setTemplates(seedStationTemplates);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(seedStationTemplates));
        }
      } else {
        // No localStorage data, use seed data
        setTemplates(seedStationTemplates);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedStationTemplates));
      }
    } catch (error) {
      console.error('Failed to load station templates:', error);
      // On error, use seed data
      setTemplates(seedStationTemplates);
    }
    setIsLoaded(true);
  }, []);

  // Save templates to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
      } catch (error) {
        console.error('Failed to save station templates:', error);
      }
    }
  }, [templates, isLoaded]);

  /**
   * Save a new station template
   */
  const saveTemplate = useCallback((template) => {
    const newTemplate = {
      id: generateId(),
      ...template,
      createdAt: Date.now(),
    };
    setTemplates((prev) => [...prev, newTemplate]);
    return newTemplate.id;
  }, []);

  /**
   * Delete a station template
   */
  const deleteTemplate = useCallback((templateId) => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId));
  }, []);

  /**
   * Update a station template
   */
  const updateTemplate = useCallback((templateId, updates) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === templateId ? { ...t, ...updates } : t
      )
    );
  }, []);

  return {
    templates,
    isLoaded,
    saveTemplate,
    deleteTemplate,
    updateTemplate,
  };
};

export default useStationTemplates;
