import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import { useLazyGetUnreceivedRequestsQuery } from '../../../store/Services/dashboardService';
import { Place, TableColumns } from '../../../interface/common';
import { useAppSelector } from '../../../store/hooks';
import { Link } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import { styled } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import Badge from '@mui/material/Badge';
import CommonModal from '../../../component/commonModal/CommonModal';
import { useGetUserListQuery } from '../../../store/Services/userService';
import { User } from '../../../interface/user';
import { useGetOrderTypesQuery } from '../../../store/Services/commonService';
import { UnreceivedRequestsParams } from '../../../interface/dashboard';
import NewTable from '../../../component/Table';

const TableContainer = styled('div')<{ isModalOpen: boolean }>(
  ({ isModalOpen }) => ({
    width: isModalOpen ? '73%' : '100%',
    float: 'right',
    padding: '16px',
  })
);

const UnreceivedRequests: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const user = useAppSelector(state => state.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [filterParams, setFilterParams] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCloseModal = () => setIsModalOpen(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const handleFilterChange = (count: number) => {
    setActiveFilterCount(count);
  };
  const handleToggleModal = () => {
    setIsModalOpen(prevState => !prevState);
  };
  const { data: orderTypesData } = useGetOrderTypesQuery();
  const { data: userData } = useGetUserListQuery();
  const [dropDownValue, setDropDownValue] = useState<{
    users: Array<object>;
    type: Array<object>;
  }>({
    users: [],
    type: [],
  });
  useEffect(() => {
    if (userData?.data && orderTypesData?.places) {
      let types = orderTypesData.places.map((place: Place) => ({
        label: place.place,
        value: place.place,
        id: place.place,
      }));
      if (user.department === 'Revenue') {
        types = types.filter(type => type.label !== 'Obit');
      }
      setDropDownValue({
        users: userData.data.map((user: User) => ({
          label: user.userId,
          value: user.fullName,
          id: user.userId,
        })),
        type: types,
      });
    }
  }, [userData, orderTypesData]);
  const columns: TableColumns[] = [
    {
      headerName: `${t('fileName')}`,
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
      condition: '',
      width: 300,
    },
    {
      headerName: t('contactName'),
      field: 'contactName',
      cellRenderer: params => (
        <Link
          key={String(params.data.contactId)}
          id="contactNameLink"
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
      width: 400,
    },
    {
      headerName: t('orderType'),
      field: 'type',
      cellRenderer: params => (
        <Link
          key={String(params.data.orderId)}
          id="editRequestLink"
          to={'/editorder/' + params.data.orderId}
          className="hover-link"
        >
          {params.data.type}
        </Link>
      ),
      sortable: true,
      filterable: true,
      options: dropDownValue.type,
      type: 'dropdown',
      condition: 'and',
    },
    {
      headerName: t('orderedFrom'),
      field: 'from',
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
      width: 300,
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
      field: 'date',
      sortable: true,
      type: 'date',
      filterable: true,
      condition: 'and',
    },
    {
      headerName: t('receivedDate'),
      field: 'receivedDate',
      sortable: true,
      type: 'date',
      filterable: false,
      condition: 'and',
    },
    {
      headerName: t('requestedBy'),
      field: 'requestedBy',
      sortable: true,
      filterable: user?.department === 'Revenue',
      options: dropDownValue.users,
      type: 'dropdown',
      condition: 'and',
    },
  ];

  const [
    getUnreceivedRequests,
    { data, isLoading: unreceivedRequestsLoading, isFetching },
  ] = useLazyGetUnreceivedRequestsQuery();

  const getData = ({
    page,
    rowsPerPage,
    sortBy,
    sortOrder,
  }: UnreceivedRequestsParams) => {
    void getUnreceivedRequests({
      ...filterParams,
      pageNo: page,
      size: rowsPerPage,
      order: sortOrder,
      orderBy: sortBy,
    });
  };

  const getFilteredData = ({ ...otherParams }: UnreceivedRequestsParams) => {
    setFilterParams(otherParams);
    const apiParams = {
      ...otherParams,
      pageNo: 1,
      size: 100,
      order: 'asc,asc',
      orderBy: 'dueDate,sentBy',
    };
    void getUnreceivedRequests(apiParams);
    if (isMobile) {
      setIsModalOpen(false);
    }
  };

  return (
    <Container fixed>
      <TableContainer isModalOpen={isModalOpen}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Typography sx={{ color: 'white', pt: 2 }} variant="h6" id="title">
              {`${t('unreceivedRequests')} (${data && 'data' in data ? data.data.count : 0})`}

              <Button
                type="submit"
                id="search-modal-toggle"
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
                onClick={handleToggleModal}
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
              tableId="Unreceived-Request"
              data={data && 'data' in data ? data.data.records : []}
              count={data && 'data' in data ? data.data.count : 0}
              initialLoading={unreceivedRequestsLoading}
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

export default UnreceivedRequests;
