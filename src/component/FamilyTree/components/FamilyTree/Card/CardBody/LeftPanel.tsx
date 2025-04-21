// src/component/FamilyTree/components/FamilyTree/Card/CardBody/LeftPanel.tsx
import React from 'react';

interface LeftPanelProps {
  node: any;
  width: number;
  height: number;
  colors: { primary: string; secondary: string };
  showCountyOfDeath: boolean;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  node,
  width,
  height,
  colors,
  showCountyOfDeath,
}) => {
  return (
    <g className="card-left-panel">
      <rect
        y={34}
        width={width / 2}
        height={height - 34 - 18}
        fill={colors.secondary}
      />
      <g className="card-details">
        <text x={12} y={50} fontSize="12" fontWeight="700" fill="#000">
          Age: {node.data.data.age || 'Unknown'}
        </text>
        <text x={12} y={65} fontSize="12" fontWeight="700" fill="#000">
          Birth: {node.data.data.dOB || 'Unknown'}
        </text>
        <text x={12} y={80} fontSize="12" fontWeight="700" fill="#000">
          Death: {node.data.data.decDt || 'Unknown'}
        </text>
        {!showCountyOfDeath && node.data.data.address && (
          <text x={12} y={95} fontSize="10" fontWeight="700" fill="#000">
            Address:
            <tspan x={12} dy="12">
              {node.data.data.address}
            </tspan>
          </text>
        )}
        {showCountyOfDeath && (
          <text x={12} y={95} fontSize="12" fontWeight="700" fill="#000">
            County of Death:
            <tspan x={12} dy="12" fontSize="10">
              {node.data.data.countyOfDeath}
            </tspan>
          </text>
        )}
      </g>
    </g>
  );
};

export default React.memo(LeftPanel);
