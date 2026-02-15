import { useState, useCallback, useRef, useEffect } from 'react';
import PasswordGate from './components/auth/PasswordGate';
import Sidebar from './components/sidebar/Sidebar';
import FieldCanvas from './components/canvas/FieldCanvas';
import LabelModal from './components/modals/LabelModal';
import ExportModal from './components/modals/ExportModal';
import StationModal from './components/modals/StationModal';
import NoteModal from './components/modals/NoteModal';
import ContextMenu from './components/ui/ContextMenu';
import { useFieldItems } from './hooks/useFieldItems';
import { useAutoSave } from './hooks/useLocalStorage';
import { useStationTemplates } from './hooks/useStationTemplates';
import { CANVAS } from './constants/fieldDimensions';

const LOGO_STORAGE_KEY = 'fieldPlanner_logo';

function App() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Field items state
  const {
    items,
    isLoaded,
    addItem,
    updateItem,
    moveItem,
    removeItem,
    clearAll,
    loadItems,
  } = useFieldItems();

  // Auto-save to localStorage
  useAutoSave(items, 1000);

  // Station templates
  const {
    templates: stationTemplates,
    saveTemplate,
    deleteTemplate,
    updateTemplate,
  } = useStationTemplates();

  // Logo state
  const [logoUrl, setLogoUrl] = useState(null);

  // Load logo from localStorage on mount
  useEffect(() => {
    const savedLogo = localStorage.getItem(LOGO_STORAGE_KEY);
    if (savedLogo) {
      setLogoUrl(savedLogo);
    }
  }, []);

  // Handle logo change
  const handleLogoChange = useCallback((newLogoUrl) => {
    setLogoUrl(newLogoUrl);
    if (newLogoUrl) {
      localStorage.setItem(LOGO_STORAGE_KEY, newLogoUrl);
    } else {
      localStorage.removeItem(LOGO_STORAGE_KEY);
    }
  }, []);

  // Modal states
  const [showExportModal, setShowExportModal] = useState(false);
  const [showStationModal, setShowStationModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [labelModal, setLabelModal] = useState({
    isOpen: false,
    pendingItem: null,
  });

  // Context menu state
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    itemId: null,
    item: null,
  });

  // Handle adding items from drag-drop
  const handleItemAdd = useCallback((itemData) => {
    // Handle full softball field with fence distance
    if (itemData.type === 'full-softball-field') {
      const fenceDistance = itemData.subType === '220ft' ? 220 : 200;
      addItem({
        ...itemData,
        fenceDistance,
      });
      return;
    }

    if (itemData.requiresLabel) {
      // Show label modal for items that need names (e.g., coaches)
      setLabelModal({
        isOpen: true,
        pendingItem: itemData,
      });
    } else {
      // Add item directly
      addItem(itemData);
    }
  }, [addItem]);

  // Handle label modal submit
  const handleLabelSubmit = useCallback((label) => {
    if (labelModal.pendingItem) {
      addItem({
        ...labelModal.pendingItem,
        label,
      });
    }
    setLabelModal({ isOpen: false, pendingItem: null });
  }, [labelModal.pendingItem, addItem]);

  // Handle label modal cancel
  const handleLabelCancel = useCallback(() => {
    setLabelModal({ isOpen: false, pendingItem: null });
  }, []);

  // Handle station creation
  const handleStationSubmit = useCallback((stationConfig) => {
    // Add station to center of canvas
    addItem({
      type: 'station',
      stationName: stationConfig.name,
      widthFt: stationConfig.widthFt,
      heightFt: stationConfig.heightFt,
      color: stationConfig.color,
      equipment: stationConfig.equipment,
      x: CANVAS.WIDTH_PX / 2,
      y: CANVAS.HEIGHT_PX / 2,
    });
  }, [addItem]);

  // Handle note creation
  const handleNoteSubmit = useCallback((noteConfig) => {
    addItem({
      type: 'note',
      noteText: noteConfig.noteText,
      noteColor: noteConfig.noteColor,
      x: CANVAS.WIDTH_PX / 2,
      y: CANVAS.HEIGHT_PX / 2,
    });
    setShowNoteModal(false);
  }, [addItem]);

  // Handle note update
  const handleNoteUpdate = useCallback((noteId, updates) => {
    updateItem(noteId, updates);
    setShowNoteModal(false);
    setEditingNote(null);
  }, [updateItem]);

  // Handle opening station modal for new station
  const handleCreateStation = useCallback(() => {
    setEditingTemplate(null);
    setShowStationModal(true);
  }, []);

  // Handle opening station modal for editing template
  const handleEditTemplate = useCallback((template) => {
    setEditingTemplate(template);
    setShowStationModal(true);
  }, []);

  // Handle closing station modal
  const handleStationModalClose = useCallback(() => {
    setShowStationModal(false);
    setEditingTemplate(null);
  }, []);

  // Handle opening note modal for new note
  const handleCreateNote = useCallback(() => {
    setEditingNote(null);
    setShowNoteModal(true);
  }, []);

  // Handle opening note modal for editing
  const handleEditNote = useCallback((note) => {
    setEditingNote(note);
    setShowNoteModal(true);
  }, []);

  // Handle closing note modal
  const handleNoteModalClose = useCallback(() => {
    setShowNoteModal(false);
    setEditingNote(null);
  }, []);

  // Handle context menu (right-click)
  const handleContextMenu = useCallback((itemId, x, y) => {
    const item = items.find(i => i.id === itemId);
    setContextMenu({
      visible: true,
      x,
      y,
      itemId,
      item,
    });
  }, [items]);

  // Handle long press (mobile)
  const handleLongPress = useCallback((itemId, x, y) => {
    const item = items.find(i => i.id === itemId);
    setContextMenu({
      visible: true,
      x,
      y,
      itemId,
      item,
    });
  }, [items]);

  // Handle context menu close
  const handleContextMenuClose = useCallback(() => {
    setContextMenu({
      visible: false,
      x: 0,
      y: 0,
      itemId: null,
      item: null,
    });
  }, []);

  // Handle delete from context menu
  const handleDelete = useCallback((itemId) => {
    removeItem(itemId);
  }, [removeItem]);

  // Handle item rotation
  const handleItemRotate = useCallback((itemId, rotation) => {
    updateItem(itemId, { rotation });
  }, [updateItem]);

  // Handle import
  const handleImport = useCallback((importedItems) => {
    loadItems(importedItems);
  }, [loadItems]);

  // Show loading state
  if (!isLoaded) {
    return (
      <PasswordGate>
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-gray-600">Loading...</div>
        </div>
      </PasswordGate>
    );
  }

  return (
    <PasswordGate>
    <div className="w-full h-full flex bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        onSaveClick={() => setShowExportModal(true)}
        logoUrl={logoUrl}
        onLogoChange={handleLogoChange}
        onCreateStation={handleCreateStation}
        stationTemplates={stationTemplates}
        onDeleteTemplate={deleteTemplate}
        onEditTemplate={handleEditTemplate}
        onCreateNote={handleCreateNote}
      />

      {/* Main canvas area */}
      <div ref={containerRef} className="flex-1 h-full relative">
        <FieldCanvas
          ref={canvasRef}
          items={items}
          logoUrl={logoUrl}
          onItemMove={moveItem}
          onItemAdd={handleItemAdd}
          onItemRotate={handleItemRotate}
          onContextMenu={handleContextMenu}
          onLongPress={handleLongPress}
          containerRef={containerRef}
        />
      </div>

      {/* Label Modal */}
      <LabelModal
        isOpen={labelModal.isOpen}
        title="Enter Coach Name"
        placeholder="Coach name..."
        onSubmit={handleLabelSubmit}
        onCancel={handleLabelCancel}
      />

      {/* Station Modal */}
      <StationModal
        isOpen={showStationModal}
        onSubmit={handleStationSubmit}
        onCancel={handleStationModalClose}
        onSaveTemplate={saveTemplate}
        onUpdateTemplate={updateTemplate}
        editingTemplate={editingTemplate}
      />

      {/* Note Modal */}
      <NoteModal
        isOpen={showNoteModal}
        onSubmit={handleNoteSubmit}
        onUpdate={handleNoteUpdate}
        onCancel={handleNoteModalClose}
        editingNote={editingNote}
      />

      {/* Export/Import Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        items={items}
        onImport={handleImport}
        onClear={clearAll}
        canvasRef={canvasRef}
      />

      {/* Context Menu */}
      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        itemId={contextMenu.itemId}
        item={contextMenu.item}
        onDelete={handleDelete}
        onEdit={handleEditNote}
        onClose={handleContextMenuClose}
      />
    </div>
    </PasswordGate>
  );
}

export default App;
