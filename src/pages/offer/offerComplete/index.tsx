import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { Form, Formik } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { useTranslation } from 'react-i18next';
import { offerCompleteSchema } from '../../../schemas/offerComplete';
import {
  DropdownObjectForCompleteOffers,
  Values,
} from '../../../interface/offer';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useCompleteOfferMutation,
  useGetOfferFollowUpUsersQuery,
} from '../../../store/Services/offerService';
import { open } from '../../../store/Reducers/snackbar';
import { severity } from '../../../interface/snackbar';
import OfferCompleteForm from './OfferCompleteForm';
import { getInitialDueData, getPriority } from '../../../utils/offer/utils';
import OverlayLoader from '../../../component/common/OverlayLoader';
import { useGetUserQuery } from '../../../store/Services/userService';

interface LocationStateData {
  offerId: number;
  fileColor: string;
  letterType: string;
  grantors: string;
}

const OfferComplete: React.FC = () => {
  const { t } = useTranslation('offer');
  const { t: et } = useTranslation('errors');
  const navigate = useNavigate();
  const [dropDownValue, setDropDownValue] =
    useState<DropdownObjectForCompleteOffers>({
      offerFollowUpUsers: [],
      priority: ['Low', 'Medium', 'High', 'Urgent'],
    });
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { offerId, fileColor, letterType, grantors } =
    (location.state as LocationStateData) || {};
  const [initialValues, setInitialValues] = useState<Values>({
    dueDate: getInitialDueData(fileColor, letterType),
    priority: getPriority(fileColor),
    toUserId: '',
  });
  const [loading, setLoading] = useState(true);
  const [completeOffer] = useCompleteOfferMutation();

  const { data: offerFollowUpUsers } = useGetOfferFollowUpUsersQuery();
  useGetUserQuery('');
  const { teamMateId } = useAppSelector(state => state.user);
  useEffect(() => {
    if (teamMateId) {
      setInitialValues({
        ...initialValues,
        toUserId: teamMateId,
      });
    }
  }, [teamMateId]);
  useEffect(() => {
    if (!offerId) {
      navigate(`/actionItem/offersToSend`);
    }
  }, []);
  useEffect(() => {
    if (offerFollowUpUsers && offerFollowUpUsers.data) {
      setDropDownValue({
        ...dropDownValue,
        offerFollowUpUsers: offerFollowUpUsers.data,
      });
      setLoading(false);
    }
  }, [offerFollowUpUsers]);

  const onSubmit = async (values: Values) => {
    try {
      const data = {
        ...values,
        offerId,
      };
      const response = await completeOffer(data);
      if ('data' in response) {
        if (response?.data?.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          navigate(`/actionItem/offersToSend`);
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
  return (
    <Container component="main" fixed>
      <Typography component="h6" className="header-title-h6">
        {t('offerCompleteTitle')} {grantors}
      </Typography>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={offerCompleteSchema(t)}
        onSubmit={onSubmit}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ isSubmitting, isValidating, errors }) => (
          <Form>
            {loading ? (
              <OverlayLoader open />
            ) : (
              <Grid container justifyContent="center">
                <OfferCompleteForm
                  dropDownValue={dropDownValue}
                  errors={errors}
                  isValidating={isValidating}
                />
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
                    {t('completeOffer')}
                  </Button>
                </Grid>
              </Grid>
            )}
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default OfferComplete;
