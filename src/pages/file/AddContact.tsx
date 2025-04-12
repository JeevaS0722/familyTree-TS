import React, { memo, useEffect, useRef } from 'react';
import { ErrorMessage, Field, FieldArray } from 'formik';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { CustomTextArea } from '../../component/CommonComponent';
import { AddNewContactProps } from '../../interface/file';
import ConstantDropdown from '../../component/common/fields/ConstantDropdown';
import FormikTextField from '../../component/common/fields/TextField';
import StateDropdown from '../../component/common/fields/StateDropdown';
import {
  CustomInputLabel,
  ErrorText,
  StyledGrid,
  StyledRadio,
  StyledGridItem,
  StyledInputLabel,
} from '../../component/common/CommonStyle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Button from '@mui/material/Button';
import { CustomPhoneField } from '../../component/common/CustomPhoneField';
import { EmailSchemaData, PhoneSchemasData } from '../../interface/contact';
import { CustomInputField } from '../../component/common/CustomInputField';

const AddContact: React.FC<AddNewContactProps> = ({
  values,
  errors,
  setFieldValue,
  handlePhoneChange,
  addNewPhone,
  addNewEmail,
  handleEmailChange,
  phone,
  email,
  phone1Ref,
  phone2Ref,
  phone3Ref,
  altName,
  addNewAltName,
  handleAltNameChange,
  handleTitleChange,
  addNewTitle,
  title,
}) => {
  const { t } = useTranslation('newfile');

  const errorDOBRef = useRef<HTMLInputElement>(null);
  const errorDecDtRef = useRef<HTMLInputElement>(null);
  const errorOwnerShipRef = useRef<HTMLDivElement>(null);
  const errorAltNameRef = useRef<HTMLDivElement>(null);
  const errorAltNameFormatRef = useRef<HTMLDivElement>(null);
  const errorEmailRef = useRef<HTMLDivElement>(null);
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
    errors?.decDt,
    errors?.dOB,
    errors?.ownership,
    errors?.altName,
    errors?.altNameFormat,
    errors?.phone,
    errors?.email,
    errors?.altName,
    errors?.title,
  ]);

  return (
    <Grid container alignItems="center">
      <Grid item xs={12}>
        <Typography
          variant="h4"
          component="p"
          gutterBottom
          sx={{ color: 'white', fontSize: '24px', mt: '50px' }}
        >
          {t('createNewContact')}
        </Typography>
      </Grid>
      <Grid item xs={12} md={2} xl={1}>
        <CustomInputLabel>{t('relation')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11}>
        <FormikTextField
          name="relationship"
          sx={{ width: { md: '60%' } }}
          inputProps={{ id: 'relationship', maxLength: 50 }}
          type="text"
        />
      </StyledGrid>
      <Grid container id="ownershipGrid">
        <Grid item xs={12} md={2} xl={1} mt={1}>
          <CustomInputLabel>{t('ownership')}:</CustomInputLabel>
        </Grid>
        <Grid container item xs={12} md={10} xl={11}>
          <Grid item xs={11} md={2} xl={1} mt={1}>
            <FormikTextField
              name="ownership"
              type="text"
              fullWidth
              inputProps={{
                id: 'ownership',
                maxLength: 10,
              }}
            />
          </Grid>
          <Grid
            container
            justifyContent={'center'}
            alignItems={'center'}
            sx={{ width: { md: '40px !important', lg: '50px !important' } }}
            item
            mt={1}
            xs={1}
            md={1}
          >
            <span>%</span>
          </Grid>
          <Grid item xs={12}>
            {errors?.ownership && (
              <Box ref={errorOwnerShipRef}>
                <ErrorText>{errors?.ownership}</ErrorText>
              </Box>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={2} xl={1}>
        <CustomInputLabel>{t('lastName')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11}>
        <FormikTextField
          name="lastName"
          inputProps={{ id: 'lastName', maxLength: 255 }}
          sx={{ width: { md: '60%' } }}
          type="text"
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1}>
        <CustomInputLabel>{t('firstName')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11}>
        <FormikTextField
          name="firstName"
          sx={{ width: { md: '60%' }, marginBottom: '15px' }}
          inputProps={{ id: 'firstName', maxLength: 255 }}
          type="text"
        />
      </StyledGrid>
      <Grid
        container
        spacing={{ xs: 2, sm: 2 }}
        sx={{
          marginTop: '10px',
        }}
      >
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
                            onChange: (e: { target: { value: string } }) => {
                              handleAltNameChange(
                                index,
                                'altName',
                                (e.target as HTMLInputElement).value
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
                            value={values.altName?.[index]?.altNameFormat || ''}
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
      </Grid>
      <Grid container spacing={{ xs: 1, sm: 2 }}>
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
      </Grid>

      <Grid
        container
        spacing={{ xs: 2, sm: 2 }}
        sx={{
          marginTop: '10px',
        }}
      >
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
                              <ErrorText>{errors.title[index].title}</ErrorText>
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
      </Grid>

      <Grid item xs={12} md={2} xl={1}>
        <CustomInputLabel>{t('ssn')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11}>
        <FormikTextField
          name="sSN"
          inputProps={{ id: 'sSN', maxLength: 9 }}
          sx={{ width: '20%' }}
          type="text"
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1}>
        <CustomInputLabel>{t('deceased')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11}>
        <Field
          name="deceased"
          inputProps={{ id: 'deceased' }}
          type="checkbox"
          as={Checkbox}
          sx={{ color: 'white', marginLeft: '-10px' }}
          size="small"
          color="info"
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1}>
        <CustomInputLabel>{t('dateOfDeath')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11}>
        {/* <CustomDatePicker
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
          error={!!errors?.decDt}
        />
        {errors?.decDt && (
          <Box ref={errorDecDtRef}>
            <ErrorText id="error-decDt">{errors?.decDt}</ErrorText>
          </Box>
        )} */}
        <FormikTextField
          name="decDt"
          sx={{ width: { md: '30%' } }}
          inputProps={{ id: 'decDt' }}
          type="text"
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1}>
        <CustomInputLabel>{t('dateOfBirth')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11}>
        {/* <CustomDatePicker
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
          error={!!errors?.dOB}
        />
        {errors?.dOB && (
          <Box ref={errorDOBRef}>
            <ErrorText id="error-dOB">{errors?.dOB}</ErrorText>
          </Box>
        )} */}
        <FormikTextField
          name="dOB"
          sx={{ width: { md: '30%' } }}
          inputProps={{ id: 'dOB' }}
          type="text"
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1}>
        <CustomInputLabel>{t('address')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11}>
        <Field
          name="address"
          xsWidth="100%"
          mdWidth="40%"
          inputProps={{ id: 'address', rows: 2 }}
          component={CustomTextArea}
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1}>
        <CustomInputLabel>{t('city')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11}>
        <FormikTextField
          name="city"
          inputProps={{ id: 'city', maxLength: 30 }}
          type="text"
          sx={{ width: { md: '60%' } }}
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1}>
        <CustomInputLabel>{t('state')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11}>
        <StateDropdown
          name="state"
          inputProps={{ id: 'state' }}
          sx={{
            width: { xs: '100%', md: '20%' },
            background: '#434857',
            outline: 'none',
          }}
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1}>
        <CustomInputLabel>{t('zipCode')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11}>
        <FormikTextField
          name="zip"
          sx={{ width: '20%' }}
          inputProps={{ maxLength: 10, id: 'zip' }}
          type="text"
        />
        <ErrorMessage name="zip" component={ErrorText} />
      </StyledGrid>
      <Grid container spacing={{ xs: 2, sm: 2 }}>
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
                              sx={{
                                width: '100%',
                              }}
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
                              sx={{
                                width: '100%',
                              }}
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
                            (errors.phone[index] as PhoneSchemasData)?.prefix ||
                            (errors.phone[index] as PhoneSchemasData)?.phoneNo}
                        </ErrorText>
                      )}
                    </Grid>
                  </React.Fragment>
                ))}
            </>
          )}
        </FieldArray>
      </Grid>
      <Grid container spacing={{ xs: 1, sm: 2 }}>
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
                        {t('email')} {index + 1}:{' '}
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
      </Grid>
      <Grid container spacing={{ xs: 1, sm: 2 }}>
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
      </Grid>
    </Grid>
  );
};

export default memo(AddContact);
