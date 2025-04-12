/* eslint-disable max-depth */
import React, { useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Form, Formik, FormikProps } from 'formik';
import RenderWellsFields from '../wells/WellsFields';
import { useAppDispatch } from '../../store/hooks';
import { useTranslation } from 'react-i18next';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import * as Yup from 'yup';
import { UpdateWellData } from '../../interface/well';
import { wellSchema } from '../../schemas/wellSchema';
import {
  useDeleteWellMutation,
  useEditWellMutation,
  useLazyGetWellByWellIdQuery,
} from '../../store/Services/wellService';
import CustomSpinner from '../../component/common/CustomSpinner';
import CustomModel from '../../component/common/CustomModal';

const EditWell: React.FC = () => {
  const { t } = useTranslation('well');
  const { t: et } = useTranslation('errors');
  const { wellId } = useParams();
  const location = useLocation();
  const { deedID } = (location.state as { deedID: number }) || {};

  const [openModel, setOpenModel] = React.useState(false);
  const handleOpen = () => setOpenModel(true);
  const handleClose = () => setOpenModel(false);
  const [navigateToWellMaster, setNavigateToWellMaster] = React.useState(false);
  const formRef = useRef<FormikProps<HTMLFormElement>>(null);
  const [initialValues, setInitialValues] = React.useState<UpdateWellData>({
    wellId: Number(wellId),
    well: '',
    section: '',
    township: '',
    rangeSurvey: '',
    wellCounty: '',
    wellState: '',
    welldivint: '',
  });
  const [getWell, { data: wellData, isLoading: wellLoading, isFetching }] =
    useLazyGetWellByWellIdQuery();
  const [editWell] = useEditWellMutation();
  const [deleteWell] = useDeleteWellMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const errorCountyRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (wellId) {
      void getWell({ wellId: Number(wellId) });
    }
  }, [wellId, getWell]);
  React.useEffect(() => {
    if (wellData) {
      setInitialValues({
        wellId: wellData.data.wellID,
        well: wellData.data.well,
        section: wellData.data.sectionAB,
        township: wellData.data.townshipBlock,
        rangeSurvey: wellData.data.rangeSurvey,
        wellCounty: wellData.data.county,
        wellState: wellData.data.state,
        welldivint: wellData.data.divInterest,
      });
    }
  }, [wellData]);

  const onSubmit = async (values: UpdateWellData) => {
    if (!error) {
      try {
        const response = await editWell(values);
        if ('data' in response) {
          if (response?.data?.success) {
            dispatch(
              open({
                severity: severity.success,
                message: response?.data?.message,
              })
            );
            if (navigateToWellMaster) {
              navigate('/wellMaster/add', {
                state: {
                  deedID: Number(deedID),
                  wellID: Number(wellId),
                },
              });
            } else {
              navigate(`/division/edit/${wellData?.data.divOrderID}`, {
                state: {
                  from: 'well',
                  action: 'update',
                  id: wellId,
                },
              });
            }
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
    } else {
      errorCountyRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };
  const handleDelete = async () => {
    try {
      const response = await deleteWell({ wellId: Number(wellId) });
      if ('data' in response) {
        if (response?.data?.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          setOpenModel(false);
          navigate(`/division/edit/${wellData?.data.divOrderID}`);
        }
      } else if ('error' in response) {
        throw new Error();
      }
    } catch (error) {
      dispatch(
        open({
          severity: severity.error,
          message: 'unaccepted error occurred',
        })
      );
      setOpenModel(false);
    }
  };

  const handleSentToWellMaster = () => {
    setNavigateToWellMaster(true);
    if (formRef.current) {
      void formRef.current.submitForm();
    }
  };
  return (
    <Container component="main" fixed sx={{ marginTop: 2 }}>
      <Grid container sx={{ mt: 2, mb: 2 }}>
        <Typography component="h6" id="editWell" className="header-title-h6">
          {t('editWell')}
        </Typography>
      </Grid>
      {(wellLoading || isFetching) && (
        <CustomSpinner loadingText={t('fetchingWellData')} />
      )}
      {!wellLoading && (
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
                  <Grid container justifyContent="center" my={5} gap={1}>
                    <Grid item>
                      <Button
                        disabled={isSubmitting}
                        type="submit"
                        id="edit-well"
                        variant="outlined"
                        sx={{
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
                    <Grid item>
                      <Button
                        id="save-and-sendTo-wellMaster"
                        disabled={isSubmitting}
                        variant="outlined"
                        type="submit"
                        onClick={handleSentToWellMaster}
                        sx={{
                          ml: { xs: 0, sm: '1rem' },
                          '&:disabled': {
                            opacity: 0.2,
                            cursor: 'not-allowed',
                            backgroundColor: '#1997c6',
                            color: '#fff',
                          },
                        }}
                      >
                        {t('saveAndSendToWellMaster')}
                      </Button>
                    </Grid>

                    <Grid item>
                      <Button
                        id="delete-well"
                        variant="outlined"
                        sx={{
                          ml: { xs: 0, sm: '1rem' },
                          '&:disabled': {
                            opacity: 0.2,
                            cursor: 'not-allowed',
                            backgroundColor: '#1997c6',
                            color: '#fff',
                          },
                        }}
                        onClick={handleOpen}
                      >
                        {t('delete')}
                      </Button>
                    </Grid>
                    <CustomModel
                      open={openModel}
                      handleClose={handleClose}
                      handleDelete={handleDelete}
                      modalHeader="Delete Well"
                      modalTitle={t('deleteWarning')}
                      modalButtonLabel="Delete"
                    />
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

export default EditWell;
