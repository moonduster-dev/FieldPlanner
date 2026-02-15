import { Group, Rect, Line, Arc, Text, Circle } from 'react-konva';
import {
  FOOTBALL,
  TRACK,
  feetToPixels,
} from '../../constants/fieldDimensions';
import CenterLogo from './CenterLogo';

/**
 * Draw the running track (oval surrounding football field)
 * Track runs lengthwise - straight sections on left/right, curves at top/bottom
 */
const RunningTrack = () => {
  const trackColor = '#D2691E'; // Russet/brown track color
  const laneLineColor = '#FFFFFF';

  const fieldWidth = feetToPixels(FOOTBALL.WIDTH);
  const fieldLength = feetToPixels(FOOTBALL.TOTAL_LENGTH);
  const trackWidth = feetToPixels(TRACK.TOTAL_WIDTH);
  const laneWidth = feetToPixels(TRACK.LANE_WIDTH);

  // Total canvas dimensions
  const totalWidth = fieldWidth + trackWidth * 2;
  const totalHeight = fieldLength + trackWidth * 2;

  const lanes = [];

  // Draw lane lines for LEFT straight section (along the length)
  for (let i = 0; i <= TRACK.LANE_COUNT; i++) {
    const offset = i * laneWidth;
    lanes.push(
      <Line
        key={`left-straight-${i}`}
        points={[
          offset,
          trackWidth,
          offset,
          trackWidth + fieldLength,
        ]}
        stroke={laneLineColor}
        strokeWidth={1}
        opacity={0.5}
      />
    );
  }

  // Draw lane lines for RIGHT straight section (along the length)
  for (let i = 0; i <= TRACK.LANE_COUNT; i++) {
    const offset = i * laneWidth;
    lanes.push(
      <Line
        key={`right-straight-${i}`}
        points={[
          trackWidth + fieldWidth + offset,
          trackWidth,
          trackWidth + fieldWidth + offset,
          trackWidth + fieldLength,
        ]}
        stroke={laneLineColor}
        strokeWidth={1}
        opacity={0.5}
      />
    );
  }

  // Draw TOP curved section lanes (semicircle at top)
  for (let i = 0; i <= TRACK.LANE_COUNT; i++) {
    lanes.push(
      <Arc
        key={`top-curve-${i}`}
        x={trackWidth + fieldWidth / 2}
        y={trackWidth}
        innerRadius={fieldWidth / 2 + i * laneWidth}
        outerRadius={fieldWidth / 2 + i * laneWidth + 1}
        angle={180}
        rotation={180}
        fill={laneLineColor}
        opacity={0.5}
      />
    );
  }

  // Draw BOTTOM curved section lanes (semicircle at bottom)
  for (let i = 0; i <= TRACK.LANE_COUNT; i++) {
    lanes.push(
      <Arc
        key={`bottom-curve-${i}`}
        x={trackWidth + fieldWidth / 2}
        y={trackWidth + fieldLength}
        innerRadius={fieldWidth / 2 + i * laneWidth}
        outerRadius={fieldWidth / 2 + i * laneWidth + 1}
        angle={180}
        rotation={0}
        fill={laneLineColor}
        opacity={0.5}
      />
    );
  }

  return (
    <Group>
      {/* Track base - left straight section */}
      <Rect
        x={0}
        y={trackWidth}
        width={trackWidth}
        height={fieldLength}
        fill={trackColor}
      />
      {/* Track base - right straight section */}
      <Rect
        x={trackWidth + fieldWidth}
        y={trackWidth}
        width={trackWidth}
        height={fieldLength}
        fill={trackColor}
      />
      {/* Top curved end (semicircle) */}
      <Circle
        x={trackWidth + fieldWidth / 2}
        y={trackWidth}
        radius={fieldWidth / 2 + trackWidth}
        fill={trackColor}
      />
      {/* Bottom curved end (semicircle) */}
      <Circle
        x={trackWidth + fieldWidth / 2}
        y={trackWidth + fieldLength}
        radius={fieldWidth / 2 + trackWidth}
        fill={trackColor}
      />
      {lanes}
    </Group>
  );
};

/**
 * Draw the football field with yard lines, hash marks, and end zones
 */
const FootballField = () => {
  const fieldGreen = '#228B22'; // Forest green turf
  const endZoneColor = '#1a5f1a'; // Darker green for end zones
  const lineColor = '#FFFFFF';

  const fieldX = feetToPixels(TRACK.TOTAL_WIDTH);
  const fieldY = feetToPixels(TRACK.TOTAL_WIDTH);
  const fieldWidth = feetToPixels(FOOTBALL.WIDTH);
  const fieldLength = feetToPixels(FOOTBALL.TOTAL_LENGTH);
  const endzoneLength = feetToPixels(FOOTBALL.ENDZONE_LENGTH);
  const yardLineSpacing = feetToPixels(FOOTBALL.YARD_LINE_SPACING); // 5 yards = 15 feet
  const hashFromSideline = feetToPixels(FOOTBALL.HASH_FROM_SIDELINE);

  const yardLines = [];
  const hashMarks = [];
  const yardNumbers = [];

  // Draw yard lines (every 5 yards = 15 feet)
  // 20 intervals of 5 yards = 100 yards of playing field
  for (let i = 0; i <= 20; i++) {
    const y = fieldY + endzoneLength + i * yardLineSpacing;
    yardLines.push(
      <Line
        key={`yardline-${i}`}
        points={[fieldX, y, fieldX + fieldWidth, y]}
        stroke={lineColor}
        strokeWidth={2}
      />
    );
  }

  // Draw hash marks (at each yard line, offset from sidelines)
  for (let i = 1; i < 20; i++) {
    const y = fieldY + endzoneLength + i * yardLineSpacing;

    // Left hash marks
    hashMarks.push(
      <Line
        key={`hash-left-${i}`}
        points={[
          fieldX + hashFromSideline - 5,
          y,
          fieldX + hashFromSideline + 5,
          y,
        ]}
        stroke={lineColor}
        strokeWidth={2}
      />
    );

    // Right hash marks
    hashMarks.push(
      <Line
        key={`hash-right-${i}`}
        points={[
          fieldX + fieldWidth - hashFromSideline - 5,
          y,
          fieldX + fieldWidth - hashFromSideline + 5,
          y,
        ]}
        stroke={lineColor}
        strokeWidth={2}
      />
    );
  }

  // Draw yard numbers at 10-yard intervals (every 2nd line starting at line 2)
  // Numbers: 10, 20, 30, 40, 50, 40, 30, 20, 10
  const yardNumberValues = [10, 20, 30, 40, 50, 40, 30, 20, 10];
  for (let i = 0; i < yardNumberValues.length; i++) {
    // 10-yard lines are at positions 2, 4, 6, 8, 10, 12, 14, 16, 18
    const lineIndex = (i + 1) * 2;
    const y = fieldY + endzoneLength + lineIndex * yardLineSpacing;

    // Left side numbers
    yardNumbers.push(
      <Text
        key={`num-left-${i}`}
        x={fieldX + 20}
        y={y - 15}
        text={yardNumberValues[i].toString()}
        fontSize={24}
        fill={lineColor}
        fontStyle="bold"
        rotation={0}
      />
    );

    // Right side numbers (rotated)
    yardNumbers.push(
      <Text
        key={`num-right-${i}`}
        x={fieldX + fieldWidth - 20}
        y={y + 15}
        text={yardNumberValues[i].toString()}
        fontSize={24}
        fill={lineColor}
        fontStyle="bold"
        rotation={180}
      />
    );
  }

  return (
    <Group>
      {/* Main playing field */}
      <Rect
        x={fieldX}
        y={fieldY}
        width={fieldWidth}
        height={fieldLength}
        fill={fieldGreen}
      />

      {/* Top end zone */}
      <Rect
        x={fieldX}
        y={fieldY}
        width={fieldWidth}
        height={endzoneLength}
        fill={endZoneColor}
        stroke={lineColor}
        strokeWidth={2}
      />

      {/* Bottom end zone */}
      <Rect
        x={fieldX}
        y={fieldY + fieldLength - endzoneLength}
        width={fieldWidth}
        height={endzoneLength}
        fill={endZoneColor}
        stroke={lineColor}
        strokeWidth={2}
      />

      {/* Field outline */}
      <Rect
        x={fieldX}
        y={fieldY}
        width={fieldWidth}
        height={fieldLength}
        stroke={lineColor}
        strokeWidth={3}
        fill="transparent"
      />

      {yardLines}
      {hashMarks}
      {yardNumbers}
    </Group>
  );
};

/**
 * Complete field background with track, field, and logo
 *
 * @param {Object} props
 * @param {string} props.logoUrl - URL or data URL for center logo image
 */
const FieldBackground = ({ logoUrl }) => {
  return (
    <Group listening={false}>
      <RunningTrack />
      <FootballField />
      <CenterLogo logoUrl={logoUrl} />
    </Group>
  );
};

export default FieldBackground;
