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
import RecycleForm from './DeadFileForm';
import { deadFilePayload, deadFileValues } from '../../interface/deadFile';
import { useDeadFileMutation } from '../../store/Services/fileService';

interface LocationStateData {
  fileId: number;
  fileName: string;
  paperFile?: boolean | null;
}

const DeadFile: React.FC = () => {
  const { t } = useTranslation('deadFile');
  const { t: et } = useTranslation('errors');
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const location = useLocation();
  const deadFileRef = useRef<HTMLInputElement>(null);
  const { fileId, fileName, paperFile } =
    (location.state as LocationStateData) || {};

  const deadFileInitialValues: deadFileValues = {
    memo: 'Dead File',
    reason: '',
  };

  const [deadFile] = useDeadFileMutation();

  useEffect(() => {
    if (!fileId) {
      navigate('/');
    }
  }, []);

  const onSubmit = async (values: deadFileValues) => {
    try {
      const data: deadFilePayload = {
        fileId,
        memo: values.memo,
        reason: values.reason,
      };
      const response = await deadFile(data);
      if ('data' in response) {
        if (response?.data?.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          const navURL = paperFile
            ? `/editFile/${fileId}?tab=tasks`
            : `/editFile/${fileId}?tab=notes`;
          navigate(navURL, {
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
    <Container ref={deadFileRef} component="main" fixed>
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
        {`${t('deadFileTitle')} - ${fileName}`}
      </Typography>
      <Formik
        enableReinitialize
        initialValues={deadFileInitialValues}
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
                  {t('deadFileButton')}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default DeadFile;
