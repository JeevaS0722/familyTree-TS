import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Form, Formik, FormikHelpers, ErrorMessage, Field } from 'formik';
import { useAppDispatch } from '../../store/hooks';
import { useTranslation } from 'react-i18next';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import * as Yup from 'yup';
import { RequestCheckDetails } from '../../interface/requestCheck';
import { useCreateRequestCheckMutation } from '../../store/Services/requestCheckService';
import { requestCheckSchema } from '../../schemas/requestCheck';
import StateDropdown from '../../component/common/fields/StateDropdown';
import StyledInputField, {
  ErrorTextValidation,
  StyledGridItem,
  StyledInputLabel,
} from '../../component/common/CommonStyle';
import AmountField from '../../component/common/fields/AmountField';

const initialValue: RequestCheckDetails = {
  payee: '',
  memo: '',
  amt: '0',
  address: '',
  city: '',
  state: '',
  zip: '',
};

const AddRequestCheck: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('requestCheck');
  const dispatch = useAppDispatch();
  const [createRequestCheck] = useCreateRequestCheckMutation();

  const onSubmit = async (
    values: RequestCheckDetails,
    actions: FormikHelpers<RequestCheckDetails>
  ) => {
    try {
      const data = {
        payee: values.payee,
        memo: values.memo,
        amt: values.amt,
        address: values.address,
        city: values.city,
        state: values.state,
        zip: values.zip,
      };
      const response = await createRequestCheck(data);
      if ('data' in response) {
        if (response?.data?.success) {
          actions.resetForm();
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          navigate('/');
        }
      }
    } catch (error) {
      return error;
    }
  };
  return (
    <Container component="main" fixed sx={{ marginTop: 2 }}>
      <Grid container sx={{ mt: 2, mb: 2 }}>
        <Typography
          variant="h4"
          component="p"
          gutterBottom
          id="request-check"
          sx={{ color: 'white', fontSize: '24px' }}
        >
          {t('requestCheck')}
        </Typography>
      </Grid>
      <Formik
        initialValues={initialValue}
        enableReinitialize={true}
        validationSchema={requestCheckSchema(t)}
        onSubmit={onSubmit}
        validateOnBlur={false}
        validateOnChange={false}
        validate={values => {
          try {
            requestCheckSchema(t).validateSync(values, {
              abortEarly: false,
            });
          } catch (error) {
            if (
              error instanceof Yup.ValidationError &&
              error.inner.length > 0
            ) {
              setTimeout(() => {
                const errorElement = document.querySelector(
                  `[name="${error.inner[0].path}"]`
                );
                errorElement?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                });
              }, 100);
            }
            return {};
          }
          return {};
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box>
              <Grid container spacing={{ xs: 2, md: 2 }}>
                <StyledGridItem item xs={12} md={2} xl={1}>
                  <StyledInputLabel>{t('payee')}:</StyledInputLabel>
                </StyledGridItem>
                <Grid item xs={12} md={10} xl={11}>
                  <Field
                    name="payee"
                    inputProps={{ id: 'payee', maxLength: 255 }}
                    as={StyledInputField}
                    type="text"
                    placeholder={t('payableTo')}
                    fullWidth
                  />
                </Grid>
                <StyledGridItem item xs={12} md={2} xl={1}>
                  <StyledInputLabel>{t('memo')}:</StyledInputLabel>
                </StyledGridItem>
                <Grid item xs={12} md={10} xl={11}>
                  <Field
                    name="memo"
                    inputProps={{ id: 'memo', maxLength: 255 }}
                    as={StyledInputField}
                    placeholder={t('memo')}
                    type="text"
                    fullWidth
                  />
                </Grid>
                <StyledGridItem item xs={12} md={2} xl={1}>
                  <StyledInputLabel>{t('amt')}:</StyledInputLabel>
                </StyledGridItem>
                <Grid item xs={12} md={2} xl={2}>
                  <AmountField
                    name="amt"
                    label={t('amt')}
                    errId="amtValidationMsg"
                    isInteger={false}
                    precision={19}
                    scale={2}
                    formatAmount={true}
                    startAdornment="$"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={false} md={8} xl={9} />
                <StyledGridItem item xs={12} md={2} xl={1}>
                  <StyledInputLabel>{t('address')}:</StyledInputLabel>
                </StyledGridItem>
                <Grid item xs={12} md={10} xl={11}>
                  <Field
                    name="address"
                    inputProps={{ id: 'address', maxLength: 255 }}
                    as={StyledInputField}
                    type="text"
                    placeholder={t('addressOptional')}
                    fullWidth
                  />
                </Grid>
                <StyledGridItem item xs={12} md={2} xl={1}>
                  <StyledInputLabel>{t('city')}:</StyledInputLabel>
                </StyledGridItem>
                <Grid item xs={12} md={10} xl={11}>
                  <Field
                    name="city"
                    inputProps={{ id: 'city', maxLength: 30 }}
                    as={StyledInputField}
                    placeholder={t('city')}
                    type="text"
                    fullWidth
                  />
                </Grid>
                <StyledGridItem item xs={12} md={2} xl={1}>
                  <StyledInputLabel>{t('state')}:</StyledInputLabel>
                </StyledGridItem>
                <Grid item xs={12} md={10} xl={11}>
                  <StateDropdown
                    name="state"
                    inputProps={{ id: 'state' }}
                    fullWidth
                    sx={{
                      background: '#434857',
                      outline: 'none',
                    }}
                  />
                </Grid>

                <StyledGridItem item xs={12} md={2} xl={1}>
                  <StyledInputLabel>{t('zip')}: </StyledInputLabel>
                </StyledGridItem>
                <Grid item xs={12} md={10} xl={11}>
                  <Field
                    name="zip"
                    inputProps={{ id: 'zip', maxLength: 10 }}
                    as={StyledInputField}
                    type="text"
                    placeholder={t('zip')}
                    fullWidth
                  />
                  <ErrorMessage
                    id="zipValidationMsg"
                    name="zip"
                    component={ErrorTextValidation}
                  />
                </Grid>

                <Grid
                  container
                  mb={1}
                  spacing={{ xs: 1, sm: 1 }}
                  sx={{
                    marginTop: '10px !important',
                    justifyContent: 'center',
                    width: '100% !important',
                  }}
                >
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    id="sendRequest"
                    variant="outlined"
                    sx={{
                      my: '1rem',
                      '&:disabled': {
                        opacity: 0.2,
                        cursor: 'not-allowed',
                        backgroundColor: '#1997c6',
                        color: '#fff',
                      },
                    }}
                  >
                    {t('sendRequest')}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default AddRequestCheck;
