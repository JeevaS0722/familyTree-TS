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
import AskResearchForm from './AskResearchForm';
import {
  askResearchPayload,
  askResearchValues,
} from '../../interface/askResearch';
import { useAskResearchMutation } from '../../store/Services/fileService';

interface LocationStateData {
  fileId: number;
  fileName: string;
}

const AskResearch: React.FC = () => {
  const { t } = useTranslation('askResearch');
  const { t: et } = useTranslation('errors');
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const location = useLocation();
  const askResearchRef = useRef<HTMLInputElement>(null);
  const { fileId, fileName } = (location.state as LocationStateData) || {};

  const askResearchInitialValues: askResearchValues = {
    memo: '',
    priority: 'High',
  };

  const [askResearch] = useAskResearchMutation();

  useEffect(() => {
    if (!fileId) {
      navigate('/');
    }
  }, []);

  const onSubmit = async (values: askResearchValues) => {
    try {
      const data: askResearchPayload = {
        fileId,
        memo: values.memo,
        priority: values.priority,
      };
      const response = await askResearch(data);
      if ('data' in response) {
        if (response?.data?.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          navigate(`/editFile/${fileId}?tab=tasks`, {
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

  return (
    <Container ref={askResearchRef} component="main" fixed>
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
        {`${t('askResearchTitle')} - ${fileName}`}
      </Typography>
      <Formik
        enableReinitialize
        initialValues={askResearchInitialValues}
        onSubmit={onSubmit}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ isSubmitting }) => (
          <Form>
            <Grid container>
              <AskResearchForm />
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
                  {t('askResearchButton')}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default AskResearch;
