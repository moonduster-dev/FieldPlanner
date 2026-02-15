import { useRef } from 'react';
import LibrarySection from './LibrarySection';
import CoachLibrary from './CoachLibrary';
import EquipmentLibrary from './EquipmentLibrary';
import AssetLibrary from './AssetLibrary';
import StationLibrary from './StationLibrary';
import NoteLibrary from './NoteLibrary';

/**
 * Main sidebar component containing all draggable libraries
 *
 * @param {Object} props
 * @param {Function} props.onSaveClick - Callback when save button is clicked
 * @param {string} props.logoUrl - Current logo URL
 * @param {Function} props.onLogoChange - Callback when logo is uploaded
 * @param {Function} props.onCreateStation - Callback to open station creation modal
 * @param {Function} props.onEditTemplate - Callback to edit a template
 * @param {Function} props.onCreateNote - Callback to open note creation modal
 */
const Sidebar = ({
  onSaveClick,
  logoUrl,
  onLogoChange,
  onCreateStation,
  stationTemplates = [],
  onDeleteTemplate,
  onEditTemplate,
  onCreateNote
}) => {
  const fileInputRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to data URL for storage
    const reader = new FileReader();
    reader.onload = (event) => {
      onLogoChange(event.target.result);
    };
    reader.readAsDataURL(file);

    // Reset input
    e.target.value = '';
  };

  const handleRemoveLogo = () => {
    onLogoChange(null);
  };

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h1 className="text-lg font-bold text-gray-800">Field Planner</h1>
        <p className="text-xs text-gray-500">Drag items to the field</p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Logo Section */}
        <LibrarySection title="Center Logo" defaultOpen={false}>
          <div className="space-y-2">
            {logoUrl ? (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={logoUrl}
                  alt="Field logo"
                  className="w-20 h-20 object-contain bg-gray-100 rounded"
                />
                <button
                  onClick={handleRemoveLogo}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Remove logo
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-3 py-2
                  border-2 border-dashed border-gray-300 rounded-lg
                  text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Upload Logo
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <p className="text-xs text-gray-400 text-center">
              Logo displays sideways on field
            </p>
          </div>
        </LibrarySection>

        {/* Stations Section */}
        <LibrarySection title="Stations" defaultOpen={true}>
          <StationLibrary
            onCreateStation={onCreateStation}
            templates={stationTemplates}
            onDeleteTemplate={onDeleteTemplate}
            onEditTemplate={onEditTemplate}
          />
        </LibrarySection>

        {/* Notes Section */}
        <LibrarySection title="Notes" defaultOpen={true}>
          <NoteLibrary onCreateNote={onCreateNote} />
        </LibrarySection>

        <LibrarySection title="Coaches" defaultOpen={true}>
          <CoachLibrary />
        </LibrarySection>

        <LibrarySection title="Equipment" defaultOpen={true}>
          <EquipmentLibrary />
        </LibrarySection>

        <LibrarySection title="Field Assets" defaultOpen={true}>
          <AssetLibrary />
        </LibrarySection>
      </div>

      {/* Footer with save button */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={onSaveClick}
          className="w-full flex items-center justify-center gap-2 px-4 py-2
            bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          Save / Load
        </button>

        {/* Zoom hint */}
        <p className="mt-2 text-xs text-gray-400 text-center">
          Scroll to zoom • Drag to pan
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
