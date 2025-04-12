import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { UpdateOperatorInitialValues } from '../../interface/operator';
import {
  useLazyGetOperatorByIdQuery,
  useUpdateOperatorMutation,
} from '../../store/Services/operatorService';
import { newOperatorSchema } from '../../schemas/operator';
import { setName } from '../../store/Reducers/searchOperatorReducer';
import OverlayLoader from '../../component/common/OverlayLoader';

const EditOperator: React.FC = () => {
  const { t } = useTranslation('operator');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [updateOperator] = useUpdateOperatorMutation();
  const { operatorID } = useParams();
  const [initialValues, setInitialValues] =
    React.useState<UpdateOperatorInitialValues>({
      operatorID: Number(operatorID),
      companyName: '',
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
  const [
    getOperator,
    { data: operatorData, isLoading: operatorLoading, isFetching },
  ] = useLazyGetOperatorByIdQuery();
  React.useEffect(() => {
    if (operatorID) {
      void getOperator({ operatorId: Number(operatorID) });
    }
  }, [operatorID, getOperator]);
  React.useEffect(() => {
    if (operatorData) {
      setInitialValues({
        operatorID: operatorData.data.operatorID,
        companyName: operatorData.data.companyName,
        contactName: operatorData.data.contactName,
        phoneNumber: operatorData.data.phoneNumber,
        fax: operatorData.data.fax,
        email: operatorData.data.email,
        address: operatorData.data.address,
        city: operatorData.data.city,
        state: operatorData.data.state,
        zip: operatorData.data.zip,
        notes: operatorData.data.notes,
      });
    }
  }, [operatorData]);

  const onSubmit = async (values: UpdateOperatorInitialValues) => {
    try {
      const response = await updateOperator(values);
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
        <Typography
          component="h6"
          id="editOperator"
          className="header-title-h6"
        >
          {t('editOperator')}
        </Typography>
      </Grid>
      {(operatorLoading || isFetching) && <OverlayLoader open />}
      {!operatorLoading && (
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
                  <Grid container justifyContent="center">
                    <Grid item>
                      <Button
                        disabled={isSubmitting}
                        type="submit"
                        id="edit-operator"
                        variant="outlined"
                        sx={{
                          my: '2rem',
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
                </Grid>
              </Box>
            </Form>
          )}
        </Formik>
      )}
    </Container>
  );
};

export default EditOperator;
