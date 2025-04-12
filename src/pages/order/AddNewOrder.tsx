import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Form, Formik, FormikHelpers } from 'formik';
import {
  DropdownObjectForOrder,
  OrderDetailsData,
} from '../../interface/order';
import {
  useGetUserListQuery as useGetAllUsersQuery,
  useGetUserQuery,
} from '../../store/Services/userService';
import { User } from '../../interface/user';
import { useGetOrderTypesQuery } from '../../store/Services/commonService';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { newOrderSchema } from '../../schemas/newOrder';
import { useTranslation } from 'react-i18next';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import { useCreateOrderMutation } from '../../store/Services/orderService';
import * as Yup from 'yup';
import RenderOrderFields from './OrderFields';
import OverlayLoader from '../../component/common/OverlayLoader';

const initialValue: OrderDetailsData = {
  contactId: 0,
  fileId: 0,
  requestedBy: '',
  orderState: '',
  orderCity: '',
  orderType: '',
  caseNo: '',
};

const AddNewOrder: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('newOrder');
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const [orderDetails, setOrderDetails] = React.useState(initialValue);
  const { data: userIdData } = useGetUserQuery('');
  const { data: userData } = useGetAllUsersQuery();
  const { data: orderTypesData } = useGetOrderTypesQuery();
  const [createOrder] = useCreateOrderMutation();
  const [dropDownValue, setDropDownValue] =
    React.useState<DropdownObjectForOrder>({
      users: [],
      state: [],
      type: [],
    });

  React.useEffect(() => {
    if (location?.state && user?.userId) {
      setOrderDetails({
        contactId: location.state.contactId as number,
        fileId: location.state.fileId as number,
        orderCity: location.state.ordCity as string,
        orderState: location.state.ordState as string,
        orderType: '',
        requestedBy: user.userId,
        caseNo: '',
      });
    }
  }, [location.state, user.userId, userIdData]);
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
      });
      setIsLoading(false);
    }
  }, [userData, orderTypesData]);

  const onSubmit = async (
    values: OrderDetailsData,
    actions: FormikHelpers<OrderDetailsData>
  ) => {
    try {
      const data = {
        contactId: values.contactId,
        fileId: values.fileId,
        requestedBy: values.requestedBy,
        orderState: values.orderState,
        orderCity: values.orderCity,
        orderType: values.orderType,
        caseNo: values.caseNo,
      };
      const response = await createOrder(data);
      if ('data' in response) {
        if (response?.data?.success) {
          actions.resetForm();
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          navigate(`/editcontact/${location.state.contactId}?tab=requests`);
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
  return (
    <Container component="main" fixed sx={{ marginTop: 2 }}>
      <Grid container sx={{ mt: 2, mb: 2 }}>
        <Typography component="h6" id="newRequest" className="header-title-h6">
          {t('newRequest')}
        </Typography>
      </Grid>
      <Formik
        initialValues={orderDetails}
        enableReinitialize={true}
        validationSchema={newOrderSchema(t)}
        onSubmit={onSubmit}
        validateOnBlur={false}
        validateOnChange={false}
        validate={values => {
          try {
            newOrderSchema(t).validateSync(values, {
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
                  {RenderOrderFields(t, dropDownValue)}
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
                      id="save-order"
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

export default AddNewOrder;
