/* eslint-disable max-depth */
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { Field, Form, Formik } from 'formik';
import { SectionOption } from '../../interface/common';
import { useAppDispatch } from '../../store/hooks';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CustomInputField } from '../../component/common/CustomInputField';
import {
  EditLegalPayload,
  LegalData,
  LocationState,
} from '../../interface/legal';
import {
  useLazyGetLegalDetailsQuery,
  useEditLegalMutation,
  useDeleteLegalMutation,
} from '../../store/Services/legalService';
import {
  callDir,
  callNo,
  deleteLegalTitle,
  getKeyValueOfNumber,
  interTypes,
  rangeEW,
  sources,
  status,
  townShipNS,
} from '../../utils/constants';
import { getCurrentYear } from '../../utils/GeneralUtil';
import Box from '@mui/material/Box/Box';
import {
  RenderFieldsForTXAndLA,
  RenderFieldsForNonTXAndLA,
} from './LegalFields';
import CustomModel from '../../component/common/CustomModal';
import { setTabName } from '../../store/Reducers/tabReducer';
import StateDropdown from '../../component/common/fields/StateDropdown';
import OverlayLoader from '../../component/common/OverlayLoader';
import {
  ErrorText,
  StyledGridItem,
  StyledInputLabel,
} from '../../component/common/CommonStyle';
import { CustomSelectField } from '../../component/CustomizedSelectComponent';
import CountyMultiSelect from '../../component/common/fields/CountyMultiSelectInput';

const initialValues: LegalData = {
  state: 'TX',
  county: '',
  section: 0,
  townshipNo: '',
  townshipNS: '',
  rangeNo: '',
  rangeEW: '',
  callDir1: '',
  callNo1: '',
  callDir2: '',
  callNo2: '',
  callDir3: '',
  callNo3: '',
  callDir4: '',
  callNo4: '',
  callDir5: '',
  callNo5: '',
  callDir6: '',
  callNo6: '',
  callDir7: '',
  callNo7: '',
  callDir8: '',
  callNo8: '',
  survey: '',
  lot: '',
  league: '',
  labor: '',
  block: '',
  abstract: '',
  nma: '',
  intType: 'RI',
  divInterest: '',
  year: getCurrentYear(),
  makeOffer: true,
  status: 'Unknown Address',
};

const EditLegal: React.FC = () => {
  const { t } = useTranslation('newLegal');
  const { legalId } = useParams();
  const [getLegalDetails, { data: legalDetails, isLoading }] =
    useLazyGetLegalDetailsQuery();
  const dispatch = useAppDispatch();
  const [md, setMd] = useState(1);
  const [error, setError] = useState<string>('');

  const handleResize = () => {
    if (window.innerWidth <= 1440) {
      setMd(2);
    } else {
      setMd(1);
    }
  };

  useEffect(() => {
    // Call handleResize initially to set the correct value on mount
    handleResize();

    // Add the resize event listener
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const [legalDetailsData, setLegalDetailsData] =
    useState<LegalData>(initialValues);
  const location = useLocation();
  const {
    isCopyLegal,
    isFileView = true,
    contactId,
  } = (location.state as LocationState) || {};

  useEffect(() => {
    void getLegalDetails({ legalId: Number(legalId) });
  }, [legalId]);

  useEffect(() => {
    if (legalDetails && legalDetails.data.legal) {
      setLegalDetailsData({
        ...legalDetails.data.legal,
        makeOffer: legalDetails.data.legal.makeOffer === 1 ? true : false,
      });
    }
  }, [legalDetails]);
  const [sectionOptions300, setSectionOptions300] = useState<SectionOption[]>(
    []
  );
  const [sectionOptions5000, setSectionOptions5000] = useState<SectionOption[]>(
    []
  );

  const [townShipNSOptions] = useState<SectionOption[]>(townShipNS);
  const [rangOptions] = useState<SectionOption[]>(rangeEW);

  const [callDirOptions] = useState<SectionOption[]>(callDir);
  const [callNoOptions] = useState<SectionOption[]>(callNo);
  const [statusOptions] = useState<SectionOption[]>(status);
  const [sourceOptions] = useState<SectionOption[]>(sources);
  const [interestTypesOptions] = useState<SectionOption[]>(interTypes);
  const [townShipNoOptions, setTownShipNoOptions] = useState<SectionOption[]>(
    []
  );
  const [rangeNoOptions, setRangeNoOptions] = useState<SectionOption[]>([]);
  const [openModel, setOpenModel] = React.useState(false);
  const handleOpen = () => setOpenModel(true);
  const handleClose = () => setOpenModel(false);
  useEffect(() => {
    setSectionOptions5000(getKeyValueOfNumber(5000));
    setSectionOptions300(getKeyValueOfNumber(300));
    setTownShipNoOptions(getKeyValueOfNumber(300));
    setRangeNoOptions(getKeyValueOfNumber(100));
  }, []);
  const validateForm = (values: LegalData) => {
    const errors: Partial<LegalData> = {};

    // Validate if 'nma' is a number
    if (values.nma && Number.isNaN(Number(values.nma))) {
      errors.nma = t('nmaMustNumber');
    }

    if (values.divInterest) {
      const divInterestValue = Number(values.divInterest);
      if (Number.isNaN(divInterestValue)) {
        errors.divInterest = t('divisionOfInterestMustNumber');
      } else if (divInterestValue >= 1) {
        errors.divInterest = t('divisionOfInterestMustBeLessThanOne');
      }
    }
    if (values.lot && values.lot.length > 255) {
      errors.lot = t('lot255ErrorText');
    }

    return errors;
  };

  const [editLegal] = useEditLegalMutation();
  const [deleteLegal] = useDeleteLegalMutation();
  const navigate = useNavigate();
  const errorCountyRef = React.useRef<HTMLDivElement>(null);

  const onSubmit = async (values: LegalData) => {
    if (!error) {
      try {
        const data = {
          legalID: Number(legalId),
          state: values.state,
          county: values.county,
          section: values.section,
          townshipNo: values.townshipNo,
          townshipNS: values.townshipNS,
          rangeNo: values.rangeNo,
          rangeEW: values.rangeEW,
          lot: values.lot,
          calls: [
            {
              callDir1: values.callDir1,
              callNo1: values.callNo1,
            },
            {
              callDir2: values.callDir2,
              callNo2: values.callNo2,
            },
            {
              callDir3: values.callDir3,
              callNo3: values.callNo3,
            },
            {
              callDir4: values.callDir4,
              callNo4: values.callNo4,
            },
            {
              callDir5: values.callDir5,
              callNo5: values.callNo5,
            },
            {
              callDir6: values.callDir6,
              callNo6: values.callNo6,
            },
            {
              callDir7: values.callDir7,
              callNo7: values.callNo7,
            },
            {
              callDir8: values.callDir8,
              callNo8: values.callNo8,
            },
          ],
          status: values.status,
          divInterest: values.divInterest,
          intType: values.intType,
          nma: values.nma,
          makeOffer: values.makeOffer,
          survey: values.survey,
          league: values.league,
          block: values.block,
          abstract: values.abstract,
          labor: values.labor,
          year: values.year,
        } as EditLegalPayload;

        // Remove null key-value pairs
        const filteredObj = Object.fromEntries(
          Object.entries(data).filter(([, value]) => value !== null)
        );

        const response = await editLegal(filteredObj);
        if ('data' in response) {
          if (response?.data?.success) {
            dispatch(
              open({
                severity: severity.success,
                message: response?.data?.message,
              })
            );
            if (isFileView) {
              navigate(`/editfile/${Number(values.fileID)}?tab=fileInfo`);
            } else {
              dispatch(setTabName({ tabName: 'legals' }));
              navigate(`/editcontact/${Number(contactId)}?tab=legals`);
            }
          }
        }
      } catch (error) {
        dispatch(
          open({
            severity: severity.error,
            message: 'unaccepted error occurred',
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

  const handleDelete = async () => {
    try {
      const response = await deleteLegal({ legalId: Number(legalId) });

      if ('data' in response) {
        if (response?.data?.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          setOpenModel(false);
          if (isFileView) {
            navigate(
              `/editfile/${Number(legalDetailsData.fileID)}?tab=fileInfo`
            );
          } else {
            dispatch(setTabName({ tabName: 'legals' }));
            navigate(`/editcontact/${Number(contactId)}?tab=legals`);
          }
        }
      }
    } catch (error) {
      dispatch(
        open({
          severity: severity.error,
          message: 'unaccepted error occurred',
        })
      );
    }
  };

  return (
    <Container component="main" fixed sx={{ marginTop: 2 }}>
      {isLoading ? (
        <OverlayLoader open />
      ) : (
        <Box>
          <Grid container alignItems="center" sx={{ mt: 2 }}>
            <Typography component="h6" className="header-title-h6">
              {t('fileMaster')}
            </Typography>
          </Grid>
          <Formik
            initialValues={legalDetailsData}
            enableReinitialize={true}
            validate={validateForm}
            onSubmit={onSubmit}
            validateOnBlur={false}
            validateOnChange={false}
          >
            {({ isSubmitting, values, errors }) => (
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
                        id="createContactTitle"
                      >
                        {isCopyLegal
                          ? t('copyLegalDesc')
                          : t('Edit Legal Description')}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container spacing={{ xs: 1, sm: 2 }}>
                    <StyledGridItem item xs={12} md={2} xl={1}>
                      <StyledInputLabel>{t('state')}:</StyledInputLabel>
                    </StyledGridItem>
                    <Grid item xs={12} md={10} xl={11}>
                      <StateDropdown
                        name="state"
                        inputProps={{ id: 'state' }}
                        emptyOption={false}
                        sx={{
                          width: { xs: '100%' },
                          background: '#434857',
                          outline: 'none',
                        }}
                      />
                    </Grid>
                    <StyledGridItem item xs={12} md={2} xl={1}>
                      <StyledInputLabel>{t('county')}:</StyledInputLabel>
                    </StyledGridItem>
                    <Grid item xs={12} md={10} xl={11}>
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
                    </Grid>
                    <StyledGridItem item xs={12} md={2} xl={1}>
                      <StyledInputLabel>{t('township')}:</StyledInputLabel>
                    </StyledGridItem>
                    <Grid
                      item
                      xs={12}
                      md={10}
                      xl={11}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Field
                        name="townshipNo"
                        inputProps={{ id: 'townshipNo' }}
                        component={CustomSelectField}
                        options={townShipNoOptions}
                        hasEmptyValue={true}
                        labelKey="value"
                        additionalStyle={{
                          width: { xs: '49%' },
                        }}
                      />
                      <Field
                        name="townshipNS"
                        inputProps={{ id: 'townshipNS' }}
                        component={CustomSelectField}
                        options={townShipNSOptions}
                        hasEmptyValue={true}
                        labelKey="value"
                        additionalStyle={{
                          width: { xs: '49%' },
                        }}
                      />
                    </Grid>
                    <StyledGridItem item xs={12} md={2} xl={1}>
                      <StyledInputLabel>{t('section')}:</StyledInputLabel>
                    </StyledGridItem>
                    <Grid item xs={12} md={10} xl={11}>
                      <Field
                        name="section"
                        inputProps={{ id: 'section' }}
                        component={CustomSelectField}
                        options={
                          ['TX', 'LA'].includes(values.state)
                            ? sectionOptions5000
                            : sectionOptions300
                        }
                        labelKey="value"
                        hasEmptyValue={true}
                      />
                    </Grid>
                    {['TX', 'LA'].includes(values.state)
                      ? RenderFieldsForTXAndLA(t)
                      : RenderFieldsForNonTXAndLA(
                          t,
                          rangeNoOptions,
                          rangOptions
                        )}
                    <StyledGridItem item xs={12} md={2} xl={1}>
                      <StyledInputLabel>{t('lot')}:</StyledInputLabel>
                    </StyledGridItem>
                    <Grid item xs={12} md={10} xl={11}>
                      <Field
                        name="lot"
                        as={CustomInputField}
                        backgroundColor="#434857"
                        width="100%"
                        type="text"
                        fullWidth
                        inputProps={{
                          id: 'lot',
                        }}
                      />
                      {errors.lot && (
                        <Box>
                          <ErrorText id="lot-error">{errors?.lot}</ErrorText>
                        </Box>
                      )}
                    </Grid>
                    <StyledGridItem item xs={12} md={2} xl={1}>
                      <StyledInputLabel>{t('calls')}:</StyledInputLabel>
                    </StyledGridItem>
                    <Grid item xs={12} md={10} xl={11}>
                      <Grid
                        container
                        spacing={{ xs: 2, md: 2, sm: 2 }}
                        columns={{ xs: 8, md: 8, sm: 8 }}
                      >
                        <Grid item xs={8} md={md} sm={2}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              width: '100%',
                            }}
                          >
                            <Field
                              name="callDir1"
                              inputProps={{ id: 'callDir1' }}
                              component={CustomSelectField}
                              options={callDirOptions}
                              labelKey="value"
                              hasEmptyValue={true}
                            />
                            <span>/</span>
                            <Field
                              name="callNo1"
                              inputProps={{ id: 'callNo1' }}
                              component={CustomSelectField}
                              options={callNoOptions}
                              hasEmptyValue={true}
                              labelKey="value"
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={8} md={md} sm={2}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '100%',
                            }}
                          >
                            <Field
                              name="callDir2"
                              inputProps={{ id: 'callDir2' }}
                              component={CustomSelectField}
                              options={callDirOptions}
                              hasEmptyValue={true}
                              labelKey="value"
                            />
                            <span>/</span>
                            <Field
                              name="callNo2"
                              inputProps={{ id: 'callNo2' }}
                              component={CustomSelectField}
                              options={callNoOptions}
                              hasEmptyValue={true}
                              labelKey="value"
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={8} md={md} sm={2}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              width: '100%',
                            }}
                          >
                            <Field
                              name="callDir3"
                              inputProps={{ id: 'callDir3' }}
                              component={CustomSelectField}
                              options={callDirOptions}
                              hasEmptyValue={true}
                              labelKey="value"
                            />
                            <span>/</span>
                            <Field
                              name="callNo3"
                              inputProps={{ id: 'callNo3' }}
                              component={CustomSelectField}
                              options={callNoOptions}
                              hasEmptyValue={true}
                              labelKey="value"
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={8} md={md} sm={2}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              width: '100%',
                            }}
                          >
                            <Field
                              name="callDir4"
                              inputProps={{ id: 'callDir4' }}
                              component={CustomSelectField}
                              options={callDirOptions}
                              hasEmptyValue={true}
                              labelKey="value"
                            />
                            <span>/</span>
                            <Field
                              name="callNo4"
                              inputProps={{ id: 'callNo4' }}
                              component={CustomSelectField}
                              options={callNoOptions}
                              hasEmptyValue={true}
                              labelKey="value"
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={8} md={md} sm={2}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              width: '100%',
                            }}
                          >
                            <Field
                              name="callDir5"
                              inputProps={{ id: 'callDir5' }}
                              component={CustomSelectField}
                              options={callDirOptions}
                              hasEmptyValue={true}
                              labelKey="value"
                            />
                            <span>/</span>
                            <Field
                              name="callNo5"
                              inputProps={{ id: 'callNo5' }}
                              component={CustomSelectField}
                              options={callNoOptions}
                              hasEmptyValue={true}
                              labelKey="value"
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={8} md={md} sm={2}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              width: '100%',
                            }}
                          >
                            <Field
                              name="callDir6"
                              inputProps={{ id: 'callDir6' }}
                              component={CustomSelectField}
                              options={callDirOptions}
                              hasEmptyValue={true}
                              labelKey="value"
                            />
                            <span>/</span>
                            <Field
                              name="callNo6"
                              inputProps={{ id: 'callNo6' }}
                              component={CustomSelectField}
                              options={callNoOptions}
                              hasEmptyValue={true}
                              labelKey="value"
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={8} md={md} sm={2}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              width: '100%',
                            }}
                          >
                            <Field
                              name="callDir7"
                              inputProps={{ id: 'callDir7' }}
                              component={CustomSelectField}
                              options={callDirOptions}
                              hasEmptyValue={true}
                              labelKey="value"
                            />
                            <span>/</span>
                            <Field
                              name="callNo7"
                              inputProps={{ id: 'callNo7' }}
                              component={CustomSelectField}
                              options={callNoOptions}
                              hasEmptyValue={true}
                              labelKey="value"
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={8} md={md} sm={2}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              width: '100%',
                            }}
                          >
                            <Field
                              name="callDir8"
                              inputProps={{ id: 'callDir8' }}
                              component={CustomSelectField}
                              options={callDirOptions}
                              hasEmptyValue={true}
                              labelKey="value"
                            />
                            <span>/</span>
                            <Field
                              name="callNo8"
                              inputProps={{ id: 'callNo8' }}
                              component={CustomSelectField}
                              options={callNoOptions}
                              hasEmptyValue={true}
                              labelKey="value"
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                    {['TX', 'LA'].includes(values.state) ? (
                      <>
                        <StyledGridItem item xs={12} md={2} xl={1}>
                          <StyledInputLabel>{t('status')}:</StyledInputLabel>
                        </StyledGridItem>
                        <Grid item xs={12} md={10} xl={11}>
                          <Field
                            name="status"
                            inputProps={{ id: 'status' }}
                            component={CustomSelectField}
                            options={statusOptions}
                            hasEmptyValue={true}
                            labelKey="value"
                          />
                        </Grid>
                      </>
                    ) : (
                      <>
                        <StyledGridItem item xs={12} md={2} xl={1}>
                          <StyledInputLabel>{t('source')}:</StyledInputLabel>
                        </StyledGridItem>
                        <Grid item xs={12} md={10} xl={11}>
                          <Field
                            name="status"
                            inputProps={{ id: 'status' }}
                            component={CustomSelectField}
                            options={sourceOptions}
                            hasEmptyValue={true}
                            labelKey="value"
                          />
                        </Grid>
                      </>
                    )}

                    <StyledGridItem item xs={12} md={2} xl={1}>
                      <StyledInputLabel>
                        {t('divisionOfInterest')}:
                      </StyledInputLabel>
                    </StyledGridItem>
                    <Grid item xs={12} md={10} xl={11}>
                      <Field
                        name="divInterest"
                        as={CustomInputField}
                        backgroundColor="#434857"
                        width="100%"
                        type="text"
                        fullWidth
                        inputProps={{
                          id: 'divInterest',
                          maxLength: '11',
                        }}
                      />
                      {errors.divInterest && (
                        <Box>
                          <ErrorText id="divInterest-error">
                            {errors?.divInterest}
                          </ErrorText>
                        </Box>
                      )}
                    </Grid>
                    <StyledGridItem item xs={12} md={2} xl={1}>
                      <StyledInputLabel>{t('nma')}:</StyledInputLabel>
                    </StyledGridItem>
                    <Grid item xs={12} md={10} xl={11}>
                      <Field
                        name="nma"
                        as={CustomInputField}
                        backgroundColor="#434857"
                        width="100%"
                        type="text"
                        fullWidth
                        inputProps={{
                          id: 'nma',
                        }}
                      />
                      {errors.nma && (
                        <Box>
                          <ErrorText id="nma-error">{errors?.nma}</ErrorText>
                        </Box>
                      )}
                    </Grid>
                    <StyledGridItem item xs={12} md={2} xl={1}>
                      <StyledInputLabel>{t('interestType')}:</StyledInputLabel>
                    </StyledGridItem>
                    <Grid item xs={12} md={10} xl={11}>
                      <Field
                        name="intType"
                        inputProps={{ id: 'intType' }}
                        component={CustomSelectField}
                        options={interestTypesOptions}
                        hasEmptyValue={true}
                        labelKey="value"
                      />
                    </Grid>
                    <StyledGridItem item xs={4} md={2} xl={1}>
                      <StyledInputLabel>{t('makeOffer')}:</StyledInputLabel>
                    </StyledGridItem>
                    <Grid item xs={1} md={1}>
                      <Field
                        name="makeOffer"
                        inputProps={{ id: 'makeOffer' }}
                        type="checkbox"
                        as={Checkbox}
                        sx={{
                          color: '#1997c6',
                          padding: 0,
                          '&.Mui-checked': { color: '#1997c6 !important' },
                        }}
                        size="small"
                        color="info"
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={{ xs: 2, sm: 2 }}
                    sx={{
                      marginTop: '10px !important',
                      justifyContent: 'center',
                      width: '100% !important',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '20px',
                      }}
                    >
                      <Button
                        type="submit"
                        id="edit-legal-button"
                        variant="outlined"
                        disabled={isSubmitting}
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
                        {t('saveLegal')}
                      </Button>

                      <Button
                        id="delete-legal-button"
                        variant="outlined"
                        onClick={handleOpen}
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
                        {t('deleteLegal')}
                      </Button>
                    </Box>
                  </Grid>
                  <CustomModel
                    open={openModel}
                    handleClose={handleClose}
                    handleDelete={handleDelete}
                    modalHeader={t('deleteLegal')}
                    modalTitle={deleteLegalTitle}
                    modalButtonLabel={t('delete')}
                  />
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      )}
    </Container>
  );
};

export default EditLegal;
