import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { useTranslation } from 'react-i18next';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useAppDispatch } from '../../store/hooks';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import {
  AddressDetails,
  EditAddressForm,
  NewAddressForm,
} from '../../interface/address';
import { newAddressSchema } from '../../schemas/address';
import {
  useCreateAddressMutation,
  useLazyGetAddressByIdQuery,
  useUpdateAddressMutation,
} from '../../store/Services/addressService';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import StateDropdown from '../../component/common/fields/StateDropdown';
import OverlayLoader from '../../component/common/OverlayLoader';
import StyledInputField, {
  CustomInputLabel,
  ErrorText,
  StyledGrid,
} from '../../component/common/CommonStyle';
import CountyMultiSelect from '../../component/common/fields/CountyMultiSelectInput';

const initialValues: NewAddressForm & EditAddressForm = {
  addressID: null,
  name: null,
  attn: '',
  address: '',
  city: '',
  state: null,
  zip: '',
  county: '',
  payee: '',
  cost: 0,
  phone: '',
  fax: '',
  email: '',
  website: 'http://www.',
  form: '',
  notes: '',
};

const AddNewAddress: React.FC = () => {
  const { t } = useTranslation('addAddress');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { addressId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const isEditView = queryParams.get('isEditView') === 'true';
  const placeNameRef = useRef<HTMLLabelElement>(null);
  const zipRef = useRef<HTMLLabelElement>(null);
  const emailRef = useRef<HTMLLabelElement>(null);
  const websiteRef = useRef<HTMLLabelElement>(null);
  const phoneRef = useRef<HTMLLabelElement>(null);
  const faxRef = useRef<HTMLLabelElement>(null);
  const [addressDetailsData, setAddressDetailsData] = useState(initialValues);

  const [createAddress] = useCreateAddressMutation();
  const [editAddress] = useUpdateAddressMutation();
  const [error, setError] = useState<string>('');
  const errorCountyRef = React.useRef<HTMLDivElement>(null);

  const onSubmit = async (
    values: NewAddressForm,
    actions: FormikHelpers<NewAddressForm>
  ) => {
    if (!error) {
      try {
        const data = {
          name: values.name,
          attn: values.attn,
          address: values.address,
          city: values.city,
          state: values.state,
          zip: values.zip,
          county: values.county,
          payee: values.payee,
          phone: values.phone,
          fax: values.fax,
          email: values.email,
          website: values.website,
          notes: values.notes,
        } as NewAddressForm;

        const response = await createAddress(data);
        if ('data' in response) {
          if (response?.data?.success) {
            actions.resetForm();
            dispatch(
              open({
                severity: severity.success,
                message: response?.data?.message,
              })
            );
            navigate(`/searchcourts`, {
              state: {
                state: values.state,
                addressID: response?.data?.data?.addressID,
              },
            });
          }
        }
      } catch (error) {
        dispatch(
          open({
            severity: severity.error,
            message: 'An Unexpected Error Occurred',
          })
        );
      }
    } else {
      errorCountyRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const onEditSubmit = async (
    values: EditAddressForm,
    actions: FormikHelpers<EditAddressForm>
  ) => {
    if (!error) {
      try {
        const data = {
          addressID: addressDetailsData.addressID,
          name: values.name,
          attn: values.attn,
          address: values.address,
          city: values.city,
          state: values.state,
          zip: values.zip,
          county: values.county,
          payee: values.payee,
          cost: values.cost,
          phone: values.phone,
          fax: values.fax,
          email: values.email,
          website: values.website,
          form: values.form,
          notes: values.notes,
        } as EditAddressForm;

        const response = await editAddress(data);
        if ('data' in response) {
          if (response?.data?.success) {
            actions.resetForm();
            dispatch(
              open({
                severity: severity.success,
                message: response?.data?.message,
              })
            );
            navigate(`/searchcourts`, {
              state: {
                state: values.state,
                addressID: response?.data?.data?.address.addressID,
              },
            });
          }
        }
      } catch (error) {
        dispatch(
          open({
            severity: severity.error,
            message: 'An Unexpected Error Occurred',
          })
        );
      }
    } else {
      errorCountyRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const [getAddressDetails, { data: addressDetails, isLoading: loading }] =
    useLazyGetAddressByIdQuery();

  useEffect(() => {
    if (isEditView) {
      void getAddressDetails({ id: Number(addressId) });
    }
  }, []);

  useEffect(() => {
    if (addressDetails && addressDetails.data.address) {
      handleAddressDetailsData(addressDetails.data.address);
    }
  }, [addressDetails]);

  const handleAddressDetailsData = (address: AddressDetails) => {
    setAddressDetailsData({
      addressID: Number(address?.addressID),
      name: address.name,
      attn: address.attn,
      address: address.address,
      city: address.city,
      state: address.state,
      zip: address.zip,
      county: address.county,
      payee: address.payee,
      cost: address.cost ? address.cost : 0,
      phone: address.phone,
      fax: address.fax,
      email: address.email,
      website: address.website,
      form: address.form ? address.form : '',
      notes: address.notes,
    });
  };

  return (
    <Container component="main" fixed sx={{ marginTop: 2 }}>
      {isEditView && loading ? (
        <OverlayLoader open />
      ) : (
        <Box>
          <Grid container alignItems="center" sx={{ mt: 2 }}>
            <Typography component="h6" className="header-title-h6">
              {t('fileMaster')}
            </Typography>
          </Grid>
          <Formik
            initialValues={isEditView ? addressDetailsData : initialValues}
            enableReinitialize={isEditView ? true : false}
            validationSchema={newAddressSchema(t)}
            onSubmit={isEditView ? onEditSubmit : onSubmit}
            validateOnBlur={false}
            validateOnChange={false}
          >
            {({ isSubmitting, errors, values }) => (
              <Form>
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  gap={1}
                >
                  <Grid container spacing={{ xs: 1, sm: 2 }}>
                    <Grid item xs={12}>
                      <Typography
                        variant="h4"
                        component="p"
                        gutterBottom
                        sx={{ color: 'white', fontSize: '24px' }}
                        id={isEditView ? 'editAddressTitle' : 'addAddressTitle'}
                      >
                        {isEditView
                          ? t('editAddressTitle')
                          : t('addAddressTitle')}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container alignItems="center">
                    <Grid item xs={12} md={2} xl={1} sm={3}>
                      <CustomInputLabel ref={placeNameRef}>
                        {t('name')}:*
                      </CustomInputLabel>
                    </Grid>
                    <StyledGrid item xs={12} md={10} xl={11} sm={9}>
                      <Field
                        name={'name'}
                        as={StyledInputField}
                        type="text"
                        fullWidth
                        inputProps={{ id: 'name' }}
                      />
                      <Grid container spacing={{ xs: 1, sm: 2 }}>
                        <Grid item xs={12} md={12}>
                          {errors?.name && (
                            <Box>
                              <ErrorText id="error-name">
                                {errors?.name}
                              </ErrorText>
                            </Box>
                          )}
                        </Grid>
                      </Grid>
                    </StyledGrid>
                    <Grid item xs={12} md={2} xl={1} sm={3}>
                      <CustomInputLabel>{t('attn')}:</CustomInputLabel>
                    </Grid>
                    <StyledGrid item xs={12} md={10} xl={11} sm={9}>
                      <Field
                        name={'attn'}
                        as={StyledInputField}
                        type="text"
                        fullWidth
                        inputProps={{ id: 'attn' }}
                      />
                    </StyledGrid>
                    <Grid item xs={12} md={2} xl={1} sm={3}>
                      <CustomInputLabel>{t('address')}:</CustomInputLabel>
                    </Grid>
                    <StyledGrid item xs={12} md={10} xl={11} sm={9}>
                      <Field
                        name={'address'}
                        as={StyledInputField}
                        type="text"
                        fullWidth
                        inputProps={{ id: 'address' }}
                      />
                    </StyledGrid>
                    <Grid item xs={12} md={2} xl={1} sm={3}>
                      <CustomInputLabel>{t('city')}:</CustomInputLabel>
                    </Grid>
                    <StyledGrid item xs={12} md={10} xl={11} sm={9}>
                      <Field
                        name={'city'}
                        as={StyledInputField}
                        type="text"
                        fullWidth
                        inputProps={{ id: 'city', maxLength: 50 }}
                      />
                    </StyledGrid>
                    <Grid item xs={12} md={2} xl={1} sm={3}>
                      <CustomInputLabel>{t('state')}*:</CustomInputLabel>
                    </Grid>
                    <StyledGrid item xs={12} md={10} xl={11} sm={9}>
                      <StateDropdown
                        name={'state'}
                        sx={{
                          width: { xs: '100%' },
                          background: '#434857',
                          outline: 'none',
                          '& .Mui-disabled': {
                            opacity: 1,
                            background: '#30343e',
                            cursor: 'not-allowed',
                            color: '#fff',
                            '-webkit-text-fill-color': 'unset !important',
                          },
                        }}
                        inputProps={{ id: 'state' }}
                      />
                      <Grid container spacing={{ xs: 1, sm: 2 }}>
                        <Grid item xs={12} md={12}>
                          {errors?.state && (
                            <Box>
                              <ErrorText id="error-state">
                                {errors?.state}
                              </ErrorText>
                            </Box>
                          )}
                        </Grid>
                      </Grid>
                    </StyledGrid>
                    <Grid item xs={12} md={2} xl={1} sm={3}>
                      <CustomInputLabel ref={zipRef}>
                        {t('zip')}:
                      </CustomInputLabel>
                    </Grid>
                    <StyledGrid item xs={12} md={10} xl={11} sm={9}>
                      <Field
                        name={'zip'}
                        as={StyledInputField}
                        type="text"
                        fullWidth
                        inputProps={{ id: 'zip', maxLength: 10 }}
                      />
                      <Grid container spacing={{ xs: 1, sm: 2 }}>
                        <Grid item xs={12} md={12}>
                          {errors?.zip && (
                            <Box>
                              <ErrorText id="error-zip">
                                {errors?.zip}
                              </ErrorText>
                            </Box>
                          )}
                        </Grid>
                      </Grid>
                    </StyledGrid>
                    <Grid item xs={12} md={2} xl={1} sm={3}>
                      <CustomInputLabel>{t('county')}:</CustomInputLabel>
                    </Grid>
                    <StyledGrid item xs={12} md={10} xl={11} sm={9}>
                      <CountyMultiSelect
                        name="county"
                        id="county"
                        state={values.state}
                        setError={setError}
                        maxLength={255}
                      />
                      {error && (
                        <Box ref={errorCountyRef}>
                          <ErrorText id="error-county">{error}</ErrorText>
                        </Box>
                      )}
                    </StyledGrid>
                    <Grid item xs={12} md={2} xl={1} sm={3}>
                      <CustomInputLabel>{t('payee')}:</CustomInputLabel>
                    </Grid>
                    <StyledGrid item xs={12} md={10} xl={11} sm={9}>
                      <Field
                        name={'payee'}
                        as={StyledInputField}
                        type="text"
                        fullWidth
                        inputProps={{ id: 'payee' }}
                      />
                    </StyledGrid>
                    {isEditView && (
                      <>
                        <Grid item xs={12} md={2} xl={1} sm={3}>
                          <CustomInputLabel>{t('cost')}:</CustomInputLabel>
                        </Grid>
                        <StyledGrid item xs={12} md={10} xl={11} sm={9}>
                          <Field
                            name={'cost'}
                            as={StyledInputField}
                            type="text"
                            sx={{ flex: '1', maxWidth: '300px' }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment
                                  position="start"
                                  disableTypography
                                  sx={{ color: '#ccc' }}
                                >
                                  $
                                </InputAdornment>
                              ),
                              id: 'cost',
                            }}
                          />
                          <Grid container spacing={{ xs: 1, sm: 2 }}>
                            <Grid item xs={12} md={12}>
                              {errors?.cost && (
                                <Box>
                                  <ErrorText id="error-form">
                                    {errors?.cost}
                                  </ErrorText>
                                </Box>
                              )}
                            </Grid>
                          </Grid>
                        </StyledGrid>
                      </>
                    )}
                    <Grid item xs={12} md={2} xl={1} sm={3}>
                      <CustomInputLabel ref={phoneRef}>
                        {t('phone')}:
                      </CustomInputLabel>
                    </Grid>
                    <StyledGrid item xs={12} md={10} xl={11} sm={9}>
                      <Field
                        name={'phone'}
                        as={StyledInputField}
                        type="text"
                        fullWidth
                        inputProps={{ id: 'phone', maxLength: 10 }}
                      />
                      <Grid container spacing={{ xs: 1, sm: 2 }}>
                        <Grid item xs={12} md={12}>
                          {errors?.phone && (
                            <Box>
                              <ErrorText id="error-phone">
                                {errors?.phone}
                              </ErrorText>
                            </Box>
                          )}
                        </Grid>
                      </Grid>
                    </StyledGrid>
                    <Grid item xs={12} md={2} xl={1} sm={3}>
                      <CustomInputLabel ref={faxRef}>
                        {t('fax')}:
                      </CustomInputLabel>
                    </Grid>
                    <StyledGrid item xs={12} md={10} xl={11} sm={9}>
                      <Field
                        name={'fax'}
                        as={StyledInputField}
                        type="text"
                        fullWidth
                        inputProps={{ id: 'fax', maxLength: 10 }}
                      />
                      <Grid container spacing={{ xs: 1, sm: 2 }}>
                        <Grid item xs={12} md={12}>
                          {errors?.fax && (
                            <Box>
                              <ErrorText id="error-fax">
                                {errors?.fax}
                              </ErrorText>
                            </Box>
                          )}
                        </Grid>
                      </Grid>
                    </StyledGrid>
                    <Grid item xs={12} md={2} xl={1} sm={3}>
                      <CustomInputLabel ref={emailRef}>
                        {t('email')}:
                      </CustomInputLabel>
                    </Grid>
                    <StyledGrid item xs={12} md={10} xl={11} sm={9}>
                      <Field
                        name={'email'}
                        as={StyledInputField}
                        type="text"
                        fullWidth
                        inputProps={{ id: 'email', maxLength: 50 }}
                      />
                      <Grid container spacing={{ xs: 1, sm: 2 }}>
                        <Grid item xs={12} md={12}>
                          {errors?.email && (
                            <Box>
                              <ErrorText id="error-email">
                                {errors?.email}
                              </ErrorText>
                            </Box>
                          )}
                        </Grid>
                      </Grid>
                    </StyledGrid>
                    <Grid item xs={12} md={2} xl={1} sm={3}>
                      <CustomInputLabel ref={websiteRef}>
                        {t('website')}:
                      </CustomInputLabel>
                    </Grid>
                    <StyledGrid item xs={12} md={10} xl={11} sm={9}>
                      <Field
                        name={'website'}
                        as={StyledInputField}
                        type="text"
                        fullWidth
                        inputProps={{ id: 'website', maxLength: 2083 }}
                      />
                      <Grid container spacing={{ xs: 1, sm: 2 }}>
                        <Grid item xs={12} md={12}>
                          {errors?.website && (
                            <Box>
                              <ErrorText id="error-website">
                                {errors?.website}
                              </ErrorText>
                            </Box>
                          )}
                        </Grid>
                      </Grid>
                    </StyledGrid>
                    {isEditView && (
                      <>
                        <Grid item xs={12} md={2} xl={1} sm={3}>
                          <CustomInputLabel>{t('form')}:</CustomInputLabel>
                        </Grid>
                        <StyledGrid item xs={12} md={10} xl={11} sm={9}>
                          <Field
                            name={'form'}
                            as={StyledInputField}
                            type="text"
                            fullWidth
                            inputProps={{ id: 'form', maxLength: 2083 }}
                          />
                          <Grid container spacing={{ xs: 1, sm: 2 }}>
                            <Grid item xs={12} md={12}>
                              {errors?.form && (
                                <Box>
                                  <ErrorText id="error-form">
                                    {errors?.form}
                                  </ErrorText>
                                </Box>
                              )}
                            </Grid>
                          </Grid>
                        </StyledGrid>
                      </>
                    )}
                    <Grid item xs={12} md={2} xl={1} sm={3}>
                      <CustomInputLabel>{t('notes')}:</CustomInputLabel>
                    </Grid>
                    <StyledGrid item xs={12} md={10} xl={11} sm={9}>
                      <Field
                        name={'notes'}
                        as={StyledInputField}
                        type="text"
                        fullWidth
                        inputProps={{ id: 'notes' }}
                      />
                    </StyledGrid>
                  </Grid>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '18px',
                      marginBottom: '18px',
                    }}
                  >
                    <Button
                      disabled={isEditView ? false : isSubmitting}
                      type="submit"
                      variant="outlined"
                      id="save-address-button"
                      onClick={() => {
                        if (!isEditView) {
                          if (!values.name) {
                            setTimeout(() => {
                              placeNameRef.current?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center',
                              });
                            }, 200);
                            return errors;
                          }
                        }
                      }}
                      sx={{
                        whiteSpace: 'nowrap',
                        '&:disabled': {
                          opacity: 0.2,
                          cursor: 'not-allowed',
                          borderColor: '#1997c6',
                          color: '#fff',
                        },
                      }}
                    >
                      {t('save')}
                    </Button>
                  </Box>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      )}
    </Container>
  );
};

export default AddNewAddress;
