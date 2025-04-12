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
import { TableProps } from '../interface/common';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import CustomizedBackdrop from './common/backdrop';
import { useTranslation } from 'react-i18next';
import CommonLoader from './common/CommonLoader';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#252830',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  borderRight: '1px solid rgba(224, 224, 224, 1)',
}));

const StyledTableRow = styled(TableRow)({
  color: 'black',
  '&:nth-of-type(odd)': {
    backgroundColor: '#F0F0F6',
    borderRight: '1px solid rgba(224, 224, 224, 1)',
  },
  background: '#FFFFFF',
  '&:last-child td, &:last-child th': {
    borderRight: '1px solid rgba(224, 224, 224, 1)',
  },
});

const CustomizedTable: React.FC<TableProps> = ({
  tableId,
  data,
  count,
  columns,
  getData,
  getDataWithoutPagination,
  initialLoading,
  loading,
  message,
  tableLoading,
  refreshList = false,
  getTableRowBackgroundColor = (): string => '',
  id,
  getTextColor,
  setSortBy,
  setPage,
  setRowsPerPage,
  setSortOrder,
  page = 0,
  sortBy,
  sortOrder,
  rowsPerPage,
}) => {
  const { t } = useTranslation('common');

  const handleSortClick = (column: string) => {
    if (setSortBy && setSortOrder) {
      setSortBy(column);
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    }
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    if (setPage) {
      setPage(newPage);
    }
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (setRowsPerPage && setPage) {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    }
  };

  React.useEffect(() => {
    if (getData && sortBy && sortOrder) {
      getData({
        page: page + 1,
        rowsPerPage,
        sortBy,
        sortOrder,
      });
    }
  }, [page, rowsPerPage, sortBy, sortOrder, refreshList]);

  React.useEffect(() => {
    if (getDataWithoutPagination && id && sortBy && sortOrder) {
      getDataWithoutPagination({ id, sortBy, sortOrder });
    }
  }, [sortBy, sortOrder]);

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
          maxHeight: 'calc(100vh - 450px)',
          height: 'auto',
          backgroundColor: 'white',
          overflow: 'auto',
        }}
      >
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          stickyHeader
          id={tableId}
        >
          <TableHead>
            <TableRow>
              {columns.map((column, index) => {
                const sortByIndex = sortBy
                  ? sortBy.split(',').indexOf(column.accessor.toString())
                  : 0;
                let isSortDesc = false;
                if (sortByIndex !== -1) {
                  isSortDesc = sortOrder
                    ? sortOrder.split(',')[sortByIndex || 0] === 'desc'
                    : false;
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
                  return (
                    <StyledTableRow
                      key={idx}
                      sx={{
                        backgroundColor,
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
                            minWidth: '100px',
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

      {!getDataWithoutPagination && rowsPerPage && (
        <TablePagination
          sx={{
            background: 'white',
            border: '1px solid rgba(224, 224, 224, 1)',
            color: 'black',
          }}
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={count}
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
