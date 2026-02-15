import { Group, Rect, Text, Circle } from 'react-konva';
import { feetToPixels } from '../../constants/fieldDimensions';

/**
 * Equipment Component
 * Draws equipment with name and dimensions on the field
 * Size is proportional to the football field
 *
 * @param {Object} props
 * @param {string} props.name - Equipment name
 * @param {number} props.widthFt - Width in feet
 * @param {number} props.heightFt - Height in feet
 * @param {string} props.color - Equipment color
 */
const Equipment = ({
  name = 'Equipment',
  widthFt = 5,
  heightFt = 5,
  color = '#6b7280',
}) => {
  const widthPx = feetToPixels(widthFt);
  const heightPx = feetToPixels(heightFt);

  // For very small equipment, use a circle/icon style
  const isSmall = widthFt <= 3 && heightFt <= 3;

  if (isSmall) {
    const radius = Math.max(feetToPixels(widthFt), feetToPixels(heightFt)) / 2;
    const fontSize = Math.max(6, radius * 0.6);
    const labelWidth = name.length * fontSize * 0.5;

    return (
      <Group>
        {/* Equipment circle */}
        <Circle
          x={0}
          y={0}
          radius={radius}
          fill={color}
          opacity={0.8}
          stroke={color}
          strokeWidth={2}
        />
        {/* White center dot */}
        <Circle
          x={0}
          y={0}
          radius={radius * 0.3}
          fill="white"
          opacity={0.9}
        />
        {/* Label background */}
        <Rect
          x={-labelWidth / 2 - 4}
          y={radius + 4}
          width={labelWidth + 8}
          height={fontSize + 4}
          fill="white"
          opacity={0.95}
          cornerRadius={2}
        />
        {/* Label */}
        <Text
          x={-labelWidth / 2}
          y={radius + 6}
          text={name}
          fontSize={fontSize}
          fill="#1f2937"
          fontStyle="bold"
        />
      </Group>
    );
  }

  // For larger equipment, use rectangle style similar to stations
  const availableWidth = widthPx - 8;
  const maxFontSize = Math.min(12, Math.min(widthPx, heightPx) / 5);
  const charWidthRatio = 0.55;

  const requiredWidth = name.length * charWidthRatio;
  let nameFontSize = Math.min(maxFontSize, availableWidth / requiredWidth);
  nameFontSize = Math.max(5, nameFontSize);

  const dimFontSize = Math.max(4, Math.min(8, nameFontSize * 0.7));
  const dimText = `${widthFt}' × ${heightFt}'`;

  const nameWidth = name.length * nameFontSize * charWidthRatio;
  const dimWidth = dimText.length * dimFontSize * charWidthRatio;

  const nameBgWidth = nameWidth + 8;
  const dimBgWidth = dimWidth + 6;

  return (
    <Group>
      {/* Equipment background */}
      <Rect
        x={-widthPx / 2}
        y={-heightPx / 2}
        width={widthPx}
        height={heightPx}
        fill={color}
        opacity={0.6}
        cornerRadius={3}
      />

      {/* Equipment border */}
      <Rect
        x={-widthPx / 2}
        y={-heightPx / 2}
        width={widthPx}
        height={heightPx}
        stroke={color}
        strokeWidth={2}
        fill="transparent"
        cornerRadius={3}
      />

      {/* Name background */}
      <Rect
        x={-nameBgWidth / 2}
        y={-nameFontSize / 2 - 4}
        width={nameBgWidth}
        height={nameFontSize + 6}
        fill="white"
        opacity={0.95}
        cornerRadius={2}
      />

      {/* Equipment name */}
      <Text
        x={-nameWidth / 2}
        y={-nameFontSize / 2 - 1}
        text={name}
        fontSize={nameFontSize}
        fill="#1f2937"
        fontStyle="bold"
      />

      {/* Dimensions background */}
      <Rect
        x={-dimBgWidth / 2}
        y={nameFontSize / 2 + 1}
        width={dimBgWidth}
        height={dimFontSize + 4}
        fill="white"
        opacity={0.9}
        cornerRadius={2}
      />

      {/* Dimensions text */}
      <Text
        x={-dimWidth / 2}
        y={nameFontSize / 2 + 2}
        text={dimText}
        fontSize={dimFontSize}
        fill="#374151"
      />
    </Group>
  );
};

export default Equipment;
