// src/component/FamilyTree/components/FamilyTree/Card/CardBody/RightPanel.tsx
import React from 'react';
import { NotesIcon, DocumentIcon, DocDollarIcon, ArrowIcon } from '../icons';

interface RightPanelProps {
  node: any;
  width: number;
  height: number;
  hasNotes: boolean;
  contactId?: number;
  fileId?: number;
  offerAmount: string;
  showOfferPopup: boolean;
  setShowOfferPopup: (show: boolean) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  node,
  width,
  height,
  hasNotes,
  contactId,
  fileId,
  offerAmount,
  showOfferPopup,
  setShowOfferPopup,
}) => {
  return (
    <g className="card-right-panel">
      <rect
        x={width / 2}
        y={34}
        width={width / 2}
        height={height - 34 - 18}
        fill="#FFFFFF"
      />
      <g className="division-of-interest">
        <rect
          x={width / 2 + 10}
          y={50}
          width={123}
          height={19}
          rx={8}
          ry={8}
          stroke="#000"
          strokeWidth="1"
          fill="#fff"
        />
        <text
          x={width / 2 + 71.5}
          y={62}
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill="#000"
        >
          {node.data.data.divisionOfInterest || 'N/A'}
        </text>
        {hasNotes && (
          <g transform={`translate(${width / 2 - 10}, 80)`}>
            <circle r="10" fill="#FF0000" />
            <text
              x="0"
              y="3"
              fontSize="12"
              fontWeight="bold"
              fill="#FFFFFF"
              textAnchor="middle"
            >
              !
            </text>
          </g>
        )}
        <rect
          x={width / 2 + 10}
          y={80}
          width={123}
          height={19}
          rx={8}
          ry={8}
          stroke="#000"
          strokeWidth="1"
          fill="#fff"
        />
        <text
          x={width / 2 + 20}
          y={92}
          fontSize="12"
          fontWeight="700"
          fill="#000"
        >
          {node.data.data.percentage || '0.000 %'}
        </text>
        <g transform={`translate(${width - 25}, 85)`}>
          <ArrowIcon width={10} height={15} />
        </g>
        <g
          className="card-icons"
          transform={`translate(${width / 2 + 10}, 110)`}
        >
          <g
            transform="translate(0, 0)"
            style={{ cursor: contactId ? 'pointer' : 'default' }}
            onClick={() => contactId && console.log('Navigate to notes')}
            className={`card-icon notes-icon ${hasNotes ? 'has-notes' : ''}`}
          >
            <rect width={20} height={20} fill="transparent" />
            <NotesIcon
              width={20}
              height={20}
              style={{ fill: hasNotes ? '#FF0000' : '#000000' }}
            />
          </g>
          <g
            transform="translate(30, 0)"
            style={{ cursor: fileId ? 'pointer' : 'default' }}
            onClick={() => fileId && console.log('Navigate to documents')}
            className="card-icon document-icon"
          >
            <rect width={20} height={20} fill="transparent" />
            <DocumentIcon width={20} height={20} />
          </g>
          <g
            transform="translate(60, 0)"
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setShowOfferPopup(true)}
            onMouseLeave={() => setShowOfferPopup(false)}
            className="card-icon doc-dollar-icon"
          >
            <rect width={20} height={20} fill="transparent" />
            <DocDollarIcon width={20} height={20} />
            {showOfferPopup && contactId && (
              <g className="offer-popup" transform="translate(-45, -90)">
                <rect
                  width={200}
                  height={80}
                  rx={12}
                  ry={12}
                  fill="#FFFFFF"
                  stroke="#CCCCCC"
                  strokeWidth="1"
                  filter="url(#dropShadow)"
                />
                <text
                  x={100}
                  y={20}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill="#000000"
                >
                  Offer Amount
                </text>
                <text
                  x={100}
                  y={45}
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="bold"
                  fill="#000000"
                >
                  {offerAmount}
                </text>
                <text
                  x={100}
                  y={65}
                  textAnchor="middle"
                  fontSize="14"
                  fill="#1976d2"
                  textDecoration="underline"
                  style={{ cursor: 'pointer' }}
                  onClick={() => console.log('Navigate to offer letter')}
                >
                  Link to offer letter
                </text>
                <path
                  d="M 0 0 L 8 8 L 16 0"
                  transform="translate(92, -1) rotate(180)"
                  fill="#FFFFFF"
                  stroke="#CCCCCC"
                  strokeWidth="1"
                />
              </g>
            )}
          </g>
        </g>
      </g>
    </g>
  );
};

export default React.memo(RightPanel);
