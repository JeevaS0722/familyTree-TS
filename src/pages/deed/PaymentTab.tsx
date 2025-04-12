import React, { useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid';
import { Field } from 'formik';
import { CustomInputField } from '../../component/common/CustomInputField';
import Checkbox from '@mui/material/Checkbox';
import CustomDatePicker from '../../component/FormikCustomDatePicker';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Hidden from '@mui/material/Hidden';
import Button from '@mui/material/Button';
import { useCreateDraftRequestCheckMutation } from '../../store/Services/requestCheckService';
import { useAppDispatch } from '../../store/hooks';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import {
  ErrorText,
  StyledGridItem,
  StyledInputLabel,
} from '../../component/common/CommonStyle';
import AmountField from '../../component/common/fields/AmountField';

const PaymentTab: React.FC<{
  deedId: number;
  contactId: number;
  fileId: number;
  grantors: string;
  errors: { draftAmount1?: string; draftAmount2?: string };
}> = ({
  deedId,
  contactId,
  fileId,
  grantors,
  errors,
}: {
  deedId: number;
  contactId: number;
  fileId: number;
  grantors: string;
  errors: {
    draftAmount1?: string;
    draftAmount2?: string;
    dueDt1?: string;
    datePaid1?: string;
    dueDt2?: string;
    datePaid2?: string;
  };
}) => {
  const { t } = useTranslation('editDeed');
  const dispatch = useAppDispatch();
  const [createRequestCheck] = useCreateDraftRequestCheckMutation();
  const [isLoadingDraft1, setIsLoadingDraft1] = React.useState(false);
  const [isLoadingDraft2, setIsLoadingDraft2] = React.useState(false);
  const errorDraftAmount1Ref = useRef<HTMLDivElement>(null);
  const errorDraftAmount2Ref = useRef<HTMLDivElement>(null);
  const errorDatePaid1Ref = useRef<HTMLDivElement>(null);
  const errorDueDt1Ref = useRef<HTMLDivElement>(null);
  const errorDatePaid2Ref = useRef<HTMLDivElement>(null);
  const errorDueDt2Ref = useRef<HTMLDivElement>(null);

  const handleRequestCheck = async (draft: number) => {
    try {
      if (draft === 1) {
        setIsLoadingDraft1(true);
      }
      if (draft === 2) {
        setIsLoadingDraft2(true);
      }
      const data = {
        fileId: fileId,
        contactId: contactId,
        deedId: deedId,
        draft: draft,
      };
      const response = await createRequestCheck(data);
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
          message: 'An Unexpected Error Occurred',
        })
      );
    } finally {
      if (draft === 1) {
        setIsLoadingDraft1(false);
      }
      if (draft === 2) {
        setIsLoadingDraft2(false);
      }
    }
  };

  useEffect(() => {
    if (errors?.draftAmount1) {
      errorDraftAmount1Ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
    if (errors?.draftAmount2) {
      errorDraftAmount2Ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
    if (errors?.dueDt1) {
      errorDueDt1Ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
    if (errors?.datePaid1) {
      errorDatePaid1Ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
    if (errors?.dueDt2) {
      errorDueDt2Ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
    if (errors?.datePaid2) {
      errorDatePaid2Ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [errors]);

  return (
    <>
      <Grid container gap={2}>
        <StyledGridItem item md={12} lg={1}>
          <StyledInputLabel>{t('draft1')}:</StyledInputLabel>
        </StyledGridItem>
        <Grid item md={12} lg={1}>
          <StyledInputLabel sx={{ mb: 1 }}>{t('amount')}</StyledInputLabel>
          <AmountField
            name="draftAmount1"
            label={t('amount')}
            id={'draftAmount1'}
            errId="draftAmount1ErrMsg"
            isInteger={false}
            precision={21}
            scale={2}
            formatAmount={true}
            startAdornment="$"
            fullWidth
          />
        </Grid>
        <Grid item md={12} lg={2}>
          <StyledInputLabel>{t('dueDate')}</StyledInputLabel>
          <CustomDatePicker
            name="dueDt1"
            type="date"
            id="dueDt1"
            sx={{
              paddingTop: '0 !important',
            }}
          />
          {errors?.dueDt1 && (
            <Box ref={errorDueDt1Ref}>
              <ErrorText id="error-dueDt1">{errors?.dueDt1}</ErrorText>
            </Box>
          )}
        </Grid>
        <Grid item md={12} lg={2}>
          <StyledInputLabel>{t('paidDate')}</StyledInputLabel>
          <CustomDatePicker
            name="datePaid1"
            type="date"
            id="datePaid1"
            sx={{
              paddingTop: '0 !important',
            }}
          />
          {errors?.datePaid1 && (
            <Box ref={errorDatePaid1Ref}>
              <ErrorText id="error-datePaid1">{errors?.datePaid1}</ErrorText>
            </Box>
          )}
        </Grid>
        <Grid item md={12} lg={1}>
          <StyledInputLabel sx={{ mb: 1 }}>{t('checkNo')}</StyledInputLabel>
          <Field
            name="checkNo1"
            as={CustomInputField}
            backgroundColor="#434857"
            width="100%"
            type="text"
            inputProps={{
              id: 'checkNo1',
              maxLength: 5,
            }}
          />
        </Grid>
        <Grid item md={12} lg={1}>
          <StyledInputLabel sx={{ mb: 1 }}>{t('paid')}</StyledInputLabel>
          <Field
            name="paid1"
            inputProps={{
              id: 'paid1',
            }}
            type="checkbox"
            as={Checkbox}
            sx={{ color: 'white', marginLeft: { xs: '-10px', md: '10px' } }}
            size="small"
            color="info"
          />
        </Grid>
        <Grid item md={12} lg={1}>
          <StyledInputLabel sx={{ mb: 1 }}>{t('request')}</StyledInputLabel>
          <Button
            onClick={() => handleRequestCheck(1)}
            id="downPaymentCheckLink"
            className="hover-link"
            disabled={isLoadingDraft1}
            sx={{
              textAlign: 'left',
              padding: '0',
              fontSize: '1rem',
            }}
          >
            {isLoadingDraft1 ? (
              <CircularProgress sx={{ color: 'white' }} size={24} />
            ) : (
              t('downPaymentCheck')
            )}
          </Button>
        </Grid>
        <Grid item md={12} lg={1}>
          <StyledInputLabel sx={{ mb: 1 }}>{t('download')}</StyledInputLabel>
          <Link
            to={{
              pathname: '/deedReceivedLetter',
              search: `?deedId=${deedId}&grantors=${encodeURIComponent(JSON.stringify(grantors))}`,
            }}
            id="deedReceivedLetterPageLink"
            className="hover-link"
          >
            {t('deedReceivedLetter')}
          </Link>
        </Grid>
      </Grid>
      <Grid container gap={2} sx={{ mt: { xs: 2, md: 0 } }}>
        <StyledGridItem item md={12} lg={1}>
          <StyledInputLabel>{t('draft2')}:</StyledInputLabel>
        </StyledGridItem>
        <Grid item md={12} lg={1} mt={1}>
          <Hidden mdUp>
            <StyledInputLabel>{t('amount')}</StyledInputLabel>
          </Hidden>
          <AmountField
            name="draftAmount2"
            label={t('amount')}
            id={'draftAmount2'}
            errId="draftAmount2ErrMsg"
            isInteger={false}
            precision={21}
            scale={2}
            formatAmount={true}
            startAdornment="$"
            fullWidth
          />
        </Grid>
        <Grid item md={12} lg={2}>
          <Hidden mdUp>
            <StyledInputLabel>{t('dueDate')}</StyledInputLabel>
          </Hidden>
          <CustomDatePicker
            name="dueDt2"
            type="date"
            id="dueDt2"
            sx={{
              paddingTop: '0 !important',
            }}
            error={!!errors?.dueDt2}
          />
          {errors?.dueDt2 && (
            <Box ref={errorDueDt2Ref}>
              <ErrorText id="error-dueDt2">{errors?.dueDt2}</ErrorText>
            </Box>
          )}
        </Grid>
        <Grid item md={12} lg={2}>
          <Hidden mdUp>
            <StyledInputLabel>{t('paidDate')}</StyledInputLabel>
          </Hidden>
          <CustomDatePicker
            name="datePaid2"
            type="date"
            id="datePaid2"
            sx={{
              paddingTop: '0 !important',
            }}
            error={!!errors?.datePaid2}
          />
          {errors?.datePaid2 && (
            <Box ref={errorDatePaid2Ref}>
              <ErrorText id="error-datePaid2">{errors?.datePaid2}</ErrorText>
            </Box>
          )}
        </Grid>
        <Grid item md={12} lg={1} mt={1}>
          <Hidden mdUp>
            <StyledInputLabel>{t('checkNo')}</StyledInputLabel>
          </Hidden>
          <Field
            name="checkNo2"
            as={CustomInputField}
            backgroundColor="#434857"
            width="100%"
            type="text"
            inputProps={{
              id: 'checkNo2',
              maxLength: 5,
            }}
          />
        </Grid>
        <Grid item md={12} lg={1} mt={1}>
          <Hidden mdUp>
            <StyledInputLabel>{t('paid')}</StyledInputLabel>
          </Hidden>
          <Field
            name="paid2"
            inputProps={{
              id: 'paid2',
            }}
            type="checkbox"
            as={Checkbox}
            sx={{ color: 'white', marginLeft: { xs: '-10px', md: '10px' } }}
            size="small"
            color="info"
          />
        </Grid>

        <Grid item md={12} lg={1} mt={1}>
          <Hidden mdUp>
            <StyledInputLabel>{t('request')}</StyledInputLabel>
          </Hidden>
          <Button
            onClick={() => handleRequestCheck(2)}
            className="hover-link"
            id="purchaseCheckLink"
            disabled={isLoadingDraft2}
            sx={{
              textAlign: 'left',
              padding: '0',
              fontSize: '1rem',
            }}
          >
            {isLoadingDraft2 ? (
              <CircularProgress sx={{ color: 'white' }} size={24} />
            ) : (
              t('purchaseCheck')
            )}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default PaymentTab;
