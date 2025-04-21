// src/component/FamilyTree/components/FamilyTree/Card/BottomBar.tsx
import React from 'react';
import { BottomBarProps } from './types';
import { ArrowIcon } from './icons';

const BottomBar: React.FC<BottomBarProps> = ({
  cardDimensions,
  arrowRotated,
  notesPanelClosing,
  toggleNotesPanel,
}) => {
  return (
    <g
      className="bottom-bar"
      transform={`translate(0, ${cardDimensions.h - 18})`}
    >
      <rect
        width={cardDimensions.w}
        height={18}
        fill="var(--bottom-bar-color)"
        rx={0}
        ry={0}
        className="bottom-bar-rect"
      />
      <g
        transform={`translate(${cardDimensions.w / 2}, 9)`}
        onClick={toggleNotesPanel}
        style={{ cursor: 'pointer' }}
      >
        <g
          transform={arrowRotated ? 'rotate(180)' : ''}
          className={notesPanelClosing ? 'rotating' : ''}
        >
          <ArrowIcon width={15} height={20} />
        </g>
      </g>
    </g>
  );
};

export default React.memo(BottomBar);
