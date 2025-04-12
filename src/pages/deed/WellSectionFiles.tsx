import React from 'react';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import { Field } from 'formik';
import { useTranslation } from 'react-i18next';
import { CustomTextArea } from '../../component/CommonComponent';
import Box from '@mui/material/Box';
import {
  StyledGridItem,
  StyledInputLabel,
} from '../../component/common/CommonStyle';

const WellSectionFiles: React.FC = () => {
  const { t } = useTranslation('editDeed');
  return (
    <>
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
          md={6}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <StyledInputLabel>{t('wellFilesCompleted')}</StyledInputLabel>
          <Field
            name="wellFComp"
            inputProps={{
              id: 'wellFComp',
            }}
            type="checkbox"
            as={Checkbox}
            sx={{ color: 'white' }}
            size="small"
            color="info"
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <StyledInputLabel>{t('wellFilesNA')}</StyledInputLabel>
          <Field
            name="wellFNA"
            inputProps={{
              id: 'wellFNA',
            }}
            type="checkbox"
            as={Checkbox}
            sx={{ color: 'white' }}
            size="small"
            color="info"
          />
        </Grid>
      </Grid>
      <Box sx={{ my: 2 }}>
        <StyledGridItem item xs={12} md={2} sx={{ my: 2 }}>
          <StyledInputLabel>{t('listAllWellFiles')}:</StyledInputLabel>
        </StyledGridItem>
        <Grid item xs={12} md={12}>
          <Field
            name="listWellFiles"
            xsWidth="100%"
            mdWidth="100%"
            type="text"
            inputProps={{ id: 'listWellFiles', rows: 4 }}
            component={CustomTextArea}
          />
        </Grid>
      </Box>

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
          md={6}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <StyledInputLabel>{t('sectionFilesCompleted')}</StyledInputLabel>
          <Field
            name="sectionFComp"
            inputProps={{
              id: 'sectionFComp',
            }}
            type="checkbox"
            as={Checkbox}
            sx={{ color: 'white' }}
            size="small"
            color="info"
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <StyledInputLabel>{t('sectionFilesNA')}</StyledInputLabel>
          <Field
            name="sectionFNA"
            inputProps={{
              id: 'sectionFNA',
            }}
            type="checkbox"
            as={Checkbox}
            sx={{ color: 'white' }}
            size="small"
            color="info"
          />
        </Grid>
      </Grid>
      <Box sx={{ my: 2 }}>
        <StyledGridItem item xs={12} md={2} sx={{ my: 2 }}>
          <StyledInputLabel>{t('listAllSectionFiles')}:</StyledInputLabel>
        </StyledGridItem>
        <Grid item xs={12} md={12}>
          <Field
            name="listSectFiles"
            xsWidth="100%"
            mdWidth="100%"
            type="text"
            inputProps={{ id: 'listSectFiles', rows: 4 }}
            component={CustomTextArea}
          />
        </Grid>
      </Box>
    </>
  );
};

export default WellSectionFiles;
