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
import RecycleForm from './RecycleForm';
import { recyclePayload, recycleValues } from '../../interface/recycle';
import { useRecycleMutation } from '../../store/Services/fileService';

interface LocationStateData {
  fileId: number;
  fileName: string;
}

const Recycle: React.FC = () => {
  const { t } = useTranslation('recycle');
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const location = useLocation();
  const recycleRef = useRef<HTMLInputElement>(null);
  const { fileId, fileName } = (location.state as LocationStateData) || {};

  const recycleInitialValues: recycleValues = {
    memo: 'Sent to Recycling',
    reason: '',
  };

  const [recycle] = useRecycleMutation();

  useEffect(() => {
    if (!fileId) {
      navigate('/');
    }
  }, []);

  const onSubmit = async (values: recycleValues) => {
    try {
      const data: recyclePayload = {
        fileId,
        memo: values.memo,
        reason: values.reason,
      };
      const response = await recycle(data);
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
      return error;
    }
  };

  return (
    <Container ref={recycleRef} component="main" fixed>
      <Typography
        component="h3"
        sx={{
          display: 'block',
          fontWeight: 'normal',
          marginBottom: '5px',
          marginTop: '5px',
          fontSize: '24px',
          letterSpacing: '1px',
        }}
      >
        {`${t('recycleTitle')} - ${fileName}`}
      </Typography>
      <Formik
        enableReinitialize
        initialValues={recycleInitialValues}
        onSubmit={onSubmit}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ isSubmitting }) => (
          <Form>
            <Grid container justifyContent="center">
              <RecycleForm />
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
                  {t('recycleButton')}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default Recycle;
