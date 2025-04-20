// src/components/FamilyTree/controls/Toolbar.tsx
import React from 'react';
import { useTreeContext } from '../../../context/TreeContext';

interface ToolbarProps {
  zoomIn: () => void;
  zoomOut: () => void;
  fitTree: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ zoomIn, zoomOut, fitTree }) => {
  const { state, updateConfig } = useTreeContext();

  // Toggle orientation
  const toggleOrientation = () => {
    updateConfig({
      isHorizontal: !state.config.isHorizontal,
    });
  };

  // Toggle config panel
  const toggleConfigPanel = () => {
    // This will be implemented to toggle the config panel visibility
    console.log('Config panel toggle clicked');
  };

  return (
    <div className="f3-toolbar">
      <div className="f3-toolbar-group">
        <button className="f3-toolbar-button" onClick={zoomIn} title="Zoom In">
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
          onClick={toggleConfigPanel}
          title="Settings"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
