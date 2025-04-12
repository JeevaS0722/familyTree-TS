import React from 'react';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { Field } from 'formik';
import { CustomTextArea } from '../../component/CommonComponent';
import { CustomSelectField } from '../../component/CustomizedSelectComponent';
import { reasonForRecycling } from '../../utils/constants';
import {
  CustomInputLabel,
  StyledGrid,
} from '../../component/common/CommonStyle';

const Recycle: React.FC = () => {
  const { t } = useTranslation('recycle');

  return (
    <Grid container>
      <Grid sx={{ marginTop: '10px' }} item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{t('reasonForRecycling')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name={'reason'}
          as={CustomSelectField}
          options={reasonForRecycling}
          hasEmptyValue={true}
          labelKey="value"
          valueKey="value"
          inputProps={{ id: 'reason' }}
        />
      </StyledGrid>
      <Grid sx={{ marginTop: '10px' }} item xs={12} md={2} xl={1} sm={3}>
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

export default Recycle;
