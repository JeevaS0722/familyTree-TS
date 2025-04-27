import React, { useState, useEffect, useCallback, memo } from 'react';
import { Tooltip } from '@mui/material';
import {
  ArrowDownward,
  ArrowUpward,
  PushPin,
  PushPinOutlined,
} from '@mui/icons-material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { parseHeaderName } from '../utils/headerUtils';
import PropTypes from 'prop-types';

export interface PartialEditHeaderProps {
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
  onHeaderValueChanged: (
    fileId: string,
    oldValue: string,
    newValue: string
  ) => void;

  // Optional formatting/parsing
  headerEditFormatter?: (value: string) => string;
  headerEditParser?: (value: string) => string;
  headerValidation?: (value: string) => boolean;
}

/**
 * Header component that allows editing only the value part of a Year-Value format header
 * For example, in "2023 - Goal", only "Goal" would be editable
 */
const PartialEditHeader: React.FC<PartialEditHeaderProps> = memo(
  props => {
    const {
      displayName,
      colId,
      field,
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
    const [prefix, setPrefix] = useState<string>('');
    const [separator, setSeparator] = useState<string>('');
    const [value, setValue] = useState<string>('');
    const [originalHeaderValue, setOriginalHeaderValue] = useState<string>('');
    const [error, setError] = useState<boolean>(false);

    // Parse the header into prefix, separator, and value parts
    useEffect(() => {
      if (displayName !== headerName && !isEditing) {
        setHeaderName(displayName);
        parseHeader(displayName);
      }
    }, [displayName, headerName, isEditing]);

    // Initial parsing on component mount
    useEffect(() => {
      parseHeader(headerName);
    }, []);

    // Parse header name into parts
    const parseHeader = useCallback((name: string) => {
      const parts = parseHeaderName(name);
      setPrefix(parts.prefix);
      setSeparator(parts.separator);
      setValue(parts.value);
    }, []);

    // Start editing
    const startEditing = useCallback(() => {
      if (headerEdit) {
        setOriginalHeaderValue(headerName);
        setError(false);
        setIsEditing(true);
      }
    }, [headerEdit, headerName]);

    // Cancel editing
    const cancelEditing = useCallback(() => {
      setHeaderName(originalHeaderValue);
      parseHeader(originalHeaderValue);
      setIsEditing(false);
      setError(false);
    }, [originalHeaderValue, parseHeader]);

    // Handle input change
    const handleInputChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = event.target.value;

        // Apply formatter if provided
        if (headerEditFormatter) {
          newValue = headerEditFormatter(newValue);
        }

        setValue(newValue);

        // Validate the input
        if (headerValidation) {
          setError(!headerValidation(newValue));
        }
      },
      [headerEditFormatter, headerValidation]
    );

    // Apply edit
    const applyEdit = useCallback(() => {
      if (error) {
        return cancelEditing();
      }

      let newValue = value || '0';

      // Apply parser if provided
      if (headerEditParser) {
        newValue = headerEditParser(newValue);
      }

      // Construct new header name
      const newHeaderName =
        prefix && separator ? `${prefix}${separator}${newValue}` : newValue;

      // Only update if changed
      if (newValue && newHeaderName !== originalHeaderValue) {
        setHeaderName(newHeaderName);
        onHeaderValueChanged(field, originalHeaderValue, newHeaderName);
      }

      setIsEditing(false);
      setError(false);
    }, [
      value,
      prefix,
      separator,
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
          alignItems: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#252830',
          padding: '0 8px',
          boxSizing: 'border-box',
          overflow: 'hidden',
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
            alignItems: 'center',
            minWidth: 0,
            gap: '8px',
            flexWrap: 'wrap',
            rowGap: '4px',
          }}
        >
          {/* Header text/input */}
          <div
            style={{
              flex: '0 1 auto',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              minWidth: '30px',
              cursor: headerEdit ? 'text' : 'default',
            }}
            onClick={handleHeaderClick}
          >
            {isEditing ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* For Year-Value format, show prefix and separator as static text */}
                {prefix && separator && (
                  <span style={{ color: 'white', marginRight: '4px' }}>
                    {prefix}
                    {separator}
                  </span>
                )}

                <input
                  type="text"
                  value={value}
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
              </div>
            ) : (
              <div
                style={{
                  display: 'inline-block',
                  color: headerColor,
                  fontWeight: 'normal',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
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
PartialEditHeader.displayName = 'PartialEditHeader';
PartialEditHeader.propTypes = {
  displayName: PropTypes.string.isRequired,
  colId: PropTypes.string.isRequired,
};
export default PartialEditHeader;
