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
 * Displays uploaded logo image rotated 90 degrees (sideways) to match field orientation
 *
 * @param {Object} props
 * @param {string} props.logoUrl - Data URL or path to logo image
 */
const CenterLogo = ({ logoUrl }) => {
  const [image] = useImage(logoUrl || '');

  const fieldX = feetToPixels(TRACK.TOTAL_WIDTH);
  const fieldY = feetToPixels(TRACK.TOTAL_WIDTH);
  const fieldWidth = feetToPixels(FOOTBALL.WIDTH);
  const fieldLength = feetToPixels(FOOTBALL.TOTAL_LENGTH);
  const logoSize = feetToPixels(LOGO.WIDTH);

  const centerX = fieldX + fieldWidth / 2;
  const centerY = fieldY + fieldLength / 2;

  // If we have an image, display it rotated 90 degrees
  if (image) {
    // Calculate scale to fit logo within the logo area
    const scale = Math.min(
      logoSize / image.width,
      logoSize / image.height
    ) * 0.8; // 80% of max to leave some margin

    return (
      <Group>
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
          rotation={90} // Rotate 90 degrees for sideways display
          opacity={0.9}
        />
      </Group>
    );
  }

  // Placeholder when no logo is uploaded
  return (
    <Group>
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
        rotation={90}
      />
    </Group>
  );
};

export default CenterLogo;
