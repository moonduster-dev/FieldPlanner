import DraggableIcon from '../ui/DraggableIcon';

/**
 * Equipment icons library component
 * Uses placeholder shapes - replace with actual SVGs as needed
 */
const EquipmentLibrary = () => {
  const equipment = [
    { id: 'cone', label: 'Cone', color: '#f97316' },
    { id: 'marker', label: 'Marker', color: '#eab308' },
    { id: 'hurdle', label: 'Hurdle', color: '#6b7280' },
    { id: 'ladder', label: 'Ladder', color: '#22c55e' },
    { id: 'goal', label: 'Goal', color: '#3b82f6' },
    { id: 'ball', label: 'Ball', color: '#ef4444' },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {equipment.map((item) => (
        <DraggableIcon
          key={item.id}
          type="equipment"
          subType={item.id}
          label={item.label}
          iconPath={`/icons/equipment/${item.id}.svg`}
          requiresLabel={false}
        >
          {/* Placeholder icons - these will show if SVG files don't exist */}
          {item.id === 'cone' && (
            <svg viewBox="0 0 40 40" className="w-8 h-8">
              <polygon points="20,2 35,38 5,38" fill={item.color} />
            </svg>
          )}
          {item.id === 'marker' && (
            <svg viewBox="0 0 40 40" className="w-8 h-8">
              <circle cx="20" cy="20" r="15" fill={item.color} />
            </svg>
          )}
          {item.id === 'hurdle' && (
            <svg viewBox="0 0 40 40" className="w-8 h-8">
              <rect x="5" y="5" width="30" height="6" fill={item.color} />
              <rect x="8" y="11" width="4" height="24" fill={item.color} />
              <rect x="28" y="11" width="4" height="24" fill={item.color} />
            </svg>
          )}
          {item.id === 'ladder' && (
            <svg viewBox="0 0 40 40" className="w-8 h-8">
              <rect x="8" y="2" width="4" height="36" fill={item.color} />
              <rect x="28" y="2" width="4" height="36" fill={item.color} />
              <rect x="8" y="8" width="24" height="3" fill={item.color} />
              <rect x="8" y="18" width="24" height="3" fill={item.color} />
              <rect x="8" y="28" width="24" height="3" fill={item.color} />
            </svg>
          )}
          {item.id === 'goal' && (
            <svg viewBox="0 0 40 40" className="w-8 h-8">
              <rect x="5" y="5" width="30" height="25" fill="none" stroke={item.color} strokeWidth="3" />
              <rect x="5" y="5" width="30" height="25" fill={item.color} opacity="0.2" />
            </svg>
          )}
          {item.id === 'ball' && (
            <svg viewBox="0 0 40 40" className="w-8 h-8">
              <circle cx="20" cy="20" r="16" fill={item.color} />
              <path d="M10 20 Q20 5, 30 20" fill="none" stroke="white" strokeWidth="2" />
              <path d="M10 20 Q20 35, 30 20" fill="none" stroke="white" strokeWidth="2" />
            </svg>
          )}
        </DraggableIcon>
      ))}
    </div>
  );
};

export default EquipmentLibrary;
