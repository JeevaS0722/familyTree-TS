import React, { useState, useEffect } from 'react';
import { CardHeaderProps } from '../types';

const CardHeader: React.FC<CardHeaderProps> = ({
  data,
  onPersonAdd,
  onPersonDelete,
  cardWidth,
}) => {
  const { displayName, personId, altNames, titles } = data;
  const [nameHovered, setNameHovered] = useState(false);
  const [infoPopupsOpen, setInfoPopupsOpen] = useState(false);

  // Function to truncate text with ellipsis if it exceeds maxLength
  const truncateName = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  // Toggle function for info popups
  const toggleInfoPopups = () => {
    setInfoPopupsOpen(!infoPopupsOpen);
  };

  // Maximum length for display name before truncation
  const maxNameLength = 20;
  const truncatedName = truncateName(displayName, maxNameLength);

  return (
    <g className="card-header">
      <path
        d={`
          M20,0 
          H${cardWidth - 20} 
          Q${cardWidth},0 ${cardWidth},20 
          V${30} 
          H0 
          V20 
          Q0,0 20,0 
          Z
        `}
        fill="white"
      />
      <g
        onMouseEnter={() => setNameHovered(true)}
        onMouseLeave={() => setNameHovered(false)}
      >
        <text
          x={7}
          y={18}
          fontSize={16}
          fontWeight="bolder"
          fill="#000000"
          dominantBaseline="middle"
        >
          {truncatedName}
        </text>

        {/* Tooltip for displaying full name on hover */}
        {nameHovered && displayName.length > maxNameLength && (
          <g transform="translate(7, -25)" className="header-tooltip">
            <rect
              x="0"
              y="0"
              width={Math.min(displayName.length * 7, 500)}
              height="20"
              rx="5"
              fill="#000"
              opacity="0.8"
            />
            <text
              // x={Math.min(displayName.length * 3.5, 100)}
              x="140"
              y="14"
              fontSize="12"
              fontWeight="normal"
              fill="#FFF"
              textAnchor="middle"
            >
              {displayName}
            </text>
          </g>
        )}
      </g>

      {/* Add Member Icon */}
      <g
        transform="translate(220, 6)"
        onClick={e => {
          if (onPersonAdd) {
            onPersonAdd(e);
          }
        }}
        style={{ cursor: 'pointer' }}
      >
        <rect width="18" height="18" fill="transparent">
          <title>Add Member</title>
        </rect>
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path
            d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
            fill="#00BF0A"
          />
          <path d="M18 8H20V11H23V13H20V16H18V13H15V11H18V8Z" fill="#00BF0A" />
        </svg>
      </g>

      {/* Delete Icon */}
      <g
        transform="translate(245, 6)"
        onClick={e => {
          e.stopPropagation();
          if (onPersonDelete) {
            onPersonDelete(personId);
          }
        }}
        style={{ cursor: 'pointer' }}
      >
        <rect width="18" height="18" fill="transparent">
          <title>Delete Member</title>
        </rect>
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path
            d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z"
            fill="#FF0000"
          />
        </svg>
      </g>

      {/* Header Arrow/Close Button */}
      {!infoPopupsOpen ? (
        <g
          transform="translate(270, 6)"
          style={{ cursor: 'pointer' }}
          onClick={toggleInfoPopups}
        >
          <rect x="-3" y="-4" width="25" height="25" fill="transparent" />
          <svg
            width="20"
            height="25"
            viewBox="0 0 21 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_d_808_144)">
              <path
                d="M14.7801 11.0467L7.2809 18.7736C7.21122 18.8454 7.12851 18.9023 7.03747 18.9411C6.94644 18.98 6.84887 19 6.75033 19C6.6518 19 6.55423 18.98 6.46319 18.9411C6.37216 18.9023 6.28944 18.8454 6.21977 18.7736C6.15009 18.7018 6.09482 18.6165 6.05712 18.5227C6.01941 18.4289 6 18.3284 6 18.2269C6 18.1254 6.01941 18.0248 6.05712 17.931C6.09482 17.8372 6.15009 17.752 6.21977 17.6802L13.1893 10.5L6.21977 3.31979C6.07905 3.17481 6 2.97816 6 2.77312C6 2.56807 6.07905 2.37143 6.21977 2.22644C6.36048 2.08145 6.55133 2 6.75033 2C6.94933 2 7.14018 2.08145 7.2809 2.22644L14.7801 9.95332C14.8498 10.0251 14.9051 10.1103 14.9428 10.2041C14.9806 10.2979 15 10.3985 15 10.5C15 10.6015 14.9806 10.7021 14.9428 10.7959C14.9051 10.8897 14.8498 10.9749 14.7801 11.0467Z"
                fill="black"
              />
              <path
                d="M5.50221 16.9837L5.50216 16.9838C5.34111 17.1497 5.21489 17.3451 5.12928 17.558C5.04369 17.7709 5 17.9981 5 18.2269C5 18.4556 5.0437 18.6828 5.12928 18.8957C5.21488 19.1087 5.34111 19.3041 5.50216 19.47C5.66329 19.636 5.85619 19.7694 6.07066 19.8609C6.2852 19.9524 6.51624 20 6.75033 20C6.98442 20 7.21547 19.9524 7.43001 19.8609C7.64448 19.7694 7.83738 19.636 7.9985 19.47L15.4973 11.7435C15.4974 11.7434 15.4974 11.7434 15.4975 11.7433C15.4976 11.7432 15.4976 11.7432 15.4977 11.7431C15.6587 11.5773 15.7849 11.382 15.8706 11.1691C15.9563 10.9562 16 10.7289 16 10.5C16 10.2711 15.9563 10.0438 15.8706 9.83086L14.9428 10.2041L15.8706 9.83086C15.7849 9.61784 15.6585 9.4224 15.4973 9.25647L7.9985 1.52999C7.67271 1.19431 7.22437 1 6.75033 1C6.2763 1 5.82795 1.19431 5.50217 1.52999C5.17736 1.86465 5 2.31235 5 2.77312C5 3.23388 5.17736 3.68158 5.50216 4.01625L5.50221 4.0163L11.7957 10.5L5.50221 16.9837Z"
                stroke="black"
                strokeWidth="2"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_808_144"
                x="0"
                y="0"
                width="21"
                height="29"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_808_144"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_808_144"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </g>
      ) : (
        <g
          transform="translate(270, 0)"
          style={{ cursor: 'pointer' }}
          onClick={toggleInfoPopups}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transition: 'all 0.3s ease-in-out' }}
          >
            <circle cx="50" cy="50" r="50" fill="black" />
            <line
              x1="30"
              y1="30"
              x2="70"
              y2="70"
              stroke="white"
              strokeWidth="12"
              strokeLinecap="square"
            />
            <line
              x1="70"
              y1="30"
              x2="30"
              y2="70"
              stroke="white"
              strokeWidth="12"
              strokeLinecap="square"
            />
          </svg>
        </g>
      )}

      {/* Alternative Names Popup */}
      {infoPopupsOpen && (
        <g className="alt-names-popup" transform="translate(302, -3)">
          <rect
            width={250}
            height={210}
            rx={10}
            ry={10}
            fill="white"
            stroke="#D9D9D9"
            strokeWidth={1}
            filter="drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))"
          />

          {/* Header Section - Sticky */}
          <rect
            x={0}
            y={0}
            width={250}
            height={36}
            rx={10}
            ry={10}
            fill="#f0f0f0"
          />
          <text
            x={125}
            y={24}
            fontSize={14}
            fontWeight="bold"
            textAnchor="middle"
            fill="#333"
          >
            Alternative Names
          </text>

          {/* Divider Line */}
          <line
            x1={10}
            y1={36}
            x2={240}
            y2={36}
            stroke="#e0e0e0"
            strokeWidth={1.5}
          />

          {/* Use HTML-based scrolling with foreignObject for better scrolling support */}
          <foreignObject x={0} y={36} width={250} height={174}>
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              style={{
                height: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
                scrollbarWidth: 'thin',
              }}
            >
              <div style={{ padding: '5px 0' }}>
                {altNames && altNames.length > 0 ? (
                  altNames.map((name, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        backgroundColor:
                          index % 2 === 0 ? '#ffffff' : '#f7f7f7',
                        minHeight: '32px',
                        borderBottom: '1px solid #f0f0f0',
                      }}
                    >
                      <div
                        style={{
                          width: '95%',
                          fontSize: '13px',
                          color: '#333',
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          wordBreak: 'break-word',
                        }}
                      >
                        {name || '-'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      padding: '20px 0',
                      textAlign: 'center',
                      color: '#777',
                      fontSize: '13px',
                    }}
                  >
                    No alternative names
                  </div>
                )}
              </div>
            </div>
          </foreignObject>
        </g>
      )}

      {/* Titles Popup - Slides in from right of alternative names */}
      {infoPopupsOpen && (
        <g className="titles-popup" transform="translate(562, -3)">
          <rect
            width={250}
            height={210}
            rx={10}
            ry={10}
            fill="white"
            stroke="#D9D9D9"
            strokeWidth={1}
            filter="drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))"
          />

          {/* Header Section - Sticky */}
          <rect
            x={0}
            y={0}
            width={250}
            height={36}
            rx={10}
            ry={10}
            fill="#f0f0f0"
          />
          <text
            x={125}
            y={24}
            fontSize={14}
            fontWeight="bold"
            textAnchor="middle"
            fill="#333"
          >
            Titles
          </text>

          {/* Divider Line */}
          <line
            x1={10}
            y1={36}
            x2={240}
            y2={36}
            stroke="#e0e0e0"
            strokeWidth={1.5}
          />

          {/* Use HTML-based scrolling with foreignObject for better scrolling support */}
          <foreignObject x={0} y={36} width={250} height={174}>
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              style={{
                height: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
                scrollbarWidth: 'thin',
              }}
            >
              <div style={{ padding: '5px 0' }}>
                {titles && titles.length > 0 ? (
                  titles.map((title, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        backgroundColor:
                          index % 2 === 0 ? '#ffffff' : '#f7f7f7',
                        minHeight: '32px',
                        borderBottom: '1px solid #f0f0f0',
                      }}
                    >
                      <div
                        style={{
                          width: '95%',
                          fontSize: '13px',
                          color: '#333',
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          wordBreak: 'break-word',
                        }}
                      >
                        {title || '-'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      padding: '20px 0',
                      textAlign: 'center',
                      color: '#777',
                      fontSize: '13px',
                    }}
                  >
                    No titles
                  </div>
                )}
              </div>
            </div>
          </foreignObject>
        </g>
      )}
    </g>
  );
};

export default CardHeader;
