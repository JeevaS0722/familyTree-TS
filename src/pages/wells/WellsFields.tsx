import React from 'react';
import Grid from '@mui/material/Grid';
import { ErrorMessage, Field } from 'formik';
import { CustomInputField } from '../../component/common/CustomInputField';
import StateDropdown from '../../component/common/fields/StateDropdown';
import {
  StyledGridItem,
  StyledInputLabel,
  ErrorTextValidation,
  ErrorText,
} from '../../component/common/CommonStyle';
import CountyMultiSelect from '../../component/common/fields/CountyMultiSelectInput';
import Box from '@mui/material/Box/Box';

const RenderWellsFields = (
  t: (key: string) => string,
  state: string,
  error: string,
  setError: React.Dispatch<React.SetStateAction<string>>,
  errorCountyRef: React.RefObject<HTMLDivElement>
): React.JSX.Element => {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        justifyItems: 'center',
      }}
    >
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('wellName')}</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="well"
          as={CustomInputField}
          backgroundColor="#434857"
          width="100%"
          type="text"
          fullWidth
          inputProps={{
            id: 'well',
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value.trim();
              if (value === '') {
                e.target.value = '';
              }
            },
          }}
        />
        <ErrorMessage
          id="wellValidationMsg"
          name="well"
          component={ErrorTextValidation}
        />
      </Grid>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('section')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="section"
          as={CustomInputField}
          backgroundColor="#434857"
          width="100%"
          type="text"
          fullWidth
          inputProps={{
            id: 'section',
          }}
        />
      </Grid>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('township')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="township"
          as={CustomInputField}
          backgroundColor="#434857"
          width="100%"
          type="text"
          fullWidth
          inputProps={{
            id: 'township',
          }}
        />
      </Grid>

      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('range')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="rangeSurvey"
          as={CustomInputField}
          backgroundColor="#434857"
          width="100%"
          type="text"
          fullWidth
          inputProps={{
            id: 'rangeSurvey',
          }}
        />
      </Grid>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('state')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <StateDropdown
          name="wellState"
          inputProps={{ id: 'wellState' }}
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
          name="wellCounty"
          id="wellCounty"
          state={state}
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
        <StyledInputLabel>{t('divisionOfInterest')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="welldivint"
          as={CustomInputField}
          backgroundColor="#434857"
          width="100%"
          type="text"
          fullWidth
          inputProps={{
            id: 'welldivint',
          }}
        />
        <ErrorMessage
          name="welldivint"
          component={ErrorTextValidation}
          id="welldivintValidationMsg"
        />
      </Grid>
    </Grid>
  );
};

export default RenderWellsFields;
