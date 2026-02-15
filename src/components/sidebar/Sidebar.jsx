import { useRef } from 'react';
import LibrarySection from './LibrarySection';
import CoachLibrary from './CoachLibrary';
import AssetLibrary from './AssetLibrary';
import StationLibrary from './StationLibrary';
import EquipmentLibrary from './EquipmentLibrary';
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
  onCreateEquipment,
  equipmentTemplates = [],
  onDeleteEquipmentTemplate,
  onEditEquipmentTemplate,
  onCreateNote,
  isSyncing = false,
  syncError = null
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

        {/* Equipment Section */}
        <LibrarySection title="Equipment" defaultOpen={true}>
          <EquipmentLibrary
            onCreateEquipment={onCreateEquipment}
            templates={equipmentTemplates}
            onDeleteTemplate={onDeleteEquipmentTemplate}
            onEditTemplate={onEditEquipmentTemplate}
          />
        </LibrarySection>

        <LibrarySection title="Coaches" defaultOpen={true}>
          <CoachLibrary />
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

        {/* Sync status */}
        <div className="mt-2 flex items-center justify-center gap-1">
          {syncError ? (
            <span className="text-xs text-red-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Offline
            </span>
          ) : isSyncing ? (
            <span className="text-xs text-blue-500 flex items-center gap-1">
              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Syncing...
            </span>
          ) : (
            <span className="text-xs text-green-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Synced
            </span>
          )}
        </div>

        {/* Zoom hint */}
        <p className="mt-1 text-xs text-gray-400 text-center">
          Scroll to zoom • Drag to pan
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
