import React, { Suspense, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  useGetDivisionDetailsQuery,
  useUpdateDivisionMutation,
  useDeleteDivisionMutation,
} from '../../store/Services/divisionService';
import { useAppDispatch } from '../../store/hooks';
import RenderDivisionFields from './DivisionFields';
import {
  CompanyAddress,
  GetDivisionInitialValues,
  UpdateDivisionPayload,
} from '../../interface/division';
import { divisionValidationSchema } from '../../schemas/division';
import * as Yup from 'yup';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import CustomModel from '../../component/common/CustomModal';
import Box from '@mui/material/Box';
import OverlayLoader from '../../component/common/OverlayLoader';
import NavigationModel from '../../component/common/NavigationModel';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { formatDateByMonth } from '../../utils/GeneralUtil';
const LazyWellTableContent = React.lazy(
  () => import(/* webpackChunkName: "WellTable" */ '../wells/WellTable')
);

const OrderNoteList = React.lazy(
  () => import(/* webpackChunkName: "NoteList" */ '../note/order/NoteList')
);

interface Link {
  action: string;
  link: string;
}

const EditDivision: React.FC = () => {
  const { t } = useTranslation('division');
  const location = useLocation();
  const { divisionId } = useParams<{ divisionId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [updateDivision] = useUpdateDivisionMutation();
  const [deleteDivision] = useDeleteDivisionMutation();
  const [openModel, setOpenModel] = React.useState(false);
  const handleOpen = () => setOpenModel(true);
  const handleClose = () => setOpenModel(false);
  const [popupData, setPopupData] = useState<{
    open: boolean;
    data?: {
      links: Link[];
      title: string;
    };
  }>({
    open: false,
    data: {
      links: [],
      title: '',
    },
  });
  const [initialValues, setInitialValues] = useState<GetDivisionInitialValues>({
    operId: null,
    notified: null,
    notice1Date: '',
    notice2Date: '',
    notice3Date: '',
    dorcvd: null,
    donate: '',
    referenceId: '',
  });
  const [companyName, setCompanyName] = useState('');
  const {
    data: divisionData,
    isLoading: divisionLoading,
    isFetching,
  } = useGetDivisionDetailsQuery(
    { orderId: Number(divisionId) },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (location.state?.from && location.state?.action && divisionData) {
      const divisionOrdData = divisionData?.data || null;
      let links: Link[] = [];
      let title = '';

      // Generate links and title based on 'from' and 'action'
      switch (location.state.from) {
        case 'notes':
          links = [
            {
              action: 'Return to file',
              link: `/editfile/${divisionOrdData?.DeedsModel?.ContactsModel?.fileID}`,
            },
            {
              action: 'Return to contact',
              link: `/editcontact/${divisionOrdData?.DeedsModel?.ContactsModel?.contactID}`,
            },
            {
              action: 'Return to deed',
              link: `/editdeed/${divisionOrdData?.DeedsModel?.deedID}`,
            },
          ];
          title =
            location.state?.action === 'delete'
              ? 'Task Deleted!'
              : location.state?.action === 'complete'
                ? 'Task Completed!'
                : 'Task updated!';
          break;
        case 'well':
          links = [
            {
              action: 'Go to deed',
              link: `/editdeed/${divisionOrdData?.DeedsModel?.deedID}`,
            },
          ];
          title =
            location.state?.action === 'delete'
              ? 'Well Deleted!'
              : 'Well saved!';
          break;
        case 'wellMaster':
          links = [
            {
              action: 'Go to WellMaster',
              link: `/editWellMaster/${location.state.id}`,
            },
            {
              action: 'Go to Deed',
              link: `/editdeed/${divisionOrdData?.DeedsModel?.deedID}`,
            },
          ];
          title = 'Well saved!';
          break;
        default:
          links = [{ action: 'Default action', link: '/' }];
          title = 'Well saved!';
      }

      setPopupData({
        open: true,
        data: { links, title },
      });

      // Clear state after use
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, divisionData]);

  useEffect(() => {
    if (divisionData) {
      setInitialValues({
        operId: divisionData?.data?.OperatorsModel?.operatorID,
        notified: divisionData?.data?.notified ? true : null,
        notice1Date: formatDateByMonth(divisionData?.data?.notice1Date || ''),
        notice2Date: formatDateByMonth(divisionData?.data?.notice2Date || ''),
        notice3Date: formatDateByMonth(divisionData?.data?.notice3Date || ''),
        dorcvd: divisionData?.data?.received ? true : null,
        referenceId: divisionData?.data?.referenceId || '',
      });

      const companyNameStr = `${divisionData?.data?.OperatorsModel?.companyName || ''}${
        divisionData?.data?.OperatorsModel?.contactName
          ? ` - ${divisionData?.data?.OperatorsModel?.contactName}`
          : ''
      }`;
      setCompanyName(companyNameStr);
    }
  }, [divisionData, location]);

  const onSubmit = async (values: GetDivisionInitialValues) => {
    try {
      const divisionDetails: UpdateDivisionPayload = {
        orderId: Number(divisionId),
        operId: values?.operId || null,
        notified: values?.notified || false,
        notice1Date: values?.notice1Date || null,
        notice2Date: values?.notice2Date || null,
        notice3Date: values?.notice3Date || null,
        dorcvd: values?.dorcvd || false,
        donate: values?.donate || null,
        referenceId: values?.referenceId || '',
      };
      const response = await updateDivision(divisionDetails);
      if ('data' in response) {
        if (response?.data?.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          navigate(
            `/editdeed/${Number(divisionData?.data?.deedID)}?tab=division`
          );
        }
      }
    } catch (e) {
      // console.error(e);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteDivision({ orderId: Number(divisionId) });
      if ('data' in response) {
        if (response?.data?.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          setOpenModel(false);
          navigate(
            `/editdeed/${Number(divisionData?.data?.deedID)}?tab=division`
          );
        }
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

  return (
    <Container component="main" fixed sx={{ mt: 2 }}>
      {(divisionLoading || isFetching) && <OverlayLoader open />}
      <Grid container sx={{ fontSize: '14px' }}>
        <Grid item xs={12} md={5}>
          <Link
            id="goToDeedView"
            className="hover-link-span text-decoration-none"
            to={`/editdeed/${Number(divisionData?.data?.DeedsModel?.deedID)}`}
          >
            <KeyboardBackspaceIcon
              sx={{
                fontSize: '20px',
              }}
            />
            {`Go To Deed View (without saving)`}
          </Link>
        </Grid>
      </Grid>
      {!divisionLoading && (
        <>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            enableReinitialize
            validationSchema={divisionValidationSchema(t)}
            validateOnBlur={false}
            validateOnChange={false}
            validate={values => {
              try {
                divisionValidationSchema(t).validateSync(values, {
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
            {({ isSubmitting, errors }) => (
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
                    id="edit-division-title"
                  >
                    {t('editDivision')}
                  </Typography>
                </Grid>
                <Grid container alignItems="center" sx={{ mt: 2 }}>
                  {RenderDivisionFields(
                    t,
                    'edit',
                    errors,
                    companyName,
                    initialValues?.operId
                  )}
                </Grid>
                <Grid
                  container
                  justifyContent="center"
                  spacing={2}
                  sx={{
                    marginTop: '1rem',
                    marginBottom: '1rem',
                  }}
                >
                  <Grid item>
                    <Button
                      type="submit"
                      variant="outlined"
                      id="update-division-button"
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
                      {t('saveDivision')}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      id="delete-division-button"
                      disabled={isSubmitting}
                      sx={{
                        whiteSpace: 'nowrap',
                        '&:disabled': {
                          opacity: 0.2,
                          cursor: 'not-allowed',
                          borderColor: '#1997c6',
                          color: '#fff',
                          marginLeft: '2rem',
                        },
                      }}
                      onClick={handleOpen}
                    >
                      {t('deleteDivision')}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
          <Box sx={{ width: '100%' }}>
            <Suspense fallback={<OverlayLoader open />}>
              <LazyWellTableContent
                divOrderId={Number(divisionId)}
                deedID={Number(divisionData?.data?.deedID)}
                companyName={companyName}
              />
            </Suspense>
          </Box>
          <Suspense fallback={<OverlayLoader open />}>
            <OrderNoteList
              deedId={Number(divisionData?.data?.deedID)}
              orderId={Number(divisionId)}
              orderBy="dateCreated,fromUserId"
              order="desc,asc"
              companyName={companyName}
            />
          </Suspense>
        </>
      )}

      <CustomModel
        open={openModel}
        handleClose={handleClose}
        handleDelete={handleDelete}
        modalHeader={t('deleteDivisionTitle')}
        modalTitle={t('deleteDivisionMsg')}
        modalButtonLabel={t('delete')}
      />
      {popupData.open && (
        <NavigationModel
          open={popupData.open}
          handleClose={() => setPopupData({ open: false })}
          routeLinks={
            popupData?.data?.links
              ? popupData?.data.links.map(link => ({
                  name: link.action,
                  link: link.link,
                  action: link.action,
                }))
              : []
          }
          modalHeader={popupData?.data?.title || ''}
        />
      )}
    </Container>
  );
};

export default EditDivision;
