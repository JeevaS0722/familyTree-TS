/* eslint-disable complexity */
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLazyGetFilesByNameOrPhoneQuery } from '../../store/Services/searchService';
import { useTranslation } from 'react-i18next';
import {
  FileByNameOrPhoneQueryParams,
  NameOrPhone,
} from '../../interface/searchFileByNameOrPhone';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { TFunction } from 'i18next';
import {
  isSearchForNaN,
  phoneFormat,
  formatDateToMonthDayYear,
} from '../../utils/GeneralUtil';
import { QueryParams, TableColumns } from '../../interface/common';
import CustomModel from '../../component/common/CustomModal';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  createDeedConfirmation,
  deedBuyerAlert,
  deedContactAlert,
} from '../../utils/constants';
import { useCreateDeedMutation } from '../../store/Services/deedService';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import { File } from '../../interface/searchFile';
import { setSearchFilter } from '../../store/Reducers/searchReducer';
import NewTable from '../../component/Table';

const SearchResult: React.FC = () => {
  const { t } = useTranslation('searchFileByNameOrPhone');
  const searchFilter = useAppSelector(state => state.searchFilters);
  const filter = searchFilter[
    'searchResultTable'
  ] as FileByNameOrPhoneQueryParams;
  const initialFormValues: FileByNameOrPhoneQueryParams = {
    searchFor: filter?.searchFor ?? '',
    pageNo: filter?.pageNo ?? 1,
    size: filter?.size ?? 100,
    orderBy: filter?.sortBy ?? 'fileName',
    order: filter?.sortOrder ?? 'asc',
  };
  const navigate = useNavigate();
  const [createDeed] = useCreateDeedMutation();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [getFilesByNameOrPhone, { data: filesData, isLoading, isFetching }] =
    useLazyGetFilesByNameOrPhoneQuery();
  const [searchForQuery, setSearchForQuery] = useState<string | null>(
    filter?.searchFor ?? ''
  );
  const { t: et } = useTranslation('errors');
  const [openModel, setOpenModel] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState<string>('');
  const [infoTitle, setInfoTitle] = React.useState<string>('');
  const handleOpen = () => setOpenModel(true);
  const handleClose = () => setOpenModel(false);
  const [selectedContactID, setSelectedContactID] = React.useState<
    number | null
  >(null);
  const [isCreateDeedLoading, setIsCreateDeedLoading] = React.useState(false);
  const [infoOpen, setInfoOpen] = React.useState(false);
  const handleInfoOpen = () => setInfoOpen(true);
  const handleInfoClose = () => setInfoOpen(false);
  const [selectedFileID, setSelectedFileID] = React.useState<number | null>(
    null
  );
  const [formValues, setFormValues] =
    useState<FileByNameOrPhoneQueryParams>(initialFormValues);

  const handleEmptyDateValue = (value: string | undefined | null) => {
    if (!value || value === '0000/00/00' || value === '0000-00-00') {
      return '';
    }
    return formatDateToMonthDayYear(value).toString();
  };

  useEffect(() => {
    if (filter?.searchFor) {
      void getFilesByNameOrPhone({
        searchFor: filter?.searchFor ?? '',
        pageNo: filter?.pageNo,
        size: filter?.size,
        orderBy: filter?.sortBy ?? 'fileName',
        order: filter?.sortOrder ?? 'asc',
      });
    }
  }, [filter?.searchFor]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const initionalSearchForQuery = searchParams.get('searchFor');
    if (initionalSearchForQuery) {
      setSearchForQuery(initionalSearchForQuery);
    } else {
      navigate('/');
    }
  }, [location.key, location.search]);

  useEffect(() => {
    if (
      (searchForQuery && !filter?.searchFor) ||
      searchForQuery !== filter?.searchFor
    ) {
      setFormValues({
        searchFor: searchForQuery ?? '',
        pageNo: 1,
        size: 100,
        orderBy: 'fileName',
        order: 'asc',
      });
      dispatch(
        setSearchFilter({
          tableId: 'searchResultTable',
          filters: {
            searchFor: searchForQuery,
            pageNo: 1,
            size: 100,
            orderBy: 'fileName,contactName',
            order: 'asc,asc',
            page: 0,
            rowsPerPage: 100,
            sortBy: 'fileName,contactName',
            sortOrder: 'asc,asc',
          },
        })
      );
    }
  }, [searchForQuery]);

  const localizeColumns = (
    t: TFunction,
    searchForQuery: string
  ): TableColumns[] => {
    const isSearchNaN = isSearchForNaN(searchForQuery);
    const ColumnForName: TableColumns[] = [
      {
        headerName: t('fileName'),
        field: 'fileName',
        headerEdit: false,
        cellRenderer: params => (
          <Link
            key={String(params.data?.fileID)}
            to={`/editfile/${params.data?.fileID}`}
            className="hover-link"
          >
            {params.data?.fileName}
          </Link>
        ),
        editable: false,
        sortable: true,
        width: 400,
      },
      {
        headerName: t('contactName'),
        field: 'contactName',
        cellRenderer: params =>
          params.data?.contactID ? (
            <Link
              to={`/editcontact/${params.data.contactID}`}
              className="hover-link"
            >
              {params.data.contactName || '-'}
            </Link>
          ) : (
            <Typography display="inline" sx={{ color: '#1997c6' }}>
              {'-'}
            </Typography>
          ),
        sortable: true,
        width: 400,
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
        width: 100,
      },
      {
        headerName: t('deedReturned'),
        field: 'returnDate',
        cellRenderer: params =>
          params.data?.deedID ? (
            <Link to={`/editdeed/${params.data.deedID}`} className="hover-link">
              {handleEmptyDateValue(params.data.returnDate)
                ? `${handleEmptyDateValue(params.data.returnDate)} - ${params.data.county}`
                : '-'}
            </Link>
          ) : (
            <Typography display="inline" sx={{ color: '#1997c6' }}>
              {'-'}
            </Typography>
          ),
        sortable: true,
        width: 200,
      },
      {
        headerName: t('buyer'),
        field: 'buyer',
        sortable: true,
        width: 200,
      },
      {
        headerName: t('legalsState'),
        field: 'legalsState',
        sortable: true,
        width: 200,
      },
      {
        headerName: t('legalsCounty'),
        field: 'legalsCounty',
        sortable: true,
        width: 200,
      },
      {
        headerName: t('newDeedReturned'),
        field: 'newDeed',
        cellRenderer: params => (
          <Button
            onClick={() => handleDeedAlert(params.data)}
            sx={{
              color: '#1997c6',
              border: '1px solid #1997c6',
              '&:hover': {
                backgroundColor: '#1672a3',
                color: '#fff',
              },
              width: '200px',
            }}
            id={
              params.data?.deedID
                ? `deed-return-button-${params.data?.contactID}-${params.data?.deedID}`
                : `deed-return-button-${params.data?.contactID}`
            }
          >
            {t('newDeedReturned')}
          </Button>
        ),
        sortable: false,
        width: 250,
      },
    ];
    const ColumnForPhone: TableColumns[] = [
      {
        headerName: t('fileName'),
        field: 'fileName',
        cellRenderer: params => (
          <Link
            key={String(params.data?.fileID)}
            to={`/editfile/${params.data?.fileID}`}
            className="hover-link"
          >
            {params.data?.fileName}
          </Link>
        ),
        sortable: true,
        width: 400,
      },
      {
        headerName: t('contactName'),
        field: 'contactName',
        cellRenderer: params =>
          params.data?.contactID ? (
            <Link
              to={`/editcontact/${params.data.contactID}`}
              className="hover-link"
            >
              {params.data.contactName || '-'}
            </Link>
          ) : (
            <Typography display="inline" sx={{ color: '#1997c6' }}>
              {'-'}
            </Typography>
          ),
        sortable: true,
        width: 400,
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
      },
      {
        headerName: t('buyer'),
        field: 'buyer',
        sortable: true,
      },
      {
        headerName: t('legalsState'),
        field: 'legalsState',
        sortable: true,
      },
      {
        headerName: t('phone'),
        field: 'phoneNo',
        sortable: true,
        width: 220,
      },
    ];
    return isSearchNaN ? ColumnForName : ColumnForPhone;
  };
  const columns = localizeColumns(t, formValues.searchFor);
  const getData = ({ page, rowsPerPage, sortBy, sortOrder }: QueryParams) => {
    if (formValues?.searchFor) {
      void getFilesByNameOrPhone({
        searchFor: formValues?.searchFor,
        pageNo: page,
        size: rowsPerPage,
        order: sortOrder,
        orderBy: sortBy,
      });
    }
  };
  const formattedData = filesData?.files?.map(file => {
    const isSearchNaN = isSearchForNaN(formValues.searchFor);
    if (isSearchNaN) {
      return {
        ...file,
      };
    } else {
      return {
        ...file,
        phoneNo: file?.phoneNo ? phoneFormat(file?.phoneNo ?? '') : '',
      };
    }
  });
  const handleDeedAlert = (row: File | NameOrPhone) => {
    let modalTitle = '';
    setSelectedFileID(null);
    setSelectedContactID(null);
    handleClose();
    if ('buyer' in row && !row.buyer) {
      modalTitle = deedBuyerAlert;
    } else if ('contactID' in row && !row.contactID) {
      modalTitle = deedContactAlert;
    } else if ('contactID' in row && row.contactID) {
      setInfoOpen(false);
      setSelectedFileID(row.fileID);
      setSelectedContactID(row.contactID);
      setModalTitle(`${createDeedConfirmation} ${row.contactName}?`);
      handleOpen();
      return;
    }
    setInfoTitle(modalTitle);
    handleInfoOpen();
    return;
  };

  const handleCreateDeed = async () => {
    handleClose();
    if (selectedFileID && selectedContactID) {
      try {
        setIsCreateDeedLoading(true);
        const response = await createDeed({
          fileId: Number(selectedFileID),
          contactId: Number(selectedContactID),
        });
        if ('error' in response) {
          setIsCreateDeedLoading(false);
        }
        if ('data' in response && response?.data?.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          if (response?.data?.warning) {
            dispatch(
              open({
                severity: severity.warning,
                message: response?.data?.warning,
                persist: true,
              })
            );
          }
          setIsCreateDeedLoading(false);
          navigate(`/editdeed/${Number(response?.data?.data.deedId)}`);
        }
      } catch (error) {
        dispatch(
          open({
            severity: severity.error,
            message: et('error'),
          })
        );
        setIsCreateDeedLoading(false);
      }
    }
  };
  return (
    <>
      <Container component="main" fixed>
        <Typography
          id="searchResult"
          variant="h4"
          component="p"
          gutterBottom
          sx={{ color: 'white', fontSize: '24px', mt: '50px' }}
        >
          {t('searchResults', { searchFor: formValues?.searchFor })}
        </Typography>

        <Grid item xs={12}>
          {!filesData?.count &&
            !isLoading &&
            !isFetching &&
            formValues?.searchFor && (
              <Box display="flex" flexDirection="column">
                <Typography
                  component="p"
                  variant="h5"
                  sx={{ color: 'white', fontSize: '24px' }}
                >
                  {!isSearchForNaN(formValues?.searchFor)
                    ? t('contactNotFound', {
                        searchFor: formValues?.searchFor,
                      })
                    : t('fileNotFound', {
                        searchFor: formValues?.searchFor,
                      })}
                </Typography>
              </Box>
            )}
          {(filesData?.count || isLoading || !formValues?.searchFor) && (
            <Box sx={{ mt: 4 }}>
              {/* <CustomizedTable
                tableId="searchResultTable"
                data={formattedData || []}
                count={filesData && 'count' in filesData ? filesData?.count : 0}
                getData={getData}
                initialLoading={isLoading || !formValues?.searchFor}
                columns={columns}
                initialSortBy="fileName,contactName"
                initialSortOrder="asc,asc"
                loading={isFetching}
                message={
                  filesData && 'offers' in filesData ? filesData.message : ''
                }
              /> */}
              <NewTable
                columns={columns}
                data={formattedData || []}
                loading={isFetching}
                initialLoading={isLoading || !formValues?.searchFor}
                tableId={`searchResultTable_${isSearchForNaN(formValues.searchFor) ? 'name' : 'phone'}`}
                count={filesData && 'count' in filesData ? filesData?.count : 0}
                getData={getData}
                initialSortBy="fileName,contactName"
                initialSortOrder="asc,asc"
                message={
                  filesData && 'offers' in filesData ? filesData.message : ''
                }
              />
            </Box>
          )}
        </Grid>

        <CustomModel
          open={infoOpen}
          handleClose={handleInfoClose}
          modalHeader="Info"
          modalTitle={infoTitle}
        />
        <CustomModel
          open={openModel}
          handleClose={handleClose}
          handleDelete={handleCreateDeed}
          modalHeader="Create Deed"
          modalTitle={modalTitle}
          modalButtonLabel="Yes"
        />
        {isCreateDeedLoading && (
          <Modal
            open={isCreateDeedLoading}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress size={25} color="inherit" />
          </Modal>
        )}
      </Container>
    </>
  );
};

export default SearchResult;
