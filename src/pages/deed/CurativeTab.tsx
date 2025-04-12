import React, { useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import { Field } from 'formik';
import CustomDatePicker from '../../component/FormikCustomDatePicker';
import { useTranslation } from 'react-i18next';
import {
  ErrorText,
  StyledGridItem,
  StyledInputLabel,
} from '../../component/common/CommonStyle';
import { Box } from '@mui/material';
import { CurativeTabFormProps } from '../../interface/curative';

const CurativeTab: React.FC<CurativeTabFormProps> = ({
  errors,
  isValidating,
}) => {
  const { t } = useTranslation('editDeed');
  const errorOnlineCtyRecDtRef = useRef<HTMLLabelElement>(null);
  const errorOnlineResearchDtRef = useRef<HTMLLabelElement>(null);
  useEffect(() => {
    if (!isValidating) {
      if (errors?.onlineCtyRecDt) {
        errorOnlineCtyRecDtRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
    if (errors?.onlineResearchDt) {
      errorOnlineResearchDtRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [errors, isValidating]);
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
          md={4}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Field
            name="curativeNeed"
            inputProps={{
              id: 'curativeNeed',
            }}
            type="checkbox"
            as={Checkbox}
            sx={{ color: 'white', marginLeft: '-10px' }}
            size="small"
            color="info"
          />
          <StyledInputLabel>{t('curativeNeeded')}</StyledInputLabel>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Field
            name="curativeRcvd"
            inputProps={{
              id: 'curativeRcvd',
            }}
            type="checkbox"
            as={Checkbox}
            sx={{ color: 'white', marginLeft: { xs: '-10px', md: '10px' } }}
            size="small"
            color="info"
          />
          <StyledInputLabel>{t('curativeReceived')}</StyledInputLabel>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Field
            name="curativeNA"
            inputProps={{
              id: 'curativeNA',
            }}
            type="checkbox"
            as={Checkbox}
            sx={{ color: 'white', marginLeft: { xs: '-10px', md: '10px' } }}
            size="small"
            color="info"
          />
          <StyledInputLabel>{t('curativeNA')}</StyledInputLabel>
        </Grid>
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
            name="quietTitle"
            inputProps={{
              id: 'quietTitle',
            }}
            type="checkbox"
            as={Checkbox}
            sx={{ color: 'white', marginLeft: '-10px' }}
            size="small"
            color="info"
          />
          <StyledInputLabel>{t('litigationNeeded')}</StyledInputLabel>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Field
            name="qtComplete"
            inputProps={{
              id: 'qtComplete',
            }}
            type="checkbox"
            as={Checkbox}
            sx={{ color: 'white', marginLeft: { xs: '-10px', md: '10px' } }}
            size="small"
            color="info"
          />
          <StyledInputLabel>{t('litigationCompleted')}</StyledInputLabel>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Field
            name="qtNA"
            inputProps={{
              id: 'qtNA',
            }}
            type="checkbox"
            as={Checkbox}
            sx={{ color: 'white', marginLeft: { xs: '-10px', md: '10px' } }}
            size="small"
            color="info"
          />
          <StyledInputLabel>{t('litigationNA')}</StyledInputLabel>
        </Grid>
      </Grid>
      <StyledGridItem item xs={12} md={2} mt={2}>
        <StyledInputLabel>{t('onlineCountyRecDate')}: </StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10}>
        <CustomDatePicker
          name="onlineCtyRecDt"
          type="date"
          id="onlineCtyRecDt"
          width="30%"
          sx={{
            paddingTop: '0 !important',
          }}
        />
        {errors?.onlineCtyRecDt && (
          <Box ref={errorOnlineCtyRecDtRef}>
            <ErrorText id="error-onlineCtyRecDt">
              {errors?.onlineCtyRecDt}
            </ErrorText>
          </Box>
        )}
      </Grid>
      <StyledGridItem item xs={12} md={2} mt={2}>
        <StyledInputLabel>{t('onlineResDate')}: </StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10}>
        <CustomDatePicker
          name="onlineResearchDt"
          type="date"
          id="onlineResearchDt"
          width="30%"
          sx={{
            paddingTop: '0 !important',
          }}
        />
        {errors?.onlineResearchDt && (
          <Box ref={errorOnlineResearchDtRef}>
            <ErrorText id="error-onlineResearchDt">
              {errors?.onlineResearchDt}
            </ErrorText>
          </Box>
        )}
      </Grid>
    </>
  );
};

export default CurativeTab;
