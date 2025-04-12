import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { severity } from '../../interface/snackbar';
import { open } from '../../store/Reducers/snackbar';
import { useAppDispatch } from '../../store/hooks';
import { useGetUniqueLegalStateByOffersQuery } from '../../store/Services/offerService';
import {
  useGenerateHonorPreviousOfferLetterDocumentMutation,
  useGenerateOfferDeedDocumentMutation,
  useGenerateOfferLetterDocumentMutation,
  useGenerateOfferPostCardDocumentMutation,
} from '../../store/Services/docService';
import OverlayLoader from '../../component/common/OverlayLoader';

interface LocationStateData {
  grantors: string;
  offerId: number;
  offerType: string;
  fileId: number;
  contactId: number;
}

const OfferLetter: React.FC = () => {
  const { t } = useTranslation('offerLetter');
  const { t: et } = useTranslation('error');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const params = new URLSearchParams(location.search);
  // Retrieve and parse each parameter
  const offerId = Number(params.get('offerId'));
  const offerType = params.get('offerType');
  const grantors = JSON.parse(
    decodeURIComponent(params.get('grantors') || '[]')
  ); // Assuming grantors is an array or object
  const fileId = Number(params.get('fileId'));
  const contactId = Number(params.get('contactId'));
  const [legalStateOfGeneratingDoc, setLegalStateOfGeneratingDoc] =
    useState<string>('');
  const [generateDeedDoc, { isLoading: isGenerateDeedDocLoading }] =
    useGenerateOfferDeedDocumentMutation();
  const [generateLetterDoc, { isLoading: isGenerateLetterDocLoading }] =
    useGenerateOfferLetterDocumentMutation();
  const [generatePostCardDoc, { isLoading: isGeneratePostCardDocLoading }] =
    useGenerateOfferPostCardDocumentMutation();
  const [
    generateHonorPreviousOfferDoc,
    { isLoading: isGenerateHonorPreviousOfferDocLoading },
  ] = useGenerateHonorPreviousOfferLetterDocumentMutation();

  useEffect(() => {
    if (!offerId) {
      navigate('/');
    }
  }, []);
  const { data, isFetching } = useGetUniqueLegalStateByOffersQuery(
    {
      offerId: Number(offerId),
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const handleGenerateDeedDoc = async ({
    legalState,
  }: {
    legalState: string;
  }) => {
    try {
      setLegalStateOfGeneratingDoc(legalState);
      const response = await generateDeedDoc({
        offerId,
        legalState,
      });
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
  const handleGenerateLetterDoc = async () => {
    try {
      const response = await generateLetterDoc({
        offerId,
      });
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
  const handleGeneratePostCardDoc = async () => {
    try {
      const response = await generatePostCardDoc({
        offerId,
      });
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
  const handleGenerateHonorPreviousOfferLetterDoc = async () => {
    try {
      const response = await generateHonorPreviousOfferDoc({
        offerId,
      });
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
      {isFetching ? (
        <OverlayLoader open />
      ) : data && !data.data.length ? (
        <>
          <Typography id="noLegalsText">{t('noLegalDesc')}</Typography>
          <Grid item sx={{ width: 'fit-content' }}>
            <Typography
              onClick={() => {
                navigate(`/editfile/${fileId}`);
              }}
              id="goToLegalsLink"
              className="hover-link"
              sx={{
                marginTop: '20px',
              }}
            >
              {t('goToLegals')}
            </Typography>
          </Grid>
        </>
      ) : (
        <>
          {[
            'Mineral Deed',
            'Honor Previous Offer',
            'Tax Sale',
            'Exclude All Interest Clause',
            'Life Estate Deed',
          ].indexOf(offerType || '') !== -1 && (
            <>
              {data?.data.map(item => (
                <Grid item sx={{ width: 'fit-content' }} key={item.legalState}>
                  {isGenerateDeedDocLoading &&
                  legalStateOfGeneratingDoc === item.legalState ? (
                    <Typography
                      id={`download${item.legalStateDesc}OfferLetterLink`}
                      className="hover-link"
                      sx={{
                        color: '#1997c6',
                        cursor: 'wait',
                        opacity: 0.7,
                        marginTop: '20px',
                        textDecoration: 'none',
                      }}
                    >
                      {`${t('download')} ${item.legalStateDesc} ${t('deedFor')} ${grantors}`}
                    </Typography>
                  ) : (
                    <Typography
                      onClick={() =>
                        handleGenerateDeedDoc({
                          legalState: item.legalState,
                        })
                      }
                      className="hover-link"
                      id={`download${item.legalStateDesc}OfferLetterLink`}
                      sx={{
                        marginTop: '20px',
                      }}
                    >
                      {`${t('download')} ${item.legalStateDesc} ${t('deedFor')} ${grantors}`}
                    </Typography>
                  )}
                </Grid>
              ))}
            </>
          )}
          {[
            'Mineral Deed',
            'Exclude All Interest Clause',
            'Tax Sale',
            'Exclude All Interest Clause',
            'Life Estate Deed',
          ].indexOf(offerType) !== -1 && (
            <Grid item sx={{ width: 'fit-content' }}>
              {isGenerateLetterDocLoading ? (
                <Typography
                  sx={{
                    color: '#1997c6',
                    cursor: 'wait',
                    opacity: 0.7,
                    marginTop: '20px',
                    textDecoration: 'none',
                  }}
                  id={`downloadOfferLetterLink`}
                  className="hover-link"
                >
                  {`${t('downloadOfferLetterFor')} ${grantors}`}
                </Typography>
              ) : (
                <Typography
                  onClick={() => handleGenerateLetterDoc()}
                  id={`downloadOfferLetterLink`}
                  sx={{
                    color: '#1997c6',
                    cursor: 'pointer',
                    marginTop: '20px',
                    textDecoration: 'none',
                  }}
                >
                  {`${t('downloadOfferLetterFor')} ${grantors}`}
                </Typography>
              )}
            </Grid>
          )}
          {offerType && ['Postcard'].indexOf(offerType) !== -1 && (
            <Grid item sx={{ width: 'fit-content' }}>
              {isGeneratePostCardDocLoading ? (
                <Typography
                  sx={{
                    color: '#1997c6',
                    cursor: 'wait',
                    opacity: 0.7,
                    marginTop: '20px',
                    textDecoration: 'none',
                  }}
                  id={`downloadPostCardDocLink`}
                >
                  {`${t('downloadPostCardFor')} ${grantors}`}
                </Typography>
              ) : (
                <Typography
                  onClick={() => handleGeneratePostCardDoc()}
                  sx={{
                    marginTop: '20px',
                  }}
                  id={`downloadPostCardDocLink`}
                  className="hover-link"
                >
                  {`${t('downloadPostCardFor')} ${grantors}`}
                </Typography>
              )}
            </Grid>
          )}
          {['Honor Previous Offer'].indexOf(offerType || '') !== -1 && (
            <Grid item sx={{ width: 'fit-content' }}>
              {isGenerateHonorPreviousOfferDocLoading ? (
                <Typography
                  sx={{
                    color: '#1997c6',
                    cursor: 'wait',
                    opacity: 0.7,
                    marginTop: '20px',
                    textDecoration: 'none',
                  }}
                  id={`downloadHonorPreviousOfferLetterLink`}
                  className="hover-link"
                >
                  {`${t('downloadLetterFor')} ${grantors}`}
                </Typography>
              ) : (
                <Typography
                  onClick={() => handleGenerateHonorPreviousOfferLetterDoc()}
                  sx={{
                    marginTop: '20px',
                  }}
                  id={`downloadHonorPreviousOfferLetterLink`}
                  className="hover-link"
                >
                  {`${t('downloadLetterFor')} ${grantors}`}
                </Typography>
              )}
            </Grid>
          )}
          <Grid item sx={{ width: 'fit-content' }}>
            <Typography
              onClick={() => {
                navigate(`/editcontact/${contactId}`);
              }}
              id="goToContactLink"
              className="hover-link"
              sx={{
                marginTop: '20px',
              }}
            >
              {t('goToContact')}
            </Typography>
          </Grid>
          <Grid item sx={{ width: 'fit-content' }}>
            <Typography
              onClick={() => {
                navigate('/actionItem/myTasks');
              }}
              id="goToMyTasksLink"
              className="hover-link"
              sx={{
                marginTop: '20px',
              }}
            >
              {t('goToMyTasks')}
            </Typography>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default OfferLetter;
