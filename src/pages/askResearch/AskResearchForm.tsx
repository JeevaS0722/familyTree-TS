import React from 'react';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { Field } from 'formik';
import { CustomTextArea } from '../../component/CommonComponent';
import { makeTaskPriority } from '../../utils/constants';
import {
  CustomInputLabel,
  StyledGrid,
} from '../../component/common/CommonStyle';
import { CustomSelectField } from '../../component/CustomizedSelectComponent';

const AskResearchForm: React.FC = () => {
  const { t } = useTranslation('askResearch');

  return (
    <Grid container>
      <Grid item xs={12} sm={2} mt={1} xl={1}>
        <CustomInputLabel>{t('priority')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} sm={10} xl={11}>
        <Field
          name="priority"
          inputProps={{ id: 'priority' }}
          as={CustomSelectField}
          options={makeTaskPriority}
          hasEmptyValue={true}
          labelKey="value"
          idKey="id"
        />
      </StyledGrid>
      <Grid item xs={12} sm={2} mt={1} xl={1}>
        <CustomInputLabel>{t('notes')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} sm={10} xl={11}>
        <Field
          name="memo"
          xsWidth="100%"
          mdWidth="100%"
          placeholder={t('question')}
          inputProps={{ id: 'memo', rows: 4 }}
          component={CustomTextArea}
        />
      </StyledGrid>
    </Grid>
  );
};

export default AskResearchForm;
