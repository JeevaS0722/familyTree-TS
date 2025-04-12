import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { useLazyGetReadyForOfferQuery } from '../../../store/Services/dashboardService';
import { QueryParams, TableColumns } from '../../../interface/common';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { open } from '../../../store/Reducers/snackbar';
import { severity } from '../../../interface/snackbar';
import {
  useGetUserListQuery,
  useGetUserQuery,
} from '../../../store/Services/userService';
import { Link } from 'react-router-dom';
import { useCheckoutFileMutation } from '../../../store/Services/fileService';
import { getTableRowBackgroundColor } from '../../../utils/file/utils';
import CommonModal from '../../../component/commonModal/CommonModal';
import FilterListIcon from '@mui/icons-material/FilterList';
import Badge from '@mui/material/Badge';
import { User } from '../../../interface/user';
import { SearchReadyForOfferQueryParams } from '../../../interface/dashboard';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import NewTable from '../../../component/Table';

const TableContainer = styled('div')<{ isModalOpen: boolean }>(
  ({ isModalOpen }) => ({
    width: isModalOpen ? '73%' : '100%',
    float: 'right',
    padding: '16px',
  })
);

const ReadyForOffer: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const { t: et } = useTranslation('errors');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [checkoutFile] = useCheckoutFileMutation();
  const [checkoutFileId, setCheckoutFileId] = useState<number | null>(null);
  const { data: userData } = useGetUserListQuery();
  const [refreshList, setRefreshList] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterParams, setFilterParams] = useState({});
  const handleOpenModal = () => setIsModalOpen(!isModalOpen);
  const handleCloseModal = () => setIsModalOpen(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const handleFilterChange = (count: number) => {
    setActiveFilterCount(count);
  };
  const [dropDownValue, setDropDownValue] = useState<{ users: Array<object> }>({
    users: [],
  });

  useEffect(() => {
    if (userData && userData.data && userData.data) {
      setDropDownValue(prevState => ({
        ...prevState,
        users: userData?.data?.map((user: User) => ({
          headerName: user.userId,
          value: user.userId,
          id: user.userId,
        })),
      }));
    }
  }, [userData]);

  const getFilteredData = ({
    modifiedBy,
    fileName,
    returnDate,
    returnDate_condition,
    returnDate_from,
    returnDate_to,
    totalFileValue_max,
    totalFileValue_min,
    totalFileValue_condition,
    totalFileValue,
    pageNo,
    size,
    orderBy,
    order,
  }: SearchReadyForOfferQueryParams) => {
    setFilterParams({
      modifiedBy,
      fileName,
      returnDate,
      returnDate_condition,
      returnDate_from,
      returnDate_to,
      totalFileValue_max,
      totalFileValue_min,
      totalFileValue_condition,
      totalFileValue,
      pageNo: pageNo || 1,
      size: size || 100,
      orderBy,
      order,
    });
    const apiParams = {
      modifiedBy,
      fileName,
      returnDate,
      returnDate_condition,
      returnDate_from,
      returnDate_to,
      totalFileValue_max,
      totalFileValue_min,
      totalFileValue_condition,
      totalFileValue,
      pageNo: pageNo || 1,
      size: size || 100,
      order: order || 'asc,asc',
      orderBy: orderBy || 'totalFileValue,fileName',
    };
    void getReadyForOffer(apiParams);
    if (isMobile) {
      handleCloseModal();
    }
  };
  const [
    getReadyForOffer,
    { data, isLoading: readyForOfferLoading, isFetching },
  ] = useLazyGetReadyForOfferQuery();

  const clearCheckout = () => {
    setCheckoutFileId(null);
  };

  const handleCheckout = async (fileId: number) => {
    try {
      setCheckoutFileId(fileId);
      const response = await checkoutFile({ fileId });
      if ('error' in response) {
        setCheckoutFileId(null);
        clearCheckout();
      }
      if ('data' in response) {
        if (response?.data?.success) {
          setRefreshList(!refreshList);
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
        }
      }
    } catch (error) {
      setCheckoutFileId(null);
      dispatch(
        open({
          severity: severity.error,
          message: et('error'),
        })
      );
    }
  };

  const columns: TableColumns[] = [
    {
      headerName: t('totalFileValue'),
      field: 'totalFileValue',
      sortable: true,
      filterable: true,
      type: 'amount',
      width: 300,
    },
    {
      headerName: `${t('fileName')} (${t('clickToView')})`,
      field: 'fileName',
      cellRenderer: params => (
        <Link
          key={String(params.data?.fileId)}
          id="fileNameLink"
          to={`/editfile/${params.data?.fileId}`}
          className="hover-link"
        >
          {params.data?.fileName}
        </Link>
      ),
      sortable: true,
      filterable: true,
      condition: 'and',
      width: 500,
    },
    {
      headerName: t('requestedBy'),
      field: 'modifiedBy',
      sortable: true,
      filterable: true,
      options: dropDownValue.users,
      condition: 'and',
      type: 'dropdown',
      width: 300,
    },
    {
      headerName: t('createDate'),
      field: 'returnDate',
      sortable: true,
      filterable: true,
      condition: 'and',
      type: 'date',
      width: 320,
    },
  ];

  const buyerColumns: TableColumns[] = [
    ...columns,
    {
      headerName: t('checkOut'),
      field: 'checkOut',
      cellRenderer: params => (
        <Button
          id="checkoutButton"
          onClick={() => {
            const fileId = params.data.fileId as unknown as number;
            void handleCheckout(fileId);
          }}
          disabled={params.data.fileId === checkoutFileId}
          variant="outlined"
        >
          {t('checkOut')}
        </Button>
      ),
      sortable: false,
      width: 300,
    },
  ];

  const { isLoading } = useGetUserQuery('');
  const user = useAppSelector(state => state.user);

  const dispatch = useAppDispatch();

  const getColumns = () => {
    if (user.department === 'Buyer') {
      return buyerColumns;
    }
    return columns;
  };

  const getData = ({ page, rowsPerPage, sortBy, sortOrder }: QueryParams) => {
    void getReadyForOffer({
      ...filterParams,
      pageNo: page,
      size: rowsPerPage,
      order: sortOrder,
      orderBy: sortBy,
    });
  };

  useEffect(() => {
    if (checkoutFileId && !isFetching) {
      clearCheckout();
    }
  }, [isFetching]);

  return (
    <Container fixed>
      <TableContainer isModalOpen={isModalOpen}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Typography sx={{ color: 'white', pt: 2 }} variant="h6" id="title">
              {`${t('readyForOffer')} (${data && 'data' in data ? data.data.count : 0} ${t('files')})`}
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
              tableId="Ready-for-Offer"
              data={data && 'data' in data ? data.data.records : []}
              count={data && 'data' in data ? data.data.count : 0}
              initialLoading={readyForOfferLoading}
              message={data && 'data' in data ? data.message : ''}
              columns={getColumns()}
              loading={isFetching}
              getData={getData}
              tableLoading={isLoading}
              initialSortBy="totalFileValue,fileName"
              initialSortOrder="asc,asc"
              getTableRowBackgroundColor={getTableRowBackgroundColor}
              refreshList={refreshList}
            />
          </Grid>
        </Grid>
      </TableContainer>
      <CommonModal
        isOpen={isModalOpen}
        handleClose={handleCloseModal}
        title="Filter"
        columns={getColumns()}
        onFilterChange={handleFilterChange}
        getFilteredDataTrigger={getFilteredData}
      />
    </Container>
  );
};

export default ReadyForOffer;
