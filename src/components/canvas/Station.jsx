import { Group, Rect, Text, Line } from 'react-konva';
import { feetToPixels } from '../../constants/fieldDimensions';

/**
 * Station Component
 * Draws a rectangular station area with name and dimensions
 * Name font scales to fit the full text on one line
 *
 * @param {Object} props
 * @param {string} props.name - Station name
 * @param {number} props.widthFt - Width in feet
 * @param {number} props.heightFt - Height in feet
 * @param {Array} props.equipment - List of equipment names (stored but not displayed on field)
 * @param {string} props.color - Station color
 */
const Station = ({
  name = 'Station',
  widthFt = 20,
  heightFt = 20,
  equipment = [],
  color = '#3b82f6',
}) => {
  const widthPx = feetToPixels(widthFt);
  const heightPx = feetToPixels(heightFt);

  // Available width for text (with padding)
  const availableWidth = widthPx - 16;

  // Calculate font size to fit the full name on one line
  // Use a more accurate character width estimate
  const maxFontSize = Math.min(14, Math.min(widthPx, heightPx) / 6);
  const charWidthRatio = 0.55; // average character width relative to font size

  // Calculate required font size to fit text
  const requiredWidth = name.length * charWidthRatio;
  let nameFontSize = Math.min(maxFontSize, availableWidth / requiredWidth);
  nameFontSize = Math.max(5, nameFontSize); // minimum readable size

  const dimFontSize = Math.max(5, Math.min(9, nameFontSize * 0.7));
  const dimText = `${widthFt}' × ${heightFt}'`;

  // Calculate actual text widths for backgrounds
  const nameWidth = name.length * nameFontSize * charWidthRatio;
  const dimWidth = dimText.length * dimFontSize * charWidthRatio;

  // Background padding
  const nameBgWidth = nameWidth + 12;
  const dimBgWidth = dimWidth + 10;

  return (
    <Group>
      {/* Station background - solid fill with good opacity */}
      <Rect
        x={-widthPx / 2}
        y={-heightPx / 2}
        width={widthPx}
        height={heightPx}
        fill={color}
        opacity={0.5}
        cornerRadius={4}
      />

      {/* Station border - thick and visible */}
      <Rect
        x={-widthPx / 2}
        y={-heightPx / 2}
        width={widthPx}
        height={heightPx}
        stroke={color}
        strokeWidth={3}
        fill="transparent"
        cornerRadius={4}
      />

      {/* Corner markers */}
      {[
        { x: -widthPx / 2, y: -heightPx / 2, rotation: 0 },
        { x: widthPx / 2, y: -heightPx / 2, rotation: 90 },
        { x: widthPx / 2, y: heightPx / 2, rotation: 180 },
        { x: -widthPx / 2, y: heightPx / 2, rotation: 270 },
      ].map((corner, i) => (
        <Group key={i} x={corner.x} y={corner.y} rotation={corner.rotation}>
          <Line
            points={[0, 8, 0, 0, 8, 0]}
            stroke="white"
            strokeWidth={2}
          />
        </Group>
      ))}

      {/* Name background - centered */}
      <Rect
        x={-nameBgWidth / 2}
        y={-nameFontSize / 2 - 6}
        width={nameBgWidth}
        height={nameFontSize + 8}
        fill="white"
        opacity={0.95}
        cornerRadius={2}
      />

      {/* Station name - full text centered, no width constraint */}
      <Text
        x={-nameWidth / 2}
        y={-nameFontSize / 2 - 2}
        text={name}
        fontSize={nameFontSize}
        fill="#1f2937"
        fontStyle="bold"
      />

      {/* Dimensions background */}
      <Rect
        x={-dimBgWidth / 2}
        y={nameFontSize / 2 + 2}
        width={dimBgWidth}
        height={dimFontSize + 6}
        fill="white"
        opacity={0.9}
        cornerRadius={2}
      />

      {/* Dimensions text - no width constraint */}
      <Text
        x={-dimWidth / 2}
        y={nameFontSize / 2 + 4}
        text={dimText}
        fontSize={dimFontSize}
        fill="#374151"
      />
    </Group>
  );
};

export default Station;
