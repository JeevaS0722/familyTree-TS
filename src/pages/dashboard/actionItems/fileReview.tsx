import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import { useLazyGetFileReviewQuery } from '../../../store/Services/dashboardService';
import { QueryParams, TableColumns } from '../../../interface/common';
import { useAppSelector } from '../../../store/hooks';
import { Link } from 'react-router-dom';
import { getTableRowBackgroundColor } from '../../../utils/file/utils';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import CommonModal from '../../../component/commonModal/CommonModal';
import { styled } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import Badge from '@mui/material/Badge';
import { FileReviewParams } from '../../../interface/dashboard';
import { User } from '../../../interface/user';
import { useGetUserListQuery } from '../../../store/Services/userService';
import NewTable from '../../../component/Table';

const TableContainer = styled('div')<{ isModalOpen: boolean }>(
  ({ isModalOpen }) => ({
    width: isModalOpen ? '73%' : '100%',
    float: 'right',
    padding: '16px',
  })
);
const FileReview: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const theme = useTheme();
  const user = useAppSelector(state => state.user);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [filterParams, setFilterParams] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCloseModal = () => setIsModalOpen(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const handleFilterChange = (count: number) => {
    setActiveFilterCount(count);
  };
  const { data: userData } = useGetUserListQuery();
  const handleToggleModal = () => {
    setIsModalOpen(prevState => !prevState);
  };
  const [dropDownValue, setDropDownValue] = useState<{ users: Array<object> }>({
    users: [],
  });
  useEffect(() => {
    if (userData && userData.data && userData.data) {
      setDropDownValue(prevState => ({
        ...prevState,
        users: userData?.data?.map((user: User) => ({
          label: user.userId,
          value: user.fullName,
          id: user.userId,
        })),
      }));
    }
  }, [userData]);
  const columns: TableColumns[] = [
    {
      headerName: t('totalFileValue'),
      field: 'totalFileValue',
      sortable: true,
      filterable: true,
      type: 'amount',
      condition: '',
      width: 300,
    },
    {
      headerName: `${t('fileName')}`,
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
      width: 400,
    },
    {
      headerName: t('buyer'),
      field: 'buyer',
      sortable: true,
      filterable: true,
      options: dropDownValue.users,
      type: 'dropdown',
      condition: 'and',
      width: 240,
    },
    {
      headerName: t('requestedBy'),
      field: 'modifiedBy',
      sortable: true,
      filterable: !['BuyerAsst', 'BuyerResearch'].includes(
        user?.department ?? ''
      ),
      options: dropDownValue.users,
      type: 'dropdown',
      condition: 'and',
      width: 240,
    },
    {
      headerName: t('date'),
      field: 'returnDate',
      sortable: true,
      type: 'date',
      condition: 'and',
      filterable: true,
      width: 240,
    },
  ];

  const [getFileReview, { data, isLoading: fileReviewLoading, isFetching }] =
    useLazyGetFileReviewQuery();

  const getData = ({ page, rowsPerPage, sortBy, sortOrder }: QueryParams) => {
    void getFileReview({
      ...filterParams,
      pageNo: page,
      size: rowsPerPage,
      order: sortOrder,
      orderBy: sortBy,
    });
  };
  const getFilteredData = ({ ...otherParams }: FileReviewParams) => {
    setFilterParams(otherParams);
    const apiParams = {
      ...otherParams,
      pageNo: 1,
      size: 100,
      order: 'desc,asc',
      orderBy: 'totalFileValue,fileName',
    };
    void getFileReview(apiParams);
    if (isMobile) {
      setIsModalOpen(false);
    }
  };

  return (
    <Container fixed>
      <TableContainer isModalOpen={isModalOpen}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Typography sx={{ color: 'white', pt: 2 }} variant="h6" id="title">
              {`${t('fileReview')} (${data && 'data' in data ? data.data.count : 0} ${t('files')})`}
              <Button
                type="submit"
                id="search-modal-toggle"
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
                onClick={handleToggleModal}
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
                Search
              </Button>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <NewTable
              tableId="File-Review"
              data={data && 'data' in data ? data.data.records : []}
              count={data && 'data' in data ? data.data.count : 0}
              initialLoading={fileReviewLoading}
              columns={columns}
              initialSortBy="totalFileValue,fileName"
              initialSortOrder="desc,asc"
              getData={getData}
              loading={isFetching}
              message={data && 'data' in data ? data.message : ''}
              getTableRowBackgroundColor={getTableRowBackgroundColor}
            />
          </Grid>
        </Grid>
      </TableContainer>
      <CommonModal
        isOpen={isModalOpen}
        handleClose={handleCloseModal}
        title="Filter"
        columns={columns}
        onFilterChange={handleFilterChange}
        getFilteredDataTrigger={getFilteredData}
      />
    </Container>
  );
};

export default FileReview;
