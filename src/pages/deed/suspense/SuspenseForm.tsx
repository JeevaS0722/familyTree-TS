import React, { useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Field } from 'formik';
import { CustomSelectField } from '../../../component/CustomizedSelectComponent';
import { suspenseClaimType } from '../../../utils/constants';
import CustomDatePicker from '../../../component/FormikCustomDatePicker';
import { suspenseFormProps } from '../../../interface/suspense';
import InputAdornment from '@mui/material/InputAdornment';
import StyledInputField, {
  CustomInputLabel,
  ErrorText,
  ErrorTextValidation,
  StyledGrid,
  StyledGridItem,
  StyledInputLabel,
} from '../../../component/common/CommonStyle';

const CreateSuspense: React.FC<suspenseFormProps> = ({
  errors,
  isValidating,
}) => {
  const { t } = useTranslation('suspense');
  const stateCoRef = useRef<HTMLLabelElement>(null);
  const contactPhoneRef = useRef<HTMLLabelElement>(null);
  const suspStartRef = useRef<HTMLLabelElement>(null);
  const suspEndRef = useRef<HTMLLabelElement>(null);
  const claimDateRef = useRef<HTMLLabelElement>(null);
  const amountRef = useRef<HTMLLabelElement>(null);

  useEffect(() => {
    if (!isValidating) {
      if (errors?.stateCo) {
        stateCoRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      } else if (errors?.contactPhone) {
        contactPhoneRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      } else if (errors?.suspStart) {
        suspStartRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      } else if (errors?.suspEnd) {
        suspEndRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      } else if (errors?.claimDate) {
        claimDateRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      } else if (errors?.amount) {
        amountRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [errors, isValidating]);
  return (
    <Grid container alignItems="center">
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel ref={stateCoRef}>
          {`${t('state')}/${t('company')}`}:*
        </CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name={'stateCo'}
          as={StyledInputField}
          type="text"
          fullWidth
          inputProps={{ id: 'stateCo', maxLength: 255 }}
        />
        {errors?.stateCo && (
          <ErrorText id="error-stateCo">{errors?.stateCo}</ErrorText>
        )}
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel ref={amountRef}>{t('amount')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name={'amount'}
          as={StyledInputField}
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
          }}
          type="text"
          fullWidth
          inputProps={{ id: 'amount', maxLength: 50 }}
        />
        <ErrorMessage
          id="amountValidationMsg"
          name="amount"
          component={ErrorTextValidation}
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{t('claim_type')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name={'suspType'}
          as={CustomSelectField}
          options={suspenseClaimType}
          labelKey="value"
          inputProps={{ id: 'suspType' }}
        />
      </StyledGrid>
      <Grid item xs={12} sm={3} md={2} xl={1}>
        <CustomInputLabel ref={suspStartRef}>
          {t('claim_from_date')}:
        </CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <CustomDatePicker
          name="suspStart"
          type="date"
          id="suspStart"
          style={{
            demo: {
              sx: {
                paddingTop: '0px',
              },
            },
          }}
        />
        {errors?.suspStart && (
          <ErrorText id="error-suspStart">{errors?.suspStart}</ErrorText>
        )}
      </StyledGrid>
      <Grid item xs={12} sm={3} md={2} xl={1}>
        <CustomInputLabel ref={suspEndRef}>
          {' '}
          {t('claim_to_date')}:{' '}
        </CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <CustomDatePicker
          name="suspEnd"
          type="date"
          id="suspEnd"
          style={{
            demo: {
              sx: {
                paddingTop: '0px',
              },
            },
          }}
        />
        {errors?.suspEnd && (
          <ErrorText id="error-suspEnd">{errors?.suspEnd}</ErrorText>
        )}
      </StyledGrid>
      <StyledGridItem item xs={5} md={2} xl={1} sm={3} mt={1}>
        <StyledInputLabel>{t('submitted_claim')}?</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={7} md={10} xl={11} sm={9} mt={1}>
        <Field
          name="subClaim"
          inputProps={{ id: 'subClaim' }}
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
      <Grid item xs={12} sm={3} md={2} xl={1}>
        <CustomInputLabel ref={claimDateRef}>
          {t('claim_date')}
        </CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <CustomDatePicker
          name="claimDate"
          type="date"
          id="claimDate"
          style={{
            demo: {
              sx: {
                paddingTop: '0px',
              },
            },
          }}
        />
        {errors?.claimDate && (
          <ErrorText id="error-claimDate">{errors?.claimDate}</ErrorText>
        )}
      </StyledGrid>
      <StyledGridItem item xs={5} md={2} xl={1} sm={3} mt={1}>
        <StyledInputLabel>{t('rcvd_funds')}?</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={7} md={10} xl={11} sm={9} mt={1}>
        <Field
          name="rcvdFunds"
          inputProps={{ id: 'rcvdFunds' }}
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
      <Grid item xs={12} sm={3} md={2} xl={1}>
        <CustomInputLabel> {t('contact_name')}: </CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name={'contactName'}
          as={StyledInputField}
          type="text"
          fullWidth
          inputProps={{ id: 'contactName', maxLength: 255 }}
        />
      </StyledGrid>
      <Grid item xs={12} sm={3} md={2} xl={1}>
        <CustomInputLabel ref={contactPhoneRef}>
          {' '}
          {t('contact_phone')}:{' '}
        </CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name={'contactPhone'}
          as={StyledInputField}
          type="text"
          fullWidth
          inputProps={{ id: 'contactPhone', maxLength: 10 }}
        />
        {errors?.contactPhone && (
          <ErrorText id="error-contactPhone">{errors?.contactPhone}</ErrorText>
        )}
      </StyledGrid>
    </Grid>
  );
};

export default CreateSuspense;
