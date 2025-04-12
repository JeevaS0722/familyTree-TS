import React from 'react';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import { Field } from 'formik';
import { useTranslation } from 'react-i18next';
import { StyledInputLabel } from '../../component/common/CommonStyle';

const CheckListTab: React.FC = () => {
  const { t } = useTranslation('editDeed');
  return (
    <>
      <Grid
        item
        xs={12}
        md={4}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <Field
          name="ckLegals"
          inputProps={{
            id: 'ckLegals',
          }}
          type="checkbox"
          as={Checkbox}
          sx={{ color: 'white', marginLeft: '-10px' }}
          size="small"
          color="info"
        />
        <StyledInputLabel>{t('doubleChecked')}</StyledInputLabel>
      </Grid>
      <Grid
        item
        xs={12}
        md={4}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <Field
          name="revisions"
          inputProps={{
            id: 'revisions',
          }}
          type="checkbox"
          as={Checkbox}
          sx={{ color: 'white', marginLeft: '-10px' }}
          size="small"
          color="info"
        />
        <StyledInputLabel>{t('revisionNeeded')}</StyledInputLabel>
      </Grid>
      <Grid
        container
        item
        xs={12}
        md={6}
        sx={{
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Grid
          item
          xs={12}
          md={4}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Field
            name="revRcvd"
            inputProps={{
              id: 'revRcvd',
            }}
            type="checkbox"
            as={Checkbox}
            sx={{ color: 'white', marginLeft: '-10px' }}
            size="small"
            color="info"
          />
          <StyledInputLabel>{t('revisedDeed')}</StyledInputLabel>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Field
            name="revRcvdNA"
            inputProps={{
              id: 'revRcvdNA',
            }}
            type="checkbox"
            as={Checkbox}
            sx={{ color: 'white', marginLeft: { xs: '-10px', md: '10px' } }}
            size="small"
            color="info"
          />
          <StyledInputLabel>{t('na')}</StyledInputLabel>
        </Grid>
      </Grid>
    </>
  );
};

export default CheckListTab;
