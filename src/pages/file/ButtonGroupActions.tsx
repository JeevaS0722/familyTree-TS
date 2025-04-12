import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useLazyRecentOfferQuery } from '../../store/Services/offerService';
import { clearSelectedContacts } from '../../store/Reducers/selectContactReducer';
import {
  clearRecentOffers,
  setRecentOffers,
} from '../../store/Reducers/recentOfferReducer';
import {
  allSelectedContactMustHaveRecentOfferTitle,
  buyerValidateTitle,
  contactValidateTitle,
  selectedContactMustHaveRecentOfferTitle,
} from '../../utils/constants';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import { RecentOfferData } from '../../interface/offer';
import CustomModel from '../../component/common/CustomModal';
import { useFormikContext } from 'formik';
import Divider from '@mui/material/Divider';

interface ButtonGroupActionsProps {
  fileId?: string;
  fileName?: string;
  whose?: string | number | null | undefined;
  errors: {
    fileName?: string;
    apprValue?: string;
    mMSuspAmt?: string;
    startDt?: string;
    returnDt?: string;
    onlineCtyRecDt?: string;
    onlineResearchDt?: string;
  };
  errorFileNameRef: React.MutableRefObject<HTMLDivElement | null>;
  paperFile?: boolean | null;
  setFormErrors?: React.Dispatch<
    React.SetStateAction<
      | {
          errors: {
            fileName?: string | undefined;
            mMSuspAmt?: string | undefined;
            apprValue?: string | undefined;
            startDt?: string;
            returnDt?: string;
            onlineCtyRecDt?: string;
            onlineResearchDt?: string;
          };
        }
      | undefined
    >
  >;
}

const ButtonGroupActions: React.FC<ButtonGroupActionsProps> = ({
  fileId,
  fileName,
  whose,
  errors,
  errorFileNameRef,
  paperFile,
  setFormErrors,
}) => {
  const { t } = useTranslation('editfile');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isSubmitting } = useFormikContext();
  const selectedContacts = useAppSelector(
    state => state.selectedContacts.selectedContacts
  );
  const selectedContactsSortBy = useAppSelector(
    state => state.selectedContacts.sortBy
  );
  const selectedContactsSortOrder = useAppSelector(
    state => state.selectedContacts.sortOrder
  );
  const [getRecentOffer] = useLazyRecentOfferQuery();
  useEffect(() => {
    dispatch(clearSelectedContacts());
    dispatch(clearRecentOffers());
  }, [dispatch]);
  const [isResendOffersLoading, setIsResendOffersLoading] = useState(false);
  const [openModel, setOpenModel] = React.useState(false);
  const handleOpen = () => setOpenModel(true);
  const handleClose = () => setOpenModel(false);
  const [modalTitle, setModalTitle] = React.useState<string>('');
  const handleOfferClick = () => {
    const hasBuyer = !!whose;
    const hasContacts = selectedContacts.length > 0;
    let modalTitle = '';
    if (!hasBuyer) {
      modalTitle = buyerValidateTitle;
    } else if (!hasContacts) {
      modalTitle = contactValidateTitle;
    } else {
      setOpenModel(false);
      navigate('/offer', {
        state: {
          selectedContacts,
          fileId,
          sortBy: selectedContactsSortBy,
          sortOrder: selectedContactsSortOrder,
        },
      });
      return;
    }

    setModalTitle(modalTitle);
    handleOpen();
  };
  const handleResendOffers = async () => {
    const hasBuyer = !!whose;
    const hasContacts = selectedContacts.length > 0;
    let modalTitle = '';

    if (!hasBuyer) {
      modalTitle = buyerValidateTitle;
    } else if (!hasContacts) {
      modalTitle = contactValidateTitle;
    } else {
      setIsResendOffersLoading(true);
      const recentOffers = await Promise.all(
        selectedContacts.map(async contact => {
          try {
            const { data } = await getRecentOffer({
              contactId: Number(contact),
            });
            if (!data || !data.offer) {
              return null;
            }
            return data.offer;
          } catch (error) {
            dispatch(
              open({
                severity: severity.error,
                message: 'An Unexpected Er</Container>ror Occurred',
              })
            );
            return null;
          }
        })
      );
      setIsResendOffersLoading(false);
      if (recentOffers.every(offer => offer === null)) {
        modalTitle = selectedContactMustHaveRecentOfferTitle;
      } else if (recentOffers.some(offer => offer === null)) {
        modalTitle = allSelectedContactMustHaveRecentOfferTitle;
      } else {
        const validOffers = recentOffers.filter(
          (offer): offer is RecentOfferData => offer !== null
        );
        dispatch(setRecentOffers(validOffers));
        setOpenModel(false);
        navigate('/offer', {
          state: {
            selectedContacts,
            fileId,
            fromRecentOffer: true,
            sortBy: selectedContactsSortBy,
            sortOrder: selectedContactsSortOrder,
          },
        });
        return;
      }
    }
    setModalTitle(modalTitle);
    handleOpen();
  };

  const handleTickler = async () => {
    const hasContacts = selectedContacts.length > 0;
    let modalTitle = '';

    if (!hasContacts) {
      modalTitle = t('ticklerAlert');
    } else {
      setOpenModel(false);
      navigate('/file/tickler', {
        state: {
          contacts: selectedContacts,
          fileId,
          fileName: fileName,
        },
      });
      return;
    }
    setModalTitle(modalTitle);
    handleOpen();
  };

  useEffect(() => {
    if (errors?.fileName && errorFileNameRef?.current) {
      errorFileNameRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
    if (errors && setFormErrors) {
      setFormErrors({
        errors: {
          fileName: errors?.fileName,
          apprValue: errors?.apprValue,
          mMSuspAmt: errors.mMSuspAmt,
          startDt: errors?.startDt,
          returnDt: errors?.returnDt,
          onlineCtyRecDt: errors?.onlineCtyRecDt,
          onlineResearchDt: errors?.onlineResearchDt,
        },
      });
    }
  }, [errors]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'flex-start', // Ensures alignment to the start of the flex container
        '& > *': {
          m: 2,
        },
      }}
    >
      <ButtonGroup
        orientation={isMobile ? 'vertical' : 'horizontal'}
        aria-label="Basic button group"
        sx={{
          width: '100%',
        }}
      >
        <Button
          disabled={isSubmitting}
          type="submit"
          id="save-button"
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
          {t('save')}
        </Button>
        <Button
          id="recycle-button"
          sx={{
            whiteSpace: 'nowrap',
          }}
          onClick={() =>
            navigate('/file/recycle', {
              state: {
                fileId: Number(fileId),
                fileName: fileName,
              },
            })
          }
        >
          {t('recycle')}
        </Button>
        <Button
          id="dead-file-button"
          sx={{
            whiteSpace: 'nowrap',
          }}
          onClick={() =>
            navigate('/file/dead', {
              state: {
                fileId: Number(fileId),
                fileName: fileName,
                paperFile: paperFile,
              },
            })
          }
        >
          {t('deadFile')}
        </Button>
        <Button
          id="ask-research-button"
          sx={{
            whiteSpace: 'nowrap',
          }}
          onClick={() =>
            navigate('/file/askResearch', {
              state: {
                fileId: Number(fileId),
                fileName: fileName,
              },
            })
          }
        >
          {t('askResearch')}
        </Button>
        <Button
          id="tickler-button"
          sx={{
            whiteSpace: 'nowrap',
          }}
          onClick={handleTickler}
        >
          {t('tickler')}
        </Button>
        <Button
          id="resendOffer-button"
          sx={{
            whiteSpace: 'nowrap',
            '&:disabled': {
              opacity: 0.2,
              cursor: 'not-allowed',
              backgroundColor: '#1997c6',
              color: '#fff',
            },
          }}
          disabled={isResendOffersLoading}
          onClick={handleResendOffers}
        >
          {t('resendOffers')}
        </Button>
        <Button
          id="makeOffers-button"
          sx={{
            whiteSpace: 'nowrap',
          }}
          onClick={handleOfferClick}
        >
          {t('makeOffers')}
        </Button>
      </ButtonGroup>
      <CustomModel
        open={openModel}
        handleClose={handleClose}
        modalHeader="Info"
        modalTitle={modalTitle}
      />

      <Divider
        sx={{
          width: '100%',
          borderColor: '#434857',
        }}
      />
      {isResendOffersLoading && (
        <Modal
          open={isResendOffersLoading}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={25} color="inherit" />
        </Modal>
      )}
    </Box>
  );
};

export default ButtonGroupActions;
