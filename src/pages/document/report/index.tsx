import React, { useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import {
  QueryParams,
  TableColumns,
  TableData,
} from '../../../interface/common';
import {
  useLazyGetGeneratedDocByIdQuery,
  useLazyGetGeneratedDocumentsQuery,
} from '../../../store/Services/docService';
import { useLocation, useNavigate } from 'react-router-dom';
import { Close } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import useDateTime from '../../../hooks/useDateTime';
import NewTable from '../../../component/Table';

interface LocationState {
  docId: number;
}

const Document: React.FC = () => {
  const { t } = useTranslation('docReport');
  const location = useLocation();
  const { docId } = (location.state as LocationState) || {};
  const { formatDateTime } = useDateTime();
  const navigate = useNavigate();

  const columns: TableColumns[] = [
    {
      headerName: `${t('name')}`,
      field: 'name',
      width: 500,
      cellRenderer: params =>
        params.data.progress === 'Completed' ? (
          <Typography
            className="hover-link"
            onClick={() =>
              navigate(`/document/view`, { state: { docId: params.data.id } })
            }
          >
            {params.data.name}
          </Typography>
        ) : (
          <>{params.data.name}</>
        ),
      sortable: true,
    },
    {
      headerName: t('date'),
      field: 'date',
      width: 500,
      cellRenderer: params => {
        const formatDate = formatDateTime(String(params.data.date));
        return formatDate;
      },
      sortable: true,
    },
    {
      headerName: t('progress'),
      field: 'progress',
      sortable: true,
      width: 400,
    },
  ];

  const [
    getGeneratedDocs,
    { data: docs, isLoading: getDocsLoading, isFetching: getDocsFetching },
  ] = useLazyGetGeneratedDocumentsQuery();

  const [
    getGeneratedDoc,
    { data: doc, isLoading: getDocLoading, isFetching: getDocFetching },
  ] = useLazyGetGeneratedDocByIdQuery();

  useEffect(() => {
    if (docId) {
      void getData({});
    }
  }, [docId]);

  const getData = async ({
    page,
    rowsPerPage,
    sortBy,
    sortOrder,
  }: QueryParams) => {
    if (docId) {
      await getGeneratedDoc({
        docId,
      });
    } else {
      await getGeneratedDocs({
        pageNo: page,
        size: rowsPerPage,
        order: sortOrder,
        orderBy: sortBy,
      });
    }
  };

  const data: TableData[] = (
    docId
      ? doc && 'data' in doc
        ? [doc.data]
        : []
      : docs && 'data' in docs
        ? docs.data.records
        : []
  ) as TableData[];

  const message: string = docId
    ? doc && 'data' in doc
      ? doc.message
      : ''
    : docs && 'data' in docs
      ? docs.message
      : '';

  const count = docId ? 1 : docs && 'data' in docs ? docs.data.count : 0;
  return (
    <Container fixed>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Typography sx={{ color: 'white', pt: 2 }} variant="h6" id="title">
            {t('docReportTitle')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {docId && data?.[0]?.name && (
            <Box>
              <Grid
                container
                alignItems="center"
                sx={{ background: 'white', width: 'fit-content' }}
              >
                <Grid item sx={{ color: 'black', marginLeft: '10px' }}>
                  {data?.[0]?.name}
                </Grid>
                <Grid item mt={1} mr={1}>
                  <Tooltip title="Clear filter">
                    <Close
                      color="error"
                      onClick={() => navigate('/document/report')}
                    ></Close>
                  </Tooltip>
                </Grid>
              </Grid>
            </Box>
          )}
          <NewTable
            tableId="Docs"
            data={data}
            count={count}
            initialLoading={docId ? getDocLoading : getDocsLoading}
            initialSortBy="date"
            initialSortOrder="desc"
            columns={columns}
            getData={getData}
            message={message}
            refreshList={!!docId}
            loading={docId ? getDocFetching : getDocsFetching}
            isWithoutPagination={!!docId}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Document;
