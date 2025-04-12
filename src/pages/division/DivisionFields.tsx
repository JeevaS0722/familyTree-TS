import React, { useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid';
import { ErrorMessage, Field } from 'formik';
import { CustomTextArea } from '../../component/CommonComponent';
import Checkbox from '@mui/material/Checkbox';
import CustomDatePicker from '../../component/FormikCustomDatePicker';
import {
  CustomInputLabel,
  ErrorText,
  ErrorTextValidation,
  StyledGrid,
  StyledGridItem,
  StyledInputLabel,
} from '../../component/common/CommonStyle';
import Box from '@mui/material/Box';
import CompanyDropdown from '../../component/common/fields/CompanyDropdown';
import FormikTextField from '../../component/common/fields/TextField';

const RenderDivisionFields = (
  t: (key: string) => string,
  mode?: string,
  errors?: {
    notice1Date?: string;
    notice2Date?: string;
    notice3Date?: string;
    operId?: string;
  },
  companyName?: string,
  operId?: number | null | string | undefined
): React.JSX.Element => {
  const errorCompanyNameRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (errors?.operId) {
      errorCompanyNameRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [errors]);

  return (
    <>
      <Grid
        xs={12}
        container
        spacing={1}
        sx={{
          justifyContent: 'center',
          justifyItems: 'center',
        }}
      >
        <StyledGridItem
          item
          xs={12}
          md={2}
          xl={1}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'start',
            height: '100%',
          }}
        >
          <StyledInputLabel>{t('companyName')} *</StyledInputLabel>
        </StyledGridItem>
        <Grid item xs={12} md={10} xl={11} ref={errorCompanyNameRef}>
          <CompanyDropdown
            name="operId"
            companyName={companyName}
            sx={{
              width: { xs: '100%' },
              background: '#434857',
              outline: 'none',
            }}
            showCompanyAddress={true}
            operId={operId}
          />
          <ErrorMessage
            name="operId"
            component={ErrorTextValidation}
            id="operIdValidationMsg"
          />
        </Grid>
        <StyledGridItem item md={2} xl={1} xs={4} mt={2}>
          <StyledInputLabel>{t('notified')}:</StyledInputLabel>
        </StyledGridItem>
        <Grid item md={10} xl={11} xs={8} mt={2}>
          <Field
            name="notified"
            inputProps={{ id: 'notified' }}
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
      </Grid>
      <Grid
        xs={12}
        container
        spacing={1}
        sx={{
          justifyContent: 'center',
          justifyItems: 'center',
          alignItems: 'center',
        }}
      >
        <Grid item xs={12} sm={2} md={2} xl={1} mt={2}>
          <CustomInputLabel> {t('notice1Date')}: </CustomInputLabel>
        </Grid>
        <StyledGrid item xs={12} sm={10} xl={11}>
          <CustomDatePicker
            name="notice1Date"
            type="date"
            id="notice1Date"
            sx={{
              paddingTop: '0 !important',
            }}
          />
          {errors?.notice1Date && (
            <Box>
              <ErrorText id="error-notice1Date">
                {errors?.notice1Date}
              </ErrorText>
            </Box>
          )}
        </StyledGrid>

        <Grid item xs={12} sm={2} md={2} xl={1} mt={2}>
          <CustomInputLabel> {t('notice2Date')}: </CustomInputLabel>
        </Grid>
        <StyledGrid item xs={12} sm={10} xl={11}>
          <CustomDatePicker
            name="notice2Date"
            type="date"
            id="notice2Date"
            sx={{
              paddingTop: '0 !important',
            }}
          />
          {errors?.notice2Date && (
            <Box>
              <ErrorText id="error-notice2Date">
                {errors?.notice2Date}
              </ErrorText>
            </Box>
          )}
        </StyledGrid>

        <Grid item xs={12} sm={2} md={2} xl={1} mt={2}>
          <CustomInputLabel> {t('notice3Date')}: </CustomInputLabel>
        </Grid>
        <StyledGrid item xs={12} sm={10} xl={11}>
          <CustomDatePicker
            name="notice3Date"
            type="date"
            id="notice3Date"
            sx={{
              paddingTop: '0 !important',
            }}
          />
          {errors?.notice3Date && (
            <Box>
              <ErrorText id="error-notice3Date">
                {errors?.notice3Date}
              </ErrorText>
            </Box>
          )}
        </StyledGrid>
        <StyledGridItem item xs={4} md={2} xl={1} mt={2}>
          <StyledInputLabel>{t('dorcvd')}:</StyledInputLabel>
        </StyledGridItem>
        <Grid item xs={8} md={10} xl={11} mt={2}>
          <Field
            name="dorcvd"
            inputProps={{ id: 'dorcvd' }}
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
        <Grid item xs={12} md={2} xl={1} mt={1}>
          <CustomInputLabel>{t('referenceId')}:</CustomInputLabel>
        </Grid>
        <StyledGrid item xs={12} md={10} xl={11}>
          <FormikTextField
            name="referenceId"
            type="text"
            fullWidth
            inputProps={{ id: 'referenceId', maxLength: 255 }}
          />
        </StyledGrid>
        <StyledGridItem item xs={12} md={2} xl={1}>
          <StyledInputLabel>
            {mode === 'edit' ? t('newNote') : t('note')}:
          </StyledInputLabel>
        </StyledGridItem>
        <Grid item xs={12} md={10} xl={11}>
          <StyledGrid item xs={12}>
            <Field
              name="donate"
              xsWidth="100%"
              mdWidth="100%"
              inputProps={{ id: 'donate', rows: 3 }}
              component={CustomTextArea}
            />
          </StyledGrid>
        </Grid>
      </Grid>
    </>
  );
};

export default RenderDivisionFields;
