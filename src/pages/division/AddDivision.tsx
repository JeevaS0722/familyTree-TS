import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useCreateDivisionMutation } from '../../store/Services/divisionService';
import { useAppDispatch } from '../../store/hooks';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import RenderDivisionFields from './DivisionFields';
import { CreateDivisionInitialValues } from '../../interface/division';
import RenderWellsFields from '../wells/WellsFields';
import {
  divisionValidationSchema,
  DivOrderwellSchema,
} from '../../schemas/division';

import * as Yup from 'yup';

const AddDivision: React.FC = () => {
  const { t } = useTranslation('division');
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [createDivision] = useCreateDivisionMutation();
  const [error, setError] = useState<string>('');
  const errorCountyRef = React.useRef<HTMLDivElement>(null);

  const [initialValues] = useState<CreateDivisionInitialValues>({
    operId: null,
    notified: false,
    notice1Date: '',
    notice2Date: '',
    notice3Date: '',
    dorcvd: false,
    donate: '',
    well: '',
    section: '',
    township: '',
    rangeSurvey: '',
    wellCounty: '',
    wellState: '',
    welldivint: '',
    referenceId: '',
  });

  const onSubmit = async (values: CreateDivisionInitialValues) => {
    if (!error) {
      try {
        const divisionDetails = {
          ...values,
          fileId: Number(location.state.fileId),
          contactId: Number(location.state.contactId),
          deedId: Number(location.state.deedId),
        };
        const response = await createDivision(divisionDetails);
        if ('data' in response) {
          if (response?.data?.success) {
            dispatch(
              open({
                severity: severity.success,
                message: response?.data?.message,
              })
            );
            navigate(`/editdeed/${Number(location.state.deedId)}?tab=division`);
          }
        }
      } catch (e) {
        // console.error(e);
      }
    } else {
      errorCountyRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const combinedValidationSchema = Yup.object().shape({
    ...divisionValidationSchema(t).fields,
    ...DivOrderwellSchema(t).fields,
  });
  return (
    <Container component="main" fixed sx={{ mt: 2 }}>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        enableReinitialize
        validationSchema={combinedValidationSchema}
        validate={values => {
          try {
            divisionValidationSchema(t).validateSync(values, {
              abortEarly: false,
            });
            DivOrderwellSchema(t).validateSync(values, { abortEarly: false });
          } catch (error) {
            if (
              error instanceof Yup.ValidationError &&
              error.inner.length > 0
            ) {
              setTimeout(() => {
                const errorElement = document.querySelector(
                  `[id="${error.inner[0].path}"]`
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
        {({ isSubmitting, values, errors }) => (
          <Form>
            <Grid item xs={12}>
              <Typography
                variant="h4"
                component="p"
                gutterBottom
                sx={{
                  color: 'white',
                  fontSize: '24px',
                  textAlign: 'center',
                }}
                id="add-division-title"
              >
                {t('title')}
              </Typography>
            </Grid>
            <Grid container alignItems="center" sx={{ mt: 2 }}>
              {RenderDivisionFields(t, '', errors)}
            </Grid>
            <Grid container alignItems="center" sx={{ mt: 2 }}>
              {RenderWellsFields(
                t,
                values.wellState,
                error,
                setError,
                errorCountyRef
              )}
            </Grid>
            <Grid
              container
              item
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 2,
              }}
            >
              <Typography
                sx={{
                  textAlign: 'center',
                }}
                id="additionalWellsNoteLabel"
              >
                {t('additionalWellsNote')}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 5,
                marginBottom: 5,
              }}
            >
              <Button
                type="submit"
                variant="outlined"
                id="add-division-button"
                disabled={isSubmitting}
                sx={{
                  whiteSpace: 'nowrap',
                  '&:disabled': {
                    opacity: 0.2,
                    cursor: 'not-allowed',
                    borderColor: '#1997c6',
                    color: '#fff',
                  },
                }}
              >
                {t('saveButton')}
              </Button>
            </Grid>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default AddDivision;
