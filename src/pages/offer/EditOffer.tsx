import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useDeleteOfferMutation,
  useEditOfferMutation,
  useLazyGetOfferByOfferIdQuery,
} from '../../store/Services/offerService';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../store/hooks';
import { severity } from '../../interface/snackbar';
import { open } from '../../store/Reducers/snackbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import {
  DropdownObjectForOffer,
  EditOfferValues,
  OfferGetByOfferIdData,
} from '../../interface/offer';
import CustomDatePicker from '../../component/FormikCustomDatePicker';
import {
  CustomTextArea,
  SelectFieldForOfferAndLetterType,
} from '../../component/CommonComponent';
import {
  useGetLetterTypeQuery,
  useGetOfferTypeQuery,
} from '../../store/Services/commonService';
import { editOfferSchema } from '../../schemas/editOffer';
import { formatDateByMonth } from '../../utils/GeneralUtil';
import * as Yup from 'yup';
import CustomModel from '../../component/common/CustomModal';
import BuyerDropdown from '../../component/common/fields/BuyerDropdown';
import StateDropdown from '../../component/common/fields/StateDropdown';
import OverlayLoader from '../../component/common/OverlayLoader';
import StyledInputField, {
  CustomInputLabel,
  ErrorTextValidation,
  StyledGrid,
} from '../../component/common/CommonStyle';
import AmountField from '../../component/common/fields/AmountField';

const EditOffer: React.FC = () => {
  const { t } = useTranslation('editOffer');
  const navigate = useNavigate();
  const { offerId } = useParams();
  const [offerData, setOfferData] =
    React.useState<OfferGetByOfferIdData | null>(null);
  const { data: offerTypeData } = useGetOfferTypeQuery();
  const { data: letterTypeData } = useGetLetterTypeQuery();
  const [editOffer] = useEditOfferMutation();
  const [deleteOffer] = useDeleteOfferMutation();
  const [openModel, setOpenModel] = React.useState(false);
  const handleOpen = () => setOpenModel(true);
  const handleClose = () => setOpenModel(false);
  const [dropDownValue, setDropDownValue] =
    React.useState<DropdownObjectForOffer>({
      offerTypes: [],
      letterTypes: [],
      states: [],
    });
  const dispatch = useAppDispatch();
  const [
    getOfferByOfferId,
    { data: offerDetails, isLoading: offerDetailsLoading },
  ] = useLazyGetOfferByOfferIdQuery();
  React.useEffect(() => {
    void getOfferByOfferId({ offerId: Number(offerId) });
  }, [getOfferByOfferId, offerId]);
  React.useEffect(() => {
    if (offerDetails && offerDetails.offer) {
      setOfferData(offerDetails.offer);
    }
  }, [offerDetails]);

  React.useEffect(() => {
    if (
      offerTypeData &&
      offerTypeData.data &&
      letterTypeData &&
      letterTypeData.data
    ) {
      setDropDownValue({
        offerTypes: offerTypeData.data,
        letterTypes: letterTypeData.data,
      });
    }
  }, [offerTypeData, letterTypeData]);

  let initialValues: EditOfferValues = {
    offerId: 0,
    whose: 0,
    grantors: '',
    fileId: 0,
    offerType: 0,
    letterType: 0,
    draftAmount1: 0,
    draftAmount2: 0,
    draftLength1: 0,
    draftLength2: 0,
    comment3: '',
    offerDate: null,
    offerAddress: '',
    offerCity: '',
    offerState: '',
    offerZip: '',
  };

  if (offerData) {
    initialValues = {
      ...offerData,
      offerId: Number(offerId),

      // If 'grantors' is provided, use it;
      // otherwise, use the safe-joined first + last name:
      grantors: offerData.grantors
        ? offerData.grantors
        : `${offerData.firstName ?? ''} ${offerData.lastName ?? ''}`.trim(),

      // These fall back in order: offerData?.offerAddress -> address -> ''
      offerAddress: offerData.offerAddress ?? offerData.address ?? '',
      offerCity: offerData.offerCity ?? offerData.city ?? '',
      offerState: offerData.offerState ?? offerData.state ?? '',
      offerZip: offerData.offerZip ?? offerData.zip ?? '',

      // Replace null/undefined with an empty string (or '0' if numeric)
      draftAmount1: offerData.draftAmount1 ?? 0,
      draftAmount2: offerData.draftAmount2 ?? 0,

      // If offerDate exists, format it; otherwise default to empty string
      offerDate: offerData.offerDate
        ? formatDateByMonth(offerData.offerDate).toString()
        : null,
    };
  }
  const handleSubmit = async (
    values: EditOfferValues,
    actions: FormikHelpers<EditOfferValues>
  ) => {
    try {
      const data: EditOfferValues = {
        offerId: Number(offerId),
        whose: values.whose,
        grantors: values.grantors,
        fileId: values.fileId,
        offerType: values.offerType,
        letterType: values.letterType,
        draftAmount1: values.draftAmount1
          ? values.draftAmount1.toString()
          : '0',
        draftAmount2: values.draftAmount2
          ? values.draftAmount2.toString()
          : '0',
        draftLength1: values.draftLength1 ? Number(values.draftLength1) : 0,
        draftLength2: values.draftLength2 ? Number(values.draftLength2) : 0,
        comment3: values?.comment3 ?? '',
        offerDate: values.offerDate ? values.offerDate : null,
        offerAddress: values.offerAddress,
        offerCity: values.offerCity,
        offerState: values.offerState,
        offerZip: values.offerZip,
      };
      const response = await editOffer(data);
      if ('data' in response) {
        if (response?.data?.success) {
          setOfferData(null);
          actions.resetForm();
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          navigate(`/editcontact/${offerData?.contactId}?tab=offers`);
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
  };
  const handleDelete = async () => {
    try {
      const response = await deleteOffer({ offerId: Number(offerId) });
      if ('data' in response) {
        if (response?.data?.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          setOpenModel(false);
          navigate(`/editcontact/${offerData?.contactId}?tab=offers`);
        }
      } else if ('error' in response) {
        throw new Error();
      }
    } catch (error) {
      dispatch(
        open({
          severity: severity.error,
          message: 'unaccepted error occurred',
        })
      );
      setOpenModel(false);
    }
  };

  return (
    <Container component="main" fixed sx={{ mt: 2 }}>
      <Typography component="h6" id="editOffer" className="header-title-h6">
        {t('editOffer')}
      </Typography>
      {offerDetailsLoading ? (
        <OverlayLoader open />
      ) : (
        offerData && (
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={editOfferSchema(t)}
            validateOnBlur={false}
            validateOnChange={false}
            validate={values => {
              try {
                editOfferSchema(t).validateSync(values, {
                  abortEarly: false,
                });
              } catch (error) {
                if (
                  error instanceof Yup.ValidationError &&
                  error.inner.length > 0
                ) {
                  setTimeout(() => {
                    const errorElement = document.querySelector(
                      `[name="${error.inner[0].path}"]`
                    );
                    errorElement?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    });
                  }, 100);
                }
                return {};
              }
              return {};
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Grid container alignItems="center" sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={2} xl={1}>
                    <CustomInputLabel>{t('offerDate')}:</CustomInputLabel>
                  </Grid>
                  <StyledGrid item xs={12} sm={10} xl={11}>
                    <CustomDatePicker
                      name="offerDate"
                      type="date"
                      id="offerDate"
                      width="100%"
                      style={{
                        demo: {
                          sx: {
                            paddingTop: '0px',
                          },
                        },
                      }}
                    />
                    <ErrorMessage
                      name="offerDate"
                      component={ErrorTextValidation}
                    />
                  </StyledGrid>

                  <Grid item xs={12} sm={2} xl={1}>
                    <CustomInputLabel>{t('offerBy')}:*</CustomInputLabel>
                  </Grid>
                  <StyledGrid item xs={12} sm={10} xl={11}>
                    <BuyerDropdown
                      name="whose"
                      inputProps={{ id: 'whose' }}
                      sx={{
                        width: { xs: '100%', sm: '100%' },
                        background: '#434857',
                      }}
                    />
                    <ErrorMessage
                      name="whose"
                      component={ErrorTextValidation}
                    />
                  </StyledGrid>
                  <Grid item xs={12} sm={2} xl={1}>
                    <CustomInputLabel> {t('grantors')}:* </CustomInputLabel>
                  </Grid>
                  <StyledGrid item xs={12} sm={10} xl={11}>
                    <Field
                      name="grantors"
                      as={StyledInputField}
                      type="text"
                      fullWidth
                      inputProps={{ id: 'grantors' }}
                    />
                    <ErrorMessage
                      name="grantors"
                      component={ErrorTextValidation}
                    />
                  </StyledGrid>
                  <Grid item xs={12} sm={2} xl={1}>
                    <CustomInputLabel> {t('offerType')}:*</CustomInputLabel>
                  </Grid>
                  <StyledGrid item xs={12} sm={10} xl={11}>
                    <Field
                      name="offerType"
                      inputProps={{ id: 'offerType' }}
                      as={SelectFieldForOfferAndLetterType}
                      options={dropDownValue?.offerTypes}
                      sx={{
                        width: { xs: '100%', sm: '100%' },
                        background: '#434857',
                      }}
                    />
                    <ErrorMessage
                      name="offerType"
                      component={ErrorTextValidation}
                    />
                  </StyledGrid>
                  <Grid item xs={12} sm={2} xl={1}>
                    <CustomInputLabel> {t('letterType')}:*</CustomInputLabel>
                  </Grid>
                  <StyledGrid item xs={12} sm={10} xl={11}>
                    <Field
                      name="letterType"
                      inputProps={{ id: 'letterType' }}
                      as={SelectFieldForOfferAndLetterType}
                      options={dropDownValue?.letterTypes}
                      sx={{
                        width: { xs: '100%', sm: '100%' },
                        background: '#434857',
                      }}
                    />
                    <ErrorMessage
                      name="letterType"
                      component={ErrorTextValidation}
                    />
                  </StyledGrid>
                  <Grid container display={'flex'}>
                    <Grid item xs={12} sm={6}>
                      <Grid container display={'flex'}>
                        <Grid item xs={12} sm={4} mt={2} xl={2}>
                          <CustomInputLabel>
                            {t('draftAmount1')}:
                          </CustomInputLabel>
                        </Grid>
                        <StyledGrid item xs={12} sm={8}>
                          <AmountField
                            label={t('draftAmount1')}
                            name="draftAmount1"
                            isInteger={false}
                            precision={21}
                            scale={2}
                            formatAmount={true}
                            startAdornment="$"
                            fullWidth
                          />
                        </StyledGrid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Grid container display={'flex'}>
                        <Grid
                          item
                          xs={12}
                          sm={4}
                          xl={2}
                          mt={2}
                          display={'flex'}
                          sx={{
                            justifyContent: {
                              xs: 'flex-start',
                              sm: 'center',
                            },
                          }}
                        >
                          <CustomInputLabel> {t('length')}:</CustomInputLabel>
                        </Grid>
                        <StyledGrid item xs={12} sm={8}>
                          <Field
                            name="draftLength1"
                            fullWidth
                            as={StyledInputField}
                            type="text"
                            inputProps={{
                              id: 'draftLength1',
                              maxLength: 3,
                            }}
                          />
                          <ErrorMessage
                            name="draftLength1"
                            component={ErrorTextValidation}
                          />
                        </StyledGrid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container display={'flex'}>
                    <Grid item xs={12} sm={6}>
                      <Grid container display={'flex'}>
                        <Grid item xs={12} sm={4} mt={2} xl={2}>
                          <CustomInputLabel>
                            {t('draftAmount2')}:
                          </CustomInputLabel>
                        </Grid>
                        <StyledGrid item xs={12} sm={8}>
                          <AmountField
                            label={t('draftAmount2')}
                            name="draftAmount2"
                            isInteger={false}
                            precision={21}
                            scale={2}
                            formatAmount={true}
                            startAdornment="$"
                            fullWidth
                          />
                        </StyledGrid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Grid container display={'flex'}>
                        <Grid
                          item
                          xs={12}
                          sm={4}
                          xl={2}
                          mt={2}
                          display={'flex'}
                          sx={{
                            justifyContent: {
                              xs: 'flex-start',
                              sm: 'center',
                            },
                          }}
                        >
                          <CustomInputLabel> {t('length')}:</CustomInputLabel>
                        </Grid>
                        <StyledGrid item xs={12} sm={8}>
                          <Field
                            name="draftLength2"
                            sx={{ width: '100%' }}
                            as={StyledInputField}
                            type="text"
                            inputProps={{
                              id: 'draftLength2',
                              maxLength: 3,
                            }}
                          />
                          <ErrorMessage
                            name="draftLength2"
                            component={ErrorTextValidation}
                          />
                        </StyledGrid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={2} xl={1}>
                    <CustomInputLabel>{t('address')}:</CustomInputLabel>
                  </Grid>
                  <StyledGrid item xs={12} sm={10} xl={11}>
                    <Field
                      name="offerAddress"
                      fullWidth
                      inputProps={{
                        id: 'offerAddress',
                        rows: 2,
                        maxLength: 255,
                      }}
                      component={CustomTextArea}
                    />
                  </StyledGrid>
                  <Grid item xs={12} sm={2} xl={1}>
                    <CustomInputLabel>{t('city')}:</CustomInputLabel>
                  </Grid>
                  <StyledGrid item xs={12} sm={10} xl={11}>
                    <Field
                      name="offerCity"
                      inputProps={{ id: 'offerCity', maxLength: 30 }}
                      as={StyledInputField}
                      type="text"
                      fullWidth
                    />
                  </StyledGrid>
                  <Grid item xs={12} sm={2} xl={1}>
                    <CustomInputLabel>{t('state')}:</CustomInputLabel>
                  </Grid>
                  <StyledGrid item xs={12} sm={10} xl={11}>
                    <StateDropdown
                      name="offerState"
                      inputProps={{ id: 'offerState' }}
                      fullWidth
                      sx={{
                        background: '#434857',
                        outline: 'none',
                        width: '100%',
                      }}
                    />
                  </StyledGrid>
                  <Grid item xs={12} sm={2} xl={1}>
                    <CustomInputLabel>{t('zip')}:</CustomInputLabel>
                  </Grid>
                  <StyledGrid item xs={12} sm={10} xl={11}>
                    <Field
                      name="offerZip"
                      as={StyledInputField}
                      fullWidth
                      inputProps={{ maxLength: 10, id: 'offerZip' }}
                      type="text"
                    />
                    <ErrorMessage
                      name="offerZip"
                      component={ErrorTextValidation}
                    />
                  </StyledGrid>
                  <Grid item xs={12} sm={2} xl={1}>
                    <CustomInputLabel>
                      {t('specialInstructions')}:
                    </CustomInputLabel>
                  </Grid>
                  <StyledGrid item xs={12} sm={10} xl={11} mb={1}>
                    <Field
                      name="comment3"
                      xsWidth="100%"
                      mdWidth="100%"
                      type="text"
                      inputProps={{ id: 'comment3', rows: 4 }}
                      component={CustomTextArea}
                    />
                  </StyledGrid>
                </Grid>
                <Grid container justifyContent="center">
                  <Grid item>
                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      id="save-button"
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
                      {t('saveOffer')}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      id="delete-button"
                      variant="outlined"
                      sx={{
                        my: '2rem',
                        ml: '1rem',
                        '&:disabled': {
                          opacity: 0.2,
                          cursor: 'not-allowed',
                          backgroundColor: '#1997c6',
                          color: '#fff',
                        },
                      }}
                      onClick={handleOpen}
                    >
                      {t('deleteOffer')}
                    </Button>
                  </Grid>
                  <CustomModel
                    open={openModel}
                    handleClose={handleClose}
                    handleDelete={handleDelete}
                    modalHeader="Delete Offer"
                    modalTitle={t('deleteWarning')}
                    modalButtonLabel="Delete"
                  />
                </Grid>
              </Form>
            )}
          </Formik>
        )
      )}
    </Container>
  );
};

export default EditOffer;
