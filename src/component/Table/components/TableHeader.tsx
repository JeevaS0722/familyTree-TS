// TableHeader.tsx - Base header component
import React, { memo } from 'react';
import { Tooltip } from '@mui/material';
import {
  ArrowDownward,
  ArrowUpward,
  PushPin,
  PushPinOutlined,
} from '@mui/icons-material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export interface TableHeaderProps {
  // Essential props
  displayName: string;
  colId: string;

  // Visibility props
  toggleColumnVisibility: (colId: string) => void;
  isVisible: boolean;

  // Sort props
  handleSortClick: (colId: string) => void;
  sortable: boolean;
  sortOrder: 'asc' | 'desc';
  sortBy: string[];
  initialSortBy: string[];

  // Pin props
  handlePinClick: (colId: string, isPinned: boolean) => void;
  isPinned: boolean;
  isFixedColumn: boolean;
  isDefaultPinned: boolean;

  // Children render function
  children?: React.ReactNode;

  // Optional styling
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Base header component that provides common functionality
 * This component handles common header features like sorting, pinning, visibility
 * but doesn't implement editing itself (delegated to child components)
 */
const TableHeader: React.FC<TableHeaderProps> = memo(
  ({
    displayName,
    colId,
    toggleColumnVisibility,
    handleSortClick,
    sortable,
    sortOrder,
    sortBy,
    initialSortBy,
    handlePinClick,
    isPinned,
    isFixedColumn,
    children,
    style = {},
    className = '',
  }) => {
    // Determine header color
    const headerColor = React.useMemo(() => {
      if (sortBy.includes(colId)) {
        return '#1997C6';
      }
      if (sortBy.length === 0 && initialSortBy.includes(colId)) {
        return '#1997C6';
      }
      return 'white';
    }, [sortBy, initialSortBy, colId]);

    // Event handlers
    const handleSortButtonClick = (event: React.MouseEvent) => {
      event.stopPropagation();
      handleSortClick(colId);
    };

    const handleVisibilityToggle = (event: React.MouseEvent) => {
      event.stopPropagation();
      toggleColumnVisibility(colId);
    };

    const handlePinButtonClick = (event: React.MouseEvent) => {
      event.stopPropagation();
      handlePinClick(colId, !isPinned);
    };

    // Base styles
    const baseStyle = {
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: '#252830',
      padding: '0 8px',
      boxSizing: 'border-box' as const,
      overflow: 'hidden',
      flexWrap: 'wrap' as const,
      ...style,
    };

    // Header content
    const headerContent = (
      <>
        <div
          style={{
            display: 'inline-block',
            color: headerColor,
            fontWeight: 'normal',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {displayName}
        </div>

        {/* This is where child components would render their content */}
        {children}
      </>
    );

    // Icon controls
    const iconControls = (isHovered: boolean) =>
      isHovered && (
        <div
          style={{
            display: 'flex',
            flex: '0 0 auto',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {sortable && (
            <Tooltip title="Sort" arrow>
              <span
                onClick={handleSortButtonClick}
                style={{ cursor: 'pointer' }}
              >
                {sortOrder === 'asc' ? (
                  <ArrowUpward
                    fontSize="small"
                    style={{
                      fontSize: '14px',
                      color: sortBy.includes(colId) ? '#1997C6' : 'white',
                    }}
                  />
                ) : (
                  <ArrowDownward
                    fontSize="small"
                    style={{
                      fontSize: '14px',
                      color: sortBy.includes(colId) ? '#1997C6' : 'white',
                    }}
                  />
                )}
              </span>
            </Tooltip>
          )}

          {!isFixedColumn && (
            <Tooltip title={isPinned ? 'Unpin Column' : 'Pin Column'} arrow>
              {isPinned ? (
                <PushPin
                  fontSize="small"
                  onClick={handlePinButtonClick}
                  style={{
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: 'white',
                  }}
                />
              ) : (
                <PushPinOutlined
                  fontSize="small"
                  onClick={handlePinButtonClick}
                  style={{
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: 'white',
                  }}
                />
              )}
            </Tooltip>
          )}

          {!isFixedColumn && (
            <Tooltip title="Hide Column" arrow>
              <VisibilityOffIcon
                fontSize="small"
                onClick={handleVisibilityToggle}
                style={{
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: 'white',
                }}
              />
            </Tooltip>
          )}
        </div>
      );

    // This is an abstract base component that would normally
    // be extended by FullEditHeader and PartialEditHeader
    // Since we're already implementing those separately, this
    // just provides the basic structure

    return (
      <div style={baseStyle} className={className}>
        <div
          style={{
            display: 'flex',
            flex: '1 1 auto',
            alignItems: 'center',
            minWidth: 0,
            gap: '8px',
            flexWrap: 'wrap',
            rowGap: '4px',
          }}
        >
          {headerContent}
        </div>
      </div>
    );
  }
);

export default TableHeader;
