import React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from 'react-router-dom';
import {
  QueryParamsForWithoutPagination,
  TableColumns,
} from '../../interface/common';
import { useAppDispatch } from '../../store/hooks';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import {
  useCopyWellMutation,
  useLazyGetAllWellsQuery,
} from '../../store/Services/wellService';
import { WellTableContentProps } from '../../interface/well';
import NewTable from '../../component/Table';

const WellTable: React.FC<WellTableContentProps> = ({ divOrderId, deedID }) => {
  const { t } = useTranslation('well');
  const { t: et } = useTranslation('errors');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [copyWell] = useCopyWellMutation();
  const [
    getAllWells,
    { data, isLoading: wellLoading, isFetching, isError: wellLoadError },
  ] = useLazyGetAllWellsQuery();

  React.useEffect(() => {
    if (divOrderId) {
      void getAllWells({ divOrderId: Number(divOrderId) });
    }
  }, [divOrderId, getAllWells]);

  const getDataWithoutPagination = ({
    id,
    sortBy,
    sortOrder,
  }: QueryParamsForWithoutPagination) => {
    void getAllWells({
      divOrderId: Number(id),
      orderBy: sortBy,
      order: sortOrder,
    });
  };

  if (wellLoadError) {
    return null;
  }
  const columns: TableColumns[] = [
    {
      headerName: t('well'),
      field: 'well',
      cellRenderer: params => {
        const toLink = {
          pathname: `/editwell/${params.data.wellID}`,
        };
        return (
          <Link
            key={String(params.data.wellID)}
            state={{ deedID }}
            to={toLink}
            className="hover-link"
          >
            {params.data.well?.toString()}
          </Link>
        );
      },
      sortable: true,
      width: 300,
    },
    {
      headerName: t('legalDesc'),
      field: 'legalDesc',
      cellRenderer: params => {
        const parts = [
          params.data?.sectionAB,
          params.data?.townshipBlock,
          params.data?.rangeSurvey,
        ].filter(Boolean);
        return parts.join('-') || '--';
      },
      sortable: true,
      width: 300,
    },
    {
      headerName: t('county'),
      field: 'county',
      sortable: true,
      width: 300,
    },
    {
      headerName: t('state'),
      field: 'state',
      sortable: true,
      width: 150,
    },
    {
      headerName: t('divOfInterest'),
      field: 'divInterest',
      sortable: true,
      width: 235,
    },
    {
      headerName: t('copy'),
      field: 'copy',
      cellRenderer: params => (
        <Button
          id={`copyWellButton-${params.data?.wellID}`}
          onClick={() => handleCopy(Number(params.data?.wellID))}
          sx={{
            color: '#1997c6',
            border: '1px solid #1997c6',
            '&:hover': {
              backgroundColor: '#1672a3',
              color: '#fff',
            },
          }}
        >
          {t('copy')}
        </Button>
      ),
      sortable: false,
      width: 180,
    },
  ];

  const handleCopy = async (wellID: number) => {
    try {
      const response = await copyWell({ wellId: Number(wellID) });
      if ('data' in response) {
        if (response?.data?.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          navigate(`/editwell/${response?.data?.data?.wellId}`, {
            state: { deedID: deedID },
          });
        }
      }
    } catch (error) {
      dispatch(
        open({
          severity: severity.error,
          message: et('error'),
        })
      );
    }
  };
  const formattedData = data?.data?.map(well => {
    return {
      ...well,
    };
  });
  let counter = 0;
  const getTableRowBackgroundColor = () => {
    counter++;
    return counter % 2 === 0 ? '#434857' : '#252830';
  };
  const handleAddNewWell = () => {
    navigate(`/new_well/${divOrderId}`);
  };
  return (
    <Grid item xs={12}>
      <Box
        sx={{
          display: 'flex',
          marginBottom: 3,
        }}
      >
        <Button
          id="addWellButton"
          variant="outlined"
          onClick={handleAddNewWell}
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
          {t('addNewWell')}
        </Button>
      </Box>
      {!data?.count && isFetching && (
        <Typography
          color="white"
          mb={2}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
          id="fetchingWellData"
        >
          {t('fetchingWellData')}
          <CircularProgress
            size={20}
            sx={{ color: 'white', marginLeft: '10px' }}
          />
        </Typography>
      )}

      {!data?.count && !isFetching && (
        <Box>
          <Typography color="white" mb={2} id="noWellsListed">
            {t('noWellsListed')}
          </Typography>
        </Box>
      )}
      {data?.count && (
        <Box mt={4}>
          <NewTable
            tableId="wellTable"
            data={formattedData || []}
            count={data && 'count' in data ? data?.count : 0}
            initialLoading={wellLoading}
            columns={columns}
            initialSortBy="well,legalDesc"
            initialSortOrder="asc,asc"
            getDataWithoutPagination={getDataWithoutPagination}
            loading={isFetching}
            message={data && 'data' in data ? data.message : ''}
            id={Number(divOrderId)}
            getTableRowBackgroundColor={getTableRowBackgroundColor}
            getTextColor={'white'}
            isWithoutPagination={true}
          />
        </Box>
      )}
    </Grid>
  );
};

export default WellTable;
