// src/components/FamilyTree/SvgDefs.tsx
import React from 'react';
import { CardDimensions } from '../../types/familyTree';

interface SvgDefsProps {
  cardDimensions: CardDimensions;
}

const SvgDefs: React.FC<SvgDefsProps> = ({ cardDimensions }) => {
  // Curved rectangle path function
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
      {/* Fade gradient for text overflow */}
      <linearGradient id="fadeGrad">
        <stop offset="0.9" stopColor="white" stopOpacity="0" />
        <stop offset=".91" stopColor="white" stopOpacity=".5" />
        <stop offset="1" stopColor="white" stopOpacity="1" />
      </linearGradient>

      {/* Mask using the gradient */}
      <mask id="fade" maskContentUnits="objectBoundingBox">
        <rect width="1" height="1" fill="url(#fadeGrad)" />
      </mask>

      {/* Clip paths for various card elements */}
      <clipPath id="card_clip">
        <path
          d={curvedRectPath({ w: cardDimensions.w, h: cardDimensions.h }, 5)}
        />
      </clipPath>

      <clipPath id="card_text_clip">
        <rect width={cardDimensions.w - 10} height={cardDimensions.h} />
      </clipPath>

      <clipPath id="card_image_clip">
        <path
          d={`M0,0 Q 0,0 0,0 H${cardDimensions.img_w} V${cardDimensions.img_h} H0 Q 0,${cardDimensions.img_h} 0,${cardDimensions.img_h} z`}
        />
      </clipPath>

      <clipPath id="card_image_clip_curved">
        <path
          d={curvedRectPath(
            { w: cardDimensions.img_w, h: cardDimensions.img_h },
            5,
            ['rx', 'ry']
          )}
        />
      </clipPath>
    </defs>
  );
};

export default SvgDefs;
