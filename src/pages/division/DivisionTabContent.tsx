/* eslint-disable complexity */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import { DivisionTabContentProps } from '../../interface/division';
import { useGetAllDivisionQuery } from '../../store/Services/divisionService';
import {
  QueryParamsForWithoutPagination,
  TableColumns,
} from '../../interface/common';
import {
  formatDateToMonthDayYear,
  handleEmptyDateValue,
  phoneFormat,
} from '../../utils/GeneralUtil';
import CircularProgress from '@mui/material/CircularProgress';
import NewTable from '../../component/Table';

const DivisionTabContent: React.FC<DivisionTabContentProps> = ({
  contactId,
  fileId,
  deedId,
}) => {
  const { t } = useTranslation('division');
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = React.useState({
    deedId: deedId || '',
    orderBy: 'companyName,notified',
    order: 'asc,asc',
  });

  const {
    data,
    isLoading: DivisionLoading,
    isFetching,
    isError: DivisionLoadError,
  } = useGetAllDivisionQuery(queryParams, { refetchOnMountOrArgChange: true });

  const getDataWithoutPagination = ({
    sortBy,
    sortOrder,
  }: QueryParamsForWithoutPagination) => {
    setQueryParams({
      deedId: deedId || '',
      orderBy: sortBy || 'companyName,notified',
      order: sortOrder || 'asc,asc',
    });
  };

  if (DivisionLoadError) {
    return null;
  }

  const columns: TableColumns[] = [
    {
      headerName: t('companyName'),
      field: 'companyName',
      sortable: true,
      cellRenderer: params => {
        const toLink = {
          pathname: `/division/edit/${params.data.orderID}`,
        };

        return params.data.orderID ? (
          <Link
            key={String(params.data.orderID)}
            to={toLink}
            className="hover-link"
          >
            {params.data?.companyName?.toString()}
          </Link>
        ) : (
          <span>{params.data?.companyName?.toString()}</span>
        );
      },
      width: 250,
    },
    {
      headerName: t('notified'),
      field: 'notified',
      sortable: true,
      cellRenderer: params => (params.data?.notified ? 'Yes' : ''),
    },
    {
      headerName: t('contactName'),
      field: 'contactName',
      sortable: true,
    },
    {
      headerName: t('phoneNumber'),
      field: 'phoneNumber',
      sortable: true,
    },
    {
      headerName: t('email'),
      field: 'email',
      sortable: true,
      cellRenderer: params => {
        return params.data?.email ? (
          <Link
            to={`mailto:${params.data.email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover-link"
          >
            {params.data.email.toString()}
          </Link>
        ) : (
          ''
        );
      },
    },
    {
      headerName: t('notice1Date'),
      field: 'notice1Date',
      sortable: true,
      cellRenderer: params => handleEmptyDateValue(params.data?.notice1Date),
    },
    {
      headerName: t('past30days'),
      field: 'past30days',
      sortable: false,
    },
    {
      headerName: t('past60days'),
      field: 'past60days',
      sortable: false,
    },
    {
      headerName: t('2ndNotice'),
      field: 'notice2',
      sortable: true,
      cellRenderer: params => (params.data?.notice2 ? 'Yes' : ''),
    },
    {
      headerName: t('notice2Date'),
      field: 'notice2Date',
      sortable: true,
      cellRenderer: params => handleEmptyDateValue(params.data?.notice2Date),
    },
    {
      headerName: t('3rdNotice'),
      field: 'notice3',
      sortable: true,
      cellRenderer: params => (params.data?.notice3 ? 'Yes' : ''),
    },
    {
      headerName: t('notice3Date'),
      field: 'notice3Date',
      sortable: true,
      cellRenderer: params => handleEmptyDateValue(params.data?.notice3Date),
    },
    {
      headerName: t('divisionOrd'),
      field: 'received',
      sortable: true,
      cellRenderer: params => (params.data?.received ? 'Yes' : ''),
    },
    {
      headerName: t('wellNameColumn'),
      field: 'well',
      sortable: true,
    },
    {
      headerName: t('legalDesc'),
      field: 'legalDesc',
      sortable: true,
    },
    {
      headerName: t('countyState'),
      field: 'countyState',
      sortable: true,
    },
  ];

  const formattedData = data?.data.divisions?.map(div => {
    const data = {
      orderID: div?.orderID || null,
      companyName: div?.operator?.companyName || '',
      notified: div?.notified || false,
      contactName: div?.operator?.contactName || '',
      phoneNumber: phoneFormat(div.operator?.phoneNumber?.toString() || ''),
      email: div.operator?.email || '',
      notice1Date: div.notice1Date
        ? formatDateToMonthDayYear(div.notice1Date)
        : '',
      past30days: div.past30days || '',
      past60days: div.past60days || '',
      notice2: div.notice2 || false,
      notice2Date: div.notice2Date
        ? formatDateToMonthDayYear(div.notice2Date)
        : '',
      notice3: div.notice3 || false,
      notice3Date: div.notice3Date
        ? formatDateToMonthDayYear(div.notice3Date)
        : '',
      received: div.received || false,
      legalDesc: div.legalDesc,
      well: div?.wells?.[0]?.well || '',
      countyState: div.countyState,
    };
    return data;
  });

  let counter = 0;
  const getTableRowBackgroundColor = () => {
    counter++;
    return counter % 2 === 0 ? '#434857' : '#252830';
  };

  const handleAddNewDivision = () => {
    navigate('/division/new', {
      state: { contactId, fileId, deedId },
    });
  };

  return (
    <Grid item xs={12}>
      <Box
        sx={{
          display: 'flex',
          marginBottom: 3,
        }}
      >
        <Typography color="white" ml={2} mr={4} id="division-count">
          {t('numOfDivision')} {data?.data?.count || 0}
        </Typography>
        <Button
          id="new-division-button"
          variant="outlined"
          onClick={handleAddNewDivision}
          sx={{
            '&:disabled': {
              opacity: 0.2,
              cursor: 'not-allowed',
              borderColor: '#1997c6',
              color: '#fff',
            },
          }}
        >
          {t('addDivisionButton')}
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
          <Typography color="white" ml={2} mb={2} id="noDivisionMsg">
            {t('noDivisionOrders')}
          </Typography>
        </Box>
      )}
      {!!data?.data?.count && (
        <NewTable
          tableId="divisionTable"
          data={formattedData || []}
          count={data?.data?.count || 0}
          initialLoading={DivisionLoading}
          columns={columns}
          initialSortBy="companyName,notified"
          initialSortOrder="asc,asc"
          getDataWithoutPagination={getDataWithoutPagination}
          loading={isFetching}
          message={data?.data && data?.message ? data?.message : ''}
          id={Number(deedId)}
          getTableRowBackgroundColor={getTableRowBackgroundColor}
          getTextColor={'white'}
          isWithoutPagination={true}
        />
      )}
    </Grid>
  );
};

export default DivisionTabContent;
