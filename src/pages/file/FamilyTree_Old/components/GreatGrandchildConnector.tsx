// src/components/FamilyTree/components/GreatGrandchildConnector.tsx
import React, { useEffect, useState } from 'react';
import { NodePosition } from '../types';

interface GreatGrandchildConnectorProps {
  nodePositions: Record<string, NodePosition>;
  calculatedPositions: Record<string, { x: number; y: number }>;
}

/**
 * A dedicated component that creates ONLY the connection between
 * "New Child" and "great grand child"
 */
const GreatGrandchildConnector: React.FC<GreatGrandchildConnectorProps> = ({
  nodePositions,
  calculatedPositions,
}) => {
  const [connections, setConnections] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    // Wait for DOM to be ready
    setTimeout(() => {
      // Get all elements in the DOM
      // Find the "New Child" by name - more reliable than by ID
      const newChildElement =
        document.querySelector('[data-node-id="3"]') ||
        document.querySelector('#card-3') ||
        Array.from(document.querySelectorAll('*')).find(el =>
          el.textContent?.includes('New Child')
        );

      // Find the "great grand child" by name
      const ggChildElement =
        document.querySelector('[data-node-id="child-1741850976290"]') ||
        document.querySelector('#card-child-1741850976290') ||
        Array.from(document.querySelectorAll('*')).find(el =>
          el.textContent?.includes('great grand child')
        );

      if (!newChildElement || !ggChildElement) {
        console.error('Cannot find elements:', {
          'New Child': Boolean(newChildElement),
          'great grand child': Boolean(ggChildElement),
        });
        return;
      }

      // Get positions from DOM if available
      const newChildRect = newChildElement.getBoundingClientRect();
      const ggChildRect = ggChildElement.getBoundingClientRect();

      // Create connections
      const connectionElements: React.ReactNode[] = [];

      // Calculate connection points
      const childCenterX = newChildRect.left + newChildRect.width / 2;
      const childBottomY = newChildRect.bottom;

      const ggChildCenterX = ggChildRect.left + ggChildRect.width / 2;
      const ggChildTopY = ggChildRect.top;

      const midY = childBottomY + (ggChildTopY - childBottomY) / 2;

      // Create CSS-based connectors that will overlay the family tree
      // Vertical segment down from Child
      connectionElements.push(
        <div
          key="gg-v1"
          style={{
            position: 'absolute',
            left: `${childCenterX - 2}px`,
            top: `${childBottomY}px`,
            width: '4px',
            height: `${midY - childBottomY}px`,
            backgroundColor: '#2E7D32',
            zIndex: 10,
          }}
        />
      );

      // Horizontal segment
      connectionElements.push(
        <div
          key="gg-h"
          style={{
            position: 'absolute',
            left: `${Math.min(childCenterX, ggChildCenterX)}px`,
            top: `${midY - 2}px`,
            width: `${Math.abs(ggChildCenterX - childCenterX)}px`,
            height: '4px',
            backgroundColor: '#2E7D32',
            zIndex: 10,
          }}
        />
      );

      // Vertical segment to Great Grandchild
      connectionElements.push(
        <div
          key="gg-v2"
          style={{
            position: 'absolute',
            left: `${ggChildCenterX - 2}px`,
            top: `${midY}px`,
            width: '4px',
            height: `${ggChildTopY - midY + 20}px`, // Extend 20px into the card
            backgroundColor: '#2E7D32',
            zIndex: 10,
          }}
        />
      );

      // Set the connections
      setConnections(connectionElements);
    }, 500); // Give time for the DOM to render
  }, [nodePositions, calculatedPositions]);

  return (
    <div className="great-grandchild-connector-container">{connections}</div>
  );
};

export default GreatGrandchildConnector;
