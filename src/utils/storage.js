// LocalStorage and JSON export utilities

const STORAGE_KEY = 'fieldPlanner_layout';

/**
 * Save layout to LocalStorage
 * @param {Array} items - Array of placed items
 */
export const saveToLocalStorage = (items) => {
  try {
    const data = JSON.stringify({
      version: 1,
      savedAt: new Date().toISOString(),
      items,
    });
    localStorage.setItem(STORAGE_KEY, data);
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
};

/**
 * Load layout from LocalStorage
 * @returns {Array|null} Array of items or null if not found
 */
export const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data);
    return parsed.items || [];
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

/**
 * Clear layout from LocalStorage
 */
export const clearLocalStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
    return false;
  }
};

/**
 * Export layout as JSON file download
 * @param {Array} items - Array of placed items
 * @param {string} filename - Name for the exported file
 */
export const exportToJson = (items, filename = 'field-layout.json') => {
  try {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      items,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Failed to export JSON:', error);
    return false;
  }
};

/**
 * Import layout from JSON file
 * @param {File} file - File object to import
 * @returns {Promise<Array>} Promise resolving to array of items
 */
export const importFromJson = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!data.items || !Array.isArray(data.items)) {
          reject(new Error('Invalid layout file format'));
          return;
        }
        resolve(data.items);
      } catch (error) {
        reject(new Error('Failed to parse JSON file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
