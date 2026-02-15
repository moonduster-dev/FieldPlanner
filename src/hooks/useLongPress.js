import { useCallback, useRef } from 'react';

/**
 * Hook for detecting long press on touch devices
 * @param {Function} onLongPress - Callback when long press is detected
 * @param {number} delay - Duration in ms to trigger long press (default: 500ms)
 * @returns {Object} Event handlers to attach to element
 */
export const useLongPress = (onLongPress, delay = 500) => {
  const timeoutRef = useRef(null);
  const targetRef = useRef(null);

  const start = useCallback(
    (event) => {
      // Store the target element
      targetRef.current = event.target;

      // Start the long press timer
      timeoutRef.current = setTimeout(() => {
        onLongPress(event);
      }, delay);
    },
    [onLongPress, delay]
  );

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return {
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchMove: clear,
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
  };
};

export default useLongPress;
