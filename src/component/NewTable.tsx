/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import './NewTable.css';
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule,
  RowAutoHeightModule,
  RowStyleModule,
  CellStyleModule,
  GridReadyEvent,
  FirstDataRenderedEvent,
  ColumnAutoSizeModule,
  ColumnApiModule,
  ColumnMovedEvent,
} from 'ag-grid-community';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import TablePagination from '@mui/material/TablePagination';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { TableProps, filters } from '../interface/common';
import { useTranslation } from 'react-i18next';
import { setSearchFilter } from '../store/Reducers/searchReducer';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import CommonLoader from './common/CommonLoader';
import LinearProgress from '@mui/material/LinearProgress';
import {
  ArrowDownward,
  ArrowUpward,
  PushPin,
  PushPinOutlined,
} from '@mui/icons-material';
import {
  initializeTableVisibility,
  resetTableState,
  setColumnOrder,
  setTableVisibleColumns,
} from '../store/Reducers/tableReducer';

ModuleRegistry.registerModules([
  RowAutoHeightModule,
  NumberEditorModule,
  TextEditorModule,
  ClientSideRowModelModule,
  ValidationModule,
  RowStyleModule,
  CellStyleModule,
  ColumnAutoSizeModule,
  ColumnApiModule,
]);

// Custom Header Component
const CustomHeader = props => {
  const [headerName, setHeaderName] = useState(props.displayName);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { isFixedColumn, isDefaultPinned } = props;
  // Split the header name into year and value parts if it contains " - "
  const [yearPart, valuePart] = headerName.includes(' - ')
    ? headerName.split(' - ')
    : [headerName, ''];

  // Determine if this column is currently sorted based on props
  const isSorted = props.sortBy.includes(props.column.colId);
  const isInitialSorted = props.initialSortBy.includes(props.column.colId);

  // Handle key down to prevent dot input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent dot key (190 or 110) and period key (46)
    if (
      e.key === '.' ||
      e.keyCode === 190 ||
      e.keyCode === 110 ||
      e.keyCode === 46
    ) {
      e.preventDefault();
      return;
    }
  };

  // Handle header name change
  const onHeaderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    // Remove any dots that might have been pasted
    const sanitizedValue = inputValue.replace(/\./g, '');

    // Preserve existing behavior while using sanitized value
    const updatedHeaderName = sanitizedValue
      ? `${yearPart} - ${sanitizedValue}`
      : yearPart;
    setHeaderName(updatedHeaderName);

    // Preserve the existing setColumnHeaderName call
    props.setColumnHeaderName(updatedHeaderName);
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newValue = e.currentTarget.value.trim();
      const updatedHeaderName = newValue
        ? `${yearPart} - ${newValue}`
        : yearPart;

      setIsEditing(false);

      // Update column definition
      props.column.setColDef({
        ...props.column.getColDef(),
        headerName: updatedHeaderName,
        field: updatedHeaderName, // Important to update the field reference
      });

      if (props.onCellValueChanged) {
        props.onCellValueChanged({
          colDef: props.column.getColDef(),
          newValue: updatedHeaderName,
          oldValue: props.displayName,
          api: props.api,
          data: null,
        });
      }

      props.api.refreshHeader();
    }
  };

  // Handle sort button click
  const handleSortClick = event => {
    event.stopPropagation();
    props.handleSortClick(props.column.colId);
  };

  // Handle header click to enable editing
  const handleHeaderClick = () => {
    if (props.headerEdit) {
      setIsEditing(true);
    }
  };

  // Handle input blur to disable editing
  const handleInputBlur = () => {
    setIsEditing(false);
  };

  // Handle column visibility toggle
  const handleVisibilityToggle = event => {
    event.stopPropagation();
    props.toggleColumnVisibility(props.column.colId);
  };

  // Handle pin/unpin click
  const handlePinClick = event => {
    event.stopPropagation();
    const newPinnedState = !props.isPinned;
    props.handlePinClick(props.column.colId, newPinnedState);
  };

  const isGoalColumn = props.displayName === 'Goal';

  const getHeaderColor = () => {
    if (isSorted) {
      return '#1997C6';
    }
    if (!props.sortBy && isInitialSorted) {
      return '#1997C6';
    }
    return 'white';
  };

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
        flexWrap: 'wrap', // Allow wrapping when space is limited
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Combined container for text and icons */}
      <div
        style={{
          display: 'flex',
          flex: '1 1 auto',
          alignItems: 'center',
          minWidth: 0, // Important for text truncation
          gap: '8px',
          flexWrap: 'wrap', // Allow icons to wrap below text
          rowGap: '4px', // Space between lines when wrapped
        }}
      >
        {/* Header text */}
        <div
          style={{
            flex: '0 1 auto',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            minWidth: '30px', // Minimum width before truncation
          }}
          onClick={handleHeaderClick}
        >
          {isEditing ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: 'white', marginRight: '4px' }}>
                {yearPart} -{' '}
              </span>
              <input
                type="text"
                value={valuePart}
                onChange={onHeaderChange}
                onKeyDown={handleKeyDown}
                onKeyPress={handleKeyPress}
                onBlur={handleInputBlur}
                autoFocus
                style={{
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  color: 'white',
                }}
              />
            </div>
          ) : (
            <div
              style={{
                display: 'inline-block',
                cursor: props.headerEdit ? 'pointer' : 'default',
                color: getHeaderColor(),
                fontWeight: 'normal',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {headerName}
            </div>
          )}
        </div>

        {/* Icons container - only shown on hover */}
        {isHovered && (
          <div
            style={{
              display: 'flex',
              flex: '0 0 auto',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {props.sortable && (
              <Tooltip title="Sort" arrow>
                <span onClick={handleSortClick} style={{ cursor: 'pointer' }}>
                  {props.sortOrder === 'asc' ? (
                    <ArrowUpward
                      style={{
                        fontSize: '14px',
                        color: isSorted ? '#1997C6' : 'white',
                      }}
                    />
                  ) : (
                    <ArrowDownward
                      style={{
                        fontSize: '14px',
                        color: isSorted ? '#1997C6' : 'white',
                      }}
                    />
                  )}
                </span>
              </Tooltip>
            )}

            <Tooltip
              title={props.isPinned ? 'Unpin Column' : 'Pin Column'}
              arrow
            >
              {props.isPinned ? (
                <PushPin
                  onClick={handlePinClick}
                  style={{
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: 'white',
                  }}
                />
              ) : (
                <PushPinOutlined
                  onClick={handlePinClick}
                  style={{
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: 'white',
                  }}
                />
              )}
            </Tooltip>
            <Tooltip title="Hide Column" arrow>
              <VisibilityOffIcon
                onClick={handleVisibilityToggle}
                style={{
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: 'white',
                }}
              />
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
};

const NewTable: React.FC<TableProps> = ({
  columns,
  data,
  tableId = '',
  count,
  getData,
  getDataWithoutPagination,
  initialLoading,
  loading,
  message,
  tableLoading,
  initialSortOrder = 'asc',
  initialSortBy = '',
  refreshList = false,
  getTableRowBackgroundColor = (): string => '',
  isWithoutPagination = false,
  id,
  getTextColor,
  onCellValueChanged,
  fixedColumns = ['month'], // Default to 'month' as fixed
  defaultPinnedColumns = [], // Default to empty array
}) => {
  console.log('old tables is loaded');
  const { t } = useTranslation('common');
  const didMount = React.useRef(false);
  const dispatch = useAppDispatch();
  const tableIdentifier = tableId.trim();
  const searchFilter = useAppSelector(state => state.searchFilters);
  const filter = searchFilter[tableIdentifier] as filters;
  const [sortBy, setSortBy] = React.useState<string>(
    filter?.sortBy || initialSortBy
  );
  const [openRowsPerPage, setOpenRowsPerPage] = React.useState<boolean>(false);
  const [sortOrder, setSortOrder] = React.useState<string>(
    filter?.sortOrder || initialSortOrder
  );
  const [page, setPage] = React.useState<number>(filter?.page || 0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(
    filter?.rowsPerPage || 100
  );

  useEffect(() => {
    console.log('table id mount', tableIdentifier);
  }, []);

  React.useEffect(() => {
    console.log('table id mount', tableIdentifier);
    if (count && page) {
      const totalPages = Math.ceil(count / rowsPerPage);
      if (page + 1 > totalPages) {
        setPage(0);
      }
    }
  }, [data, page, count, rowsPerPage]);

  const currentYear = new Date().getFullYear().toString();
  const currentYearField = columns.find(col =>
    col.field.startsWith(currentYear)
  )?.field;
  const [pinnedColumns, setPinnedColumns] = useState<string[]>([
    'month',
    ...(currentYearField ? [currentYearField] : []),
  ]);
  const [anchorEl, setAnchorEl] = useState(null);
  const gridRef = useRef(null);
  const columnApiRef = useRef<ColumnApi | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialSizeRef = useRef(false);
  const visibleColumns = useAppSelector(
    state =>
      state.table.visibleColumns[tableIdentifier] ||
      columns.map(col => col.field) // Fallback to all columns
  );

  const columnOrder = useAppSelector(
    state =>
      state.table.columnOrder[tableIdentifier] || columns.map(col => col.field) // Fallback to original order
  );

  useEffect(() => {
    if (initialLoading) {
      dispatch(resetTableState({ tableId: tableIdentifier }));
    }

    const newColumns = columns.map(col => col.field);
    dispatch(
      initializeTableVisibility({
        tableId: tableIdentifier,
        allColumns: newColumns,
      })
    );
  }, [tableIdentifier, columns, initialLoading, dispatch]);

  useEffect(() => {
    if (gridRef.current?.api && columnOrder) {
      // Apply the saved column order, filtering out hidden columns
      const visibleColumnOrder = columnOrder.filter(colId =>
        visibleColumns.includes(colId)
      );

      gridRef.current.api.setColumnGroupState(
        visibleColumnOrder.map(colId => ({ colId }))
      );
    }
    sizeColumnsToFit();
  }, [columnOrder, visibleColumns, pinnedColumns]);

  // Handle sort click
  const handleSortClick = (column: string) => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(column);
    setSortOrder(newSortOrder);

    // Ensure gridRef.current.api is available
    if (columnApiRef.current && columnApiRef.current.api) {
      columnApiRef.current.api.setSortModel([
        { colId: column, sort: newSortOrder },
      ]);
    }
  };

  // Update table config when sortBy, sortOrder, page, or rowsPerPage changes
  const updateTableConfig = (
    sortBy: string,
    sortOrder: string,
    page: number,
    rowsPerPage: number
  ) => {
    dispatch(
      setSearchFilter({
        tableId,
        filters: { sortBy, sortOrder, page, rowsPerPage },
      })
    );
  };
  // Handle pin/unpin click
  const handlePinClick = (colId: string, isPinned: boolean) => {
    if (colId === 'month') {
      return;
    }

    if (!isPinned) {
      setPinnedColumns(prev => prev.filter(col => col !== colId));
      return;
    }

    if (!gridRef.current?.api || !containerRef.current) {
      return;
    }

    // Get current pinned columns and their total width
    const pinnedColumns = gridRef.current.api
      .getAllDisplayedColumns()
      .filter(col => col.getPinned() === 'left');

    const pinnedWidth = pinnedColumns.reduce(
      (sum, col) => sum + col.getActualWidth(),
      0
    );

    const newCol = gridRef.current.api.getColumn(colId);
    if (!newCol) {
      return;
    }

    const newColWidth = newCol.getActualWidth();
    const containerWidth = containerRef.current.clientWidth;
    const maxAllowedWidth = containerWidth * 0.7;

    if (pinnedWidth + newColWidth > maxAllowedWidth) {
      // If we're over limit, unpin the last pinned column
      const lastPinned = [...pinnedColumns]
        .reverse()
        .find(col => col.getColId() !== 'month');

      if (lastPinned) {
        setPinnedColumns(prev => [
          ...prev.filter(col => col !== lastPinned.getColId()),
          colId, // Add the new pinned column
        ]);
      }
    } else {
      // Normal case - just add to pinned columns
      setPinnedColumns(prev => [...prev, colId]);
    }
  };

  useEffect(() => {
    updateTableConfig(sortBy, sortOrder, page, rowsPerPage);
  }, [sortBy, sortOrder, page, rowsPerPage]);

  // Fetch data when sortBy, sortOrder, page, or rowsPerPage changes
  useEffect(() => {
    if (didMount.current) {
      if (getData) {
        getData({ page: page + 1, rowsPerPage, sortBy, sortOrder });
      }
    } else {
      didMount.current = true;
      if (getData && !data?.length && !initialLoading && !loading) {
        getData({ page: page + 1, rowsPerPage, sortBy, sortOrder });
      }
    }
  }, [page, rowsPerPage, sortBy, sortOrder, refreshList]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Fetch data without pagination when sortBy or sortOrder changes
  useEffect(() => {
    if (getDataWithoutPagination && id) {
      getDataWithoutPagination({ id, sortBy, sortOrder });
    }
  }, [sortBy, sortOrder]);

  // Update sortBy and sortOrder when searchFilter changes
  useEffect(() => {
    updateTableConfig(
      (searchFilter[tableIdentifier] as { sortBy: string })?.sortBy ||
        initialSortBy ||
        '',
      (searchFilter[tableIdentifier] as { sortOrder: string })?.sortOrder ||
        initialSortOrder ||
        '',
      page,
      rowsPerPage
    );
    setSortBy(
      (searchFilter[tableIdentifier] as { sortBy: string })?.sortBy ||
        initialSortBy ||
        ''
    );
    setSortOrder(
      (searchFilter[tableIdentifier] as { sortOrder: string })?.sortOrder ||
        initialSortOrder ||
        ''
    );
  }, [
    (searchFilter[tableIdentifier] as { sortBy: string })?.sortBy,
    (searchFilter[tableIdentifier] as { sortOrder: string })?.sortOrder,
  ]);

  // Toggle column visibility
  const toggleColumnVisibility = useCallback(
    (field: string) => {
      const newVisibleColumns = visibleColumns.includes(field)
        ? visibleColumns.filter(col => col !== field) // Hide column
        : [...visibleColumns, field]; // Show column

      dispatch(
        setTableVisibleColumns({
          tableId: tableIdentifier,
          columns: newVisibleColumns,
        })
      );
    },
    [visibleColumns, tableIdentifier, dispatch]
  );

  const handleResetColumns = () => {
    const defaultOrder = columns.map(col => col.field);
    const newVisibleColumns = defaultOrder.filter(
      col => !fixedColumns.includes(col) || visibleColumns.includes(col)
    );

    dispatch(
      setTableVisibleColumns({
        tableId: tableIdentifier,
        columns: newVisibleColumns,
      })
    );

    dispatch(
      setColumnOrder({
        tableId: tableIdentifier,
        columns: defaultOrder,
      })
    );
    setPinnedColumns(prev => [
      ...fixedColumns, // Keep fixed columns pinned
      ...prev.filter(
        col => !fixedColumns.includes(col) && defaultPinnedColumns.includes(col)
      ), // Reset to default pinned only
    ]);
  };
  // Define column definitions with custom header and sorting disabled
  const wrappedColumnDefs = useMemo(() => {
    // Use the column order from Redux
    const orderedColumns = columnOrder.map(field =>
      columns.find(col => col.field === field)
    );

    // Generate column definitions based on the ordered columns
    const defs = orderedColumns.map(colDef => {
      const isFixed = fixedColumns.includes(colDef?.field);
      const isDefaultPinned = defaultPinnedColumns.includes(colDef?.field);
      return {
        colId: colDef?.field,
        ...colDef,
        sortable: false,
        wrapText: true,
        autoHeight: true,
        width: colDef?.width || 150,
        hide: !visibleColumns.includes(colDef?.field),
        headerComponent: colDef?.headerComponent || CustomHeader,
        headerComponentParams: {
          ...colDef?.headerComponentParams,
          toggleColumnVisibility: toggleColumnVisibility,
          isVisible: visibleColumns.includes(colDef?.field),
          handleSortClick: handleSortClick,
          handlePinClick: handlePinClick,
          isPinned: pinnedColumns.includes(colDef?.field),
          sortable: colDef?.sortable || false,
          sortOrder: sortOrder,
          headerEdit: colDef?.headerEdit || false,
          sortBy: sortBy.split(','),
          initialSortBy: initialSortBy.split(','),
          setColumnHeaderName: name => (colDef.headerName = name),
          onCellValueChanged: onCellValueChanged,
          isFixedColumn: isFixed, // Pass to CustomHeader
          isDefaultPinned,
        },
        pinned: pinnedColumns.includes(colDef?.field) ? 'left' : null,
      };
    });

    return defs;
  }, [
    columns,
    columnOrder,
    visibleColumns,
    sortOrder,
    handlePinClick,
    pinnedColumns,
    onCellValueChanged,
    fixedColumns,
    defaultPinnedColumns,
  ]);

  // Handle menu open/close
  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const hiddenColumnCount = Math.max(columns.length - visibleColumns.length, 0);

  // Overlay template for no rows
  const loaderColor = isWithoutPagination ? 'white' : 'black';

  // No rows overlay template (shown when there's no data)
  const overlayNoRowsTemplate = useMemo(() => {
    return `<div style="color: ${loaderColor};">
      ${message || 'Loading'}
    </div>`;
  }, [message, isWithoutPagination]);

  // Handle sort changes in AG Grid
  const onSortChanged = useCallback(() => {
    const sortModel = gridRef.current?.api.getSortModel();
    if (sortModel && sortModel.length > 0) {
      const { colId, sort } = sortModel[0];
      handleSortClick(colId); // Trigger server-side sorting
    }
  }, [handleSortClick]);

  const onGridReady = (params: GridReadyEvent) => {
    columnApiRef.current = params.api;
  };

  const handleCellValueChanged = async (event: any) => {
    const { data, colDef, newValue, oldValue, api } = event;
    if (newValue === oldValue) {
      return;
    }

    if (onCellValueChanged) {
      try {
        await onCellValueChanged(event);
      } catch (error) {
        // Only attempt rollback if this is a cell edit (with data and colDef)
        if (data && colDef && colDef.field && api) {
          api.applyTransaction({
            update: [{ ...data, [colDef.field]: oldValue }],
          });
        }
      }
    }
  };
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const sizeColumnsToFit = useCallback(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      if (!gridRef.current || !containerRef.current || !columnApiRef.current) {
        return;
      }
      const containerWidth = containerRef.current.clientWidth;
      const allVisibleColumns = columnApiRef.current.getAllDisplayedColumns();
      if (!allVisibleColumns || !allVisibleColumns.length) {
        return;
      }
      const currentTotalWidth = allVisibleColumns.reduce(
        (sum, col) => sum + col.getActualWidth(),
        0
      );
      if (currentTotalWidth >= containerWidth - 5) {
        return;
      }
      const factor = containerWidth / (currentTotalWidth + 0.1);
      const newWidthColumns: { key: string; newWidth: number }[] = [];
      allVisibleColumns.forEach(col => {
        const newWidth = Math.max(
          100,
          Math.round(col.getActualWidth() * factor)
        );
        newWidthColumns.push({ key: col.getColId(), newWidth });
      });
      if (gridRef?.current?.api && newWidthColumns?.length) {
        gridRef.current.api.setColumnWidths(newWidthColumns);
      }
    }, 100);
  }, []);

  const onFirstDataRendered = useCallback(
    (params: FirstDataRenderedEvent) => {
      // Mark that we've done the initial sizing
      initialSizeRef.current = true;
      // For the initial render, auto-size columns based on content
      try {
        if (columnApiRef.current) {
          // Use autoSizeAllColumns to set widths based on content
          if (columnApiRef.current.autoSizeAllColumns) {
            gridRef.current?.api.autoSizeAllColumns();
          } else if (
            columnApiRef.current.getAllColumns &&
            columnApiRef.current.autoSizeColumn
          ) {
            const allColumns = columnApiRef.current.getAllColumns();
            if (allColumns) {
              allColumns.forEach(col => {
                columnApiRef.current.autoSizeColumn(col);
              });
            }
          }
        } else if (params.api) {
          if (params.api.autoSizeAllColumns) {
            params.api.autoSizeAllColumns();
          }
        }
        sizeColumnsToFit();
      } catch (error) {
        if (gridRef.current && gridRef.current.api) {
          gridRef.current.api.sizeColumnsToFit();
        }
      }
    },
    [sizeColumnsToFit]
  );
  const onColumnVisible = useCallback(() => {
    if (initialSizeRef.current) {
      sizeColumnsToFit();
    }
  }, [sizeColumnsToFit]);
  const onGridSizeChanged = () => {
    sizeColumnsToFit();
  };
  const onColumnMoved = useCallback(
    (params: ColumnMovedEvent) => {
      if (params.finished && columnApiRef.current) {
        // Get the current order of displayed columns
        const displayedColumns = columnApiRef.current.getAllDisplayedColumns();

        if (!displayedColumns) {
          return;
        }

        // Map to column IDs to get the current order
        const newColumnOrder = displayedColumns.map(col => col.getColId());
        if (newColumnOrder.length > 0) {
          // Persist the new column order in the Redux store
          dispatch(
            setColumnOrder({
              tableId: tableIdentifier,
              columns: newColumnOrder,
            })
          );
        }
      }
    },
    [dispatch, tableIdentifier]
  );
  return (
    <div>
      <Box display="flex" justifyContent="flex-end" p={1}>
        <Badge
          badgeContent={hiddenColumnCount}
          color="error"
          invisible={hiddenColumnCount === 0}
        >
          <Button
            variant="outlined"
            onClick={handleOpenMenu}
            sx={{
              whiteSpace: 'nowrap',
              '&:disabled': {
                opacity: 0.2,
                cursor: 'not-allowed',
                borderColor: '#1997c6',
                color: '#fff',
              },
            }}
            endIcon={
              hiddenColumnCount > 0 ? <VisibilityOffIcon /> : <VisibilityIcon />
            }
          >
            Manage Columns
          </Button>
        </Badge>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleResetColumns}
          sx={{
            whiteSpace: 'nowrap',
            marginLeft: '5px',
          }}
        >
          Reset
        </Button>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {columns
          .filter(colDef => colDef.field !== 'month')
          .map(colDef => (
            <MenuItem
              sx={{
                color: 'black',
                backgroundColor: 'white',
                ':hover': { backgroundColor: 'white' },
              }}
              key={colDef.field}
              onClick={() => toggleColumnVisibility(colDef.field)}
            >
              <Checkbox checked={visibleColumns.includes(colDef.field)} />
              {colDef.headerName}
            </MenuItem>
          ))}
      </Menu>
      <div
        style={{
          width: '100%',
          // Set container height based on pagination
          height: isWithoutPagination ? undefined : '400px', // Fixed height for paginated
          // Add maxHeight for non-paginated tables
          maxHeight: isWithoutPagination ? '400px' : undefined,
          // Ensure scrolling works
          overflow: 'auto',
          position: 'relative',
        }}
        className={`ag-theme-alpine custom-ag-grid custom-resizer ${isWithoutPagination ? 'dark-theme' : ''}`}
        ref={containerRef}
      >
        <AgGridReact
          domLayout={isWithoutPagination ? 'autoHeight' : 'normal'}
          ref={gridRef} // Pass the ref to AgGridReact
          rowData={data}
          suppressDragLeaveHidesColumns={true}
          loadingOverlayComponent={CommonLoader}
          columnDefs={wrappedColumnDefs}
          overlayNoRowsTemplate={overlayNoRowsTemplate}
          onSortChanged={onSortChanged} // Add the onSortChanged event handler
          onGridReady={onGridReady}
          onCellValueChanged={handleCellValueChanged}
          suppressRowHoverHighlight={true}
          enableCellTextSelection={true}
          onGridSizeChanged={onGridSizeChanged}
          onColumnVisible={onColumnVisible}
          onColumnMoved={onColumnMoved}
          suppressMovableColumns={false}
          onFirstDataRendered={onFirstDataRendered}
          getRowStyle={params => {
            if (getTableRowBackgroundColor) {
              const customBg = getTableRowBackgroundColor(params.data);
              if (customBg) {
                return {
                  backgroundColor: customBg,
                  color: getTextColor,
                };
              }
            }

            // Default row styling based on pagination and odd/even
            const isOddRow = params.node.rowIndex % 2 !== 0;

            if (isWithoutPagination) {
              // Dark theme for unpaginated tables
              return {
                backgroundColor: isOddRow ? '#252830' : '#434857',
                color: getTextColor || 'white',
              };
            } else {
              // Light theme for paginated tables
              return {
                backgroundColor: isOddRow ? '#f0f0f6' : 'white',
                color: getTextColor || 'inherit',
              };
            }
          }}
        />
      </div>
      {loading && !initialLoading && <LinearProgress />}
      {!getDataWithoutPagination && !isWithoutPagination && (
        <TablePagination
          sx={{
            background: 'white',
            border: '1px solid rgba(224, 224, 224, 1)',
            color: 'black',
          }}
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={count}
          slotProps={{
            select: {
              id: 'rows-per-page',
              open: openRowsPerPage,
              onClick: () => setOpenRowsPerPage(!openRowsPerPage),
            },
            actions: {
              nextButton: {
                id: 'next-page',
              },
              previousButton: {
                id: 'back-page',
              },
            },
          }}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </div>
  );
};

export default NewTable;
