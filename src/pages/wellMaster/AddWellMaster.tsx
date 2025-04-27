import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
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
import {
  CreateWellMasterInitialValues,
  LocationState,
} from '../../interface/wellMaster';
import { wellMasterSchema } from '../../schemas/wellMasterSchema';
import { useCreateWellMasterMutation } from '../../store/Services/wellMasterService';
import { interTypes } from '../../utils/constants';
import { SectionOption } from '../../interface/common';
import { useLazyGetDeedQuery } from '../../store/Services/deedService';
import { useLazyGetWellByWellIdQuery } from '../../store/Services/wellService';
import { useLazyGetDivisionDetailsQuery } from '../../store/Services/divisionService';
import { useLazyGetAllRecordingsQuery } from '../../store/Services/recordingService';
import OverlayLoader from '../../component/common/OverlayLoader';

const AddWellMaster: React.FC = () => {
  const { t } = useTranslation('wellMaster');
  const [isLoading, setIsLoading] = React.useState(true);
  const location = useLocation();
  const [divOrderId, setDivOrderId] = React.useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const errorCountyRef = React.useRef<HTMLDivElement>(null);

  const [initialValues, setInitialValues] =
    React.useState<CreateWellMasterInitialValues>({
      wellName: '',
      deedID: 0,
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
      interest: '0.00000000000',
      payorID: null,
      operatorID: null,
      type: 'RI',
      fileName: '',
    });
  const { deedID, wellID } = (location.state as LocationState) || {};
  const [interestTypesOptions] = React.useState<SectionOption[]>(interTypes);
  const [createWellMaster] = useCreateWellMasterMutation();
  const [getDeed, { data: deedDetails, isLoading: isDeedLoading }] =
    useLazyGetDeedQuery();
  const [getWell, { data: wellData, isLoading: isWellLoading }] =
    useLazyGetWellByWellIdQuery();
  const [getDivOrder, { data: divisionData, isLoading: isDivOrderLoading }] =
    useLazyGetDivisionDetailsQuery();
  const [
    getAllRecordings,
    { data: recordingData, isLoading: isRecordingLoading },
  ] = useLazyGetAllRecordingsQuery();
  const [companyName, setCompanyName] = useState('');
  React.useEffect(() => {
    if (deedID) {
      void getDeed({ deedId: Number(deedID) });
    }
  }, [getDeed, deedID]);
  React.useEffect(() => {
    if (deedDetails && deedDetails?.deed) {
      setInitialValues(prevValues => ({
        ...prevValues,
        fileName: deedDetails?.deed?.FilesModel?.fileName,
      }));
    }
  }, [deedDetails]);
  React.useEffect(() => {
    if (wellID) {
      void getWell({ wellId: Number(wellID) });
    }
  }, [wellID, getWell]);
  React.useEffect(() => {
    if (wellData) {
      setDivOrderId(wellData?.data?.divOrderID);
      setInitialValues(prevValues => ({
        ...prevValues,
        wellName: wellData.data.well,
        sectionAB: wellData.data.sectionAB,
        townshipBlock: wellData.data.townshipBlock,
        rangeSurvey: wellData.data.rangeSurvey,
        county: wellData.data.county,
        state: wellData.data.state,
        interest: wellData.data.divInterest,
      }));
    }
  }, [wellData]);

  React.useEffect(() => {
    if (divOrderId) {
      void getDivOrder({ orderId: Number(divOrderId) });
    }
  }, [divOrderId, getDivOrder]);

  React.useEffect(() => {
    if (divisionData) {
      setInitialValues(prevValues => ({
        ...prevValues,
        operatorID: divisionData?.data?.OperatorsModel?.operatorID || null,
        payorID: divisionData?.data?.OperatorsModel?.operatorID || null,
      }));

      const companyNameStr = `${divisionData?.data?.OperatorsModel?.companyName || ''}${
        divisionData?.data?.OperatorsModel?.contactName
          ? ` - ${divisionData?.data?.OperatorsModel?.contactName}`
          : ''
      }`;
      setCompanyName(companyNameStr);
    }
  }, [divisionData, location]);

  React.useEffect(() => {
    if (deedID) {
      void getAllRecordings({ deedId: Number(deedID) });
    }
  }, [deedID, getAllRecordings]);
  React.useEffect(() => {
    if (Array.isArray(recordingData?.data) && recordingData?.data.length > 0) {
      const firstRecord = recordingData.data[0];
      setInitialValues(prevValues => ({
        ...prevValues,
        book: firstRecord?.book || '',
        page: firstRecord?.page || '',
      }));
    }
  }, [recordingData]);

  React.useEffect(() => {
    if (
      !isDeedLoading &&
      !isWellLoading &&
      !isDivOrderLoading &&
      !isRecordingLoading
    ) {
      setIsLoading(false);
    }
  }, [isDeedLoading, isWellLoading, isDivOrderLoading, isRecordingLoading]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = async (values: CreateWellMasterInitialValues) => {
    if (!error) {
      try {
        const data = {
          wellName: values.wellName,
          api: values.api,
          book: values.book,
          page: values.page,
          county: values.county,
          state: values.state,
          sectionAB: values.sectionAB,
          townshipBlock: values.townshipBlock,
          rangeSurvey: values.rangeSurvey,
          quarters: values.quarters,
          acres: values.acres || 0,
          nma: values.nma || 0,
          interest: values.interest,
          payorID: values.payorID || null,
          operatorID: values.operatorID || null,
          deedID: Number(deedID),
          type: values.type,
          fileName: values.fileName,
        };
        const response = await createWellMaster(data);
        if ('data' in response) {
          if (response?.data?.success) {
            dispatch(
              open({
                severity: severity.success,
                message: response?.data?.message,
              })
            );
            navigate(`/division/edit/${Number(divOrderId)}`, {
              state: {
                companyName: companyName,
                from: 'wellMaster',
                action: 'create',
                id: response?.data?.data?.wellID,
              },
            });
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
      <Grid container sx={{ mt: 2, mb: 2 }}>
        <Typography
          component="h6"
          id="addNewWellMaster"
          className="header-title-h6"
        >
          {t('addNewWell')}
        </Typography>
      </Grid>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={wellMasterSchema(t)}
        onSubmit={onSubmit}
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
        {({ isSubmitting, values }) => (
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
                    companyName,
                    deedID
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
                      id="save-wellMaster"
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
            )}
          </Form>
        )}
      </Formik>
    </Container>
  );
};
export default AddWellMaster;
