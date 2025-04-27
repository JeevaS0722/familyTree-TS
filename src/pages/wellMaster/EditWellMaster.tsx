import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import RenderWellMasterFields from './WellMasterField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Form, Formik } from 'formik';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import * as Yup from 'yup';
import { UpdateWellMasterInitialValues } from '../../interface/wellMaster';
import { useLazyGetOperatorByIdQuery } from '../../store/Services/operatorService';
import { wellMasterSchema } from '../../schemas/wellMasterSchema';
import { interTypes } from '../../utils/constants';
import { SectionOption } from '../../interface/common';
import {
  useDeleteWellMasterMutation,
  useLazyGetWellMasterByWellIDQuery,
  useUpdateWellMasterMutation,
} from '../../store/Services/wellMasterService';
import CustomModel from '../../component/common/CustomModal';
import { setSearchFilter } from '../../store/Reducers/searchReducer';
import OverlayLoader from '../../component/common/OverlayLoader';
import CustomWarningModel from '../../component/common/CustomWarningModal';
import CircularProgress from '@mui/material/CircularProgress';

interface CustomModelState {
  type: string | null;
  open: boolean;
}

const EditWellMaster: React.FC = () => {
  const { t } = useTranslation('wellMaster');
  const { t: et } = useTranslation('errors');
  const { wellID } = useParams();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = useState<string>('');
  const [operatorName, setOperatorName] = useState<string>('');
  const [payorName, setPayorName] = useState<string>('');

  const [editWellMaster] = useUpdateWellMasterMutation();
  const [deleteWellMaster] = useDeleteWellMasterMutation();
  const errorCountyRef = React.useRef<HTMLDivElement>(null);
  const [openModel, setOpenModel] = React.useState(false);
  const [openCustomModel, setOpenCustomModel] =
    React.useState<CustomModelState>({
      type: null,
      open: false,
    });
  const handleOpen = () => setOpenModel(true);
  const handleClose = () => setOpenModel(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [interestTypesOptions] = React.useState<SectionOption[]>(interTypes);
  const [initialValues, setInitialValues] =
    React.useState<UpdateWellMasterInitialValues>({
      wellID: Number(wellID),
      wellName: '',
      api: '',
      book: '',
      page: '',
      county: '',
      state: '',
      sectionAB: '',
      townshipBlock: '',
      rangeSurvey: '',
      quarters: '',
      acres: null,
      nma: null,
      interest: '',
      payorID: null,
      operatorID: null,
      type: '',
      fileName: '',
    });

  const [
    getWellMaster,
    { data: wellMasterData, isLoading: isWellMasterLoading },
  ] = useLazyGetWellMasterByWellIDQuery();
  const [getOperator, { data: operatorData, isLoading: isOperatorLoading }] =
    useLazyGetOperatorByIdQuery();
  const [getpayor, { data: payorData, isLoading: isPayorLoading }] =
    useLazyGetOperatorByIdQuery();
  const [quarters, setQuarters] = useState('');
  React.useEffect(() => {
    if (wellID) {
      void getWellMaster({ wellID: Number(wellID) });
    }
  }, [wellID, getWellMaster]);

  React.useEffect(() => {
    if (wellMasterData) {
      setInitialValues({
        wellID: wellMasterData.data.wellID,
        wellName: wellMasterData.data.wellName,
        api: wellMasterData.data.api,
        state: wellMasterData.data.state,
        county: wellMasterData.data.county,
        sectionAB: wellMasterData.data.sectionAB,
        townshipBlock: wellMasterData.data.townshipBlock ?? '',
        rangeSurvey: wellMasterData.data.rangeSurvey ?? '',
        quarters: wellMasterData.data.quarters,
        acres: wellMasterData.data.acres,
        nma: wellMasterData.data.nma,
        interest: wellMasterData.data.interest,
        type: wellMasterData.data.type,
        book: wellMasterData.data.book,
        page: wellMasterData.data.page,
        payorID: wellMasterData.data.payorID ?? '',
        operatorID: wellMasterData.data.operatorID ?? '',
        fileName: wellMasterData.data.fileName,
      });
      setQuarters(wellMasterData?.data?.quarters);
    }
  }, [wellMasterData]);

  React.useEffect(() => {
    const { operatorID, payorID } = wellMasterData?.data || {};

    if (operatorID) {
      void getOperator({ operatorId: operatorID });
    }
    if (payorID) {
      void getpayor({ operatorId: payorID });
    }
  }, [getOperator, getpayor, wellMasterData]);

  React.useEffect(() => {
    if (wellMasterData?.data?.operatorID && operatorData) {
      const operator = operatorData.data;
      const { operatorID } = wellMasterData?.data || {};
      if (operator.operatorID === operatorID) {
        const operatorNameStr = `${operator?.companyName || ''}${
          operator?.contactName ? ` - ${operator.contactName}` : ''
        }`;
        setOperatorName(operatorNameStr);
      }
    } else {
      setOperatorName('');
    }

    if (wellMasterData?.data?.payorID && payorData) {
      const payor = payorData.data;
      const { payorID } = wellMasterData?.data || {};
      if (payor.operatorID === payorID) {
        const payorNameStr = `${payor?.companyName || ''}${
          payor?.contactName ? ` - ${payor.contactName}` : ''
        }`;
        setPayorName(payorNameStr);
      }
    } else {
      setPayorName('');
    }
  }, [operatorData, payorData, wellMasterData]);
  const onSubmit = async (
    values: UpdateWellMasterInitialValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    if (!error) {
      if (
        initialValues.payorID !== values.payorID &&
        initialValues.operatorID !== values.operatorID
      ) {
        setSubmitting(false);
        setOpenCustomModel({ type: 'operator_payor_change', open: true });
        return;
      }
      if (initialValues.payorID !== values.payorID) {
        setSubmitting(false);
        setOpenCustomModel({ type: 'payor_change', open: true });
        return;
      }
      if (initialValues.operatorID !== values.operatorID) {
        setSubmitting(false);
        setOpenCustomModel({ type: 'operator_change', open: true });
        return;
      }
      try {
        await onUpdate(values, setSubmitting);
      } catch (error) {
        // console.error('Error updating well:', error);
      }
    } else {
      errorCountyRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteWellMaster({ wellID: Number(wellID) });
      if ('data' in response) {
        if (response?.data?.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          setOpenModel(false);
          dispatch(
            setSearchFilter({
              tableId: 'searchWellMastersTable',
              filters: {
                searchBy: 'wellName',
                textSearch: initialValues.wellName,
              },
            })
          );
          navigate(`/searchwellmasters`);
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
  React.useEffect(() => {
    if (!isWellMasterLoading && !isOperatorLoading && !isPayorLoading) {
      setIsLoading(false);
    }
  }, [isWellMasterLoading, isOperatorLoading, isPayorLoading]);

  const onUpdate = async (
    values: UpdateWellMasterInitialValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    try {
      const data = {
        ...values,
        payorID: values.payorID || null,
        operatorID: values.operatorID || null,
      };

      const response = await editWellMaster(data);
      if ('data' in response && response?.data?.success) {
        dispatch(
          open({ severity: severity.success, message: response?.data?.message })
        );
        dispatch(
          setSearchFilter({
            tableId: 'searchWellMastersTable',
            filters: { searchBy: 'wellName', textSearch: values.wellName },
          })
        );
        navigate(`/searchwellmasters`);
      }
    } catch (error) {
      dispatch(open({ severity: severity.error, message: et('error') }));
    } finally {
      setSubmitting(false);
    }
  };

  const applyToAll = async (
    values: UpdateWellMasterInitialValues,
    setSubmitting: (isSubmitting: boolean) => void,
    type: string | null
  ) => {
    setSubmitting(true);
    setOpenCustomModel({ type: null, open: false });

    // Determine which flags to set based on the type
    const updateFlags: Partial<UpdateWellMasterInitialValues> = {};
    if (type === 'payor_change') {
      updateFlags.updateToAllAssociatedPayor = true;
    } else if (type === 'operator_change') {
      updateFlags.updateToAllAssociatedOperator = true;
    } else if (type === 'operator_payor_change') {
      updateFlags.updateToAllAssociatedPayor = true;
      updateFlags.updateToAllAssociatedOperator = true;
    }

    try {
      await onUpdate({ ...values, ...updateFlags }, setSubmitting);
    } catch (error) {
      // console.error('Error updating all operators:', error);
    }
  };

  const onWarningClose = async (
    values: UpdateWellMasterInitialValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    setSubmitting(true);
    setOpenCustomModel({ type: null, open: false });

    try {
      await onUpdate(values, setSubmitting);
    } catch (error) {
      // console.error('Error updating operator:', error);
    }
  };

  return (
    <Container component="main" fixed sx={{ marginTop: 2 }}>
      <Grid container sx={{ mt: 2, mb: 2 }}>
        <Typography
          component="h6"
          id="EditWellMaster"
          className="header-title-h6"
        >
          {t('editWellMaster')}
        </Typography>
      </Grid>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={wellMasterSchema(t)}
        onSubmit={(values, { setSubmitting }) =>
          onSubmit(values, setSubmitting)
        }
        validateOnBlur={false}
        validateOnChange={false}
        validate={values => {
          try {
            wellMasterSchema(t).validateSync(values, {
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
        {({ isSubmitting, values, setSubmitting }) => (
          <Form>
            {isLoading ? (
              <OverlayLoader open />
            ) : (
              <Box>
                <Grid>
                  {RenderWellMasterFields(
                    t,
                    values.state,
                    error,
                    setError,
                    errorCountyRef,
                    interestTypesOptions,
                    operatorName,
                    null,
                    payorName,
                    quarters,
                    wellID
                  )}
                  <Grid container justifyContent="center" my={5} gap={1}>
                    <Grid item>
                      <Button
                        disabled={isSubmitting}
                        type="submit"
                        id="edit-wellMaster"
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
                        {isSubmitting ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          t('save')
                        )}
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        disabled={isSubmitting}
                        id="delete-wellMaster"
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
                      modalHeader="Delete WellMaster"
                      modalTitle={t('deleteWarning')}
                      modalButtonLabel="Delete"
                    />
                    {openCustomModel?.open &&
                      (openCustomModel.type === 'operator_change' ||
                        openCustomModel.type === 'payor_change' ||
                        openCustomModel.type === 'operator_payor_change') && (
                        <CustomWarningModel
                          open={!!openCustomModel?.open}
                          onClose={() =>
                            setOpenCustomModel({ type: null, open: false })
                          }
                          modalHeader={
                            openCustomModel.type === 'operator_change'
                              ? 'Change Operator'
                              : openCustomModel.type === 'payor_change'
                                ? 'Change Payor'
                                : 'Change Operator and Payor'
                          }
                          modalTitle={
                            openCustomModel.type === 'operator_change'
                              ? t('applyToAllWellOperator')
                              : openCustomModel.type === 'payor_change'
                                ? t('applyToAllWellPayor')
                                : t('applyToAllWellOperatorAndPayor')
                          }
                          buttons={[
                            {
                              label: 'Cancel',
                              onClick: () =>
                                setOpenCustomModel({ type: null, open: false }),
                              variant: 'outlined',
                              color: 'secondary',
                            },
                            {
                              label: 'Update This Well Only',
                              onClick: () =>
                                onWarningClose(values, setSubmitting),
                              variant: 'outlined',
                              color: 'secondary',
                            },
                            {
                              label: 'Update All Wells',
                              onClick: () =>
                                applyToAll(
                                  values,
                                  setSubmitting,
                                  openCustomModel.type
                                ),
                              variant: 'outlined',
                              color: 'secondary',
                            },
                          ]}
                        />
                      )}
                  </Grid>
                </Grid>
              </Box>
            )}
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default EditWellMaster;
