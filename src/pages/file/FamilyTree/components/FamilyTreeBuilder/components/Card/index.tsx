/* eslint-disable complexity */
// src/pages/file/FamilyTree/components/FamilyTreeBuilder/components/Card/index.tsx
import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useNodeAnimation } from '../../hooks/useNodeAnimation';
import { CardProps } from './types';
import RelationshipBadge from './components/RelationshipBadge';
import CardHeader from './components/CardHeader';
import LeftContainer from './components/LeftContainer';
import RightContainer from './components/RightContainer';
import CardFooter from './components/CardFooter';

const Card: React.FC<CardProps> = ({
  node,
  showMiniTree = false,
  transitionTime = 1000,
  treeData,
  initialRender = false,
  onMouseEnter,
  onMouseLeave,
  onPersonAdd,
  onPersonDelete,
}) => {
  const cardRef = useRef<SVGGElement>(null);
  const [isRendered, setIsRendered] = useState(true);

  // Check if this is a phantom parent node
  const isPhantom = !!node.data.isPhantom;

  // Animation hook - pass initialRender flag
  useNodeAnimation(cardRef, node, transitionTime, treeData, initialRender);

  // Log node state for debugging
  useEffect(() => {
    if (node && !node.exiting) {
      console.log(`Card component for node: ${node.data.id}`, {
        x: node.x,
        y: node.y,
        _x: node._x,
        _y: node._y,
        exiting: node.exiting,
        isPhantom: isPhantom,
        initialRender,
        relationships: {
          father: node.data.rels.father,
          mother: node.data.rels.mother,
          children: node.data.rels.children?.length || 0,
          spouses: node.data.rels.spouses?.length || 0,
        },
      });
    }
  }, [node, initialRender, isPhantom]);

  // Safety check - if a node has disappeared from view, try to force-show it
  useEffect(() => {
    if (cardRef.current && node && !node.exiting) {
      // Check after animation should be complete
      const timer = setTimeout(() => {
        if (cardRef.current) {
          const opacity = window.getComputedStyle(cardRef.current).opacity;
          if (opacity === '0' || parseFloat(opacity) < 0.1) {
            console.log(`Force showing node ${node.data.id} - was invisible`);
            cardRef.current.style.opacity = isPhantom ? '0.5' : '1';
            cardRef.current.style.transform = `translate(${node.x}px, ${node.y}px)`;
          }
        }
      }, transitionTime + 200);

      return () => clearTimeout(timer);
    }
  }, [node, transitionTime, isPhantom]);

  // Only allow interactions with non-phantom nodes
  const handleMouseEnter = useCallback(() => {
    if (!node.data.main && !isPhantom && onMouseEnter) {
      onMouseEnter(node);
    }
  }, [node, onMouseEnter, isPhantom]);

  const handleMouseLeave = useCallback(() => {
    if (!node.data.main && !isPhantom && onMouseLeave) {
      onMouseLeave(node);
    }
  }, [node, onMouseLeave, isPhantom]);

  const data = node.data.data || {};
  const formatedData = {
    fileId: data?.fileId || null,
    contactId: data?.contactId || null,
    isDeceased: !!data?.deceased,
    hasNotes: !!data?.has_new_notes,
    displayName:
      data?.name ||
      `${data?.firstName || ''} ${data?.lastName || ''}`.trim() ||
      'Unknown',
    age: data?.age || '-',
    birthDate: data?.dOB || '-',
    deathDate: data?.decDt || '-',
    fullAddress: data?.full_address || data?.address || '-',
    relationshipType: data?.relationship || 'Unknown',
    divisionOfInterest: data?.division_of_interest || '0.000 %',
    percentage: data?.ownership || '0.000 %',
    isMale: data?.gender === 'M',
    offer: data?.offer || {},
  };

  // Calculate card width and height
  const cardWidth = 300;
  const cardHeight = 160;
  const leftColumnWidth = cardWidth / 2;

  // Ensure node has valid position - default to origin if invalid
  const posX = typeof node.x === 'number' && !isNaN(node.x) ? node.x : 0;
  const posY = typeof node.y === 'number' && !isNaN(node.y) ? node.y : 0;

  // Don't render if marked as not rendered (for debugging)
  if (!isRendered) {
    return null;
  }

  // Define phantom class and special styles for phantom nodes
  const phantomClass = isPhantom ? 'phantom-card' : '';

  return (
    <g
      ref={cardRef}
      className={`card_cont ${node.data.main ? 'main-node' : ''} ${phantomClass}`}
      transform={`translate(${posX}, ${posY})`}
      style={{ opacity: 0 }} // Initial opacity is 0, animation will change it
      data-id={node.data.id}
      data-phantom={isPhantom ? 'true' : 'false'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Only show relationship badge for non-phantom nodes */}
      {!isPhantom && (
        <RelationshipBadge
          relationshipType={formatedData.relationshipType}
          isDeceased={formatedData.isDeceased}
        />
      )}

      {/* Main Card */}
      <g
        className={`card-inner ${phantomClass}`}
        transform={`translate(${-cardWidth / 2}, ${-cardHeight / 2})`}
      >
        {/* Card Background with Rounded Corners - Special styling for phantom nodes */}
        <rect
          width={cardWidth}
          height={cardHeight}
          rx={20}
          ry={20}
          fill={isPhantom ? '#F5F5F5' : '#D9D9D9'}
          stroke={
            isPhantom ? '#CCCCCC' : formatedData.isDeceased ? '#FF0000' : 'none'
          }
          strokeWidth={isPhantom ? 1 : formatedData.isDeceased ? 2 : 0}
          strokeDasharray={isPhantom ? '5,5' : 'none'}
        />

        {/* Only show interactive elements for real (non-phantom) nodes */}
        {!isPhantom ? (
          <>
            <CardHeader
              data={{
                displayName: formatedData.displayName,
                personId: node.data.id,
              }}
              onPersonAdd={e => onPersonAdd && onPersonAdd(node, e)}
              onPersonDelete={onPersonDelete}
              cardWidth={cardWidth}
            />

            <LeftContainer
              data={{
                isMale: formatedData.isMale,
                age: formatedData.age,
                birth: formatedData.birthDate,
                death: formatedData.deathDate,
                address: formatedData.fullAddress,
                leftColumnWidth,
              }}
            />

            <RightContainer
              data={{
                fileId: formatedData.fileId,
                contactId: formatedData.contactId,
                isMale: formatedData.isMale,
                divisionOfInterest: formatedData.divisionOfInterest,
                percentage: formatedData.percentage,
                leftColumnWidth,
                offerIconHovered: false,
                setOfferIconHovered: () => {},
                offer: formatedData.offer,
              }}
            />

            <CardFooter />
          </>
        ) : (
          // For phantom nodes, show a simplified placeholder
          <text
            x={cardWidth / 2}
            y={cardHeight / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#999"
            fontSize="14"
            fontStyle="italic"
          >
            {formatedData.isMale ? 'Unknown Father' : 'Unknown Mother'}
          </text>
        )}
      </g>
    </g>
  );
};

export default React.memo(Card);
