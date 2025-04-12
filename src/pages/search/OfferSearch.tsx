/* eslint-disable complexity */
import React from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { QueryParams, TableColumns } from '../../interface/common';
import CustomDatePicker from '../../component/FormikCustomDatePicker';
import { OfferParams, ValuesForOfferSearch } from '../../interface/searchOffer';
import { useLazyGetOffersQuery } from '../../store/Services/searchService';
import { formatDateToMonthDayYear, phoneFormat } from '../../utils/GeneralUtil';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import { searchOfferSchema } from '../../schemas/searchOffer';
import { setSearchFilter } from '../../store/Reducers/searchReducer';
import StateDropdown from '../../component/common/fields/StateDropdown';
import StyledInputField, {
  CustomInputLabel,
  StyledGrid,
  ErrorTextValidation,
} from '../../component/common/CommonStyle';
import NewTable from '../../component/Table';

const OfferSearch: React.FC = () => {
  const { t } = useTranslation('searchOffer');
  const dispatch = useAppDispatch();
  const searchFilter = useAppSelector(state => state.searchFilters);
  const filter = searchFilter['searchOffersTable'] as OfferParams;
  const initialValuesForOfferSearch: ValuesForOfferSearch = {
    visit: filter?.visit ? true : false,
    state: filter?.state || '',
    city: filter?.city || '',
    zip: filter?.zip || '',
    county: filter?.county || '',
    date1: filter?.date1 || '',
    date2: filter?.date2 || '',
  };
  const [formValues, setFormValues] = React.useState<OfferParams>(
    initialValuesForOfferSearch
  );
  const [getOffers, { data: offerData, isLoading, isFetching }] =
    useLazyGetOffersQuery();

  React.useEffect(() => {
    if (filter) {
      void getOffers({
        visit: filter?.visit ? 1 : 0,
        state: filter?.state || '',
        city: filter?.city || '',
        zip: filter?.zip || '',
        county: filter?.county || '',
        date1: filter?.date1 || '',
        date2: filter?.date2 || '',
        pageNo: filter?.page || 1,
        size: filter?.rowsPerPage || 5,
        orderBy: filter?.sortBy || '',
        order: filter?.sortOrder || '',
      });
    }
  }, [
    filter?.visit,
    filter?.state,
    filter?.city,
    filter?.zip,
    filter?.county,
    filter?.date1,
    filter?.date2,
  ]);
  const onSubmit = async (values: ValuesForOfferSearch) => {
    try {
      if (
        !values.state &&
        !values.county &&
        !values.zip &&
        (!values.date1 || values.date1 === '') &&
        (!values.date2 || values.date2 === '')
      ) {
        dispatch(
          open({
            severity: severity.error,
            message: t('enterSearchParam'),
          })
        );
        return;
      }

      const visit = values?.visit;
      const params: OfferParams = {
        state: values?.state,
        city: values?.city,
        zip: values?.zip,
        county: values?.county,
        date1: values?.date1 || '',
        date2: values?.date2 || '',
        pageNo: 1,
        size: 100,
        orderBy: 'fileName,buyer',
        order: 'asc,asc',
      };

      if (visit) {
        params.visit = 1;
      }
      setFormValues(params);
      dispatch(
        setSearchFilter({
          tableId: 'searchOffersTable',
          filters: {
            ...params,
            visit: visit ? 1 : 0,
            pageNo: 1,
            rowsPerPage: 100,
            sortBy: 'fileName,buyer',
            sortOrder: 'asc,asc',
          },
        })
      );
      await getOffers(params);
    } catch (error) {
      dispatch(
        open({
          severity: severity.error,
          message: 'An Unexpected Error Occurred',
        })
      );
    }
  };

  const columns: TableColumns[] = [
    {
      headerName: t('buyer'),
      field: 'buyer',
      sortable: true,
    },
    {
      headerName: t('fileName'),
      field: 'fileName',
      cellRenderer: params => (
        <Link
          key={String(params.data.fileId)}
          to={`/editfile/${params.data.fileId}`}
          className="hover-link"
        >
          {params.data.fileName}
        </Link>
      ),
      width: 300,
      sortable: true,
    },
    {
      headerName: t('contactName'),
      field: 'contactName',
      cellRenderer: params => (
        <Link
          key={String(params.data.contactID)}
          to={`/editcontact/${params.data.contactID}`}
          className="hover-link"
        >
          {params.data.contactName}
        </Link>
      ),
      width: 300,
      sortable: true,
    },
    {
      headerName: t('visit'),
      field: 'visit',
      sortable: true,
    },
    {
      headerName: t('city'),
      field: 'city',
      sortable: true,
    },
    {
      headerName: t('zip'),
      field: 'zip',
      sortable: true,
    },
    {
      headerName: t('phone'),
      field: 'phone',
      sortable: true,
    },
    {
      headerName: t('offerAmount'),
      field: 'offerAmount',
      sortable: true,
    },
    {
      headerName: t('offerDate'),
      field: 'offerDate',
      sortable: true,
    },
    {
      headerName: t('legalsState'),
      field: 'legalsState',
      sortable: true,
    },
    {
      headerName: t('legalsCounty'),
      field: 'legalsCounty',
      sortable: true,
    },
    {
      headerName: t('fileLoc'),
      field: 'fileLocation',
      sortable: true,
    },
    {
      headerName: t('fileLocDt'),
      field: 'fileLocDt',
      sortable: true,
    },
  ];
  const formattedData = offerData?.offers?.map(offer => {
    return {
      ...offer,
      offerDate: offer.offerDate
        ? formatDateToMonthDayYear(offer.offerDate).toString()
        : '',
      fileLocDt: offer.fileLocDt
        ? formatDateToMonthDayYear(offer.fileLocDt).toString()
        : '',
      visit: offer.visit ? 'Yes' : '',
      phone: offer.phone ? phoneFormat(offer.phone) : '',
      offerAmount:
        parseFloat(
          typeof offer.offerAmount === 'string' ? offer.offerAmount : ''
        ) > 0
          ? parseFloat(
              typeof offer.offerAmount === 'string' ? offer.offerAmount : ''
            ).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })
          : '',
    };
  });

  const getData = ({ page, rowsPerPage, sortBy, sortOrder }: QueryParams) => {
    void getOffers({
      state: formValues?.state,
      visit: formValues?.visit,
      city: formValues?.city,
      zip: formValues?.zip,
      county: formValues?.county,
      date1: formValues?.date1,
      date2: formValues?.date2,
      pageNo: page,
      size: rowsPerPage,
      order: sortOrder,
      orderBy: sortBy,
    });
  };
  React.useEffect(() => {
    if (offerData) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  }, [offerData]);
  return (
    <>
      <Container component="main" fixed sx={{ marginTop: '20px' }}>
        <Typography component="h6" className="header-title-h6">
          {t('searchForOffers')}
        </Typography>
        <Typography
          component="h6"
          sx={{
            display: 'block',
            color: '#434857',
            fontWeight: 'normal',
            marginBottom: '5px',
            fontSize: '85%',
            letterSpacing: '1px',
          }}
        >
          {t('excludeDeadAndDeed')}
        </Typography>
        <Formik
          initialValues={initialValuesForOfferSearch}
          onSubmit={onSubmit}
          validationSchema={searchOfferSchema(t)}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {({ isSubmitting, values }) => {
            const otherFieldsFilled =
              values.state ||
              values.zip ||
              values.county ||
              values.date1 ||
              values.date2;
            return (
              <Form>
                <>
                  <Grid container alignItems="center" sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={3} xl={2}>
                      <CustomInputLabel sx={{ paddingRight: '20px' }}>
                        {t('showOnlyContactsToVisitInPerson')}:
                      </CustomInputLabel>
                    </Grid>
                    <StyledGrid item xs={12} sm={9} xl={10}>
                      <Field
                        name="visit"
                        inputProps={{
                          id: 'visit',
                          disabled: !otherFieldsFilled,
                        }}
                        type="checkbox"
                        as={Checkbox}
                        sx={{
                          color: 'white',
                          marginLeft: '-10px',
                          opacity: otherFieldsFilled ? 1 : 0.5,
                        }}
                        size="small"
                        color="info"
                      />
                    </StyledGrid>
                    <Grid item xs={12} sm={3} mt={2} xl={2}>
                      <CustomInputLabel sx={{ paddingRight: '20px' }}>
                        {t('findOffersMadeInState')}:
                      </CustomInputLabel>
                    </Grid>
                    <StyledGrid item xs={12} sm={9} xl={10}>
                      <StateDropdown
                        name="state"
                        fullWidth
                        inputProps={{ id: 'state' }}
                        sx={{
                          background: '#434857',
                          outline: 'none',
                        }}
                      />
                    </StyledGrid>
                    <Grid item xs={12} sm={3} xl={2} mt={3}>
                      <CustomInputLabel sx={{ paddingRight: '20px' }}>
                        {t('cityField')} <br />
                        {t('semiColon')}:
                      </CustomInputLabel>
                    </Grid>
                    <StyledGrid item xs={12} sm={9} xl={10}>
                      <Field
                        name="city"
                        inputProps={{
                          id: 'city',
                          disabled: !otherFieldsFilled,
                        }}
                        sx={{
                          opacity: otherFieldsFilled ? 1 : 0.7,
                        }}
                        placeholder="Broken Arrow;Tulsa;Oklahoma City"
                        as={StyledInputField}
                        type="text"
                        fullWidth
                      />
                    </StyledGrid>
                    <Grid item xs={12} sm={3} xl={2} mt={4}>
                      <CustomInputLabel sx={{ paddingRight: '20px' }}>
                        {t('zipField')} <br />
                        {t('space')}:
                      </CustomInputLabel>
                    </Grid>
                    <StyledGrid item xs={12} sm={9} xl={10}>
                      <Field
                        name="zip"
                        inputProps={{ id: 'zip' }}
                        as={StyledInputField}
                        placeholder="74011 741 73"
                        type="text"
                        fullWidth
                      />
                    </StyledGrid>
                    <Grid item xs={12} sm={3} mt={4} xl={2}>
                      <CustomInputLabel sx={{ paddingRight: '20px' }}>
                        {t('countyField')} <br />
                        {t('bySemiColon')}:
                      </CustomInputLabel>
                    </Grid>
                    <StyledGrid item xs={12} sm={9} xl={10}>
                      <Field
                        name="county"
                        inputProps={{ id: 'county' }}
                        placeholder="Harrison;Rusk;Jim Hogg"
                        as={StyledInputField}
                        type="text"
                        fullWidth
                      />
                    </StyledGrid>
                    <Grid item xs={12} sm={3} mt={1} xl={2}>
                      <CustomInputLabel sx={{ paddingRight: '20px' }}>
                        {t('orMadeBetweenDates')}:
                      </CustomInputLabel>
                    </Grid>
                    <Grid
                      container
                      item
                      xs={12}
                      sm={9}
                      xl={10}
                      marginTop="10px"
                      alignItems="center"
                      display="flex"
                      justifyContent="flex-start"
                    >
                      <Grid item xs={12} sm={3}>
                        <CustomDatePicker
                          name="date1"
                          type="date"
                          id="date1"
                          width="100%"
                          style={{
                            demo: {
                              sx: {
                                paddingTop: '0px',
                              },
                            },
                          }}
                        />
                        <Box sx={{ minHeight: '20px' }}>
                          <ErrorMessage
                            name="date1"
                            component={ErrorTextValidation}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          {t('and')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <CustomDatePicker
                          name="date2"
                          type="date"
                          id="date2"
                          width="100%"
                          style={{
                            demo: {
                              sx: {
                                paddingTop: '0px',
                              },
                            },
                          }}
                        />
                        <Box sx={{ minHeight: '20px' }}>
                          <ErrorMessage
                            name="date2"
                            component={ErrorTextValidation}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container justifyContent="center">
                    <Grid item>
                      <Button
                        disabled={isFetching || isSubmitting}
                        type="submit"
                        id="find-button"
                        variant="outlined"
                        sx={{
                          my: '2rem',
                          '&:disabled': {
                            opacity: 0.2,
                            cursor: 'not-allowed',
                            backgroundColor: '#1997c6',
                            color: '#fff',
                          },
                        }}
                      >
                        {t('find')}
                      </Button>
                    </Grid>
                  </Grid>
                </>
              </Form>
            );
          }}
        </Formik>

        {offerData?.offers?.length === 0 && !isFetching && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography component="h5" sx={{ marginBottom: '20px' }}>
              {t('noOffers')}
            </Typography>
          </Box>
        )}

        {(isLoading || (offerData && (offerData?.count ?? 0) > 0)) && (
          <>
            <Box>
              <Typography variant="h5" color="white" mb={2}>
                {t('searchResults')}
              </Typography>
              <Typography variant="body2" color="white" mb={2}>
                {t('offersCount')}: {offerData?.count}
              </Typography>
            </Box>
            <NewTable
              tableId="searchOffersTable"
              data={formattedData || []}
              count={offerData && 'count' in offerData ? offerData?.count : 0}
              getData={getData}
              initialLoading={isLoading}
              columns={columns}
              initialSortBy={formValues?.sortBy || 'offerDate'}
              initialSortOrder={formValues?.sortOrder || 'desc'}
              loading={isFetching}
              message={
                offerData && 'offers' in offerData ? offerData.message : ''
              }
            />
          </>
        )}
      </Container>
    </>
  );
};

export default OfferSearch;
