import React from 'react';
import { OrderTabContentProps } from '../../interface/order';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useLazyGetAllOrdersQuery } from '../../store/Services/orderService';
import { useNavigate, Link } from 'react-router-dom';
import {
  QueryParamsForWithoutPagination,
  TableColumns,
} from '../../interface/common';
import { useTranslation } from 'react-i18next';
import { formatDateToMonthDayYear, nl2br } from '../../utils/GeneralUtil';
import { CircularProgress } from '@mui/material';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import NewTable from '../../component/Table';

const OrderTabContent: React.FC<OrderTabContentProps> = ({
  contactId,
  fileId,
  ordCity,
  ordState,
  grantor,
}) => {
  const { t } = useTranslation('newOrder');
  const navigate = useNavigate();
  const [
    getAllOrders,
    { data, isLoading: orderLoading, isFetching, isError: orderLoadError },
  ] = useLazyGetAllOrdersQuery();

  React.useEffect(() => {
    if (contactId) {
      void getAllOrders({ contactId: Number(contactId) });
    }
  }, [contactId, getAllOrders]);

  const getDataWithoutPagination = ({
    id,
    sortBy,
    sortOrder,
  }: QueryParamsForWithoutPagination) => {
    void getAllOrders({
      contactId: Number(id),
      orderBy: sortBy,
      order: sortOrder,
    });
  };

  if (orderLoadError) {
    return null;
  }
  const columns: TableColumns[] = [
    {
      headerName: t('ordType'),
      field: 'ordType',
      cellRenderer: params => (
        <Link
          key={String(params.data.orderID)}
          to={'/editorder/' + params.data.orderID}
          className="hover-link"
        >
          {params.data.ordType?.toString()}
        </Link>
      ),
      sortable: true,
      width: 250,
    },
    {
      headerName: t('orderedForm'),
      field: 'ordCty',
      sortable: true,
    },
    {
      headerName: t('ordState'),
      field: 'ordState',
      sortable: true,
    },
    {
      headerName: t('ordDate'),
      field: 'ordDt',
      sortable: true,
    },
    {
      headerName: t('receivedDate'),
      field: 'ordRcdDt',
      sortable: true,
    },
    {
      headerName: t('na'),
      field: 'ordNA',
      sortable: true,
    },
    {
      headerName: t('requestedBy'),
      field: 'requestedBy',
      sortable: true,
    },
    {
      headerName: t('caseNo'),
      field: 'caseNo',
      cellRenderer: params => {
        return params.data.caseNo
          ? parse(
              DOMPurify.sanitize(nl2br(String(params.data.caseNo)), {
                USE_PROFILES: { html: true },
              })
            )
          : '';
      },
      sortable: true,
    },
    {
      headerName: t('download'),
      field: 'download',
      cellRenderer: params => (
        <Link
          key={String(params.data.orderID)}
          to={`/order/requestLetter?orderType=probate&orderId=${params.data.orderID}&grantors=${encodeURIComponent(grantor || '')}&contactId=${contactId}`}
          className="hover-link"
        >
          {t('requestLetter')}
        </Link>
      ),
      sortable: false,
    },
  ];
  const formattedData = data?.orders?.map(order => {
    return {
      ...order,
      ordNA: order.ordNA ? 'N/A' : '',
      ordDt: order.ordDt
        ? formatDateToMonthDayYear(order.ordDt).toString()
        : '',
      ordRcdDt: order.ordRcdDt
        ? formatDateToMonthDayYear(order.ordRcdDt).toString()
        : '',
    };
  });
  let counter = 0;
  const getTableRowBackgroundColor = () => {
    counter++;
    return counter % 2 === 0 ? '#434857' : '#252830';
  };

  const handleAddNewOrder = () => {
    navigate('/order/neworder', {
      state: { contactId, fileId, ordCity, ordState },
    });
  };
  const handleAddNewCourtAddress = () => {
    navigate(`/newaddress/`);
  };
  return (
    <Grid item xs={12}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Typography color="white" sx={{ pt: 1, pl: 2 }} id="requested">
          {t('ofRequest')}: {data?.count || 0}
        </Typography>

        <Button
          id="newRequestButton"
          variant="outlined"
          onClick={handleAddNewOrder}
          sx={{
            whiteSpace: 'nowrap',
            '&:disabled': {
              opacity: 0.2,
              cursor: 'not-allowed',
              borderColor: '#1997c6',
              color: '#fff',
            },
          }}
        >
          {t('newRequestButton')}
        </Button>
        <Button
          id="newCourtAddressButton"
          variant="outlined"
          onClick={handleAddNewCourtAddress}
          sx={{
            whiteSpace: 'nowrap',
            '&:disabled': {
              opacity: 0.2,
              cursor: 'not-allowed',
              borderColor: '#1997c6',
              color: '#fff',
            },
          }}
        >
          {t('newCourtAddressButton')}
        </Button>
      </Stack>

      {!data?.count && isFetching && (
        <Typography
          color="white"
          ml={2}
          mb={2}
          mt={2}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {t('fetching')}
          <CircularProgress
            size={20}
            sx={{ color: 'white', marginLeft: '10px' }}
          />
        </Typography>
      )}

      {!data?.count && !isFetching && (
        <Box>
          <Typography color="white" ml={2} mb={2} mt={2} id="notRequested">
            {t('nothingRequested')}
          </Typography>
        </Box>
      )}

      {data?.count && (
        <Box mt={4}>
          <NewTable
            tableId="ordersTable"
            data={formattedData || []}
            count={data && 'count' in data ? data?.count : 0}
            initialLoading={orderLoading}
            columns={columns}
            initialSortBy="ordType,ordCty"
            initialSortOrder="asc,asc"
            getDataWithoutPagination={getDataWithoutPagination}
            loading={isFetching}
            message={data && 'orders' in data ? data.message : ''}
            id={Number(contactId)}
            getTableRowBackgroundColor={getTableRowBackgroundColor}
            getTextColor={'white'}
            isWithoutPagination={true}
          />
        </Box>
      )}
    </Grid>
  );
};

export default OrderTabContent;
