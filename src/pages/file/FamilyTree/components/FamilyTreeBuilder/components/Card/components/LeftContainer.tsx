import React from 'react';
import { LeftContainerProps } from '../types';

const LeftContainer: React.FC<LeftContainerProps> = data => {
  const { isMale, age, birth, death, address, leftColumnWidth } = data.data;
  return (
    <g className="left-column">
      <rect
        x={0}
        y={30}
        width={leftColumnWidth}
        height={110}
        fill={isMale ? '#7EADFF' : '#FF96BC'}
      />
      <g className="card-details" fill="black" transform="translate(7, 7)">
        <text y={40} fontSize={12} fontWeight="bold">
          Age: {age}
        </text>
        <text y={57} fontSize={12} fontWeight="bold">
          Birth: {birth}
        </text>
        <text y={74} fontSize={12} fontWeight="bold">
          Death: {death}
        </text>
        <text y={91} fontSize={12} fontWeight="bold">
          Address:
        </text>
        <text y={105} fontSize={10} fontWeight="bold">
          {address}
        </text>
      </g>
    </g>
  );
};

export default LeftContainer;
