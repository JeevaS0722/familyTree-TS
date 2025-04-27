import React, { memo, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import { Field, FieldArray, FormikErrors } from 'formik';
import { CustomInputField } from '../../component/common/CustomInputField';
import { CustomCheckbox } from '../../component/common/CustomCheckbox';
import CustomDatePicker from '../../component/FormikCustomDatePicker';
import CancelIcon from '@mui/icons-material/Cancel';
import { CustomTextArea } from '../../component/CommonComponent';
import {
  AltData,
  EditContactData,
  EditContactError,
  EmailData,
  EmailSchemaData,
  PhoneData,
  PhoneSchemasData,
  TitleData,
} from '../../interface/contact';
import { CustomPhoneField } from '../../component/common/CustomPhoneField';
import StateDropdown from '../../component/common/fields/StateDropdown';
import ConstantDropdown from '../../component/common/fields/ConstantDropdown';
import {
  CustomInputLabel,
  ErrorText,
  StyledGridItem,
  StyledInputLabel,
  StyledRadio,
} from '../../component/common/CommonStyle';
import { EditDeedFormInterface } from '../../interface/deed';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormikTextField from '../../component/common/fields/TextField';
import IconButton from '@mui/material/IconButton';
import { emailDeleteTitle, phoneDeleteTitle } from '../../utils/constants';

const ContactInfo: React.FC<{
  values: EditContactData;
  errors: FormikErrors<EditContactError>;
  handlePhoneChange: (
    index: number,
    key: keyof PhoneData,
    value: string
  ) => void;
  handleEmailChange: (
    index: number,
    key: keyof EmailData,
    value: string
  ) => void;
  addNewPhone: () => void;
  addNewEmail: () => void;
  phone: PhoneData[];
  email: EmailData[];
  phone1Ref: React.RefObject<(HTMLInputElement | null)[]>;
  phone2Ref: React.RefObject<(HTMLInputElement | null)[]>;
  phone3Ref: React.RefObject<(HTMLInputElement | null)[]>;
  contactDetails: EditDeedFormInterface;
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) => void;
  altName: AltData[];
  addNewAltName: () => void;
  handleAltNameChange: (
    index: number,
    key: keyof AltData,
    value: string
  ) => void;
  handleTitleChange: (
    index: number,
    key: keyof TitleData,
    value: string
  ) => void;
  addNewTitle: () => void;
  title: TitleData[];
  openDeleteModal: (
    type: 'phone' | 'email',
    index: number,
    header: string,
    title: string
  ) => void;
}> = ({
  values,
  handlePhoneChange,
  addNewPhone,
  addNewEmail,
  handleEmailChange,
  phone,
  email,
  errors,
  phone1Ref,
  phone2Ref,
  phone3Ref,
  contactDetails,
  setFieldValue,
  altName,
  addNewAltName,
  handleAltNameChange,
  handleTitleChange,
  addNewTitle,
  title,
  openDeleteModal,
}) => {
  const { t } = useTranslation('editContact');
  const errorOwnerShipRef = useRef<HTMLDivElement>(null);
  const errorFirstNameRef = useRef<HTMLDivElement>(null);
  const errorEmailRef = useRef<HTMLDivElement>(null);
  const errorDOBRef = useRef<HTMLDivElement>(null);
  const errorDecDtRef = useRef<HTMLDivElement>(null);
  const errorTickleredRef = useRef<HTMLDivElement>(null);
  const errorAltNameRef = useRef<HTMLDivElement>(null);
  const errorAltNameFormatRef = useRef<HTMLDivElement>(null);
  const errorTitleNameRef = useRef<HTMLDivElement>(null);
  const errorTitlePrepositionRef = useRef<HTMLDivElement>(null);
  const errorTitleEntityNameRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (errors?.ownership) {
      errorOwnerShipRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
    if (errors?.dOB) {
      errorDOBRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
    if (errors?.decDt) {
      errorDecDtRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
    if (errors?.ticklered) {
      errorTickleredRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
    if (errors?.firstName) {
      errorFirstNameRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
    if (errors?.phone) {
      phone2Ref.current?.[0]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
    if (errors?.email) {
      errorEmailRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
    if (Array.isArray(errors?.altName)) {
      errors.altName.forEach(altNameError => {
        if (altNameError?.altName) {
          errorAltNameRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
        if (altNameError?.altNameFormat) {
          errorAltNameFormatRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      });
    }
    if (Array.isArray(errors?.title)) {
      errors.title.forEach(titleError => {
        if (titleError?.title) {
          errorTitleNameRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
        if (titleError?.preposition) {
          errorTitlePrepositionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
        if (titleError?.entityName) {
          errorTitleEntityNameRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      });
    }
  }, [
    errors?.ownership,
    errors?.dOB,
    errors?.decDt,
    errors?.ticklered,
    errors?.altName,
    errors?.firstName,
    errors?.phone,
    errors?.email,
    errors?.title,
  ]);

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      gap="20px"
    >
      <Stack direction="column" justifyContent="center" alignItems="center">
        <Grid container spacing={{ xs: 2, md: 2 }}>
          <StyledGridItem item xs={12} md={2} xl={1}>
            <StyledInputLabel>{t('relation')}: </StyledInputLabel>
          </StyledGridItem>
          <Grid item xs={12} md={10} xl={11}>
            <Field
              name="relationship"
              as={CustomInputField}
              width="70%"
              backgroundColor="#434857"
              type="text"
              inputProps={{
                id: 'relationship',
                maxLength: 50,
              }}
            />
          </Grid>

          <StyledGridItem item xs={12} md={2} xl={1}>
            <StyledInputLabel>{t('ownership')}: </StyledInputLabel>
          </StyledGridItem>
          <Grid item xs={12} md={10} xl={11}>
            <Grid container spacing={{ xs: 2, md: 2 }}>
              <Grid item xs={12} md={3} ref={errorOwnerShipRef}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '4px',
                  }}
                >
                  <Field
                    name="ownership"
                    as={CustomInputField}
                    backgroundColor="#434857"
                    width="100%"
                    type="text"
                    inputProps={{
                      id: 'ownership',
                      maxLength: 10,
                    }}
                  />
                  <Typography display="inline">%</Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  alignContent: 'center',
                }}
              >
                {values.totalNMAOwned !== 0 && (
                  <Typography
                    id="totalNMAOwned"
                    display="inline"
                    component="span"
                    sx={{
                      fontStyle: 'italic',
                    }}
                  >
                    {t('totalNMAOwned')}: {values.totalNMAOwned}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={3}></Grid>
            </Grid>
            {errors?.ownership && (
              <Box>
                <ErrorText>{errors?.ownership}</ErrorText>
              </Box>
            )}
          </Grid>

          <StyledGridItem item xs={12} md={2} xl={1}>
            <StyledInputLabel>{t('lastName')}: </StyledInputLabel>
          </StyledGridItem>
          <Grid item xs={12} md={10} xl={11}>
            <Field
              name="lastName"
              as={CustomInputField}
              width="70%"
              backgroundColor="#434857"
              type="text"
              inputProps={{
                id: 'lastName',
                maxLength: 255,
              }}
            />
          </Grid>

          <StyledGridItem item xs={12} md={2} xl={1}>
            <StyledInputLabel>{t('firstName')}: </StyledInputLabel>
          </StyledGridItem>
          <Grid item xs={12} md={10} xl={11}>
            <Grid container spacing={{ xs: 1, sm: 2 }}>
              <Grid
                item
                xs={12}
                md={12}
                ref={errorFirstNameRef}
                component={Box}
              >
                <Field
                  name="firstName"
                  as={CustomInputField}
                  backgroundColor="#434857"
                  width="100%"
                  type="text"
                  inputProps={{
                    id: 'firstName',
                    maxLength: 255,
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={{ xs: 1, sm: 2 }}>
              <Grid item xs={12} md={12}>
                {errors?.firstName && (
                  <div id="firstNameError">
                    <ErrorText>{errors?.firstName}</ErrorText>
                  </div>
                )}
              </Grid>
            </Grid>
          </Grid>

          <FieldArray name="altName">
            {() => (
              <>
                {altName &&
                  altName?.length > 0 &&
                  altName.map((data, index) => (
                    <React.Fragment key={index}>
                      <StyledGridItem item xs={12} md={2} xl={1}>
                        <StyledInputLabel>
                          {t('alternativeName')} {index + 1}:{' '}
                        </StyledInputLabel>
                      </StyledGridItem>

                      <Grid
                        item
                        xs={12}
                        md={10}
                        xl={11}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexDirection: { xs: 'column', md: 'row' },
                        }}
                      >
                        <Box
                          sx={{
                            width: { xs: '100%', md: '50%' },
                          }}
                        >
                          <Field
                            name={`altName.${index}.altName`}
                            as={CustomInputField}
                            ref={errorAltNameRef}
                            width="100%"
                            backgroundColor="#434857"
                            type="text"
                            inputProps={{
                              id: `altName_${index}`,
                              maxLength: 255,
                              onChange: (e: { target: { value: string } }) => {
                                handleAltNameChange(
                                  index,
                                  'altName',
                                  e.target.value
                                );
                              },
                            }}
                          />
                          {errors?.altName &&
                            Array.isArray(errors.altName) &&
                            errors.altName[index]?.altName && (
                              <Box ref={errorAltNameRef}>
                                <ErrorText>
                                  {errors.altName[index].altName}
                                </ErrorText>
                              </Box>
                            )}
                        </Box>
                        <Box
                          sx={{
                            width: { xs: '100%', md: '48%' },
                            ml: { md: 2 },
                          }}
                        >
                          <FormControl>
                            <RadioGroup
                              row
                              ref={errorAltNameFormatRef}
                              name={`altName.${index}.altNameFormat`}
                              value={
                                values.altName?.[index]?.altNameFormat || ''
                              }
                              onChange={e =>
                                setFieldValue(
                                  `altName.${index}.altNameFormat`,
                                  e.target.value
                                )
                              }
                            >
                              <FormControlLabel
                                value="a/k/a"
                                sx={{
                                  '& .MuiTypography-root': {
                                    color: '#cfd2da',
                                  },
                                }}
                                control={<StyledRadio />}
                                label="a/k/a"
                              />
                              <FormControlLabel
                                value="f/k/a"
                                sx={{
                                  '& .MuiTypography-root': {
                                    color: '#cfd2da',
                                  },
                                }}
                                control={<StyledRadio />}
                                label="f/k/a"
                              />
                            </RadioGroup>
                          </FormControl>
                          {errors?.altName &&
                            Array.isArray(errors.altName) &&
                            errors.altName[index]?.altNameFormat && (
                              <Box ref={errorAltNameFormatRef}>
                                <ErrorText>
                                  {errors.altName[index].altNameFormat}
                                </ErrorText>
                              </Box>
                            )}
                        </Box>
                      </Grid>
                    </React.Fragment>
                  ))}
              </>
            )}
          </FieldArray>
          <Grid
            item
            xs={12}
            md={12}
            sx={{
              marginTop: '10px',
            }}
          >
            <Button
              id="new-altName-button"
              variant="outlined"
              onClick={addNewAltName}
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
              {t('addNewAltName')}
            </Button>
          </Grid>

          <FieldArray name="title">
            {() => (
              <>
                {title &&
                  title?.length > 0 &&
                  title.map((data, index) => (
                    <React.Fragment key={index}>
                      <StyledGridItem item xs={12} md={2} xl={1}>
                        <StyledInputLabel>
                          {t('titleField')} {index + 1}:{' '}
                        </StyledInputLabel>
                      </StyledGridItem>

                      <Grid
                        item
                        xs={12}
                        md={10}
                        xl={11}
                        sx={{
                          display: 'flex',
                          flexDirection: { xs: 'column', md: 'row' },
                          gap: '10px',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          <CustomInputLabel>
                            {t('individuallyAndAs')}
                          </CustomInputLabel>
                          <Field
                            name={`title.${index}.individuallyAndAs`}
                            inputProps={{ id: `individuallyAndAs_${index}` }}
                            type="checkbox"
                            as={Checkbox}
                            sx={{ color: 'white' }}
                            size="small"
                            color="info"
                            checked={
                              values.title?.[index]?.individuallyAndAs || false
                            }
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setFieldValue(
                                `title.${index}.individuallyAndAs`,
                                e.target.checked
                              );
                            }}
                          />
                        </Box>
                        <Box sx={{ width: { xs: '100%', md: '20%' } }}>
                          <ConstantDropdown
                            type="title"
                            ref={errorTitleNameRef}
                            name={`title.${index}.title`}
                            inputProps={{ id: `title_${index}` }}
                            sx={{
                              width: '100%',
                              background: '#434857',
                              outline: 'none',
                            }}
                          />
                          {errors?.title &&
                            Array.isArray(errors.title) &&
                            errors.title[index]?.title && (
                              <Box ref={errorTitleNameRef}>
                                <ErrorText>
                                  {errors.title[index].title}
                                </ErrorText>
                              </Box>
                            )}
                        </Box>
                        <Box sx={{ width: { xs: '100%', md: '20%' } }}>
                          <ConstantDropdown
                            type="preposition"
                            ref={errorTitlePrepositionRef}
                            name={`title.${index}.preposition`}
                            inputProps={{ id: `preposition${index}` }}
                            sx={{
                              width: '100%',
                              background: '#434857',
                              outline: 'none',
                            }}
                          />
                          {errors?.title &&
                            Array.isArray(errors.title) &&
                            errors.title[index]?.preposition && (
                              <Box ref={errorTitlePrepositionRef}>
                                <ErrorText>
                                  {errors.title[index].preposition}
                                </ErrorText>
                              </Box>
                            )}
                        </Box>
                        <Box sx={{ width: { xs: '100%', md: '20%' } }}>
                          <FormikTextField
                            name={`title.${index}.entityName`}
                            ref={errorTitleEntityNameRef}
                            placeholder="Entity Name"
                            inputProps={{
                              id: `entityName_${index}`,
                              maxLength: 255,
                              onChange: e =>
                                handleTitleChange(
                                  index,
                                  'entityName',
                                  e.target.value
                                ),
                            }}
                            sx={{ width: '100%' }}
                            type="text"
                          />
                          {errors?.title &&
                            Array.isArray(errors.title) &&
                            errors.title[index]?.entityName && (
                              <Box ref={errorTitleEntityNameRef}>
                                <ErrorText>
                                  {errors.title[index].entityName}
                                </ErrorText>
                              </Box>
                            )}
                        </Box>
                      </Grid>
                    </React.Fragment>
                  ))}
                <Grid
                  item
                  xs={12}
                  md={12}
                  sx={{ marginTop: '10px', marginBottom: '10px' }}
                >
                  <Button
                    id="new-title-button"
                    variant="outlined"
                    onClick={addNewTitle}
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
                    {t('addNewTitle')}
                  </Button>
                </Grid>
              </>
            )}
          </FieldArray>

          <StyledGridItem item xs={12} md={2} xl={1}>
            <StyledInputLabel>{t('ssn')}: </StyledInputLabel>
          </StyledGridItem>
          <Grid item xs={12} md={10} xl={11}>
            <Field
              name="sSN"
              as={CustomInputField}
              backgroundColor="#434857"
              width="40%"
              type="text"
              inputProps={{
                id: 'sSN',
                maxLength: 9,
              }}
            />
          </Grid>

          <StyledGridItem item xs={12} md={2} xl={1}>
            <StyledInputLabel>{t('deceased')}: </StyledInputLabel>
          </StyledGridItem>
          <Grid item xs={12} md={10} xl={11}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '4px',
              }}
            >
              <Field
                name="deceased"
                inputProps={{
                  id: 'deceased',
                }}
                type="checkbox"
                as={CustomCheckbox}
                sx={{ color: 'white' }}
                size="small"
                color="info"
              />
              <Grid>
                {/* <CustomDatePicker
                  name="decDt"
                  type="date"
                  id="decDt"
                  width="100%"
                  sx={{
                    paddingTop: '0 !important',
                  }}
                />
                <Grid item>
                  {errors?.decDt && (
                    <Box ref={errorDecDtRef}>
                      <ErrorText id="error-decDt">{errors?.decDt}</ErrorText>
                    </Box>
                  )}
                </Grid> */}
                <Field
                  name="decDt"
                  as={CustomInputField}
                  backgroundColor="#434857"
                  width="100%"
                  type="text"
                  inputProps={{
                    id: 'decDt',
                  }}
                />
              </Grid>
            </Box>
          </Grid>

          <StyledGridItem item xs={12} md={2} xl={1}>
            <StyledInputLabel>{t('dob')}: </StyledInputLabel>
          </StyledGridItem>
          <Grid item xs={12} md={10} xl={11}>
            {/* <CustomDatePicker
              name="dOB"
              type="date"
              id="dOB"
              width="40%"
              sx={{
                paddingTop: '0 !important',
              }}
            />
            {errors?.dOB && (
              <Box ref={errorDOBRef}>
                <ErrorText id="error-dOB">{errors?.dOB}</ErrorText>
              </Box>
            )} */}
            <Field
              name="dOB"
              as={CustomInputField}
              backgroundColor="#434857"
              width="40%"
              type="text"
              inputProps={{
                id: 'dOB',
              }}
            />
          </Grid>

          <StyledGridItem item xs={12} md={2} xl={1}>
            <StyledInputLabel>{t('address')}: </StyledInputLabel>
          </StyledGridItem>
          <Grid item xs={12} md={10} xl={11}>
            <Field
              name="address"
              xsWidth="100%"
              mdWidth="70%"
              inputProps={{ id: 'address', rows: 1 }}
              component={CustomTextArea}
            />
          </Grid>

          <StyledGridItem item xs={12} md={2} xl={1}>
            <StyledInputLabel>{t('city')}: </StyledInputLabel>
          </StyledGridItem>
          <Grid item xs={12} md={10} xl={11}>
            <Field
              name="city"
              as={CustomInputField}
              backgroundColor="#434857"
              width="70%"
              type="text"
              inputProps={{
                id: 'city',
              }}
            />
          </Grid>

          <StyledGridItem item xs={12} md={2} xl={1}>
            <StyledInputLabel>{t('state')}: </StyledInputLabel>
          </StyledGridItem>
          <Grid item xs={12} md={10} xl={11}>
            <StateDropdown
              name="state"
              inputProps={{
                id: 'state',
              }}
              sx={{
                width: { xs: '100%', md: '50%' },
                background: '#434857',
              }}
            />
          </Grid>

          <StyledGridItem item xs={12} md={2} xl={1}>
            <StyledInputLabel>{t('zip')}: </StyledInputLabel>
          </StyledGridItem>
          <Grid item xs={12} md={10} xl={11}>
            <Field
              name="zip"
              as={CustomInputField}
              backgroundColor="#434857"
              width="40%"
              type="text"
              inputProps={{
                id: 'zip',
                maxLength: 10,
              }}
            />
            {errors?.zip && (
              <Box>
                <ErrorText>{errors?.zip}</ErrorText>
              </Box>
            )}
          </Grid>

          <FieldArray name="phone">
            {() => (
              <>
                {phone &&
                  phone?.length > 0 &&
                  phone.map((data, index) => (
                    <React.Fragment key={index}>
                      <StyledGridItem item xs={12} md={2} xl={1}>
                        <StyledInputLabel>
                          {t('phone')} {index + 1}:
                        </StyledInputLabel>
                      </StyledGridItem>
                      <Grid item xs={12} md={10} xl={11}>
                        <Grid container spacing={{ xs: 1, sm: 2 }}>
                          <Grid item xs={12} md={4} xl={3}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                gap: '6px',
                              }}
                            >
                              <Field
                                name={`phone.${index}.areaCode`}
                                as={CustomPhoneField}
                                length={3}
                                innerRef={(el: HTMLInputElement | null) => {
                                  if (phone1Ref.current) {
                                    phone1Ref.current[index] = el;
                                  }
                                }}
                                nextFieldRef={(el: HTMLInputElement | null) => {
                                  if (phone2Ref.current) {
                                    phone2Ref.current[index] = el;
                                  }
                                }}
                                sx={{
                                  width: '100%',
                                  fontSize: '1.2rem',
                                }}
                                inputProps={{
                                  id: `areaCode_${index}`,
                                  maxLength: '3',
                                  onChange: (e: {
                                    target: { value: string };
                                  }) => {
                                    handlePhoneChange(
                                      index,
                                      'areaCode',
                                      e.target.value
                                    );
                                  },
                                }}
                              />
                              <span>-</span>
                              <Field
                                name={`phone.${index}.prefix`}
                                as={CustomPhoneField}
                                sx={{ width: '100%' }}
                                length={3}
                                innerRef={(el: HTMLInputElement | null) => {
                                  if (phone2Ref.current) {
                                    phone2Ref.current[index] = el;
                                  }
                                }}
                                nextFieldRef={(el: HTMLInputElement | null) => {
                                  if (phone3Ref.current) {
                                    phone3Ref.current[index] = el;
                                  }
                                }}
                                inputProps={{
                                  id: `prefix_${index}`,
                                  maxLength: '3',
                                  onChange: (e: {
                                    target: { value: string };
                                  }) => {
                                    handlePhoneChange(
                                      index,
                                      'prefix',
                                      e.target.value
                                    );
                                  },
                                }}
                              />
                              <span>-</span>
                              <Field
                                name={`phone.${index}.phoneNo`}
                                as={CustomPhoneField}
                                sx={{ width: '100%' }}
                                length={4}
                                innerRef={(el: HTMLInputElement | null) => {
                                  if (phone3Ref.current) {
                                    phone3Ref.current[index] = el;
                                  }
                                }}
                                inputProps={{
                                  id: `phoneNo_${index}`,
                                  maxLength: '4',
                                  onChange: (e: {
                                    target: { value: string };
                                  }) => {
                                    handlePhoneChange(
                                      index,
                                      'phoneNo',
                                      e.target.value
                                    );
                                  },
                                }}
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={8} xl={9}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <ConstantDropdown
                                type="phoneDesc"
                                name={`phone.${index}.phoneDesc`}
                                inputProps={{
                                  id: `phoneDesc_${index}`,
                                }}
                                sx={{
                                  width: { xs: '100%', md: '30%' },
                                  background: '#434857',
                                  outline: 'none',
                                }}
                              />
                              <Tooltip title="Delete Phone">
                                <IconButton
                                  color="error"
                                  id={`delete-phone-${index}`}
                                  onClick={() =>
                                    openDeleteModal(
                                      'phone',
                                      index,
                                      'Delete Phone',
                                      phoneDeleteTitle
                                    )
                                  }
                                  aria-label={`Delete phone ${index + 1}`}
                                  size="small"
                                >
                                  <CancelIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Grid>
                        </Grid>
                        {errors.phone && errors.phone[index] && (
                          <ErrorText>
                            {(errors.phone[index] as PhoneSchemasData)
                              ?.areaCode ||
                              (errors.phone[index] as PhoneSchemasData)
                                ?.prefix ||
                              (errors.phone[index] as PhoneSchemasData)
                                ?.phoneNo}
                          </ErrorText>
                        )}
                      </Grid>
                    </React.Fragment>
                  ))}
              </>
            )}
          </FieldArray>
        </Grid>
      </Stack>

      <Grid
        container
        spacing={{ xs: 1, sm: 2 }}
        sx={{
          marginTop: '10px',
        }}
      >
        <Grid item xs={12} md={12}>
          <Button
            id="new-phone-button"
            variant="outlined"
            onClick={addNewPhone}
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
            {t('newPhone')}
          </Button>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={{ xs: 2, sm: 2 }}
        sx={{
          marginTop: '10px',
        }}
      >
        <FieldArray name="email">
          {() => (
            <>
              {email &&
                email?.length > 0 &&
                email.map((data, index) => (
                  <React.Fragment key={index}>
                    <StyledGridItem item xs={12} md={2} xl={1}>
                      <StyledInputLabel>
                        {t('email')} {index + 1}:
                      </StyledInputLabel>
                    </StyledGridItem>

                    <Grid
                      item
                      xs={12}
                      md={10}
                      xl={11}
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: '100%', md: '40%' },
                        }}
                      >
                        <Field
                          name={`email.${index}.email`}
                          as={CustomInputField}
                          ref={errorEmailRef}
                          width="100%"
                          backgroundColor="#434857"
                          type="text"
                          inputProps={{
                            id: `email_${index}`,
                            onChange: (e: { target: { value: string } }) => {
                              handleEmailChange(index, 'email', e.target.value);
                            },
                          }}
                        />
                        {errors.email && errors.email[index] && (
                          <ErrorText>
                            {(errors.email[index] as EmailSchemaData)?.email}
                          </ErrorText>
                        )}
                      </Box>
                      <Box
                        sx={{
                          width: { xs: '100%', md: '20%' },
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <ConstantDropdown
                          type="emailDesc"
                          name={`email.${index}.emailDesc`}
                          inputProps={{
                            id: `emailDesc_${index}`,
                          }}
                          sx={{
                            background: '#434857',
                            outline: 'none',
                            width: { xs: '100%', md: '70%' },
                            marginTop: { xs: '5px', md: '0px' },
                            marginLeft: { xs: '0', md: '5px' },
                          }}
                        />
                        <Tooltip title="Delete Email">
                          <IconButton
                            color="error"
                            id={`delete-email-${index}`}
                            onClick={() =>
                              openDeleteModal(
                                'email',
                                index,
                                'Delete Email',
                                emailDeleteTitle
                              )
                            }
                            aria-label={`Delete email ${index + 1}`}
                            size="small"
                            sx={{ marginLeft: '8px' }}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>
                  </React.Fragment>
                ))}
            </>
          )}
        </FieldArray>
      </Grid>
      <Grid
        container
        spacing={{ xs: 1, sm: 2 }}
        sx={{
          marginTop: '10px',
        }}
      >
        <Grid item xs={12} md={12}>
          <Button
            id="new-email-button"
            variant="outlined"
            onClick={addNewEmail}
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
            {t('addNewEmail')}
          </Button>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={{ xs: 2, sm: 2 }}
        sx={{
          marginTop: '10px',
        }}
      >
        <StyledGridItem item xs={12} md={2} xl={1}>
          <StyledInputLabel
            sx={{ color: contactDetails.ticklered ? '#FF0000' : '' }}
          >
            {t('tickleredForDate')}:
          </StyledInputLabel>
        </StyledGridItem>
        <Grid item xs={12} md={10} xl={11}>
          <CustomDatePicker
            name="ticklered"
            type="date"
            id="ticklered"
            width="50%"
            sx={{
              paddingTop: '0 !important',
            }}
          />
          {errors?.ticklered && (
            <Box ref={errorDOBRef}>
              <ErrorText id="error-dOB">{errors?.ticklered}</ErrorText>
            </Box>
          )}
        </Grid>
      </Grid>

      <Grid
        container
        spacing={{ xs: 2, md: 1 }}
        sx={{
          marginTop: '10px',
        }}
      >
        <Grid item xs={12} md={12}>
          <Grid
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '10px',
            }}
          >
            <Field
              name="visit"
              inputProps={{
                id: 'visit',
              }}
              type="checkbox"
              as={Checkbox}
              sx={{ color: 'white', marginLeft: '-10px' }}
              size="small"
              color="info"
            />
            <StyledInputLabel>{t('visitInPerson')} </StyledInputLabel>
          </Grid>
        </Grid>

        <Grid item xs={12} md={12}>
          <Grid
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '10px',
            }}
          >
            <Field
              name="dNC"
              inputProps={{
                id: 'dNC',
              }}
              type="checkbox"
              as={Checkbox}
              sx={{ color: 'white', marginLeft: '-10px' }}
              size="small"
              color="info"
            />
            <StyledInputLabel
              sx={{ color: contactDetails.dNC ? 'red' : '#cfd2da' }}
            >
              {t('notInterested')}{' '}
            </StyledInputLabel>
          </Grid>
        </Grid>

        <Grid item xs={12} md={12}>
          <Grid
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '10px',
            }}
          >
            <Field
              name="fastTrack"
              inputProps={{
                id: 'fastTrack',
              }}
              type="checkbox"
              as={Checkbox}
              sx={{ color: 'white', marginLeft: '-10px' }}
              size="small"
              color="info"
            />
            <StyledInputLabel>{t('fastTrack')} </StyledInputLabel>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={{ xs: 2, sm: 2 }}
        sx={{
          marginTop: '10px',
        }}
      >
        <Grid item xs={12} md={12}>
          Last Modified By: {values.modifyBy} at {values.modifyDt}
        </Grid>
      </Grid>
    </Stack>
  );
};

export default memo(ContactInfo);
