import { Group, Image, Text, Circle, Rect } from 'react-konva';
import useImage from 'use-image';
import { ITEMS } from '../../constants/fieldDimensions';
import SoftballInfield from './SoftballInfield';
import FullSoftballField from './FullSoftballField';
import Station from './Station';
import Equipment from './Equipment';
import Note from './Note';

/**
 * Coach icon component (drawn with Konva shapes when image not available)
 */
const CoachIcon = ({ gender, size }) => {
  const color = gender === 'male' ? '#2563eb' : '#db2777';

  return (
    <Group>
      {/* Head */}
      <Circle x={size / 2} y={size / 4} radius={size / 5} fill={color} />
      {/* Body */}
      <Rect
        x={size / 4}
        y={size / 2.5}
        width={size / 2}
        height={size / 2}
        fill={color}
        cornerRadius={4}
      />
    </Group>
  );
};

/**
 * Equipment icon placeholder
 */
const EquipmentIcon = ({ type, size }) => {
  const color = '#6b7280';

  return (
    <Group>
      <Rect
        x={0}
        y={0}
        width={size}
        height={size}
        fill={color}
        cornerRadius={4}
        opacity={0.8}
      />
      <Text
        x={2}
        y={size / 2 - 6}
        width={size - 4}
        text={type?.substring(0, 4) || 'EQUIP'}
        fontSize={10}
        fill="white"
        align="center"
      />
    </Group>
  );
};

/**
 * PlacedItem Component
 * Renders a draggable item on the canvas with label
 * Double-click to rotate (for rotatable items)
 *
 * @param {Object} props
 * @param {Object} props.item - Item data (id, type, x, y, label, rotation, etc.)
 * @param {Function} props.onDragEnd - Callback when drag ends
 * @param {Function} props.onContextMenu - Callback for right-click
 * @param {Function} props.onRotate - Callback when item is rotated
 */
const PlacedItem = ({
  item,
  onDragEnd,
  onDragMove,
  onContextMenu,
  onTouchStart,
  onTouchEnd,
  onRotate,
}) => {
  const { id, type, subType, x, y, label, iconPath, rotation = 0 } = item;

  // Try to load image if iconPath is provided
  const [image] = useImage(iconPath || '');

  // Check if item is rotatable
  const isRotatable = ['softball-infield', 'full-softball-field', 'station', 'equipment'].includes(type);

  // Handle double-click to rotate
  const handleDblClick = () => {
    if (isRotatable && onRotate) {
      // Rotate by 45 degrees
      const newRotation = (rotation + 45) % 360;
      onRotate(id, newRotation);
    }
  };

  // Handle item-specific rendering
  const renderItem = () => {
    switch (type) {
      case 'softball-infield':
        return (
          <SoftballInfield
            x={0}
            y={0}
            draggable={false}
            id={id}
          />
        );

      case 'full-softball-field':
        return (
          <FullSoftballField
            fenceDistance={item.fenceDistance || 200}
          />
        );

      case 'station':
        return (
          <Station
            name={item.stationName || 'Station'}
            widthFt={item.widthFt || 20}
            heightFt={item.heightFt || 20}
            equipment={item.equipment || []}
            color={item.color || '#3b82f6'}
          />
        );

      case 'note':
        return (
          <Note
            text={item.noteText || 'Note'}
            color={item.noteColor || '#fef3c7'}
          />
        );

      case 'coach':
        const coachSize = ITEMS.COACH_SIZE;
        if (image) {
          return (
            <Image
              image={image}
              width={coachSize}
              height={coachSize}
              offsetX={coachSize / 2}
              offsetY={coachSize / 2}
            />
          );
        }
        return (
          <Group offsetX={coachSize / 2} offsetY={coachSize / 2}>
            <CoachIcon gender={subType} size={coachSize} />
          </Group>
        );

      case 'equipment':
        return (
          <Equipment
            name={item.equipmentName || 'Equipment'}
            widthFt={item.widthFt || 5}
            heightFt={item.heightFt || 5}
            color={item.color || '#6b7280'}
          />
        );

      default:
        return (
          <Circle
            radius={20}
            fill="#9ca3af"
          />
        );
    }
  };

  // Calculate label position based on item type
  const getLabelOffset = () => {
    switch (type) {
      case 'softball-infield':
        return { x: 0, y: 30 };
      case 'full-softball-field':
        return { x: 0, y: 50 };
      case 'station':
        return { x: 0, y: 0 }; // Station has built-in label
      case 'note':
        return { x: 0, y: 0 }; // Note has built-in text
      case 'coach':
        return { x: 0, y: ITEMS.COACH_SIZE / 2 + 15 };
      case 'equipment':
        return { x: 0, y: 0 }; // Equipment has built-in label
      default:
        return { x: 0, y: 30 };
    }
  };

  const labelOffset = getLabelOffset();

  // Station, Note, and Equipment don't need external label since they have built-in text
  const showLabel = label && type !== 'station' && type !== 'note' && type !== 'equipment';

  return (
    <Group
      x={x}
      y={y}
      rotation={rotation}
      draggable
      onDragEnd={(e) => {
        onDragEnd && onDragEnd(id, e.target.x(), e.target.y());
      }}
      onDragMove={onDragMove}
      onContextMenu={(e) => {
        e.evt.preventDefault();
        onContextMenu && onContextMenu(id, e);
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onDblClick={handleDblClick}
      onDblTap={handleDblClick}
    >
      {renderItem()}

      {/* Label below item (counter-rotate so it stays readable) */}
      {showLabel && (
        <Text
          x={labelOffset.x}
          y={labelOffset.y}
          text={label}
          fontSize={12}
          fill="#1f2937"
          fontStyle="bold"
          align="center"
          offsetX={label.length * 3} // Rough centering
          shadowColor="white"
          shadowBlur={2}
          shadowOpacity={0.8}
          rotation={-rotation} // Counter-rotate label
        />
      )}

      {/* Rotation hint for rotatable items */}
      {isRotatable && (
        <Text
          x={0}
          y={type === 'full-softball-field' ? 80 :
             type === 'station' ? (item.heightFt || 20) * 1.5 + 20 :
             type === 'equipment' ? (item.heightFt || 5) * 1.5 + 15 : 50}
          text="Double-click to rotate"
          fontSize={10}
          fill="#666"
          align="center"
          offsetX={55}
          rotation={-rotation}
          opacity={0.7}
        />
      )}
    </Group>
  );
};

export default PlacedItem;
