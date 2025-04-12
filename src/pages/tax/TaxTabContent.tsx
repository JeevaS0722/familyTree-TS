import React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate, Link } from 'react-router-dom';
import {
  QueryParamsForWithoutPagination,
  TableColumns,
  TableData,
} from '../../interface/common';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import { TaxTabContentProps } from '../../interface/tax';
import { useLazyGetAllTaxesByDeedQuery } from '../../store/Services/taxService';
import { formatDateToMonthDayYear } from '../../utils/GeneralUtil';
import NewTable from '../../component/Table';

const TaxTabContent: React.FC<TaxTabContentProps> = ({ deedId }) => {
  const { t } = useTranslation('tax');
  const navigate = useNavigate();
  const [
    getAllTaxes,
    { data, isLoading: taxesLoading, isFetching, error: taxesLoadError },
  ] = useLazyGetAllTaxesByDeedQuery();

  React.useEffect(() => {
    if (deedId) {
      void getAllTaxes({
        deedId: Number(deedId),
        orderBy: 'county,amountDue',
        order: 'asc,asc',
      });
    }
  }, [deedId, getAllTaxes]);
  const getDataWithoutPagination = ({
    id,
    sortBy,
    sortOrder,
  }: QueryParamsForWithoutPagination) => {
    void getAllTaxes({
      deedId: Number(id),
      orderBy:
        sortBy === 'taxStart'
          ? 'taxStart,taxEnd'
          : sortBy || 'county,amountDue',
      order:
        sortBy === 'taxStart'
          ? sortOrder === 'asc'
            ? 'asc,asc'
            : 'desc,desc'
          : sortOrder || 'asc,asc',
    });
  };

  if (taxesLoadError) {
    return null;
  }
  const columns: TableColumns[] = [
    {
      headerName: t('taxingEntity'),
      field: 'taxingEntity',
      cellRenderer: params => (
        <Link
          key={String(params.data.taxID)}
          to={'/edittax/' + params.data.taxID}
          className="hover-link"
        >
          {params.data.taxingEntity?.toString()}
        </Link>
      ),
      width: 230,
      sortable: true,
    },
    {
      headerName: t('county'),
      field: 'county',
      cellRenderer: params => (
        <Link
          key={String(params.data.taxID)}
          to={'/edittax/' + params.data.taxID}
          className="hover-link"
        >
          {params.data.county?.toString()}
        </Link>
      ),
      width: 250,
      sortable: true,
    },
    {
      headerName: t('amountDue'),
      field: 'amountDue',
      sortable: true,
      width: 250,
    },
    {
      headerName: t('taxStart'),
      field: 'taxStart',
      sortable: true,
      cellRenderer: params => {
        return `${params.data.taxStart ? params.data.taxStart : '0000'} - ${params.data.taxEnd ? params.data.taxEnd : '0000'}`;
      },
      width: 250,
    },
    {
      headerName: t('datePaidOrNotified'),
      field: 'datePaid',
      sortable: true,
      cellRenderer: params => {
        return params.data.datePaid && params.data.datePaid !== '00/00/0000'
          ? formatDateToMonthDayYear(params.data.datePaid.toString()).toString()
          : '';
      },
      width: 250,
    },
    {
      headerName: t('rcvd'),
      field: 'rcvd',
      sortable: true,
      cellRenderer: params => (params.data?.rcvd ? 'Yes' : ''),
      width: 240,
    },
  ];
  const formattedData = data?.data.taxes.map(tax => {
    return { ...tax };
  }) as TableData[];

  let counter = 0;
  const getTableRowBackgroundColor = () => {
    counter++;
    return counter % 2 === 0 ? '#434857' : '#252830';
  };
  const handleAddNewTax = () => {
    navigate(`/newtax/${deedId}`);
  };
  return (
    <Grid item xs={12}>
      <Box
        sx={{
          display: 'flex',
          marginBottom: 3,
        }}
      >
        <Typography
          color="white"
          ml={2}
          mr={4}
          id="ofTaxes"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          {t('ofTaxes')}: {data?.data?.count || 0}
        </Typography>
        <Button
          id="addTaxButton"
          variant="outlined"
          onClick={handleAddNewTax}
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
          {t('addTax')}
        </Button>
      </Box>
      {!data?.data?.count && isFetching && (
        <Typography
          color="white"
          ml={2}
          mb={2}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
          id="fetchingTaxes"
        >
          {t('fetchingTaxes')}
          <CircularProgress
            size={20}
            sx={{ color: 'white', marginLeft: '10px' }}
          />
        </Typography>
      )}

      {!data?.data?.count && !isFetching && (
        <Box>
          <Typography color="white" ml={2} mb={2} id="noTaxesListed">
            {t('noTaxesListed')}
          </Typography>
        </Box>
      )}
      {data?.data?.count && (
        <Box mt={4}>
          <NewTable
            tableId="taxTable"
            data={formattedData || []}
            count={
              data && data.data && 'count' in data.data ? data?.data?.count : 0
            }
            initialLoading={taxesLoading}
            columns={columns}
            initialSortBy="county,amountDue"
            initialSortOrder="asc,asc"
            getDataWithoutPagination={getDataWithoutPagination}
            loading={isFetching}
            message={data && 'data' in data ? data.message : ''}
            id={Number(deedId)}
            getTableRowBackgroundColor={getTableRowBackgroundColor}
            getTextColor={'white'}
            isWithoutPagination={true}
          />
        </Box>
      )}
    </Grid>
  );
};

export default TaxTabContent;
