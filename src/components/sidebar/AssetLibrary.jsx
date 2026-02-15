import DraggableIcon from '../ui/DraggableIcon';

/**
 * Field assets library component
 * Contains items like softball infield, full softball field, etc.
 */
const AssetLibrary = () => {
  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-wrap">
        {/* Softball Infield (60ft baselines only) */}
        <DraggableIcon
          type="softball-infield"
          subType="regulation"
          label="Infield Only"
          requiresLabel={false}
        >
          <svg viewBox="0 0 48 48" className="w-10 h-10">
            {/* Diamond shape */}
            <polygon
              points="24,4 44,24 24,44 4,24"
              fill="#C4A675"
              stroke="#8B7355"
              strokeWidth="2"
            />
            {/* Base lines */}
            <line x1="24" y1="4" x2="44" y2="24" stroke="white" strokeWidth="1" />
            <line x1="44" y1="24" x2="24" y2="44" stroke="white" strokeWidth="1" />
            <line x1="24" y1="44" x2="4" y2="24" stroke="white" strokeWidth="1" />
            <line x1="4" y1="24" x2="24" y2="4" stroke="white" strokeWidth="1" />
            {/* Bases */}
            <rect x="22" y="40" width="4" height="4" fill="white" />
            <rect x="40" y="22" width="4" height="4" fill="white" />
            <rect x="22" y="2" width="4" height="4" fill="white" />
            <rect x="2" y="22" width="4" height="4" fill="white" />
            {/* Pitcher's circle */}
            <circle cx="24" cy="24" r="6" fill="#C4A675" stroke="white" strokeWidth="1" />
          </svg>
        </DraggableIcon>

        {/* Full Softball Field (200ft fences) */}
        <DraggableIcon
          type="full-softball-field"
          subType="200ft"
          label="Full Field 200'"
          requiresLabel={false}
        >
          <svg viewBox="0 0 48 48" className="w-10 h-10">
            {/* Outfield outline (transparent) */}
            <path
              d="M24 44 L4 24 A28 28 0 0 1 44 24 Z"
              fill="none"
              stroke="#1a3d17"
              strokeWidth="1"
            />
            {/* Warning track */}
            <path
              d="M24 44 L8 28 A20 20 0 0 1 40 28 Z"
              fill="#8B4513"
              opacity="0.3"
            />
            {/* Infield */}
            <polygon
              points="24,44 34,34 24,24 14,34"
              fill="#C4A675"
            />
            {/* Foul lines */}
            <line x1="24" y1="44" x2="4" y2="24" stroke="white" strokeWidth="1" />
            <line x1="24" y1="44" x2="44" y2="24" stroke="white" strokeWidth="1" />
            {/* Fence */}
            <path
              d="M4 24 A28 28 0 0 1 44 24"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="2"
            />
            {/* 200 label */}
            <text x="24" y="14" textAnchor="middle" fontSize="8" fill="#333" fontWeight="bold">200</text>
          </svg>
        </DraggableIcon>
      </div>

      {/* Proportional reference note */}
      <p className="text-xs text-gray-400 mt-2">
        Football field: 360' × 160'
      </p>
      <p className="text-xs text-gray-400">
        200' fence = 55% of field length
      </p>
    </div>
  );
};

export default AssetLibrary;
