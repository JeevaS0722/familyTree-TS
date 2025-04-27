import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import { LegalData, LegalProps, LegalTableData } from '../../interface/legal';
import { Link, useNavigate } from 'react-router-dom';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import {
  useLazyGetLegalsByFileQuery,
  useCopyLegalMutation,
} from '../../store/Services/legalService';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { QueryParams, TableColumns } from '../../interface/common';
import NewTable from '../../component/Table';

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
    void getLegalsByFile({
      fileId: Number(fileId),
      TX_LA_legal_sortBy: sort_TX_LA_LegalBy,
      TX_LA_legal_sortOrder: sort_TX_LA_LegalOrder,
      Other_legal_sortBy: sort_Other_LegalBy,
      Other_legal_sortOrder: sort_Other_LegalOrder,
    });
  }, []);

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
  }, [legalList]);

  const getOtherData = ({ sortBy, sortOrder }: QueryParams) => {
    setSortOtherLegalTableLoading(true);
    setSort_Other_LegalOrder(sortOrder);
    setSort_Other_LegalBy(sortBy);
    void getLegalsByFile({
      fileId: Number(fileId),
      TX_LA_legal_sortBy: sort_TX_LA_LegalBy,
      TX_LA_legal_sortOrder: sort_TX_LA_LegalOrder,
      Other_legal_sortBy: sortBy,
      Other_legal_sortOrder: sortOrder,
    }).finally(() => {
      setSortOtherLegalTableLoading(false);
    });
  };

  const getTxLaData = ({ sortBy, sortOrder }: QueryParams) => {
    setSortLATXLegalTableLoading(true);
    setSort_TX_LA_LegalOrder(sortOrder);
    setSort_TX_LA_LegalBy(sortBy);
    void getLegalsByFile({
      fileId: Number(fileId),
      TX_LA_legal_sortBy: sortBy,
      TX_LA_legal_sortOrder: sortOrder,
      Other_legal_sortBy: sort_Other_LegalBy,
      Other_legal_sortOrder: sort_Other_LegalOrder,
    }).finally(() => {
      setSortLATXLegalTableLoading(false);
    });
  };

  const localizeOtherLegalColumns = (
    t: TFunction,
    stateType?: string
  ): TableColumns[] => {
    const commonColumns: TableColumns[] = [
      {
        headerName: t('edit'),
        field: 'edit',
        sortable: false,
        index: 1,
        cellRenderer: ({ data }) => (
          <Link
            to={`/editlegal/${data.legalsId}`}
            state={{
              isFileView,
              contactId,
              isCopyLegal: false,
            }}
            className="hover-link"
          >
            {t('edit')}
          </Link>
        ),
      },
      {
        headerName: t('state'),
        field: 'state',
        sortable: true,
        index: 2,
      },
      {
        headerName: t('county'),
        field: 'county',
        sortable: true,
        index: 3,
      },
      {
        headerName: t('section'),
        field: 'section',
        sortable: true,
        index: stateType === 'Other' ? 4 : 9,
      },
      {
        headerName: t('township'),
        field: 'townshipNo',
        sortable: true,
        index: stateType === 'Other' ? 5 : 7,
      },

      {
        headerName: t('lot'),
        field: 'lot',
        sortable: true,
        index: 15,
      },
      {
        headerName: t('calls'),
        field: 'callNo1',
        sortable: true,
        index: 16,
      },
      {
        headerName: t('status'),
        field: 'status',
        sortable: true,
        index: 17,
      },
      {
        headerName: t('InterestType'),
        field: 'intType',
        sortable: true,
        index: 18,
      },
      {
        headerName: t('divInterest'),
        field: 'divInterest',
        sortable: true,
        index: 19,
      },
      {
        headerName: t('NMA'),
        field: 'nma',
        sortable: true,
        index: 20,
      },
      {
        headerName: t('makeOffer'),
        field: 'makeOffer',
        sortable: true,
        index: 21,
      },
      {
        headerName: t('copy'),
        field: 'copy',
        sortable: false,
        index: 22,
        cellRenderer: ({ data }) => (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {isLoading && selectedLegalId === Number(data.legalsId) ? (
              <CircularProgress
                size={30}
                sx={{ width: '24px', height: '24px' }}
                color="inherit"
              />
            ) : (
              <Button
                onClick={() => handleCopyLegal?.(Number(data.legalsId))}
                id={`copyLegalButton-${data.legalsId}`}
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
        ),
      },
    ];

    const OtherLegalColumns: TableColumns[] = [
      {
        headerName: t('range'),
        field: 'rangeNo',
        sortable: true,
        index: 6,
      },
    ];
    const TxLaLegalColumns: TableColumns[] = [
      {
        headerName: t('block'),
        field: 'block',
        sortable: true,
        index: 8,
      },
      {
        headerName: t('survey'),
        field: 'survey',
        sortable: true,
        index: 4,
      },
      {
        headerName: t('league'),
        field: 'league',
        sortable: true,
        index: 5,
      },
      {
        headerName: t('abstract'),
        field: 'abstract',
        sortable: true,
        index: 14,
      },
      {
        headerName: t('labor'),
        field: 'labor',
        sortable: true,
        index: 6,
      },
    ];

    return stateType === 'Other'
      ? [...commonColumns, ...OtherLegalColumns].sort(
          (a: TableColumns, b: TableColumns) => a.index - b.index
        )
      : [...commonColumns, ...TxLaLegalColumns].sort(
          (a: TableColumns, b: TableColumns) => a.index - b.index
        );
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
        <Box mb={2}>
          <NewTable
            tableId="OtherLegalTable"
            data={OtherLegalData}
            count={legalCount || 0}
            columns={columns_Other_legals}
            getData={getOtherData}
            initialLoading={LegalViewLoading}
            loading={isFetching && sortOtherLegalTableLoading}
            initialSortBy="state,county"
            initialSortOrder="asc"
            isWithoutPagination={true}
          />
        </Box>
      ) : (
        ''
      )}
      {TXLALegalData && TXLALegalData.length > 0 ? (
        <Box mb={2}>
          <NewTable
            tableId="TXLALegalTable"
            data={TXLALegalData}
            columns={columns_TX_LA_legals}
            count={legalCount || 0}
            getData={getTxLaData}
            initialLoading={LegalViewLoading}
            loading={isFetching && sortLATXLegalTableLoading}
            initialSortBy="state,county"
            initialSortOrder="asc"
            isWithoutPagination={true}
          />
        </Box>
      ) : (
        ''
      )}
    </Grid>
  );
};

export default LegalTable;
