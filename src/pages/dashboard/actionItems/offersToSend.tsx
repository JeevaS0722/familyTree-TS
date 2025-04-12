import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useLazyGetOffersToSendQuery } from '../../../store/Services/dashboardService';
import {
  LetterType,
  OfferType,
  QueryParams,
  TableColumns,
} from '../../../interface/common';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import CommonModal from '../../../component/commonModal/CommonModal';
import FilterListIcon from '@mui/icons-material/FilterList';
import Badge from '@mui/material/Badge';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import {
  getFileColor,
  getTableRowBackgroundColor,
} from '../../../utils/file/utils';
import { useGetUserListQuery } from '../../../store/Services/userService';
import { User } from '../../../interface/user';
import {
  useGetLetterTypeQuery,
  useGetOfferTypeQuery,
} from '../../../store/Services/commonService';
import { SearchOfferToSendQueryParams } from '../../../interface/dashboard';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { nl2br } from '../../../utils/GeneralUtil';
import Tooltip from '@mui/material/Tooltip';
import ErrorIcon from '@mui/icons-material/Error';
import NewTable from '../../../component/Table';

const TableContainer = styled('div')<{ isModalOpen: boolean }>(
  ({ isModalOpen }) => ({
    width: isModalOpen ? '73%' : '100%',
    float: 'right',
    padding: '16px',
  })
);

const OffersToSend: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const { data: userData } = useGetUserListQuery();
  const { data: offerTypeData } = useGetOfferTypeQuery();
  const { data: letterTypeData } = useGetLetterTypeQuery();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [filterParams, setFilterParams] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(!isModalOpen);
  const handleCloseModal = () => setIsModalOpen(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const handleFilterChange = (count: number) => {
    setActiveFilterCount(count);
  };
  const handleOfferCompleteNavigate = (row: {
    [key: string]: string | number | number[] | null | boolean | undefined;
  }) => {
    navigate('/offer/complete', {
      state: {
        offerId: row.offerId,
        fileColor: getFileColor(row),
        letterType: row.letterType,
        grantors: row.grantors,
      },
    });
  };

  const [dropDownValue, setDropDownValue] = useState<{
    users: Array<object>;
    offerTypes: Array<object>;
    letterTypes: Array<object>;
  }>({
    users: [],
    offerTypes: [],
    letterTypes: [],
  });

  useEffect(() => {
    if (
      userData &&
      userData.data &&
      userData.data &&
      offerTypeData &&
      offerTypeData.data &&
      letterTypeData &&
      letterTypeData.data
    ) {
      setDropDownValue(prevState => ({
        ...prevState,
        users: userData?.data?.map((user: User) => ({
          label: user.userId,
          value: user.userId,
          id: user.userId,
        })),
        offerTypes: offerTypeData.data?.map((type: OfferType) => ({
          label: type.offerTypes,
          value: type.offerTypes,
          id: type.typeID,
        })),
        letterTypes: letterTypeData.data.map((type: LetterType) => ({
          label: type.letterType,
          value: type.letterType,
          id: type.letterID,
        })),
      }));
    }
  }, [userData, offerTypeData]);

  const columns: TableColumns[] = [
    {
      headerName: t('requestedDate'),
      field: 'requestedDate',
      sortable: true,
      filterable: true,
      type: 'date',
    },
    {
      headerName: t('fileName'),
      field: 'fileName',
      cellRenderer: params => (
        <Link
          key={String(params.data.fileId)}
          id="fileNameLink"
          to={'/editfile/' + params.data.fileId}
          className="hover-link"
        >
          {params.data.fileName}
        </Link>
      ),
      sortable: true,
      filterable: true,
      condition: 'and',
      width: 300,
    },
    {
      headerName: t('grantors'),
      field: 'grantors',
      sortable: true,
      filterable: true,
      condition: 'and',
      width: 400,
    },
    {
      headerName: t('totalFileValue'),
      field: 'totalFileValue',
      sortable: true,
      filterable: true,
      condition: 'and',
      type: 'amount',
    },
    {
      headerName: t('offerType'),
      field: 'offerType',
      sortable: true,
      filterable: true,
      options: dropDownValue.offerTypes,
      condition: 'and',
      type: 'dropdown',
    },
    {
      headerName: t('letterType'),
      field: 'letterType',
      sortable: true,
      filterable: true,
      options: dropDownValue.letterTypes,
      condition: 'and',
      type: 'dropdown',
    },
    {
      headerName: `${t('draft')} 1`,
      field: 'draft1',
      sortable: true,
      filterable: true,
      condition: 'and',
      type: 'amount',
    },
    {
      headerName: `${t('draft')} 2`,
      field: 'draft2',
      sortable: true,
      filterable: true,
      condition: 'and',
      type: 'amount',
    },
    {
      headerName: t('address'),
      field: 'address',
      cellRenderer: params => {
        return params.data.address
          ? parse(
              DOMPurify.sanitize(nl2br(String(params.data.address || '')), {
                USE_PROFILES: { html: true },
              })
            )
          : '';
      },
      sortable: true,
      filterable: true,
      condition: 'and',
    },
    {
      headerName: t('city'),
      field: 'city',
      sortable: true,
      filterable: true,
      condition: 'and',
    },
    {
      headerName: t('state'),
      field: 'state',
      sortable: true,
      filterable: true,
      condition: 'and',
      type: 'dropdown',
    },
    {
      headerName: t('zip'),
      field: 'zip',
      sortable: true,
      filterable: true,
      condition: 'and',
    },
    {
      headerName: t('email'),
      field: 'email',
      cellRenderer: params => (
        <div>
          {Array.isArray(params.data?.email) &&
            params.data?.email?.map((data, index) => (
              <div
                key={index}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                {/* Show Tooltip only if emailDesc is 'Bad' */}
                {data?.emailDesc === 'Bad' ? (
                  <Tooltip
                    title="This is marked as bad."
                    enterTouchDelay={0}
                    arrow
                    PopperProps={{
                      modifiers: [
                        {
                          name: 'offset',
                          options: {
                            offset: [0, -15],
                          },
                        },
                      ],
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <Link
                        id="emailLink"
                        to={`mailto:${data.email}`}
                        className="hover-link"
                        color="primary"
                      >
                        {data?.email}
                      </Link>
                      <ErrorIcon
                        onTouchStart={e => e.preventDefault()}
                        style={{
                          color: 'red',
                          fontSize: '18px',
                          marginLeft: '5px',
                          verticalAlign: 'middle',
                        }}
                      />
                    </span>
                  </Tooltip>
                ) : (
                  <span>
                    <Link
                      id="emailLink"
                      to={`mailto:${data.email}`}
                      className="hover-link"
                      color="primary"
                    >
                      {data?.email}
                    </Link>
                  </span>
                )}
              </div>
            ))}
        </div>
      ),
      sortable: false,
      filterable: true,
      condition: 'and',
      width: 300,
    },
    {
      headerName: t('Phone'),
      field: 'phone',
      cellRenderer: params => (
        <div>
          {Array.isArray(params.data?.phone) &&
            params.data?.phone?.map((data, index) => (
              <div
                key={index}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                {data?.phoneDesc === 'Bad' ? (
                  <Tooltip
                    title="This is marked as bad."
                    enterTouchDelay={0}
                    arrow
                    PopperProps={{
                      modifiers: [
                        {
                          name: 'offset',
                          options: {
                            offset: [0, -15],
                          },
                        },
                      ],
                    }}
                  >
                    <span>
                      {data?.phoneNo}
                      <ErrorIcon
                        onTouchStart={e => e.preventDefault()}
                        style={{
                          color: 'red',
                          fontSize: '18px',
                          marginLeft: '5px',
                          verticalAlign: 'middle',
                        }}
                      />
                    </span>
                  </Tooltip>
                ) : (
                  <span>{data?.phoneNo}</span>
                )}
              </div>
            ))}
        </div>
      ),
      sortable: false,
      filterable: true,
      condition: 'and',
      width: 300,
    },
    {
      headerName: t('requestedBy'),
      field: 'requestedBy',
      sortable: true,
      options: dropDownValue.users,
      filterable: true,
      condition: 'and',
      type: 'dropdown',
    },
    {
      headerName: t('specialInstruction'),
      field: 'specialInstruction',
      sortable: true,
      filterable: true,
      condition: 'and',
      width: 400,
    },
    {
      headerName: t('createDeed'),
      field: 'createDeed',
      cellRenderer: params => (
        <Link
          key={String(params.data.offerID)}
          to={`/offer/letter?offerId=${params.data.offerId}&offerType=${encodeURIComponent(params.data.offerType)}&grantors=${encodeURIComponent(JSON.stringify(params.data.grantors))}&fileId=${params.data.fileId}&contactId=${params.data.contactId}`}
          className="hover-link"
        >
          {t('deedOrLetter')}
        </Link>
      ),
      sortable: false,
    },
    {
      headerName: t('completeOffer'),
      field: 'completeOffer',
      cellRenderer: params => (
        <Button
          id="completeButton"
          onClick={() => handleOfferCompleteNavigate(params.data)}
          variant="outlined"
        >
          {t('offerComplete')}
        </Button>
      ),
      sortable: false,
    },
  ];

  const [
    getOffersToSend,
    { data, isLoading: offersToSendLoading, isFetching },
  ] = useLazyGetOffersToSendQuery();

  const getData = ({ page, rowsPerPage, sortBy, sortOrder }: QueryParams) => {
    void getOffersToSend({
      ...filterParams,
      pageNo: page,
      size: rowsPerPage,
      order: sortOrder,
      orderBy: sortBy,
    });
  };
  const getFilteredData = ({
    requestedDate_condition,
    requestedDate,
    requestedDate_from,
    requestedDate_to,
    fileName,
    grantors,
    totalFileValue_condition,
    totalFileValue_max,
    totalFileValue_min,
    totalFileValue,
    offerType,
    letterType,
    draft1_condition,
    draft1,
    draft1_min,
    draft1_max,
    draft2_condition,
    draft2,
    draft2_min,
    draft2_max,
    address,
    city,
    state,
    zip,
    email,
    phone,
    requestedBy,
    specialInstruction,
    page,
    rowsPerPage,
    orderBy,
    order,
  }: SearchOfferToSendQueryParams) => {
    setFilterParams({
      requestedDate_condition,
      requestedDate,
      requestedDate_from,
      requestedDate_to,
      fileName,
      grantors,
      totalFileValue_condition,
      totalFileValue_max,
      totalFileValue_min,
      totalFileValue,
      offerType,
      letterType,
      draft1_condition,
      draft1,
      draft1_min,
      draft1_max,
      draft2_condition,
      draft2,
      draft2_min,
      draft2_max,
      address,
      city,
      state,
      zip,
      email,
      phone,
      requestedBy,
      specialInstruction,
      page,
      rowsPerPage,
      orderBy,
      order,
    });

    const apiParams = {
      requestedDate_condition,
      requestedDate,
      requestedDate_from,
      requestedDate_to,
      fileName,
      grantors,
      totalFileValue_condition,
      totalFileValue_max,
      totalFileValue_min,
      totalFileValue,
      offerType,
      letterType,
      draft1_condition,
      draft1,
      draft1_min,
      draft1_max,
      draft2_condition,
      draft2,
      draft2_min,
      draft2_max,
      address,
      city,
      state,
      zip,
      email,
      phone,
      requestedBy,
      specialInstruction,
      pageNo: page || 1,
      size: rowsPerPage || 100,
      order: order || 'desc,asc',
      orderBy: orderBy || 'requestedDate,fileName',
    };
    void getOffersToSend(apiParams);
    if (isMobile) {
      handleCloseModal();
    }
  };

  return (
    <Container fixed>
      <TableContainer isModalOpen={isModalOpen}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Typography sx={{ color: 'white', pt: 2 }} variant="h6" id="title">
              {`${t('offersToSend')} (${data && 'data' in data ? data.data.count : 0} ${t('offers')})`}
              <Button
                type="submit"
                id="search-MyTask"
                variant="outlined"
                sx={{
                  my: '2rem',
                  marginLeft: '10px',
                  '&:disabled': {
                    opacity: 0.2,
                    cursor: 'not-allowed',
                    backgroundColor: '#1997c6',
                    color: '#fff',
                  },
                }}
                onClick={handleOpenModal}
                endIcon={
                  <Badge
                    badgeContent={activeFilterCount}
                    color="primary"
                    sx={{ '& .MuiBadge-badge': { backgroundColor: '#3f51b5' } }}
                  >
                    <FilterListIcon />
                  </Badge>
                }
              >
                {t('Search')}
              </Button>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <NewTable
              tableId="Offers-to-Send"
              data={data && 'data' in data ? data.data.records : []}
              count={data && 'data' in data ? data.data.count : 0}
              initialLoading={offersToSendLoading}
              message={data && 'data' in data ? data.message : ''}
              columns={columns}
              loading={isFetching}
              getData={getData}
              initialSortBy="requestedDate,fileName"
              initialSortOrder="desc,asc"
              getTableRowBackgroundColor={getTableRowBackgroundColor}
            />
          </Grid>
        </Grid>
        <CommonModal
          isOpen={isModalOpen}
          handleClose={handleCloseModal}
          title="Filter"
          columns={columns}
          onFilterChange={handleFilterChange}
          getFilteredDataTrigger={getFilteredData}
        />
      </TableContainer>
    </Container>
  );
};

export default OffersToSend;
