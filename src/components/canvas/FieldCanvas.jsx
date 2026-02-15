import { useRef, useState, useCallback, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Stage, Layer } from 'react-konva';
import FieldBackground from './FieldBackground';
import PlacedItem from './PlacedItem';
import { CANVAS } from '../../constants/fieldDimensions';

/**
 * Main canvas component wrapping Konva Stage
 *
 * @param {Object} props
 * @param {Array} props.items - Array of placed items
 * @param {Function} props.onItemMove - Callback when item is moved
 * @param {Function} props.onItemAdd - Callback when item is added
 * @param {Function} props.onContextMenu - Callback for context menu
 * @param {Object} props.pendingItem - Item being dragged from sidebar
 * @param {Function} props.onDrop - Callback when item is dropped
 */
const FieldCanvas = forwardRef(({
  items,
  logoUrl,
  onItemMove,
  onItemAdd,
  onItemRotate,
  onContextMenu,
  onLongPress,
  containerRef,
}, ref) => {
  const stageRef = useRef(null);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Canvas dimensions
  const canvasWidth = CANVAS.WIDTH_PX;
  const canvasHeight = CANVAS.HEIGHT_PX;

  // Expose stage ref to parent
  useImperativeHandle(ref, () => ({
    getStage: () => stageRef.current,
    // Method to export at full resolution
    exportImage: (options = {}) => {
      const stage = stageRef.current;
      if (!stage) return null;

      // Store original state
      const originalScale = { x: stage.scaleX(), y: stage.scaleY() };
      const originalPos = { x: stage.x(), y: stage.y() };
      const originalWidth = stage.width();
      const originalHeight = stage.height();

      // Set to full canvas size at 1:1 scale
      stage.width(canvasWidth);
      stage.height(canvasHeight);
      stage.scale({ x: 1, y: 1 });
      stage.position({ x: 0, y: 0 });

      // Export
      const dataUrl = stage.toDataURL({
        pixelRatio: options.pixelRatio || 2,
        mimeType: options.mimeType || 'image/png',
      });

      // Restore original state
      stage.width(originalWidth);
      stage.height(originalHeight);
      stage.scale(originalScale);
      stage.position(originalPos);

      return {
        dataUrl,
        width: canvasWidth,
        height: canvasHeight,
      };
    },
  }));

  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef?.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [containerRef]);

  // Center the canvas initially
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      // Calculate initial position to center the field
      const initialX = (dimensions.width - canvasWidth * scale) / 2;
      const initialY = (dimensions.height - canvasHeight * scale) / 2;
      setStagePos({ x: Math.max(0, initialX), y: Math.max(0, initialY) });
    }
  }, [dimensions, canvasWidth, canvasHeight, scale]);

  // Handle zoom with scroll wheel
  const handleWheel = useCallback((e) => {
    e.evt.preventDefault();

    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = scale;
    const pointer = stage.getPointerPosition();

    // Zoom settings
    const scaleBy = 1.1;
    const minScale = 0.3;
    const maxScale = 3;

    // Calculate new scale
    let newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    newScale = Math.max(minScale, Math.min(maxScale, newScale));

    // Calculate new position to zoom toward pointer
    const mousePointTo = {
      x: (pointer.x - stagePos.x) / oldScale,
      y: (pointer.y - stagePos.y) / oldScale,
    };

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setScale(newScale);
    setStagePos(newPos);
  }, [scale, stagePos]);

  // Handle stage drag (pan)
  const handleDragEnd = useCallback((e) => {
    if (e.target === stageRef.current) {
      setStagePos({
        x: e.target.x(),
        y: e.target.y(),
      });
    }
  }, []);

  // Handle drop from sidebar
  const handleDrop = useCallback((e) => {
    e.preventDefault();

    const stage = stageRef.current;
    if (!stage) return;

    // Get the data from the drag event
    const itemData = e.dataTransfer.getData('application/json');
    if (!itemData) return;

    try {
      const item = JSON.parse(itemData);

      // Get stage position
      const stageBox = stage.container().getBoundingClientRect();

      // Calculate position on canvas
      const x = (e.clientX - stageBox.left - stagePos.x) / scale;
      const y = (e.clientY - stageBox.top - stagePos.y) / scale;

      // Add the item at the drop position
      onItemAdd && onItemAdd({
        ...item,
        x,
        y,
      });
    } catch (err) {
      console.error('Failed to parse dropped item:', err);
    }
  }, [stagePos, scale, onItemAdd]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Handle item drag end
  const handleItemDragEnd = useCallback((id, x, y) => {
    onItemMove && onItemMove(id, x, y);
  }, [onItemMove]);

  // Handle item rotation
  const handleItemRotate = useCallback((id, rotation) => {
    onItemRotate && onItemRotate(id, rotation);
  }, [onItemRotate]);

  // Handle context menu on items
  const handleItemContextMenu = useCallback((id, e) => {
    const stage = stageRef.current;
    if (!stage) return;

    const menuX = e.evt.clientX;
    const menuY = e.evt.clientY;

    onContextMenu && onContextMenu(id, menuX, menuY);
  }, [onContextMenu]);

  // Handle long press for mobile
  const longPressTimerRef = useRef(null);

  const handleTouchStart = useCallback((id) => (e) => {
    longPressTimerRef.current = setTimeout(() => {
      const touch = e.evt.touches[0];
      onLongPress && onLongPress(id, touch.clientX, touch.clientY);
    }, 500);
  }, [onLongPress]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  return (
    <div
      style={{ width: '100%', height: '100%', overflow: 'hidden' }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        x={stagePos.x}
        y={stagePos.y}
        scaleX={scale}
        scaleY={scale}
        draggable
        onDragEnd={handleDragEnd}
        onWheel={handleWheel}
      >
        <Layer>
          {/* Background: field and track */}
          <FieldBackground logoUrl={logoUrl} />

          {/* Placed items */}
          {items.map((item) => (
            <PlacedItem
              key={item.id}
              item={item}
              onDragEnd={handleItemDragEnd}
              onRotate={handleItemRotate}
              onContextMenu={handleItemContextMenu}
              onTouchStart={handleTouchStart(item.id)}
              onTouchEnd={handleTouchEnd}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
});

FieldCanvas.displayName = 'FieldCanvas';

export default FieldCanvas;
