// src/components/FamilyTree/SvgDefs.tsx
import React from 'react';
import { CardDimensions } from '../types/familyTree';

interface SvgDefsProps {
  cardDimensions: CardDimensions;
}

const SvgDefs: React.FC<SvgDefsProps> = ({ cardDimensions }) => {
  const curvedRectPath = (
    dim: { w: number; h: number },
    curve: number,
    noCorners: string[] = []
  ) => {
    const { w, h } = dim;
    const c = curve;
    const hasCorner = (corner: string) => !noCorners.includes(corner);

    const lx = hasCorner('lx') ? `M0,${c} Q 0,0 ${c},0` : 'M0,0';
    const rx = hasCorner('rx') ? `H${w - c} Q ${w},0 ${w},${c}` : `H${w}`;
    const ry = hasCorner('ry')
      ? `V${h - c} Q ${w},${h} ${w - c},${h}`
      : `V${h}`;
    const ly = hasCorner('ly') ? `H${c} Q 0,${h} 0,${h - c}` : `H0`;

    return `${lx} ${rx} ${ry} ${ly} z`;
  };

  return (
    <defs id="f3CardDef">
      <linearGradient id="fadeGrad">
        <stop offset="0.9" stopColor="white" stopOpacity="0" />
        <stop offset=".91" stopColor="white" stopOpacity=".5" />
        <stop offset="1" stopColor="white" stopOpacity="1" />
      </linearGradient>

      <mask id="fade" maskContentUnits="objectBoundingBox">
        <rect width="1" height="1" fill="url(#fadeGrad)" />
      </mask>

      <clipPath id="card_clip">
        <path
          d={curvedRectPath({ w: cardDimensions.w, h: cardDimensions.h }, 20)}
        />
      </clipPath>

      <clipPath id="card_text_clip">
        <rect width={cardDimensions.w - 10} height={cardDimensions.h} />
      </clipPath>

      <clipPath id="relationship_batch_clip">
        <rect
          width={cardDimensions.relationship_batch_w}
          height={cardDimensions.relationship_batch_h}
          rx="10"
          ry="10"
        />
      </clipPath>

      <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
        <feOffset dx="0" dy="2" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.2" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
};

export default SvgDefs;
