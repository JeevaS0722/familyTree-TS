import React from 'react';
import Grid from '@mui/material/Grid';
import { ErrorMessage, Field } from 'formik';
import CustomDatePicker from '../../component/FormikCustomDatePicker';
import StateDropdown from '../../component/common/fields/StateDropdown';
import StyledInputField, {
  StyledGridItem,
  StyledInputLabel,
  ErrorTextValidation,
  ErrorText,
} from '../../component/common/CommonStyle';
import CountyMultiSelect from '../../component/common/fields/CountyMultiSelectInput';
import Box from '@mui/material/Box/Box';

const RenderRecordingFields = (
  t: (key: string) => string,
  state: string,
  error: string,
  setError: React.Dispatch<React.SetStateAction<string>>,
  errorCountyRef?: React.RefObject<HTMLDivElement>
): React.JSX.Element => {
  return (
    <>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('documentType')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="documentType"
          inputProps={{ id: 'documentType', maxLength: 255 }}
          as={StyledInputField}
          type="text"
          fullWidth
        />
      </Grid>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('state')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <StateDropdown
          name="state"
          inputProps={{ id: 'state' }}
          fullWidth
          sx={{
            background: '#434857',
            outline: 'none',
          }}
        />
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
        {!error && (
          <ErrorMessage
            id="countyValidationMsg"
            name="county"
            component={ErrorTextValidation}
          />
        )}
      </Grid>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('dateSent')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <CustomDatePicker
          name="dateSent"
          type="date"
          id="dateSent"
          sx={{
            paddingTop: '0 !important',
          }}
        />
        <ErrorMessage
          id="dateSentValidationMsg"
          name="dateSent"
          component={ErrorTextValidation}
        />
      </Grid>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('dateReturned')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <CustomDatePicker
          name="dateReturn"
          type="date"
          id="dateReturn"
          sx={{
            paddingTop: '0 !important',
          }}
        />
        <ErrorMessage
          id="dateReturnValidationMsg"
          name="dateReturn"
          component={ErrorTextValidation}
        />
      </Grid>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('book')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="book"
          inputProps={{ id: 'book', maxLength: 20 }}
          as={StyledInputField}
          type="text"
          fullWidth
        />
      </Grid>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('page')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="page"
          inputProps={{ id: 'page', maxLength: 20 }}
          as={StyledInputField}
          type="text"
          fullWidth
        />
      </Grid>
    </>
  );
};

export default RenderRecordingFields;
