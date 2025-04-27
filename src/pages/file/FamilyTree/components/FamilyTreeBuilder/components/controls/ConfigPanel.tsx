// src/components/FamilyTree/controls/ConfigPanel.tsx
import React from 'react';
import { useTreeContext } from '../../context/TreeContext';

interface ConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ isOpen, onClose }) => {
  const { state, updateConfig } = useTreeContext();

  const togglePanel = () => {
    onClose();
  };

  const handleChange = (key: string, value: any) => {
    const newConfig: any = {};
    newConfig[key] = value;
    updateConfig(newConfig);
  };

  const handleRangeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const value = parseInt(e.target.value, 10);
    handleChange(key, value);
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const value = e.target.checked;
    handleChange(key, value);
  };
  // '⚙'
  return (
    <div className={`f3-config-panel ${isOpen ? 'open' : 'closed'}`}>
      <button className="f3-config-toggle" onClick={togglePanel}>
        {isOpen ? '×' : ''}
      </button>
      <div className="f3-config-content">
        <h3>Tree Configuration</h3>

        <div className="f3-config-section">
          <h4>Interaction Mode</h4>
          <div className="f3-config-control">
            <label>Highlight Path on Hover</label>
            <label className="f3-switch">
              <input
                type="checkbox"
                checked={state.config.highlightHoverPath}
                onChange={e => handleCheckboxChange(e, 'highlightHoverPath')}
              />
              <span className="f3-slider"></span>
            </label>
          </div>
        </div>

        <div className="f3-config-section">
          <h4>Orientation</h4>
          <div className="f3-config-control">
            <label className="f3-switch">
              <input
                type="checkbox"
                checked={state.config.isHorizontal}
                onChange={e => handleCheckboxChange(e, 'isHorizontal')}
              />
              <span className="f3-slider"></span>
            </label>
            <span>{state.config.isHorizontal ? 'Horizontal' : 'Vertical'}</span>
          </div>
        </div>

        <div className="f3-config-section">
          <h4>Spacing</h4>
          <div className="f3-config-control">
            <label>Node Separation: {state.config.nodeSeparation}px</label>
            <input
              type="range"
              min="350"
              max="750"
              value={state.config.nodeSeparation}
              onChange={e => handleRangeChange(e, 'nodeSeparation')}
            />
          </div>

          <div className="f3-config-control">
            <label>Level Separation: {state.config.levelSeparation}px</label>
            <input
              type="range"
              min="250"
              max="500"
              value={state.config.levelSeparation}
              onChange={e => handleRangeChange(e, 'levelSeparation')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;
