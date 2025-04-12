import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import { useLazyGetCourtsQuery } from '../../store/Services/searchService';
import { useLazyGetAddressByIdQuery } from '../../store/Services/addressService';
import { useTranslation } from 'react-i18next';
import {
  CourtFormValues,
  Address,
  CourtParams,
} from '../../interface/searchCourts';
import { TFunction } from 'i18next';
import { searchCourtAddressSchema } from '../../schemas/searchCourt';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { QueryParams, TableColumns, TableData } from '../../interface/common';
import { phoneFormat, nl2br } from '../../utils/GeneralUtil';
import { severity } from '../../interface/snackbar';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { open } from '../../store/Reducers/snackbar';
import { setSearchFilter } from '../../store/Reducers/searchReducer';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import StateDropdown from '../../component/common/fields/StateDropdown';
import StyledInputField, {
  CustomInputLabel,
  ErrorText,
} from '../../component/common/CommonStyle';
import NewTable from '../../component/Table';

const CourtSearch: React.FC = () => {
  const { t } = useTranslation('searchCourt');
  const searchFilter = useAppSelector(state => state.searchFilters);
  const filter = searchFilter['searchCourtsTable'] as CourtParams;
  const navigate = useNavigate();
  const location = useLocation();

  const initialFormValues: CourtFormValues = {
    state: filter?.state || '',
    county: filter?.county || '',
  };

  const [formValues, setFormValues] = useState<CourtParams>(
    initialFormValues as CourtParams
  );
  const dispatch = useAppDispatch();
  const [getCourts, { data: courtsData, isLoading, isFetching }] =
    useLazyGetCourtsQuery();

  const [showErrorMessage, setShowErrorMessage] = React.useState(false);
  const [showCreateCourtButton, setShowCreateCourtButton] =
    React.useState(false);
  const [courtData, setCourtData] = useState<Address[]>([]);
  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Function to handle link click and prevent default behavior
  const handleLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    url: string | number | boolean | number[] | null
  ) => {
    event.preventDefault();
    if (typeof url === 'string') {
      openInNewTab(url);
    }
  };

  const localizeColumns = (t: TFunction): TableColumns[] => {
    const columns: TableColumns[] = [
      {
        headerName: t('name'),
        field: 'name',
        cellRenderer: params => (
          <Link
            to={`/editaddress/${params.data.addressID}?isEditView=true`}
            className="hover-link"
          >
            {params.data.name?.toString()}
          </Link>
        ),
        sortable: true,
        width: 300,
      },
      {
        headerName: t('website'),
        field: 'website',
        sortable: true,
        width: 500,
        cellRenderer: params =>
          params.data.website &&
          typeof params.data.website === 'string' &&
          params.data.website !== '' ? (
            <Link
              to={params.data.website}
              onClick={event =>
                handleLinkClick(
                  event,
                  params.data.website ? params.data.website.toString() : ''
                )
              }
              className="hover-link"
            >
              {params.data.website}
            </Link>
          ) : (
            ''
          ),
      },
      {
        headerName: t('form'),
        field: 'form',
        sortable: true,
        cellRenderer: params =>
          params.data.form &&
          typeof params.data.form === 'string' &&
          params.data.form !== '' ? (
            <Link
              to={params.data.form}
              onClick={event =>
                handleLinkClick(
                  event,
                  params.data.form ? params.data.form.toString() : ''
                )
              }
              className="hover-link"
            >
              Open Form
            </Link>
          ) : (
            ''
          ),
      },
      {
        headerName: t('email'),
        field: 'email',
        sortable: true,
        cellRenderer: params => (
          <Link
            to={params.data.email ? `mailto:${params.data.email}` : ''}
            target="_blank"
            rel="noopener noreferrer"
            className="hover-link"
          >
            {params.data.email?.toString()}
          </Link>
        ),
      },
      {
        headerName: t('phone'),
        field: 'phone',
        sortable: true,
        cellRenderer: params =>
          params.data.phone &&
          typeof params.data.phone === 'string' &&
          params.data.phone !== ''
            ? phoneFormat(params.data.phone ?? '')
            : '',
      },
      {
        headerName: t('notes'),
        field: 'notes',
        cellRenderer: params => {
          return params.data.notes
            ? parse(
                DOMPurify.sanitize(nl2br(String(params.data.notes)), {
                  USE_PROFILES: { html: true },
                })
              )
            : '';
        },
        width: 400,
        sortable: true,
      },
    ];

    return columns;
  };

  const [getAddressDetails] = useLazyGetAddressByIdQuery();

  useEffect(() => {
    if (!location?.state?.addressID && filter) {
      try {
        setShowErrorMessage(false);
        void getCourts({
          state: filter?.state,
          county: filter?.county,
          pageNo: filter?.pageNo,
          size: filter?.rowsPerPage,
          orderBy: filter?.sortBy,
          order: filter?.sortOrder,
        })
          .then(({ data }) => {
            if (data?.address.length === 0) {
              setShowErrorMessage(true);
            } else {
              setShowErrorMessage(false);
            }
            setCourtData([]);
            setShowCreateCourtButton(true);
          })
          .catch(err => err);
      } catch (error) {
        dispatch(
          open({
            severity: severity.error,
            message: 'An Unexpected Error Occurred',
          })
        );
      }
    }
  }, [filter?.state, filter?.county, location?.state]);

  const onSubmit = async (values: CourtParams) => {
    try {
      setFormValues({
        state: values?.state,
        county: values?.county,
        pageNo: 1,
        size: 100,
        orderBy: 'name,website',
        order: 'asc,asc',
      });
      dispatch(
        setSearchFilter({
          tableId: 'searchCourtsTable',
          filters: {
            state: values?.state,
            county: values?.county,
            pageNo: 1,
            rowsPerPage: 100,
            sortBy: 'name,website',
            sortOrder: 'asc,asc',
          },
        })
      );
      await getCourts({
        state: values?.state,
        county: values?.county,
        pageNo: 1,
        size: 100,
        orderBy: 'name,website',
        order: 'asc,asc',
      });
    } catch (error) {
      dispatch(
        open({
          severity: severity.error,
          message: 'An Unexpected Error Occurred',
        })
      );
    }
  };

  const getData = ({ page, rowsPerPage, sortBy, sortOrder }: QueryParams) => {
    if (!courtData.length) {
      void getCourts({
        state: formValues?.state,
        county: formValues?.county,
        pageNo: page,
        size: rowsPerPage,
        orderBy: sortBy,
        order: sortOrder,
      })
        .then(({ data }) => {
          if (data?.address.length === 0) {
            setShowErrorMessage(true);
          }
          setCourtData([]);
        })
        .catch(err => err);
    }
    setShowCreateCourtButton(true);
  };

  useEffect(() => {
    if (location?.state && location.state.addressID) {
      void getAddressDetails({ id: Number(location.state.addressID) })
        .then(({ data }) => {
          setFormValues({
            state: data?.data.address.state || '',
            county: data?.data.address.county || '',
            pageNo: 1,
            size: 100,
            orderBy: 'name,website',
            order: 'asc,asc',
          });
          dispatch(
            setSearchFilter({
              tableId: 'searchCourtsTable',
              filters: {
                state: data?.data.address.state || '',
                county: data?.data.address.county || '',
                pageNo: 1,
                rowsPerPage: 100,
                size: 100,
                sortBy: 'name',
                sortOrder: 'asc',
                page: 0,
              },
            })
          );
          navigate(location.pathname + location.search, {
            replace: true,
            state: null,
          });
        })
        .catch(err => err);
    }
  }, [location.state]);

  const handleCreateAddress = () => {
    navigate(`/newaddress/`);
  };
  const columns = localizeColumns(t);

  React.useEffect(() => {
    if (courtsData) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  }, [courtsData]);

  return (
    <Container component="main" fixed>
      <Typography component="h6" className="header-title-h6">
        {t('title')}
      </Typography>
      <Formik
        initialValues={formValues}
        validationSchema={searchCourtAddressSchema(t)}
        onSubmit={onSubmit}
        validateOnBlur={false}
        validateOnChange={false}
        enableReinitialize={true}
      >
        {({ isSubmitting }) => (
          <Form>
            <Grid
              container
              sx={{ my: 2 }}
              display={'flex'}
              justifyContent={'space-between'}
            >
              <Grid item xs={12} sm={3}>
                <CustomInputLabel sx={{ mb: 1 }}>
                  {t('state')}:
                </CustomInputLabel>
                <StateDropdown
                  name="state"
                  inputProps={{ id: 'state' }}
                  fullWidth
                  sx={{
                    background: '#434857',
                    borderRadius: '0.25rem',
                    width: '100%',
                  }}
                />
                <ErrorMessage
                  id="state-error"
                  name="state"
                  component={ErrorText}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <CustomInputLabel sx={{ mb: 1 }}>
                  {t('county')}: ({t('optional')})
                </CustomInputLabel>
                <Field
                  name="county"
                  inputProps={{
                    id: 'county',
                    sx: { height: '27px' },
                  }}
                  as={StyledInputField}
                  fullWidth
                  type="text"
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={2}
                display={'flex'}
                justifyContent={'center'}
              >
                <Button
                  disabled={isFetching || isSubmitting}
                  type="submit"
                  id="find-button"
                  variant="outlined"
                  fullWidth
                  sx={{
                    my: '2rem',
                    '&:disabled': {
                      opacity: 0.2,
                      cursor: 'not-allowed',
                      color: '#fff',
                    },
                  }}
                >
                  {t('find')}
                </Button>
              </Grid>
              {showCreateCourtButton && (
                <Grid
                  item
                  xs={12}
                  sm={2}
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                >
                  <Button
                    disabled={isFetching || isSubmitting}
                    id="create-court-button"
                    onClick={handleCreateAddress}
                    variant="outlined"
                    fullWidth
                    sx={{
                      my: '2rem',
                      '&:disabled': {
                        opacity: 0.2,
                        cursor: 'not-allowed',
                        color: '#fff',
                      },
                    }}
                  >
                    {t('createNewCourtAddress')}
                  </Button>
                </Grid>
              )}
            </Grid>
          </Form>
        )}
      </Formik>
      {courtsData?.count === 0 && !isFetching && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          id="error-search-court"
        >
          <Typography component="h3" id="error-text">
            {t('noAddressMsg')}
            {formValues?.county && ` ${formValues.county},`}
            {formValues?.state && ` ${formValues.state}`}
          </Typography>
        </Box>
      )}

      {(isLoading ||
        (courtsData && courtsData?.count > 0) ||
        courtData.length > 0) && (
        <Box sx={{ mt: 4 }}>
          <NewTable
            tableId="searchCourtsTable"
            data={
              (courtsData?.address as TableData[]) || (courtData as TableData[])
            }
            count={courtsData?.count || courtData.length}
            columns={columns}
            getData={getData}
            initialLoading={isLoading}
            initialSortBy={formValues?.sortBy || 'name'}
            initialSortOrder={formValues?.sortOrder || 'asc'}
            loading={isFetching}
          />
        </Box>
      )}
      {showErrorMessage && (
        <Typography id="address-not-found" component="h2">
          {t('noAddressMsg')} {formValues.county},{formValues.state}
        </Typography>
      )}
    </Container>
  );
};

export default CourtSearch;
