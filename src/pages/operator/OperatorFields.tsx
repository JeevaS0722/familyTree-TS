import React from 'react';
import Grid from '@mui/material/Grid';
import { ErrorMessage, Field } from 'formik';
import { CustomInputField } from '../../component/common/CustomInputField';
import { CustomTextArea } from '../../component/CommonComponent';
import StateDropdown from '../../component/common/fields/StateDropdown';
import {
  ErrorTextValidation,
  StyledGridItem,
  StyledInputLabel,
} from '../../component/common/CommonStyle';

const RenderOperatorFields = (
  t: (key: string) => string
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
        <StyledInputLabel>{t('companyName')}:*</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="companyName"
          as={CustomInputField}
          backgroundColor="#434857"
          width="100%"
          type="text"
          fullWidth
          inputProps={{
            id: 'companyName',
            maxLength: 255,
          }}
        />
        <ErrorMessage
          id="companyNameValidationMsg"
          name="companyName"
          component={ErrorTextValidation}
        />
      </Grid>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('contactName')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="contactName"
          as={CustomInputField}
          backgroundColor="#434857"
          width="100%"
          type="text"
          fullWidth
          inputProps={{
            id: 'contactName',
            maxLength: 50,
          }}
        />
      </Grid>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('ownerNumber')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="ownerNumber"
          as={CustomInputField}
          backgroundColor="#434857"
          width="100%"
          type="text"
          fullWidth
          inputProps={{
            id: 'ownerNumber',
            maxLength: 255,
          }}
        />
        <ErrorMessage
          id="ownerNumberValidationMsg"
          name="ownerNumber"
          component={ErrorTextValidation}
        />
      </Grid>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('phone')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="phoneNumber"
          as={CustomInputField}
          backgroundColor="#434857"
          width="100%"
          type="text"
          fullWidth
          inputProps={{
            id: 'phoneNumber',
            maxLength: 10,
          }}
        />
        <ErrorMessage
          id="phoneNumberValidationMsg"
          name="phoneNumber"
          component={ErrorTextValidation}
        />
      </Grid>

      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('fax')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="fax"
          as={CustomInputField}
          backgroundColor="#434857"
          width="100%"
          type="text"
          fullWidth
          inputProps={{
            id: 'fax',
            maxLength: 10,
          }}
        />
        <ErrorMessage
          id="faxValidationMsg"
          name="fax"
          component={ErrorTextValidation}
        />
      </Grid>

      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('email')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="email"
          as={CustomInputField}
          backgroundColor="#434857"
          width="100%"
          type="text"
          fullWidth
          inputProps={{
            id: 'email',
            maxLength: 255,
          }}
        />
        <ErrorMessage
          id="emailValidationMsg"
          name="email"
          component={ErrorTextValidation}
        />
      </Grid>

      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('address')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="address"
          as={CustomInputField}
          backgroundColor="#434857"
          width="100%"
          type="text"
          fullWidth
          inputProps={{
            id: 'address',
            maxLength: 255,
          }}
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
          width="100%"
          type="text"
          fullWidth
          inputProps={{
            id: 'city',
            maxLength: 50,
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
            width: { xs: '100%' },
            background: '#434857',
            outline: 'none',
          }}
        />
      </Grid>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('zip')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="zip"
          as={CustomInputField}
          backgroundColor="#434857"
          width="100%"
          type="text"
          fullWidth
          inputProps={{
            id: 'zip',
            maxLength: 10,
          }}
        />
        <ErrorMessage
          id="zipValidationMsg"
          name="zip"
          component={ErrorTextValidation}
        />
      </Grid>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('notes')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="notes"
          xsWidth="100%"
          mdWidth="100%"
          inputProps={{ id: 'notes', rows: 3 }}
          component={CustomTextArea}
        />
      </Grid>
    </Grid>
  );
};

export default RenderOperatorFields;
