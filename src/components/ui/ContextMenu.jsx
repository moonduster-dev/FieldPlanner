import { useEffect, useRef, useCallback } from 'react';

/**
 * Context menu component for right-click actions
 *
 * @param {Object} props
 * @param {boolean} props.visible - Whether menu is visible
 * @param {number} props.x - X position
 * @param {number} props.y - Y position
 * @param {Function} props.onDelete - Delete action callback
 * @param {Function} props.onEdit - Edit action callback (for notes)
 * @param {Function} props.onClose - Close menu callback
 * @param {string} props.itemId - ID of the target item
 * @param {Object} props.item - The target item object
 */
const ContextMenu = ({ visible, x, y, onDelete, onEdit, onClose, itemId, item }) => {
  const menuRef = useRef(null);

  // Check if item is editable (notes are editable)
  const isEditable = item?.type === 'note';

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [visible, onClose]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [visible, onClose]);

  const handleDelete = useCallback(() => {
    onDelete(itemId);
    onClose();
  }, [itemId, onDelete, onClose]);

  const handleEdit = useCallback(() => {
    if (onEdit && item) {
      onEdit(item);
    }
    onClose();
  }, [item, onEdit, onClose]);

  if (!visible) return null;

  // Adjust position to keep menu on screen
  const menuStyle = {
    position: 'fixed',
    left: x,
    top: y,
    zIndex: 1000,
  };

  return (
    <div
      ref={menuRef}
      style={menuStyle}
      className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px]"
    >
      {/* Edit option for editable items */}
      {isEditable && (
        <button
          onClick={handleEdit}
          className="w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50
            flex items-center gap-2 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit
        </button>
      )}

      {/* Delete option */}
      <button
        onClick={handleDelete}
        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50
          flex items-center gap-2 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        Delete
      </button>
    </div>
  );
};

export default ContextMenu;
