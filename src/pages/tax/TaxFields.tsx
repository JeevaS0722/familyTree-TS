import React from 'react';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import { ErrorMessage, Field } from 'formik';
import CustomDatePicker from '../../component/FormikCustomDatePicker';
import StyledInputField, {
  StyledGrid,
  StyledGridItem,
  StyledInputLabel,
  ErrorTextValidation,
  ErrorText,
} from '../../component/common/CommonStyle';
import { useTranslation } from 'react-i18next';
import { AddTaxProps } from '../../interface/tax';
import Box from '@mui/material/Box';
import StateDropdown from '../../component/common/fields/StateDropdown';
import CountyMultiSelect from '../../component/common/fields/CountyMultiSelectInput';
import AmountField from '../../component/common/fields/AmountField';

const RenderRecordingFields: React.FC<AddTaxProps> = ({
  errors,
  state,
  error,
  setError,
  errorCountyRef,
}) => {
  const { t } = useTranslation('tax');

  return (
    <>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('taxingEntity')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="taxingEntity"
          inputProps={{ id: 'taxingEntity', maxLength: 255 }}
          as={StyledInputField}
          type="text"
          fullWidth
        />
      </Grid>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('state')}:*</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <StateDropdown
          name="state"
          inputProps={{ id: 'state' }}
          sx={{
            width: { xs: '100%' },
            background: '#434857',
            outline: 'none',
          }}
        />
        {errors?.state && (
          <Box sx={{ color: 'red', fontSize: '0.875rem', mt: '4px' }}>
            <ErrorMessage
              id="stateValidationMsg"
              name="state"
              component={ErrorTextValidation}
            />
          </Box>
        )}
      </Grid>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('county')}:*</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <CountyMultiSelect
          name="county"
          id="county"
          state={state}
          setError={setError}
          maxLength={50}
        />
        {error && (
          <Box ref={errorCountyRef}>
            <ErrorText id="error-county">{error}</ErrorText>
          </Box>
        )}
        {errors?.county && !error && (
          <Box sx={{ color: 'red', fontSize: '0.875rem', mt: '4px' }}>
            <ErrorMessage
              id="countyValidationMsg"
              name="county"
              component={ErrorTextValidation}
            />
          </Box>
        )}
      </Grid>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('amountDue')}: $</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <AmountField
          name="amountDue"
          errId="amountDueValidationMsg"
          label={t('amountDue')}
          isInteger={false}
          precision={19}
          scale={2}
          formatAmount={true}
          startAdornment="$"
          fullWidth
        />
      </Grid>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('dateTaxesStart')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <CustomDatePicker
          name="taxStart"
          type="date"
          id="taxStart"
          sx={{
            paddingTop: '0 !important',
          }}
        />
        {errors?.taxStart && (
          <Box sx={{ color: 'red', fontSize: '0.875rem', mt: '4px' }}>
            <ErrorMessage
              id="dateSentValidationMsg"
              name="taxStart"
              component={ErrorTextValidation}
            />
          </Box>
        )}
      </Grid>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('dateTaxesEnd')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <CustomDatePicker
          name="taxEnd"
          type="date"
          id="taxEnd"
          sx={{
            paddingTop: '0 !important',
          }}
        />
        {errors?.taxEnd && (
          <Box sx={{ color: 'red', fontSize: '0.875rem', mt: '4px' }}>
            <ErrorMessage
              id="dateReturnValidationMsg"
              name="taxEnd"
              component={ErrorTextValidation}
            />
          </Box>
        )}
      </Grid>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('datePaid')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <CustomDatePicker
          name="datePaid"
          type="date"
          id="datePaid"
          sx={{
            paddingTop: '0 !important',
          }}
        />
        {errors?.datePaid && (
          <Box sx={{ color: 'red', fontSize: '0.875rem', mt: '4px' }}>
            <ErrorMessage
              id="dateReturnValidationMsg"
              name="datePaid"
              component={ErrorTextValidation}
            />
          </Box>
        )}
      </Grid>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('rcvd')}:</StyledInputLabel>
      </StyledGridItem>

      <StyledGrid item xs={12} sm={10} xl={11}>
        <Field
          name="rcvd"
          inputProps={{ id: 'rcvd' }}
          type="checkbox"
          as={Checkbox}
          sx={{ color: 'white', marginLeft: '-10px' }}
          size="small"
          color="info"
        />
      </StyledGrid>
    </>
  );
};

export default RenderRecordingFields;
