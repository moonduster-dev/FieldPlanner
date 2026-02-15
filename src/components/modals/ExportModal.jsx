import { useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import { exportToJson, importFromJson, clearLocalStorage } from '../../utils/storage';

/**
 * Modal for export/import/clear actions
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Function} props.onClose - Close callback
 * @param {Array} props.items - Current items for export
 * @param {Function} props.onImport - Callback when items are imported
 * @param {Function} props.onClear - Callback to clear all items
 * @param {Object} props.stageRef - Reference to Konva stage for PDF export
 */
const ExportModal = ({ isOpen, onClose, items, onImport, onClear, canvasRef }) => {
  const fileInputRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportJson = () => {
    const filename = `field-layout-${new Date().toISOString().split('T')[0]}.json`;
    exportToJson(items, filename);
    onClose();
  };

  const handleExportPdf = async () => {
    if (!canvasRef?.current?.exportImage) {
      alert('Unable to export PDF. Canvas not available.');
      return;
    }

    setIsExporting(true);

    try {
      // Export the canvas at full resolution
      const { dataUrl, width, height } = canvasRef.current.exportImage({
        pixelRatio: 2,
        mimeType: 'image/png',
      });

      // Get all stations and notes from items
      const stations = items.filter(item => item.type === 'station');
      const notes = items.filter(item => item.type === 'note');

      // Calculate legend width (250px for legend panel)
      const hasLegendContent = stations.length > 0 || notes.length > 0;
      const legendWidth = hasLegendContent ? 250 : 0;
      const totalWidth = width + legendWidth;

      // Create PDF with extra space for legend
      const pdf = new jsPDF({
        orientation: totalWidth > height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [totalWidth, height],
      });

      // Add field image
      pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);

      // Add station legend if there are stations
      if (stations.length > 0) {
        const legendX = width + 10;
        let currentY = 20;

        // Legend title
        pdf.setFillColor(51, 51, 51);
        pdf.setTextColor(51, 51, 51);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('STATIONS', legendX, currentY);
        currentY += 25;

        // Draw each station
        stations.forEach((station, index) => {
          const stationName = station.stationName || 'Station';
          const widthFt = station.widthFt || 20;
          const heightFt = station.heightFt || 20;
          const equipment = station.equipment || [];
          const color = station.color || '#3b82f6';

          // Check if we need a new page
          if (currentY > height - 100) {
            pdf.addPage([totalWidth, height]);
            currentY = 20;
          }

          // Station color indicator
          const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
            } : { r: 59, g: 130, b: 246 };
          };
          const rgb = hexToRgb(color);
          pdf.setFillColor(rgb.r, rgb.g, rgb.b);
          pdf.circle(legendX + 8, currentY - 4, 6, 'F');

          // Station name
          pdf.setTextColor(31, 41, 55);
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text(stationName, legendX + 20, currentY);
          currentY += 16;

          // Dimensions
          pdf.setTextColor(107, 114, 128);
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.text(`Dimensions: ${widthFt}' × ${heightFt}'`, legendX + 20, currentY);
          currentY += 14;

          // Equipment
          if (equipment.length > 0) {
            pdf.setTextColor(107, 114, 128);
            pdf.setFontSize(9);
            pdf.text('Equipment:', legendX + 20, currentY);
            currentY += 12;

            equipment.forEach((item) => {
              pdf.setFontSize(9);
              pdf.text(`• ${item}`, legendX + 28, currentY);
              currentY += 11;
            });
          }

          // Add spacing between stations
          currentY += 15;

          // Draw separator line
          if (index < stations.length - 1) {
            pdf.setDrawColor(229, 231, 235);
            pdf.line(legendX, currentY - 8, legendX + legendWidth - 20, currentY - 8);
          }
        });

        // Add notes section if there are notes
        if (notes.length > 0) {
          currentY += 10;

          // Notes title
          pdf.setFillColor(51, 51, 51);
          pdf.setTextColor(51, 51, 51);
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          pdf.text('NOTES', legendX, currentY);
          currentY += 20;

          notes.forEach((note, index) => {
            const noteText = note.noteText || 'Note';

            // Check if we need a new page
            if (currentY > height - 60) {
              pdf.addPage([totalWidth, height]);
              currentY = 20;
            }

            // Note indicator
            pdf.setFillColor(254, 243, 199);
            pdf.rect(legendX, currentY - 10, 12, 12, 'F');
            pdf.setDrawColor(217, 119, 6);
            pdf.rect(legendX, currentY - 10, 12, 12, 'S');

            // Note text
            pdf.setTextColor(146, 64, 14);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');

            // Wrap note text
            const maxWidth = legendWidth - 40;
            const splitText = pdf.splitTextToSize(noteText, maxWidth);
            pdf.text(splitText, legendX + 18, currentY);
            currentY += splitText.length * 12 + 15;

            // Draw separator line
            if (index < notes.length - 1) {
              pdf.setDrawColor(229, 231, 235);
              pdf.line(legendX, currentY - 8, legendX + legendWidth - 20, currentY - 8);
            }
          });
        }
      }

      // Save PDF
      const filename = `field-layout-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);

      onClose();
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedItems = await importFromJson(file);
      onImport(importedItems);
      onClose();
    } catch (error) {
      alert('Failed to import file: ' + error.message);
    }

    // Reset file input
    e.target.value = '';
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all items? This cannot be undone.')) {
      clearLocalStorage();
      onClear();
      onClose();
    }
  };

  // Count stations and notes for display
  const stationCount = items.filter(item => item.type === 'station').length;
  const noteCount = items.filter(item => item.type === 'note').length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Save & Load</h2>

        <div className="space-y-3">
          {/* Export PDF Button */}
          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="w-full flex items-center gap-3 px-4 py-3 bg-purple-50
              text-purple-700 rounded-lg hover:bg-purple-100 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
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
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <div className="text-left">
              <span className="font-medium block">
                {isExporting ? 'Exporting...' : 'Download as PDF'}
              </span>
              {(stationCount > 0 || noteCount > 0) && (
                <span className="text-xs text-purple-500">
                  Includes {stationCount > 0 ? `${stationCount} station${stationCount > 1 ? 's' : ''}` : ''}
                  {stationCount > 0 && noteCount > 0 ? ', ' : ''}
                  {noteCount > 0 ? `${noteCount} note${noteCount > 1 ? 's' : ''}` : ''}
                </span>
              )}
            </div>
          </button>

          {/* Export JSON Button */}
          <button
            onClick={handleExportJson}
            className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50
              text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span className="font-medium">Export Layout (JSON)</span>
          </button>

          {/* Import Button */}
          <button
            onClick={handleImportClick}
            className="w-full flex items-center gap-3 px-4 py-3 bg-green-50
              text-green-700 rounded-lg hover:bg-green-100 transition-colors"
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <span className="font-medium">Import Layout</span>
          </button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Divider */}
          <hr className="border-gray-200" />

          {/* Clear Button */}
          <button
            onClick={handleClear}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-50
              text-red-700 rounded-lg hover:bg-red-100 transition-colors"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span className="font-medium">Clear All Items</span>
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 text-gray-600 bg-gray-100
            rounded-lg hover:bg-gray-200 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ExportModal;
