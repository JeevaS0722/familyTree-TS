import React, { useRef } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Form, Formik } from 'formik';
import { useAppDispatch } from '../../store/hooks';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import MOEAForm from './MoeaForm';
import { addMOEAPayload, moeaValues } from '../../interface/moea';
import { useAddMOEAMutation } from '../../store/Services/moeaService';
import { moeaSchema } from '../../schemas/moea';
import { setMoeaSearch } from '../../store/Reducers/searchMoea';

const AddMOEA: React.FC = () => {
  const { t } = useTranslation('moea');
  const { t: et } = useTranslation('errors');
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const addMOEARef = useRef<HTMLInputElement>(null);
  const moeaInitialValues: moeaValues = {
    name: '',
    researched: false,
    onr: false,
    orderNo: '',
    calls: '',
    section: '',
    township: '',
    range: '',
    county: '',
    state: '',
    company: '',
    notes: '',
  };

  const [addMOEA] = useAddMOEAMutation();

  const onSubmit = async (values: moeaValues) => {
    try {
      const data: addMOEAPayload = {
        name: values.name,
        amount: values.amount,
        researched: values.researched,
        onr: values.onr,
        orderNo: values.orderNo,
        calls: values.calls,
        section: values.section,
        township: values.township,
        range: values.range,
        county: values.county,
        state: values.state,
        company: values.company,
        notes: values.notes,
      };
      const response = await addMOEA(data);
      if ('data' in response) {
        if (response?.data?.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          await dispatch(
            setMoeaSearch({
              name: values.name,
              filterType: 'name',
              pageNo: 1,
              size: 5,
              order: 'asc,asc',
              orderBy: 'name,amount',
            })
          );
          navigate(`/searchmoea`);
        }
      }
    } catch (error) {
      dispatch(
        open({
          severity: severity.error,
          message: et('error'),
        })
      );
    }
  };

  return (
    <Container ref={addMOEARef} component="main" fixed>
      <Typography component="h6" className="header-title-h6" id="addMoeaTitle">
        {t('addMOEATitle')}
      </Typography>
      <Formik
        enableReinitialize
        initialValues={moeaInitialValues}
        onSubmit={onSubmit}
        validationSchema={moeaSchema(t)}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ isSubmitting, errors, isValidating }) => (
          <Form>
            <Grid container justifyContent="center">
              <MOEAForm errors={errors} isValidating={isValidating} />
            </Grid>
            <Grid container justifyContent="center">
              <Grid item>
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  id="save-button"
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
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default AddMOEA;
