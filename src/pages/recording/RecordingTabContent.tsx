import React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate, Link } from 'react-router-dom';
import {
  QueryParamsForWithoutPagination,
  TableColumns,
} from '../../interface/common';
import { useTranslation } from 'react-i18next';
import { formatDateToMonthDayYear } from '../../utils/GeneralUtil';
import { RecordingTabContentProps } from '../../interface/recording';
import { useLazyGetAllRecordingsQuery } from '../../store/Services/recordingService';
import CircularProgress from '@mui/material/CircularProgress';
import NewTable from '../../component/Table';

const RecordingTabContent: React.FC<RecordingTabContentProps> = ({
  deedId,
}) => {
  const { t } = useTranslation('recording');
  const navigate = useNavigate();
  const [
    getAllRecordings,
    {
      data,
      isLoading: recordingLoading,
      isFetching,
      error: recordingLoadError,
    },
  ] = useLazyGetAllRecordingsQuery();

  React.useEffect(() => {
    if (deedId) {
      void getAllRecordings({ deedId: Number(deedId) });
    }
  }, [deedId, getAllRecordings]);
  const getDataWithoutPagination = ({
    id,
    sortBy,
    sortOrder,
  }: QueryParamsForWithoutPagination) => {
    void getAllRecordings({
      deedId: Number(id),
      orderBy: sortBy,
      order: sortOrder,
    });
  };

  if (recordingLoadError) {
    return null;
  }
  const columns: TableColumns[] = [
    {
      headerName: t('documentType'),
      field: 'documentType',
      cellRenderer: params => (
        <Link
          key={String(params.data?.recID)}
          to={`/editrecording/${params.data?.recID}`}
          className="hover-link"
        >
          {params.data.documentType?.toString()}
        </Link>
      ),
      width: 200,
      sortable: true,
    },
    {
      headerName: t('county'),
      field: 'county',
      cellRenderer: params => (
        <Link
          key={String(params.data?.recID)}
          to={`/editrecording/${params.data?.recID}`}
          className="hover-link"
        >
          {params.data.county?.toString()}
        </Link>
      ),
      width: 300,
      sortable: true,
    },
    {
      headerName: t('state'),
      field: 'state',
      sortable: true,
      width: 200,
    },
    {
      headerName: t('dateSent'),
      field: 'dateSent',
      sortable: true,
      width: 200,
    },
    {
      headerName: t('dateReturned'),
      field: 'dateReturn',
      sortable: true,
      width: 200,
    },
    {
      headerName: t('book'),
      field: 'book',
      sortable: true,
      width: 200,
    },
    {
      headerName: t('page'),
      field: 'page',
      sortable: true,
      width: 150,
    },
  ];
  const formattedData = data?.data?.map(recording => {
    return {
      ...recording,
      dateSent: recording.dateSent
        ? formatDateToMonthDayYear(recording.dateSent).toString()
        : '',
      dateReturn: recording.dateReturn
        ? formatDateToMonthDayYear(recording.dateReturn).toString()
        : '',
    };
  });
  let counter = 0;
  const getTableRowBackgroundColor = () => {
    counter++;
    return counter % 2 === 0 ? '#434857' : '#252830';
  };
  const handleAddNewRecording = () => {
    navigate(`/newrecording/${deedId}`);
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
          id="ofRecordings"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          {t('ofRecordings')}: {data?.count || 0}
        </Typography>
        <Button
          id="addRecordingButton"
          variant="outlined"
          onClick={handleAddNewRecording}
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
          {t('addRecording')}
        </Button>
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
          id="fetchingRecordings"
        >
          {t('fetchingRecordings')}
          <CircularProgress
            size={20}
            sx={{ color: 'white', marginLeft: '10px' }}
          />
        </Typography>
      )}

      {!data?.count && !isFetching && (
        <Box>
          <Typography color="white" ml={2} mb={2} id="noRecordingsListed">
            {t('noRecordingsListed')}
          </Typography>
        </Box>
      )}
      {data?.count && (
        <Box mt={4}>
          <NewTable
            tableId="recordingTable"
            data={formattedData || []}
            count={data && 'count' in data ? data?.count : 0}
            initialLoading={recordingLoading}
            columns={columns}
            initialSortBy="county,state"
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

export default RecordingTabContent;
