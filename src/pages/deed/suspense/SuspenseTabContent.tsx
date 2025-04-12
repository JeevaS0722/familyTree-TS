import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useLazyGetSuspenseListQuery } from '../../../store/Services/suspenseService';
import { QueryParams, TableColumns } from '../../../interface/common';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Field } from 'formik';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import {
  StyledGridItem,
  StyledInputLabel,
} from '../../../component/common/CommonStyle';
import NewTable from '../../../component/Table';

const SuspenseList: React.FC<{ deedId: number }> = ({
  deedId,
}: {
  deedId: number;
}) => {
  const { t } = useTranslation('suspense');

  const navigate = useNavigate();

  const columns: TableColumns[] = [
    {
      headerName: `${t('state')}/${t('company')}`,
      field: 'stateCo',
      cellRenderer: params => (
        <Link
          key={String(params.data.suspId)}
          to={{
            pathname: '/editSuspense',
            search: `?suspId=${params.data.suspId}&deedId=${deedId}`,
          }}
          className="hover-link"
        >
          {params?.data?.stateCo}
        </Link>
      ),
      sortable: true,
      width: 250,
    },
    {
      headerName: t('amount'),
      field: 'amount',
      sortable: true,
    },
    {
      headerName: t('claim_type'),
      field: 'suspType',
      sortable: true,
    },
    {
      headerName: t('claim_date_range'),
      field: 'claimDateRange',
      sortable: true,
    },
    {
      headerName: t('submittedClaim'),
      field: 'subClaim',
      sortable: true,
    },
    {
      headerName: t('date_claim_submitted'),
      field: 'claimDate',
      sortable: true,
    },
    {
      headerName: t('rcvdFunds'),
      field: 'rcvdFunds',
      sortable: true,
    },
    {
      headerName: t('contact_name'),
      field: 'contactName',
      sortable: true,
    },
    {
      headerName: t('contact_phone'),
      field: 'contactPhone',
      sortable: true,
    },
  ];

  let counter = 0;
  const getTableRowBackgroundColor = () => {
    counter++;
    return counter % 2 === 0 ? '#434857' : '#252830';
  };

  const [
    getSuspenseList,
    { data, isLoading: suspenseListLoading, isFetching },
  ] = useLazyGetSuspenseListQuery();

  const getData = ({ sortBy, sortOrder }: QueryParams) => {
    void getSuspenseList({
      deedId: deedId,
      order: sortOrder,
      orderBy: sortBy,
    });
  };

  useEffect(() => {
    getData({ sortBy: 'stateCo,amount', sortOrder: 'asc,asc' });
  }, []);

  const handleAddNewSuspense = () => {
    navigate('/suspense/new', {
      state: { deedId },
    });
  };

  return (
    <Grid>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Grid container sx={{ padding: '16px' }}>
          <StyledGridItem item>
            <StyledInputLabel sx={{ color: 'white', fontSize: '1rem' }}>
              {t('fundsNA')}?
            </StyledInputLabel>
          </StyledGridItem>
          <Grid item>
            <Field
              name="fundsNA"
              inputProps={{ id: 'fundsNA' }}
              type="checkbox"
              as={Checkbox}
              sx={{
                color: 'white',
                padding: 0,
                marginLeft: '10px',
                '&.Mui-checked': { color: '#1997c6 !important' },
              }}
              size="small"
              color="info"
            />
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 3,
        }}
      >
        <Typography color="white" ml={2} mr={4}>
          {t('numOfSuspense')} {data?.data?.count || 0}
        </Typography>
        <Button
          id="new-division-button"
          variant="outlined"
          onClick={handleAddNewSuspense}
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
          {t('addSuspenseButton')}
        </Button>
      </Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          {!data?.data?.count && isFetching && (
            <Typography
              color="white"
              ml={2}
              mb={2}
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {t('loading')}
              <CircularProgress
                size={20}
                sx={{ color: 'white', marginLeft: '10px' }}
              />
            </Typography>
          )}
          {!data?.data?.count && !isFetching && (
            <Box>
              <Typography color="white" ml={2} mb={2}>
                {data && 'data' in data ? data.message : ''}
              </Typography>
            </Box>
          )}
          {!!data?.data?.count && (
            <NewTable
              tableId="Suspense"
              data={data && 'data' in data ? data.data.records : []}
              count={data && 'data' in data ? data.data.count : 0}
              initialLoading={suspenseListLoading}
              columns={columns}
              initialSortBy="stateCo,amount"
              initialSortOrder="asc,asc"
              getData={getData}
              loading={isFetching}
              message={data && 'data' in data ? data.message : ''}
              isWithoutPagination={true}
              getTextColor={'white'}
              getTableRowBackgroundColor={getTableRowBackgroundColor}
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SuspenseList;
