import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useLazyGetRequestsToSendQuery } from '../../../store/Services/dashboardService';
import { Place, QueryParams, TableColumns } from '../../../interface/common';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { open } from '../../../store/Reducers/snackbar';
import { severity } from '../../../interface/snackbar';
import { Link, useNavigate } from 'react-router-dom';
import {
  useGetUserListQuery,
  useGetUserQuery,
} from '../../../store/Services/userService';
import { useCompleteOrderMutation } from '../../../store/Services/orderService';
import { styled } from '@mui/material/styles';
import CommonModal from '../../../component/commonModal/CommonModal';
import FilterListIcon from '@mui/icons-material/FilterList';
import Badge from '@mui/material/Badge';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import { useGetOrderTypesQuery } from '../../../store/Services/commonService';
import { User } from '../../../interface/user';
import { SearchRequestToSendQueryParams } from '../../../interface/dashboard';
import NewTable from '../../../component/Table';

const TableContainer = styled('div')<{ isModalOpen: boolean }>(
  ({ isModalOpen }) => ({
    width: isModalOpen ? '73%' : '100%',
    float: 'right',
    padding: '16px',
  })
);

const RequestsToSend: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const { t: et } = useTranslation('errors');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [filterParams, setFilterParams] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(!isModalOpen);
  const handleCloseModal = () => setIsModalOpen(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const handleFilterChange = (count: number) => {
    setActiveFilterCount(count);
  };
  const { data: userData } = useGetUserListQuery();
  const { data: orderTypesData } = useGetOrderTypesQuery();
  const [completeOrderId, setCompleteOrderId] = useState<number | null>(null);
  const [refreshList, setRefreshList] = useState<boolean>(false);
  const [completeOrder] = useCompleteOrderMutation();
  const handleOrderCompleteNavigate = (orderId: number) => {
    navigate('/order/complete', {
      state: {
        orderId,
      },
    });
  };

  const handleOrderComplete = async (orderId: number) => {
    try {
      setCompleteOrderId(orderId);
      const response = await completeOrder({ ordId: orderId });
      if ('error' in response) {
        setCompleteOrderId(null);
      }
      if ('data' in response) {
        if (response?.data?.success) {
          setRefreshList(!refreshList);
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
        }
      }
    } catch (error) {
      setCompleteOrderId(null);
      dispatch(
        open({
          severity: severity.error,
          message: et('error'),
        })
      );
    }
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
          label: user.userId,
          value: user.userId,
          id: user.userId,
        })),
        type: orderTypesData?.places.map((type: Place) => ({
          label: type.place,
          value: type.place,
          id: type.type,
        })),
      }));
    }
  }, [userData, orderTypesData]);

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
      width: 350,
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
      width: 350,
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
      condition: 'and',
      type: 'dropdown',
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
      type: 'dropdown',
      filterable: true,
      condition: 'and',
    },
    {
      headerName: t('requestedDate'),
      field: 'requestedDate',
      sortable: true,
      filterable: true,
      type: 'date',
    },
    {
      headerName: t('requestedBy'),
      field: 'requestedBy',
      sortable: true,
      options: dropDownValue.users,
      filterable: true,
      condition: 'and',
      type: 'dropdown',
    },
    {
      headerName: t('completeRequest'),
      field: 'complete',
      cellRenderer: params => (
        <Button
          id="completeButton"
          onClick={() =>
            handleOrderCompleteNavigate(Number(params.data.orderId))
          }
          variant="outlined"
        >
          {t('completeRequest')}
        </Button>
      ),
      sortable: false,
      width: 200,
    },
  ];

  const accountingColumns: TableColumns[] = [
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
    },
    {
      headerName: t('modifyBy'),
      field: 'modifiedBy',
      sortable: true,
    },
    {
      headerName: t('orderDt'),
      field: 'orderDt',
      sortable: true,
    },
    {
      headerName: t('name'),
      field: 'name',
      sortable: true,
    },
    {
      headerName: t('payee'),
      field: 'payee',
      sortable: true,
    },
    {
      headerName: t('amount'),
      field: 'amount',
      sortable: true,
    },
    {
      headerName: t('address'),
      field: 'address',
      sortable: true,
    },
    {
      headerName: t('memo'),
      field: 'memo',
      sortable: true,
    },
    {
      headerName: t('completeRequest'),
      field: 'complete',
      cellRenderer: params => (
        <Button
          id="completeButton"
          onClick={() => handleOrderComplete(Number(params.data.orderId))}
          variant="outlined"
          disabled={completeOrderId === params.data.orderId}
        >
          {t('completeRequest')}
        </Button>
      ),
      sortable: false,
    },
  ];

  const getColumns = () => {
    if (user.department === 'Accounting') {
      return accountingColumns;
    }
    return columns;
  };

  const [
    getRequestsToSend,
    { data, isLoading: requestsToSendLoading, isFetching },
  ] = useLazyGetRequestsToSendQuery();

  const { isLoading } = useGetUserQuery('');
  const user = useAppSelector(state => state.user);

  const getData = ({ page, rowsPerPage, sortBy, sortOrder }: QueryParams) => {
    void getRequestsToSend({
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
    type,
    county,
    state,
    requestedDate_condition,
    requestedDate,
    requestedDate_from,
    requestedDate_to,
    requestedBy,
    page,
    rowsPerPage,
    sortBy,
    sortOrder,
  }: SearchRequestToSendQueryParams) => {
    const apiParams = {
      fileName,
      contactName,
      type,
      county,
      state,
      requestedDate_condition,
      requestedDate,
      requestedDate_from,
      requestedDate_to,
      requestedBy,
      pageNo: page || 1,
      size: rowsPerPage || 100,
      order: sortOrder || 'asc,asc',
      orderBy: sortBy || 'fileName,contactName',
    };
    setFilterParams(apiParams);
    void getRequestsToSend(apiParams);
    if (isMobile) {
      handleCloseModal();
    }
  };

  const clearTask = () => {
    setCompleteOrderId(null);
  };

  useEffect(() => {
    if (completeOrderId && !isFetching) {
      clearTask();
    }
  }, [isFetching]);

  return (
    <Container fixed>
      <TableContainer isModalOpen={isModalOpen}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Typography sx={{ color: 'white', pt: 2 }} variant="h6" id="title">
              {`${t('requestsToSend')} (${data && 'data' in data ? data.data.count : 0})`}
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
                {t('Search')}
              </Button>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <NewTable
              key="fileId"
              tableId="Requests-to-Send"
              data={data && 'data' in data ? data.data.records : []}
              count={data && 'data' in data ? data.data.count : 0}
              initialLoading={requestsToSendLoading}
              columns={getColumns()}
              initialSortBy="fileName,contactName"
              initialSortOrder="asc,asc"
              getData={getData}
              loading={isFetching}
              refreshList={refreshList}
              tableLoading={isLoading}
              message={data && 'data' in data ? data.message : ''}
            />
          </Grid>
        </Grid>
        <CommonModal
          isOpen={isModalOpen}
          handleClose={handleCloseModal}
          title="Filter"
          columns={getColumns()}
          onFilterChange={handleFilterChange}
          getFilteredDataTrigger={getFilteredData}
        />
      </TableContainer>
    </Container>
  );
};

export default RequestsToSend;
