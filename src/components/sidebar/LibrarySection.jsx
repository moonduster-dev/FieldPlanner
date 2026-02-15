import { useState } from 'react';

/**
 * Collapsible section for sidebar libraries
 *
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {boolean} props.defaultOpen - Whether section starts open
 * @param {React.ReactNode} props.children - Section content
 */
const LibrarySection = ({ title, defaultOpen = true, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3
          text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium">{title}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default LibrarySection;
