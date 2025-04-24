// Update the Card component to ensure visibility and proper animation
import React, { useRef, useCallback, useEffect } from 'react';
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

  // Animation hook - pass initialRender flag
  useNodeAnimation(cardRef, node, transitionTime, treeData, initialRender);

  // Log node state for debugging
  useEffect(() => {
    if (node && !node.exiting) {
      console.log(`Rendering node: ${node.data.id}`, {
        x: node.x,
        y: node.y,
        _x: node._x,
        _y: node._y,
        exiting: node.exiting,
        initialRender,
      });
    }
  }, [node, initialRender]);

  const handleMouseEnter = useCallback(() => {
    if (!node.data.main && onMouseEnter) {
      onMouseEnter(node);
    }
  }, [node, onMouseEnter]);

  const handleMouseLeave = useCallback(() => {
    if (!node.data.main && onMouseLeave) {
      onMouseLeave(node);
    }
  }, [node, onMouseLeave]);

  const data = node.data.data || {};
  const formatedData = {
    fileId: data?.fileId || null,
    contactId: data?.contactId || null,
    isDeceased: !!data?.deceased,
    hasNotes: !!data?.has_new_notes,
    displayName: data?.name || '',
    age: data?.age || '-',
    birthDate: data?.dOB || '-',
    deathDate: data?.decDt || '-',
    fullAddress: data?.full_address || '-',
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

  // Ensure node has valid position
  const posX = typeof node.x === 'number' ? node.x : 0;
  const posY = typeof node.y === 'number' ? node.y : 0;

  console.log('Rendering Card');

  return (
    <g
      ref={cardRef}
      className={`card_cont ${node.data.main ? 'main-node' : ''}`}
      transform={`translate(${posX}, ${posY})`}
      style={{ opacity: 0 }} // Initial opacity is 0, animation will change it
      data-id={node.data.id}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Relationship Badge Component */}
      <RelationshipBadge
        relationshipType={formatedData.relationshipType}
        isDeceased={formatedData.isDeceased}
      />

      {/* Main Card */}
      <g
        className="card-inner"
        transform={`translate(${-cardWidth / 2}, ${-cardHeight / 2})`}
      >
        {/* Card Background with Rounded Corners */}
        <rect
          width={cardWidth}
          height={cardHeight}
          rx={20}
          ry={20}
          fill="#D9D9D9"
          stroke={formatedData.isDeceased ? '#FF0000' : 'none'}
          strokeWidth={formatedData.isDeceased ? 2 : 0}
        />

        {/* Card Header Component */}
        <CardHeader
          data={{
            displayName: formatedData.displayName,
            personId: node.data.id,
          }}
          onPersonAdd={e => onPersonAdd && onPersonAdd(node, e)}
          onPersonDelete={onPersonDelete}
          cardWidth={cardWidth}
        />

        {/* Left Container Component */}
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

        {/* Right Container Component */}
        <RightContainer
          data={{
            fileId: formatedData.fileId,
            contactId: formatedData.contactId,
            isMale: formatedData.isMale,
            divisionOfInterest: formatedData.divisionOfInterest,
            percentage: formatedData.percentage,
            leftColumnWidth,
            offer: formatedData.offer,
          }}
        />

        {/* Footer Component */}
        <CardFooter />
      </g>
    </g>
  );
};

export default React.memo(Card);
