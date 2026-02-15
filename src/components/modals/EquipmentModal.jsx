import { useState, useEffect, useRef } from 'react';

// Preset colors for equipment
const EQUIPMENT_COLORS = [
  { name: 'Gray', value: '#6b7280' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Purple', value: '#a855f7' },
];

/**
 * Modal for configuring equipment properties
 * Supports both creating new equipment and editing existing templates
 */
const EquipmentModal = ({
  isOpen,
  onSubmit,
  onCancel,
  onSaveTemplate,
  onUpdateTemplate,
  editingTemplate = null
}) => {
  const [name, setName] = useState('');
  const [widthFt, setWidthFt] = useState(5);
  const [heightFt, setHeightFt] = useState(5);
  const [color, setColor] = useState(EQUIPMENT_COLORS[0].value);
  const [saveAsTemplate, setSaveAsTemplate] = useState(true);

  const nameInputRef = useRef(null);

  const isEditing = !!editingTemplate;

  // Focus name input when modal opens
  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isOpen]);

  // Load template values when editing, or reset form for new equipment
  useEffect(() => {
    if (isOpen) {
      if (editingTemplate) {
        setName(editingTemplate.name || '');
        setWidthFt(editingTemplate.widthFt || 5);
        setHeightFt(editingTemplate.heightFt || 5);
        setColor(editingTemplate.color || EQUIPMENT_COLORS[0].value);
        setSaveAsTemplate(true);
      } else {
        setName('');
        setWidthFt(5);
        setHeightFt(5);
        setColor(EQUIPMENT_COLORS[0].value);
        setSaveAsTemplate(true);
      }
    }
  }, [isOpen, editingTemplate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const equipmentConfig = {
      name: name.trim(),
      widthFt: Number(widthFt) || 5,
      heightFt: Number(heightFt) || 5,
      color,
    };

    if (isEditing) {
      if (onUpdateTemplate) {
        onUpdateTemplate(editingTemplate.id, equipmentConfig);
      }
    } else {
      if (saveAsTemplate && onSaveTemplate) {
        onSaveTemplate(equipmentConfig);
      }
      onSubmit(equipmentConfig);
    }

    onCancel();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {isEditing ? 'Edit Equipment Template' : 'Create Equipment'}
        </h2>

        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          {/* Equipment Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipment Name *
            </label>
            <input
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Batting Cage, Cone, Bucket"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={30}
            />
          </div>

          {/* Dimensions */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dimensions (feet)
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-500">Width</label>
                <input
                  type="number"
                  value={widthFt}
                  onChange={(e) => setWidthFt(e.target.value)}
                  min={1}
                  max={100}
                  step={0.5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end pb-2 text-gray-400">×</div>
              <div className="flex-1">
                <label className="text-xs text-gray-500">Height</label>
                <input
                  type="number"
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                  min={1}
                  max={100}
                  step={0.5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Football field is 360' × 160' for reference. A cone might be 1' × 1'.
            </p>
          </div>

          {/* Color */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipment Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {EQUIPMENT_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform
                    ${color === c.value ? 'border-gray-800 scale-110' : 'border-gray-300'}`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Save as Template checkbox - only show for new equipment */}
          {!isEditing && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveAsTemplate}
                  onChange={(e) => setSaveAsTemplate(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600
                    focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-800">
                    Save as reusable template
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Templates appear in sidebar for easy reuse
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-600 bg-gray-100
                rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-4 py-2 text-white bg-blue-600
                rounded-lg hover:bg-blue-700 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing ? 'Save Changes' : 'Create Equipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentModal;
