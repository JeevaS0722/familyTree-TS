// src/components/FamilyTree/components/TreeConnectors.tsx
import React, { useEffect, useState } from 'react';
import { FamilyMember, NodePosition, COLORS } from '../types';
import { getAllMembers } from '../treeUtils';

interface TreeConnectorsProps {
  nodePositions: Record<string, NodePosition>;
  familyData: FamilyMember;
  calculatedPositions: Record<string, { x: number; y: number }>;
  scale: number;
}

const TreeConnectors: React.FC<TreeConnectorsProps> = ({
  nodePositions,
  familyData,
  calculatedPositions,
}) => {
  const [connections, setConnections] = useState<JSX.Element[]>([]);
  const [greatGrandchildConnectors, setGreatGrandchildConnectors] = useState<
    React.CSSProperties[]
  >([]);

  // This effect handles the SVG tree connections (original functionality)
  useEffect(() => {
    // Merged positions from both sources
    const allPositions = { ...calculatedPositions, ...nodePositions };
    // Track all connections we've drawn to avoid duplicates
    const processedConnections = new Set<string>();
    // Store all SVG paths
    const allPaths: JSX.Element[] = [];

    // Helper to get a node's position data
    const getPosition = (id: string) => {
      return allPositions[id];
    };

    // Helper to generate a unique connection ID
    const getConnectionId = (id1: string, id2: string, type: string) => {
      return `${type}-${[id1, id2].sort().join('-')}`;
    };

    // Draws a horizontal line between partners and returns connection data
    const drawPartnerConnection = (
      member: FamilyMember,
      partner: FamilyMember
    ) => {
      const connectionId = getConnectionId(member.id, partner.id, 'partner');

      // Skip if already processed
      if (processedConnections.has(connectionId)) {
        return null;
      }

      const memberPos = getPosition(member.id);
      const partnerPos = getPosition(partner.id);

      if (!memberPos || !partnerPos) {
        return null;
      }

      // Determine which is on the left
      const isLeftMember = memberPos.x < partnerPos.x;
      const leftPos = isLeftMember ? memberPos : partnerPos;
      const rightPos = isLeftMember ? partnerPos : memberPos;

      // Calculate connection points
      const connectionY = leftPos.y + leftPos.height / 3; // Connect at 1/3 from top
      const leftX = leftPos.x + leftPos.width;
      const rightX = rightPos.x;
      const midpointX = leftX + (rightX - leftX) / 2;

      // Bottom of the partnership for child connections
      const bottomY = Math.max(
        leftPos.y + leftPos.height,
        rightPos.y + rightPos.height
      );

      // Draw horizontal connector
      allPaths.push(
        <path
          key={`h-${connectionId}`}
          d={`M ${leftX} ${connectionY} H ${rightX}`}
          stroke={COLORS.connection}
          strokeWidth="2"
          fill="none"
        />
      );

      // Draw vertical line to bottom if needed
      if (connectionY < bottomY - 5) {
        allPaths.push(
          <path
            key={`v-${connectionId}`}
            d={`M ${midpointX} ${connectionY} V ${bottomY}`}
            stroke={COLORS.connection}
            strokeWidth="2"
            fill="none"
          />
        );
      }

      // Mark as processed
      processedConnections.add(connectionId);

      // Return data for child connections
      return {
        midpointX,
        bottomY,
      };
    };

    // Draws connections from a parent/partnership to their children
    const drawChildConnections = (
      children: FamilyMember[],
      parentX: number,
      parentBottomY: number,
      connectionKey: string
    ) => {
      // Filter children with valid positions
      const childrenWithPositions = children
        .map(child => {
          const pos = getPosition(child.id);
          if (!pos) {
            return null;
          }

          return {
            id: child.id,
            x: pos.x + pos.width / 2, // Center of child
            y: pos.y, // Top of child
            child,
          };
        })
        .filter(Boolean) as Array<{
        id: string;
        x: number;
        y: number;
        child: FamilyMember;
      }>;

      if (childrenWithPositions.length === 0) {
        return;
      }

      // Sort by x-position
      childrenWithPositions.sort((a, b) => a.x - b.x);

      // Find the top-most position of all children
      const minChildY = Math.min(...childrenWithPositions.map(c => c.y));

      // Calculate trunk height (halfway between parent and children)
      const trunkY = parentBottomY + (minChildY - parentBottomY) / 2;

      // Draw vertical stem from parent to branch level
      allPaths.push(
        <path
          key={`stem-${connectionKey}`}
          d={`M ${parentX} ${parentBottomY} V ${trunkY}`}
          stroke={COLORS.connection}
          strokeWidth="2"
          fill="none"
        />
      );

      // If multiple children, draw the horizontal branch connecting them
      if (childrenWithPositions.length > 1) {
        const leftmost = childrenWithPositions[0].x;
        const rightmost =
          childrenWithPositions[childrenWithPositions.length - 1].x;

        allPaths.push(
          <path
            key={`branch-${connectionKey}`}
            d={`M ${leftmost} ${trunkY} H ${rightmost}`}
            stroke={COLORS.connection}
            strokeWidth="2"
            fill="none"
          />
        );

        // Draw individual drops to each child
        childrenWithPositions.forEach(childInfo => {
          allPaths.push(
            <path
              key={`drop-${connectionKey}-${childInfo.id}`}
              d={`M ${childInfo.x} ${trunkY} V ${childInfo.y + 40}`}
              stroke={COLORS.connection}
              strokeWidth="2"
              fill="none"
              strokeLinecap="square"
            />
          );
        });
      } else if (childrenWithPositions.length === 1) {
        // For a single child, draw an L-shaped connector
        const childInfo = childrenWithPositions[0];
        allPaths.push(
          <path
            key={`drop-single-${connectionKey}-${childInfo.id}`}
            d={`M ${parentX} ${trunkY} H ${childInfo.x} V ${childInfo.y + 40}`}
            stroke={COLORS.connection}
            strokeWidth="2"
            fill="none"
            strokeLinecap="square"
          />
        );
      }

      // Process each child's own connections
      childrenWithPositions.forEach(childInfo => {
        processMember(childInfo.child);
      });
    };

    // Recursive function to process a family member and their relationships
    const processMember = (member: FamilyMember) => {
      // Skip if no position (not rendered)
      if (!getPosition(member.id)) {
        return;
      }

      // 1. Process partner connection if it exists
      let partnerConnectionData = null;
      if (member.partner && getPosition(member.partner.id)) {
        partnerConnectionData = drawPartnerConnection(member, member.partner);
      }

      // 2. Process children connections
      if (member.children && member.children.length > 0) {
        // Filter to only include children that have positions
        const validChildren = member.children.filter(child =>
          getPosition(child.id)
        );

        if (validChildren.length > 0) {
          // Get connection source point
          let parentX: number;
          let parentBottomY: number;

          if (partnerConnectionData) {
            // Use the midpoint of the partnership
            parentX = partnerConnectionData.midpointX;
            parentBottomY = partnerConnectionData.bottomY;
          } else {
            // Use the member's own position
            const pos = getPosition(member.id);
            parentX = pos.x + pos.width / 2;
            parentBottomY = pos.y + pos.height;
          }

          // Draw connections to the children
          drawChildConnections(
            validChildren,
            parentX,
            parentBottomY,
            `children-of-${member.id}`
          );
        }
      }
    };

    // Start by getting all members as a flat array
    const allMembers = getAllMembers(familyData);

    // First pass: process all top-level members and their primary relationships
    processMember(familyData);

    // Set the paths to be rendered
    setConnections(allPaths);
  }, [nodePositions, calculatedPositions, familyData]);

  // This effect adds CSS connectors for the great-grandchild as a backup
  useEffect(() => {
    // Skip if no positions available
    if (Object.keys(nodePositions).length === 0) {
      setGreatGrandchildConnectors([]);
      return;
    }

    // Get positions for parent and child
    const newChildPos = nodePositions['3'];
    const greatGrandchildPos = nodePositions['child-1741850976290'];

    if (!newChildPos || !greatGrandchildPos) {
      setGreatGrandchildConnectors([]);
      return;
    }

    // Calculate positions for the connector elements
    const childCenterX = newChildPos.x + newChildPos.width / 2;
    const childBottomY = newChildPos.y + newChildPos.height;

    const ggChildCenterX = greatGrandchildPos.x + greatGrandchildPos.width / 2;
    const ggChildTopY = greatGrandchildPos.y;

    const midY = childBottomY + (ggChildTopY - childBottomY) / 2;

    // Create three div styles for the three segments
    const segmentStyles: React.CSSProperties[] = [
      // Vertical segment down from child
      {
        position: 'absolute',
        left: `${childCenterX}px`,
        top: `${childBottomY}px`,
        width: '3px',
        height: `${midY - childBottomY}px`,
        backgroundColor: '#2E7D32',
        zIndex: 0,
      },
      // Horizontal segment connecting to great-grandchild column
      {
        position: 'absolute',
        left: `${Math.min(childCenterX, ggChildCenterX)}px`,
        top: `${midY}px`,
        width: `${Math.abs(ggChildCenterX - childCenterX)}px`,
        height: '3px',
        backgroundColor: '#2E7D32',
        zIndex: 0,
      },
      // Vertical segment down to great-grandchild
      {
        position: 'absolute',
        left: `${ggChildCenterX}px`,
        top: `${midY}px`,
        width: '3px',
        height: `${ggChildTopY - midY + 10}px`, // Extend 10px into the node
        backgroundColor: '#2E7D32',
        zIndex: 0,
      },
    ];

    // setGreatGrandchildConnectors(segmentStyles);
  }, [nodePositions, calculatedPositions]);

  return (
    <>
      {/* Original SVG connections */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {connections}
      </svg>

      {/* Backup CSS-based connection for great-grandchild */}
      {greatGrandchildConnectors.map((style, index) => (
        <div
          key={`connector-segment-${index}`}
          style={style}
          className="grandchild-connector"
        />
      ))}
    </>
  );
};

export default TreeConnectors;
