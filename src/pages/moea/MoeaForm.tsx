import React, { useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import { useTranslation } from 'react-i18next';
import { Field } from 'formik';
import { moeaFormProps } from '../../interface/moea';
import { CustomTextArea } from '../../component/CommonComponent';
import StateDropdown from '../../component/common/fields/StateDropdown';
import StyledInputField, {
  CustomInputLabel,
  ErrorText,
  StyledGrid,
} from '../../component/common/CommonStyle';
import AmountField from '../../component/common/fields/AmountField';

const MoeaForm: React.FC<moeaFormProps> = ({ errors, isValidating }) => {
  const { t } = useTranslation('moea');
  const nameRef = useRef<HTMLLabelElement>(null);
  useEffect(() => {
    if (!isValidating) {
      if (errors?.name) {
        nameRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [errors, isValidating]);
  return (
    <Grid container alignItems="center">
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel ref={nameRef}>{`${t('name')}`}:*</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name={'name'}
          as={StyledInputField}
          type="text"
          fullWidth
          inputProps={{ id: 'name' }}
        />
        {errors?.name && <ErrorText id="error-name">{errors?.name}</ErrorText>}
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{t('amount')}: $</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <AmountField
          label={t('amount')}
          name="amount"
          isInteger={false}
          precision={19}
          scale={2}
          formatAmount={true}
          startAdornment="$"
          fullWidth
          isRequired={false}
        />
      </StyledGrid>
      <Grid item xs={5} sm={2} xl={1} mt={1}>
        <CustomInputLabel>{t('researched')}?:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={6} sm={10} xl={11} sx={{ position: 'relative' }}>
        <Field
          name="researched"
          inputProps={{
            id: 'researched',
          }}
          type="checkbox"
          as={Checkbox}
          sx={{ color: 'white', marginLeft: '-10px' }}
          size="small"
          color="info"
        />
      </StyledGrid>
      <Grid item xs={5} sm={2} mt={1} xl={1}>
        <CustomInputLabel>{t('onr')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={6} sm={10} xl={11} sx={{ position: 'relative' }}>
        <Field
          name="onr"
          inputProps={{
            id: 'onr',
          }}
          type="checkbox"
          as={Checkbox}
          sx={{ color: 'white', marginLeft: '-10px' }}
          size="small"
          color="info"
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{`${t('orderNo')}`}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name={'orderNo'}
          as={StyledInputField}
          type="text"
          fullWidth
          inputProps={{ id: 'orderNo' }}
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{`${t('calls')}`}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name={'calls'}
          as={StyledInputField}
          type="text"
          fullWidth
          inputProps={{ id: 'calls' }}
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{`${t('section')}`}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name={'section'}
          as={StyledInputField}
          type="text"
          fullWidth
          inputProps={{ id: 'section' }}
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{`${t('township')}`}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name={'township'}
          as={StyledInputField}
          type="text"
          fullWidth
          inputProps={{ id: 'township' }}
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{`${t('range')}`}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name={'range'}
          as={StyledInputField}
          type="text"
          fullWidth
          inputProps={{ id: 'range' }}
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{`${t('county')}`}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name={'county'}
          as={StyledInputField}
          type="text"
          fullWidth
          inputProps={{ id: 'county' }}
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{`${t('state')}`}:</CustomInputLabel>
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
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{`${t('company')}`}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name={'company'}
          as={StyledInputField}
          type="text"
          fullWidth
          inputProps={{ id: 'company' }}
        />
      </StyledGrid>
      <Grid item xs={12} sm={2} mt={2} xl={1}>
        <CustomInputLabel> {t('notes')}: </CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} sm={10} xl={11}>
        <Field
          name="notes"
          xsWidth="100%"
          mdWidth="100%"
          inputProps={{ id: 'memo', rows: 3 }}
          component={CustomTextArea}
        />
      </StyledGrid>
    </Grid>
  );
};

export default MoeaForm;
