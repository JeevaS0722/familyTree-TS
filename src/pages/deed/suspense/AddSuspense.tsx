import React, { useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { Form, Formik } from 'formik';
import { useAppDispatch } from '../../../store/hooks';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { open } from '../../../store/Reducers/snackbar';
import { severity } from '../../../interface/snackbar';
import SuspenseForm from './SuspenseForm';
import {
  addSuspensePayload,
  suspenseValues,
} from '../../../interface/suspense';
import { useAddSuspenseMutation } from '../../../store/Services/suspenseService';
import { suspenseSchema } from '../../../schemas/suspense';

interface LocationStateData {
  deedId: number;
}

const AddSuspense: React.FC = () => {
  const { t } = useTranslation('suspense');
  const { t: et } = useTranslation('errors');
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const location = useLocation();
  const addSuspenseRef = useRef<HTMLInputElement>(null);
  const { deedId } = (location.state as LocationStateData) || {};

  const suspenseInitialValues: suspenseValues = {
    deedId,
    suspType: 'Suspense',
    stateCo: '',
    amount: null,
    suspStart: '',
    suspEnd: '',
    claimDate: '',
    subClaim: false,
    rcvdFunds: false,
    contactName: '',
    contactPhone: '',
  };

  const [addSuspense] = useAddSuspenseMutation();

  useEffect(() => {
    if (!deedId) {
      navigate('/');
    }
  }, []);

  const onSubmit = async (values: suspenseValues) => {
    try {
      const data: addSuspensePayload = {
        deedId,
        suspType: values.suspType,
        stateCo: values.stateCo,
        amount: values.amount,
        suspStart: values.suspStart,
        suspEnd: values.suspEnd,
        claimDate: values.claimDate,
        subClaim: values.subClaim,
        rcvdFunds: values.rcvdFunds,
        contactName: values.contactName,
        contactPhone: values.contactPhone,
      };
      const response = await addSuspense(data);
      if ('data' in response) {
        if (response?.data?.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          navigate(`/editDeed/${deedId}?tab=suspense`);
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

  const validateForm = (values: suspenseValues) => {
    const errors: Partial<suspenseValues> = {};
    if (!values.stateCo) {
      errors.stateCo = t('stateCoRequired');
    }

    return errors;
  };

  return (
    <Container ref={addSuspenseRef} component="main" fixed>
      <Typography
        id="addSuspense"
        variant="h4"
        component="p"
        gutterBottom
        className="header-title-h4"
      >
        {t('addSuspenseTitle')}
      </Typography>
      <Formik
        enableReinitialize
        initialValues={suspenseInitialValues}
        onSubmit={onSubmit}
        validationSchema={suspenseSchema(t)}
        validateOnBlur={false}
        validateOnChange={false}
        validate={validateForm}
      >
        {({ isSubmitting, errors, isValidating }) => (
          <Form>
            <Grid container justifyContent="center">
              <SuspenseForm errors={errors} isValidating={isValidating} />
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

export default AddSuspense;
