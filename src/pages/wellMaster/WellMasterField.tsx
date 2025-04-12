import React from 'react';
import Grid from '@mui/material/Grid';
import { ErrorMessage, Field } from 'formik';
import { CustomInputField } from '../../component/common/CustomInputField';
import { SectionOption } from '../../interface/common';
import StateDropdown from '../../component/common/fields/StateDropdown';
import {
  StyledGridItem,
  StyledInputLabel,
  ErrorTextValidation,
  ErrorText,
} from '../../component/common/CommonStyle';
import { CustomSelectField } from '../../component/CustomizedSelectComponent';
import CompanyDropdown from '../../component/common/fields/CompanyDropdown';
import CountyMultiSelect from '../../component/common/fields/CountyMultiSelectInput';
import Box from '@mui/material/Box/Box';
import QuartersDropdown from '../../component/common/fields/QuartersDropdown';

const RenderWellMasterFields = (
  t: (key: string) => string,
  state: string,
  error: string,
  setError: React.Dispatch<React.SetStateAction<string>>,
  errorCountyRef?: React.RefObject<HTMLDivElement>,
  interestTypesOptions?: SectionOption[],
  companyName?: string,
  deedId?: number | null,
  payorName?: string,
  quarters?: string,
  wellId?: number | null | string
): React.JSX.Element => {
  return (
    <>
      <Grid
        container
        spacing={2}
        mb={2}
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          justifyItems: 'center',
        }}
      >
        <StyledGridItem item xs={12} md={2} xl={1}>
          <StyledInputLabel>{t('fileName')}:</StyledInputLabel>
        </StyledGridItem>
        <Grid item xs={12} md={10} xl={11}>
          <Field
            name="fileName"
            disabled={true}
            as={CustomInputField}
            backgroundColor="#434857"
            width="100%"
            type="text"
            fullWidth
            inputProps={{
              id: 'fileName',
              maxLength: 255,
            }}
          />
        </Grid>
        <StyledGridItem item xs={12} md={2} xl={1}>
          <StyledInputLabel>{t('wellName')}</StyledInputLabel>
        </StyledGridItem>
        <Grid item xs={12} md={10} xl={11}>
          <Field
            name="wellName"
            as={CustomInputField}
            backgroundColor="#434857"
            width="100%"
            type="text"
            fullWidth
            inputProps={{
              id: 'wellName',
              maxLength: 255,
            }}
          />
          <ErrorMessage
            id="wellNameValidationMsg"
            name="wellName"
            component={ErrorTextValidation}
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
          <StyledInputLabel>{t('api')}:</StyledInputLabel>
        </StyledGridItem>
        <Grid item xs={12} md={10} xl={11}>
          <Field
            name="api"
            as={CustomInputField}
            backgroundColor="#434857"
            width="100%"
            type="text"
            fullWidth
            inputProps={{
              id: 'api',
              maxLength: 12,
            }}
          />
        </Grid>

        <StyledGridItem item xs={12} md={2} xl={1}>
          <StyledInputLabel>{t('section')}:</StyledInputLabel>
        </StyledGridItem>
        <Grid item xs={12} md={10} xl={11}>
          <Field
            name="sectionAB"
            as={CustomInputField}
            backgroundColor="#434857"
            width="100%"
            type="text"
            fullWidth
            inputProps={{
              id: 'sectionAB',
              maxLength: 255,
            }}
          />
        </Grid>
        <StyledGridItem item xs={12} md={2} xl={1}>
          <StyledInputLabel>{t('township')}:</StyledInputLabel>
        </StyledGridItem>
        <Grid item xs={12} md={10} xl={11}>
          <Field
            name="townshipBlock"
            as={CustomInputField}
            backgroundColor="#434857"
            width="100%"
            type="text"
            fullWidth
            inputProps={{
              id: 'townshipBlock',
              maxLength: 255,
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
              maxLength: 255,
            }}
          />
        </Grid>
        <StyledGridItem item xs={12} md={2} xl={1}>
          <StyledInputLabel>{t('quarters')}:</StyledInputLabel>
        </StyledGridItem>
        <Grid item xs={12} md={10} xl={11}>
          <QuartersDropdown
            name="quarters"
            quarters={quarters}
            wellId={wellId}
            deedId={deedId}
            sx={{
              width: { xs: '100%' },
              background: '#434857',
              outline: 'none',
            }}
          />
        </Grid>
        <StyledGridItem item xs={12} md={2} xl={1}>
          <StyledInputLabel>{t('acres')}:</StyledInputLabel>
        </StyledGridItem>
        <Grid item xs={12} md={10} xl={11}>
          <Field
            name="acres"
            as={CustomInputField}
            backgroundColor="#434857"
            width="100%"
            type="text"
            fullWidth
            inputProps={{
              id: 'acres',
              maxLength: 12,
            }}
          />
          <ErrorMessage
            id="acresValidationMsg"
            name="acres"
            component={ErrorTextValidation}
          />
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
              maxLength: 255,
            }}
          />
          <ErrorMessage
            id="nmaValidationMsg"
            name="nma"
            component={ErrorTextValidation}
          />
        </Grid>
        <StyledGridItem item xs={12} md={2} xl={1}>
          <StyledInputLabel>{t('divisionOfInterest')}:</StyledInputLabel>
        </StyledGridItem>
        <Grid item xs={12} md={10} xl={11}>
          <Field
            name="interest"
            as={CustomInputField}
            backgroundColor="#434857"
            width="100%"
            type="text"
            fullWidth
            inputProps={{
              id: 'interest',
              maxLength: 255,
            }}
          />
          <ErrorMessage
            name="interest"
            component={ErrorTextValidation}
            id="interestValidationMsg"
          />
        </Grid>

        <StyledGridItem item xs={12} md={2} xl={1}>
          <StyledInputLabel>{t('type')}:</StyledInputLabel>
        </StyledGridItem>
        <Grid item xs={12} md={10} xl={11}>
          <Field
            name="type"
            inputProps={{ id: 'type' }}
            component={CustomSelectField}
            options={interestTypesOptions}
            hasEmptyValue={true}
            labelKey="value"
          />
        </Grid>
        <StyledGridItem item xs={12} md={2} xl={1}>
          <StyledInputLabel>{t('book')}:</StyledInputLabel>
        </StyledGridItem>
        <Grid item xs={12} md={10} xl={11}>
          <Field
            name="book"
            as={CustomInputField}
            backgroundColor="#434857"
            width="100%"
            type="text"
            fullWidth
            inputProps={{
              id: 'book',
              maxLength: 20,
            }}
          />
        </Grid>
        <StyledGridItem item xs={12} md={2} xl={1}>
          <StyledInputLabel>{t('page')}:</StyledInputLabel>
        </StyledGridItem>
        <Grid item xs={12} md={10} xl={11}>
          <Field
            name="page"
            as={CustomInputField}
            backgroundColor="#434857"
            width="100%"
            type="text"
            fullWidth
            inputProps={{
              id: 'page',
              maxLength: 20,
            }}
          />
        </Grid>
        <StyledGridItem item xs={12} md={2} xl={1}>
          <StyledInputLabel>{t('operator')}: </StyledInputLabel>
        </StyledGridItem>
        <Grid item xs={12} md={10} xl={11}>
          <CompanyDropdown
            name="operatorID"
            placeholder="Search Operator Name"
            companyName={companyName}
            key={`${wellId}-${companyName}`}
            sx={{
              width: { xs: '100%' },
              background: '#434857',
              outline: 'none',
            }}
          />
        </Grid>
        <StyledGridItem item xs={12} md={2} xl={1}>
          <StyledInputLabel>{t('payor')}: </StyledInputLabel>
        </StyledGridItem>
        <Grid item xs={12} md={10} xl={11}>
          <CompanyDropdown
            name="payorID"
            placeholder="Search Payor Name"
            companyName={wellId ? payorName : companyName}
            key={`${wellId}-${payorName}`}
            sx={{
              width: { xs: '100%' },
              background: '#434857',
              outline: 'none',
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default RenderWellMasterFields;
