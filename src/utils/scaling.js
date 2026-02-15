// Scaling utilities for coordinate conversion

import { SCALE, CANVAS, TRACK, FOOTBALL } from '../constants/fieldDimensions';

/**
 * Convert feet to pixels
 * @param {number} feet - Distance in feet
 * @returns {number} Distance in pixels
 */
export const feetToPixels = (feet) => feet * SCALE;

/**
 * Convert pixels to feet
 * @param {number} pixels - Distance in pixels
 * @returns {number} Distance in feet
 */
export const pixelsToFeet = (pixels) => pixels / SCALE;

/**
 * Get the origin point (top-left) of the football field on the canvas
 * The field is centered with track surrounding it
 * @returns {{x: number, y: number}} Origin coordinates in pixels
 */
export const getFieldOrigin = () => ({
  x: feetToPixels(TRACK.TOTAL_WIDTH),
  y: feetToPixels(TRACK.TOTAL_WIDTH),
});

/**
 * Get the center point of the football field
 * @returns {{x: number, y: number}} Center coordinates in pixels
 */
export const getFieldCenter = () => {
  const origin = getFieldOrigin();
  return {
    x: origin.x + feetToPixels(FOOTBALL.WIDTH) / 2,
    y: origin.y + feetToPixels(FOOTBALL.TOTAL_LENGTH) / 2,
  };
};

/**
 * Convert screen coordinates to canvas coordinates
 * @param {number} screenX - Screen X coordinate
 * @param {number} screenY - Screen Y coordinate
 * @param {Object} stage - Konva stage reference
 * @returns {{x: number, y: number}} Canvas coordinates
 */
export const screenToCanvas = (screenX, screenY, stage) => {
  const transform = stage.getAbsoluteTransform().copy();
  transform.invert();
  const pos = transform.point({ x: screenX, y: screenY });
  return pos;
};

/**
 * Get canvas dimensions in pixels
 * @returns {{width: number, height: number}}
 */
export const getCanvasDimensions = () => ({
  width: CANVAS.WIDTH_PX,
  height: CANVAS.HEIGHT_PX,
});

/**
 * Constrain a point to be within the canvas bounds
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} itemWidth - Width of the item
 * @param {number} itemHeight - Height of the item
 * @returns {{x: number, y: number}} Constrained coordinates
 */
export const constrainToCanvas = (x, y, itemWidth = 0, itemHeight = 0) => ({
  x: Math.max(0, Math.min(x, CANVAS.WIDTH_PX - itemWidth)),
  y: Math.max(0, Math.min(y, CANVAS.HEIGHT_PX - itemHeight)),
});
