import React from 'react';
import Grid from '@mui/material/Grid';
import { ErrorMessage, Field } from 'formik';
import {
  CustomSelectField,
  CustomSelectField as SelectField,
} from '../../component/CustomizedSelectComponent';
import CustomDatePicker from '../../component/FormikCustomDatePicker';
import Checkbox from '@mui/material/Checkbox';
import LinearProgress from '@mui/material/LinearProgress';
import {
  DropdownObjectForOrder,
  EditOrderDetailsData,
} from '../../interface/order';
import StateDropdown from '../../component/common/fields/StateDropdown';
import StyledInputField, {
  ErrorTextValidation,
  StyledGridItem,
  StyledInputLabel,
} from '../../component/common/CommonStyle';

const RenderOrderFields = (
  t: (key: string) => string,
  dropDownValue: DropdownObjectForOrder,
  orderDetails?: EditOrderDetailsData,
  addressFetching?: boolean,
  mode?: string,
  showAddressField?: boolean
): React.JSX.Element => {
  return (
    <>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('requestedBy')}:* </StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="requestedBy"
          inputProps={{ id: 'requestedBy' }}
          as={SelectField}
          labelKey="label"
          valueKey="value"
          options={dropDownValue.users}
        />
        <ErrorMessage
          id="requestByValidationMsg"
          name="requestedBy"
          component={ErrorTextValidation}
        />
      </Grid>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('orderFromState')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <StateDropdown
          name="orderState"
          inputProps={{ id: 'orderState' }}
          fullWidth
          sx={{
            background: '#434857',
            outline: 'none',
          }}
        />
      </Grid>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('orderFromCounty')}:</StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="orderCity"
          inputProps={{ id: 'orderCity', maxLength: 50 }}
          as={StyledInputField}
          type="text"
          fullWidth
        />
      </Grid>
      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel> {t('type')}:* </StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="orderType"
          inputProps={{ id: 'orderType' }}
          component={CustomSelectField}
          options={dropDownValue?.type}
          hasEmptyValue={true}
          labelKey="place"
          valueKey="place"
          fullWidth
        />
        <ErrorMessage
          id="orderTypeValidationMsg"
          name="orderType"
          component={ErrorTextValidation}
        />
      </Grid>

      <StyledGridItem item xs={12} md={2} xl={1}>
        <StyledInputLabel>{t('caseNoIfKnown')}: </StyledInputLabel>
      </StyledGridItem>
      <Grid item xs={12} md={10} xl={11}>
        <Field
          name="caseNo"
          inputProps={{ id: 'caseNo', maxLength: 50 }}
          as={StyledInputField}
          type="text"
          fullWidth
        />
      </Grid>

      {mode === 'edit' && (
        <>
          {showAddressField && (
            <>
              <StyledGridItem item xs={12} md={2} xl={1}>
                <StyledInputLabel>{t('orderFrom')}:</StyledInputLabel>
              </StyledGridItem>
              <Grid item xs={12} md={10} xl={11}>
                <Field
                  name="addressId"
                  as={SelectField}
                  disabled={addressFetching}
                  hasEmptyValue
                  options={dropDownValue.address}
                  labelKey="name"
                  valueKey="addressId"
                  inputProps={{ id: 'addressId' }}
                />
                {addressFetching && <LinearProgress></LinearProgress>}
              </Grid>
            </>
          )}
          <StyledGridItem item xs={12} md={2} xl={1}>
            <StyledInputLabel>{t('orderDate')}:</StyledInputLabel>
          </StyledGridItem>
          <Grid item xs={12} md={10} xl={11}>
            <CustomDatePicker
              name="ordDt"
              type="date"
              id="ordDt"
              sx={{
                paddingTop: '0 !important',
              }}
            />
            <ErrorMessage
              id="orderDateValidationMsg"
              name="ordDt"
              component={ErrorTextValidation}
            />
          </Grid>

          <StyledGridItem item xs={12} md={2} xl={1}>
            <StyledInputLabel>{t('recDate')}:</StyledInputLabel>
          </StyledGridItem>
          <Grid item xs={12} md={10} xl={11}>
            <CustomDatePicker
              name="ordRcdDt"
              type="date"
              id="ordRcdDt"
              sx={{
                paddingTop: '0 !important',
              }}
            />
            <ErrorMessage
              id="orderRcdDateValidationMsg"
              name="ordRcdDt"
              component={ErrorTextValidation}
            />
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
              name="ordNA"
              inputProps={{
                id: 'ordNA',
              }}
              type="checkbox"
              as={Checkbox}
              sx={{ color: 'white', marginLeft: '-10px' }}
              size="small"
              color="info"
            />
            <StyledInputLabel
              sx={{
                color: orderDetails?.ordNA === true ? 'red' : 'inherit',
              }}
            >
              {t('notApplicable')}
            </StyledInputLabel>
          </Grid>
        </>
      )}
    </>
  );
};
export default RenderOrderFields;
