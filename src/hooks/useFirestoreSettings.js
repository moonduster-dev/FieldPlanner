import { useState, useEffect, useCallback } from 'react';
import {
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION_NAME = 'fieldSettings';
const LOCAL_STORAGE_KEY = 'fieldPlanner_settings';

/**
 * Hook for syncing app settings (logo, etc.) with Firestore
 * Falls back to localStorage if Firestore is unavailable
 */
export const useFirestoreSettings = (settingsId = 'default') => {
  const [settings, setSettings] = useState({
    logoUrl: null,
    logoRotation: 90, // Default 90 degrees (sideways)
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);

  // Load from localStorage first (for offline support)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${settingsId}`);
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        setSettings(parsedSettings);
      }
    } catch (err) {
      console.error('Failed to load settings from localStorage:', err);
    }
    setIsLoaded(true);
  }, [settingsId]);

  // Subscribe to Firestore updates
  useEffect(() => {
    const docRef = doc(db, COLLECTION_NAME, settingsId);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const newSettings = {
            logoUrl: data.logoUrl || null,
            logoRotation: data.logoRotation !== undefined ? data.logoRotation : 90,
          };
          setSettings(newSettings);
          // Also save to localStorage for offline access
          localStorage.setItem(
            `${LOCAL_STORAGE_KEY}_${settingsId}`,
            JSON.stringify(newSettings)
          );
        }
        setError(null);
      },
      (err) => {
        console.error('Firestore settings sync error:', err);
        setError(err.message);
        // Continue using localStorage data on error
      }
    );

    return () => unsubscribe();
  }, [settingsId]);

  // Save settings to both Firestore and localStorage
  const saveSettings = useCallback(async (newSettings) => {
    const mergedSettings = { ...settings, ...newSettings };
    setSettings(mergedSettings);

    // Save to localStorage immediately
    localStorage.setItem(
      `${LOCAL_STORAGE_KEY}_${settingsId}`,
      JSON.stringify(mergedSettings)
    );

    // Sync to Firestore
    setIsSyncing(true);
    try {
      const docRef = doc(db, COLLECTION_NAME, settingsId);
      await setDoc(docRef, {
        ...mergedSettings,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setError(null);
    } catch (err) {
      console.error('Failed to sync settings to Firestore:', err);
      setError(err.message);
    } finally {
      setIsSyncing(false);
    }
  }, [settings, settingsId]);

  // Update logo
  const setLogoUrl = useCallback((logoUrl) => {
    saveSettings({ logoUrl });
  }, [saveSettings]);

  // Update logo rotation
  const setLogoRotation = useCallback((logoRotation) => {
    saveSettings({ logoRotation });
  }, [saveSettings]);

  // Rotate logo by 90 degrees
  const rotateLogo = useCallback(() => {
    const newRotation = ((settings.logoRotation || 90) + 90) % 360;
    saveSettings({ logoRotation: newRotation });
  }, [settings.logoRotation, saveSettings]);

  return {
    settings,
    logoUrl: settings.logoUrl,
    logoRotation: settings.logoRotation,
    isLoaded,
    isSyncing,
    error,
    setLogoUrl,
    setLogoRotation,
    rotateLogo,
    saveSettings,
  };
};

export default useFirestoreSettings;
