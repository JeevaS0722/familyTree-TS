import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Form, Formik } from 'formik';
import { useAppDispatch } from '../../store/hooks';
import { useTranslation } from 'react-i18next';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import * as Yup from 'yup';
import RenderOperatorFields from './OperatorFields';
import { CreateOperatorInitialValues } from '../../interface/operator';
import { newOperatorSchema } from '../../schemas/operator';
import { useCreateOperatorMutation } from '../../store/Services/operatorService';
import { setName } from '../../store/Reducers/searchOperatorReducer';

const AddOperator: React.FC = () => {
  const { t } = useTranslation('operator');
  const [createOperator] = useCreateOperatorMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [initialValues] = React.useState<CreateOperatorInitialValues>({
    companyName: '',
    ownerNumber: '',
    contactName: '',
    phoneNumber: null,
    fax: null,
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    notes: '',
  });
  const onSubmit = async (values: CreateOperatorInitialValues) => {
    try {
      const response = await createOperator(values);
      if ('data' in response) {
        if (response?.data?.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          dispatch(setName({ name: values.companyName }));
          navigate('/searchoperators', {
            state: {
              newSearch: false,
            },
          });
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
  };
  return (
    <Container component="main" fixed sx={{ marginTop: 2 }}>
      <Grid container sx={{ mt: 2, mb: 2 }}>
        <Typography component="h6" id="newOperator" className="header-title-h6">
          {t('newOperator')}
        </Typography>
      </Grid>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={newOperatorSchema(t)}
        onSubmit={onSubmit}
        validateOnBlur={false}
        validateOnChange={false}
        validate={values => {
          try {
            newOperatorSchema(t).validateSync(values, {
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
              <Grid>
                {RenderOperatorFields(t)}
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
                    id="save-operator"
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

export default AddOperator;
