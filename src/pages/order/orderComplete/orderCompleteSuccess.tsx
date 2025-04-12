import React, { useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { severity } from '../../../interface/snackbar';
import { open } from '../../../store/Reducers/snackbar';
import { useGenerateProbateDocumentMutation } from '../../../store/Services/docService';
import { useAppDispatch } from '../../../store/hooks';

interface LocationStateData {
  form?: string;
  website?: string;
  orderType?: string;
  email?: string;
  grantors?: string;
  orderId?: number;
}

const OrderCompleteSuccess: React.FC = () => {
  const { t } = useTranslation('completeOrder');
  const { t: et } = useTranslation('error');
  const navigate = useNavigate();
  const location = useLocation();
  const { form, website, orderType, email, orderId, grantors } =
    (location.state as LocationStateData) || {};
  const [generateDoc, { isLoading: isGenerateDocLoading }] =
    useGenerateProbateDocumentMutation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, []);
  const handleGenerateDoc = async () => {
    try {
      const response = await generateDoc({ orderId });
      if ('data' in response) {
        if (response?.data?.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
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
      {orderType?.includes('Probate') ? (
        <>
          <Grid item sx={{ width: 'fit-content' }}>
            {isGenerateDocLoading ? (
              <Typography
                sx={{
                  color: '#1997c6',
                  cursor: 'wait',
                  opacity: 0.7,
                  marginTop: '20px',
                  textDecoration: 'none',
                }}
              >
                {`${t('downloadLetterFor')} ${grantors}`}
              </Typography>
            ) : (
              <Typography
                onClick={handleGenerateDoc}
                id="probateLetter"
                className="hover-link"
                sx={{
                  marginTop: '20px',
                }}
              >
                {`${t('downloadLetterFor')} ${grantors}`}
              </Typography>
            )}
          </Grid>
          <Grid item sx={{ width: 'fit-content' }}>
            <Typography
              onClick={() => {
                navigate('/actionItem/requestsToSend');
              }}
              id="requestToSendLink"
              className="hover-link"
              sx={{
                marginTop: '20px',
              }}
            >
              {t('returnToRequestToSend')}
            </Typography>
          </Grid>
        </>
      ) : (
        <>
          {form && (
            <Grid item sx={{ width: 'fit-content' }}>
              <Link
                to={form}
                className="hover-link"
                id="openRequestFormLink"
                target="_blank"
              >
                {t('openRequestForm')}
              </Link>
            </Grid>
          )}
          {email && (
            <Grid item sx={{ width: 'fit-content' }}>
              <Link id="emailLink" to={`mailTo:${email}`}>
                {email}
              </Link>
            </Grid>
          )}
          {website && (
            <Grid item sx={{ width: 'fit-content' }}>
              <Link id="websiteLink" to={website}>
                {website}
              </Link>
            </Grid>
          )}
          <Grid item sx={{ width: 'fit-content' }}>
            <Typography
              onClick={() => {
                navigate('/actionItem/requestsToSend');
              }}
              sx={{
                marginTop: '20px',
              }}
              className="hover-link"
            >
              {t('returnToRequestToSend')}
            </Typography>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default OrderCompleteSuccess;
