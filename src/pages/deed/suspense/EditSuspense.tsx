import React, { useEffect, useRef, useState } from 'react';
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
  editSuspensePayload,
  suspenseValues,
} from '../../../interface/suspense';
import {
  useLazyGetSuspenseQuery,
  useUpdateSuspenseMutation,
} from '../../../store/Services/suspenseService';
import { suspenseSchema } from '../../../schemas/suspense';
import OverlayLoader from '../../../component/common/OverlayLoader';

interface LocationStateData {
  suspId: number;
  deedId: number;
}

const AddSuspense: React.FC = () => {
  const { t } = useTranslation('suspense');
  const { t: et } = useTranslation('errors');
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const location = useLocation();
  const updateSuspenseRef = useRef<HTMLInputElement>(null);
  const queryParams = new URLSearchParams(location.search);
  const suspId = Number(queryParams.get('suspId'));
  const deedId = Number(queryParams.get('deedId'));

  const suspenseInitialValues: suspenseValues = {
    suspId,
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

  const [suspenseValues, setSuspenseValues] = useState<suspenseValues>(
    suspenseInitialValues
  );

  const [updateSuspense] = useUpdateSuspenseMutation();

  const [loading, setLoading] = useState<boolean>(false);

  const [getSuspense, { data, isLoading, isFetching }] =
    useLazyGetSuspenseQuery();

  useEffect(() => {
    if (!suspId) {
      navigate('/');
    }
    void getSuspense({ suspId });
    setLoading(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !isFetching) {
      const suspenseData = data?.data || {};
      setSuspenseValues({
        ...suspenseValues,
        ...suspenseData,
      });
      setLoading(false);
    }
  }, [isLoading, isFetching]);

  const onSubmit = async (values: suspenseValues) => {
    try {
      const data: editSuspensePayload = {
        suspId,
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
      const response = await updateSuspense(data);
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
    <Container ref={updateSuspenseRef} component="main" fixed>
      <Typography
        id="editSuspense"
        variant="h4"
        component="p"
        gutterBottom
        className="header-title-h4"
      >
        {t('updateSuspenseTitle')}
      </Typography>
      {loading || isFetching ? (
        <OverlayLoader open />
      ) : (
        <Formik
          enableReinitialize
          initialValues={suspenseValues}
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
      )}
    </Container>
  );
};

export default AddSuspense;
