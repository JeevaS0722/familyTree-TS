import React from 'react';
import Grid from '@mui/material/Grid';
import { Field } from 'formik';
import { CustomInputField } from '../../component/common/CustomInputField';
import { SectionOption } from '../../interface/common';
import {
  StyledGridItem,
  StyledInputLabel,
} from '../../component/common/CommonStyle';
import { CustomSelectField } from '../../component/CustomizedSelectComponent';

export const RenderFieldsForTXAndLA = (
  t: (key: string) => string
): React.JSX.Element => {
  return (
    <>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('survey')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="survey"
          as={CustomInputField}
          backgroundColor="#434857"
          width="100%"
          type="text"
          fullWidth
          inputProps={{
            id: 'survey',
          }}
        />
      </Grid>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('league')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="league"
          as={CustomInputField}
          backgroundColor="#434857"
          width="100%"
          type="text"
          fullWidth
          inputProps={{
            id: 'league',
          }}
        />
      </Grid>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('labor')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="labor"
          as={CustomInputField}
          backgroundColor="#434857"
          width="100%"
          type="text"
          fullWidth
          inputProps={{
            id: 'labor',
          }}
        />
      </Grid>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('block')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="block"
          as={CustomInputField}
          backgroundColor="#434857"
          width="100%"
          type="text"
          fullWidth
          inputProps={{
            id: 'block',
          }}
        />
      </Grid>

      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('abstract')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="abstract"
          as={CustomInputField}
          backgroundColor="#434857"
          width="100%"
          type="text"
          fullWidth
          inputProps={{
            id: 'abstract',
          }}
        />
      </Grid>
    </>
  );
};

export const RenderFieldsForNonTXAndLA = (
  t: (key: string) => string,
  rangeNoOptions: SectionOption[],
  rangeNSOptions: SectionOption[]
): React.JSX.Element => {
  return (
    <>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('range')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid
        item
        xs={12}
        md={10}
        xl={11}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Field
          name="rangeNo"
          inputProps={{ id: 'rangeNo' }}
          component={CustomSelectField}
          options={rangeNoOptions}
          hasEmptyValue={true}
          labelKey="value"
          additionalStyle={{
            width: { xs: '49%' },
          }}
        />
        <Field
          name="rangeEW"
          inputProps={{ id: 'rangeEW' }}
          component={CustomSelectField}
          options={rangeNSOptions}
          hasEmptyValue={true}
          labelKey="value"
          additionalStyle={{
            width: { xs: '49%' },
          }}
        />
      </Grid>
    </>
  );
};
