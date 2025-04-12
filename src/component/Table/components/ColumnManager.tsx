// ColumnManager.tsx - Component for managing column visibility
import React, { memo } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Menu from '@mui/material/Menu';
import { TableColumns } from '../../../interface/common';

interface ColumnManagerProps {
  // Menu control props
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;

  // Column props
  columns: TableColumns[];
  visibleColumns: string[];
  fixedColumns: string[];
  toggleColumnVisibility: (colId: string) => void;
}

/**
 * Component for managing column visibility
 */
const ColumnManager: React.FC<ColumnManagerProps> = memo(
  ({
    anchorEl,
    open,
    onClose,
    columns,
    visibleColumns,
    fixedColumns,
    toggleColumnVisibility,
  }) => {
    return (
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        PaperProps={{
          style: {
            maxHeight: 300,
            width: 250,
          },
        }}
      >
        {columns
          .filter(
            colDef => !fixedColumns.includes(colDef.colId || colDef.field)
          )
          .map(colDef => {
            const colId = colDef.colId || colDef.field;
            return (
              <MenuItem
                sx={{
                  color: 'black',
                  backgroundColor: 'white',
                  ':hover': { backgroundColor: '#f5f5f5' },
                }}
                key={colId}
                onClick={() => {
                  toggleColumnVisibility(colId);
                  // Don't close menu so user can toggle multiple columns
                }}
              >
                <Checkbox
                  checked={visibleColumns.includes(colId)}
                  color="primary"
                  size="small"
                />
                <span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {colDef.headerName || colDef.field}
                </span>
              </MenuItem>
            );
          })}

        {fixedColumns.length > 0 && (
          <div
            style={{
              borderTop: '1px solid #e0e0e0',
              paddingTop: 8,
              paddingBottom: 8,
              paddingLeft: 16,
              paddingRight: 16,
              fontSize: '0.875rem',
              color: 'rgba(0, 0, 0, 0.6)',
            }}
          >
            Fixed columns are always visible
          </div>
        )}
      </Menu>
    );
  }
);
ColumnManager.displayName = 'ColumnManager';
export default ColumnManager;
