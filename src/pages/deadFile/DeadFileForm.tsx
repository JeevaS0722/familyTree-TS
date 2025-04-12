import React from 'react';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { Field } from 'formik';
import { CustomTextArea } from '../../component/CommonComponent';
import { CustomSelectField } from '../../component/CustomizedSelectComponent';
import { reasonForDeadFilling } from '../../utils/constants';
import {
  CustomInputLabel,
  StyledGrid,
} from '../../component/common/CommonStyle';

const DeadFile: React.FC = () => {
  const { t } = useTranslation('deadFile');

  return (
    <Grid container>
      <Grid sx={{ marginTop: '10px' }} item xs={12} md={2} sm={3} xl={1}>
        <CustomInputLabel>{t('reasonForDeadFilling')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} sm={9} xl={11}>
        <Field
          name={'reason'}
          as={CustomSelectField}
          hasEmptyValue={true}
          options={reasonForDeadFilling}
          labelKey="value"
          inputProps={{ id: 'reason' }}
        />
      </StyledGrid>
      <Grid sx={{ marginTop: '10px' }} item xs={12} md={2} sm={3} xl={1}>
        <CustomInputLabel>{t('notes')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} sm={9} xl={11}>
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

export default DeadFile;
