import React, { useEffect, useRef, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { Form, Formik } from 'formik';
import { useAppDispatch } from '../../../store/hooks';
import { useTranslation } from 'react-i18next';
import { orderCompleteSchema } from '../../../schemas/orderComplete';
import {
  CompleteOrderPayload,
  DropdownObjectForCompleteOrders,
  OrderCompleteValues,
} from '../../../interface/order';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useCompleteOrderMutation,
  useLazyGetOrderByOrderIdQuery,
} from '../../../store/Services/orderService';
import { open } from '../../../store/Reducers/snackbar';
import { severity } from '../../../interface/snackbar';
import OrderCompleteForm from './orderCompleteForm';
import { useGetOrderTypesQuery } from '../../../store/Services/commonService';
import { useGetUserListQuery } from '../../../store/Services/userService';
import CreateAddress from '../../address/addressForm';
import { addressValues } from '../../../interface/address';
import { formatDate } from '../../../utils/GeneralUtil';
import { useLazyGetAddressByStateQuery } from '../../../store/Services/addressService';
import OverlayLoader from '../../../component/common/OverlayLoader';

interface LocationStateData {
  orderId: number;
}

const OrderComplete: React.FC = () => {
  const { t } = useTranslation('completeOrder');
  const { t: et } = useTranslation('errors');
  const { t: cat } = useTranslation('addAddress');
  const navigate = useNavigate();

  const [dropDownValue, setDropDownValue] =
    useState<DropdownObjectForCompleteOrders>({
      users: [],
      orderTypes: [],
      states: [],
      addresses: [],
    });
  const dispatch = useAppDispatch();
  const location = useLocation();
  const orderCompleteRef = useRef<HTMLInputElement>(null);
  const { orderId } = (location.state as LocationStateData) || {};
  const [error, setError] = React.useState<string>('');
  const errorCountyRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    orderCompleteRef.current?.scrollIntoView({
      block: 'start',
      inline: 'start',
    });
  }, []);

  const addressInitialValues: addressValues = {
    name: '',
    attn: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    county: '',
    payee: '',
    phone: '',
    fax: '',
    email: '',
    website: 'http://www.',
    notes: '',
  };

  const orderCompleteInitialValues: OrderCompleteValues = {
    requestedBy: '',
    ordType: '',
    ordState: '',
    ordCity: '',
    addressId: null,
    ordId: null,
    ordPayAmt: null,
    caseNo: '',
    address: addressInitialValues,
  };

  const [orderCompleteValues, setOrderCompleteValues] =
    useState<OrderCompleteValues>(orderCompleteInitialValues);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<string | undefined>();
  const getScrollRef = (errors: OrderCompleteValues) => {
    if (errors?.addressId) {
      return 'addressId';
    } else if (errors?.ordPayAmt) {
      return 'ordPayAmt';
    } else if (errors?.address?.name) {
      return 'name';
    } else if (errors?.address?.email) {
      return 'email';
    } else if (errors?.address?.website) {
      return 'website';
    }
  };
  const [completeOrder] = useCompleteOrderMutation();
  const { data: orderTypesData, isFetching: orderTypesFetching } =
    useGetOrderTypesQuery();
  const { data: usersData, isFetching: userListFetching } =
    useGetUserListQuery();
  const [getAddresses, { data: addressData, isFetching: addressFetching }] =
    useLazyGetAddressByStateQuery();

  const [getOrder, { data: orderData, isFetching: orderFetching }] =
    useLazyGetOrderByOrderIdQuery();

  useEffect(() => {
    if (orderId) {
      void getOrder({ orderId });
    } else {
      navigate('/actionItem/requestsToSend');
    }
  }, [orderId]);
  useEffect(() => {
    if (!orderTypesFetching && !userListFetching && !orderFetching) {
      setDropDownValue({
        ...dropDownValue,
        users: usersData?.data || [],
        orderTypes: orderTypesData?.places || [],
      });
      const orderInfo = orderData?.data;

      setOrderCompleteValues({
        ...orderCompleteValues,
        fileName: orderInfo?.fileName,
        contactName: orderInfo?.contactName,
        requestedDt: formatDate(orderInfo?.requestedDt),
        requestedBy: orderInfo?.requestedBy,
        ordType: orderInfo?.ordType,
        ordState: orderInfo?.ordState,
        ordCity: orderInfo?.ordCity,
        addressId: orderInfo?.addressId,
        ordId: orderId,
        ordPayAmt: orderInfo?.cost,
        caseNo: orderInfo?.caseNo,
        address: {
          ...orderCompleteValues.address,
          state: orderInfo?.ordState,
        },
      });
      setForm(orderInfo?.form);
      if (orderInfo?.ordState) {
        void getAddresses({ state: orderInfo.ordState });
      }
    }
  }, [orderTypesFetching, userListFetching, orderFetching]);

  useEffect(() => {
    if (
      !orderTypesFetching &&
      !userListFetching &&
      !orderFetching &&
      !addressFetching
    ) {
      setDropDownValue({
        ...dropDownValue,
        addresses: addressData?.data || [],
      });
      setLoading(false);
    }
  }, [addressFetching]);

  const onSubmit = async (values: OrderCompleteValues) => {
    if (!error) {
      try {
        let updateData: CompleteOrderPayload;
        if (values.addressId && Number(values.addressId) === 0) {
          updateData = {
            requestedBy: values.requestedBy,
            ordType: values.ordType,
            ordState: values.ordState,
            ordCity: values.ordCity,
            ordId: orderId,
            ordPayAmt: values.ordPayAmt,
            caseNo: values.caseNo,
            address: values.address,
          };
        } else {
          updateData = {
            requestedBy: values.requestedBy,
            ordType: values.ordType,
            ordState: values.ordState,
            ordCity: values.ordCity,
            ordId: orderId,
            ordPayAmt: values.ordPayAmt,
            caseNo: values.caseNo,
            addressId: values.addressId,
          };
        }
        const response = await completeOrder(updateData);
        if ('data' in response) {
          if (response?.data?.success) {
            dispatch(
              open({
                severity: severity.success,
                message: response?.data?.message,
              })
            );
            navigate(`/order/complete/success`, {
              state:
                'data' in response.data ? response.data.data : response.data,
            });
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
    } else {
      errorCountyRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <Container ref={orderCompleteRef} component="main" fixed>
      <Typography component="h6" className="header-title-h6">
        {t('orderCompleteTitle')}
      </Typography>
      <Formik
        enableReinitialize
        initialValues={orderCompleteValues}
        validationSchema={orderCompleteSchema(t)}
        onSubmit={onSubmit}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({
          isSubmitting,
          errors,
          values,
          isValidating,
          handleChange,
          setFieldValue,
        }) => (
          <Form>
            {loading || orderFetching ? (
              <OverlayLoader open />
            ) : (
              <>
                <Grid container justifyContent="center">
                  <OrderCompleteForm
                    dropDownValue={dropDownValue}
                    errors={errors}
                    form={form}
                    getAddresses={getAddresses}
                    addressFetching={addressFetching}
                    addressId={values.addressId}
                    isValidating={isValidating}
                    setForm={setForm}
                    setFieldValue={setFieldValue}
                    handleChange={handleChange}
                    scrollRef={getScrollRef(
                      errors as unknown as OrderCompleteValues
                    )}
                  />
                </Grid>
                {values.addressId === '0' && (
                  <>
                    <Typography component="h6" className="header-title-h6">
                      {cat('addAddressTitle')}
                    </Typography>
                    <Grid container justifyContent="center">
                      <CreateAddress
                        states={dropDownValue.states || []}
                        names={{
                          name: 'address.name',
                          attn: 'address.attn',
                          address: 'address.address',
                          city: 'address.city',
                          state: 'address.state',
                          zip: 'address.zip',
                          county: 'address.county',
                          payee: 'address.payee',
                          phone: 'address.phone',
                          fax: 'address.fax',
                          email: 'address.email',
                          website: 'address.website',
                          notes: 'address.notes',
                        }}
                        isValidating={isValidating}
                        scrollRef={getScrollRef(
                          errors as unknown as OrderCompleteValues
                        )}
                        addressId={values.addressId}
                        errors={
                          errors.address as unknown as {
                            [key: string]: string;
                          }
                        }
                        disabledFields={{
                          state: false,
                        }}
                        stateValue={values.ordState}
                        error={error}
                        setError={setError}
                        errorCountyRef={errorCountyRef}
                      />
                    </Grid>
                  </>
                )}
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
              </>
            )}
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default OrderComplete;
