// src/components/FamilyTree/controls/Toolbar.tsx
import React, { useState } from 'react';
import { useTreeContext } from '../../context/TreeContext';
import ConfigPanel from './ConfigPanel';

interface ToolbarProps {
  zoomIn: () => void;
  zoomOut: () => void;
  fitTree: () => void;
  svgRef?: React.RefObject<SVGSVGElement>;
}

const Toolbar: React.FC<ToolbarProps> = ({
  zoomIn,
  zoomOut,
  fitTree,
  svgRef,
}) => {
  const { state, updateConfig } = useTreeContext();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOrientation = () => {
    updateConfig({
      isHorizontal: !state.config.isHorizontal,
    });
  };

  const toggleConfigPanel = () => {
    setIsOpen(!isOpen);
  };
  const exportSvgToPng = () => {
    if (!svgRef?.current) {
      console.error('SVG reference is not available');
      return;
    }
    const svg = svgRef.current;

    // Get the SVG data
    const svgData = new XMLSerializer().serializeToString(svg);

    // Create a copy of the SVG to modify before export
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgData, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;

    // Create a background rect with the same color as the app background
    const backgroundRect = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect'
    );
    backgroundRect.setAttribute('width', '100%');
    backgroundRect.setAttribute('height', '100%');
    backgroundRect.setAttribute('fill', 'rgb(33, 33, 33)'); // Match app background color

    // Insert the background rect as the first child of the SVG
    if (svgElement.firstChild) {
      svgElement.insertBefore(backgroundRect, svgElement.firstChild);
    } else {
      svgElement.appendChild(backgroundRect);
    }

    // Get the modified SVG data
    const modifiedSvgData = new XMLSerializer().serializeToString(svgDoc);
    const svgBlob = new Blob([modifiedSvgData], {
      type: 'image/svg+xml;charset=utf-8',
    });

    const DOMURL = window.URL || window.webkitURL || window;
    const url = DOMURL.createObjectURL(svgBlob);

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Could not create canvas context');
      return;
    }

    // Get SVG dimensions and set canvas size
    const bbox = svg.getBBox();
    const svgWidth = svg.width.baseVal.value || bbox.width;
    const svgHeight = svg.height.baseVal.value || bbox.height;

    // Create image from SVG
    const img = new Image();

    img.onload = () => {
      // Quality enhancement: Scale factor for higher resolution
      const scaleFactor = 4; // Double the resolution

      // Set canvas size with the scale factor
      canvas.width = Math.max(svgWidth, 800) * scaleFactor;
      canvas.height = Math.max(svgHeight, 600) * scaleFactor;

      // Apply high-quality rendering settings
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Account for device pixel ratio for high-DPI displays
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.style.width = Math.max(svgWidth, 800) + 'px';
      canvas.style.height = Math.max(svgHeight, 600) + 'px';

      // Scale the context according to our quality settings
      ctx.scale(scaleFactor * pixelRatio, scaleFactor * pixelRatio);

      // Draw SVG on canvas at higher quality
      ctx.drawImage(img, 0, 0, svgWidth, svgHeight);

      // Convert canvas to Blob instead of data URL with max quality
      canvas.toBlob(
        blob => {
          if (!blob) {
            console.error('Failed to create blob from canvas');
            return;
          }

          // Create download link with Blob URL instead of data URL
          const blobUrl = DOMURL.createObjectURL(blob);
          const downloadLink = document.createElement('a');
          downloadLink.href = blobUrl;
          downloadLink.download = `family-tree-${new Date().toISOString().slice(0, 10)}.png`;

          // Trigger download
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);

          // Cleanup
          DOMURL.revokeObjectURL(blobUrl);
        },
        'image/png',
        1.0
      ); // 1.0 is max quality

      // Cleanup SVG URL
      DOMURL.revokeObjectURL(url);
    };

    img.onerror = error => {
      console.error('Error loading SVG for export:', error);
      DOMURL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const exportAsPng = () => {
    fitTree();
    setTimeout(() => {
      exportSvgToPng();
    }, 1050);
  };

  return (
    <>
      <div className="f3-toolbar">
        <div className="f3-toolbar-group">
          <button
            className="f3-toolbar-button"
            onClick={zoomIn}
            title="Zoom In"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              <path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z" />
            </svg>
          </button>
          <button
            className="f3-toolbar-button"
            onClick={zoomOut}
            title="Zoom Out"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              <path d="M7 9h5v1H7z" />
            </svg>
          </button>
          <button
            className="f3-toolbar-button"
            onClick={fitTree}
            title="Fit Tree"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 5v4h2V5h4V3H5c-1.1 0-2 .9-2 2zm2 10H3v4c0 1.1.9 2 2 2h4v-2H5v-4zm14 4h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4zm0-16h-4v2h4v4h2V5c0-1.1-.9-2-2-2z" />
            </svg>
          </button>
        </div>
        <div className="f3-toolbar-group">
          <button
            className="f3-toolbar-button"
            onClick={toggleOrientation}
            title="Toggle Orientation"
          >
            {state.config.isHorizontal ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 18l-3-3v2H5v2h13v2l3-3zM3 6l3 3V7h13V5H6V3L3 6z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 3l-3 3V4H6C4.9 4 4 4.9 4 6v12c0 1.1.9 2 2 2h9v-2H6V6h9v2l3-3-3-3-3 3z" />
              </svg>
            )}
          </button>
          <button
            className="f3-toolbar-button"
            onClick={exportAsPng}
            title="Export as PNG"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
          </button>
          <button
            className="f3-toolbar-button"
            onClick={toggleConfigPanel}
            title="Settings"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
          </button>
        </div>
      </div>
      {isOpen && <ConfigPanel isOpen={isOpen} onClose={toggleConfigPanel} />}
    </>
  );
};

export default Toolbar;
