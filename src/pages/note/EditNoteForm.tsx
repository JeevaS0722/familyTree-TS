import React, { useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { Field } from 'formik';
import { editNoteFormProps } from '../../interface/note';
import { CustomTextArea } from '../../component/CommonComponent';
import {
  CustomInputLabel,
  ErrorText,
  StyledGrid,
} from '../../component/common/CommonStyle';

const EditNote: React.FC<editNoteFormProps> = ({ errors, isValidating }) => {
  const { t } = useTranslation('note');
  const memoRef = useRef<HTMLLabelElement>(null);
  useEffect(() => {
    if (!isValidating) {
      if (errors?.memo) {
        memoRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [errors, isValidating]);
  return (
    <Grid container alignItems="center">
      <Grid item xs={12} sm={2} mt={2} xl={1}>
        <CustomInputLabel ref={memoRef}> {t('notes')}:* </CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} sm={10} xl={11}>
        <Field
          name="memo"
          xsWidth="100%"
          mdWidth="100%"
          inputProps={{ id: 'memo', rows: 5 }}
          component={CustomTextArea}
        />
        {errors?.memo && <ErrorText id="error-type">{errors?.memo}</ErrorText>}
      </StyledGrid>
    </Grid>
  );
};

export default EditNote;
