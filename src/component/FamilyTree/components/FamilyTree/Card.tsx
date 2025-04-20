/* eslint-disable complexity */
// src/components/FamilyTree/Card.tsx
import React, { useRef, useCallback, memo, useState } from 'react';
import { TreeNode, CardDimensions, TreeData } from '../../types/familyTree';
import { useNodeAnimation } from '../../hooks/useNodeAnimation';

interface CardProps {
  node: TreeNode;
  cardDimensions: CardDimensions;
  showMiniTree: boolean;
  transitionTime: number;
  treeData: TreeData | null;
  onClick?: (node: TreeNode) => void;
  onEdit?: (node: TreeNode) => void;
  onMouseEnter?: (node: TreeNode) => void;
  onMouseLeave?: (node: TreeNode) => void;
}

// Constants for different relationship types
const RELATIONSHIP_OPTIONS = [
  'Primary Root',
  'Partner',
  'Child',
  'Stepchild',
  'Sibling',
  'Parent',
  'Unknown',
  'Other',
];

const Card: React.FC<CardProps> = ({
  node,
  cardDimensions,
  showMiniTree,
  transitionTime,
  treeData,
  onClick,
  onEdit,
  onMouseEnter,
  onMouseLeave,
}) => {
  const cardRef = useRef<SVGGElement>(null);

  // Interactive states
  const [showRelationDropdown, setShowRelationDropdown] = useState(false);
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [headerHovered, setHeaderHovered] = useState(false);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [notesPanelAnimating, setNotesPanelAnimating] = useState(false);

  // Use animation hook - this handles all animation logic
  useNodeAnimation(cardRef, node, transitionTime, treeData);

  // Event handlers
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(node);
    }
  }, [onClick, node]);

  const handleEditClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onEdit) {
        onEdit(node);
      }
    },
    [onEdit, node]
  );

  const handleAddClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      console.log('Add clicked for node:', node.data.id);
      // Add logic here or pass to parent via props
    },
    [node]
  );

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      console.log('Delete clicked for node:', node.data.id);
      // Delete logic here or pass to parent via props
    },
    [node]
  );

  const handleRelationshipSelect = useCallback(
    (relationship: string) => {
      console.log(
        'Selected relationship:',
        relationship,
        'for node:',
        node.data.id
      );
      setShowRelationDropdown(false);
      // Update relationship logic here
    },
    [node]
  );

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

  const toggleNotesPanel = useCallback(() => {
    setNotesPanelAnimating(true);
    if (showNotesPanel) {
      // Hide notes panel after animation
      setTimeout(() => {
        setShowNotesPanel(false);
        setNotesPanelAnimating(false);
      }, 300);
    } else {
      setShowNotesPanel(true);
      setTimeout(() => {
        setNotesPanelAnimating(false);
      }, 300);
    }
  }, [showNotesPanel]);

  // Get gender-specific colors
  const getGenderColors = () => {
    if (node.data.data.gender === 'M') {
      return {
        primary: 'var(--male-primary-color)',
        secondary: 'var(--male-secondary-color)',
      };
    }
    return {
      primary: 'var(--female-primary-color)',
      secondary: 'var(--female-secondary-color)',
    };
  };

  const colors = getGenderColors();

  // Check if person is deceased
  const isDeceased = !!node.data.data.deceased;

  // Check if person has notes
  const hasNotes = !!node.data.data.is_new_notes;

  return (
    <g
      ref={cardRef}
      className={`card_cont ${node.data.main ? 'card-main' : ''} ${isDeceased ? 'card-deceased' : ''}`}
      transform={`translate(${node.x}, ${node.y})`} // Initial position before animation
      style={{ opacity: 0 }} // Initial opacity
      data-id={node.data.id}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Relationship badge - positioned above card */}
      <g
        className="relationship-batch-container"
        transform={`translate(${-cardDimensions.w / 2 + 15}, ${-cardDimensions.h / 2 - 20})`}
        onMouseEnter={() => setShowRelationDropdown(true)}
        onMouseLeave={() => setShowRelationDropdown(false)}
      >
        <rect
          width={cardDimensions.relationship_batch_w}
          height={cardDimensions.relationship_batch_h}
          rx="7"
          ry="7"
          fill="#E2E2E2"
          className="relationship-batch"
          stroke={isDeceased ? 'var(--deceased-border-color)' : 'none'}
          strokeWidth={isDeceased ? 2 : 0}
        />
        <text
          x={10}
          y={15}
          fill="#000"
          fontSize="12"
          fontWeight="500"
          className="relationship-batch-text"
        >
          Relationship to file
        </text>

        {/* Dropdown menu for relationship type */}
        {showRelationDropdown && (
          <g className="relationship-dropdown">
            <rect
              y={cardDimensions.relationship_batch_h}
              width={160}
              height={RELATIONSHIP_OPTIONS.length * 25}
              fill="white"
              stroke="#ccc"
              strokeWidth={1}
              rx="4"
              ry="4"
              filter="url(#dropShadow)"
            />

            {/* Dropdown options */}
            {RELATIONSHIP_OPTIONS.map((option, index) => (
              <g
                key={option}
                transform={`translate(0, ${cardDimensions.relationship_batch_h + index * 25})`}
                onClick={() => handleRelationshipSelect(option)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  width={160}
                  height={25}
                  fill="transparent"
                  className="relationship-option"
                />
                <text
                  x={10}
                  y={17}
                  fill="#000"
                  fontSize="12"
                  fontFamily="Roboto, sans-serif"
                >
                  {option}
                </text>
              </g>
            ))}
          </g>
        )}

        {/* Down arrow indicator - only shown on hover */}
        {showRelationDropdown && (
          <path
            d="M 6 2 L 10 8 L 2 8 Z"
            transform={`translate(${cardDimensions.relationship_batch_w - 15}, ${5}) rotate(180)`}
            fill="#333"
          />
        )}
      </g>

      {/* Main card */}
      <g
        className={`card ${node.data.data.gender === 'M' ? 'card-male' : 'card-female'}`}
        transform={`translate(${-cardDimensions.w / 2}, ${-cardDimensions.h / 2})`}
      >
        <g className="card-inner" clipPath="url(#card_clip)">
          {/* Card outline with conditional deceased styling */}
          <rect
            width={cardDimensions.w}
            height={cardDimensions.h}
            rx="20"
            ry="20"
            className={`card-outline ${node.data.main ? 'card-main-outline' : ''}`}
            stroke={
              isDeceased
                ? 'var(--deceased-border-color)'
                : 'rgba(255, 255, 255, 0.2)'
            }
            strokeWidth={isDeceased ? 3 : 1}
            fill="none"
          />

          {/* Card header with name and arrow */}
          <g
            className="card-header"
            onClick={handleClick}
            onMouseEnter={() => setHeaderHovered(true)}
            onMouseLeave={() => setHeaderHovered(false)}
          >
            <rect
              width={cardDimensions.w}
              height={34}
              fill="#FFFFFF"
              rx="20"
              ry="20"
            />
            <rect y={17} width={cardDimensions.w} height={17} fill="#FFFFFF" />

            {/* File Name / Person Name */}
            <text
              x={20}
              y={22}
              fontSize="16"
              fontWeight="800"
              fill="#000"
              className="file-name"
            >
              {node.data.data.firstName} {node.data.data.lastName}
            </text>

            {/* Actions that appear on hover */}
            {headerHovered && (
              <g
                className="header-actions"
                transform={`translate(${cardDimensions.w - 40}, 17)`}
              >
                <g
                  transform="translate(-40, 0)"
                  onClick={handleAddClick}
                  style={{ cursor: 'pointer' }}
                >
                  <circle r="10" fill="#f5f5f5" />
                  <path
                    d="M -4 0 H 4 M 0 -4 V 4"
                    stroke="#000"
                    strokeWidth="2"
                  />
                </g>

                <g
                  transform="translate(-15, 0)"
                  onClick={handleDeleteClick}
                  style={{ cursor: 'pointer' }}
                >
                  <circle r="10" fill="#f5f5f5" />
                  <path
                    d="M -3 -3 L 3 3 M -3 3 L 3 -3"
                    stroke="#f44336"
                    strokeWidth="2"
                  />
                </g>
              </g>
            )}

            {/* Right arrow icon */}
            <g transform={`translate(${cardDimensions.w - 20}, 17)`}>
              <path
                d="M -4 -8 L 4 0 L -4 8"
                stroke="#000"
                strokeWidth="2"
                fill="none"
              />
            </g>
          </g>

          {/* Body area with left and right panels */}
          <g className="card-body">
            {/* Left panel with details - blue background */}
            <rect
              y={34}
              width={cardDimensions.w / 2}
              height={cardDimensions.h - 34 - 18} // Subtract header and bottom bar
              fill={colors.secondary}
            />

            {/* Right panel with white background */}
            <rect
              x={cardDimensions.w / 2}
              y={34}
              width={cardDimensions.w / 2}
              height={cardDimensions.h - 34 - 18}
              fill="#FFFFFF"
            />

            {/* Left panel content - details */}
            <g className="card-details">
              <text x={20} y={50} fontSize="12" fontWeight="700" fill="#000">
                <tspan>Age: {node.data.data.age || '00'}</tspan>
              </text>

              <text x={20} y={70} fontSize="12" fontWeight="700" fill="#000">
                <tspan>Birth: {node.data.data.dOB || '00/00/00'}</tspan>
              </text>

              <text x={20} y={90} fontSize="12" fontWeight="700" fill="#000">
                <tspan>Death: {node.data.data.decDt || '00/00/00'}</tspan>
              </text>

              <text x={20} y={110} fontSize="10" fontWeight="700" fill="#000">
                <tspan>Address:</tspan>
              </text>

              <text x={20} y={125} fontSize="10" fontWeight="700" fill="#000">
                <tspan>
                  {node.data.data.address || 'Lorem ipsum dolor sit'}
                </tspan>
              </text>
              <text x={20} y={137} fontSize="10" fontWeight="700" fill="#000">
                <tspan>amet consectetur.</tspan>
              </text>
            </g>

            {/* Right panel content - Division of Interest */}
            <g className="division-of-interest">
              {/* Division of Interest field */}
              <rect
                x={cardDimensions.w / 2 + 10}
                y={50}
                width={123}
                height={19}
                rx="8"
                ry="8"
                stroke="#000"
                strokeWidth="1"
                fill="#e6e6ff"
              />
              <text
                x={cardDimensions.w / 2 + 71}
                y={64}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                fill="#000"
              >
                Division of Interest
              </text>

              {/* Warning icon for notes with red color - only if hasNotes */}
              {hasNotes && (
                <g transform={`translate(${cardDimensions.w / 2}, 80)`}>
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

              {/* Percentage field */}
              <rect
                x={cardDimensions.w / 2 + 10}
                y={80}
                width={123}
                height={19}
                rx="8"
                ry="8"
                stroke="#000"
                strokeWidth="1"
                fill="#e6e6ff"
              />
              <text
                x={cardDimensions.w / 2 + 40}
                y={94}
                fontSize="12"
                fontWeight="700"
                fill="#000"
              >
                0.000 %
              </text>
              <path
                d="M 0 0 L 5 5 L 0 10"
                transform={`translate(${cardDimensions.w - 25}, 85)`}
                stroke="#000"
                strokeWidth="1.5"
                fill="none"
              />

              {/* Icons row */}
              <g
                className="card-icons"
                transform={`translate(${cardDimensions.w / 2 + 20}, 115)`}
              >
                {/* Notes Icon */}
                <g
                  className="card-icon"
                  transform="translate(0, 0)"
                  style={{ cursor: 'pointer' }}
                  onClick={() => console.log('Notes clicked')}
                >
                  <g transform="scale(0.7)">
                    <path
                      d="M9.95837 11.5001C9.95837 11.1354 10.1032 10.7856 10.3611 10.5278C10.619 10.2699 10.9687 10.1251 11.3334 10.1251H22.3334C22.698 10.1251 23.0478 10.2699 23.3056 10.5278C23.5635 10.7856 23.7084 11.1354 23.7084 11.5001C23.7084 11.8647 23.5635 12.2145 23.3056 12.4723C23.0478 12.7302 22.698 12.8751 22.3334 12.8751H11.3334C10.9687 12.8751 10.619 12.7302 10.3611 12.4723C10.1032 12.2145 9.95837 11.8647 9.95837 11.5001ZM11.3334 18.3751H22.3334C22.698 18.3751 23.0478 18.2302 23.3056 17.9723C23.5635 17.7145 23.7084 17.3647 23.7084 17.0001C23.7084 16.6354 23.5635 16.2856 23.3056 16.0278C23.0478 15.7699 22.698 15.6251 22.3334 15.6251H11.3334C10.9687 15.6251 10.619 15.7699 10.3611 16.0278C10.1032 16.2856 9.95837 16.6354 9.95837 17.0001C9.95837 17.3647 10.1032 17.7145 10.3611 17.9723C10.619 18.2302 10.9687 18.3751 11.3334 18.3751ZM16.8334 21.1251H11.3334C10.9687 21.1251 10.619 21.2699 10.3611 21.5278C10.1032 21.7856 9.95837 22.1354 9.95837 22.5001C9.95837 22.8647 10.1032 23.2145 10.3611 23.4723C10.619 23.7302 10.9687 23.8751 11.3334 23.8751H16.8334C17.198 23.8751 17.5478 23.7302 17.8056 23.4723C18.0635 23.2145 18.2084 22.8647 18.2084 22.5001C18.2084 22.1354 18.0635 21.7856 17.8056 21.5278C17.5478 21.2699 17.198 21.1251 16.8334 21.1251ZM33.3334 3.25006V21.9311C33.3345 22.2924 33.2638 22.6503 33.1255 22.984C32.9871 23.3177 32.7837 23.6206 32.5273 23.8751L23.7084 32.694C23.4539 32.9504 23.151 33.1538 22.8173 33.2921C22.4836 33.4305 22.1257 33.5012 21.7645 33.5H3.08337C2.35403 33.5 1.65455 33.2103 1.13883 32.6946C0.623105 32.1789 0.333374 31.4794 0.333374 30.75V3.25006C0.333374 2.52071 0.623105 1.82124 1.13883 1.30552C1.65455 0.789792 2.35403 0.500061 3.08337 0.500061H30.5834C31.3127 0.500061 32.0122 0.789792 32.5279 1.30552C33.0436 1.82124 33.3334 2.52071 33.3334 3.25006ZM3.08337 30.75H20.9584V22.5001C20.9584 22.1354 21.1032 21.7856 21.3611 21.5278C21.619 21.2699 21.9687 21.1251 22.3334 21.1251H30.5834V3.25006H3.08337V30.75ZM23.7084 23.8751V28.8079L28.6395 23.8751H23.7084Z"
                      fill={hasNotes ? '#FF0000' : '#000000'}
                    />
                  </g>
                </g>

                {/* Document Icon */}
                <g
                  className="card-icon"
                  transform="translate(30, 0)"
                  style={{ cursor: 'pointer' }}
                  onClick={() => console.log('Document clicked')}
                >
                  <g transform="scale(0.7)">
                    <path
                      d="M4.28574 21.25H1.42858C1.0497 21.25 0.686331 21.3993 0.418421 21.6649C0.15051 21.9306 0 22.2909 0 22.6667V32.5833C0 32.9591 0.15051 33.3194 0.418421 33.5851C0.686331 33.8507 1.0497 34 1.42858 34H4.28574C5.99071 34 7.62585 33.3284 8.83144 32.1328C10.037 30.9373 10.7143 29.3158 10.7143 27.625C10.7143 25.9342 10.037 24.3127 8.83144 23.1172C7.62585 21.9216 5.99071 21.25 4.28574 21.25ZM4.28574 31.1667H2.85716V24.0833H4.28574C5.23294 24.0833 6.14135 24.4565 6.81113 25.1207C7.48091 25.7849 7.85718 26.6857 7.85718 27.625C7.85718 28.5643 7.48091 29.4651 6.81113 30.1293C6.14135 30.7935 5.23294 31.1667 4.28574 31.1667ZM34.5591 30.2972C34.8328 30.5569 34.9913 30.9138 34.9997 31.2894C35.008 31.665 34.8656 32.0285 34.6037 32.3C34.1063 32.831 33.5048 33.2557 32.836 33.548C32.1672 33.8403 31.4453 33.9941 30.7144 34C27.5626 34 25.0001 31.1401 25.0001 27.625C25.0001 24.1099 27.5626 21.25 30.7144 21.25C31.4453 21.2559 32.1672 21.4097 32.836 21.702C33.5048 21.9943 34.1063 22.419 34.6037 22.95C34.8599 23.2225 34.9975 23.5841 34.9868 23.9565C34.9761 24.3289 34.8179 24.6821 34.5464 24.9397C34.275 25.1972 33.9121 25.3384 33.5365 25.3325C33.1608 25.3267 32.8026 25.1744 32.5394 24.9085C32.3076 24.6555 32.0262 24.4518 31.7125 24.31C31.3987 24.1681 31.0592 24.091 30.7144 24.0833C29.1394 24.0833 27.8573 25.6771 27.8573 27.625C27.8573 29.5729 29.1394 31.1667 30.7144 31.1667C31.0592 31.159 31.3987 31.0819 31.7125 30.94C32.0262 30.7982 32.3076 30.5945 32.5394 30.3415C32.8014 30.07 33.1613 29.9129 33.54 29.9046C33.9188 29.8963 34.2853 30.0375 34.5591 30.2972ZM17.8572 21.25C14.7054 21.25 12.1429 24.1099 12.1429 27.625C12.1429 31.1401 14.7054 34 17.8572 34C21.009 34 23.5715 31.1401 23.5715 27.625C23.5715 24.1099 21.009 21.25 17.8572 21.25ZM17.8572 31.1667C16.2822 31.1667 15.0001 29.5729 15.0001 27.625C15.0001 25.6771 16.2822 24.0833 17.8572 24.0833C19.4322 24.0833 20.7144 25.6771 20.7144 27.625C20.7144 29.5729 19.4322 31.1667 17.8572 31.1667ZM3.57145 17C3.95033 17 4.31369 16.8507 4.5816 16.5851C4.84951 16.3194 5.00002 15.9591 5.00002 15.5833V2.83333H20.7144V11.3333C20.7144 11.7091 20.8649 12.0694 21.1328 12.3351C21.4007 12.6007 21.7641 12.75 22.143 12.75H30.7144V15.5833C30.7144 15.9591 30.8649 16.3194 31.1329 16.5851C31.4008 16.8507 31.7641 17 32.143 17C32.5219 17 32.8853 16.8507 33.1532 16.5851C33.4211 16.3194 33.5716 15.9591 33.5716 15.5833V11.3333C33.5717 11.1472 33.5349 10.9629 33.4632 10.791C33.3915 10.619 33.2864 10.4627 33.1537 10.331L23.1537 0.414375C23.0209 0.28286 22.8633 0.178574 22.6899 0.107474C22.5165 0.0363741 22.3306 -0.000145897 22.143 4.38031e-07H5.00002C4.24226 4.38031e-07 3.51553 0.298511 2.97971 0.829864C2.44389 1.36122 2.14287 2.08189 2.14287 2.83333V15.5833C2.14287 15.9591 2.29338 16.3194 2.56129 16.5851C2.8292 16.8507 3.19256 17 3.57145 17ZM23.5715 4.83615L28.6948 9.91667H23.5715V4.83615Z"
                      fill="#000000"
                    />
                  </g>
                  <text
                    x="0"
                    y="8"
                    fontSize="6"
                    fontWeight="bold"
                    fill="#000000"
                    textAnchor="middle"
                  >
                    DOC
                  </text>
                </g>

                {/* Document with Arrow Icon */}
                <g
                  className="card-icon"
                  transform="translate(60, 0)"
                  style={{ cursor: 'pointer' }}
                  onClick={() => console.log('Document with arrow clicked')}
                >
                  <g transform="scale(0.6)">
                    <path
                      d="M14,2H6C4.9,2,4,2.9,4,4v16c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V8L14,2z M16,18H8v-2h8V18z M16,14H8v-2h8V14z M13,9V3.5L18.5,9H13z"
                      fill="#000000"
                    />
                    <path
                      d="M2 0 L 8 6 L 2 12"
                      transform="translate(12, -4)"
                      stroke="#FF0000"
                      strokeWidth="2"
                      fill="none"
                    />
                  </g>
                </g>

                {/* Dollar Icon */}
                <g
                  className="card-icon"
                  transform="translate(90, 0)"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setShowOfferPopup(true)}
                  onMouseLeave={() => setShowOfferPopup(false)}
                >
                  <circle
                    r="18"
                    fill={node.data.data.heir ? '#4CAF50' : colors.primary}
                  />
                  <text
                    x="0"
                    y="5"
                    fontSize="16"
                    fontWeight="bold"
                    fill="#FFFFFF"
                    textAnchor="middle"
                  >
                    $
                  </text>

                  {/* Offer popup */}
                  {showOfferPopup && (
                    <g className="offer-popup" transform="translate(-60, -80)">
                      <rect
                        width="120"
                        height="75"
                        rx="8"
                        ry="8"
                        fill="#FFFFFF"
                        stroke="#CCCCCC"
                        strokeWidth="1"
                        filter="url(#dropShadow)"
                      />
                      <text
                        x="60"
                        y="20"
                        textAnchor="middle"
                        fontSize="14"
                        fontWeight="bold"
                        fill="#000000"
                      >
                        Offer Amount
                      </text>
                      <text
                        x="60"
                        y="45"
                        textAnchor="middle"
                        fontSize="16"
                        fontWeight="bold"
                        fill="#000000"
                      >
                        $0.00
                      </text>
                      <text
                        x="60"
                        y="65"
                        textAnchor="middle"
                        fontSize="12"
                        fill="#0066CC"
                        textDecoration="underline"
                        style={{ cursor: 'pointer' }}
                        onClick={() => console.log('Offer letter link clicked')}
                      >
                        Link to offer letter
                      </text>

                      {/* Triangle pointer */}
                      <path
                        d="M 0,0 L 10,10 L 20,0 Z"
                        transform="translate(50, -1) rotate(180)"
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

          {/* Bottom bar with down arrow */}
          <g
            className="bottom-bar"
            transform={`translate(0, ${cardDimensions.h - 18})`}
          >
            <rect
              width={cardDimensions.w}
              height={18}
              fill="#E9E9E9"
              rx="0 0 20 20"
              ry="0 0 20 20"
            />
            <g
              transform={`translate(${cardDimensions.w / 2}, 9)`}
              onClick={toggleNotesPanel}
              style={{ cursor: 'pointer' }}
            >
              <path
                d="M -6 -3 L 0 3 L 6 -3"
                stroke="#000000"
                strokeWidth="2"
                fill="none"
                transform={showNotesPanel ? 'rotate(180)' : ''}
              />
            </g>
          </g>

          {/* Notes panel that slides up from bottom */}
          {showNotesPanel && (
            <g
              className="notes-panel"
              transform={`translate(0, ${cardDimensions.h - 18 - 120})`}
            >
              <rect
                width={cardDimensions.w}
                height={120}
                fill="#FFFFFF"
                stroke="#CCCCCC"
                strokeWidth="1"
              />
              <rect width={cardDimensions.w} height="30" fill="#F5F5F5" />
              <text
                x={20}
                y={20}
                fontSize="14"
                fontWeight="bold"
                fill="#000000"
              >
                Notes
              </text>

              {/* Example note */}
              <g transform="translate(10, 40)">
                <rect
                  width={cardDimensions.w - 20}
                  height="40"
                  rx="4"
                  ry="4"
                  fill="#F9F9F9"
                  stroke="#EEEEEE"
                  strokeWidth="1"
                />
                <text x={5} y={12} fontSize="10" fill="#666666">
                  Research Update • 04/15/2025 • UserID
                </text>
                <text x={5} y={28} fontSize="11" fill="#000000">
                  Example note content goes here.
                </text>
              </g>

              {/* Close button in center */}
              <g
                transform={`translate(${cardDimensions.w / 2}, 15)`}
                onClick={toggleNotesPanel}
                style={{ cursor: 'pointer' }}
              >
                <circle r="10" fill="#F0F0F0" />
                <path
                  d="M -6 0 L 6 0"
                  stroke="#000000"
                  strokeWidth="2"
                  fill="none"
                  transform="rotate(0)"
                />
              </g>
            </g>
          )}
        </g>
      </g>
    </g>
  );
};

export default memo(Card);
