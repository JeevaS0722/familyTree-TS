import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Form, Formik } from 'formik';
import RenderWellsFields from '../wells/WellsFields';
import { useAppDispatch } from '../../store/hooks';
import { useTranslation } from 'react-i18next';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import * as Yup from 'yup';
import { CreateWellInitialValues } from '../../interface/well';
import { wellSchema } from '../../schemas/wellSchema';
import { useCreateWellMutation } from '../../store/Services/wellService';

const AddWell: React.FC = () => {
  const { t } = useTranslation('well');
  const { divOrderId } = useParams();
  const [createWell] = useCreateWellMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const errorCountyRef = React.useRef<HTMLDivElement>(null);

  const [initialValues] = React.useState<CreateWellInitialValues>({
    divOrderID: Number(divOrderId),
    well: '',
    section: '',
    township: '',
    rangeSurvey: '',
    wellCounty: '',
    wellState: '',
    welldivint: '',
  });

  const onSubmit = async (values: CreateWellInitialValues) => {
    if (!error) {
      try {
        const response = await createWell(values);
        if ('data' in response) {
          if (response?.data?.success) {
            dispatch(
              open({
                severity: severity.success,
                message: response?.data?.message,
              })
            );
            navigate(`/division/edit/${Number(divOrderId)}`, {
              state: {
                from: 'well',
                action: 'create',
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
    } else {
      errorCountyRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };
  return (
    <Container component="main" fixed sx={{ marginTop: 2 }}>
      <Grid container sx={{ mt: 2, mb: 2 }}>
        <Typography component="h6" id="newWell" className="header-title-h6">
          {t('newWell')}
        </Typography>
      </Grid>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={wellSchema(t)}
        onSubmit={onSubmit}
        validateOnBlur={false}
        validateOnChange={false}
        validate={values => {
          try {
            wellSchema(t).validateSync(values, {
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
        {({ isSubmitting, values }) => (
          <Form>
            <Box>
              <Grid>
                {RenderWellsFields(
                  t,
                  values.wellState,
                  error,
                  setError,
                  errorCountyRef
                )}
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
                    id="save-well"
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

export default AddWell;
