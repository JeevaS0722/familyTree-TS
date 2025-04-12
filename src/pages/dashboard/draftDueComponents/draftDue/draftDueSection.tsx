/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import {
  nl2br,
  departments,
  formatDateToMonthDayYear,
} from '../../../../utils/GeneralUtil';
import Tooltip from '@mui/material/Tooltip';
import { Table } from '../../../../component/Table';
import { TableColumns, TableData } from '../../../../interface/common';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { useLazyGetDeedsQuery } from '../../../../store/Services/searchService';
import { useAddFileNoteMutation } from '../../../../store/Services/noteService';
import { severity } from '../../../../interface/snackbar';
import { open } from '../../../../store/Reducers/snackbar';
import { addFileNotePayload } from '../../../../interface/note';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import { DraftDueSectionProps } from '../../../../interface/draftDue';
import { Chip, CircularProgress, Skeleton } from '@mui/material';
import { useLogoutMutation } from '../../../../store/Services/auth';

const validSortFields = [
  'fileName',
  'grantor',
  'fullName',
  'county',
  'returnDate',
  'draftAmount2',
  'dueDt2',
  'main',
];

const columnMapping: { [key: string]: string } = {
  fileName: 'fileName',
  grantor: 'grantor',
  main: 'main',
  fullName: 'fullName',
  county: 'county',
  returnDate: 'returnDate',
  draftAmount2: 'draftAmount2',
  dueDt2: 'dueDt2',
};

const handleContactName = (
  contactName: string | undefined | null,
  to: string
) => {
  const grantorName = contactName?.toString();
  const showTooltip = grantorName && grantorName.length > 20;

  const linkContent = (
    <Link to={to} className="hover-link">
      {grantorName}
    </Link>
  );

  return showTooltip ? (
    <Tooltip title={grantorName} arrow>
      {linkContent}
    </Tooltip>
  ) : (
    linkContent
  );
};

const isUserAuthorized = (department: string) =>
  department === departments[0] || department === departments[5];

const draftDueHeaders = (userDepartment: string): TableColumns[] => [
  {
    headerName: 'File Name',
    field: 'fileName',
    sortable: true,
    width: 200,
    cellRenderer: (params: { data: TableData }) => (
      <Link
        key={String(params.data?.fileID)}
        to={`/editfile/${params.data?.fileID}`}
        className="hover-link"
      >
        {params.data?.fileName}
      </Link>
    ),
  },
  {
    headerName: 'Contact Name',
    field: 'grantor',
    width: 200,
    sortable: true,
    cellRenderer: (params: { data: TableData }) =>
      handleContactName(
        typeof params.data.grantor === 'string' ? params.data.grantor : '',
        `/editdeed/${params.data.deedID}`
      ),
  },
  {
    headerName: 'Main',
    field: 'main',
    width: 120,
    cellRenderer: params => (
      <span style={{ color: '#FFFFFF' }}>
        {params.data?.main === 1 ? 'Yes' : ''}
      </span>
    ),
    sortable: true,
  },
  { headerName: 'Buyer', field: 'fullName', width: 140, sortable: true },
  { headerName: 'County', field: 'county', width: 140, sortable: true },
  {
    headerName: 'Date Deed Returned',
    field: 'returnDate',
    width: 200,
    sortable: true,
    cellRenderer: params => (
      <Link
        key={String((params.data as unknown as TableData)?.deedID)}
        to={`/editdeed/${params.data?.deedID}`}
        className="hover-link"
      >
        {formatDateToMonthDayYear(
          params?.data?.returnDate as string | null | undefined
        )}
      </Link>
    ),
  },
  {
    headerName: 'Draft Amount 2',
    field: 'draftAmount2',
    width: 200,
    sortable: true,
    cellRenderer: params =>
      Number(params.data.draftAmount2 ?? 0).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
  },
  {
    headerName: 'Draft 2 Due',
    width: 140,
    field: 'dueDt2',
    sortable: true,
    cellRenderer: params => {
      return formatDateToMonthDayYear(
        params?.data?.dueDt2 as string | null | undefined
      );
    },
  },
  {
    headerName: 'Notes',
    field: 'memo',
    width: 200,
    sortable: true,
    editable: isUserAuthorized(userDepartment),
    cellEditor: 'agLargeTextCellEditor',
    cellEditorPopup: true,
    cellEditorParams: {
      maxLength: 20000,
    },
    cellRenderer: (params: {
      data: { memo?: unknown; id: string };
      value: string;
    }) => {
      if (params.value === 'LOADING') {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            <CircularProgress
              size={12}
              sx={{
                color: '#FFF',
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </Box>
        );
      }
      return params.data.memo
        ? parse(
            DOMPurify.sanitize(nl2br(String(params.data.memo || '')), {
              USE_PROFILES: { html: true },
            })
          )
        : '';
    },
  },
];

const DraftDueSection: React.FC<DraftDueSectionProps> = () => {
  const [data, setData] = useState<TableData[]>([]);
  const [sortBy, setSortBy] = useState<string>('fileName');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [pageNo, setPageNo] = useState<number>(1); // Add page state
  const [rowsPerPage, setRowsPerPage] = useState<number>(500); // Add page size state
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const auth = useAppSelector(state => state.auth);
  const [getDeeds, { data: deedsData, isFetching, isLoading }] =
    useLazyGetDeedsQuery();
  const [, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const [addFileNote] = useAddFileNoteMutation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery('(min-width:1800px)');
  const isSpecialRange = useMediaQuery(
    '(min-width:902px) and (max-width:1065px)'
  );
  const [hasLoadedInitially, setHasLoadedInitially] = useState(false);

  const fetchDrafts = async (
    orderBy: string,
    order: string,
    page: number,
    size: number
  ) => {
    const mappedOrderBy = validSortFields.includes(orderBy)
      ? columnMapping[orderBy] || orderBy
      : 'fileName';
    const result = await getDeeds({
      searchType: 'drafts',
      pageNo: page,
      size: size,
      searchText: '',
      from: '',
      to: '',
      orderBy: mappedOrderBy,
      order,
    }).unwrap();

    if (result?.deeds && Array.isArray(result.deeds)) {
      const deedsWithIds = (result.deeds as TableData[]).map(
        (item: TableData, index: number) => ({
          ...item,
          id: `${item.fileID || 'file'}-${item.deedID || 'deed'}-${index}`,
          notes:
            typeof item.task === 'object' &&
            item.task !== null &&
            'memo' in item.task
              ? String((item.task as { memo: unknown }).memo)
              : '',
          noteId: null,
        })
      );
      setData(deedsWithIds);
    } else {
      setData([]);
    }
    setHasLoadedInitially(true);
  };

  useEffect(() => {
    void fetchDrafts(sortBy, sortOrder, pageNo, rowsPerPage);
  }, [sortBy, sortOrder, pageNo, rowsPerPage]);

  const handleDraftCellEdit = async (event: {
    data: TableData;
    colDef: { field: string };
    newValue: string;
    oldValue: string;
    api: { applyTransaction: (transaction: { update: TableData[] }) => void };
  }) => {
    const { data: rowData, colDef, newValue, oldValue, api } = event;

    if (colDef.field !== 'memo') {
      return;
    }

    const trimmedValue = String(newValue || '').trim();

    if (!trimmedValue) {
      const updatedRows = data.map(row =>
        row.fileID === rowData.fileID ? { ...row, memo: oldValue } : row
      );
      setData(updatedRows);
      api.applyTransaction({ update: updatedRows });
      return;
    }

    const updatedRowsWithLoading = data.map(row =>
      row.fileID === rowData.fileID ? { ...row, memo: 'LOADING' } : row
    );
    setData(updatedRowsWithLoading);
    api.applyTransaction({ update: updatedRowsWithLoading });

    try {
      const payload: addFileNotePayload = {
        fileId: Number(rowData.fileID),
        type: 'Drafts Due',
        memo: trimmedValue,
        returnedTo: '',
      };

      const response = await addFileNote(payload).unwrap();
      if (response?.success) {
        dispatch(
          open({
            severity: severity.success,
            message: response.message,
          })
        );

        const updatedRows = data.map(row =>
          row.fileID === rowData.fileID
            ? {
                ...row,
                memo: trimmedValue,
                noteId: response.data?.noteId,
              }
            : row
        );
        setData(updatedRows);
        api.applyTransaction({ update: updatedRows });
      }
    } catch (error) {
      const revertedRows = data.map(row =>
        row.fileID === rowData.fileID
          ? { ...row, memo: oldValue, noteId: rowData.noteId }
          : row
      );
      setData(revertedRows);
      api.applyTransaction({ update: revertedRows });
    }
  };

  const getDraftsData = ({
    sortBy: newSortBy,
    sortOrder: newSortOrder,
  }: {
    sortBy: string;
    sortOrder: string;
  }) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      {hasLoadedInitially && (
        <Box
          sx={{
            ...(isLargeScreen
              ? {
                  position: isMobile ? '' : 'absolute',
                  top: 0,
                  left: 0,
                  display: 'flex',
                  justifyContent: 'flex-start',
                  gap: 2,
                  zIndex: 10,
                  padding: '10px 0 0 0',
                }
              : {
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                  padding: '10px 0',
                  justifyContent: 'center',
                  alignItems: 'center',
                  ...(isSpecialRange && {
                    flexDirection: 'column',
                    maxWidth: '210px',
                    margin: '0 auto',
                  }),
                }),
          }}
        >
          {isDesktop && (
            <>
              <Chip
                label={
                  <Typography sx={{ color: 'black' }}>Drafts Due</Typography>
                }
                sx={{
                  background: 'white',
                  ':focus': { background: 'white' },
                  color: 'black',
                  ...(isLargeScreen ? {} : { minWidth: '100px' }),
                }}
              />
              <Chip
                label={
                  <Typography sx={{ color: 'black' }}>
                    Title Failure (Coming Soon)
                  </Typography>
                }
                disabled
                sx={{
                  background: '#e0e0e0',
                  color: 'grey',
                  ...(isLargeScreen ? {} : { minWidth: '180px' }),
                }}
              />
            </>
          )}
        </Box>
      )}

      {!data?.length || isLoading || isLogoutLoading || !auth.isLoggedIn ? (
        <Box sx={{ width: '100%', paddingTop: '10px' }}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={isDesktop ? 450 : 300}
          />
        </Box>
      ) : (
        <Box
          sx={{
            width: '100%',
          }}
        >
          <Table
            tableId="draftDueTableDashboard"
            data={data.length > 0 ? data : []}
            count={deedsData?.count || 0}
            columns={draftDueHeaders(user.department || '')}
            initialLoading={isLoading && !hasLoadedInitially}
            loading={isFetching || (isLoading && hasLoadedInitially)}
            onCellValueChanged={handleDraftCellEdit}
            getDataWithoutPagination={getDraftsData}
            getTextColor={'white'}
            initialSortBy={sortBy}
            initialSortOrder={sortOrder}
            initialPage={pageNo - 1}
            initialRowsPerPage={rowsPerPage}
            headerEditMode="full"
            isWithoutPagination={true}
            fixedColumns={[]}
            height="450px"
            theme="dark"
            agTheme="light"
          />
        </Box>
      )}
    </Box>
  );
};

export default DraftDueSection;
