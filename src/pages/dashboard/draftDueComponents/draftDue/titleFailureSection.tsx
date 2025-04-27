/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable complexity */
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import {
  nl2br,
  departments,
  formatDateToMonthDayYear,
  getCurrentDate,
  convertLargeNumberToCurrency,
  roundBigDecimalString,
} from '../../../../utils/GeneralUtil';
import Tooltip from '@mui/material/Tooltip';
import { Table } from '../../../../component/Table';
import { TableColumns, TableData } from '../../../../interface/common';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { useLazyGetDeedsQuery } from '../../../../store/Services/searchService';
import { useAddDeedNoteMutation } from '../../../../store/Services/noteService';
import { severity } from '../../../../interface/snackbar';
import { open } from '../../../../store/Reducers/snackbar';
import { addDeedNotePayload } from '../../../../interface/note';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import { DraftDueSectionProps } from '../../../../interface/draftDue';
import { CircularProgress, Skeleton } from '@mui/material';
import { useLogoutMutation } from '../../../../store/Services/auth';
import { useEditDeedTitleFailureMutation } from '../../../../store/Services/deedService';
import { EditTitleFailure } from '../../../../interface/deed';
import moment from 'moment';
import CustomDateCellEditor from './customDateCellEditor';
import CustomLossAmountCellEditor from './customLossAmountCellEditor';

const validSortFields = [
  'fileName',
  'grantor',
  'returnDate',
  'county',
  'state',
  'draftAmount2',
  'datePaid2',
  'titleFailedReason',
  'lossAmount',
  'titleFailDate',
  'notes',
];

const columnMapping: { [key: string]: string } = {
  fileName: 'fileName',
  grantor: 'grantor',
  returnDate: 'returnDate',
  county: 'county',
  state: 'state',
  draftAmount2: 'draftAmount2',
  datePaid2: 'datePaid2',
  titleFailedReason: 'titleFailedReason',
  lossAmount: 'lossAmount',
  titleFailDate: 'titleFailDate',
  notes: 'notes',
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

const titleFailureHeaders = (userDepartment: string): TableColumns[] => [
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
    headerName: 'Grantor',
    field: 'grantor',
    width: 200,
    sortable: true,
    cellRenderer: (params: { data: TableData }) =>
      handleContactName(
        typeof params.data.grantor === 'string' ? params.data.grantor : '',
        `/editcontact/${params.data.contactID}`
      ),
  },
  {
    headerName: 'Deed Returned',
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
  { headerName: 'County', field: 'county', width: 140, sortable: true },
  { headerName: 'State', field: 'state', width: 140, sortable: true },
  {
    headerName: 'Purchase Amount',
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
    headerName: 'Date Paid',
    field: 'datePaid2',
    sortable: true,
  },
  {
    headerName: 'Title Failure Reason',
    field: 'titleFailedReason',
    sortable: true,
  },
  {
    headerName: 'Loss Amount',
    field: 'lossAmount',
    sortable: true,
    editable: isUserAuthorized(userDepartment),
    cellEditor: CustomLossAmountCellEditor,
    cellRenderer: (params: { value: string | number }) => {
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
      if (!params.value) {
        return '$0';
      }
      const amountFormatted = convertLargeNumberToCurrency(
        params.value.toString(),
        {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }
      );
      return amountFormatted;
    },
  },
  {
    headerName: 'Title Fail Date',
    field: 'titleFailDate',
    sortable: true,
    cellEditor: CustomDateCellEditor,
    editable: isUserAuthorized(userDepartment),
    cellRenderer: (params: { value: string }) => {
      return params.value === 'LOADING' ? (
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
      ) : (
        params.value
      );
    },
  },
  {
    headerName: 'Notes',
    field: 'notes',
    width: 200,
    sortable: true,
    editable: isUserAuthorized(userDepartment),
    cellEditor: 'agLargeTextCellEditor',
    cellEditorPopup: true,
    cellEditorParams: {
      maxLength: 20000,
    },
    cellRenderer: (params: {
      data: { notes?: unknown; id: string };
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
      return params.data.notes
        ? parse(
            DOMPurify.sanitize(nl2br(String(params.data.notes || '')), {
              USE_PROFILES: { html: true },
            })
          )
        : '';
    },
  },
];

const TitleFailureSection: React.FC<DraftDueSectionProps> = () => {
  const [data, setData] = useState<TableData[]>([]);
  const [sortBy, setSortBy] = useState<string>('fileName,grantor');
  const [sortOrder, setSortOrder] = useState<string>('asc,asc');
  const [pageNo, setPageNo] = useState<number>(1); // Add page state
  const [rowsPerPage, setRowsPerPage] = useState<number>(500); // Add page size state
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const auth = useAppSelector(state => state.auth);
  const [getDeeds, { data: deedsData, isFetching, isLoading }] =
    useLazyGetDeedsQuery();
  const [, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const [addDeedNote] = useAddDeedNoteMutation();
  const [editDeedTitleFailure] = useEditDeedTitleFailureMutation();
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
    const from = moment().subtract(1, 'years').format('MM/DD/YYYY');
    const to = getCurrentDate('MM/DD/YYYY');
    const mappedOrderBy = validSortFields.includes(orderBy)
      ? columnMapping[orderBy] || orderBy
      : 'fileName,grantor';
    const result = await getDeeds({
      searchType: 'titlefail',
      pageNo: page,
      size: size,
      searchText: '',
      from,
      to,
      orderBy: mappedOrderBy,
      order,
    }).unwrap();

    if (result?.deeds && Array.isArray(result.deeds)) {
      const deedsWithIds = (result.deeds as TableData[]).map(
        (item: TableData, index: number) => ({
          ...item,
          id: `${item.fileID || 'file'}-${item.deedID || 'deed'}-${index}`,
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
    const field = colDef.field;
    const deedId = rowData.deedID;

    if (!['notes', 'lossAmount', 'titleFailDate'].includes(field)) {
      return;
    }

    const trimmedValue = String(newValue || '').trim();

    if (field === 'notes') {
      if (!trimmedValue) {
        const updatedRows = data.map(row =>
          row.deedID === deedId ? { ...row, notes: oldValue } : row
        );
        setData(updatedRows);
        api.applyTransaction({ update: updatedRows });
        return;
      }

      const updatedRowsWithLoading = data.map(row =>
        row.deedID === deedId ? { ...row, notes: 'LOADING' } : row
      );
      setData(updatedRowsWithLoading);
      api.applyTransaction({ update: updatedRowsWithLoading });

      try {
        const payload: addDeedNotePayload = {
          deedId: Number(deedId),
          type: 'Title Failure',
          memo: trimmedValue,
        };
        const response = await addDeedNote(payload).unwrap();
        if (response?.success) {
          dispatch(
            open({ severity: severity.success, message: response.message })
          );
          const updatedRows = data.map(row =>
            row.deedID === deedId
              ? {
                  ...row,
                  notes: trimmedValue,
                  noteId: response.data?.noteId,
                }
              : row
          );
          setData(updatedRows);
          api.applyTransaction({ update: updatedRows });
        }
      } catch (error) {
        const revertedRows = data.map(row =>
          row.deedID === deedId
            ? { ...row, notes: oldValue, noteId: rowData.noteId }
            : row
        );
        setData(revertedRows);
        api.applyTransaction({ update: revertedRows });
      }
    } else {
      // Handle lossAmount and titleFailDate
      if (field === 'lossAmount' || field === 'titleFailDate') {
        // Set the LOADING state first
        const updatedRowsWithLoading = data.map(row =>
          row.deedID === deedId ? { ...row, [field]: 'LOADING' } : row
        );

        setData(updatedRowsWithLoading);
        api.applyTransaction({ update: updatedRowsWithLoading });

        let payload: EditTitleFailure;

        if (field === 'lossAmount') {
          payload = {
            deedId,
            lossAmount: trimmedValue || 0,
          } as EditTitleFailure;
        } else {
          payload = {
            deedId,
            titleFailDate: trimmedValue,
          } as EditTitleFailure;
        }

        try {
          const response = await editDeedTitleFailure(payload).unwrap();
          if (response?.success) {
            dispatch(
              open({ severity: severity.success, message: response.message })
            );
            const updatedRows = data.map(row =>
              row.deedID === deedId
                ? {
                    ...row,
                    [field]:
                      field === 'lossAmount'
                        ? roundBigDecimalString(
                            payload.lossAmount.toString().replace(/^0+/, '')
                          )
                        : payload.titleFailDate,
                  }
                : row
            );
            setData(updatedRows);
            api.applyTransaction({ update: updatedRows });
          }
        } catch (error) {
          const revertedRows = data.map(row =>
            row.deedID === deedId ? { ...row, [field]: oldValue } : row
          );
          setData(revertedRows);
          api.applyTransaction({ update: revertedRows });
        }
      }
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
        ></Box>
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
            tableId="titleFailureTableDashboard"
            data={data.length > 0 ? data : []}
            count={deedsData?.count || 0}
            columns={titleFailureHeaders(user.department || '')}
            initialLoading={isLoading && !hasLoadedInitially}
            loading={isFetching || (isLoading && hasLoadedInitially)}
            onCellValueChanged={handleDraftCellEdit}
            getDataWithoutPagination={getDraftsData}
            getTextColor={'white'}
            initialSortBy="fileName,grantor"
            initialSortOrder="asc,asc"
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

export default TitleFailureSection;
