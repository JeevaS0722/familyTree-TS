import React, { useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { Field } from 'formik';
import { ticklerFormProps } from '../../interface/tickler';
import { CustomTextArea } from '../../component/CommonComponent';
import CustomDatePicker from '../../component/FormikCustomDatePicker';
import {
  CustomInputLabel,
  ErrorText,
  StyledGrid,
} from '../../component/common/CommonStyle';
import Box from '@mui/material/Box';

const Tickler: React.FC<ticklerFormProps> = ({ isValidating, errors }) => {
  const { t } = useTranslation('tickler');
  const ticklerDateRef = useRef<HTMLLabelElement>(null);
  useEffect(() => {
    if (!isValidating) {
      if (errors?.ticklerDate) {
        ticklerDateRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [errors, isValidating]);
  return (
    <Grid container>
      <Grid sx={{ marginTop: '18px' }} item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{t('ticklerDate')}:*</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <CustomDatePicker
          name="ticklerDate"
          type="date"
          id="ticklerDate"
          sx={{
            demo: {
              sx: {
                paddingTop: '0px',
              },
            },
          }}
        />
        <Box ref={ticklerDateRef}>
          {errors?.ticklerDate && (
            <ErrorText id="error-ticklerDate">{errors?.ticklerDate}</ErrorText>
          )}
        </Box>
      </StyledGrid>
      <Grid sx={{ marginTop: '8px' }} item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{t('notes')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name="memo"
          xsWidth="100%"
          mdWidth="100%"
          inputProps={{ id: 'memo', rows: 4 }}
          component={CustomTextArea}
        />
      </StyledGrid>
    </Grid>
  );
};

export default Tickler;
