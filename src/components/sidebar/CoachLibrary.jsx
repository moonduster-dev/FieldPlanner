import DraggableIcon from '../ui/DraggableIcon';

/**
 * Coach icons library component
 */
const CoachLibrary = () => {
  return (
    <div className="flex gap-2 flex-wrap">
      {/* Male Coach */}
      <DraggableIcon
        type="coach"
        subType="male"
        label="Male Coach"
        iconPath="/icons/coach-male.svg"
        requiresLabel={true}
      >
        <svg viewBox="0 0 48 48" className="w-10 h-10">
          {/* Simple male figure icon */}
          <circle cx="24" cy="10" r="8" fill="#2563eb" />
          <path
            d="M12 44V28c0-6.627 5.373-12 12-12s12 5.373 12 12v16"
            fill="#2563eb"
          />
        </svg>
      </DraggableIcon>

      {/* Female Coach */}
      <DraggableIcon
        type="coach"
        subType="female"
        label="Female Coach"
        iconPath="/icons/coach-female.svg"
        requiresLabel={true}
      >
        <svg viewBox="0 0 48 48" className="w-10 h-10">
          {/* Simple female figure icon */}
          <circle cx="24" cy="10" r="8" fill="#db2777" />
          <path
            d="M14 44l4-16h-4l10-12 10 12h-4l4 16H14z"
            fill="#db2777"
          />
        </svg>
      </DraggableIcon>
    </div>
  );
};

export default CoachLibrary;
