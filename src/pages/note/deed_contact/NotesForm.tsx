import React, { useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { Field } from 'formik';
import { CustomSelectField } from '../../../component/CustomizedSelectComponent';
import { deedOrContactNoteFormProps } from '../../../interface/note';
import { CustomTextArea } from '../../../component/CommonComponent';
import {
  CustomInputLabel,
  ErrorText,
  StyledGrid,
} from '../../../component/common/CommonStyle';

const CreateNote: React.FC<deedOrContactNoteFormProps> = ({
  errors,
  isValidating,
  fileStatus,
  taskType,
}) => {
  const { t } = useTranslation('note');
  const typeRef = useRef<HTMLLabelElement>(null);
  const memoRef = useRef<HTMLLabelElement>(null);
  useEffect(() => {
    if (!isValidating) {
      if (errors?.type) {
        typeRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      } else if (errors?.memo) {
        memoRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [errors, isValidating]);
  return (
    <Grid container alignItems="center">
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel ref={typeRef}>{t('type')}:*</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name={'type'}
          as={CustomSelectField}
          options={taskType}
          hasEmptyValue={true}
          labelKey="value"
          inputProps={{ id: 'type' }}
        />
        {errors?.type && <ErrorText id="error-type">{errors?.type}</ErrorText>}
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{t('fileStatus')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name={'fileStatus'}
          as={CustomSelectField}
          options={fileStatus}
          hasEmptyValue={true}
          labelKey="place"
          valueKey="place"
          inputProps={{ id: 'fileStatus' }}
        />
      </StyledGrid>
      <Grid
        container
        item
        xs={12}
        justifyContent={'center'}
        id="leaveStatusBlank"
      >
        {t('helperFileStatus')}
      </Grid>
      <Grid item xs={12} sm={2} mt={2} xl={1}>
        <CustomInputLabel ref={memoRef}> {t('notes')}:* </CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} sm={10} xl={11}>
        <Field
          name="memo"
          xsWidth="100%"
          mdWidth="100%"
          inputProps={{ id: 'memo', rows: 5, cols: 75, tabIndex: 2 }}
          component={CustomTextArea}
        />
        {errors?.memo && <ErrorText id="error-memo">{errors?.memo}</ErrorText>}
      </StyledGrid>
    </Grid>
  );
};

export default CreateNote;
