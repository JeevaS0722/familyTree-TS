// src/components/FamilyTree/controls/ConfigPanel.tsx
import React, { useState } from 'react';
import { useTreeContext } from '../../../context/TreeContext';

interface ConfigPanelProps {
  // Add any props needed
}

const ConfigPanel: React.FC<ConfigPanelProps> = () => {
  const { state, updateConfig, updateTree } = useTreeContext();
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (key: string, value: any) => {
    const newConfig: any = {};
    newConfig[key] = value;
    updateConfig(newConfig);
  };

  const handleCardDimensionChange = (key: string, value: number) => {
    updateConfig({
      cardDimensions: {
        ...state.config.cardDimensions,
        [key]: value,
      },
    });
  };

  const handleRangeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const value = parseInt(e.target.value, 10);
    handleChange(key, value);
  };

  const handleCardDimRangeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const value = parseInt(e.target.value, 10);
    handleCardDimensionChange(key, value);
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const value = e.target.checked;
    handleChange(key, value);
  };

  const applyChanges = () => {
    updateTree();
  };

  return (
    <div className={`f3-config-panel ${isOpen ? 'open' : 'closed'}`}>
      <button className="f3-config-toggle" onClick={togglePanel}>
        {isOpen ? '×' : '⚙'}
      </button>
      <div className="f3-config-content">
        <h3>Tree Configuration</h3>

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
          <h4>Card Options</h4>
          <div className="f3-config-control">
            <label>Show Mini Tree</label>
            <label className="f3-switch">
              <input
                type="checkbox"
                checked={state.config.showMiniTree}
                onChange={e => handleCheckboxChange(e, 'showMiniTree')}
              />
              <span className="f3-slider"></span>
            </label>
          </div>

          <div className="f3-config-control">
            <label>Enable Link Break</label>
            <label className="f3-switch">
              <input
                type="checkbox"
                checked={state.config.linkBreak}
                onChange={e => handleCheckboxChange(e, 'linkBreak')}
              />
              <span className="f3-slider"></span>
            </label>
          </div>

          <div className="f3-config-control">
            <label>Single Parent Empty Card</label>
            <label className="f3-switch">
              <input
                type="checkbox"
                checked={state.config.singleParentEmptyCard}
                onChange={e => handleCheckboxChange(e, 'singleParentEmptyCard')}
              />
              <span className="f3-slider"></span>
            </label>
          </div>
        </div>

        <div className="f3-config-section">
          <h4>Card Dimensions</h4>
          <div className="f3-config-control">
            <label>Width: {state.config.cardDimensions.w}px</label>
            <input
              type="range"
              min="300"
              max="600"
              value={state.config.cardDimensions.w}
              onChange={e => handleCardDimRangeChange(e, 'w')}
            />
          </div>

          <div className="f3-config-control">
            <label>Height: {state.config.cardDimensions.h}px</label>
            <input
              type="range"
              min="155"
              max="310"
              value={state.config.cardDimensions.h}
              onChange={e => handleCardDimRangeChange(e, 'h')}
            />
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

        <div className="f3-config-section">
          <h4>Animation</h4>
          <div className="f3-config-control">
            <label>Transition Time: {state.config.transitionTime}ms</label>
            <input
              type="range"
              min="0"
              max="3000"
              step="100"
              value={state.config.transitionTime}
              onChange={e => handleRangeChange(e, 'transitionTime')}
            />
          </div>
        </div>

        <button className="f3-config-apply" onClick={applyChanges}>
          Apply Changes
        </button>
      </div>
    </div>
  );
};

export default ConfigPanel;
