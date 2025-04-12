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
import RenderRecordingFields from './RecordingFields';
import { RecordingDetailsData } from '../../interface/recording';
import { recordingSchema } from '../../schemas/recording';
import { useCreateRecordingMutation } from '../../store/Services/recordingService';
import { formatDateByMonth } from '../../utils/GeneralUtil';

const initialValue: RecordingDetailsData = {
  deedId: 0,
  documentType: '',
  county: '',
  state: '',
  dateSent: '',
  dateReturn: '',
  book: '',
  page: '',
};
const AddRecording: React.FC = () => {
  const { t } = useTranslation('recording');
  const { deedId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [createRecording] = useCreateRecordingMutation();
  const [error, setError] = useState<string>('');
  const errorCountyRef = React.useRef<HTMLDivElement>(null);

  const onSubmit = async (
    values: RecordingDetailsData,
    actions: FormikHelpers<RecordingDetailsData>
  ) => {
    if (!error) {
      try {
        const data = {
          deedId: Number(deedId),
          documentType: values.documentType,
          county: values.county,
          state: values.state,
          dateSent: values?.dateSent
            ? formatDateByMonth(values?.dateSent.toString()).toString()
            : null,
          dateReturn: values?.dateReturn
            ? formatDateByMonth(values?.dateReturn.toString()).toString()
            : null,
          book: values.book,
          page: values.page,
        };
        const response = await createRecording(data);
        if ('data' in response) {
          if (response?.data?.success) {
            actions.resetForm();
            dispatch(
              open({
                severity: severity.success,
                message: response?.data?.message,
              })
            );
            navigate(`/editdeed/${deedId}?tab=recording`);
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
          id="newRecording"
          variant="h4"
          component="p"
          gutterBottom
          className="header-title-h4"
        >
          {t('newRecording')}
        </Typography>
      </Grid>
      <Formik
        initialValues={initialValue}
        enableReinitialize={true}
        validationSchema={recordingSchema(t)}
        onSubmit={onSubmit}
        validateOnBlur={false}
        validateOnChange={false}
        validate={values => {
          try {
            recordingSchema(t).validateSync(values, {
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
              <Grid container spacing={{ xs: 2, md: 2 }}>
                {RenderRecordingFields(
                  t,
                  values.state,
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
                    id="save-recording"
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

export default AddRecording;
