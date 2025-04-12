// FullEditHeader.tsx - Header component for editing the entire header text
import React, { useState, useEffect, useCallback, memo } from 'react';
import { Tooltip } from '@mui/material';
import {
  ArrowDownward,
  ArrowUpward,
  PushPin,
  PushPinOutlined,
} from '@mui/icons-material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export interface FullEditHeaderProps {
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

  // Edit props
  headerEdit: boolean;
  onHeaderValueChanged: (oldValue: string, newValue: string) => void;

  // Optional formatting/parsing
  headerEditFormatter?: (value: string) => string;
  headerEditParser?: (value: string) => string;
  headerValidation?: (value: string) => boolean;
}

/**
 * Header component that edits the entire header text
 * This is used for most columns where the entire header should be editable
 */
const FullEditHeader: React.FC<FullEditHeaderProps> = memo(
  props => {
    const {
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
      headerEdit,
      onHeaderValueChanged,
      headerEditFormatter,
      headerEditParser,
      headerValidation,
    } = props;

    // State
    const [headerName, setHeaderName] = useState<string>(displayName);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [editValue, setEditValue] = useState<string>('');
    const [originalHeaderValue, setOriginalHeaderValue] = useState<string>('');
    const [error, setError] = useState<boolean>(false);

    // Update header name when displayName prop changes
    useEffect(() => {
      if (displayName !== headerName && !isEditing) {
        setHeaderName(displayName);
      }
    }, [displayName, headerName, isEditing]);

    // Start editing
    const startEditing = useCallback(() => {
      if (headerEdit) {
        setOriginalHeaderValue(headerName);
        setEditValue(headerName);
        setError(false);
        setIsEditing(true);
      }
    }, [headerEdit, headerName]);

    // Cancel editing
    const cancelEditing = useCallback(() => {
      setHeaderName(originalHeaderValue);
      setIsEditing(false);
      setError(false);
    }, [originalHeaderValue]);

    // Handle input change
    const handleInputChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = event.target.value;

        // Apply formatter if provided
        if (headerEditFormatter) {
          newValue = headerEditFormatter(newValue);
        }

        setEditValue(newValue);

        // Validate the input
        if (headerValidation) {
          setError(!headerValidation(newValue));
        } else {
          setError(newValue.trim().length === 0);
        }
      },
      [headerEditFormatter, headerValidation]
    );

    // Apply edit
    const applyEdit = useCallback(() => {
      if (error) {
        return cancelEditing();
      }

      let newValue = editValue;

      // Apply parser if provided
      if (headerEditParser) {
        newValue = headerEditParser(newValue);
      }

      // Only update if changed
      if (newValue !== originalHeaderValue) {
        setHeaderName(newValue);
        onHeaderValueChanged(originalHeaderValue, newValue);
      }

      setIsEditing(false);
      setError(false);
    }, [
      editValue,
      originalHeaderValue,
      onHeaderValueChanged,
      headerEditParser,
      error,
      cancelEditing,
    ]);

    // Handle key press
    const handleKeyPress = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyEdit();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          cancelEditing();
        }
      },
      [applyEdit, cancelEditing]
    );

    // Handle blur
    const handleInputBlur = useCallback(() => {
      applyEdit();
    }, [applyEdit]);

    // Event handlers
    const handleSortButtonClick = useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation();
        handleSortClick(colId);
      },
      [handleSortClick, colId]
    );

    const handleHeaderClick = useCallback(() => {
      if (headerEdit && !isEditing) {
        startEditing();
      }
    }, [headerEdit, isEditing, startEditing]);

    const handleVisibilityToggle = useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation();
        toggleColumnVisibility(colId);
      },
      [toggleColumnVisibility, colId]
    );

    const handlePinButtonClick = useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation();
        handlePinClick(colId, !isPinned);
      },
      [handlePinClick, colId, isPinned]
    );

    // Mouse enter/leave handlers
    const handleMouseEnter = useCallback(() => {
      setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
      setIsHovered(false);
    }, []);

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

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start', // allow content to start at the top so extra lines push the container down
          width: '100%',
          minHeight: '40px', // minimum height, but container grows with content
          height: 'auto', // let the height grow automatically
          backgroundColor: '#252830',
          padding: '0 8px',
          boxSizing: 'border-box',
          alignContent: 'center',
          flexWrap: 'wrap',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Header content */}
        <div
          style={{
            display: 'flex',
            flex: '1 1 auto',
            alignItems: 'flex-start', // align items at the top
            minWidth: 0,
            gap: '8px',
            flexWrap: 'wrap', // allow header text and icons to wrap
            rowGap: '4px',
          }}
        >
          {/* Header text/input */}
          <div
            style={{
              flex: '0 1 auto',
              whiteSpace: 'normal', // allow wrapping instead of forcing one line
              wordWrap: 'break-word',
              minWidth: '30px',
              cursor: headerEdit ? 'pointer' : 'default',
            }}
            onClick={handleHeaderClick}
          >
            {isEditing ? (
              <input
                type="text"
                value={editValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                onBlur={handleInputBlur}
                autoFocus
                style={{
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  color: error ? '#ff6b6b' : 'white',
                  borderBottom: error ? '1px solid #ff6b6b' : 'none',
                }}
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: headerColor,
                  fontWeight: 'normal',
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                  lineHeight: 1.2,
                  width: '100%',
                }}
              >
                {headerName}
              </div>
            )}
          </div>

          {/* Icons */}
          {isHovered && (
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
          )}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function
    if (
      prevProps.displayName !== nextProps.displayName ||
      prevProps.headerEdit !== nextProps.headerEdit ||
      prevProps.isPinned !== nextProps.isPinned ||
      prevProps.isVisible !== nextProps.isVisible
    ) {
      return false;
    }

    if (
      prevProps.sortOrder !== nextProps.sortOrder ||
      !prevProps.sortBy.every((val, idx) => nextProps.sortBy[idx] === val) ||
      prevProps.sortBy.length !== nextProps.sortBy.length
    ) {
      return false;
    }

    return true;
  }
);
FullEditHeader.displayName = 'FullEditHeader';
export default FullEditHeader;
