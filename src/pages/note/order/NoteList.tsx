/* eslint-disable complexity */
import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../store/hooks';
import { QueryParams, TableColumns } from '../../../interface/common';
import CircularProgress from '@mui/material/CircularProgress';
import { OrderNotesTabContentProps } from '../../../interface/note';
import { useLazyGetOrderNoteListQuery } from '../../../store/Services/noteService';
import useDateTime from '../../../hooks/useDateTime';
import parse from 'html-react-parser';
import { nl2br } from '../../../utils/GeneralUtil';
import DOMPurify from 'dompurify';
import { useGetUserQuery } from '../../../store/Services/userService';
import NewTable from '../../../component/Table';

const NotesTabContent: React.FC<OrderNotesTabContentProps> = ({
  orderId,
  deedId,
  orderBy,
  order,
}) => {
  const { t } = useTranslation('note');
  const { formatDateTime } = useDateTime();
  useGetUserQuery('');
  const { userId } = useAppSelector(state => state.user);

  const [getOrderNoteList, { data, isLoading, isFetching }] =
    useLazyGetOrderNoteListQuery();

  React.useEffect(() => {
    void getOrderNoteList({
      orderId: Number(orderId),
      orderBy,
      order,
    });
  }, [orderId]);

  const getData = ({ sortBy, sortOrder }: QueryParams) => {
    void getOrderNoteList({
      orderId: Number(orderId),
      orderBy: sortBy,
      order: sortOrder,
    });
  };

  const columns: TableColumns[] = [
    {
      headerName: t('dateCreated'),
      field: 'dateCreated',
      width: 300,
      cellRenderer: params => {
        const noteId = params.data.noteId;
        const toLink = `/edittask/${noteId}?taskId=${noteId}&isDeedView=true&deedId=${deedId}&route=/division/edit/${orderId}`;
        const date = params.data?.dateCreated as string | null | undefined;
        const formatDate = formatDateTime(date);
        return params.data.fromUserId === userId ||
          params.data.toUserId === userId ? (
          <Link
            key={String(params.data.noteId)}
            to={toLink}
            className="hover-link"
          >
            {formatDate}
          </Link>
        ) : (
          <span>{formatDate}</span>
        );
      },
      sortable: true,
    },
    {
      headerName: t('createdBy'),
      field: 'fromUserId',
      sortable: true,
      width: 300,
    },
    {
      headerName: t('contact'),
      field: 'contactName',
      sortable: true,
      width: 400,
    },
    {
      headerName: t('notes'),
      field: 'notes',
      width: 470,
      cellRenderer: params => {
        return params.data.notes
          ? parse(
              DOMPurify.sanitize(nl2br(String(params.data.notes)), {
                USE_PROFILES: { html: true },
              })
            )
          : '';
      },
      sortable: true,
    },
  ];

  let counter = 0;
  const getTableRowBackgroundColor = () => {
    counter++;
    return counter % 2 === 0 ? '#434857' : '#252830';
  };

  return (
    <Grid item xs={12} mt={3}>
      {!data?.data?.count && isFetching && (
        <Typography
          color="white"
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
          <Typography color="white" mb={2}>
            {data && 'data' in data ? data.message : ''}
          </Typography>
        </Box>
      )}
      {!!data?.data?.count && (
        <NewTable
          tableId={`orderNoteTable`}
          data={data && 'data' in data ? data.data.rows : []}
          count={data && 'data' in data ? data.data.count : 0}
          initialLoading={isLoading}
          columns={columns}
          initialSortBy={orderBy}
          initialSortOrder={order}
          getData={getData}
          loading={isFetching}
          isWithoutPagination={true}
          message={data && 'data' in data ? data.message : ''}
          getTableRowBackgroundColor={getTableRowBackgroundColor}
          getTextColor={'white'}
        />
      )}
    </Grid>
  );
};

export default NotesTabContent;
