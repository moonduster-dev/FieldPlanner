import { useState, useEffect, useRef } from 'react';

/**
 * Modal for entering item labels (e.g., coach names)
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {string} props.title - Modal title
 * @param {string} props.placeholder - Input placeholder text
 * @param {Function} props.onSubmit - Callback with entered label
 * @param {Function} props.onCancel - Cancel callback
 */
const LabelModal = ({
  isOpen,
  title = 'Enter Name',
  placeholder = 'Enter name...',
  onSubmit,
  onCancel,
}) => {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset value when modal closes
  useEffect(() => {
    if (!isOpen) {
      setValue('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
      setValue('');
    }
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
      <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={30}
          />

          <div className="flex gap-3 mt-4">
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
              disabled={!value.trim()}
              className="flex-1 px-4 py-2 text-white bg-blue-600
                rounded-lg hover:bg-blue-700 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LabelModal;
