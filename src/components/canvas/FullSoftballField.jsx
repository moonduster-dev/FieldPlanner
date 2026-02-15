import { Group, Line, Circle, Rect, Shape, Arc, Text } from 'react-konva';
import { feetToPixels } from '../../constants/fieldDimensions';

/**
 * Full Softball Field Component
 * Draws a complete softball field with semi-transparent green outfield
 * All dimensions proportional to football field (3px per foot)
 *
 * Regulation dimensions:
 * - 60ft baselines
 * - 43ft pitching distance
 * - 200ft outfield fence (from home plate)
 */
const FullSoftballField = ({ fenceDistance = 200 }) => {
  const baseline = feetToPixels(60);
  const pitchingDistance = feetToPixels(43);
  const pitchingCircleRadius = feetToPixels(8);
  const baseSize = feetToPixels(2);
  const fenceRadius = feetToPixels(fenceDistance);

  // Colors
  const grassColor = '#2d5a27';
  const dirtColor = '#C4A675';
  const lineColor = '#FFFFFF';
  const baseColor = '#FFFFFF';
  const fenceColor = '#1a1a1a';
  const warningTrackColor = '#8B4513';

  // Diamond positions (home plate at origin, field extends upward and outward)
  const firstBase = { x: baseline, y: -baseline };
  const secondBase = { x: 0, y: -baseline * Math.SQRT2 };
  const thirdBase = { x: -baseline, y: -baseline };
  const pitcherMound = { x: 0, y: -pitchingDistance };

  // Warning track width (10 feet)
  const warningTrackWidth = feetToPixels(10);

  // Foul pole positions
  const rfAngle = -Math.PI / 4;
  const lfAngle = -3 * Math.PI / 4;
  const rfFoulPole = {
    x: Math.cos(rfAngle) * fenceRadius,
    y: Math.sin(rfAngle) * fenceRadius
  };
  const lfFoulPole = {
    x: Math.cos(lfAngle) * fenceRadius,
    y: Math.sin(lfAngle) * fenceRadius
  };
  const centerField = { x: 0, y: -fenceRadius };

  return (
    <Group>
      {/* Outfield grass - semi-transparent green */}
      <Shape
        sceneFunc={(context, shape) => {
          context.beginPath();
          context.moveTo(0, 0);
          context.lineTo(rfFoulPole.x, rfFoulPole.y);
          context.arc(0, 0, fenceRadius, rfAngle, lfAngle, true);
          context.closePath();
          context.fillStrokeShape(shape);
        }}
        fill={grassColor}
        opacity={0.4}
      />

      {/* Warning track - semi-transparent */}
      <Shape
        sceneFunc={(context, shape) => {
          const innerRadius = fenceRadius - warningTrackWidth;
          context.beginPath();
          context.arc(0, 0, fenceRadius, rfAngle, lfAngle, true);
          context.arc(0, 0, innerRadius, lfAngle, rfAngle, false);
          context.closePath();
          context.fillStrokeShape(shape);
        }}
        fill={warningTrackColor}
        opacity={0.5}
      />

      {/* Outfield fence */}
      <Arc
        x={0}
        y={0}
        innerRadius={fenceRadius - 4}
        outerRadius={fenceRadius}
        angle={90}
        rotation={-135}
        fill={fenceColor}
      />

      {/* Foul lines extending to fence */}
      <Line
        points={[0, 0, rfFoulPole.x, rfFoulPole.y]}
        stroke={lineColor}
        strokeWidth={2}
      />
      <Line
        points={[0, 0, lfFoulPole.x, lfFoulPole.y]}
        stroke={lineColor}
        strokeWidth={2}
      />

      {/* Dirt infield arc */}
      <Shape
        sceneFunc={(context, shape) => {
          const infieldRadius = feetToPixels(95);
          context.beginPath();
          context.moveTo(0, 0);
          context.lineTo(firstBase.x + feetToPixels(20), firstBase.y - feetToPixels(20));
          context.arc(0, 0, infieldRadius, -Math.PI / 4, -3 * Math.PI / 4, true);
          context.lineTo(0, 0);
          context.closePath();
          context.fillStrokeShape(shape);
        }}
        fill={dirtColor}
        opacity={0.9}
      />

      {/* Inner dirt - diamond shape */}
      <Shape
        sceneFunc={(context, shape) => {
          context.beginPath();
          context.moveTo(0, 0);
          context.lineTo(firstBase.x, firstBase.y);
          context.lineTo(secondBase.x, secondBase.y);
          context.lineTo(thirdBase.x, thirdBase.y);
          context.closePath();
          context.fillStrokeShape(shape);
        }}
        fill={dirtColor}
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
          const size = baseSize * 2;
          context.beginPath();
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

      {/* Batter's boxes */}
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

      {/* Center field distance marker */}
      <Group x={centerField.x} y={centerField.y + feetToPixels(15)}>
        <Rect
          x={-feetToPixels(12)}
          y={-feetToPixels(6)}
          width={feetToPixels(24)}
          height={feetToPixels(12)}
          fill="#333"
          cornerRadius={3}
        />
        <Text
          x={0}
          y={0}
          text={`${fenceDistance}'`}
          fontSize={14}
          fill="#ffff00"
          fontStyle="bold"
          align="center"
          verticalAlign="middle"
          offsetX={14}
          offsetY={7}
        />
      </Group>
    </Group>
  );
};

export default FullSoftballField;
