import React, { useEffect, useRef, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Form, Formik } from 'formik';
import { useAppDispatch } from '../../store/hooks';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import MOEAForm from './MoeaForm';
import {
  deleteMOEAPayload,
  editMOEAPayload,
  moeaValues,
} from '../../interface/moea';
import {
  useDeleteMOEAMutation,
  useLazyGetMOEAQuery,
  useUpdateMOEAMutation,
} from '../../store/Services/moeaService';
import { moeaSchema } from '../../schemas/moea';
import CustomModel from '../../component/common/CustomModal';
import { setMoeaSearch } from '../../store/Reducers/searchMoea';
import Box from '@mui/material/Box';
import OverlayLoader from '../../component/common/OverlayLoader';

interface LocationStateData {
  moeaId: number;
}

const AddMOEA: React.FC = () => {
  const { t } = useTranslation('moea');
  const { t: et } = useTranslation('errors');
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const updateMOEARef = useRef<HTMLInputElement>(null);
  const { moeaId } = useParams();
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

  const [moeaValues, setMoeaValues] = useState<moeaValues>(moeaInitialValues);

  const [updateMOEA] = useUpdateMOEAMutation();

  const [getMOEA, { data, isLoading, isFetching }] = useLazyGetMOEAQuery();

  useEffect(() => {
    if (!moeaId) {
      navigate('/');
    }
    void getMOEA({ moeaId: Number(moeaId) });
  }, []);

  useEffect(() => {
    if (!isLoading && !isFetching) {
      const moeaData = data?.data || {};
      setMoeaValues({
        ...moeaValues,
        ...moeaData,
      });
    }
  }, [isLoading, isFetching]);

  const [deleteMoea] = useDeleteMOEAMutation();

  const [deleting, setDeleting] = useState<boolean>(false);

  const [openModel, setOpenModel] = useState<boolean>(false);

  const handleClose = () => {
    setOpenModel(false);
    setDeleting(false);
  };

  const handleOpen = () => {
    setOpenModel(true);
    setDeleting(true);
  };

  const handleDelete = async () => {
    try {
      const data: deleteMOEAPayload = {
        moeaId: Number(moeaId),
      };
      const response = await deleteMoea(data);
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
              name: moeaValues.name,
              filterType: 'name',
              pageNo: 1,
              size: 5,
              order: 'asc,asc',
              orderBy: 'name,amount',
            })
          );
          navigate('/searchmoea');
        }
      }
      setDeleting(false);
      setOpenModel(false);
    } catch (error) {
      dispatch(
        open({
          severity: severity.error,
          message: et('error'),
        })
      );
      setDeleting(false);
      setOpenModel(false);
    }
  };

  const onSubmit = async (values: moeaValues) => {
    try {
      const data: editMOEAPayload = {
        moeaId: Number(moeaId),
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
      const response = await updateMOEA(data);
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
          navigate('/searchmoea');
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
    <Container ref={updateMOEARef} component="main" fixed>
      {isLoading ? (
        <OverlayLoader open />
      ) : (
        <Box>
          <Typography
            component="h6"
            id="editMoeaTitle"
            className="header-title-h6"
          >
            {t('updateMOEATitle')}
          </Typography>
          <Formik
            enableReinitialize
            initialValues={moeaValues}
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
                      {t('saveMoeaButton')}
                    </Button>
                  </Grid>
                  <Grid item ml={2}>
                    <Button
                      disabled={deleting || isSubmitting}
                      onClick={handleOpen}
                      id="delete-button"
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
                      {t('deleteMoeaButton')}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
          <CustomModel
            open={openModel}
            handleClose={handleClose}
            handleDelete={handleDelete}
            modalHeader={t('deleteAlertTitle')}
            modalTitle={t('deleteAlertText')}
            modalButtonLabel={t('delete')}
          />
        </Box>
      )}
    </Container>
  );
};

export default AddMOEA;
