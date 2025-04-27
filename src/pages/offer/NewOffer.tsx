/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { ErrorMessage, Field, Form, Formik, FormikProps } from 'formik';
import {
  ContactDetailResponse,
  DropdownObjectForOffer,
  FileData,
  FormikInstance,
  OfferValues,
} from '../../interface/offer';
import {
  CustomTextArea,
  SelectFieldForOfferAndLetterType,
} from '../../component/CommonComponent';
import {
  useGetLetterTypeQuery,
  useGetOfferTypeQuery,
} from '../../store/Services/commonService';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLazyGetContactsByIdsQuery } from '../../store/Services/contactService';
import { useLazyGetFileDetailsQuery } from '../../store/Services/fileService';
import { offerDataSchema } from '../../schemas/newOffer';
import { useTranslation } from 'react-i18next';
import { useCreateOfferMutation } from '../../store/Services/offerService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import OverlayLoader from '../../component/common/OverlayLoader';
import StyledInputField, {
  CustomInputLabel,
  ErrorTextValidation,
  StyledGrid,
} from '../../component/common/CommonStyle';
import BuyerDropdown from '../../component/common/fields/BuyerDropdown';
import AmountField from '../../component/common/fields/AmountField';
import { formatAltName, formatTitle, safeJoin } from '../../utils/GeneralUtil';

const initialValues: OfferValues = {
  offerType: 5,
  letterType: 1,
  draftAmount1: 150,
  draftLength1: 5,
  draftLength2: 30,
  comment3: '',
};
const NewOffer: React.FC = () => {
  const { t } = useTranslation('newOffer');
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [fromRecentOffer, setFromRecentOffer] = useState<boolean>(false);
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [fileDetailsData, setFileDetailsData] = useState<FileData>();
  const [loading, setLoading] = useState(true);
  const { data: offerTypeData } = useGetOfferTypeQuery();
  const { data: letterTypeData } = useGetLetterTypeQuery();
  const [createOffer] = useCreateOfferMutation();
  const formikRefs = useRef<Record<string, FormikInstance | null>>({});
  const [errorField, setErrorField] = useState<FormikInstance | null>(null);
  const [isButtonClicked, setIsButtonClicked] = useState<boolean>(false);
  const navigate = useNavigate();
  const recentOffer = useAppSelector(state => state.recentOffers.recentOffers);
  const [dropDownValue, setDropDownValue] = useState<DropdownObjectForOffer>({
    offerTypes: [],
    letterTypes: [],
  });
  const [contactDetailsData, setContactDetailsData] = useState<
    ContactDetailResponse[]
  >([]);
  const [getFileDetails, { data: fileDetails, isLoading: isFileLoading }] =
    useLazyGetFileDetailsQuery();

  const [
    getContactsDetails,
    { data: contactsDetails, isLoading: contactDetailsLoading, isFetching },
  ] = useLazyGetContactsByIdsQuery();

  useEffect(() => {
    const sortBy = location.state.sortBy as string;
    const sortOrder = location.state.sortOrder as string;
    const selectedContactIds = location.state?.selectedContacts.join(
      ','
    ) as string;
    setSelectedContacts(location.state?.selectedContacts || []);
    void getFileDetails({ fileid: Number(location.state?.fileId) });
    void getContactsDetails({
      contactIds: selectedContactIds,
      sortBy,
      sortOrder,
    });
    setFromRecentOffer(location.state?.fromRecentOffer || false);
  }, [location.state]);

  useEffect(() => {
    if (
      offerTypeData &&
      offerTypeData.data &&
      letterTypeData &&
      letterTypeData.data &&
      fileDetails &&
      fileDetails.data.file
    ) {
      setDropDownValue({
        offerTypes: offerTypeData.data,
        letterTypes: letterTypeData.data,
      });
      setFileDetailsData({
        totalFileOffer: fileDetails.data.file.totalFileOffer,
        totalFileValue: fileDetails.data.file.totalFileValue,
        fileID: fileDetails.data.file.fileID,
        fileName: fileDetails.data.file.fileName,
      });
      setLoading(false);
    }
  }, [offerTypeData, letterTypeData, fileDetails]);

  useEffect(() => {
    if (fileDetails && fileDetails.data.file) {
      if (contactsDetails && contactsDetails.data?.contacts) {
        contactsDetails.data.contacts.forEach(contact => {
          // 1. Safely build First + Last name:
          let grantors = safeJoin(contact?.firstName, contact?.lastName);

          // 2. Safely format each Title (skip any null fields) and join them
          const titles = (contact?.TitlesModels || [])
            .map(title => formatTitle(title))
            .filter(Boolean) as string[];

          // Join all titles with a space
          const titleText = titles.join(' ');

          // 3. Append alternative names if they exist
          if (contact?.AlternativeNamesModels?.length) {
            contact.AlternativeNamesModels.forEach(alt => {
              const altNameStr = formatAltName(alt.altNameFormat, alt.altName);
              // Only append if something is left after filtering
              if (altNameStr) {
                grantors += ` ${altNameStr}`;
              }
            });
          }

          // 4. Append the compiled title text
          if (titleText) {
            grantors += ` ${titleText}`;
          }

          // 5. Calculate draftAmount2Value
          let draftAmount2Value = 0;
          if (fileDetails?.data?.file?.totalFileOffer) {
            const ownership = parseFloat(contact?.ownership || '0');
            if (ownership > 0) {
              draftAmount2Value =
                ownership * fileDetails?.data?.file?.totalFileOffer;
            } else {
              draftAmount2Value =
                fileDetails?.data?.file?.totalFileOffer /
                selectedContacts.length;
            }
          }
          draftAmount2Value = Math.round(draftAmount2Value);

          // 6. Check if this contact had a recent offer
          const offerForContact = fromRecentOffer
            ? recentOffer.find(offer => offer.contactID === contact.contactID)
            : null;

          // 7. Build the new contact data object
          const newContact = {
            contactID: contact.contactID,
            data: {
              contactID: contact.contactID,
              ownership: contact.ownership,
              offerBy: contact.FilesModel.whose,
              grantors,
              address: contact.address,
              city: contact.city,
              state: contact.state,
              zip: contact.zip,
              draftAmount2: draftAmount2Value || 0,
              ...initialValues,
              ...(offerForContact
                ? {
                    // If any of these are null/undefined, default to empty string
                    draftAmount1: offerForContact.draftAmount1 ?? 0,
                    draftAmount2: offerForContact.draftAmount2 ?? 0,
                    offerType: offerForContact.offerType ?? '',
                    letterType: offerForContact.letterType ?? '',
                    comment3: offerForContact.comment3 ?? '',
                  }
                : {}),
            },
          };

          // 8. Check for duplicates before adding
          const alreadyExists = contactDetailsData.find(
            dataItem => dataItem.contactID === newContact.contactID
          );
          if (!alreadyExists) {
            setContactDetailsData(prevData => [...prevData, newContact]);
          }
        });
      }
    }
  }, [selectedContacts, fileDetails, contactsDetails]);
  const onSubmit = useCallback(
    async (values: OfferValues[]) => {
      try {
        const payload = {
          fileID: Number(location?.state?.fileId),
          offerBy: Number(values[0].offerBy),
          offers: values.map(({ offerBy, ownership, ...rest }) => ({
            ...rest,
            draftAmount1: rest.draftAmount1.toString() || '0',
            draftAmount2: rest.draftAmount2.toString() || '0',
            draftLength1: Number(rest.draftLength1) || 0,
            draftLength2: Number(rest.draftLength2) || 0,
          })),
        };
        const response = await createOffer(payload);
        if ('data' in response && response.data.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          navigate(`/editfile/${Number(location?.state?.fileId)}`);
        }
        setIsButtonClicked(false);
      } catch (error) {
        dispatch(
          open({
            severity: severity.error,
            message: 'An Unexpected Error Occurred',
          })
        );
        setIsButtonClicked(false);
      }
    },
    [createOffer, dispatch, location?.state?.fileId, navigate]
  );
  useEffect(() => {
    if (errorField) {
      const firstErrorFieldName = Object.keys(errorField?.errors)[0];
      const errorElement = document.getElementById(
        `${firstErrorFieldName}-${errorField?.values?.contactID}`
      );
      errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [errorField]);

  const handleSubmit = useCallback(() => {
    const formikRefArray = Object.values(formikRefs.current).filter(
      formikRef => formikRef !== null
    );

    const isFormValid = formikRefArray.every(formikRef => formikRef?.isValid);
    if (isFormValid) {
      const formDataArray = formikRefArray.map(formikRef => formikRef?.values);
      setIsButtonClicked(true);
      void onSubmit(formDataArray);
    } else {
      const firstErrorField = formikRefArray.find(
        formikRef =>
          formikRef?.errors && Object.keys(formikRef?.errors).length > 0
      );
      if (firstErrorField) {
        setErrorField(firstErrorField);
      } else {
        setErrorField(null);
      }
    }
  }, [formikRefs, onSubmit]);

  type FormikInstances = FormikProps<OfferValues[]>;
  const handleOfferByChange = (formik: FormikInstances, value: string) => {
    void formik.setFieldValue('offerBy', Number(value));
  };

  return (
    <>
      {loading || contactDetailsLoading || isFileLoading || isFetching ? (
        <Container component="main" fixed sx={{ mt: 2 }}>
          <OverlayLoader open />
        </Container>
      ) : (
        <Container component="main" fixed sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Typography
              variant="h4"
              component="p"
              gutterBottom
              id="makeOffersFor"
              sx={{ color: 'white', fontSize: '24px' }}
            >
              {t('makeOffersFor')} {fileDetailsData?.fileName}
            </Typography>
            <Typography
              variant="h4"
              component="p"
              gutterBottom
              sx={{ color: 'white', fontSize: '24px' }}
              id="totalFileValue"
            >
              {t('totalFileValue')}:{' '}
              {fileDetailsData?.totalFileValue.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}
            </Typography>
            <Typography
              variant="h4"
              component="p"
              gutterBottom
              sx={{ color: 'white', fontSize: '24px' }}
              id="totalFileOfferValue"
            >
              {t('totalFileOffer')}:{' '}
              {fileDetailsData?.totalFileOffer.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}
            </Typography>
          </Grid>
          {contactDetailsData?.map(contact => (
            <Formik
              key={contact.contactID}
              enableReinitialize={true}
              initialValues={{ ...contact.data } as OfferValues[]}
              validationSchema={offerDataSchema(t)}
              onSubmit={onSubmit}
              validateOnBlur={true}
              validateOnChange={false}
              innerRef={ref => {
                if (ref) {
                  formikRefs.current[contact.contactID] = ref;
                }
              }}
            >
              {formik => (
                <Form>
                  <Grid container alignItems="center" sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={2} xl={1}>
                      <CustomInputLabel>{t('offerBy')}:*</CustomInputLabel>
                    </Grid>
                    <StyledGrid item xs={12} sm={10} xl={11}>
                      <BuyerDropdown
                        name="offerBy"
                        inputProps={{ id: `offerBy-${contact.contactID}` }}
                        sx={{
                          width: { xs: '100%', sm: '30%' },
                          background: '#434857',
                        }}
                        onChange={(e: React.ChangeEvent<{ value: string }>) =>
                          handleOfferByChange(formik, e.target.value)
                        }
                      />
                      <ErrorMessage
                        name="offerBy"
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
                        inputProps={{
                          id: `grantors-${contact.contactID}`,
                        }}
                      />
                      <ErrorMessage
                        name="grantors"
                        component={ErrorTextValidation}
                      />
                    </StyledGrid>
                    <Grid item xs={12} sm={2} xl={1}>
                      <CustomInputLabel> {t('ownership')}:</CustomInputLabel>
                    </Grid>
                    <StyledGrid
                      item
                      xs={12}
                      sm={10}
                      xl={11}
                      sx={{ display: { xs: 'flex' } }}
                    >
                      <Field
                        disabled={true}
                        name="ownership"
                        inputProps={{
                          id: 'ownership',
                          maxLength: 10,
                        }}
                        as={StyledInputField}
                        sx={{
                          width: '15%',
                        }}
                        type="text"
                      />
                      <Box component="span" sx={{ color: 'white', ml: '4px' }}>
                        %
                      </Box>
                    </StyledGrid>
                    <Grid item xs={12} sm={2} xl={1}>
                      <CustomInputLabel> {t('offerType')}:*</CustomInputLabel>
                    </Grid>
                    <StyledGrid item xs={12} sm={10} xl={11}>
                      <Field
                        name="offerType"
                        inputProps={{ id: `offerType-${contact.contactID}` }}
                        as={SelectFieldForOfferAndLetterType}
                        options={dropDownValue?.offerTypes}
                        sx={{
                          width: { xs: '100%', sm: '30%' },
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
                        inputProps={{ id: `letterType-${contact.contactID}` }}
                        as={SelectFieldForOfferAndLetterType}
                        options={dropDownValue?.letterTypes}
                        sx={{
                          width: { xs: '100%', sm: '30%' },
                          background: '#434857',
                        }}
                      />
                      <ErrorMessage
                        name="letterType"
                        component={ErrorTextValidation}
                      />
                    </StyledGrid>
                    <Grid
                      container
                      display={'flex'}
                      justifyContent={'flex-start'}
                    >
                      <Grid item xs={12} sm={2} xl={1} mt={2}>
                        <CustomInputLabel>
                          {' '}
                          {t('draftAmount1')}:
                        </CustomInputLabel>
                      </Grid>
                      <StyledGrid item xs={12} sm={2} xl={1}>
                        <AmountField
                          label={t('draftAmount1')}
                          name="draftAmount1"
                          id={`draftAmount1-${contact.contactID}`}
                          isInteger={false}
                          precision={21}
                          scale={2}
                          formatAmount={true}
                          startAdornment="$"
                          fullWidth
                        />
                      </StyledGrid>
                      <Grid
                        item
                        xs={12}
                        sm={1}
                        mt={2}
                        sx={{ ml: { xs: 0, sm: 4 } }}
                      >
                        <CustomInputLabel> {t('length')}:</CustomInputLabel>
                      </Grid>
                      <StyledGrid item xs={12} sm={2} xl={1}>
                        <Field
                          name="draftLength1"
                          sx={{ width: '100%' }}
                          as={StyledInputField}
                          type="text"
                          inputProps={{
                            id: `draftLength1-${contact.contactID}`,
                            maxLength: 3,
                          }}
                        />
                        <ErrorMessage
                          name="draftLength1"
                          component={ErrorTextValidation}
                        />
                      </StyledGrid>
                    </Grid>
                    <Grid
                      container
                      display={'flex'}
                      justifyContent={'flex-start'}
                    >
                      <Grid item xs={12} sm={2} xl={1} mt={2}>
                        <CustomInputLabel>
                          {' '}
                          {t('draftAmount2')}:
                        </CustomInputLabel>
                      </Grid>
                      <StyledGrid item xs={12} sm={2} xl={1}>
                        <AmountField
                          name="draftAmount2"
                          label={t('draftAmount2')}
                          id={`draftAmount2-${contact.contactID}`}
                          isInteger={false}
                          precision={21}
                          scale={2}
                          formatAmount={true}
                          startAdornment="$"
                          fullWidth
                        />
                      </StyledGrid>
                      <Grid
                        item
                        xs={12}
                        sm={1}
                        mt={2}
                        sx={{ ml: { xs: 0, sm: 4 } }}
                      >
                        <CustomInputLabel> {t('length')}:</CustomInputLabel>
                      </Grid>
                      <StyledGrid item xs={12} sm={2} xl={1}>
                        <Field
                          name="draftLength2"
                          sx={{ width: '100%' }}
                          as={StyledInputField}
                          type="text"
                          inputProps={{
                            id: `draftLength2-${contact.contactID}`,
                            maxLength: 3,
                          }}
                        />
                        <ErrorMessage
                          name="draftLength2"
                          component={ErrorTextValidation}
                        />
                      </StyledGrid>
                    </Grid>
                    <Grid item xs={12} sm={2} xl={1}>
                      <CustomInputLabel>{t('comment3')}:</CustomInputLabel>
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
                </Form>
              )}
            </Formik>
          ))}
          <Grid container justifyContent="center">
            <Grid item>
              <Button
                onClick={() => handleSubmit()}
                disabled={isButtonClicked}
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
                {t('sendOffersToQueue')}
              </Button>
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
};

export default NewOffer;
