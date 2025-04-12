import React, { useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { severity } from '../../interface/snackbar';
import { open } from '../../store/Reducers/snackbar';
import { useGenerateDeedReceivedLetterDocumentMutation } from '../../store/Services/docService';
import { useAppDispatch } from '../../store/hooks';

const DeedReceivedLetter: React.FC = () => {
  const { t } = useTranslation('deedReceivedLetter');
  const { t: et } = useTranslation('error');
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const deedId = Number(queryParams.get('deedId'));
  const grantors = JSON.parse(
    decodeURIComponent(queryParams.get('grantors') || '[]')
  );
  const [generateDoc, { isLoading: isGenerateDocLoading }] =
    useGenerateDeedReceivedLetterDocumentMutation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!deedId) {
      navigate('/');
    }
  }, [deedId]);
  const handleGenerateDoc = async () => {
    try {
      const response = await generateDoc({ deedId });
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
            id="downloadDeedReceivedLetterLink"
          >
            {`${t('downloadLetterFor')} ${grantors}`}
          </Typography>
        ) : (
          <Typography
            onClick={handleGenerateDoc}
            id="downloadDeedReceivedLetterLink"
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
            navigate(`/editDeed/${deedId}`);
          }}
          id="returnToDeedLink"
          className="hover-link"
          sx={{
            marginTop: '20px',
          }}
        >
          {t('returnToDeed')}
        </Typography>
      </Grid>
    </Container>
  );
};

export default DeedReceivedLetter;
