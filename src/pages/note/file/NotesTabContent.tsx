/* eslint-disable complexity */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import parse from 'html-react-parser';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../store/hooks';
import { QueryParams, TableColumns } from '../../../interface/common';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { FileNotesTabContentProps } from '../../../interface/note';
import { useLazyGetFileNoteListQuery } from '../../../store/Services/noteService';
import useDateTime from '../../../hooks/useDateTime';
import { nl2br } from '../../../utils/GeneralUtil';
import DOMPurify from 'dompurify';
import { useGetUserQuery } from '../../../store/Services/userService';
import NewTable from '../../../component/Table';

const NotesTabContent: React.FC<FileNotesTabContentProps> = ({
  fileId,
  orderBy,
  order,
}) => {
  const { t } = useTranslation('note');
  useGetUserQuery('');
  const { userId } = useAppSelector(state => state.user);
  const { formatDateTime } = useDateTime();
  const navigate = useNavigate();

  const [getFileNoteList, { data, isLoading, isFetching }] =
    useLazyGetFileNoteListQuery();

  React.useEffect(() => {
    void getFileNoteList({
      fileId: Number(fileId),
      orderBy,
      order,
    });
  }, [fileId]);

  const getData = ({ sortBy, sortOrder }: QueryParams) => {
    void getFileNoteList({
      fileId: Number(fileId),
      orderBy: sortBy,
      order: sortOrder,
    });
  };

  const columns: TableColumns[] = [
    {
      headerName: t('dateCompleted'),
      field: 'dateCompleted',
      sortable: true,
      cellRenderer: params => {
        const date = params.data?.dateCompleted as string | null | undefined;
        return formatDateTime(date);
      },
      width: 300,
    },
    {
      headerName: t('taskType'),
      field: 'type',
      sortable: true,
      cellRenderer: params => {
        const noteId = params.data.noteId;
        const toLink = `/editnote?noteId=${noteId}&route=/editFile/${fileId}&from=file`;

        return params.data.fromUserId === userId ||
          params.data.toUserId === userId ? (
          <Link
            key={String(params.data.noteId)}
            to={toLink}
            className="hover-link"
          >
            {params.data?.type?.toString()}
          </Link>
        ) : (
          <span>{params.data?.type?.toString()}</span>
        );
      },
      width: 250,
    },
    {
      headerName: t('createdBy'),
      field: 'fromUserId',
      sortable: true,
    },
    {
      headerName: t('assignedTo'),
      field: 'toUserId',
      sortable: true,
    },
    {
      headerName: t('contact'),
      field: 'contactName',
      sortable: true,
      width: 250,
    },
    {
      headerName: t('notes'),
      field: 'notes',
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
      width: 400,
    },
  ];

  let counter = 0;
  const getTableRowBackgroundColor = () => {
    counter++;
    return counter % 2 === 0 ? '#434857' : '#252830';
  };

  const handleAddNewNote = () => {
    navigate('/file/newNote', {
      state: { fileId },
    });
  };

  return (
    <Grid item xs={12}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 3,
        }}
      >
        <Typography color="white" ml={2} mr={4} id="numberOfNotes">
          {t('notesTabContentTitle')}: {data?.data?.count || 0}
        </Typography>
        <Button
          id="add-note-button"
          variant="outlined"
          onClick={handleAddNewNote}
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
          {t('addNoteButton')}
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
          <Typography color="white" ml={2} mb={2} id="noNotesListed">
            {data && 'data' in data ? data.message : ''}
          </Typography>
        </Box>
      )}
      {!!data?.data?.count && (
        <NewTable
          tableId={`fileNoteTable`}
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
