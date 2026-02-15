import { useCallback } from 'react';

/**
 * Draggable station template item with edit/delete options
 */
const DraggableTemplate = ({ template, onDelete, onEdit }) => {
  const handleDragStart = useCallback((e) => {
    const itemData = {
      type: 'station',
      stationName: template.name,
      widthFt: template.widthFt,
      heightFt: template.heightFt,
      color: template.color,
      equipment: template.equipment,
    };

    e.dataTransfer.setData('application/json', JSON.stringify(itemData));
    e.dataTransfer.effectAllowed = 'copy';
    e.target.style.opacity = '0.5';
  }, [template]);

  const handleDragEnd = useCallback((e) => {
    e.target.style.opacity = '1';
  }, []);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-grab
        hover:bg-gray-100 active:cursor-grabbing group border border-gray-200"
    >
      {/* Color indicator */}
      <div
        className="w-4 h-4 rounded-full shrink-0 border border-gray-300"
        style={{ backgroundColor: template.color }}
      />

      {/* Template info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-800 truncate">
          {template.name}
        </div>
        <div className="text-xs text-gray-500">
          {template.widthFt}' × {template.heightFt}'
          {template.equipment?.length > 0 && (
            <span className="ml-1 text-gray-400">
              • {template.equipment.length} item{template.equipment.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Edit button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(template);
        }}
        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400
          hover:text-blue-500 transition-all"
        title="Edit template"
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
      </button>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(template.id);
        }}
        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400
          hover:text-red-500 transition-all"
        title="Delete template"
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

/**
 * Station library component
 * Provides button to create new stations and shows saved templates
 */
const StationLibrary = ({ onCreateStation, templates = [], onDeleteTemplate, onEditTemplate }) => {
  return (
    <div className="space-y-3">
      {/* Create new station button */}
      <button
        onClick={onCreateStation}
        className="w-full flex items-center justify-center gap-2 px-3 py-3
          border-2 border-dashed border-gray-300 rounded-lg
          text-gray-600 hover:border-blue-400 hover:text-blue-500
          hover:bg-blue-50 transition-colors"
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
            d="M12 4v16m8-8H4"
          />
        </svg>
        Create New Station
      </button>

      {/* Saved templates */}
      {templates.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
            Saved Templates ({templates.length})
          </div>
          <div className="space-y-1">
            {templates.map((template) => (
              <DraggableTemplate
                key={template.id}
                template={template}
                onDelete={onDeleteTemplate}
                onEdit={onEditTemplate}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 italic">
            Drag to field • Hover to edit/delete
          </p>
        </div>
      )}

      {templates.length === 0 && (
        <div className="text-center py-2">
          <p className="text-xs text-gray-400">
            No saved templates yet
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Create a station with "Save as template" checked
          </p>
        </div>
      )}
    </div>
  );
};

export default StationLibrary;
