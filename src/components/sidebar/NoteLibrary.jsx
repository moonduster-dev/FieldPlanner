/**
 * Note library component
 * Provides button to create new notes
 */
const NoteLibrary = ({ onCreateNote }) => {
  return (
    <div className="space-y-2">
      {/* Create new note button */}
      <button
        onClick={onCreateNote}
        className="w-full flex items-center justify-center gap-2 px-3 py-3
          border-2 border-dashed border-gray-300 rounded-lg
          text-gray-600 hover:border-yellow-400 hover:text-yellow-600
          hover:bg-yellow-50 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
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
        Add Note
      </button>

      <p className="text-xs text-gray-400 text-center">
        Notes can be placed next to stations
      </p>
    </div>
  );
};

export default NoteLibrary;
