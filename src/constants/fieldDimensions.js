// Field Planner - Coordinate System & Scaling Constants
// All measurements in feet, converted to pixels at SCALE ratio

export const SCALE = 3; // pixels per foot

// Football Field Dimensions (in feet)
export const FOOTBALL = {
  // Playing field (100 yards = 300 feet)
  FIELD_LENGTH: 300,
  // End zones (10 yards each = 30 feet each side)
  ENDZONE_LENGTH: 30,
  // Total length including end zones
  TOTAL_LENGTH: 360,
  // Width (53 1/3 yards = 160 feet)
  WIDTH: 160,
  // Yard line spacing
  YARD_LINE_SPACING: 15, // 5 yards = 15 feet
  // Hash marks from sideline (college: 60 feet from sideline)
  HASH_FROM_SIDELINE: 60,
};

// Running Track Dimensions (in feet)
export const TRACK = {
  // 8 lanes, approximately 1.22m (4 feet) per lane + line width
  LANE_WIDTH: 5.25,
  LANE_COUNT: 8,
  // Total track width (one side)
  TOTAL_WIDTH: 42,
};

// Canvas Dimensions (in feet, then converted to pixels)
export const CANVAS = {
  // Total width: field width + track on both sides
  WIDTH_FT: FOOTBALL.WIDTH + TRACK.TOTAL_WIDTH * 2, // 244 ft
  // Total height: field length + track on both ends
  HEIGHT_FT: FOOTBALL.TOTAL_LENGTH + TRACK.TOTAL_WIDTH * 2, // 444 ft
  // Pixel dimensions
  get WIDTH_PX() {
    return this.WIDTH_FT * SCALE; // 732 px
  },
  get HEIGHT_PX() {
    return this.HEIGHT_FT * SCALE; // 1332 px
  },
};

// Center Logo Dimensions (in feet)
export const LOGO = {
  WIDTH: 150,
  HEIGHT: 150,
};

// Softball Field Dimensions (in feet)
export const SOFTBALL = {
  // Baseline distance (regulation fastpitch)
  BASELINE: 60,
  // Pitching distance
  PITCHING_DISTANCE: 43,
  // Pitcher's circle radius
  PITCHING_CIRCLE_RADIUS: 8,
  // Base size
  BASE_SIZE: 2,
  // Outfield arc radius (approximate)
  OUTFIELD_RADIUS: 220,
};

// Item Dimensions (in pixels)
export const ITEMS = {
  COACH_SIZE: 48, // pixels
  EQUIPMENT_SIZE: 40, // pixels
};

// Helper function to convert feet to pixels
export const feetToPixels = (feet) => feet * SCALE;

// Helper function to convert pixels to feet
export const pixelsToFeet = (pixels) => pixels / SCALE;

// Get field origin (top-left of football field within canvas)
export const getFieldOrigin = () => ({
  x: TRACK.TOTAL_WIDTH * SCALE, // offset for track
  y: TRACK.TOTAL_WIDTH * SCALE, // offset for track
});
