import React, { useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { severity } from '../../interface/snackbar';
import { open } from '../../store/Reducers/snackbar';
import { useGenerateProbateDocumentMutation } from '../../store/Services/docService';
import { useAppDispatch } from '../../store/hooks';

const OrderRequestLetter: React.FC = () => {
  const { t } = useTranslation('requestLetter');
  const { t: et } = useTranslation('error');
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orderId = Number(params.get('orderId'));
  const grantors = params.get('grantors');
  const contactId = Number(params.get('contactId'));
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
            className="hover-link"
          >
            {`${t('downloadLetterFor')} ${grantors}`}
          </Typography>
        ) : (
          <Typography
            onClick={handleGenerateDoc}
            id="downloadLetter"
            sx={{
              marginTop: '20px',
            }}
            className="hover-link"
          >
            {`${t('downloadLetterFor')} ${grantors}`}
          </Typography>
        )}
      </Grid>
      <Grid item sx={{ width: 'fit-content' }}>
        <Typography
          onClick={() => {
            navigate(`/editContact/${contactId}`);
          }}
          id="returnToContactLink"
          sx={{
            marginTop: '20px',
          }}
          className="hover-link"
        >
          {t('returnToContact')}
        </Typography>
      </Grid>
    </Container>
  );
};

export default OrderRequestLetter;
