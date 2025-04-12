/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Table.tsx - Main flexible table component
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import './TableStyles.css';
import type {
  GridReadyEvent,
  GridApi,
  ColumnMovedEvent,
  GetRowIdParams,
  ColumnResizedEvent,
} from 'ag-grid-community';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  initializeTableVisibility,
  resetTableState,
  setColumnOrder,
  setTableVisibleColumns,
} from '../../store/Reducers/tableReducer';
import { setSearchFilter } from '../../store/Reducers/searchReducer';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import TablePagination from '@mui/material/TablePagination';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LinearProgress from '@mui/material/LinearProgress';
// Import components
import ColumnManager from './components/ColumnManager';
import PartialEditHeader from './components/PartialEditHeader';
import FullEditHeader from './components/FullEditHeader';

// Import utils
import { isPartialEditFormat } from './utils/headerUtils';
import { arePropsEqual } from './utils/comparator';
import { TableProps } from '../../interface/common';

ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * Flexible Table Component that adapts to different use cases
 * @param props Table component props
 */
const Table = (props: TableProps) => {
  const {
    columns,
    data = [],
    tableId = '',
    count = 0,
    getData,
    getDataWithoutPagination,
    initialLoading = false,
    loading = false,
    message,
    tableLoading = false,
    initialSortOrder = 'asc',
    initialSortBy = '',
    refreshList = false,
    getTableRowBackgroundColor = () => '',
    isWithoutPagination = false,
    id,
    getTextColor,
    onCellValueChanged,
    onHeaderValueChanged,
    fixedColumns = [],
    defaultPinnedColumns = [],
    initialPage = 0,
    initialRowsPerPage = 100,
    maxPinnedColumnsPercentage = 70,
    headerEditMode = 'full',
    headerEditFormatter,
    headerEditParser,
    headerValidation,
    height = '',
    minHeight = '',
    maxHeight = '',
    theme = isWithoutPagination ? 'dark' : 'light',
    agTheme = isWithoutPagination ? 'dark' : 'light',
    key = `${tableId}`,
  } = props;

  const dispatch = useAppDispatch();
  const tableIdentifier = tableId.trim();
  const didMount = useRef(false);
  const gridRef = useRef<GridApi>(null);
  const columnApiRef = useRef({});
  const containerRef = useRef<HTMLDivElement>(null);
  const initialSizeRef = useRef(false);
  const lastDataRef = useRef<any[]>(data);
  const containerWPrevWidth = useRef<number>(0);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  // Get state from Redux
  const searchFilter = useAppSelector(state => state.searchFilters);
  const filter = searchFilter[tableIdentifier];
  const visibleColumns = useAppSelector(
    state =>
      state.table.visibleColumns[tableIdentifier] ||
      columns.map(col => col.colId || col.field)
  );
  const columnOrder = useAppSelector(
    state =>
      state.table.columnOrder[tableIdentifier] ||
      columns.map(col => col.colId || col.field)
  );

  // State for sorting and pagination
  const [sortBy, setSortBy] = useState<string>(
    filter?.sortBy || initialSortBy || ''
  );
  const [sortOrder, setSortOrder] = useState<string>(
    filter?.sortOrder || initialSortOrder || 'asc'
  );
  const [page, setPage] = useState<number>(filter?.page || initialPage);
  const [rowsPerPage, setRowsPerPage] = useState<number>(
    filter?.rowsPerPage || initialRowsPerPage
  );
  const [openRowsPerPage, setOpenRowsPerPage] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // State for pinned columns
  const [pinnedColumns, setPinnedColumns] = useState<string[]>([
    ...fixedColumns,
    ...defaultPinnedColumns,
  ]);

  const DEFAULT_ROW_HEIGHT = 42;
  const DEFAULT_HEADER_HEIGHT = 49;

  const computedHeight = isWithoutPagination
    ? Math.min(
        DEFAULT_HEADER_HEIGHT + data.length * DEFAULT_ROW_HEIGHT,
        height || 400 // maximum height
      )
    : height || 400;

  // Process columns to ensure stable colId
  const processedColumns = useMemo(() => {
    return columns.map(col => ({
      ...col,
      colId: col.colId || col.field,
      // Ensure each column has a headerName
      headerName: col.headerName || col.field,
    }));
  }, [columns]);

  // Initialize table visibility on mount
  useEffect(() => {
    if (initialLoading) {
      dispatch(resetTableState({ tableId: tableIdentifier }));
    }

    const newColumns = processedColumns.map(col => col.colId || col.field);
    dispatch(
      initializeTableVisibility({
        tableId: tableIdentifier,
        allColumns: newColumns,
      })
    );
  }, [tableIdentifier, processedColumns, initialLoading, dispatch]);

  const getVerticalScrollWidth = () => {
    const viewport = containerRef?.current?.querySelector(
      '.ag-body-vertical-scroll'
    );
    if (viewport?.scrollWidth) {
      return viewport?.scrollWidth || 0;
    }
    return 0;
  };

  const getHorizontalScrollHeight = () => {
    const viewport = containerRef?.current?.querySelector(
      '.ag-body-horizontal-scroll'
    );
    if (viewport?.scrollHeight) {
      return viewport?.scrollHeight || 0;
    }
    return 0;
  };

  const setAllRowHeights = useCallback(() => {
    setTimeout(() => {
      if (!gridRef?.current?.api || !containerRef?.current) {
        return 0;
      }
      if (height) {
        containerRef.current.style.height = `${height}px`;
        return 0;
      }

      const rowCount = gridRef?.current?.api?.getDisplayedRowCount();
      let totalHeight = 0;
      if (rowCount) {
        for (let i = 0; i < rowCount; i++) {
          const rowNode = gridRef?.current?.api?.getDisplayedRowAtIndex(i);
          if (rowNode) {
            totalHeight += rowNode.rowHeight;
          }
        }
        const scrollHeight = getHorizontalScrollHeight();
        if (
          !height &&
          count &&
          !totalHeight &&
          containerRef?.current?.style?.height
        ) {
          containerRef.current.style.height = `${computedHeight + scrollHeight + 2}px`;
        } else if (!height && containerRef?.current?.style?.height) {
          const reColHeight =
            totalHeight + DEFAULT_HEADER_HEIGHT + scrollHeight + 2;
          containerRef.current.style.height = `${reColHeight}px`;
        }
      }
    }, 200);
  }, [
    gridRef,
    containerRef,
    count,
    computedHeight,
    height,
    getHorizontalScrollHeight,
  ]);

  const sizeColumnsToFit = useCallback(
    ({ reset = false, hide = false, gridSizeChangeWidth = 0 }) => {
      setAllRowHeights();
      if (!gridRef.current?.api || !containerRef.current || !count) {
        return;
      }
      try {
        const containerWidth = containerRef.current.clientWidth;
        // Avoid recalculating if container width hasn’t changed (unless reset is forced)
        if (
          !reset &&
          !hide &&
          containerWidth &&
          containerWidth === containerWPrevWidth.current
        ) {
          return;
        }

        const allVisibleColumns =
          columnApiRef?.current?.getAllDisplayedColumns();
        if (!allVisibleColumns || allVisibleColumns.length === 0) {
          return;
        }

        // Get current total columns width from AG Grid
        const totalColumnsWidth = allVisibleColumns.reduce(
          (sum: number, col: any) => sum + col.getActualWidth(),
          0
        );
        const gridContainerWidth =
          containerRef?.current?.querySelector('.ag-root-wrapper-body')
            ?.clientWidth || 0;
        // If hide is true and current columns already exceed container width, do nothing.
        // Also, if reset is false and total actual widths fill the container, do nothing.
        if (
          (hide || !reset) &&
          totalColumnsWidth >= containerWidth &&
          !(
            (gridSizeChangeWidth &&
              gridSizeChangeWidth < containerWPrevWidth.current - 50) ||
            (gridContainerWidth &&
              gridContainerWidth < containerWPrevWidth.current - 50)
          )
        ) {
          return;
        }

        // Create a canvas element for text measurement (works in Safari and Chrome)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return;
        }

        // Retrieve computed font styles from containerRef using CSS variables or fallback values
        const computedStyle = getComputedStyle(containerRef.current);
        const fontSize =
          computedStyle.getPropertyValue('--ag-font-size')?.trim() ||
          computedStyle.fontSize ||
          '0.9rem';
        const fontFamily =
          computedStyle
            .getPropertyValue('--ag-inherited-font-family')
            ?.trim() ||
          computedStyle.fontFamily ||
          `"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu`;

        ctx.font = `${fontSize} ${fontFamily}`;

        // Calculate desired width for each column based on header text plus 10px padding.
        // Use different clamping when reset is true.
        const computedWidths = allVisibleColumns.map((col: any) => {
          const headerName = col.getColDef().headerName || col.getColId();
          const textWidth = ctx.measureText(headerName).width;
          const desiredWidth = Math.ceil(textWidth);
          if (reset) {
            // When reset is true, enforce a min of 140px and max of 180px.
            return Math.min(180, Math.max(140, desiredWidth));
          } else {
            // Otherwise, enforce a min of 120px and a max of 180px.
            return Math.min(180, Math.max(120, desiredWidth));
          }
        });

        // Sum computed widths
        const totalComputedWidth = computedWidths.reduce(
          (sum, width) => sum + width,
          0
        );

        let finalWidths: number[];
        const verticalScrollWidth = getVerticalScrollWidth();
        if (reset && totalColumnsWidth > containerWidth) {
          // When reset is true and current total widths exceed the container,
          // reduce each column proportionally while keeping each width ≥ 140px.
          const excessSpace = totalColumnsWidth - containerWidth;
          const excessPerColumn = Math.floor(
            excessSpace / computedWidths.length
          );
          finalWidths = computedWidths.map(width =>
            Math.max(width - excessPerColumn, 140)
          );
          // Check if total is still too wide; subtract a little more if needed.
          let totalFinalWidth = finalWidths.reduce((sum, w) => sum + w, 0);
          if (totalFinalWidth > containerWidth) {
            const additionalExcess =
              totalFinalWidth - containerWidth - verticalScrollWidth;
            const additionalExcessPerColumn = Math.floor(
              additionalExcess / finalWidths.length
            );
            finalWidths = finalWidths.map(width =>
              Math.max(width - additionalExcessPerColumn, 140)
            );
          }
          // Ensure values are clamped between 140 and 180.
          finalWidths = finalWidths.map(width =>
            Math.min(Math.max(width, 140), 180)
          );
          // If after reduction the sum is less than container width, distribute extra space.
          totalFinalWidth = finalWidths.reduce((sum, w) => sum + w, 0);
          if (totalFinalWidth < containerWidth) {
            const extraSpace =
              containerWidth - totalFinalWidth - verticalScrollWidth;
            const extraPerColumn = Math.floor(extraSpace / finalWidths.length);
            finalWidths = finalWidths.map(width => width + extraPerColumn);
          }
        } else {
          // When computed total is less than container width, distribute extra space equally.
          if (totalComputedWidth < containerWidth) {
            const extraSpace =
              containerWidth - totalComputedWidth - verticalScrollWidth;
            const extraPerColumn = Math.floor(
              extraSpace / computedWidths.length
            );
            finalWidths = computedWidths.map(width => width + extraPerColumn);
          } else {
            finalWidths = computedWidths;
          }
        }

        // Build an array of column width objects for AG Grid's API.
        const columnWidths = allVisibleColumns.map(
          (col: any, index: number) => ({
            key: col.getColId(),
            newWidth: finalWidths[index],
          })
        );
        containerWPrevWidth.current = containerWidth;
        // Apply the new widths using AG Grid's API.
        if (gridRef.current?.api?.setColumnWidths) {
          gridRef.current.api.setColumnWidths(columnWidths);
          setAllRowHeights();
        } else {
          // Fallback for older versions
          columnWidths.forEach(
            ({ key, newWidth }: { key: string; newWidth: number }) => {
              const column = gridRef.current?.api.getColumn(key);
              if (column) {
                column.setWidth(newWidth);
              }
            }
          );
          setAllRowHeights();
        }
      } catch (error) {
        console.error('Error in sizeColumnsToFit:', error);
        // Fallback: use AG Grid's basic sizeColumnsToFit method if available
        if (gridRef.current?.api?.sizeColumnsToFit) {
          gridRef.current.api.sizeColumnsToFit();
        }
      }
    },
    [gridRef, containerRef, count, setAllRowHeights, containerWPrevWidth]
  );

  // Apply column order and visibility
  useEffect(() => {
    if (gridRef.current?.api) {
      try {
        // Get only the visible columns from columnOrder
        const visibleColumnOrder = columnOrder.filter(colId =>
          visibleColumns.includes(colId)
        );

        // Create a sorted order:
        // 1. fixedColumns (in their defined order)
        // 2. defaultPinnedColumns (that are not in fixedColumns)
        // 3. the rest of the visible columns
        const sortedVisibleColumnOrder = [
          ...fixedColumns.filter(id => visibleColumnOrder.includes(id)),
          ...defaultPinnedColumns.filter(
            id => visibleColumnOrder.includes(id) && !fixedColumns.includes(id)
          ),
          ...visibleColumnOrder.filter(
            id =>
              !fixedColumns.includes(id) && !defaultPinnedColumns.includes(id)
          ),
        ];

        // Build the column state using the sorted order.
        // Mark the column as pinned ('left') if it belongs to fixedColumns or defaultPinnedColumns.
        const columnState = sortedVisibleColumnOrder.map(colId => ({
          colId,
          hide: !visibleColumns.includes(colId),
          pinned:
            fixedColumns.includes(colId) || defaultPinnedColumns.includes(colId)
              ? 'left'
              : null,
        }));
        gridRef.current.api.setColumnGroupState(
          columnState.map(colId => ({ colId }))
        );
      } catch (error) {
        console.error('Error applying column state:', error);
      }
      setAllRowHeights();
    }
  }, [
    columnOrder,
    visibleColumns,
    pinnedColumns,
    data,
    defaultPinnedColumns,
    fixedColumns,
    setAllRowHeights,
  ]);

  // Update persistent settings
  const updateTableConfig = useCallback(
    (sortBy: string, sortOrder: string, page: number, rowsPerPage: number) => {
      dispatch(
        setSearchFilter({
          tableId: tableIdentifier,
          filters: { sortBy, sortOrder, page, rowsPerPage },
        })
      );
    },
    [dispatch, tableIdentifier]
  );

  useEffect(() => {
    updateTableConfig(sortBy, sortOrder, page, rowsPerPage);
  }, [sortBy, sortOrder, page, rowsPerPage, updateTableConfig]);

  // Effects for pagination control
  useEffect(() => {
    if (count && page) {
      const totalPages = Math.ceil(count / rowsPerPage);
      if (page + 1 > totalPages) {
        setPage(0);
      }
    }
  }, [count, page, rowsPerPage]);

  useEffect(() => {
    if (count && !initialSizeRef?.current) {
      setTimeout(() => {
        setPinnedColumns([
          ...defaultPinnedColumns.filter(col => !fixedColumns.includes(col)),
          ...fixedColumns,
        ]);
        sizeColumnsToFit({ reset: true });
      }, 700);
    }
  }, [count]);

  useEffect(() => {
    if (count && tableIdentifier) {
      setTimeout(() => {
        setPinnedColumns([
          ...defaultPinnedColumns.filter(col => !fixedColumns.includes(col)),
          ...fixedColumns,
        ]);
        sizeColumnsToFit({ reset: true });
      }, 400);
    }
  }, [count, tableIdentifier]);

  // Fetch data when filters change
  useEffect(() => {
    const dataChanged = lastDataRef.current !== data;
    lastDataRef.current = data;

    if (didMount.current) {
      if (getData) {
        getData({ page: page + 1, rowsPerPage, sortBy, sortOrder });
      }
    } else {
      didMount.current = true;
      if (
        getData &&
        (!data?.length || dataChanged) &&
        !initialLoading &&
        !loading
      ) {
        getData({ page: page + 1, rowsPerPage, sortBy, sortOrder });
      }
    }
  }, [page, rowsPerPage, sortBy, sortOrder, refreshList]);

  // Fetch data without pagination
  useEffect(() => {
    if (getDataWithoutPagination) {
      getDataWithoutPagination({ id, sortBy, sortOrder });
    }
  }, [sortBy, sortOrder, id]);

  // Handle sort click - FIXED IMPLEMENTATION FROM NewTable.tsx
  const handleSortClick = useCallback(
    (column: string) => {
      const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      setSortBy(column);
      setSortOrder(newSortOrder);

      // Apply sort to the grid
      if (columnApiRef?.current?.setSortModel) {
        columnApiRef?.current?.setSortModel([
          { colId: column, sort: newSortOrder },
        ]);
      }
    },
    [sortOrder]
  );

  // Handle pin click - FIXED IMPLEMENTATION FROM NewTable.tsx
  const handlePinClick = useCallback(
    (colId: string, isPinned: boolean) => {
      // Don't allow unpinning fixed columns
      if (fixedColumns.includes(colId) && !isPinned) {
        return;
      }

      if (!isPinned) {
        setPinnedColumns(prev => prev.filter(col => col !== colId));
        return;
      }

      // If maxPinnedColumnsPercentage is 0, don't limit pinning
      if (maxPinnedColumnsPercentage === 0) {
        setPinnedColumns(prev => [...prev, colId]);
        return;
      }

      if (!gridRef.current?.api || !containerRef.current) {
        return;
      }

      // Calculate pinned width
      const pinnedCols = gridRef.current.api
        .getAllDisplayedColumns()
        .filter((col: any) => col.getPinned() === 'left');

      const pinnedWidth = pinnedCols.reduce(
        (sum: number, col: any) => sum + col.getActualWidth(),
        0
      );

      const newCol = gridRef.current.api.getColumn(colId);
      if (!newCol) {
        return;
      }

      const newColWidth = newCol.getActualWidth();
      const containerWidth = containerRef.current.clientWidth;
      const maxAllowedWidth =
        containerWidth * (maxPinnedColumnsPercentage / 100);

      if (pinnedWidth + newColWidth > maxAllowedWidth) {
        // If over limit, unpin the last non-fixed column
        const lastPinned = [...pinnedCols]
          .reverse()
          .find((col: any) => !fixedColumns.includes(col.getColId()));

        if (lastPinned) {
          setPinnedColumns(prev => [
            ...prev.filter(col => col !== lastPinned.getColId()),
            colId, // Add the new pinned column
          ]);
        }
      } else {
        // Just add to pinned columns
        setPinnedColumns(prev => [...prev, colId]);
      }
    },
    [fixedColumns, maxPinnedColumnsPercentage, containerRef]
  );

  // Toggle column visibility
  const toggleColumnVisibility = useCallback(
    (field: string) => {
      // Never hide fixed columns
      if (fixedColumns.includes(field)) {
        return;
      }

      const newVisibleColumns = visibleColumns.includes(field)
        ? visibleColumns.filter(col => col !== field) // Hide column
        : [...visibleColumns, field]; // Show column

      dispatch(
        setTableVisibleColumns({
          tableId: tableIdentifier,
          columns: newVisibleColumns,
        })
      );
      sizeColumnsToFit({ hide: true });
    },
    [visibleColumns, tableIdentifier, dispatch, fixedColumns]
  );

  // Reset columns to default state
  const handleResetColumns = useCallback(() => {
    const defaultOrder = processedColumns.map(col => col.colId || col.field);

    // Reset visible columns to show all columns
    dispatch(
      setTableVisibleColumns({
        tableId: tableIdentifier,
        columns: defaultOrder,
      })
    );

    // Reset column order to original order
    dispatch(
      setColumnOrder({
        tableId: tableIdentifier,
        columns: defaultOrder,
      })
    );

    // Reset pinned columns to initial state
    setPinnedColumns([
      ...fixedColumns,
      ...defaultPinnedColumns.filter(col => !fixedColumns.includes(col)),
    ]);
    if (getData) {
      getData({ page: page + 1, rowsPerPage, sortBy, sortOrder });
    } else if (getDataWithoutPagination) {
      getDataWithoutPagination({ id, sortBy, sortOrder });
    }
    setTimeout(() => {
      sizeColumnsToFit({ reset: true });
    }, 500);
  }, [
    processedColumns,
    dispatch,
    tableIdentifier,
    fixedColumns,
    defaultPinnedColumns,
    getData,
    getDataWithoutPagination,
    page,
    rowsPerPage,
    sortBy,
    sortOrder,
    id,
    sizeColumnsToFit,
  ]);

  // Dynamic header value change handler
  const handleHeaderValueChanged = useCallback(
    (params: {
      fileId: string;
      colId: string;
      oldValue: string;
      newValue: string;
      colDef: any;
    }) => {
      if (!gridRef.current?.api) {
        return;
      }

      try {
        // First update the AG Grid column definition
        const column = gridRef.current.api.getColumn(params.colId);
        if (!column) {
          return;
        }

        // Apply new header name
        const colDef = column.getColDef();
        column.setColDef({
          ...colDef,
          headerName: params.newValue,
        });

        gridRef.current.api.refreshHeader();

        // Then call the external handler if provided
        if (onHeaderValueChanged) {
          onHeaderValueChanged({ ...params, visibleColumns, columnOrder });
        }
      } catch (error) {
        console.error('Error updating header:', error);
      }
    },
    [onHeaderValueChanged, visibleColumns, columnOrder]
  );

  // Cell value change handler
  const handleCellValueChanged = useCallback(
    async (event: any) => {
      const { data, colDef, newValue, oldValue, api } = event;

      if (newValue === oldValue) {
        return;
      }

      if (onCellValueChanged) {
        try {
          await onCellValueChanged(event);
        } catch (error) {
          // Rollback on error
          if (data && colDef && colDef.field && api) {
            api.applyTransaction({
              update: [{ ...data, [colDef.field]: oldValue }],
            });
          }
          console.error('Error in handleCellValueChanged:', error);
        }
      }
    },
    [onCellValueChanged]
  );

  // Menu handling
  const handleOpenMenu = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );

  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  // Pagination handlers
  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    []
  );

  // AG Grid event handlers
  const onGridReady = useCallback(
    (params: GridReadyEvent) => {
      columnApiRef.current = params.api;
      // Apply sort if needed
      if (sortBy && sortOrder && params.api?.setSortModel) {
        params.api?.setSortModel([{ colId: sortBy, sort: sortOrder }]);
      }

      return () => {
        // Cleanup on unmount
        if (gridRef.current?.api) {
          gridRef.current.api.destroy();
          gridRef.current.api = null;
        }
      };
    },
    [sortBy, sortOrder]
  );

  const onFirstDataRendered = () => {
    initialSizeRef.current = true;
    setAllRowHeights();
  };

  const onColumnVisible = () => {
    if (initialSizeRef.current) {
      sizeColumnsToFit({ hide: true });
    }
  };

  const onGridSizeChanged = params => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      sizeColumnsToFit({ gridSizeChangeWidth: params?.clientWidth || 0 });
    }, 250);
  };

  const onColumnMoved = (params: ColumnMovedEvent) => {
    if (params.finished && params.api) {
      setAllRowHeights();
      // Update column order in Redux
      const displayedColumns = params.api.getAllDisplayedColumns();

      if (displayedColumns) {
        const newColumnOrder = displayedColumns.map(col => col.getColId());

        if (newColumnOrder.length > 0) {
          dispatch(
            setColumnOrder({
              tableId: tableIdentifier,
              columns: newColumnOrder,
            })
          );
        }
      }
    }
  };

  // Column definitions
  const wrappedColumnDefs = useMemo(() => {
    // Use the column order from Redux
    const orderedColumns = columnOrder
      .map(colId =>
        processedColumns.find(col => (col.colId || col.field) === colId)
      )
      .filter(Boolean);
    // Generate column definitions based on the ordered columns
    return orderedColumns.map(colDef => {
      const colId = colDef.colId || colDef.field;
      const isFixed = fixedColumns.includes(colId);
      const isDefaultPinned = defaultPinnedColumns.includes(colId);

      // Determine which header component to use based on the mode and column settings
      let HeaderComponent;
      const colHeaderEditMode = colDef.headerEditMode || headerEditMode;

      // Check if this is a year-value format header (e.g., "2023 - Goal")
      const hasYearValueFormat = isPartialEditFormat(colDef.headerName || '');

      if (colDef.headerComponent) {
        // Use custom header component if provided
        HeaderComponent = colDef.headerComponent;
      } else if (
        colHeaderEditMode === 'partial' ||
        (colHeaderEditMode !== 'full' && hasYearValueFormat)
      ) {
        // Use PartialEditHeader for partial editing (mainly for year-value format)
        HeaderComponent = PartialEditHeader;
      } else if (colHeaderEditMode === 'custom') {
        // Use FullEditHeader with custom formatter/parser for custom mode
        HeaderComponent = FullEditHeader;
      } else {
        // Default to FullEditHeader for normal editing
        HeaderComponent = FullEditHeader;
      }

      return {
        ...colDef,
        colId,
        sortable: false,
        wrapText: true,
        autoHeight: true,
        autoHeaderHeight: true,
        wrapHeaderText: true,
        // initialWidth: 120,
        width: initialSizeRef?.current ? undefined : 400,
        hide: !visibleColumns.includes(colId),
        headerComponent: HeaderComponent,
        headerComponentParams: {
          ...colDef.headerComponentParams,
          displayName: colDef.headerName || colDef.field,
          colId,
          field: colDef.field,
          toggleColumnVisibility,
          isVisible: visibleColumns.includes(colId),
          handleSortClick,
          handlePinClick,
          isPinned: pinnedColumns.includes(colId),
          sortable: colDef.sortable ?? false,
          sortOrder,
          headerEdit: colDef.headerEdit ?? false,
          sortBy: sortBy.split(','),
          initialSortBy: initialSortBy.split(','),
          onHeaderValueChanged: (fileId, oldValue, newValue) => {
            handleHeaderValueChanged({
              fileId,
              colId,
              oldValue,
              newValue,
              colDef,
            });
          },
          // Pass formatter/parser if provided
          headerEditFormatter:
            colDef.headerEditFormatter || headerEditFormatter,
          headerEditParser: colDef.headerEditParser || headerEditParser,
          headerValidation: colDef.headerValidation || headerValidation,
          isFixedColumn: isFixed,
          isDefaultPinned,
        },
        pinned: pinnedColumns.includes(colId) ? 'left' : null,
      };
    });
  }, [
    processedColumns,
    columnOrder,
    visibleColumns,
    sortOrder,
    sortBy,
    initialSortBy,
    fixedColumns,
    defaultPinnedColumns,
    handleSortClick,
    toggleColumnVisibility,
    handlePinClick,
    handleHeaderValueChanged,
    pinnedColumns,
    headerEditMode,
    headerEditFormatter,
    headerEditParser,
    headerValidation,
  ]);

  // No rows overlay template
  const loaderColor = isWithoutPagination ? 'white' : 'black';
  const overlayNoRowsTemplate = useMemo(() => {
    return `<div style="color: ${loaderColor};">
      ${message || 'Loading'}
    </div>`;
  }, [message, loaderColor]);

  // Get row style callback
  const getRowStyle = useCallback(
    (params: any) => {
      if (getTableRowBackgroundColor) {
        const customBg = getTableRowBackgroundColor(params.data);
        if (customBg) {
          return {
            backgroundColor: customBg,
            color: getTextColor,
          };
        }
      }

      // Default row styling
      const isOddRow = params.node.rowIndex % 2 !== 0;
      if (theme === 'dark') {
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
    },
    [getTableRowBackgroundColor, getTextColor, isWithoutPagination]
  );

  const getRowId = useCallback((params: GetRowIdParams) => {
    const { data } = params;
    if (!data) {
      // If data is null or undefined, return a random number as a string
      return String(Math.floor(Math.random() * 1000000));
    }
    if (data?.id) {
      return String(data?.id);
    }
    const values = Object.keys(data)
      .sort()
      .map(key => data[key]);
    return values.join('-');
  }, []);

  const onColumnResized = (params: ColumnResizedEvent) => {
    if (params?.finished) {
      setAllRowHeights();
    }
  };

  return (
    <div>
      {/* Column management controls */}
      <Box display="flex" justifyContent="flex-end" p={1}>
        <Badge
          badgeContent={Math.max(
            processedColumns.length - visibleColumns.length,
            0
          )}
          color="error"
          invisible={processedColumns.length - visibleColumns.length === 0}
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
              processedColumns.length - visibleColumns.length > 0 ? (
                <VisibilityOffIcon />
              ) : (
                <VisibilityIcon />
              )
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

      {/* Column visibility menu */}
      <ColumnManager
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        columns={processedColumns}
        visibleColumns={visibleColumns}
        fixedColumns={fixedColumns}
        toggleColumnVisibility={toggleColumnVisibility}
      />

      {/* AG Grid container */}
      <div
        style={{
          width: '100%',
          height: height ? height : `${computedHeight + 10}px`,
          maxHeight: height || maxHeight || 'calc(100vh - 320px)',
          minHeight: minHeight || (initialLoading ? '200px' : 'auto'),
          overflow: 'auto',
        }}
        className={`ag-theme-alpine custom-ag-grid custom-resizer ${agTheme}-theme`}
        ref={containerRef}
      >
        <AgGridReact
          gridId={tableIdentifier}
          key={key}
          domLayout="normal"
          rowHeight={DEFAULT_ROW_HEIGHT}
          ref={gridRef}
          rowData={data}
          columnDefs={wrappedColumnDefs}
          overlayNoRowsTemplate={overlayNoRowsTemplate}
          onGridReady={onGridReady}
          onCellValueChanged={handleCellValueChanged}
          suppressRowHoverHighlight={true}
          enableCellTextSelection={true}
          onGridSizeChanged={onGridSizeChanged}
          onColumnVisible={onColumnVisible}
          onColumnMoved={onColumnMoved}
          suppressMovableColumns={false}
          suppressDragLeaveHidesColumns={true}
          onFirstDataRendered={onFirstDataRendered}
          getRowStyle={getRowStyle}
          getRowId={getRowId}
          onColumnResized={onColumnResized}
        />
      </div>

      {/* Loading indicator */}
      {loading && !initialLoading && <LinearProgress />}

      {/* Pagination controls */}
      {!isWithoutPagination && (
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

Table.displayName = 'Table';
export default React.memo(Table, arePropsEqual);
