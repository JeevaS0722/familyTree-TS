import React, { useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Form, Formik } from 'formik';
import { useAppDispatch } from '../../store/hooks';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import TicklerForm from './TicklerForm';
import { ticklerPayload, ticklerValues } from '../../interface/tickler';
import { useTicklerMutation } from '../../store/Services/fileService';
import { getCurrentDate } from '../../utils/GeneralUtil';
import { ticklerSchema } from '../../schemas/tickler';

interface LocationStateData {
  fileId: number;
  contacts: number[];
}

const Tickler: React.FC = () => {
  const { t } = useTranslation('tickler');
  const { t: et } = useTranslation('errors');
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const location = useLocation();
  const ticklerRef = useRef<HTMLInputElement>(null);
  const { fileId, contacts } = (location.state as LocationStateData) || {};

  const ticklerInitialValues: ticklerValues = {
    memo: `Ticklered for ${getCurrentDate('MM/DD/YYYY')}`,
    ticklerDate: getCurrentDate(),
  };

  const [tickler] = useTicklerMutation();

  useEffect(() => {
    if (!fileId) {
      navigate('/');
    }
  }, []);

  const onSubmit = async (values: ticklerValues) => {
    try {
      const data: ticklerPayload = {
        fileId,
        memo: values.memo,
        ticklerDate: values.ticklerDate,
        contacts,
      };
      const response = await tickler(data);
      if ('data' in response) {
        if (response?.data?.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          navigate(`/editFile/${fileId}?tab=notes`, {
            state: 'data' in response.data ? response.data.data : response.data,
          });
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

  const validateForm = (values: ticklerValues) => {
    const errors: Partial<ticklerValues> = {};
    if (!values.ticklerDate) {
      errors.ticklerDate = t('ticklerDateRequired');
    }

    return errors;
  };

  return (
    <Container ref={ticklerRef} component="main" fixed>
      <Typography component="h3" className="header-title-h3">
        {t('ticklerTitle')}
      </Typography>
      <Formik
        enableReinitialize
        initialValues={ticklerInitialValues}
        onSubmit={onSubmit}
        validationSchema={ticklerSchema(t)}
        validateOnBlur={false}
        validateOnChange={false}
        validate={validateForm}
      >
        {({ isSubmitting, errors, isValidating }) => (
          <Form>
            <Grid container justifyContent="center">
              <TicklerForm errors={errors} isValidating={isValidating} />
            </Grid>
            <Grid container>
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
                  {t('ticklerButton')}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default Tickler;
