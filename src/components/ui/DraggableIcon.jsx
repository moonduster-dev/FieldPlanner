import { useCallback } from 'react';

/**
 * Draggable icon component for sidebar items
 *
 * @param {Object} props
 * @param {string} props.type - Item type (coach, equipment, asset)
 * @param {string} props.subType - Sub-type (male, female, cone, etc.)
 * @param {string} props.label - Display label
 * @param {React.ReactNode} props.children - Icon content
 * @param {string} props.iconPath - Path to icon image
 * @param {boolean} props.requiresLabel - Whether item needs a label on drop
 */
const DraggableIcon = ({
  type,
  subType,
  label,
  children,
  iconPath,
  requiresLabel = false,
  className = '',
}) => {
  const handleDragStart = useCallback((e) => {
    // Set the data to be transferred
    const itemData = {
      type,
      subType,
      iconPath,
      requiresLabel,
    };

    e.dataTransfer.setData('application/json', JSON.stringify(itemData));
    e.dataTransfer.effectAllowed = 'copy';

    // Add a visual effect
    e.target.style.opacity = '0.5';
  }, [type, subType, iconPath, requiresLabel]);

  const handleDragEnd = useCallback((e) => {
    e.target.style.opacity = '1';
  }, []);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`flex flex-col items-center gap-1 p-2 rounded-lg cursor-grab
        hover:bg-gray-100 active:cursor-grabbing transition-colors ${className}`}
      title={`Drag to add ${label}`}
    >
      <div className="w-12 h-12 flex items-center justify-center">
        {children}
      </div>
      <span className="text-xs text-gray-600 text-center">{label}</span>
    </div>
  );
};

export default DraggableIcon;
