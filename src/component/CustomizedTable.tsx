import * as React from 'react';
import styled from '@mui/material/styles/styled';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import { TableProps, filters } from '../interface/common';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import CustomizedBackdrop from './common/backdrop';
import { useTranslation } from 'react-i18next';
import { setSearchFilter } from '../store/Reducers/searchReducer';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getTableRowId } from '../utils/GeneralUtil';
import CommonLoader from './common/CommonLoader';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#252830',
    color: theme.palette.common.white,
    padding: '8px 16px',
    border: '1px solid rgba(224, 224, 224, 1)',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '6px 12px',
    border: '1px solid rgba(224, 224, 224, 1)',
  },
  border: '1px solid rgba(224, 224, 224, 1)',
}));

const StyledTableRow = styled(TableRow)({
  color: 'black',
  '&:nth-of-type(odd)': {
    backgroundColor: '#F0F0F6',
    border: '1px solid rgba(224, 224, 224, 1)',
  },
  background: '#FFFFFF',
  '&:last-child td, &:last-child th': {
    border: '1px solid rgba(224, 224, 224, 1)',
  },
});

const CustomizedTable: React.FC<TableProps> = ({
  tableId = '',
  data,
  count,
  columns,
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
}) => {
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
  React.useEffect(() => {
    if (count && page) {
      const totalPages = Math.ceil(count / rowsPerPage);
      if (page + 1 > totalPages) {
        setPage(0);
      }
    }
  }, [data, page, count, rowsPerPage]);

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

  React.useEffect(() => {
    updateTableConfig(sortBy, sortOrder, page, rowsPerPage);
  }, [sortBy, sortOrder, page, rowsPerPage]);

  const handleSortClick = (column: string) => {
    setSortBy(column);
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  React.useEffect(() => {
    if (didMount.current) {
      // Call getData only when refreshList or filter changes
      if (getData) {
        getData({ page: page + 1, rowsPerPage, sortBy, sortOrder });
      }
    } else {
      // Skip the first effect call on mount
      didMount.current = true;
      if (getData && !data?.length && !initialLoading && !loading) {
        getData({ page: page + 1, rowsPerPage, sortBy, sortOrder });
      }
    }
  }, [page, rowsPerPage, sortBy, sortOrder, refreshList]);

  React.useEffect(() => {
    if (getDataWithoutPagination && id) {
      getDataWithoutPagination({ id, sortBy, sortOrder });
    }
  }, [sortBy, sortOrder]);

  React.useEffect(() => {
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

  return tableLoading ? (
    <CustomizedBackdrop
      isLoading={tableLoading}
      title={t('loading')}
    ></CustomizedBackdrop>
  ) : (
    <Paper
      sx={{
        width: '100%',
        mb: 1,
        border: 1,
        borderColor: 'white',
        borderRadius: '1px',
      }}
    >
      <TableContainer
        sx={{
          maxHeight: 'calc(100vh - 310px)',
          minHeight: initialLoading ? '200px' : 'auto',
          height: 'auto',
          backgroundColor: 'white',
          overflow: 'auto',
        }}
      >
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          stickyHeader
          id={tableIdentifier}
        >
          <TableHead>
            <TableRow>
              {columns.map((column, index) => {
                const sortByIndex = sortBy
                  .split(',')
                  .indexOf(column.accessor.toString());
                let isSortDesc = false;
                if (sortByIndex !== -1) {
                  isSortDesc = sortOrder.split(',')[sortByIndex] === 'desc';
                }
                return (
                  <StyledTableCell key={index} align="left">
                    {column.sortable ? (
                      <TableSortLabel
                        id={column.accessor.toString()}
                        active={sortByIndex !== -1}
                        direction={isSortDesc ? 'desc' : 'asc'}
                        sx={{
                          fontWeight: '300',
                          fontSize: '0.9rem',
                          '&:hover': {
                            color: 'white',
                          },
                          '&:focus': {
                            color: '#1997c6',
                          },
                        }}
                        onClick={() =>
                          handleSortClick(column.accessor.toString())
                        }
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </StyledTableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {initialLoading ? (
              <StyledTableRow>
                <StyledTableCell colSpan={columns.length}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      height: '400px',
                      color: 'black',
                      width: { xs: '50%', sm: '100%' },
                    }}
                  >
                    <CommonLoader color="black" sx={{ fontSize: '16px' }} />
                  </Box>
                </StyledTableCell>
              </StyledTableRow>
            ) : count === 0 ? (
              <StyledTableRow>
                <StyledTableCell
                  colSpan={12}
                  component="th"
                  scope="row"
                  sx={{ color: 'black', textAlign: 'center' }}
                >
                  {message}
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              <>
                {data.map((row, idx) => {
                  const backgroundColor = `${getTableRowBackgroundColor(row)}`;
                  const rowId = getTableRowId(row, tableIdentifier);
                  return (
                    <StyledTableRow
                      key={idx}
                      id={`${rowId || idx}`}
                      sx={{
                        backgroundColor:
                          backgroundColor && `${backgroundColor} !important`,
                      }}
                    >
                      {columns.map((column, index) => (
                        <StyledTableCell
                          id={column.accessor.toString() + idx}
                          key={index}
                          component="th"
                          scope="row"
                          sx={{
                            color: getTextColor ? getTextColor : 'black',
                            minWidth: '130px',
                          }}
                        >
                          {column.format
                            ? column.format(row)
                            : row[column.accessor]}
                        </StyledTableCell>
                      ))}
                    </StyledTableRow>
                  );
                })}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
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
    </Paper>
  );
};

export default CustomizedTable;
