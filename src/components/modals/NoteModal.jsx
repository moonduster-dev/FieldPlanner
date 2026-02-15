import { useState, useEffect, useRef } from 'react';

// Preset colors for notes
const NOTE_COLORS = [
  { name: 'Yellow', value: '#fef3c7' },
  { name: 'Blue', value: '#dbeafe' },
  { name: 'Green', value: '#dcfce7' },
  { name: 'Pink', value: '#fce7f3' },
  { name: 'Orange', value: '#ffedd5' },
  { name: 'White', value: '#ffffff' },
];

/**
 * Modal for creating/editing notes
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Function} props.onSubmit - Callback with note config (for new notes)
 * @param {Function} props.onUpdate - Callback with updated note config (for editing)
 * @param {Function} props.onCancel - Cancel callback
 * @param {Object} props.editingNote - Note being edited (null for new note)
 */
const NoteModal = ({ isOpen, onSubmit, onUpdate, onCancel, editingNote = null }) => {
  const [text, setText] = useState('');
  const [color, setColor] = useState(NOTE_COLORS[0].value);

  const textInputRef = useRef(null);

  const isEditing = !!editingNote;

  // Focus text input when modal opens
  useEffect(() => {
    if (isOpen && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [isOpen]);

  // Load note values when editing, or reset form for new note
  useEffect(() => {
    if (isOpen) {
      if (editingNote) {
        setText(editingNote.noteText || '');
        setColor(editingNote.noteColor || NOTE_COLORS[0].value);
      } else {
        setText('');
        setColor(NOTE_COLORS[0].value);
      }
    }
  }, [isOpen, editingNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (isEditing) {
      // Update existing note
      onUpdate(editingNote.id, {
        noteText: text.trim(),
        noteColor: color,
      });
    } else {
      // Create new note
      onSubmit({
        type: 'note',
        noteText: text.trim(),
        noteColor: color,
      });
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
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {isEditing ? 'Edit Note' : 'Add Note'}
        </h2>

        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          {/* Note Text */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note Text *
            </label>
            <textarea
              ref={textInputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter note text..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              maxLength={200}
            />
            <p className="text-xs text-gray-400 mt-1">
              {text.length}/200 characters
            </p>
          </div>

          {/* Color */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {NOTE_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded border-2 transition-transform
                    ${color === c.value ? 'border-gray-800 scale-110' : 'border-gray-300'}`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

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
              disabled={!text.trim()}
              className="flex-1 px-4 py-2 text-white bg-blue-600
                rounded-lg hover:bg-blue-700 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing ? 'Save Changes' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
