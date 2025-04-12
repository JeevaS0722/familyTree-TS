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
import * as Yup from 'yup';
import RenderRecordingFields from './RecordingFields';
import { UpdateRecordingDetailsData } from '../../interface/recording';
import { recordingSchema } from '../../schemas/recording';
import {
  useDeleteRecordingMutation,
  useEditRecordingMutation,
  useLazyGetRecordingByRecIdQuery,
} from '../../store/Services/recordingService';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import { formatDateByMonth } from '../../utils/GeneralUtil';
import OverlayLoader from '../../component/common/OverlayLoader';
import CustomModel from '../../component/common/CustomModal';
import { deleteRecordingTitle } from '../../utils/constants';
import Stack from '@mui/material/Stack';

const initialValue: UpdateRecordingDetailsData = {
  recId: 0,
  documentType: '',
  county: '',
  state: '',
  dateSent: '',
  dateReturn: '',
  book: '',
  page: '',
};
const EditRecording: React.FC = () => {
  const { t } = useTranslation('recording');
  const { recId } = useParams();
  const [recordingDetails, setRecordingDetails] = React.useState(initialValue);
  const [isLoading, setIsLoading] = React.useState(true);
  const [updateRecording] = useEditRecordingMutation();
  const [deleteRecording] = useDeleteRecordingMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [getRecording, { data: recordingData }] =
    useLazyGetRecordingByRecIdQuery();
  const [error, setError] = useState<string>('');
  const errorCountyRef = React.useRef<HTMLDivElement>(null);
  const [openModel, setOpenModel] = React.useState(false);
  const handleOpen = () => setOpenModel(true);
  const handleClose = () => setOpenModel(false);

  React.useEffect(() => {
    if (recId) {
      void getRecording({ recId: Number(recId) });
    }
  }, [getRecording, recId]);
  React.useEffect(() => {
    if (recordingData && recordingData?.data) {
      setRecordingDetails({
        recId: recordingData.data.recID,
        documentType: recordingData.data.documentType,
        county: recordingData.data.county,
        state: recordingData.data.state,
        dateSent: recordingData.data.dateSent
          ? formatDateByMonth(recordingData.data.dateSent.toString()).toString()
          : null,
        dateReturn: recordingData.data.dateReturn
          ? formatDateByMonth(
              recordingData.data.dateReturn.toString()
            ).toString()
          : null,
        book: recordingData.data.book,
        page: recordingData.data.page,
      });
    }
    setIsLoading(false);
  }, [recordingData, recId]);
  const onSubmit = async (
    values: UpdateRecordingDetailsData,
    actions: FormikHelpers<UpdateRecordingDetailsData>
  ) => {
    if (!error) {
      try {
        const data = {
          recId: Number(recId),
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
        const response = await updateRecording(data);
        if ('data' in response) {
          if (response?.data?.success) {
            actions.resetForm();
            dispatch(
              open({
                severity: severity.success,
                message: response?.data?.message,
              })
            );
            navigate(`/editdeed/${recordingData?.data?.deedID}?tab=recording`);
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

  const handleDelete = async () => {
    try {
      const response = await deleteRecording({ recId: Number(recId) });

      if ('data' in response) {
        if (response?.data?.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          setOpenModel(false);
          navigate(`/editdeed/${recordingData?.data?.deedID}?tab=recording`);
        }
      }
    } catch (error) {
      dispatch(
        open({
          severity: severity.error,
          message: 'unaccepted error occurred',
        })
      );
    }
  };
  return (
    <Container component="main" fixed sx={{ marginTop: 2 }}>
      <Grid container sx={{ mt: 2, mb: 2, justifyContent: 'center' }}>
        <Typography
          id="editRecording"
          variant="h4"
          component="p"
          gutterBottom
          className="header-title-h4"
        >
          {t('editRecording')}
        </Typography>
      </Grid>
      <Formik
        initialValues={recordingDetails}
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
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              gap={1}
            >
              {isLoading ? (
                <OverlayLoader open />
              ) : (
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
                      sx={{
                        marginTop: '10px !important',
                        justifyContent: 'center',
                        width: '100% !important',
                        paddingLeft: '16px',
                      }}
                    >
                      <Grid
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '20px',
                        }}
                      >
                        <Button
                          disabled={isSubmitting}
                          type="submit"
                          id="edit-recording"
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

                        <Button
                          disabled={isSubmitting}
                          id="delete-recording"
                          variant="outlined"
                          onClick={handleOpen}
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
                          {t('deleteRecording')}
                        </Button>
                      </Grid>
                    </Grid>
                    <CustomModel
                      open={openModel}
                      handleClose={handleClose}
                      handleDelete={handleDelete}
                      modalHeader={t('deleteRecording')}
                      modalTitle={deleteRecordingTitle}
                      modalButtonLabel={t('delete')}
                    />
                  </Grid>
                </Box>
              )}
            </Stack>
          </Form>
        )}
      </Formik>
    </Container>
  );
};
export default EditRecording;
