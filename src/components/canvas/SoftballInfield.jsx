import { Group, Line, Circle, Rect, Shape, Text } from 'react-konva';
import { SOFTBALL, feetToPixels } from '../../constants/fieldDimensions';

/**
 * Softball Infield Component
 * Draws a regulation 60-foot baseline softball diamond
 *
 * @param {Object} props
 * @param {number} props.x - X position of home plate
 * @param {number} props.y - Y position of home plate
 * @param {boolean} props.draggable - Whether the infield can be dragged
 * @param {Function} props.onDragEnd - Callback when drag ends
 */
const SoftballInfield = ({
  x,
  y,
  draggable = true,
  onDragEnd,
  onDragMove,
  id,
}) => {
  const baseline = feetToPixels(SOFTBALL.BASELINE);
  const pitchingDistance = feetToPixels(SOFTBALL.PITCHING_DISTANCE);
  const pitchingCircleRadius = feetToPixels(SOFTBALL.PITCHING_CIRCLE_RADIUS);
  const baseSize = feetToPixels(SOFTBALL.BASE_SIZE);

  // Diamond is rotated 45 degrees, so we calculate positions
  // Home plate is at the bottom point of the diamond
  // The diamond extends upward from home plate

  // Calculate base positions (diamond rotated so home is at bottom)
  // Using a coordinate system where home plate is origin
  const halfDiagonal = baseline * Math.SQRT2 / 2;

  // Positions relative to home plate
  const firstBase = { x: baseline, y: -baseline };
  const secondBase = { x: 0, y: -baseline * Math.SQRT2 };
  const thirdBase = { x: -baseline, y: -baseline };
  const pitcherMound = { x: 0, y: -pitchingDistance };

  // Colors
  const dirtColor = '#C4A675';
  const lineColor = '#FFFFFF';
  const baseColor = '#FFFFFF';
  const grassColor = 'transparent'; // Inherit from field

  return (
    <Group
      x={x}
      y={y}
      draggable={draggable}
      onDragEnd={onDragEnd}
      onDragMove={onDragMove}
      id={id}
    >
      {/* Dirt infield area - diamond shape */}
      <Shape
        sceneFunc={(context, shape) => {
          context.beginPath();
          // Draw diamond shape for dirt infield
          // Start at home, go to first, second, third, back to home
          context.moveTo(0, 0); // Home
          context.lineTo(firstBase.x, firstBase.y); // First
          context.lineTo(secondBase.x, secondBase.y); // Second
          context.lineTo(thirdBase.x, thirdBase.y); // Third
          context.closePath();
          context.fillStrokeShape(shape);
        }}
        fill={dirtColor}
        opacity={0.8}
      />

      {/* Base lines */}
      <Line
        points={[0, 0, firstBase.x, firstBase.y]}
        stroke={lineColor}
        strokeWidth={2}
      />
      <Line
        points={[firstBase.x, firstBase.y, secondBase.x, secondBase.y]}
        stroke={lineColor}
        strokeWidth={2}
      />
      <Line
        points={[secondBase.x, secondBase.y, thirdBase.x, thirdBase.y]}
        stroke={lineColor}
        strokeWidth={2}
      />
      <Line
        points={[thirdBase.x, thirdBase.y, 0, 0]}
        stroke={lineColor}
        strokeWidth={2}
      />

      {/* Home plate */}
      <Shape
        sceneFunc={(context, shape) => {
          context.beginPath();
          // Home plate is pentagon shaped
          const size = baseSize * 2;
          context.moveTo(0, 0);
          context.lineTo(size / 2, -size / 3);
          context.lineTo(size / 2, -size);
          context.lineTo(-size / 2, -size);
          context.lineTo(-size / 2, -size / 3);
          context.closePath();
          context.fillStrokeShape(shape);
        }}
        fill={baseColor}
        stroke="#333"
        strokeWidth={1}
      />

      {/* First base */}
      <Rect
        x={firstBase.x - baseSize / 2}
        y={firstBase.y - baseSize / 2}
        width={baseSize}
        height={baseSize}
        fill={baseColor}
        stroke="#333"
        strokeWidth={1}
        rotation={45}
        offsetX={0}
        offsetY={0}
      />

      {/* Second base */}
      <Rect
        x={secondBase.x - baseSize / 2}
        y={secondBase.y - baseSize / 2}
        width={baseSize}
        height={baseSize}
        fill={baseColor}
        stroke="#333"
        strokeWidth={1}
        rotation={45}
      />

      {/* Third base */}
      <Rect
        x={thirdBase.x - baseSize / 2}
        y={thirdBase.y - baseSize / 2}
        width={baseSize}
        height={baseSize}
        fill={baseColor}
        stroke="#333"
        strokeWidth={1}
        rotation={45}
      />

      {/* Pitcher's circle */}
      <Circle
        x={pitcherMound.x}
        y={pitcherMound.y}
        radius={pitchingCircleRadius}
        stroke={lineColor}
        strokeWidth={2}
        fill={dirtColor}
        opacity={0.9}
      />

      {/* Pitcher's rubber */}
      <Rect
        x={pitcherMound.x - feetToPixels(2)}
        y={pitcherMound.y - feetToPixels(0.5)}
        width={feetToPixels(4)}
        height={feetToPixels(1)}
        fill={baseColor}
        stroke="#333"
        strokeWidth={1}
      />

      {/* Batter's boxes (left and right) */}
      <Rect
        x={-feetToPixels(4) - feetToPixels(3)}
        y={-feetToPixels(7)}
        width={feetToPixels(4)}
        height={feetToPixels(6)}
        stroke={lineColor}
        strokeWidth={1}
        fill="transparent"
      />
      <Rect
        x={feetToPixels(3)}
        y={-feetToPixels(7)}
        width={feetToPixels(4)}
        height={feetToPixels(6)}
        stroke={lineColor}
        strokeWidth={1}
        fill="transparent"
      />

      {/* Catcher's box */}
      <Rect
        x={-feetToPixels(4.5)}
        y={feetToPixels(0.5)}
        width={feetToPixels(9)}
        height={feetToPixels(8)}
        stroke={lineColor}
        strokeWidth={1}
        fill="transparent"
      />
    </Group>
  );
};

export default SoftballInfield;
