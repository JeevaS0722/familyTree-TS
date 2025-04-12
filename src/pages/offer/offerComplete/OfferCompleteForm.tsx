import React, { useEffect, useRef } from 'react';
import { Field } from 'formik';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import CustomDatePicker from '../../../component/FormikCustomDatePicker';
import { OfferCompleteProps } from '../../../interface/offer';
import { CustomSelectField } from '../../../component/CustomizedSelectComponent';
import {
  CustomInputLabel,
  ErrorText,
  StyledGrid,
} from '../../../component/common/CommonStyle';
import Box from '@mui/material/Box';

const OfferCompleteForm: React.FC<OfferCompleteProps> = ({
  dropDownValue,
  errors,
  isValidating,
}) => {
  const { t } = useTranslation('offer');
  const priorityRef = useRef<HTMLInputElement>(null);
  const dueDateRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!isValidating) {
      if (errors?.dueDate) {
        dueDateRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      if (errors?.priority) {
        priorityRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [errors, isValidating]);
  return (
    <Grid container alignItems="center">
      <Grid item xs={12}>
        <Typography
          variant="h4"
          component="p"
          gutterBottom
          sx={{ color: 'white', fontSize: '24px' }}
        >
          {t('followUpTask')}
        </Typography>
      </Grid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{t('dueDate')}:*</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <CustomDatePicker
          name="dueDate"
          outPutFormat="YYYY-MM-DD"
          type="date"
          id="dueDate"
          style={{
            demo: {
              sx: {
                paddingTop: '0px',
              },
            },
          }}
        />
        {errors?.dueDate && (
          <Box ref={dueDateRef}>
            <ErrorText id="error-dueDate">{errors?.dueDate}</ErrorText>
          </Box>
        )}
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{t('followUp')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name="toUserId"
          labelName="toUserId"
          labelKey="fullName"
          hasEmptyValue={true}
          valueKey="userId"
          inputProps={{ id: 'toUserId' }}
          component={CustomSelectField}
          options={dropDownValue?.offerFollowUpUsers}
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{t('priority')}:*</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name="priority"
          labelName="priority"
          inputProps={{ id: 'priority' }}
          component={CustomSelectField}
          options={dropDownValue?.priority}
          innerRef={priorityRef}
        />
        {errors?.priority && (
          <ErrorText id="error-priority">{errors?.priority}</ErrorText>
        )}
      </StyledGrid>
    </Grid>
  );
};

export default OfferCompleteForm;
