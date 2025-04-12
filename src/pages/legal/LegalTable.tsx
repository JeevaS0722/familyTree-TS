import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import React, { useEffect, useState } from 'react';
import {
  LegalColumn,
  LegalData,
  LegalProps,
  LegalTableData,
} from '../../interface/legal';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Link, useNavigate } from 'react-router-dom';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import {
  useLazyGetLegalsByFileQuery,
  useCopyLegalMutation,
} from '../../store/Services/legalService';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#252830',
    color: 'white',
    padding: '8px 16px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: 'white',
    padding: '6px 12px',
  },
  borderRight: '1px solid #C0C0C0',
}));

const StyledTableRow = styled(TableRow)({
  color: 'white',
  '&:nth-of-type(odd)': {
    backgroundColor: '#434857',
    borderRight: '1px solid #C0C0C0',
  },
  background: '#252830',
  '&:last-child td, &:last-child th': {
    borderRight: '1px solid #C0C0C0',
  },
});

const localizeOtherLegalColumns = (
  t: TFunction,
  stateType?: string
): LegalColumn[] => {
  const commonColumns: LegalColumn[] = [
    {
      label: t('edit'),
      accessor: 'edit',
      sortable: false,
      index: 1,
    },
    {
      label: t('state'),
      accessor: 'state',
      sortable: true,
      index: 2,
    },
    {
      label: t('county'),
      accessor: 'county',
      sortable: true,
      index: 3,
    },
    {
      label: t('section'),
      accessor: 'section',
      sortable: true,
      index: stateType === 'Other' ? 4 : 9,
    },
    {
      label: t('township'),
      accessor: 'townshipNo',
      sortable: true,
      index: stateType === 'Other' ? 5 : 7,
    },

    {
      label: t('lot'),
      accessor: 'lot',
      sortable: true,
      index: 15,
    },
    {
      label: t('calls'),
      accessor: 'callNo1',
      sortable: true,
      index: 16,
    },
    {
      label: t('status'),
      accessor: 'status',
      sortable: true,
      index: 17,
    },
    {
      label: t('InterestType'),
      accessor: 'intType',
      sortable: true,
      index: 18,
    },
    {
      label: t('divInterest'),
      accessor: 'divInterest',
      sortable: true,
      index: 19,
    },
    {
      label: t('NMA'),
      accessor: 'nma',
      sortable: true,
      index: 20,
    },
    {
      label: t('makeOffer'),
      accessor: 'makeOffer',
      sortable: true,
      index: 21,
    },
    {
      label: t('copy'),
      accessor: 'copy',
      sortable: false,
      index: 22,
    },
  ];

  const OtherLegalColumns: LegalColumn[] = [
    {
      label: t('range'),
      accessor: 'rangeNo',
      sortable: true,
      index: 6,
    },
  ];
  const TxLaLegalColumns: LegalColumn[] = [
    {
      label: t('block'),
      accessor: 'block',
      sortable: true,
      index: 8,
    },
    {
      label: t('survey'),
      accessor: 'survey',
      sortable: true,
      index: 4,
    },
    {
      label: t('league'),
      accessor: 'league',
      sortable: true,
      index: 5,
    },
    {
      label: t('abstract'),
      accessor: 'abstract',
      sortable: true,
      index: 14,
    },
    {
      label: t('labor'),
      accessor: 'labor',
      sortable: true,
      index: 6,
    },
  ];

  return stateType === 'Other'
    ? [...commonColumns, ...OtherLegalColumns].sort(
        (a: LegalColumn, b: LegalColumn) => a.index - b.index
      )
    : [...commonColumns, ...TxLaLegalColumns].sort(
        (a: LegalColumn, b: LegalColumn) => a.index - b.index
      );
};

const LegalTable: React.FC<LegalProps> = ({
  fileId,
  fileName,
  isFileView = false,
  contactId,
}) => {
  const { t } = useTranslation('legalTable');
  const navigate = useNavigate();
  const [OtherLegalData, setOtherLegalData] = useState<LegalTableData[]>([]);
  const [TXLALegalData, setTXLALegalData] = useState<LegalTableData[]>([]);
  const [
    getLegalsByFile,
    { data: legalList, isLoading: LegalViewLoading, isFetching },
  ] = useLazyGetLegalsByFileQuery();
  const [legalCount, setLegalCount] = useState(0);
  const [copyLegal, { isLoading }] = useCopyLegalMutation();

  const [sort_TX_LA_LegalBy, setSort_TX_LA_LegalBy] =
    useState<string>('state, county');
  const [sort_TX_LA_LegalOrder, setSort_TX_LA_LegalOrder] =
    useState<string>('asc');
  const [sort_Other_LegalBy, setSort_Other_LegalBy] =
    useState<string>('state, county');
  const [sort_Other_LegalOrder, setSort_Other_LegalOrder] =
    useState<string>('asc');
  const [TX_LA_legals_data, set_TX_LA_legals_data] = React.useState<
    LegalData[]
  >([]);
  const [Other_legals_data, set_Other_Legals_data] = React.useState<
    LegalData[]
  >([]);

  const [sortOtherLegalTableLoading, setSortOtherLegalTableLoading] =
    React.useState(true);
  const [sortLATXLegalTableLoading, setSortLATXLegalTableLoading] =
    React.useState(true);

  useEffect(() => {
    setSortLATXLegalTableLoading(true);
    void getLegalsByFile({
      fileId: Number(fileId),
      TX_LA_legal_sortBy: sort_TX_LA_LegalBy,
      TX_LA_legal_sortOrder: sort_TX_LA_LegalOrder,
      Other_legal_sortBy: sort_Other_LegalBy,
      Other_legal_sortOrder: sort_Other_LegalOrder,
    }).finally(() => {
      setSortLATXLegalTableLoading(false);
    });
  }, [sort_TX_LA_LegalOrder]);
  useEffect(() => {
    setSortOtherLegalTableLoading(true);
    void getLegalsByFile({
      fileId: Number(fileId),
      TX_LA_legal_sortBy: sort_TX_LA_LegalBy,
      TX_LA_legal_sortOrder: sort_TX_LA_LegalOrder,
      Other_legal_sortBy: sort_Other_LegalBy,
      Other_legal_sortOrder: sort_Other_LegalOrder,
    }).finally(() => {
      setSortOtherLegalTableLoading(false);
    });
  }, [sort_Other_LegalOrder]);

  useEffect(() => {
    if (legalList && legalList.data && legalList.data.legals) {
      setLegalCount(legalList.data.count);
      set_Other_Legals_data(legalList.data.legals.Other_legals);
      set_TX_LA_legals_data(legalList.data.legals.TX_LA_legals);
    } else {
      setLegalCount(0);
      set_Other_Legals_data([]);
      set_TX_LA_legals_data([]);
    }
  }, [
    legalList,
    sort_TX_LA_LegalBy,
    sort_TX_LA_LegalOrder,
    sort_Other_LegalBy,
    sort_Other_LegalOrder,
  ]);

  const handleSortClick = (column: string, isTXLATable: boolean) => {
    if (column === 'edit' || column === 'copy') {
      return;
    }
    if (isTXLATable) {
      setSortLATXLegalTableLoading(true);
      setSort_TX_LA_LegalBy(column);
      setSort_TX_LA_LegalOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortOtherLegalTableLoading(true);
      setSort_Other_LegalBy(column);
      setSort_Other_LegalOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    }
  };

  const columns_Other_legals = localizeOtherLegalColumns(t, 'Other');
  const columns_TX_LA_legals = localizeOtherLegalColumns(t);

  const handleLegalTableData = (
    legalData: LegalData[],
    isTXLAData: boolean
  ) => {
    const legalsArray: LegalTableData[] = [];

    legalData.map(data => {
      legalsArray.push({
        legalsId: Number(data.legalsID),
        fileID: Number(data.fileID),
        state: data.state,
        county: data.county,
        section: data.section,
        townshipNo:
          data.townshipNS !== '' && data.townshipNo
            ? `${data.townshipNo}${data.townshipNS}`
            : data.townshipNS !== ''
              ? `${data.townshipNS}`
              : data.townshipNo
                ? `${data.townshipNo}`
                : '',
        rangeNo:
          data.rangeEW && data.rangeNo
            ? data.rangeEW !== ''
              ? `${data.rangeNo}${data.rangeEW}`
              : ''
            : '',
        callNo1: data.calls || '',
        lot: data.lot,
        status: data.status,
        source: data.source,
        divInterest: data.divInterest,
        intType: data.intType,
        nma: Number(data.nma),
        makeOffer: data.makeOffer ? 'Yes' : 'No',
        survey: data.survey,
        league: data.league,
        block: data.block,
        abstract: data.abstract,
        labor: data.labor,
        year: data.year,
      });
      return data;
    });
    if (isTXLAData) {
      setTXLALegalData(legalsArray);
    } else {
      setOtherLegalData(legalsArray);
    }
  };

  useEffect(() => {
    handleLegalTableData(TX_LA_legals_data, true);
  }, [TX_LA_legals_data, TX_LA_legals_data.length]);

  useEffect(() => {
    handleLegalTableData(Other_legals_data, false);
  }, [Other_legals_data, Other_legals_data.length]);

  const handleAddNewLegal = () => {
    navigate(`/newlegal?fileId=${Number(fileId)}&fileName=${fileName}`, {
      state: { isFileView: isFileView, contactId: contactId },
    });
  };
  const [selectedLegalId, setSelectedLegalId] = useState(0);

  const handleCopyLegal = (legalId: number) => {
    setSelectedLegalId(legalId);
    void copyLegal({ legalID: Number(legalId) })
      .then(({ data }) => {
        navigate(`/copylegal/${Number(data?.data?.legalID)}`, {
          state: {
            isFileView: isFileView,
            contactId: contactId,
            isCopyLegal: true,
          },
        });
      })
      .catch(err => err);
  };

  return (
    <Grid>
      <Box
        sx={{
          display: 'flex',
          marginBottom: 3,
        }}
      >
        <Typography color="white" ml={2} mr={4} id="legalsCount">
          {t('ofLegal')}: {legalCount || 0}
        </Typography>

        <Button
          variant="outlined"
          onClick={handleAddNewLegal}
          id="addLegalDesc"
        >
          {t('addALegalDesc')}
        </Button>
      </Box>
      {!legalCount && isFetching && (
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
      <Grid
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          gap: '20px',
          flexDirection: 'row',
          marginBottom: '30px',
        }}
      >
        {!legalCount && !isFetching && (
          <Grid>
            <Typography
              component="h5"
              sx={{
                color: '#fff',
                fontSize: '20px',
              }}
              id="noLegalsMsg"
            >
              {t('noLegalsListed')}
            </Typography>
          </Grid>
        )}
      </Grid>
      {OtherLegalData && OtherLegalData.length > 0 ? (
        <Paper
          sx={{
            width: '100%',
            mb: 1,
            border: 1,
            borderColor: 'white',
            borderRadius: '1px',
            marginBottom: '20px',
          }}
        >
          <TableContainer
            sx={{
              maxHeight: 'calc(100vh - 310px)',
              height: 'auto',
              backgroundColor: 'white',
              overflow: 'auto',
            }}
          >
            <Table
              sx={{ minWidth: 700 }}
              aria-label="customized table"
              stickyHeader
              id="otherLegalsTable"
            >
              <TableHead>
                <TableRow>
                  {columns_Other_legals.map((column, index) => (
                    <StyledTableCell key={index} align="center">
                      {column.sortable ? (
                        <TableSortLabel
                          active={sort_Other_LegalBy.includes(
                            column.accessor.toString()
                          )}
                          direction={
                            sort_Other_LegalOrder === 'asc' ? 'asc' : 'desc'
                          }
                          sx={{
                            fontSize: '10pt',
                            '&:hover': {
                              color: 'white',
                            },
                            '&:focus': {
                              color: '#1997c6',
                            },
                          }}
                          onClick={() =>
                            handleSortClick(column.accessor.toString(), false)
                          }
                        >
                          {column.label}
                        </TableSortLabel>
                      ) : (
                        <Typography display="inline" sx={{ fontSize: '10pt' }}>
                          {column.label}
                        </Typography>
                      )}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {OtherLegalData.map(row => (
                  <StyledTableRow key={row.legalsId}>
                    {columns_Other_legals.map((column, index) => (
                      <StyledTableCell key={index} component="th" scope="row">
                        {column.accessor === 'edit' ? (
                          <Link
                            to={`/editlegal/${row.legalsId}`}
                            state={{
                              isFileView,
                              contactId,
                              isCopyLegal: false,
                            }}
                            className="hover-link"
                          >
                            {t('edit')}
                          </Link>
                        ) : column.accessor === 'copy' ? (
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                            }}
                          >
                            {isLoading &&
                            selectedLegalId === Number(row.legalsId) ? (
                              <CircularProgress
                                size={30}
                                sx={{
                                  width: '24px',
                                  height: '24px',
                                }}
                                color="inherit"
                              />
                            ) : (
                              <Button
                                onClick={() =>
                                  handleCopyLegal(Number(row?.legalsId))
                                }
                                id={`copyLegalButton-${row?.legalsId}`}
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
                            )}
                          </Box>
                        ) : (
                          row[column.accessor]
                        )}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {isFetching && sortOtherLegalTableLoading && !LegalViewLoading && (
            <LinearProgress />
          )}
        </Paper>
      ) : (
        ''
      )}
      {TXLALegalData && TXLALegalData.length > 0 ? (
        <Paper
          sx={{
            width: '100%',
            mb: 1,
            border: 1,
            borderColor: 'white',
            borderRadius: '1px',
            marginBottom: '20px',
          }}
        >
          <TableContainer
            sx={{
              maxHeight: 'calc(100vh - 310px)',
              height: 'auto',
              backgroundColor: 'white',
              overflow: 'auto',
            }}
          >
            <Table
              sx={{ minWidth: 700 }}
              aria-label="customized table"
              stickyHeader
              id="TXLALegalsTable"
            >
              <TableHead>
                <TableRow>
                  {columns_TX_LA_legals.map((column, index) => (
                    <StyledTableCell key={index} align="center">
                      {column.sortable ? (
                        <TableSortLabel
                          active={sort_TX_LA_LegalBy.includes(
                            column.accessor.toString()
                          )}
                          direction={
                            sort_TX_LA_LegalOrder === 'asc' ? 'asc' : 'desc'
                          }
                          sx={{
                            fontSize: '10pt',
                            '&:hover': {
                              color: 'white',
                            },
                            '&:focus': {
                              color: '#1997c6',
                            },
                          }}
                          onClick={() =>
                            handleSortClick(column.accessor.toString(), true)
                          }
                        >
                          {column.label}
                        </TableSortLabel>
                      ) : (
                        <Typography display="inline" sx={{ fontSize: '10pt' }}>
                          {column.label}
                        </Typography>
                      )}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {TXLALegalData.map(row => (
                  <StyledTableRow key={row.legalsId}>
                    {columns_TX_LA_legals.map((column, index) => (
                      <StyledTableCell key={index} component="th" scope="row">
                        {column.accessor === 'edit' ? (
                          <Link
                            to={`/editlegal/${row.legalsId}`}
                            state={{
                              isFileView,
                              contactId,
                              isCopyLegal: false,
                            }}
                            className="hover-link"
                          >
                            {t('edit')}
                          </Link>
                        ) : column.accessor === 'copy' ? (
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                            }}
                          >
                            {isLoading &&
                            selectedLegalId === Number(row.legalsId) ? (
                              <CircularProgress
                                size={30}
                                sx={{
                                  width: '24px',
                                  height: '24px',
                                }}
                                color="inherit"
                              />
                            ) : (
                              <Button
                                onClick={() =>
                                  handleCopyLegal(Number(row?.legalsId))
                                }
                                id={`copyLegalButton-${row?.legalsId}`}
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
                            )}
                          </Box>
                        ) : (
                          row[column.accessor]
                        )}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {isFetching && sortLATXLegalTableLoading && !LegalViewLoading && (
            <LinearProgress />
          )}
        </Paper>
      ) : (
        ''
      )}
    </Grid>
  );
};

export default LegalTable;
