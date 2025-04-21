// src/component/FamilyTree/components/FamilyTree/Card/CardBody/index.tsx
import React from 'react';
import { CardBodyProps } from '../types';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';

const CardBody: React.FC<CardBodyProps> = ({
  node,
  cardDimensions,
  colors,
  isDeceased,
  showCountyOfDeath,
  hasNotes,
  contactId,
  fileId,
  offerAmount,
  showOfferPopup,
  setShowOfferPopup,
}) => {
  return (
    <g className="card-body">
      <LeftPanel
        node={node}
        width={cardDimensions.w}
        height={cardDimensions.h}
        colors={colors}
        showCountyOfDeath={showCountyOfDeath}
      />
      <RightPanel
        node={node}
        width={cardDimensions.w}
        height={cardDimensions.h}
        hasNotes={hasNotes}
        contactId={contactId}
        fileId={fileId}
        offerAmount={offerAmount}
        showOfferPopup={showOfferPopup}
        setShowOfferPopup={setShowOfferPopup}
      />
    </g>
  );
};

export default React.memo(CardBody);
