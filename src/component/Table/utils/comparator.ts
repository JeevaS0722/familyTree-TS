import { isEqual } from 'lodash';

interface Column {
  headerName: string;
  field: string;
  sortable: boolean;
  width: number;
}

interface SimplifiedColumn {
  headerName: string;
  field: string;
  sortable: boolean;
  width: number;
}

const simplifyColumns = (cols: Column[]): SimplifiedColumn[] =>
  cols.map(
    (col: Column): SimplifiedColumn => ({
      headerName: col.headerName,
      field: col.field,
      sortable: col.sortable,
      width: col.width,
    })
  );

export const arePropsEqual = <T extends Record<string, unknown>>(
  prevProps: T,
  nextProps: T
): boolean => {
  // First, compare the 'columns' prop separately
  if ('columns' in prevProps || 'columns' in nextProps) {
    const prevCols = simplifyColumns((prevProps.columns as Column[]) || []);
    const nextCols = simplifyColumns((nextProps.columns as Column[]) || []);
    if (!isEqual(prevCols, nextCols)) {
      return false;
    }
  }

  // Then compare the rest of the props
  const allKeys = Object.keys(prevProps);
  for (const key of allKeys) {
    // Skip functions to avoid reference issues
    if (
      typeof prevProps[key] === 'function' &&
      typeof nextProps[key] === 'function'
    ) {
      continue;
    }
    // Skip the 'columns' prop as we've already compared it
    if (key === 'columns') {
      continue;
    }
    if (!isEqual(prevProps[key], nextProps[key])) {
      return false;
    }
  }
  return true;
};
