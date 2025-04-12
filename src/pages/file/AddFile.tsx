import React, { memo, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {
  CustomInputLabel,
  StyledGrid,
  ErrorText,
} from '../../component/common/CommonStyle';
import { useTranslation } from 'react-i18next';
import { AddNewFileProps } from '../../interface/file';
import CustomDatePicker from '../../component/FormikCustomDatePicker';
import FormikTextField from '../../component/common/fields/TextField';
import FileStatusDropdown from '../../component/common/fields/FileStatusDropdown';
import MultiSelect from '../../component/common/fields/MultiSelectInput';
import CountyMultiSelect from '../../component/common/fields/CountyMultiSelectInput';
import AmountField from '../../component/common/fields/AmountField';

const AddFile: React.FC<AddNewFileProps> = ({
  values,
  errors,
  setError,
  errorCountyRef,
}) => {
  const { t } = useTranslation('newfile');
  const errorFileNameRef = useRef<HTMLDivElement>(null);
  const errorStartDtRef = useRef<HTMLDivElement>(null);
  const errorOnlineResearchDtRef = useRef<HTMLDivElement>(null);
  const [errorMessage, setErrorMessage] = React.useState<string>(''); // State to store error message

  useEffect(() => {
    if (errors?.fileName) {
      errorFileNameRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
    if (errors?.startDt) {
      errorStartDtRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
    if (errors?.onlineResearchDt) {
      errorOnlineResearchDtRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [errors]);

  useEffect(() => {
    setError(errorMessage);
    errorCountyRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [errorMessage]);

  return (
    <Grid container alignItems="center" sx={{ mt: 2 }}>
      <Grid item xs={12}>
        <Typography
          variant="h4"
          component="p"
          gutterBottom
          sx={{ color: 'white', fontSize: '24px' }}
        >
          {t('createNewFile')}
        </Typography>
      </Grid>
      <Grid item xs={12} md={2} xl={1}>
        <CustomInputLabel>{t('fileName')}:* </CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11}>
        <FormikTextField
          name="fileName"
          autoFocus
          type="text"
          fullWidth
          inputProps={{ id: 'fileName', maxLength: 255 }}
        />
        {errors?.fileName && (
          <Box ref={errorFileNameRef}>
            <ErrorText>{errors?.fileName}</ErrorText>
          </Box>
        )}
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1}>
        <CustomInputLabel>{t('fileOrigin')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11}>
        <FormikTextField
          name="fileOrigin"
          type="text"
          sx={{ width: { md: '50%' } }}
          fullWidth
          inputProps={{ id: 'fileOrigin', maxLength: 50 }}
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1}>
        <CustomInputLabel>{t('startDate')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11}>
        <CustomDatePicker
          name="startDt"
          type="date"
          id="startDt"
          width="30%"
          style={{
            demo: {
              sx: {
                paddingTop: '0px',
              },
            },
          }}
          error={!!errors?.startDt}
        />
        {errors?.startDt && (
          <Box ref={errorStartDtRef}>
            <ErrorText id="error-startDt">{errors?.startDt}</ErrorText>
          </Box>
        )}
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1}>
        <CustomInputLabel>{t('legalsState')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11}>
        <MultiSelect name="legalsState" id="legalState" />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1}>
        <CustomInputLabel>{t('legalsCounty')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11}>
        <CountyMultiSelect
          name="legalsCounty"
          id="legalsCounty"
          state={values?.legalsState}
          setError={setErrorMessage}
          maxLength={255}
        />
        {errorMessage && (
          <Box ref={errorCountyRef}>
            <ErrorText id="error-legalsCounty">{errorMessage}</ErrorText>
          </Box>
        )}
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1}>
        <CustomInputLabel>{t('mm/Suspense')}:</CustomInputLabel>
      </Grid>
      <StyledGrid
        item
        xs={12}
        md={10}
        xl={11}
        sx={{
          display: { xs: 'grid', md: 'grid', lg: 'flex' },
        }}
      >
        <Box>
          <AmountField
            name="mMSuspAmt"
            label={t('mm/Suspense')}
            isInteger={false}
            precision={19}
            scale={2}
            formatAmount={true}
            startAdornment="$"
          />
        </Box>
        <FormikTextField
          name="mMComment"
          inputProps={{
            id: 'mMComment',
            maxLength: 255,
          }}
          boxProps={{
            sx: {
              width: { md: '50%' },
            },
          }}
          placeholder="Comment"
          type="text"
          sx={{
            flex: '2',
            marginLeft: '1px',
            width: { md: '100%' },
            mt: { xs: '8px', md: '8px', lg: '0' },
          }}
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1}>
        <CustomInputLabel>{t('onlineResearchDt')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11}>
        <CustomDatePicker
          name="onlineResearchDt"
          id="onlineResearchDt"
          type="date"
          width="30%"
          style={{
            demo: {
              sx: {
                paddingTop: '0px',
              },
            },
          }}
          error={!!errors?.onlineResearchDt}
        />
        {errors?.onlineResearchDt && (
          <Box ref={errorOnlineResearchDtRef}>
            <ErrorText id="error-onlineResearchDt">
              {errors?.onlineResearchDt}
            </ErrorText>
          </Box>
        )}
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1}>
        <CustomInputLabel>{t('fileStatus')}</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11}>
        <FileStatusDropdown
          sx={{ width: { md: '50%' } }}
          name="fileStatus"
          type="status"
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1}>
        <CustomInputLabel>{t('fileLocation')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11}>
        <FileStatusDropdown
          sx={{ width: { md: '50%' } }}
          name="returnedTo"
          type="location"
        />
      </StyledGrid>
    </Grid>
  );
};

export default memo(AddFile);
