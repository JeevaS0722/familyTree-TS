import React from 'react';
import { Link } from 'react-router-dom';
import {
  QueryParamsForWithoutPagination,
  TableColumns,
} from '../../interface/common';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { OffersTabContentProps } from '../../interface/offer';
import { useTranslation } from 'react-i18next';
import { useLazyGetOfferDetailsQuery } from '../../store/Services/offerService';
import { formatDateToMonthDayYear, nl2br } from '../../utils/GeneralUtil';
import { CircularProgress } from '@mui/material';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import NewTable from '../../component/Table';

const OffersTabContent: React.FC<OffersTabContentProps> = ({
  contactId,
  fileId,
}) => {
  const { t } = useTranslation('newOffer');
  const [
    getOfferDetails,
    {
      data,
      isLoading: OfferReviewLoading,
      isFetching,
      isError: offerLoadError,
    },
  ] = useLazyGetOfferDetailsQuery();

  React.useEffect(() => {
    void getOfferDetails({ contactId: Number(contactId) });
  }, []);

  const getDataWithoutPagination = ({
    id,
    sortBy,
    sortOrder,
  }: QueryParamsForWithoutPagination) => {
    void getOfferDetails({
      contactId: Number(id),
      orderBy: sortBy,
      order: sortOrder,
    });
  };

  if (offerLoadError) {
    return null;
  }

  const columns: TableColumns[] = [
    {
      headerName: t('offerDate'),
      field: 'offerDate',
      sortable: true,
    },
    {
      headerName: t('grantors'),
      field: 'grantors',
      cellRenderer: params => (
        <Link
          key={String(params.data?.offerID)}
          to={`/editoffer/${params.data?.offerID}`}
          className="hover-link"
        >
          {params.data?.grantors}
        </Link>
      ),
      sortable: true,
    },
    {
      headerName: t('offerType'),
      field: 'offerTypes',
      sortable: true,
    },
    {
      headerName: t('letterType'),
      field: 'letterType',
      sortable: true,
    },
    {
      headerName: t('draft1'),
      field: 'draftAmount1',
      sortable: true,
    },
    {
      headerName: t('draft2'),
      field: 'draftAmount2',
      sortable: true,
    },
    {
      headerName: t('address'),
      field: 'offerAddress',
      cellRenderer: params =>
        params.data.offerAddress
          ? parse(
              DOMPurify.sanitize(
                nl2br(String(params.data.offerAddress || '')),
                {
                  USE_PROFILES: { html: true },
                }
              )
            )
          : '',
      sortable: true,
    },
    {
      headerName: t('city'),
      field: 'offerCity',
      sortable: true,
    },
    {
      headerName: t('state'),
      field: 'offerState',
      sortable: true,
    },
    {
      headerName: t('zip'),
      field: 'offerZip',
      sortable: true,
    },
    {
      headerName: t('comment3'),
      field: 'comment3',
      sortable: true,
      width: 210,
    },
    {
      headerName: t('download'),
      field: 'download',
      cellRenderer: params => (
        <Link
          key={String(params.data?.offerID)}
          to={`/offer/letter?offerId=${params.data?.offerID}&offerType=${encodeURIComponent(params.data?.offerTypes ?? '')}&grantors=${encodeURIComponent(JSON.stringify(params.data?.grantors ?? ''))}&fileId=${fileId}&contactId=${contactId}`}
          className="hover-link"
        >
          Deed/Letter
        </Link>
      ),
      sortable: false,
    },
  ];
  const formattedData = data?.offers?.map(offer => {
    return {
      ...offer,
      draftAmount1: BigInt(offer.draftAmount1 ?? 0).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
      draftAmount2: BigInt(offer.draftAmount2 ?? 0).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
      offerDate: offer.offerDate
        ? formatDateToMonthDayYear(offer.offerDate).toString()
        : '',
    };
  });
  let counter = 0;
  const getTableRowBackgroundColor = () => {
    counter++;
    return counter % 2 === 0 ? '#434857' : '#252830';
  };
  return (
    <Grid item xs={12}>
      <Box
        sx={{
          display: 'flex',
          marginBottom: 3,
        }}
      >
        <Typography color="white" ml={2} mr={4} id="offersCount">
          {t('offersCount')}: {data?.count || 0}
        </Typography>
      </Box>
      {!data?.count && isFetching && (
        <Typography
          color="white"
          ml={2}
          mb={2}
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
          <Typography color="white" ml={2} mb={2} id="noOffersMsg">
            {data?.message}
          </Typography>
        </Box>
      )}

      {!!data?.count && (
        <>
          <NewTable
            tableId="offersTable"
            data={formattedData || []}
            count={data && 'count' in data ? data?.count : 0}
            initialLoading={OfferReviewLoading}
            columns={columns}
            initialSortBy="offerDate,grantors"
            initialSortOrder="asc,asc"
            getDataWithoutPagination={getDataWithoutPagination}
            loading={isFetching}
            message={data && 'offers' in data ? data.message : ''}
            id={Number(contactId)}
            getTableRowBackgroundColor={getTableRowBackgroundColor}
            getTextColor={'white'}
            isWithoutPagination={true}
          />
        </>
      )}
    </Grid>
  );
};

export default OffersTabContent;
