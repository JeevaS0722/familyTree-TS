import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Form, Formik, FormikHelpers } from 'formik';
import {
  DropdownObjectForOrder,
  EditOrderDetailsData,
  EditOrderDetailsDataFormData,
} from '../../interface/order';
import { useGetUserListQuery as useGetAllUsersQuery } from '../../store/Services/userService';
import { User } from '../../interface/user';
import { useGetOrderTypesQuery } from '../../store/Services/commonService';
import { useAppDispatch } from '../../store/hooks';
import { editOrderSchema } from '../../schemas/editOrder';
import { useTranslation } from 'react-i18next';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import {
  useDeleteOrderMutation,
  useLazyGetOrderByOrderIdQuery,
  useUpdateOrderMutation,
} from '../../store/Services/orderService';
import { useLazyGetAddressByCountyQuery } from '../../store/Services/addressService';
import {
  formatDateByMonth,
  formatDateToMonthDayYear,
} from '../../utils/GeneralUtil';
import * as Yup from 'yup';
import RenderOrderFields from './OrderFields';
import CustomModel from '../../component/common/CustomModal';
import OverlayLoader from '../../component/common/OverlayLoader';

const initialValue: EditOrderDetailsData = {
  contactId: 0,
  fileId: 0,
  orderId: 0,
  requestedBy: '',
  orderState: '',
  orderCity: '',
  orderType: '',
  caseNo: '',
  ordDt: '',
  ordRcdDt: '',
  ordNA: false,
  addressId: 0,
};
const EditOrder: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('editOrder');
  const dispatch = useAppDispatch();
  const [orderDetails, setOrderDetails] = React.useState(initialValue);
  const { data: userData } = useGetAllUsersQuery();
  const { data: orderTypesData } = useGetOrderTypesQuery();
  const [deleteOrder] = useDeleteOrderMutation();
  const [getOrder, { data: orderData }] = useLazyGetOrderByOrderIdQuery();
  const [
    getAddressByCounty,
    { data: addressData, isFetching: addressFetching },
  ] = useLazyGetAddressByCountyQuery();
  const [updateOrder] = useUpdateOrderMutation();
  const [openModel, setOpenModel] = React.useState(false);
  const handleOpen = () => setOpenModel(true);
  const handleClose = () => setOpenModel(false);
  const [dropDownValue, setDropDownValue] =
    React.useState<DropdownObjectForOrder>({
      users: [],
      state: [],
      type: [],
      address: [],
    });
  React.useEffect(() => {
    if (orderId) {
      void getOrder({ orderId: Number(orderId) });
    }
  }, [getOrder, orderId]);
  React.useEffect(() => {
    if (orderData && orderData?.data) {
      setOrderDetails({
        orderId: Number(orderId),
        contactId: orderData?.data.contactId,
        fileId: orderData.data.fileId,
        orderCity: orderData.data.ordCity,
        orderState: orderData.data.ordState,
        orderType: orderData.data.ordType,
        requestedBy: orderData.data.requestedBy,
        caseNo: orderData.data.caseNo,
        addressId: orderData.data.addressId,
        ordDt: orderData.data.ordDt
          ? formatDateToMonthDayYear(orderData.data.ordDt).toString()
          : null,
        ordRcdDt: orderData.data.ordRcdDt
          ? formatDateToMonthDayYear(orderData.data.ordRcdDt).toString()
          : null,
        ordNA: !!orderData?.data?.ordNA,
      });
    }
    if (orderData?.data?.addressId) {
      void getAddressByCounty({ county: orderData.data.ordCity });
    }
  }, [getAddressByCounty, orderData, orderId]);
  React.useEffect(() => {
    if (
      userData &&
      userData.data &&
      userData.data &&
      orderTypesData &&
      orderTypesData.places
    ) {
      setDropDownValue({
        users: userData?.data?.map((user: User) => ({
          label: user.fullName,
          value: user.userId,
        })),
        type: orderTypesData?.places,
        address: addressData?.data || [],
      });
      setIsLoading(false);
    }
  }, [userData, orderTypesData, addressData]);

  const onSubmit = async (
    values: EditOrderDetailsData,
    actions: FormikHelpers<EditOrderDetailsData>
  ) => {
    try {
      const data: EditOrderDetailsDataFormData = {
        orderId: Number(orderId),
        contactId: values.contactId,
        fileId: values.fileId,
        addressId: values.addressId,
        requestedBy: values.requestedBy,
        ordState: values.orderState,
        ordCity: values.orderCity,
        ordType: values.orderType,
        caseNo: values.caseNo,
        ordNA: values.ordNA,
        ordDt: values?.ordDt
          ? formatDateByMonth(values?.ordDt.toString()).toString()
          : null,
        ordRcdDt: values?.ordRcdDt
          ? formatDateByMonth(values?.ordRcdDt.toString()).toString()
          : null,
      };
      const response = await updateOrder(data);
      if ('data' in response) {
        if (response?.data?.success) {
          actions.resetForm();
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          navigate(`/editcontact/${orderDetails.contactId}?tab=requests`);
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
  };
  const handleDelete = async () => {
    try {
      const response = await deleteOrder({ orderId: Number(orderId) });
      if ('data' in response) {
        if (response?.data?.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          setOpenModel(false);
          navigate(`/editcontact/${orderDetails.contactId}`);
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
  return (
    <Container component="main" fixed sx={{ marginTop: 2 }}>
      <Grid container sx={{ mt: 2, mb: 2 }}>
        <Typography component="h6" id="editOrder" className="header-title-h6">
          {t('editOrder')}
        </Typography>
      </Grid>
      <Formik
        initialValues={orderDetails}
        enableReinitialize={true}
        validationSchema={editOrderSchema(t)}
        onSubmit={onSubmit}
        validateOnBlur={false}
        validateOnChange={false}
        validate={values => {
          try {
            editOrderSchema(t).validateSync(values, {
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
        {({ isSubmitting }) => (
          <Form>
            {isLoading ? (
              <OverlayLoader open />
            ) : (
              <Box>
                <Grid container spacing={{ xs: 2, md: 2 }}>
                  {RenderOrderFields(
                    t,
                    dropDownValue,
                    orderDetails,
                    addressFetching,
                    'edit',
                    !!orderData?.data?.addressId
                  )}
                  <Grid container justifyContent="center">
                    <Grid item>
                      <Button
                        disabled={isSubmitting}
                        type="submit"
                        id="save-edit-order"
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

                    <Grid item>
                      <Button
                        id="delete-order-button"
                        variant="outlined"
                        sx={{
                          my: '2rem',
                          ml: '1rem',
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
                      modalHeader="Delete Request"
                      modalTitle={t('deleteWarning')}
                      modalButtonLabel="Delete"
                    />
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

export default EditOrder;
