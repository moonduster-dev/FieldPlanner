import { Group, Image, Circle, Text } from 'react-konva';
import useImage from 'use-image';
import {
  FOOTBALL,
  TRACK,
  LOGO,
  feetToPixels,
} from '../../constants/fieldDimensions';

/**
 * Center logo component for the field
 * Displays uploaded logo image with configurable rotation
 * Double-click to rotate 90 degrees
 *
 * @param {Object} props
 * @param {string} props.logoUrl - Data URL or path to logo image
 * @param {number} props.rotation - Rotation angle in degrees (default 90)
 * @param {Function} props.onRotate - Callback when logo is double-clicked to rotate
 */
const CenterLogo = ({ logoUrl, rotation = 90, onRotate }) => {
  const [image] = useImage(logoUrl || '');

  const fieldX = feetToPixels(TRACK.TOTAL_WIDTH);
  const fieldY = feetToPixels(TRACK.TOTAL_WIDTH);
  const fieldWidth = feetToPixels(FOOTBALL.WIDTH);
  const fieldLength = feetToPixels(FOOTBALL.TOTAL_LENGTH);
  const logoSize = feetToPixels(LOGO.WIDTH);

  const centerX = fieldX + fieldWidth / 2;
  const centerY = fieldY + fieldLength / 2;

  // Handle double-click to rotate
  const handleDblClick = () => {
    if (onRotate) {
      onRotate();
    }
  };

  // If we have an image, display it with configurable rotation
  if (image) {
    // Calculate scale to fit logo within the logo area
    const scale = Math.min(
      logoSize / image.width,
      logoSize / image.height
    ) * 0.8; // 80% of max to leave some margin

    return (
      <Group
        onDblClick={handleDblClick}
        onDblTap={handleDblClick}
      >
        <Image
          image={image}
          x={centerX}
          y={centerY}
          width={image.width}
          height={image.height}
          offsetX={image.width / 2}
          offsetY={image.height / 2}
          scaleX={scale}
          scaleY={scale}
          rotation={rotation}
          opacity={0.9}
        />
        {/* Rotation hint */}
        <Text
          x={centerX}
          y={centerY + logoSize / 2 + 15}
          text="Double-click to rotate"
          fontSize={10}
          fill="rgba(255, 255, 255, 0.6)"
          align="center"
          offsetX={55}
        />
      </Group>
    );
  }

  // Placeholder when no logo is uploaded
  return (
    <Group
      onDblClick={handleDblClick}
      onDblTap={handleDblClick}
    >
      {/* Logo background circle */}
      <Circle
        x={centerX}
        y={centerY}
        radius={logoSize / 2}
        fill="rgba(255, 255, 255, 0.1)"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth={2}
      />
      {/* Logo placeholder text */}
      <Text
        x={centerX}
        y={centerY}
        text="LOGO"
        fontSize={36}
        fill="rgba(255, 255, 255, 0.4)"
        fontStyle="bold"
        offsetX={45}
        offsetY={18}
        rotation={rotation}
      />
    </Group>
  );
};

export default CenterLogo;
