import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Form, Formik, FormikHelpers } from 'formik';
import { useAppDispatch } from '../../store/hooks';
import { useTranslation } from 'react-i18next';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import * as Yup from 'yup';
import TaxFields from './TaxFields';
import { NewTaxForm } from '../../interface/tax';
import { taxSchema } from '../../schemas/tax';
import { formatDateByMonth } from '../../utils/GeneralUtil';
import { useCreateTaxMutation } from '../../store/Services/taxService';

const initialValue: NewTaxForm = {
  deedID: 0,
  taxingEntity: '',
  county: '',
  state: 'TX',
  amountDue: '',
  datePaid: null,
  rcvd: false,
  taxEnd: null,
  taxStart: null,
};
const AddTax: React.FC = () => {
  const { t } = useTranslation('tax');
  const { deedId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [createTax] = useCreateTaxMutation();
  const [error, setError] = useState<string>('');
  const errorCountyRef = React.useRef<HTMLDivElement>(null);

  const onSubmit = async (
    values: NewTaxForm,
    actions: FormikHelpers<NewTaxForm>
  ) => {
    if (!error) {
      try {
        const data = {
          deedID: Number(deedId),
          taxingEntity: values.taxingEntity,
          county: values.county,
          state: values.state,
          amountDue: values.amountDue,
          datePaid: values?.datePaid
            ? formatDateByMonth(values.datePaid.toString()).toString()
            : null,
          taxStart: values?.taxStart
            ? formatDateByMonth(values.taxStart.toString()).toString()
            : null,
          taxEnd: values?.taxEnd
            ? formatDateByMonth(values.taxEnd.toString()).toString()
            : null,
          rcvd: values.rcvd,
        };
        const response = await createTax(data);
        if ('data' in response) {
          if (response?.data?.success) {
            actions.resetForm();
            dispatch(
              open({
                severity: severity.success,
                message: response?.data?.message,
              })
            );
            navigate(`/editdeed/${deedId}?tab=taxes`);
          }
        }
      } catch (error) {
        dispatch(
          open({
            severity: severity.error,
            message: 'An Unexpected Error Occurred',
          })
        );
      }
    } else {
      errorCountyRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };
  return (
    <Container component="main" fixed sx={{ marginTop: 2 }}>
      <Grid container sx={{ mt: 2, mb: 2, justifyContent: 'center' }}>
        <Typography
          id="newTax"
          variant="h3"
          component="p"
          gutterBottom
          className="header-title-h4"
        >
          {t('newTax')}
        </Typography>
      </Grid>
      <Formik
        initialValues={initialValue}
        enableReinitialize={true}
        validationSchema={taxSchema(t)}
        onSubmit={onSubmit}
        validateOnBlur={false}
        validateOnChange={false}
        validate={values => {
          try {
            taxSchema(t).validateSync(values, {
              abortEarly: true,
            });
          } catch (error) {
            if (error instanceof Yup.ValidationError && error.path) {
              setTimeout(() => {
                const errorElement = document.querySelector(
                  `[name="${error.path}"]`
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
        {({ isSubmitting, values, errors }) => (
          <Form>
            <Box>
              <Grid container spacing={{ xs: 2, md: 2 }}>
                <TaxFields
                  errors={errors}
                  state={values.state}
                  error={error}
                  setError={setError}
                  errorCountyRef={errorCountyRef}
                />
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
                    id="save-tax"
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
                    {t('save')}
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

export default AddTax;
