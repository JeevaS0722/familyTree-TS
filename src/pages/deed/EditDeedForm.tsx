import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { Field } from 'formik';
import CustomDatePicker from '../../component/FormikCustomDatePicker';
import {
  ErrorText,
  StyledGridItem,
  StyledInputLabel,
} from '../../component/common/CommonStyle';
import Box from '@mui/material/Box';
import { Checkbox, Typography } from '@mui/material';
import ConstantDropdown from '../../component/common/fields/ConstantDropdown';
import FileStatusDropdown from '../../component/common/fields/FileStatusDropdown';
import BuyerDropdown from '../../component/common/fields/BuyerDropdown';
import { CustomInputField } from '../../component/common/CustomInputField';
import { EditFormProps } from '../../interface/deed';
import MultiSelect from '../../component/common/fields/MultiSelectInput';
import CountyMultiSelect from '../../component/common/fields/CountyMultiSelectInput';

const EditDeedForm: React.FC<EditFormProps> = ({
  isValidating,
  values,
  errors,
  deedDetailsData,
  error,
  setError,
  errorCountyRef,
}) => {
  const { t } = useTranslation('editDeed');
  const errorReturnDtRef = React.useRef<HTMLInputElement>();
  const errorReturnDateRef = React.useRef<HTMLInputElement>();

  useEffect(() => {
    if (!isValidating) {
      if (errors?.returnDt) {
        errorReturnDtRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      if (errors?.returnDate) {
        errorReturnDateRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [errors, isValidating]);
  return (
    <>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel> {t('fileName')}: </StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          disabled={true}
          name="fileName"
          as={CustomInputField}
          backgroundColor="#434857"
          width="100%"
          type="text"
          inputProps={{
            id: 'fileName',
          }}
        />
      </Grid>

      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel> {t('grantor')} </StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          disabled={true}
          name="grantor"
          as={CustomInputField}
          backgroundColor="#434857"
          width="100%"
          type="text"
          inputProps={{
            id: 'grantor',
          }}
        />
      </Grid>

      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('buyer')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <BuyerDropdown
          name="whose"
          inputProps={{
            id: 'whose',
          }}
          sx={{
            width: { xs: '100%', md: '50%' },
            background: '#434857',
          }}
        />
      </Grid>

      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('fileStatus')}: </StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <FileStatusDropdown
          type="status"
          name="fileStatus"
          inputProps={{
            id: 'fileStatus',
          }}
          sx={{
            width: { xs: '100%', md: '50%' },
            background:
              values?.fileStatus === 'Dead' ||
              values?.fileStatus === 'Dead-Estate'
                ? 'red'
                : values?.fileStatus === 'Paused'
                  ? 'lightblue'
                  : '#434857',
          }}
        />
      </Grid>

      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('paperLocation')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Grid container spacing={{ xs: 2, md: 2 }}>
          <Grid item xs={12} md={7}>
            <FileStatusDropdown
              type="location"
              name="returnedTo"
              inputProps={{
                id: 'returnedTo',
              }}
              sx={{
                width: { xs: '100%', md: '86.5%' },
                background: '#434857',
              }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={5}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <Field
              name="paperFile"
              inputProps={{
                id: 'paperFile',
              }}
              type="checkbox"
              as={Checkbox}
              sx={{ color: 'white', marginLeft: '-10px' }}
              size="small"
              color="info"
            />
            <StyledInputLabel>{t('paperFileExist')}</StyledInputLabel>
          </Grid>
        </Grid>
      </Grid>

      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('asOf')} :</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <CustomDatePicker
          name="returnDt"
          type="date"
          id="returnDt"
          width="40%"
          sx={{
            paddingTop: '0 !important',
          }}
        />
        {errors?.returnDt && (
          <Box ref={errorReturnDtRef}>
            <ErrorText id="error-returnDt">{errors?.returnDt}</ErrorText>
          </Box>
        )}
      </Grid>
      <Grid item container xs={12}>
        <StyledGridItem item xs={12} md={2} xl={1}>
          <StyledInputLabel>{t('deedReturn')}: </StyledInputLabel>
        </StyledGridItem>
        <Grid item xs={12} md={4}>
          <CustomDatePicker
            name="returnDate"
            type="date"
            id="returnDate"
            sx={{
              paddingTop: '0 !important',
            }}
          />
          {errors?.returnDate && (
            <Box ref={errorReturnDateRef}>
              <ErrorText id="error-returnDate">{errors?.returnDate}</ErrorText>
            </Box>
          )}
        </Grid>
      </Grid>
      <Grid item container xs={12} md={6}>
        <StyledGridItem item xs={12} md={4} xl={2}>
          <StyledInputLabel>{t('state')}: </StyledInputLabel>
        </StyledGridItem>
        <Grid item xs={12} md={8} xl={10}>
          <MultiSelect name="deedState" id="deedState" />
        </Grid>
      </Grid>
      <Grid item container xs={12} md={6}>
        <StyledGridItem item xs={12} md={2} xl={1}>
          <StyledInputLabel>{t('county')}: </StyledInputLabel>
        </StyledGridItem>
        <Grid item xs={12} md={10} xl={11}>
          <CountyMultiSelect
            name="deedCounty"
            id="deedCounty"
            state={values?.deedState}
            setError={setError}
            maxLength={255}
          />
          {error && (
            <Box ref={errorCountyRef}>
              <ErrorText id="error-deedCounty">{error}</ErrorText>
            </Box>
          )}
        </Grid>
      </Grid>

      <Grid item container xs={12}>
        <StyledGridItem item xs={12} md={2} xl={1}>
          <StyledInputLabel
            sx={{
              color: values?.titleFailed ? 'red' : 'inherit',
            }}
          >
            {t('titleFailure')}
          </StyledInputLabel>
        </StyledGridItem>
        <Grid item xs={12} md={10} lg={4}>
          <ConstantDropdown
            type="titleFail"
            name="titleFailedReason"
            inputProps={{ id: 'titleFailedReason' }}
            sx={{
              width: { xs: '100%', sm: '100%' },
              background: '#434857',
            }}
          />
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        md={3}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <Field
          name="complete"
          inputProps={{
            id: 'complete',
          }}
          type="checkbox"
          as={Checkbox}
          sx={{ color: 'white', marginLeft: '-10px' }}
          size="small"
          color="info"
        />
        <StyledInputLabel
          sx={{
            color: deedDetailsData?.complete === true ? 'red' : 'inherit',
          }}
        >
          {t('deedFileComplete')}
        </StyledInputLabel>
      </Grid>
      <Grid item xs={12} md={6} mt={1}>
        <Typography
          component="h6"
          sx={{
            fontStyle: 'italic',
          }}
        >
          {t('totalPurchased')}: {values?.totalPurchased}%
        </Typography>
      </Grid>
    </>
  );
};

export default EditDeedForm;
