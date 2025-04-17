// src/adapters/ReactAdapter.tsx
import React, { useEffect, useRef, useState } from 'react';
import fmFamilyTree from '../index';
import { Person } from '../types';

export interface FamilyTreeProps {
  data: Person[];
  width?: string | number;
  height?: string | number;
  className?: string;
  nodeWidth?: number;
  nodeHeight?: number;
  nodeSeparation?: number;
  levelSeparation?: number;
  horizontal?: boolean;
  style?: React.CSSProperties;
  onPersonClick?: (person: Person) => void;
  renderCard?: (person: Person) => React.ReactNode;
  editable?: boolean;
}

/**
 * React component for the family tree
 */
export const FamilyTree: React.FC<FamilyTreeProps> = ({
  data,
  width = '100%',
  height = '500px',
  className = '',
  nodeWidth,
  nodeHeight,
  nodeSeparation,
  levelSeparation,
  horizontal = false,
  style = {},
  onPersonClick,
  renderCard,
  editable = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize the chart
  useEffect(() => {
    if (!containerRef.current || !data.length) {
      return;
    }

    containerRef.current.classList.add('fm-family-tree');

    // Create the chart
    const chart = fmFamilyTree.createChart(containerRef.current, data);

    // Configure chart options
    if (nodeSeparation) {
      chart.setCardXSpacing(nodeSeparation);
    }
    if (levelSeparation) {
      chart.setCardYSpacing(levelSeparation);
    }

    if (horizontal) {
      chart.setOrientationHorizontal();
    } else {
      chart.setOrientationVertical();
    }

    // Set up card
    const card = chart.setCard(fmFamilyTree.CardHtml);

    if (nodeWidth && nodeHeight) {
      card.setCardDim({
        width: nodeWidth,
        height: nodeHeight,
      });
    }

    // Set up click handler
    if (onPersonClick) {
      card.setOnCardClick((e, d) => {
        chart.updateMain(d);
        onPersonClick(d.data);
      });
    }

    // Initialize editable mode if requested
    if (editable) {
      chart.editTree();
    }

    // Update the tree
    chart.updateTree({ initial: true });
    chartRef.current = chart;
    setIsInitialized(true);

    return () => {
      if (chartRef.current) {
        // Any cleanup needed
      }
    };
  }, []);

  // Update the chart data when it changes
  useEffect(() => {
    if (chartRef.current && isInitialized && data.length) {
      chartRef.current.updateData(data);
      chartRef.current.updateTree();
    }
  }, [data, isInitialized]);

  // Update chart configuration when props change
  useEffect(() => {
    if (!chartRef.current || !isInitialized) {
      return;
    }

    if (horizontal) {
      chartRef.current.setOrientationHorizontal();
    } else {
      chartRef.current.setOrientationVertical();
    }

    if (nodeSeparation) {
      chartRef.current.setCardXSpacing(nodeSeparation);
    }
    if (levelSeparation) {
      chartRef.current.setCardYSpacing(levelSeparation);
    }

    chartRef.current.updateTree();
  }, [horizontal, nodeSeparation, levelSeparation, isInitialized]);

  return (
    <div
      ref={containerRef}
      className={`fm-family-tree-container ${className}`}
      style={{
        width,
        height,
        ...style,
      }}
    />
  );
};

/**
 * Higher-order component for creating an editable family tree
 */
export const EditableFamilyTree: React.FC<FamilyTreeProps> = props => {
  return <FamilyTree {...props} editable={true} />;
};

export default FamilyTree;
