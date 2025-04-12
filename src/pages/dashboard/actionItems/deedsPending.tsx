import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useLazyGetDeedsPendingQuery } from '../../../store/Services/dashboardService';
import { QueryParams, TableColumns } from '../../../interface/common';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import CommonModal from '../../../component/commonModal/CommonModal';
import FilterListIcon from '@mui/icons-material/FilterList';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import { SearchDeedsPendingQueryParams } from '../../../interface/dashboard';
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

const DeedsPending: React.FC = () => {
  const { t } = useTranslation('dashboard');
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

  const columns: TableColumns[] = [
    {
      headerName: `${t('fileName')} (${t('clickToView')})`,
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
      headerName: t('contactName'),
      field: 'contactName',
      cellRenderer: params => (
        <Link
          key={String(params.data.contactId)}
          id="contactNameLink"
          to={'/editcontact/' + params.data.contactId}
          state={{ fileId: params.data.fileId }}
          className="hover-link"
        >
          {params.data.contactName}
        </Link>
      ),
      sortable: true,
      filterable: true,
      condition: 'and',
      width: 300,
    },
    {
      headerName: t('main'),
      field: 'main',
      cellRenderer: params => (
        <span style={{ color: '#000000' }}>
          {params.data?.main === 1 ? 'Yes' : ''}
        </span>
      ),
      sortable: true,
      filterable: true,
      condition: 'and',
      type: 'checkbox',
    },
    {
      headerName: t('deedReturnedDate'),
      field: 'returnedDate',
      cellRenderer: params => (
        <Link
          id="deedLink"
          to={'/editdeed/' + params.data.deedId}
          className="hover-link"
        >
          {params.data.returnedDate}
        </Link>
      ),
      sortable: true,
      filterable: true,
      condition: 'and',
      type: 'date',
      width: 200,
    },
    {
      headerName: t('buyer'),
      field: 'buyer',
      sortable: true,
      filterable: true,
      condition: 'and',
      type: 'dropdown',
    },
    {
      headerName: t('county'),
      field: 'county',
      sortable: true,
      filterable: true,
      condition: 'and',
    },
    {
      headerName: t('purchaseAmount'),
      field: 'purchaseAmount',
      sortable: true,
      filterable: true,
      type: 'amount',
      width: 200,
    },
    {
      headerName: t('finalPaymentDate'),
      field: 'finalPaymentDate',
      sortable: true,
      filterable: true,
      condition: 'and',
      type: 'date',
      width: 200,
    },
    {
      headerName: t('totalPurchased'),
      field: 'ownership',
      sortable: true,
      filterable: true,
      condition: 'and',
      type: 'percentage',
    },
    {
      headerName: t('totalFileValue'),
      field: 'totalFileValue',
      sortable: true,
      filterable: true,
      condition: 'and',
      type: 'amount',
    },
  ];

  const [
    getDeedsPending,
    { data, isLoading: deedsPendingLoading, isFetching },
  ] = useLazyGetDeedsPendingQuery();

  const getData = ({ page, rowsPerPage, sortBy, sortOrder }: QueryParams) => {
    void getDeedsPending({
      ...filterParams,
      pageNo: page,
      size: rowsPerPage,
      order: sortOrder,
      orderBy: sortBy,
    });
  };

  const getFilteredData = ({
    fileName,
    contactName,
    buyer,
    county,
    returnedDate_condition,
    returnedDate,
    returnedDate_from,
    returnedDate_to,
    totalFileValue_condition,
    totalFileValue_max,
    totalFileValue_min,
    totalFileValue,
    purchaseAmount_condition,
    purchaseAmount,
    purchaseAmount_min,
    purchaseAmount_max,
    finalPaymentDate_condition,
    finalPaymentDate,
    finalPaymentDate_from,
    finalPaymentDate_to,
    ownership_condition,
    ownership,
    ownership_min,
    ownership_max,
    main,
    pageNo,
    size,
    orderBy,
    order,
  }: SearchDeedsPendingQueryParams) => {
    setFilterParams({
      fileName,
      contactName,
      buyer,
      county,
      returnedDate_condition,
      returnedDate,
      returnedDate_from,
      returnedDate_to,
      totalFileValue_condition,
      totalFileValue_max,
      totalFileValue_min,
      totalFileValue,
      purchaseAmount_condition,
      purchaseAmount,
      purchaseAmount_min,
      purchaseAmount_max,
      finalPaymentDate_condition,
      finalPaymentDate,
      finalPaymentDate_from,
      finalPaymentDate_to,
      totalPurchased_condition: ownership_condition,
      totalPurchased: ownership,
      totalPurchased_min: ownership_min,
      totalPurchased_max: ownership_max,
      main,
      pageNo: pageNo || 1,
      size: size || 100,
      orderBy: orderBy || 'fileName,contactName',
      order: order || 'asc,asc',
    });

    const apiParams = {
      fileName,
      contactName,
      buyer,
      county,
      returnedDate_condition,
      returnedDate,
      returnedDate_from,
      returnedDate_to,
      totalFileValue_condition,
      totalFileValue_max,
      totalFileValue_min,
      totalFileValue,
      purchaseAmount_condition,
      purchaseAmount,
      purchaseAmount_min,
      purchaseAmount_max,
      finalPaymentDate_condition,
      finalPaymentDate,
      finalPaymentDate_from,
      finalPaymentDate_to,
      totalPurchased_condition: ownership_condition,
      totalPurchased: ownership,
      totalPurchased_min: ownership_min,
      totalPurchased_max: ownership_max,
      main,
      pageNo: pageNo || 1,
      size: size || 100,
      orderBy: orderBy || 'fileName,contactName',
      order: order || 'asc,asc',
    };
    void getDeedsPending(apiParams);
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
              {`${t('deedsPending')} (${data && 'data' in data ? data.data.count : 0} ${t('files')})`}
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
              tableId="Deeds-Pending"
              data={data && 'data' in data ? data.data.records : []}
              count={data && 'data' in data ? data.data.count : 0}
              initialLoading={deedsPendingLoading}
              columns={columns}
              initialSortBy="fileName,contactName"
              initialSortOrder="asc,asc"
              getData={getData}
              loading={isFetching}
              message={data && 'data' in data ? data.message : ''}
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

export default DeedsPending;
