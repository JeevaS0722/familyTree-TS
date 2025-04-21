// src/component/FamilyTree/components/card/EnhancedCard.tsx
import React, { useState, useRef, useCallback } from 'react';
import { TreeNode } from '../../types/familyTree';
import EnhancedRelationshipBadge from './EnhancedRelationshipBadge';
import NotesPanel from './NotesPanel';

// Define icon components
const ArrowIcon = () => (
  <path
    d="M14.7801 11.0467L7.2809 18.7736C7.21122 18.8454 7.12851 18.9023 7.03747 18.9411C6.94644 18.98 6.84887 19 6.75033 19C6.6518 19 6.55423 18.98 6.46319 18.9411C6.37216 18.9023 6.28944 18.8454 6.21977 18.7736C6.15009 18.7018 6.09482 18.6165 6.05712 18.5227C6.01941 18.4289 6 18.3284 6 18.2269C6 18.1254 6.01941 18.0248 6.05712 17.931C6.09482 17.8372 6.15009 17.752 6.21977 17.6802L13.1893 10.5L6.21977 3.31979C6.07905 3.17481 6 2.97816 6 2.77312C6 2.56807 6.07905 2.37143 6.21977 2.22644C6.36048 2.08145 6.55133 2 6.75033 2C6.94933 2 7.14018 2.08145 7.2809 2.22644L14.7801 9.95332C14.8498 10.0251 14.9051 10.1103 14.9428 10.2041C14.9806 10.2979 15 10.3985 15 10.5C15 10.6015 14.9806 10.7021 14.9428 10.7959C14.9051 10.8897 14.8498 10.9749 14.7801 11.0467Z"
    fill="currentColor"
  />
);

const NotesIcon = () => (
  <path
    d="M9.95837 11.5001C9.95837 11.1354 10.1032 10.7856 10.3611 10.5278C10.619 10.2699 10.9687 10.1251 11.3334 10.1251H22.3334C22.698 10.1251 23.0478 10.2699 23.3056 10.5278C23.5635 10.7856 23.7084 11.1354 23.7084 11.5001C23.7084 11.8647 23.5635 12.2145 23.3056 12.4723C23.0478 12.7302 22.698 12.8751 22.3334 12.8751H11.3334C10.9687 12.8751 10.619 12.7302 10.3611 12.4723C10.1032 12.2145 9.95837 11.8647 9.95837 11.5001ZM11.3334 18.3751H22.3334C22.698 18.3751 23.0478 18.2302 23.3056 17.9723C23.5635 17.7145 23.7084 17.3647 23.7084 17.0001C23.7084 16.6354 23.5635 16.2856 23.3056 16.0278C23.0478 15.7699 22.698 15.6251 22.3334 15.6251H11.3334C10.9687 15.6251 10.619 15.7699 10.3611 16.0278C10.1032 16.2856 9.95837 16.6354 9.95837 17.0001C9.95837 17.3647 10.1032 17.7145 10.3611 17.9723C10.619 18.2302 10.9687 18.3751 11.3334 18.3751ZM16.8334 21.1251H11.3334C10.9687 21.1251 10.619 21.2699 10.3611 21.5278C10.1032 21.7856 9.95837 22.1354 9.95837 22.5001C9.95837 22.8647 10.1032 23.2145 10.3611 23.4723C10.619 23.7302 10.9687 23.8751 11.3334 23.8751H16.8334C17.198 23.8751 17.5478 23.7302 17.8056 23.4723C18.0635 23.2145 18.2084 22.8647 18.2084 22.5001C18.2084 22.1354 18.0635 21.7856 17.8056 21.5278C17.5478 21.2699 17.198 21.1251 16.8334 21.1251ZM33.3334 3.25006V21.9311C33.3345 22.2924 33.2638 22.6503 33.1255 22.984C32.9871 23.3177 32.7837 23.6206 32.5273 23.8751L23.7084 32.694C23.4539 32.9504 23.151 33.1538 22.8173 33.2921C22.4836 33.4305 22.1257 33.5012 21.7645 33.5H3.08337C2.35403 33.5 1.65455 33.2103 1.13883 32.6946C0.623105 32.1789 0.333374 31.4794 0.333374 30.75V3.25006C0.333374 2.52071 0.623105 1.82124 1.13883 1.30552C1.65455 0.789792 2.35403 0.500061 3.08337 0.500061H30.5834C31.3127 0.500061 32.0122 0.789792 32.5279 1.30552C33.0436 1.82124 33.3334 2.52071 33.3334 3.25006ZM3.08337 30.75H20.9584V22.5001C20.9584 22.1354 21.1032 21.7856 21.3611 21.5278C21.619 21.2699 21.9687 21.1251 22.3334 21.1251H30.5834V3.25006H3.08337V30.75ZM23.7084 23.8751V28.8079L28.6395 23.8751H23.7084Z"
    fill="currentColor"
  />
);

const DocIcon = () => (
  <path
    d="M4.28574 21.25H1.42858C1.0497 21.25 0.686331 21.3993 0.418421 21.6649C0.15051 21.9306 0 22.2909 0 22.6667V32.5833C0 32.9591 0.15051 33.3194 0.418421 33.5851C0.686331 33.8507 1.0497 34 1.42858 34H4.28574C5.99071 34 7.62585 33.3284 8.83144 32.1328C10.037 30.9373 10.7143 29.3158 10.7143 27.625C10.7143 25.9342 10.037 24.3127 8.83144 23.1172C7.62585 21.9216 5.99071 21.25 4.28574 21.25ZM4.28574 31.1667H2.85716V24.0833H4.28574C5.23294 24.0833 6.14135 24.4565 6.81113 25.1207C7.48091 25.7849 7.85718 26.6857 7.85718 27.625C7.85718 28.5643 7.48091 29.4651 6.81113 30.1293C6.14135 30.7935 5.23294 31.1667 4.28574 31.1667ZM34.5591 30.2972C34.8328 30.5569 34.9913 30.9138 34.9997 31.2894C35.008 31.665 34.8656 32.0285 34.6037 32.3C34.1063 32.831 33.5048 33.2557 32.836 33.548C32.1672 33.8403 31.4453 33.9941 30.7144 34C27.5626 34 25.0001 31.1401 25.0001 27.625C25.0001 24.1099 27.5626 21.25 30.7144 21.25C31.4453 21.2559 32.1672 21.4097 32.836 21.702C33.5048 21.9943 34.1063 22.419 34.6037 22.95C34.8599 23.2225 34.9975 23.5841 34.9868 23.9565C34.9761 24.3289 34.8179 24.6821 34.5464 24.9397C34.275 25.1972 33.9121 25.3384 33.5365 25.3325C33.1608 25.3267 32.8026 25.1744 32.5394 24.9085C32.3076 24.6555 32.0262 24.4518 31.7125 24.31C31.3987 24.1681 31.0592 24.091 30.7144 24.0833C29.1394 24.0833 27.8573 25.6771 27.8573 27.625C27.8573 29.5729 29.1394 31.1667 30.7144 31.1667C31.0592 31.159 31.3987 31.0819 31.7125 30.94C32.0262 30.7982 32.3076 30.5945 32.5394 30.3415C32.8014 30.07 33.1613 29.9129 33.54 29.9046C33.9188 29.8963 34.2853 30.0375 34.5591 30.2972ZM17.8572 21.25C14.7054 21.25 12.1429 24.1099 12.1429 27.625C12.1429 31.1401 14.7054 34 17.8572 34C21.009 34 23.5715 31.1401 23.5715 27.625C23.5715 24.1099 21.009 21.25 17.8572 21.25ZM17.8572 31.1667C16.2822 31.1667 15.0001 29.5729 15.0001 27.625C15.0001 25.6771 16.2822 24.0833 17.8572 24.0833C19.4322 24.0833 20.7144 25.6771 20.7144 27.625C20.7144 29.5729 19.4322 31.1667 17.8572 31.1667ZM3.57145 17C3.95033 17 4.31369 16.8507 4.5816 16.5851C4.84951 16.3194 5.00002 15.9591 5.00002 15.5833V2.83333H20.7144V11.3333C20.7144 11.7091 20.8649 12.0694 21.1328 12.3351C21.4007 12.6007 21.7641 12.75 22.143 12.75H30.7144V15.5833C30.7144 15.9591 30.8649 16.3194 31.1329 16.5851C31.4008 16.8507 31.7641 17 32.143 17C32.5219 17 32.8853 16.8507 33.1532 16.5851C33.4211 16.3194 33.5716 15.9591 33.5716 15.5833V11.3333C33.5717 11.1472 33.5349 10.9629 33.4632 10.791C33.3915 10.619 33.2864 10.4627 33.1537 10.331L23.1537 0.414375C23.0209 0.28286 22.8633 0.178574 22.6899 0.107474C22.5165 0.0363741 22.3306 -0.000145897 22.143 4.38031e-07H5.00002C4.24226 4.38031e-07 3.51553 0.298511 2.97971 0.829864C2.44389 1.36122 2.14287 2.08189 2.14287 2.83333V15.5833C2.14287 15.9591 2.29338 16.3194 2.56129 16.5851C2.8292 16.8507 3.19256 17 3.57145 17ZM23.5715 4.83615L28.6948 9.91667H23.5715V4.83615Z"
    fill="currentColor"
  />
);

const DocDollarIcon = () => (
  <path
    d="M29.8267 9.84487L20.2813 0.394875C20.0257 0.142179 19.6794 0.000165714 19.3182 0H2.95455C2.23123 0 1.53754 0.284463 1.02608 0.790812C0.514616 1.29716 0.227279 1.98392 0.227279 2.7L0 30.5C0 30.858 0.143669 31.2014 0.3994 31.4546C0.655131 31.7078 1.00198 31.85 1.36364 31.85C1.7253 31.85 2.07214 31.7078 2.32787 31.4546C2.5836 31.2014 2.72727 30.858 2.72727 30.5L2.95455 2.7H17.9545V10.8C17.9545 11.158 18.0982 11.5014 18.3539 11.7546C18.6097 12.0078 18.9565 12.15 19.3182 12.15H27.5L27.5 20.5V21L27.5 23C28.2233 23 30.2273 23 30.2273 23C30.2273 22.3868 30.2273 21.8661 30.2273 21.15L30.2273 10.8C30.2274 10.6227 30.1923 10.447 30.1238 10.2832C30.0554 10.1193 29.9533 9.97034 29.8267 9.84487ZM20.6818 4.60856L25.5722 9.45H20.6818V4.60856Z M16.6673 28.2186C17.5206 27.3981 18 26.2853 18 25.125C18 23.9647 17.5206 22.8519 16.6673 22.0314C15.814 21.2109 14.6567 20.75 13.45 20.75H9.55C9.03283 20.75 8.53684 20.5525 8.17114 20.2008C7.80545 19.8492 7.6 19.3723 7.6 18.875C7.6 18.3777 7.80545 17.9008 8.17114 17.5492C8.53684 17.1975 9.03283 17 9.55 17H15.4C15.7448 17 16.0754 16.8683 16.3192 16.6339C16.563 16.3995 16.7 16.0815 16.7 15.75C16.7 15.4185 16.563 15.1005 16.3192 14.8661C16.0754 14.6317 15.7448 14.5 15.4 14.5H12.8V13.25C12.8 12.9185 12.663 12.6005 12.4192 12.3661C12.1754 12.1317 11.8448 12 11.5 12C11.1552 12 10.8246 12.1317 10.5808 12.3661C10.337 12.6005 10.2 12.9185 10.2 13.25V14.5H9.55C8.34327 14.5 7.18596 14.9609 6.33266 15.7814C5.47937 16.6019 5 17.7147 5 18.875C5 20.0353 5.47937 21.1481 6.33266 21.9686C7.18596 22.7891 8.34327 23.25 9.55 23.25H13.45C13.9672 23.25 14.4632 23.4475 14.8289 23.7992C15.1946 24.1508 15.4 24.6277 15.4 25.125C15.4 25.6223 15.1946 26.0992 14.8289 26.4508C14.4632 26.8025 13.9672 27 13.45 27H7.6C7.25522 27 6.92456 27.1317 6.68076 27.3661C6.43696 27.6005 6.3 27.9185 6.3 28.25C6.3 28.5815 6.43696 28.8995 6.68076 29.1339C6.92456 29.3683 7.25522 29.5 7.6 29.5H10.2V30.75C10.2 31.0815 10.337 31.3995 10.5808 31.6339C10.8246 31.8683 11.1552 32 11.5 32C11.8448 32 12.1754 31.8683 12.4192 31.6339C12.663 31.3995 12.8 31.0815 12.8 30.75V29.5H13.45C14.6567 29.5 15.814 29.0391 16.6673 28.2186Z M33.0625 22H19.5625C19.4133 22 19.2702 22.0593 19.1648 22.1648C19.0593 22.2702 19 22.4133 19 22.5625V32.125C19 32.4234 19.1185 32.7095 19.3295 32.9205C19.5405 33.1315 19.8266 33.25 20.125 33.25H32.5C32.7984 33.25 33.0845 33.1315 33.2955 32.9205C33.5065 32.7095 33.625 32.4234 33.625 32.125V22.5625C33.625 22.4133 33.5657 22.2702 33.4602 22.1648C33.3548 22.0593 33.2117 22 33.0625 22ZM31.6162 23.125L26.3125 27.9871L21.0088 23.125H31.6162ZM32.5 32.125H20.125V23.8415L25.9321 29.1648C26.0359 29.2601 26.1716 29.313 26.3125 29.313C26.4534 29.313 26.5891 29.2601 26.6929 29.1648L32.5 23.8415V32.125Z"
    fill="currentColor"
  />
);

interface EnhancedCardProps {
  node: TreeNode;
  width?: number;
  height?: number;
  onUpdateRelationship?: (node: TreeNode, newType: string) => void;
}

const EnhancedCard: React.FC<EnhancedCardProps> = ({
  node,
  width = 300,
  height = 176,
  onUpdateRelationship,
}) => {
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [arrowRotated, setArrowRotated] = useState(false);
  const [headerHovered, setHeaderHovered] = useState(false);

  const contentRef = useRef<SVGGElement>(null);

  // Card colors based on gender
  const getCardColors = () => {
    if (node.data.data.gender === 'M') {
      return {
        primaryColor: '#7EADFF',
        secondaryColor: '#C8DCFF',
      };
    } else if (node.data.data.gender === 'F') {
      return {
        primaryColor: '#FF96BC',
        secondaryColor: '#FFC8DC',
      };
    }
    return {
      primaryColor: '#CCCCCC',
      secondaryColor: '#E0E0E0',
    };
  };

  const colors = getCardColors();
  const isDeceased = !!node.data.data.deceased;
  const hasNotes = !!node.data.data.isNewNotes;
  const contactId = node.data.data.contactId;
  const fileId = node.data.data.fileId;
  const offerAmount = node.data.data.offerAmount || '$0.00';
  const relationshipType = node.data.data.relationshipType || 'Unknown';

  // Show/hide notes panel
  const toggleNotesPanel = useCallback(() => {
    setShowNotesPanel(prev => !prev);
    setArrowRotated(prev => !prev);
  }, []);

  // Handle relationship type update
  const handleUpdateRelationship = useCallback(
    (newType: string) => {
      if (onUpdateRelationship) {
        onUpdateRelationship(node, newType);
      }
    },
    [node, onUpdateRelationship]
  );

  // Navigate to contact notes
  const navigateToNotes = () => {
    console.log(`Navigate to notes for contact ${contactId}`);
    // In a real app, this would use React Router to navigate
  };

  // Navigate to file documents
  const navigateToDocuments = () => {
    console.log(`Navigate to documents for file ${fileId}`);
    // In a real app, this would use React Router to navigate
  };

  return (
    <g ref={contentRef}>
      {/* Enhanced Relationship Badge */}
      <EnhancedRelationshipBadge
        relationshipType={relationshipType}
        isDeceased={isDeceased}
        onUpdateRelationship={handleUpdateRelationship}
        x={-width / 2 + 15}
        y={-height / 2 - 23}
        width={110}
        color="#D9D9D9"
        borderColor="#FF0000"
      />

      {/* Main Card */}
      <g transform={`translate(${-width / 2}, ${-height / 2})`}>
        {/* Card Outline */}
        <rect
          width={width}
          height={height}
          rx={20}
          ry={20}
          stroke={isDeceased ? '#FF0000' : 'rgba(0, 0, 0, 0.12)'}
          strokeWidth={isDeceased ? 3 : 1}
          fill="#FFFFFF"
        />

        {/* Header */}
        <g
          onMouseEnter={() => setHeaderHovered(true)}
          onMouseLeave={() => setHeaderHovered(false)}
        >
          <rect width={width} height={34} fill="#FFFFFF" rx={20} ry={20} />
          <rect y={17} width={width} height={17} fill="#FFFFFF" />
          <text
            x={12}
            y={22}
            fontSize={16}
            fontWeight="bold"
            textAnchor="start"
            fill="#000000"
          >
            {`${node.data.data.firstName} ${node.data.data.lastName}`}
          </text>

          {/* Header Actions (visible on hover) */}
          {headerHovered && (
            <g transform={`translate(${width - 65}, 17)`}>
              <g transform="translate(-25, -8)" style={{ cursor: 'pointer' }}>
                <circle r={12} fill="#F5F5F5" />
                <path
                  d="M -4 0 H 4 M 0 -4 V 4"
                  stroke="#000000"
                  strokeWidth={2}
                />
              </g>
              <g transform="translate(0, -8)" style={{ cursor: 'pointer' }}>
                <circle r={12} fill="#F5F5F5" />
                <path
                  d="M -3 -3 L 3 3 M -3 3 L 3 -3"
                  stroke="#F44336"
                  strokeWidth={2}
                />
              </g>
            </g>
          )}

          {/* Right Arrow Icon */}
          <g transform={`translate(${width - 20}, 17)`}>
            <svg width={15} height={20} viewBox="0 0 21 29">
              <ArrowIcon />
            </svg>
          </g>
        </g>

        {/* Body */}
        <g>
          {/* Left Panel */}
          <rect
            y={34}
            width={width / 2}
            height={height - 34 - 18}
            fill={colors.secondaryColor}
          />
          <g>
            <text x={12} y={50} fontSize={12} fontWeight="bold" fill="#000000">
              Age: {node.data.data.age || 'Unknown'}
            </text>
            <text x={12} y={65} fontSize={12} fontWeight="bold" fill="#000000">
              Birth: {node.data.data.dOB || 'Unknown'}
            </text>
            <text x={12} y={80} fontSize={12} fontWeight="bold" fill="#000000">
              Death: {node.data.data.decDt || 'Unknown'}
            </text>
            <text x={12} y={95} fontSize={10} fontWeight="bold" fill="#000000">
              Address:
              <tspan x={12} dy={12}>
                {node.data.data.address || 'Unknown'}
              </tspan>
            </text>
          </g>

          {/* Right Panel */}
          <rect
            x={width / 2}
            y={34}
            width={width / 2}
            height={height - 34 - 18}
            fill="#FFFFFF"
          />
          <g>
            {/* Division of Interest Field */}
            <rect
              x={width / 2 + 10}
              y={50}
              width={123}
              height={19}
              rx={8}
              ry={8}
              stroke="#000000"
              strokeWidth={1}
              fill="#FFFFFF"
            />
            <text
              x={width / 2 + 71.5}
              y={62}
              textAnchor="middle"
              fontSize={12}
              fontWeight="bold"
              fill="#000000"
            >
              {node.data.data.divisionOfInterest || 'N/A'}
            </text>

            {/* Notes Warning Icon */}
            {hasNotes && (
              <g transform={`translate(${width / 2 - 10}, 80)`}>
                <circle r={10} fill="#FF0000" />
                <text
                  x={0}
                  y={3}
                  fontSize={12}
                  fontWeight="bold"
                  fill="#FFFFFF"
                  textAnchor="middle"
                >
                  !
                </text>
              </g>
            )}

            {/* Percentage Field */}
            <rect
              x={width / 2 + 10}
              y={80}
              width={123}
              height={19}
              rx={8}
              ry={8}
              stroke="#000000"
              strokeWidth={1}
              fill="#FFFFFF"
            />
            <text
              x={width / 2 + 20}
              y={92}
              fontSize={12}
              fontWeight="bold"
              fill="#000000"
            >
              {node.data.data.percentage || '0.000 %'}
            </text>
            <g transform={`translate(${width - 25}, 85)`}>
              <svg width={10} height={15} viewBox="0 0 21 29">
                <ArrowIcon />
              </svg>
            </g>

            {/* Icons */}
            <g transform={`translate(${width / 2 + 10}, 110)`}>
              {/* Notes Icon */}
              <g
                transform="translate(0, 0)"
                style={{ cursor: contactId ? 'pointer' : 'default' }}
                onClick={contactId ? navigateToNotes : undefined}
              >
                <rect width={20} height={20} fill="transparent" />
                <svg width={20} height={20} viewBox="0 0 34 34">
                  <NotesIcon />
                </svg>
              </g>

              {/* Document Icon */}
              <g
                transform="translate(30, 0)"
                style={{ cursor: fileId ? 'pointer' : 'default' }}
                onClick={fileId ? navigateToDocuments : undefined}
              >
                <rect width={20} height={20} fill="transparent" />
                <svg width={20} height={20} viewBox="0 0 35 34">
                  <DocIcon />
                </svg>
              </g>

              {/* Offer Icon */}
              <g
                transform="translate(60, 0)"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setShowOfferPopup(true)}
                onMouseLeave={() => setShowOfferPopup(false)}
              >
                <rect width={20} height={20} fill="transparent" />
                <svg width={20} height={20} viewBox="0 0 34 34">
                  <DocDollarIcon />
                </svg>

                {/* Offer Popup */}
                {showOfferPopup && (
                  <g transform="translate(-45, -90)">
                    <rect
                      width={150}
                      height={70}
                      rx={8}
                      ry={8}
                      fill="#FFFFFF"
                      stroke="#CCCCCC"
                      strokeWidth={1}
                    />
                    <text
                      x={75}
                      y={20}
                      textAnchor="middle"
                      fontSize={12}
                      fontWeight="bold"
                      fill="#000000"
                    >
                      Offer Amount
                    </text>
                    <text
                      x={75}
                      y={40}
                      textAnchor="middle"
                      fontSize={14}
                      fontWeight="bold"
                      fill="#000000"
                    >
                      {offerAmount}
                    </text>
                    <text
                      x={75}
                      y={60}
                      textAnchor="middle"
                      fontSize={11}
                      fill="#1976D2"
                      style={{ cursor: 'pointer' }}
                    >
                      Link to offer letter
                    </text>
                  </g>
                )}
              </g>
            </g>
          </g>
        </g>

        {/* Bottom Bar */}
        <g transform={`translate(0, ${height - 18})`}>
          <rect width={width} height={18} fill="#D9D9D9" rx={0} ry={0} />
          <g
            transform={`translate(${width / 2}, 9)`}
            onClick={toggleNotesPanel}
            style={{ cursor: 'pointer' }}
          >
            <g transform={arrowRotated ? 'rotate(180)' : 'rotate(0)'}>
              <svg width={15} height={20} viewBox="0 0 21 29">
                <ArrowIcon />
              </svg>
            </g>
          </g>
        </g>

        {/* Notes Panel (conditionally rendered) */}
        {showNotesPanel && (
          <foreignObject
            x={0}
            y={height}
            width={width}
            height={120}
            style={{
              overflow: 'visible',
            }}
          >
            <NotesPanel
              contactId={contactId}
              onClose={() => {
                setShowNotesPanel(false);
                setArrowRotated(false);
              }}
              style={{
                borderTop: 'none',
                borderRadius: '0 0 16px 16px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              }}
            />
          </foreignObject>
        )}
      </g>
    </g>
  );
};

export default EnhancedCard;
