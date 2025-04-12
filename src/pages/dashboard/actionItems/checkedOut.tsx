import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useGetUserListQuery } from '../../../store/Services/userService';
import { useLazyGetCheckedOutQuery } from '../../../store/Services/dashboardService';
import { QueryParams, TableColumns } from '../../../interface/common';
import { Link } from 'react-router-dom';
import CommonModal from '../../../component/commonModal/CommonModal';
import { User } from '../../../interface/user';
import FilterListIcon from '@mui/icons-material/FilterList';
import Badge from '@mui/material/Badge';
import { SearchCheckedOutQueryParams } from '../../../interface/dashboard';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import NewTable from '../../../component/Table';

const TableContainer = styled('div')<{ isModalOpen: boolean }>(
  ({ isModalOpen }) => ({
    width: isModalOpen ? '73%' : '100%',
    float: 'right',
    padding: '16px',
  })
);

const CheckedOut: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const { data: userData } = useGetUserListQuery();
  const [dropDownValue, setDropDownValue] = useState<{ users: Array<object> }>({
    users: [],
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterParams, setFilterParams] = useState({});
  const handleOpenModal = () => setIsModalOpen(!isModalOpen);
  const handleCloseModal = () => setIsModalOpen(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const handleFilterChange = (count: number) => {
    setActiveFilterCount(count);
  };
  useEffect(() => {
    if (userData && userData.data && userData.data) {
      setDropDownValue(prevState => ({
        ...prevState,
        users: userData?.data?.map((user: User) => ({
          label: user.fullName,
          value: user.fullName,
          id: user.userId,
        })),
      }));
    }
  }, [userData]);
  const getTableRowBackgroundColor = (row: {
    [key: string]: string | number | number[] | null | boolean | undefined;
  }) => {
    const rows = row as {
      origin: string;
      totalFileValue: string;
    };
    if (rows.origin === 'Tax Sale') {
      return '#FFA500';
    }
    if (
      Number(rows.totalFileValue.replace(/[$,]/g, '')) >= 10000 &&
      Number(rows.totalFileValue.replace(/[$,]/g, '')) < 50000
    ) {
      return '#9BC53D';
    }
    if (
      Number(rows.totalFileValue.replace(/[$,]/g, '')) >= 50000 &&
      Number(rows.totalFileValue.replace(/[$,]/g, '')) < 100000
    ) {
      return '#E55934';
    }
    if (Number(rows.totalFileValue.replace(/[$,]/g, '')) >= 100000) {
      return '#FDE74C';
    }
    return 'white';
  };
  const columns: TableColumns[] = [
    {
      headerName: t('totalFileValue'),
      field: 'totalFileValue',
      sortable: true,
      filterable: true,
      type: 'amount',
      width: 300,
    },
    {
      headerName: `${t('fileName')} (${t('clickToView')})`,
      field: 'fileName',
      cellRenderer: params => (
        <Link
          key={String(params.data.fileId)}
          id="fileNameLink"
          to={'/editfile/' + params.data.fileId}
          className="hover-link"
        >
          {params.data.fileName}
        </Link>
      ),
      width: 600,
      sortable: true,
      filterable: true,
      condition: 'and',
    },
    {
      headerName: t('by'),
      field: 'requestedBy',
      sortable: true,
      filterable: true,
      options: dropDownValue.users,
      condition: 'and',
      type: 'dropdown',
      width: 260,
    },
    {
      headerName: t('date'),
      field: 'date',
      sortable: true,
      filterable: true,
      condition: 'and',
      type: 'date',
      width: 260,
    },
  ];

  const [getCheckedOut, { data, isLoading: checkedOutLoading, isFetching }] =
    useLazyGetCheckedOutQuery();

  const getData = ({ page, rowsPerPage, sortBy, sortOrder }: QueryParams) => {
    void getCheckedOut({
      ...filterParams,
      pageNo: page,
      size: rowsPerPage,
      order: sortOrder,
      orderBy: sortBy,
    });
  };

  const getFilteredData = ({
    requestedBy,
    fileName,
    date,
    date_condition,
    date_from,
    date_to,
    totalFileValue_max,
    totalFileValue_min,
    totalFileValue_condition,
    totalFileValue,
    pageNo,
    size,
    orderBy,
    order,
  }: SearchCheckedOutQueryParams) => {
    setFilterParams({
      requestedBy,
      fileName,
      date,
      date_condition,
      date_from,
      date_to,
      totalFileValue_max,
      totalFileValue_min,
      totalFileValue_condition,
      totalFileValue,
      pageNo: pageNo || 1,
      size: size || 100,
      orderBy,
      order,
    });
    const apiParams = {
      requestedBy,
      fileName,
      date,
      date_condition,
      date_from,
      date_to,
      totalFileValue_max,
      totalFileValue_min,
      totalFileValue_condition,
      totalFileValue,
      pageNo: pageNo || 1,
      size: size || 100,
      order: order || 'asc,asc',
      orderBy: orderBy || 'totalFileValue,fileName',
    };
    void getCheckedOut(apiParams);
    if (isMobile) {
      handleCloseModal();
    }
  };

  return (
    <Container fixed>
      <TableContainer isModalOpen={isModalOpen}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Typography sx={{ color: 'white', pt: 2 }} variant="h6" id="title">
              {`${t('checkedOut')} (${data && 'data' in data ? data.data.count : 0} ${t('files')})`}
              <Button
                type="submit"
                id="search-MyTask"
                variant="outlined"
                sx={{
                  my: '2rem',
                  marginLeft: '10px',
                  '&:disabled': {
                    opacity: 0.2,
                    cursor: 'not-allowed',
                    backgroundColor: '#1997c6',
                    color: '#fff',
                  },
                }}
                onClick={handleOpenModal}
                endIcon={
                  <Badge
                    badgeContent={activeFilterCount}
                    color="primary"
                    sx={{ '& .MuiBadge-badge': { backgroundColor: '#3f51b5' } }}
                  >
                    <FilterListIcon />
                  </Badge>
                }
              >
                Search
              </Button>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <NewTable
              tableId="Checked-Out"
              data={data && 'data' in data ? data.data.records : []}
              count={data && 'data' in data ? data.data.count : 0}
              initialLoading={checkedOutLoading}
              message={data && 'data' in data ? data.message : ''}
              columns={columns}
              loading={isFetching}
              getData={getData}
              initialSortBy="totalFileValue,fileName"
              initialSortOrder="asc,asc"
              getTableRowBackgroundColor={getTableRowBackgroundColor}
            />
          </Grid>
        </Grid>
      </TableContainer>
      <CommonModal
        isOpen={isModalOpen}
        handleClose={handleCloseModal}
        title="Filter"
        columns={columns}
        onFilterChange={handleFilterChange}
        getFilteredDataTrigger={getFilteredData}
      />
    </Container>
  );
};

export default CheckedOut;
