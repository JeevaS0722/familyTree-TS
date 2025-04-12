import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useLazyGetRequestBefore21DaysQuery } from '../../../store/Services/dashboardService';
import { QueryParams, TableColumns } from '../../../interface/common';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import FilterListIcon from '@mui/icons-material/FilterList';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import CommonModal from '../../../component/commonModal/CommonModal';
import { User } from '../../../interface/user';
import { useGetUserListQuery } from '../../../store/Services/userService';
import { SearchRequestBefore21DaysQueryParams } from '../../../interface/dashboard';
import { useGetOrderTypesQuery } from '../../../store/Services/commonService';
import NewTable from '../../../component/Table';

const TableContainer = styled('div')<{ isModalOpen: boolean }>(
  ({ isModalOpen }) => ({
    width: isModalOpen ? '73%' : '100%',
    float: 'right',
    padding: '16px',
  })
);

const RequestBefore21Days: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const { data: userData } = useGetUserListQuery();
  const { data: orderTypesData } = useGetOrderTypesQuery();
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
  const [dropDownValue, setDropDownValue] = useState<{
    users: Array<object>;
    type: Array<object>;
  }>({
    users: [],
    type: [],
  });

  useEffect(() => {
    if (
      userData &&
      userData.data &&
      userData.data &&
      orderTypesData &&
      orderTypesData.places
    ) {
      setDropDownValue(prevState => ({
        ...prevState,
        users: userData?.data?.map((user: User) => ({
          headerName: user.userId,
          value: user.userId,
          id: user.userId,
        })),
        type: orderTypesData?.places,
      }));
    }
  }, [userData]);

  const columns: TableColumns[] = [
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
      sortable: true,
      filterable: true,
      width: 300,
    },
    {
      headerName: t('contactName'),
      field: 'contactName',
      cellRenderer: params => (
        <Link
          key={String(params.data.contactId)}
          to={'/editcontact/' + params.data.contactId}
          state={{ fileId: params.data.fileId }}
          className="hover-link"
        >
          {params.data.contactName}
        </Link>
      ),
      sortable: true,
      filterable: true,
      condition: 'and',
      width: 300,
    },
    {
      headerName: t('orderType'),
      field: 'orderType',
      cellRenderer: params => (
        <Link
          key={String(params.data.orderId)}
          to={'/editorder/' + params.data.orderId}
          className="hover-link"
        >
          {params.data.orderType}
        </Link>
      ),
      sortable: true,
      filterable: true,
      options: dropDownValue.type,
      condition: 'and',
      type: 'dropdown',
    },
    {
      headerName: t('orderedFrom'),
      field: 'orderedFrom',
      sortable: true,
      filterable: true,
      condition: 'and',
    },
    {
      headerName: t('county'),
      field: 'county',
      sortable: true,
      filterable: true,
      condition: 'and',
    },
    {
      headerName: t('state'),
      field: 'state',
      sortable: true,
      filterable: true,
      type: 'dropdown',
      condition: 'and',
    },
    {
      headerName: t('orderDate'),
      field: 'orderDate',
      sortable: true,
      filterable: true,
      condition: 'and',
      type: 'date',
    },
    {
      headerName: t('receivedDate'),
      field: 'receivedDate',
      sortable: true,
      filterable: true,
      condition: 'and',
      type: 'date',
    },
    {
      headerName: t('requestedBy'),
      field: 'modifiedBy',
      sortable: true,
      filterable: true,
      options: dropDownValue.users,
      condition: 'and',
      type: 'dropdown',
    },
  ];

  const [
    getRequestBefore21Days,
    { data, isLoading: requestBefore21DaysLoading, isFetching },
  ] = useLazyGetRequestBefore21DaysQuery();

  const getData = ({ page, rowsPerPage, sortBy, sortOrder }: QueryParams) => {
    void getRequestBefore21Days({
      ...filterParams,
      pageNo: page,
      size: rowsPerPage,
      order: sortOrder,
      orderBy: sortBy,
    });
  };

  const getFilteredData = ({
    fileName,
    contactName,
    orderType,
    orderedFrom,
    county,
    state,
    orderDate_condition,
    orderDate,
    orderDate_to,
    orderDate_from,
    receivedDate_condition,
    receivedDate,
    receivedDate_from,
    receivedDate_to,
    modifiedBy,
    size,
    pageNo,
    orderBy,
    order,
  }: SearchRequestBefore21DaysQueryParams) => {
    setFilterParams({
      fileName,
      contactName,
      orderType,
      orderedFrom,
      county,
      state,
      orderDate_condition,
      orderDate,
      orderDate_to,
      orderDate_from,
      receivedDate_condition,
      receivedDate,
      receivedDate_from,
      receivedDate_to,
      modifiedBy,
      size: size || 100,
      pageNo: pageNo || 1,
      order: order || 'fileName,contactName',
      orderBy: orderBy || 'asc,asc',
    });

    const apiParams = {
      fileName,
      contactName,
      orderType,
      orderedFrom,
      county,
      state,
      orderDate_condition,
      orderDate,
      orderDate_to,
      orderDate_from,
      receivedDate_condition,
      receivedDate,
      receivedDate_from,
      receivedDate_to,
      modifiedBy,
      size: size || 100,
      pageNo: pageNo || 1,
      order: order || 'fileName,contactName',
      orderBy: orderBy || 'asc,asc',
    };
    void getRequestBefore21Days(apiParams);
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
              {`${t('request21+days')} (${data && 'data' in data ? data.data.count : 0})`}
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
              key="fileId"
              tableId="Request-Over-21-Days"
              data={data && 'data' in data ? data.data.records : []}
              count={data && 'data' in data ? data.data.count : 0}
              initialLoading={requestBefore21DaysLoading}
              columns={columns}
              initialSortBy="fileName,contactName"
              initialSortOrder="asc,asc"
              getData={getData}
              loading={isFetching}
              message={data && 'data' in data ? data.message : ''}
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

export default RequestBefore21Days;
