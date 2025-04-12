import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { AddressProps } from '../../interface/address';
import { useTranslation } from 'react-i18next';
import StyledInputField, {
  CustomInputLabel,
  ErrorText,
  StyledGrid,
} from '../../component/common/CommonStyle';
import { Field, useFormikContext } from 'formik';
import StateDropdown from '../../component/common/fields/StateDropdown';
import CountyMultiSelect from '../../component/common/fields/CountyMultiSelectInput';

const CreateAddress: React.FC<AddressProps> = ({
  errors,
  names,
  scrollRef,
  addressId,
  isValidating,
  stateValue,
  error,
  setError,
  errorCountyRef,
}: AddressProps) => {
  const { t } = useTranslation('address');
  const placeNameRef = useRef<HTMLLabelElement>(null);
  const emailRef = useRef<HTMLLabelElement>(null);
  const websiteRef = useRef<HTMLLabelElement>(null);
  const phoneRef = useRef<HTMLLabelElement>(null);
  const faxRef = useRef<HTMLLabelElement>(null);

  useEffect(() => {
    if (!isValidating) {
      if (errors?.name && scrollRef === 'name') {
        placeNameRef?.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      if (errors?.email && scrollRef === 'email') {
        emailRef?.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      if (errors?.website && scrollRef === 'website') {
        websiteRef?.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [errors, isValidating]);
  const { setFieldValue } = useFormikContext();
  useEffect(() => {
    if (addressId && Number(addressId) === 0) {
      placeNameRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      void setFieldValue('state', stateValue); // Set first state as default value
    }
  }, [addressId, stateValue]);
  return (
    <Grid container alignItems="center">
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel ref={placeNameRef}>{t('name')}:*</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name={names.name}
          as={StyledInputField}
          type="text"
          fullWidth
          inputProps={{ id: 'name' }}
        />
        {errors?.name && <ErrorText>{errors.name}</ErrorText>}
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{t('attn')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name={names.attn}
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
          name={names.address}
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
          name={names.city}
          as={StyledInputField}
          type="text"
          fullWidth
          inputProps={{ id: 'city' }}
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{t('state')}:</CustomInputLabel>
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
          disabled={true}
          inputProps={{ id: 'state' }}
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{t('zip')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name={names.zip}
          as={StyledInputField}
          type="text"
          fullWidth
          inputProps={{ id: 'zip' }}
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{t('county')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <CountyMultiSelect
          id={names.county}
          name={names.county}
          state={stateValue}
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
          name={names.payee}
          as={StyledInputField}
          type="text"
          fullWidth
          inputProps={{ id: 'payee' }}
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel ref={phoneRef}>{t('phone')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name={names.phone}
          as={StyledInputField}
          type="text"
          fullWidth
          inputProps={{ id: 'phone', maxLength: 10 }}
        />
        <Grid container spacing={{ xs: 1, sm: 2 }}>
          <Grid item xs={12} md={12}>
            {errors?.phone && (
              <Box>
                <ErrorText id="error-phone">{errors?.phone}</ErrorText>
              </Box>
            )}
          </Grid>
        </Grid>
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel ref={faxRef}>{t('fax')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name={names.fax}
          as={StyledInputField}
          type="text"
          fullWidth
          inputProps={{ id: 'fax', maxLength: 10 }}
        />
        <Grid container spacing={{ xs: 1, sm: 2 }}>
          <Grid item xs={12} md={12}>
            {errors?.fax && (
              <Box>
                <ErrorText id="error-fax">{errors?.fax}</ErrorText>
              </Box>
            )}
          </Grid>
        </Grid>
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel ref={emailRef}>{t('email')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name={names.email}
          as={StyledInputField}
          type="text"
          fullWidth
          inputProps={{ id: 'email', maxLength: 50 }}
        />
        {errors?.email && <ErrorText>{errors.email}</ErrorText>}
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel ref={websiteRef}>{t('website')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name={names.website}
          as={StyledInputField}
          type="text"
          fullWidth
          inputProps={{ id: 'website', maxLength: 2083 }}
        />
        {errors?.website && <ErrorText>{errors.website}</ErrorText>}
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{t('notes')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name={names.notes}
          as={StyledInputField}
          type="text"
          fullWidth
          inputProps={{ id: 'notes' }}
        />
      </StyledGrid>
    </Grid>
  );
};

export default CreateAddress;
