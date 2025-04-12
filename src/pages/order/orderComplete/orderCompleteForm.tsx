import React, { useEffect, useRef } from 'react';
import { Field } from 'formik';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Checkbox from '@mui/material/Checkbox';
import { useTranslation } from 'react-i18next';
import { OrderCompleteProps } from '../../../interface/order';
import { CustomSelectField } from '../../../component/CustomizedSelectComponent';
import { Link } from 'react-router-dom';
import StateDropdown from '../../../component/common/fields/StateDropdown';
import StyledInputField, {
  CustomInputLabel,
  ErrorText,
  StyledGrid,
  StyledInputLabel,
} from '../../../component/common/CommonStyle';
import AmountField from '../../../component/common/fields/AmountField';

const OrderCompleteForm: React.FC<OrderCompleteProps> = ({
  dropDownValue,
  form,
  setForm,
  setFieldValue,
  handleChange,
  getAddresses,
  scrollRef,
  addressFetching,
  errors,
  addressId,
  isValidating,
}) => {
  const { t } = useTranslation('completeOrder');
  const addressIdRef = useRef<HTMLLabelElement>(null);
  const ordPayAmountRef = useRef<HTMLLabelElement>(null);
  useEffect(() => {
    if (!isValidating) {
      if (errors?.addressId && scrollRef === 'addressId') {
        addressIdRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [errors, scrollRef, isValidating]);
  return (
    <Grid container alignItems="center">
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{t('fileName')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name="fileName"
          as={StyledInputField}
          disabled
          sx={{
            '& .Mui-disabled': {
              opacity: 1,
              background: '#30343e',
              cursor: 'not-allowed',
              color: '#fff',
              '-webkit-text-fill-color': 'unset !important',
            },
          }}
          type="text"
          fullWidth
          inputProps={{ id: 'fileName' }}
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{t('contactName')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name="contactName"
          sx={{
            '& .Mui-disabled': {
              opacity: 1,
              background: '#30343e',
              cursor: 'not-allowed',
              color: '#fff',
              '-webkit-text-fill-color': 'unset !important',
            },
          }}
          as={StyledInputField}
          disabled
          type="text"
          fullWidth
          inputProps={{ id: 'contactName' }}
        />
      </StyledGrid>
      <Grid item alignItems={'center'} container xs={12}>
        <Grid item xs={12} md={2} xl={1} sm={3}>
          <CustomInputLabel>{t('requestedDate')}:</CustomInputLabel>
        </Grid>
        <StyledGrid item xs={12} md={4} sm={4}>
          <Field
            name="requestedDt"
            sx={{
              '& .Mui-disabled': {
                opacity: 1,
                background: '#30343e',
                cursor: 'not-allowed',
                color: '#fff',
                '-webkit-text-fill-color': 'unset !important',
              },
            }}
            as={StyledInputField}
            disabled
            type="text"
            fullWidth
            inputProps={{ id: 'requestedDt' }}
          />
        </StyledGrid>
      </Grid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{t('requestedBy')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name="requestedBy"
          as={CustomSelectField}
          hasEmptyValue
          options={dropDownValue.users}
          labelKey="fullName"
          valueKey="userId"
          inputProps={{ id: 'requestedBy' }}
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{t('type')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name="ordType"
          as={CustomSelectField}
          hasEmptyValue
          options={dropDownValue.orderTypes}
          labelKey="place"
          valueKey="place"
          inputProps={{ id: 'type' }}
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{t('state')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <StateDropdown
          name="ordState"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e);
            getAddresses({ state: e.target.value });
            if (addressId && Number(addressId) !== 0) {
              setFieldValue('addressId', undefined);
            }
            setFieldValue('address.state', e.target.value);
          }}
          sx={{
            width: { xs: '100%' },
            background: '#434857',
            outline: 'none',
          }}
          inputProps={{ id: 'state' }}
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{t('county')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name="ordCity"
          as={StyledInputField}
          type="text"
          fullWidth
          inputProps={{ id: 'county' }}
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel>{t('caseNo')}:</CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name="caseNo"
          as={StyledInputField}
          type="text"
          fullWidth
          inputProps={{ id: 'caseNo' }}
        />
      </StyledGrid>
      <Grid item xs={12} md={2} xl={1} sm={3}>
        <CustomInputLabel ref={addressIdRef}>
          {t('orderFrom')}:*
        </CustomInputLabel>
      </Grid>
      <StyledGrid item xs={12} md={10} xl={11} sm={9}>
        <Field
          name="addressId"
          as={CustomSelectField}
          disabled={addressFetching}
          hasEmptyValue
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e);
            if (e.target && 'value' in e.target) {
              const address = dropDownValue.addresses.find(
                a => String(a.addressId) === e.target.value
              );
              setForm(address?.form);
            }
          }}
          extraOptions={[
            {
              name: t('addNewCourtAddressOption'),
              addressId: 0,
            },
          ]}
          options={dropDownValue.addresses}
          labelKey="name"
          valueKey="addressId"
          inputProps={{ id: 'addressId' }}
        />
        {addressFetching && <LinearProgress></LinearProgress>}
        {errors?.addressId && (
          <ErrorText id={'error-addressId'}>{errors?.addressId}</ErrorText>
        )}
      </StyledGrid>

      <Grid container item alignItems={'center'} xs={12}>
        <Grid item xs={2} md={2} xl={1} sm={3}>
          <CustomInputLabel>{t('form')}:</CustomInputLabel>
        </Grid>
        <Grid item sx={{ marginTop: '15px' }} xs={9} md={10} xl={11} sm={9}>
          {form ? (
            <Link
              to={form}
              className="hover-link"
              id="openRequestFormLink"
              target="_blank"
            >
              {t('openRequestForm')}
            </Link>
          ) : (
            <Typography sx={{ fontSize: '85%' }}>
              {t('requestFormNotPresent')}
            </Typography>
          )}
        </Grid>
      </Grid>
      <Grid item container alignItems={'center'} xs={12}>
        <Grid item xs={12} md={2} xl={1} sm={3}>
          <CustomInputLabel ref={ordPayAmountRef}>
            {t('checkAmount')}:*
          </CustomInputLabel>
        </Grid>
        <StyledGrid item xs={12} md={4} sm={4}>
          <AmountField
            name="ordPayAmt"
            label={t('checkAmount')}
            isRequired={true}
            isInteger={false}
            precision={21}
            scale={2}
            formatAmount={true}
            startAdornment="$"
            fullWidth
          />
        </StyledGrid>
      </Grid>
      <Grid item xs={5} md={2} xl={1} sm={3}>
        <StyledInputLabel>{t('isAmtExceed')}:</StyledInputLabel>
      </Grid>
      <Grid
        item
        xs={7}
        md={10}
        xl={11}
        sm={9}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <Field
          name="isAmtExceed"
          inputProps={{
            id: 'paperFile',
          }}
          type="checkbox"
          as={Checkbox}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            void setFieldValue('isAmtExceed', e.target.checked);
          }}
          sx={{ color: 'white', marginLeft: '-10px' }}
          size="small"
          color="info"
        />
      </Grid>
    </Grid>
  );
};

export default OrderCompleteForm;
