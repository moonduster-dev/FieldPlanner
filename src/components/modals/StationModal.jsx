import { useState, useEffect, useRef } from 'react';
import { useCustomEquipment } from '../../hooks/useCustomEquipment';

// Preset colors for stations
const STATION_COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Yellow', value: '#eab308' },
];

// Common equipment options
const EQUIPMENT_OPTIONS = [
  'Cones',
  'Markers',
  'Hurdles',
  'Agility Ladder',
  'Balls',
  'Bats',
  'Tees',
  'Nets',
  'Resistance Bands',
  'Medicine Balls',
  'Buckets',
  'Throw Down Bases',
];

/**
 * Modal for configuring station properties
 * Supports both creating new stations and editing existing templates
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Function} props.onSubmit - Callback with station config (for new stations)
 * @param {Function} props.onCancel - Cancel callback
 * @param {Function} props.onSaveTemplate - Callback to save as new template
 * @param {Function} props.onUpdateTemplate - Callback to update existing template
 * @param {Object} props.editingTemplate - Template being edited (null for new station)
 */
const StationModal = ({
  isOpen,
  onSubmit,
  onCancel,
  onSaveTemplate,
  onUpdateTemplate,
  editingTemplate = null
}) => {
  const [name, setName] = useState('');
  const [widthFt, setWidthFt] = useState(20);
  const [heightFt, setHeightFt] = useState(20);
  const [color, setColor] = useState(STATION_COLORS[0].value);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [customEquipmentInput, setCustomEquipmentInput] = useState('');
  const [saveAsTemplate, setSaveAsTemplate] = useState(true);

  // Custom equipment hook
  const { customEquipment, addEquipment, removeEquipment } = useCustomEquipment();

  const nameInputRef = useRef(null);

  const isEditing = !!editingTemplate;

  // Focus name input when modal opens
  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isOpen]);

  // Load template values when editing, or reset form for new station
  useEffect(() => {
    if (isOpen) {
      if (editingTemplate) {
        // Editing mode - load template values
        setName(editingTemplate.name || '');
        setWidthFt(editingTemplate.widthFt || 20);
        setHeightFt(editingTemplate.heightFt || 20);
        setColor(editingTemplate.color || STATION_COLORS[0].value);
        setSelectedEquipment(editingTemplate.equipment || []);
        setCustomEquipmentInput('');
        setSaveAsTemplate(true); // Always true when editing
      } else {
        // New station - reset form
        setName('');
        setWidthFt(20);
        setHeightFt(20);
        setColor(STATION_COLORS[0].value);
        setSelectedEquipment([]);
        setCustomEquipmentInput('');
        setSaveAsTemplate(true);
      }
    }
  }, [isOpen, editingTemplate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Combine selected equipment
    const equipment = [...selectedEquipment];

    // Add and save custom equipment if entered
    if (customEquipmentInput.trim()) {
      const customItem = customEquipmentInput.trim();
      equipment.push(customItem);
      addEquipment(customItem);
    }

    const stationConfig = {
      name: name.trim(),
      widthFt: Number(widthFt) || 20,
      heightFt: Number(heightFt) || 20,
      color,
      equipment,
    };

    if (isEditing) {
      // Update existing template
      if (onUpdateTemplate) {
        onUpdateTemplate(editingTemplate.id, stationConfig);
      }
    } else {
      // Create new station
      if (saveAsTemplate && onSaveTemplate) {
        onSaveTemplate(stationConfig);
      }
      onSubmit(stationConfig);
    }

    onCancel(); // Close modal
  };

  const toggleEquipment = (item) => {
    setSelectedEquipment((prev) =>
      prev.includes(item)
        ? prev.filter((e) => e !== item)
        : [...prev, item]
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  const handleAddCustomEquipment = () => {
    if (customEquipmentInput.trim()) {
      const item = customEquipmentInput.trim();
      if (!selectedEquipment.includes(item)) {
        setSelectedEquipment(prev => [...prev, item]);
      }
      addEquipment(item);
      setCustomEquipmentInput('');
    }
  };

  if (!isOpen) return null;

  // Combine preset and custom equipment options
  const allEquipmentOptions = [...EQUIPMENT_OPTIONS, ...customEquipment.filter(e => !EQUIPMENT_OPTIONS.includes(e))];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {isEditing ? 'Edit Station Template' : 'Create Station'}
        </h2>

        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          {/* Station Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Station Name *
            </label>
            <input
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Hitting Station 1"
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
                  min={5}
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
                  min={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Football field is 360' × 160' for reference
            </p>
          </div>

          {/* Color */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Station Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {STATION_COLORS.map((c) => (
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

          {/* Equipment */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipment (optional)
            </label>
            <div className="flex gap-2 flex-wrap mb-2 max-h-24 overflow-y-auto">
              {allEquipmentOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleEquipment(item)}
                  className={`px-2 py-1 text-xs rounded-full border transition-colors
                    ${selectedEquipment.includes(item)
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-gray-50 border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                >
                  {item}
                  {customEquipment.includes(item) && !EQUIPMENT_OPTIONS.includes(item) && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        removeEquipment(item);
                        setSelectedEquipment(prev => prev.filter(e => e !== item));
                      }}
                      className="ml-1 text-red-500 hover:text-red-700"
                      title="Remove from saved equipment"
                    >
                      ×
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Custom equipment input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customEquipmentInput}
                onChange={(e) => setCustomEquipmentInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomEquipment();
                  }
                }}
                placeholder="Add custom equipment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                type="button"
                onClick={handleAddCustomEquipment}
                disabled={!customEquipmentInput.trim()}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg
                  hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Custom equipment is saved for future use
            </p>
          </div>

          {/* Save as Template checkbox - only show for new stations */}
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
              {isEditing ? 'Save Changes' : 'Create Station'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StationModal;
