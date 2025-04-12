import React from 'react';
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
import TaxFields from './TaxFields';
import { taxSchema } from '../../schemas/tax';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import { formatDateByMonth } from '../../utils/GeneralUtil';
import { EditTaxForm } from '../../interface/tax';
import {
  useEditTaxMutation,
  useLazyGetTaxDetailsQuery,
  useDeleteTaxMutation,
} from '../../store/Services/taxService';
import CustomModel from '../../component/common/CustomModal';
import { deleteTaxTitle } from '../../utils/constants';
import OverlayLoader from '../../component/common/OverlayLoader';

const initialValue: EditTaxForm = {
  taxID: 0,
  taxingEntity: '',
  county: '',
  state: 'TX',
  amountDue: '',
  datePaid: null,
  rcvd: false,
  taxEnd: null,
  taxStart: null,
};
const EditTax: React.FC = () => {
  const { t } = useTranslation('tax');
  const { taxId } = useParams();
  const [taxDetails, setTaxDetails] = React.useState(initialValue);
  const [isLoading, setIsLoading] = React.useState(true);
  const [updateTax] = useEditTaxMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [openModel, setOpenModel] = React.useState(false);
  const handleOpen = () => setOpenModel(true);
  const handleClose = () => setOpenModel(false);
  const [error, setError] = React.useState<string>('');
  const [getTax, { data: taxData }] = useLazyGetTaxDetailsQuery();
  const errorCountyRef = React.useRef<HTMLDivElement>(null);

  const [deleteTax] = useDeleteTaxMutation();
  React.useEffect(() => {
    if (taxId) {
      void getTax({ taxId: Number(taxId) });
    }
  }, [getTax, taxId]);
  React.useEffect(() => {
    if (taxData && taxData?.data.tax) {
      setTaxDetails({
        taxID: taxData?.data.tax.taxID,
        taxingEntity: taxData?.data.tax.taxingEntity,
        county: taxData?.data.tax.county,
        state: taxData?.data.tax.state || 'TX',
        amountDue: taxData?.data.tax.amountDue,
        datePaid: taxData?.data.tax.datePaid
          ? formatDateByMonth(taxData?.data.tax.datePaid.toString()).toString()
          : '',
        taxStart: taxData?.data.tax.taxStart
          ? formatDateByMonth(taxData?.data.tax.taxStart.toString()).toString()
          : '',
        taxEnd: taxData?.data.tax.taxEnd
          ? formatDateByMonth(taxData?.data.tax.taxEnd.toString()).toString()
          : '',
        rcvd: !!taxData?.data?.tax?.rcvd,
      });
    }
    setIsLoading(false);
  }, [taxData, taxId]);

  const handleDelete = async () => {
    try {
      const response = await deleteTax({ taxId: Number(taxId) });

      if ('data' in response) {
        if (response?.data?.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          setOpenModel(false);
          navigate(`/editdeed/${taxData?.data.tax.deedID}?tab=taxes`);
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
  const onSubmit = async (
    values: EditTaxForm,
    actions: FormikHelpers<EditTaxForm>
  ) => {
    if (!error) {
      try {
        const data = {
          taxID: Number(taxId),
          taxingEntity: values.taxingEntity,
          county: values.county,
          state: values.state,
          amountDue: values.amountDue,
          datePaid: values?.datePaid
            ? formatDateByMonth(values.datePaid.toString()).toString()
            : null,
          taxStart: values?.taxStart
            ? formatDateByMonth(values.taxStart.toString()).toString()
            : null,
          taxEnd: values?.taxEnd
            ? formatDateByMonth(values.taxEnd.toString()).toString()
            : null,
          rcvd: values.rcvd,
        };
        const response = await updateTax(data);
        if ('data' in response) {
          if (response?.data?.success) {
            actions.resetForm();
            dispatch(
              open({
                severity: severity.success,
                message: response?.data?.message,
              })
            );
            navigate(`/editdeed/${taxData?.data.tax.deedID}?tab=taxes`);
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
          id="editTax"
          variant="h3"
          component="p"
          gutterBottom
          className="header-title-h4"
        >
          {t('editTax')}
        </Typography>
      </Grid>
      <Formik
        initialValues={taxDetails}
        enableReinitialize={true}
        validationSchema={taxSchema(t)}
        onSubmit={onSubmit}
        validateOnBlur={false}
        validateOnChange={false}
        validate={values => {
          try {
            taxSchema(t).validateSync(values, {
              abortEarly: true,
            });
          } catch (error) {
            if (error instanceof Yup.ValidationError && error.path) {
              setTimeout(() => {
                const errorElement = document.querySelector(
                  `[name="${error.path}"]`
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
            {isLoading ? (
              <OverlayLoader open />
            ) : (
              <Box>
                <Grid container spacing={{ xs: 2, md: 2 }}>
                  <TaxFields
                    errors={errors}
                    state={values.state}
                    error={error}
                    setError={setError}
                    errorCountyRef={errorCountyRef}
                  />
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
                    {' '}
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
                        id="edit-tax"
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
                        id="delete-tax"
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
                        {t('delete')}
                      </Button>
                    </Grid>
                  </Grid>
                  <CustomModel
                    open={openModel}
                    handleClose={handleClose}
                    handleDelete={handleDelete}
                    modalHeader="Delete Tax"
                    modalTitle={deleteTaxTitle}
                    modalButtonLabel="Delete"
                  />
                </Grid>
              </Box>
            )}
          </Form>
        )}
      </Formik>
    </Container>
  );
};
export default EditTax;
