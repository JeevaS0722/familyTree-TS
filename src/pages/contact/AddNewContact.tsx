import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { Field, Form, Formik, FormikHelpers, FieldArray } from 'formik';
import { CustomTextArea } from '../../component/CommonComponent';
import {
  AltData,
  AltNameSchemaData,
  EmailData,
  EmailSchemaData,
  NewContactForm,
  PhoneData,
  PhoneSchemasData,
  TitleData,
} from '../../interface/contact';
import { newContactSchema } from '../../schemas/newContact';
import { useCreateContactMutation } from '../../store/Services/contactService';
import { useAppDispatch } from '../../store/hooks';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { CustomInputField } from '../../component/common/CustomInputField';
import ConstantDropdown from '../../component/common/fields/ConstantDropdown';
import StateDropdown from '../../component/common/fields/StateDropdown';
import * as Yup from 'yup';
import {
  CustomInputLabel,
  ErrorText,
  StyledGridItem,
  StyledInputLabel,
  StyledRadio,
} from '../../component/common/CommonStyle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import { CustomPhoneField } from '../../component/common/CustomPhoneField';
import FormikTextField from '../../component/common/fields/TextField';

const initialValues: NewContactForm = {
  fileID: null,
  relationship: '',
  ownership: '',
  lastName: '',
  firstName: '',
  sSN: '',
  deceased: false,
  decDt: '',
  dOB: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  memo: '',
  phone: [],
  email: [],
  altName: [],
  title: [],
};

interface LocationStateData {
  fileId: number;
  fileName: string;
}
const AddNewContact: React.FC = () => {
  const { t } = useTranslation('newcontact');
  const [createContact] = useCreateContactMutation();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { fileId, fileName } = location.state as LocationStateData;
  const [phone, setPhone] = React.useState<PhoneData[]>([
    {
      phoneDesc: '',
      phoneNo: '',
      areaCode: '',
      prefix: '',
    },
  ]);
  const [email, setEmail] = React.useState<EmailData[]>([
    {
      email: '',
      emailDesc: '',
    },
  ]);
  const [altName, setAltName] = React.useState<AltData[]>([
    {
      altName: '',
      altNameFormat: '',
    },
  ]);
  const [title, setTitle] = React.useState<TitleData[]>([
    {
      individuallyAndAs: false,
      title: '',
      preposition: '',
      entityName: '',
    },
  ]);
  const [formErrors, setErrors] = useState<{
    dOB?: string;
    decDt?: string;
    firstName?: string;
    ownership?: string;
    zip?: string;
    phone?: PhoneSchemasData[];
    email?: EmailSchemaData[];
    altName?: AltNameSchemaData[];
    title?: TitleData[];
  }>();
  const errorDOBRef = useRef<HTMLLabelElement>(null);
  const errorDecDtRef = useRef<HTMLLabelElement>(null);
  const errorFirstNameRef = useRef<HTMLDivElement>(null);
  const errorOwnerShipRef = useRef<HTMLDivElement>(null);
  const errorAltNameRef = useRef<HTMLDivElement>(null);
  const errorAltNameFormatRef = useRef<HTMLDivElement>(null);
  const errorzipRef = useRef<HTMLDivElement>(null);
  const errorEmailRef = useRef<HTMLDivElement>(null);
  const errorTitleNameRef = useRef<HTMLDivElement>(null);
  const errorTitlePrepositionRef = useRef<HTMLDivElement>(null);
  const errorTitleEntityNameRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (formErrors?.firstName) {
      setTimeout(() => {
        errorFirstNameRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 200);
    }
    if (formErrors?.ownership) {
      setTimeout(() => {
        errorOwnerShipRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 200);
    }
    if (formErrors?.dOB) {
      setTimeout(() => {
        errorDOBRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 200);
    }
    if (formErrors?.decDt) {
      setTimeout(() => {
        errorDecDtRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 200);
    }
    if (Array.isArray(formErrors?.altName)) {
      formErrors.altName.forEach(altNameError => {
        if (altNameError?.altName) {
          setTimeout(() => {
            errorAltNameRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest',
            });
          }, 100);
        }
        if (altNameError?.altNameFormat) {
          setTimeout(() => {
            errorAltNameFormatRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest',
            });
          }, 100);
        }
      });
    }
    if (Array.isArray(formErrors?.title)) {
      formErrors.title.forEach(titleError => {
        if (titleError?.title) {
          setTimeout(() => {
            errorTitleNameRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest',
            });
          }, 100);
        }
        if (titleError?.preposition) {
          setTimeout(() => {
            errorTitlePrepositionRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest',
            });
          }, 100);
        }
        if (titleError?.entityName) {
          setTimeout(() => {
            errorTitleEntityNameRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest',
            });
          }, 100);
        }
      });
    }
    if (formErrors?.phone) {
      setTimeout(() => {
        phone2Ref.current?.[0]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
        });
      }, 200);
    }
    if (formErrors?.email) {
      setTimeout(() => {
        errorEmailRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
        });
      }, 100);
    }
    if (formErrors?.zip) {
      setTimeout(() => {
        errorzipRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 200);
    }
  }, [formErrors]);

  const phone1Ref = React.useRef<(HTMLInputElement | null)[]>([]);
  const phone2Ref = React.useRef<(HTMLInputElement | null)[]>([]);
  const phone3Ref = React.useRef<(HTMLInputElement | null)[]>([]);
  const addNewPhone = () => {
    setPhone([
      ...phone,
      { areaCode: '', prefix: '', phoneNo: '', phoneDesc: '' },
    ]);
  };
  const addNewEmail = () => {
    setEmail([...email, { email: '', emailDesc: '' }]);
  };
  const addNewAltName = () => {
    setAltName([...altName, { altName: '', altNameFormat: '' }]);
  };
  const addNewTitle = () => {
    setTitle([
      ...title,
      { individuallyAndAs: false, title: '', preposition: '', entityName: '' },
    ]);
  };
  const handlePhoneChange = (
    index: number,
    key: keyof PhoneData,
    value: string
  ) => {
    if (
      key === 'phoneNo' ||
      key === 'areaCode' ||
      key === 'prefix' ||
      key === 'phoneDesc'
    ) {
      const updatedPhone = [...phone];

      updatedPhone[index][key] = value;

      setPhone(updatedPhone);
      if (key === 'areaCode' && value.length === 3) {
        phone2Ref.current[index]?.focus();
      } else if (key === 'prefix' && value.length === 3) {
        phone3Ref.current[index]?.focus();
      }
    }
  };

  const handleTitleChange = (
    index: number,
    key: keyof TitleData,
    value: string
  ) => {
    const updatedTitle = [...title];
    updatedTitle[index][key] = value;
    setTitle(updatedTitle);
  };
  const handleEmailChange = (
    index: number,
    key: keyof EmailData,
    value: string
  ) => {
    if (key === 'email' || key === 'emailDesc') {
      const updatedEmail = [...email];
      updatedEmail[index][key] = value;
      setEmail(updatedEmail);
    }
  };
  const handleAltNameChange = (
    index: number,
    key: keyof AltData,
    value: string
  ) => {
    if (key === 'altName' || key === 'altNameFormat') {
      const updateAltName = [...altName];
      updateAltName[index][key] = value;
      setAltName(updateAltName);
    }
  };
  const checkPhoneValuesEmpty = (obj: Partial<PhoneData>): boolean => {
    for (const key in obj) {
      if (obj[key as keyof PhoneData] !== '') {
        return false;
      }
    }
    return true;
  };
  const checkEmailValuesEmpty = (obj: Partial<EmailData>): boolean => {
    for (const key in obj) {
      if (obj[key as keyof EmailData] !== '') {
        return false;
      }
    }
    return true;
  };

  const checkAltNameEmpty = (obj: Partial<AltData>): boolean => {
    for (const key in obj) {
      if (obj[key as keyof AltData] !== '') {
        return false;
      }
    }
    return true;
  };

  const checkTitleEmpty = (obj: Partial<TitleData>): boolean => {
    return (
      !obj.title?.trim() && !obj.preposition?.trim() && !obj.entityName?.trim()
    );
  };

  const onSubmit = async (
    values: NewContactForm,
    actions: FormikHelpers<NewContactForm>
  ) => {
    try {
      // const phone = `${values.areaCode}${values.prefix}${values.phoneNo}`;
      const data = {
        fileID: Number(fileId),
        relationship: values.relationship,
        ownership: values.ownership,
        lastName: values.lastName,
        firstName: values.firstName,
        sSN: values.sSN,
        deceased: values.deceased,
        // decDt: values.decDt ? formatDateByMonth(values.decDt).toString() : '',
        // dOB: values.dOB ? formatDateByMonth(values.dOB).toString() : '',
        decDt: values.decDt,
        dOB: values.dOB,
        address: values.address,
        city: values.city,
        state: values.state,
        zip: values.zip,
        note: {
          memo: values.memo?.trim(),
        },
        phone: values.phone?.filter(obj => !checkPhoneValuesEmpty(obj)),
        email: values.email?.filter(obj => !checkEmailValuesEmpty(obj)),
        altName: values.altName?.filter(obj => !checkAltNameEmpty(obj)),
        title: values.title?.filter(
          obj => obj.individuallyAndAs || !checkTitleEmpty(obj)
        ),
      };
      const response = await createContact(data);
      if ('data' in response) {
        if (response?.data?.success) {
          actions.resetForm();
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          navigate(`/editcontact/${response?.data?.data?.contactID}`, {
            state: {
              fileId: fileId,
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
  };

  return (
    <Container component="main" fixed sx={{ marginTop: 2 }}>
      <Grid container alignItems="center" sx={{ mt: 2 }}>
        <Typography component="h6" className="header-title-h6">
          {t('fileMaster')}
        </Typography>
      </Grid>
      <Formik
        initialValues={initialValues}
        validationSchema={newContactSchema(t)}
        onSubmit={onSubmit}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ isSubmitting, errors, setFieldValue, values }) => (
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
                    {t('createNewContact')} {fileName}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={{ xs: 1, sm: 2 }}>
                <StyledGridItem item xs={12} md={2} xl={1}>
                  <StyledInputLabel>{t('relation')}:</StyledInputLabel>
                </StyledGridItem>
                <Grid item xs={12} md={10} xl={11}>
                  <Field
                    name="relationship"
                    as={CustomInputField}
                    backgroundColor="#434857"
                    width="50%"
                    type="text"
                    fullWidth
                    inputProps={{
                      id: 'relationship',
                      maxLength: 50,
                    }}
                  />
                </Grid>

                <StyledGridItem item xs={12} md={2} xl={1}>
                  <StyledInputLabel>{t('ownership')}:</StyledInputLabel>
                </StyledGridItem>
                <Grid item xs={12} md={10} xl={11}>
                  <Grid container spacing={{ xs: 1, sm: 2 }} id="ownershipGrid">
                    <Grid item xs={12} md={12} component={Box}>
                      <Field
                        name="ownership"
                        as={CustomInputField}
                        backgroundColor="#434857"
                        width="20%"
                        type="text"
                        fullWidth
                        inputProps={{
                          id: 'ownership',
                          maxLength: 10,
                        }}
                      />
                      <Typography display="inline">%</Typography>
                    </Grid>
                  </Grid>
                  <Grid container spacing={{ xs: 1, sm: 2 }}>
                    <Grid item xs={12} md={12}>
                      {errors?.ownership && (
                        <Box ref={errorOwnerShipRef}>
                          <ErrorText>{errors?.ownership}</ErrorText>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </Grid>

                <StyledGridItem item xs={12} md={2} xl={1}>
                  <StyledInputLabel>{t('lastName')}:</StyledInputLabel>
                </StyledGridItem>
                <Grid item xs={12} md={10} xl={11}>
                  <Field
                    name="lastName"
                    as={CustomInputField}
                    backgroundColor="#434857"
                    width="50%"
                    type="text"
                    fullWidth
                    inputProps={{
                      id: 'lastName',
                      maxLength: 255,
                    }}
                  />
                </Grid>

                <StyledGridItem item xs={12} md={2} xl={1}>
                  <StyledInputLabel>{t('firstName')}: *</StyledInputLabel>
                </StyledGridItem>
                <Grid item xs={12} md={10} xl={11}>
                  <Grid container spacing={{ xs: 1, sm: 2 }} id="firstNameGrid">
                    <Grid item xs={12} md={12} component={Box}>
                      <Field
                        name="firstName"
                        as={CustomInputField}
                        backgroundColor="#434857"
                        width="50%"
                        type="text"
                        fullWidth
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
                        <Box ref={errorFirstNameRef}>
                          <ErrorText>{errors?.firstName}</ErrorText>
                        </Box>
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
                                {t('altName')} {index + 1}:{' '}
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
                                  width: { xs: '100%', md: '60%' },
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
                                    onChange: (e: {
                                      target: { value: string };
                                    }) => {
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
                                  width: { xs: '100%', md: '35%' },
                                  ml: { md: 2 },
                                }}
                              >
                                <FormControl>
                                  <RadioGroup
                                    row
                                    ref={errorAltNameFormatRef}
                                    name={`altName.${index}.altNameFormat`}
                                    value={
                                      values.altName?.[index]?.altNameFormat ||
                                      ''
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
                    marginBottom: '10px',
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
                                  inputProps={{
                                    id: `individuallyAndAs_${index}`,
                                  }}
                                  type="checkbox"
                                  as={Checkbox}
                                  sx={{ color: 'white' }}
                                  size="small"
                                  color="info"
                                  checked={
                                    values.title?.[index]?.individuallyAndAs ||
                                    false
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
                  <StyledInputLabel>{t('ssn')}:</StyledInputLabel>
                </StyledGridItem>
                <Grid item xs={12} md={10} xl={11}>
                  <Field
                    name="sSN"
                    as={CustomInputField}
                    backgroundColor="#434857"
                    width="30%"
                    type="text"
                    fullWidth
                    inputProps={{
                      id: 'sSN',
                      maxLength: 9,
                    }}
                  />
                </Grid>

                <StyledGridItem item xs={3} md={2} xl={1}>
                  <StyledInputLabel>{t('deceased')}:</StyledInputLabel>
                </StyledGridItem>
                <Grid item xs={9} md={10} xl={11}>
                  <Field
                    name="deceased"
                    inputProps={{ id: 'deceased' }}
                    type="checkbox"
                    as={Checkbox}
                    sx={{
                      color: 'white',
                      padding: 0,
                      '&.Mui-checked': { color: '#fff !important' },
                    }}
                    size="small"
                    color="info"
                  />
                </Grid>

                <StyledGridItem item xs={12} md={2} xl={1}>
                  <StyledInputLabel>{t('dateOfDeath')}:</StyledInputLabel>
                </StyledGridItem>
                {/* <Grid item xs={12} md={10} xl={11}>
                  <CustomDatePicker
                    name="decDt"
                    type="date"
                    id="decDt"
                    width="30%"
                    style={{
                      demo: {
                        sx: {
                          paddingTop: '0px',
                        },
                      },
                    }}
                  />
                  {errors?.decDt && (
                    <Box ref={errorDecDtRef}>
                      <ErrorText id="error-decDt">{errors?.decDt}</ErrorText>
                    </Box>
                  )}
                </Grid> */}
                <Grid item xs={12} md={10} xl={11}>
                  <Field
                    name="decDt"
                    as={CustomInputField}
                    backgroundColor="#434857"
                    width="30%"
                    type="text"
                    fullWidth
                    inputProps={{
                      id: 'decDt',
                    }}
                  />
                </Grid>
                <StyledGridItem item xs={12} md={2} xl={1}>
                  <StyledInputLabel>{t('dateOfBirth')}:</StyledInputLabel>
                </StyledGridItem>
                {/* <Grid item xs={12} md={10} xl={11}>
                  <CustomDatePicker
                    name="dOB"
                    type="date"
                    id="dOB"
                    width="30%"
                    style={{
                      demo: {
                        sx: {
                          paddingTop: '0px',
                        },
                      },
                    }}
                  />
                  {errors?.dOB && (
                    <Box ref={errorDOBRef}>
                      <ErrorText id="error-dOB">{errors?.dOB}</ErrorText>
                    </Box>
                  )}
                </Grid> */}
                <Grid item xs={12} md={10} xl={11}>
                  <Field
                    name="dOB"
                    as={CustomInputField}
                    backgroundColor="#434857"
                    width="30%"
                    type="text"
                    fullWidth
                    inputProps={{
                      id: 'dOB',
                    }}
                  />
                </Grid>

                <StyledGridItem item xs={12} md={2} xl={1}>
                  <StyledInputLabel>{t('address')}:</StyledInputLabel>
                </StyledGridItem>
                <Grid item xs={12} md={10} xl={11}>
                  <Field
                    name="address"
                    xsWidth="100%"
                    mdWidth="50%"
                    inputProps={{ id: 'address', rows: 1 }}
                    component={CustomTextArea}
                  />
                </Grid>

                <StyledGridItem item xs={12} md={2} xl={1}>
                  <StyledInputLabel>{t('city')}:</StyledInputLabel>
                </StyledGridItem>
                <Grid item xs={12} md={10} xl={11}>
                  <Field
                    name="city"
                    as={CustomInputField}
                    backgroundColor="#434857"
                    width="50%"
                    type="text"
                    fullWidth
                    inputProps={{
                      id: 'city',
                    }}
                  />
                </Grid>

                <StyledGridItem item xs={12} md={2} xl={1}>
                  <StyledInputLabel>{t('state')}:</StyledInputLabel>
                </StyledGridItem>
                <Grid item xs={12} md={10} xl={11}>
                  <StateDropdown
                    name="state"
                    inputProps={{ id: 'state' }}
                    sx={{
                      width: { xs: '100%', md: '30%' },
                      background: '#434857',
                      outline: 'none',
                    }}
                  />
                </Grid>

                <StyledGridItem item xs={12} md={2} xl={1}>
                  <StyledInputLabel>{t('zipCode')}:</StyledInputLabel>
                </StyledGridItem>
                <Grid item xs={12} md={10} xl={11}>
                  <Field
                    name="zip"
                    as={CustomInputField}
                    backgroundColor="#434857"
                    width="30%"
                    type="text"
                    fullWidth
                    inputProps={{
                      id: 'zip',
                      maxLength: 10,
                    }}
                  />
                  {errors?.zip && (
                    <Box ref={errorzipRef}>
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
                            <StyledGridItem
                              item
                              xs={12}
                              md={2}
                              xl={1}
                              sx={{
                                marginTop: '10px',
                              }}
                            >
                              <StyledInputLabel>
                                {t('phone')} {index + 1}:
                              </StyledInputLabel>
                            </StyledGridItem>
                            <Grid
                              item
                              xs={12}
                              md={10}
                              xl={11}
                              sx={{
                                marginTop: '10px',
                              }}
                            >
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
                                      innerRef={(
                                        el: HTMLInputElement | null
                                      ) => {
                                        if (phone1Ref.current) {
                                          phone1Ref.current[index] = el;
                                        }
                                      }}
                                      nextFieldRef={(
                                        el: HTMLInputElement | null
                                      ) => {
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
                                      sx={{
                                        width: '100%',
                                      }}
                                      length={3}
                                      innerRef={(
                                        el: HTMLInputElement | null
                                      ) => {
                                        if (phone2Ref.current) {
                                          phone2Ref.current[index] = el;
                                        }
                                      }}
                                      nextFieldRef={(
                                        el: HTMLInputElement | null
                                      ) => {
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
                                      sx={{
                                        width: '100%',
                                      }}
                                      length={4}
                                      innerRef={(
                                        el: HTMLInputElement | null
                                      ) => {
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

                <Grid
                  item
                  xs={12}
                  md={12}
                  sx={{
                    marginTop: '10px',
                    marginBottom: '10px',
                  }}
                >
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
                                  width="100%"
                                  backgroundColor="#434857"
                                  type="text"
                                  inputProps={{
                                    id: `email_${index}`,
                                    onChange: (e: {
                                      target: { value: string };
                                    }) => {
                                      handleEmailChange(
                                        index,
                                        'email',
                                        e.target.value
                                      );
                                    },
                                  }}
                                />
                                {errors.email && errors.email[index] && (
                                  <ErrorText ref={errorEmailRef}>
                                    {
                                      (errors.email[index] as EmailSchemaData)
                                        ?.email
                                    }
                                  </ErrorText>
                                )}
                              </Box>
                              <Box
                                sx={{
                                  width: { xs: '100%', md: '20%' },
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
                                    marginTop: { xs: '5px', md: '0px' },
                                    marginLeft: { xs: '0', md: '5px' },
                                  }}
                                />
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
                    marginBottom: '10px',
                  }}
                >
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

                <StyledGridItem item xs={12} md={2} xl={1}>
                  <StyledInputLabel>{t('note')}:</StyledInputLabel>
                </StyledGridItem>
                <Grid item xs={12} md={10} xl={11}>
                  <Field
                    name="memo"
                    xsWidth="100%"
                    mdWidth="100%"
                    type="text"
                    inputProps={{ id: 'memo', rows: 4 }}
                    component={CustomTextArea}
                  />
                </Grid>
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
                  disabled={isSubmitting}
                  type="submit"
                  variant="outlined"
                  id="save-contact-button"
                  onClick={() => {
                    try {
                      newContactSchema(t).validateSync(values, {
                        abortEarly: false,
                      });
                    } catch (err) {
                      if (
                        err instanceof Yup.ValidationError &&
                        err.inner &&
                        err.inner.length > 0
                      ) {
                        const allErrors: {
                          [key: string]:
                            | string
                            | { [subkey: string]: string }[];
                        } = {};

                        err.inner.forEach(error => {
                          const path = String(error.path);
                          const pathParts = path.split('.');
                          if (
                            pathParts.length > 1 &&
                            pathParts[0].includes('[')
                          ) {
                            const fieldName = pathParts[0].split('[')[0];
                            const index = parseInt(
                              pathParts[0].match(/\d+/)?.[0] || '0',
                              10
                            );
                            if (!Array.isArray(allErrors[fieldName])) {
                              allErrors[fieldName] = [];
                            }
                            while (allErrors[fieldName].length <= index) {
                              allErrors[fieldName].push({});
                            }
                            if (
                              typeof allErrors[fieldName][index] === 'object'
                            ) {
                              allErrors[fieldName][index] = {
                                ...allErrors[fieldName][index],
                                [pathParts[1]]: error.message,
                              };
                            }
                          } else {
                            allErrors[path] = error.message;
                          }
                        });
                        setErrors(allErrors);
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
                  {t('saveContact')}
                </Button>
              </Box>
            </Stack>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default AddNewContact;
