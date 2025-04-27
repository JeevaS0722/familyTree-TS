import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { Field, Form, Formik } from 'formik';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { useNavigate } from 'react-router-dom';
import { editFileSchema } from '../../schemas/editFile';
import CustomDatePicker from '../../component/FormikCustomDatePicker';
import BuyerDropdown from '../../component/common/fields/BuyerDropdown';
import FileStatusDropdown from '../../component/common/fields/FileStatusDropdown';
import FormikTextField from '../../component/common/fields/TextField';
import { FileDetailsData } from '../../interface/file';
import ButtonGroupActions from './ButtonGroupActions';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { formatDateByMonth } from '../../utils/GeneralUtil';
import { useEditFileMutation } from '../../store/Services/fileService';
import { useAppDispatch } from '../../store/hooks';
import { severity } from '../../interface/snackbar';
import { open } from '../../store/Reducers/snackbar';
import {
  CustomTextArea,
  SingleLineTextArea,
} from '../../component/CommonComponent';
import useDateTime from '../../hooks/useDateTime';
import MultiLineTabs from '../../component/CustomTab';
import LazyTab from '../../component/common/wrapper/LazyTab';
import OverlayLoader from '../../component/common/OverlayLoader';
import {
  ErrorText,
  StyledGridItem,
  StyledInputLabel,
} from '../../component/common/CommonStyle';
import MultiSelect from '../../component/common/fields/MultiSelectInput';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import CountyMultiSelect from '../../component/common/fields/CountyMultiSelectInput';
import AmountField from '../../component/common/fields/AmountField';
import * as Yup from 'yup';
import ButtonBase from '@mui/material/ButtonBase';

const ContactTab = React.lazy(
  /* webpackChunkName: "contactTab" */ () => import('./ContactTab')
);
const DocumentTab = React.lazy(
  /* webpackChunkName: "documentTab" */ () =>
    import('../DocumentTab/documentTab')
);
const LegalTable = React.lazy(
  () => import(/* webpackChunkName: "legalTable" */ '../legal/LegalTable')
);
const LazyTaskTabContent = React.lazy(
  () =>
    import(/* webpackChunkName: "taskTabContent" */ '../task/TasksTabContent')
);
const LazyNoteTabContent = React.lazy(
  () =>
    import(
      /* webpackChunkName: "fileNoteTabContent" */ '../note/file/NotesTabContent'
    )
);
interface EditFileFormProps {
  initialValues: FileDetailsData;
  refetchFileData: () => void;
  loading: boolean;
  fileId?: string;
}

const EditFileForm: React.FC<EditFileFormProps> = ({
  initialValues,
  refetchFileData,
  loading,
  fileId,
}) => {
  const { t } = useTranslation('editfile');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [mainContactId, setMainContactId] = useState<number | null>(null);
  const [formErrors, setFormErrors] = useState<{
    errors: {
      fileName?: string;
      mMSuspAmt?: string;
      apprValue?: string;
      startDt?: string;
      returnDt?: string;
      onlineCtyRecDt?: string;
      onlineResearchDt?: string;
    };
  }>();
  const errorFileNameRef = useRef<HTMLDivElement>(null);
  const errorStartDtRef = useRef<HTMLDivElement>(null);
  const errorReturnDtRef = useRef<HTMLDivElement>(null);
  const errorOnlineCtyRecDtRef = useRef<HTMLDivElement>(null);
  const errorOnlineResearchDtRef = useRef<HTMLDivElement>(null);
  const errorLegalCountyRef = useRef<HTMLDivElement>(null);

  const { formatDateTime } = useDateTime();
  const [editFile] = useEditFileMutation();
  const [error, setError] = useState<string>(''); // State to store error message

  useEffect(() => {
    if (formErrors?.errors?.fileName) {
      setTimeout(() => {
        errorFileNameRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 200);
    }
    if (formErrors?.errors?.startDt) {
      setTimeout(() => {
        errorStartDtRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 200);
    }
    if (formErrors?.errors?.returnDt) {
      setTimeout(() => {
        errorReturnDtRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 200);
    }
    if (formErrors?.errors?.onlineCtyRecDt) {
      setTimeout(() => {
        errorOnlineCtyRecDtRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 200);
    }
    if (formErrors?.errors?.onlineResearchDt) {
      setTimeout(() => {
        errorOnlineResearchDtRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 200);
    }
  }, [formErrors?.errors]);
  const handleSubmit = async (values: FileDetailsData) => {
    if (!error) {
      try {
        const data = {
          fileID: values.fileID,
          fileName: values.fileName,
          fileOrigin: values.fileOrigin,
          startDt: values.startDt
            ? formatDateByMonth(values.startDt).toString()
            : '',
          whose: values.whose === '' ? null : values.whose,
          fileStatus: values.fileStatus,
          returnedTo: values.returnedTo,
          paperFile: values.paperFile,
          returnDt: values.returnDt
            ? formatDateByMonth(values.returnDt).toString()
            : '',
          mMSuspAmt: values.mMSuspAmt?.toString(),
          mMComment: values.mMComment,
          blackBart: values.blackBart,
          currentTaxes: values.currentTaxes,
          apprValue: values.apprValue?.toString(),
          totalAppraisedValue: values.totalAppraisedValue,
          onlineCtyRecDt: values.onlineCtyRecDt
            ? formatDateByMonth(values.onlineCtyRecDt).toString()
            : '',
          onlineResearchDt: values.onlineResearchDt
            ? formatDateByMonth(values.onlineResearchDt).toString()
            : '',
          oKProbate: values.oKProbate,
          exxonMFCk: values.exxonMFCk,
          kochMFCk: values.kochMFCk,
          texacoMFCk: values.texacoMFCk,
          oxyMFCk: values.oxyMFCk,
          oKStateRecCk: values.oKStateRecCk,
          pottCtyRecCk: values.pottCtyRecCk,
          oKCtyRecCk: values.oKCtyRecCk,
          payneCoCk: values.payneCoCk,
          pangaeaCk: values.pangaeaCk,
          tXStateRecCk: values.tXStateRecCk,
          legalsDesc: values.legalsDesc,
          legalsCounty: values.legalsCounty,
          legalsState: values.legalsState,
          dead: values.dead,
          boxNo: values.boxNo,
          comment6: values.comment6,
          mainContactId,
        };
        const response = await editFile(data);
        if ('data' in response && response.data?.success) {
          refetchFileData();
          dispatch(
            open({ severity: severity.success, message: response.data.message })
          );
        }
      } catch (error) {
        dispatch(
          open({
            severity: severity.error,
            message: 'Failed to update file details.',
          })
        );
      }
    } else {
      errorLegalCountyRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const handleTabChange = () => {
    refetchFileData();
  };

  return (
    <Box>
      <Grid container alignItems="center" sx={{ mt: 2 }}>
        <Typography component="h6" className="header-title-h6">
          {t('title')}
        </Typography>
      </Grid>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={editFileSchema(t)}
        onSubmit={handleSubmit}
        validateOnBlur={true}
        validateOnChange={false}
        validate={values => {
          try {
            editFileSchema(t).validateSync(values, {
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
        {({ values, errors }) => (
          <Form>
            {loading ? (
              <OverlayLoader open />
            ) : (
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={3}
              >
                <Grid container spacing={{ xs: 1, sm: 2 }}>
                  <StyledGridItem
                    item
                    xs={12}
                    md={2}
                    xl={1}
                    ref={errorFileNameRef}
                  >
                    <StyledInputLabel>{t('fileName')}: *</StyledInputLabel>
                  </StyledGridItem>
                  <Grid item xs={12} md={10} xl={11}>
                    <Grid container spacing={{ xs: 1, sm: 2 }}>
                      <Grid item xs={11} md={11}>
                        <FormikTextField
                          name="fileName"
                          fullWidth
                          inputProps={{
                            id: 'fileName',
                            maxLength: 255,
                          }}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={1}
                        md={1}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Tooltip title="Print File">
                          <ButtonBase
                            onClick={() => {
                              navigate('/print?fileId=' + fileId, {
                                state: {
                                  fileId: Number(fileId),
                                  isFileView: true,
                                },
                              });
                            }}
                            sx={{
                              borderRadius: '50%',
                              padding: '3px',
                              '&:focus-visible': {
                                outline: '1px solid #FFFF',
                                outlineOffset: '2px',
                                borderRadius: '2px',
                              },
                            }}
                          >
                            <LocalPrintshopIcon
                              sx={{
                                color: '#1997c6',
                                fontSize: '1.5rem',
                              }}
                            />
                          </ButtonBase>
                        </Tooltip>
                      </Grid>
                    </Grid>
                    <Grid container spacing={{ xs: 1, sm: 2 }}>
                      <Grid item xs={11} md={11}>
                        {errors?.fileName && (
                          <Box ref={errorFileNameRef}>
                            <ErrorText>{errors?.fileName}</ErrorText>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>

                  <StyledGridItem item xs={12} md={2} xl={1}>
                    <StyledInputLabel>{t('fileOrigin')}: </StyledInputLabel>
                  </StyledGridItem>
                  <Grid item xs={12} md={10} xl={11}>
                    <FormikTextField
                      name="fileOrigin"
                      type="text"
                      InputProps={{
                        slotProps: {
                          root: {
                            id: 'fileOriginField',
                            sx: {
                              backgroundColor:
                                initialValues.fileOrigin === 'Tax Sale'
                                  ? 'orange'
                                  : '#434857',
                              '&:focus-within': {
                                backgroundColor: 'white',
                                '& .MuiInputBase-input': {
                                  color: '#555',
                                },
                              },
                            },
                          },
                        },
                      }}
                      inputProps={{
                        id: 'fileOrigin',
                        maxLength: 50,
                        width: '50%',
                      }}
                    />
                  </Grid>

                  <StyledGridItem item xs={12} md={2} xl={1}>
                    <StyledInputLabel>{t('startDate')}: </StyledInputLabel>
                  </StyledGridItem>
                  <Grid item xs={12} md={10} xl={11}>
                    <CustomDatePicker
                      name="startDt"
                      type="date"
                      id="startDt"
                      width="30%"
                      style={{
                        demo: {
                          sx: {
                            paddingTop: '0px',
                          },
                        },
                      }}
                    />
                    {errors?.startDt && (
                      <Box ref={errorStartDtRef}>
                        <ErrorText id="error-startDt">
                          {errors?.startDt}
                        </ErrorText>
                      </Box>
                    )}
                  </Grid>
                </Grid>

                <Grid container spacing={{ xs: 1, sm: 2 }}>
                  <StyledGridItem item xs={12} md={2} xl={1}>
                    <StyledInputLabel>{t('buyer')}: </StyledInputLabel>
                  </StyledGridItem>
                  <Grid item xs={12} md={10} xl={11}>
                    <BuyerDropdown
                      name="whose"
                      inputProps={{
                        id: 'whose',
                      }}
                      sx={{
                        width: { xs: '100%', md: '50%' },
                        background: '#434857',
                      }}
                    />
                  </Grid>

                  <StyledGridItem item xs={12} md={2} xl={1}>
                    <StyledInputLabel>{t('fileStatus')}: </StyledInputLabel>
                  </StyledGridItem>
                  <Grid item xs={12} md={10} xl={11}>
                    <FileStatusDropdown
                      name="fileStatus"
                      type="status"
                      sx={{
                        backgroundColor:
                          initialValues.fileStatus === 'Dead' ||
                          initialValues.fileStatus === 'Dead-Estate'
                            ? 'red'
                            : initialValues.fileStatus === 'Paused'
                              ? 'lightblue'
                              : '#434857',
                        width: { xs: '100%', md: '50%' },
                      }}
                      InputProps={{
                        slotProps: {
                          root: {
                            id: 'fileStatusField',
                          },
                        },
                      }}
                      inputProps={{
                        id: 'fileStatus',
                      }}
                    />
                  </Grid>

                  <StyledGridItem item xs={12} md={2} xl={1}>
                    <StyledInputLabel>{t('paperLocation')}:</StyledInputLabel>
                  </StyledGridItem>
                  <Grid item xs={12} md={10} xl={11}>
                    <Grid container spacing={{ xs: 1, sm: 2 }}>
                      <Grid item xs={12} md={7}>
                        <FileStatusDropdown
                          name="returnedTo"
                          type="location"
                          inputProps={{
                            id: 'returnedTo',
                          }}
                          sx={{
                            width: { xs: '100%', md: '86.5%' },
                            background: '#434857',
                          }}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={5}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                        }}
                      >
                        <Field
                          name="paperFile"
                          inputProps={{
                            id: 'paperFile',
                          }}
                          type="checkbox"
                          as={Checkbox}
                          sx={{ color: 'white', marginLeft: '-10px' }}
                          size="small"
                          color="info"
                        />
                        <StyledInputLabel>
                          {t('paperFileExists')}?
                        </StyledInputLabel>
                      </Grid>
                    </Grid>
                  </Grid>

                  <StyledGridItem item xs={12} md={2} xl={1}>
                    <StyledInputLabel>{t('asOf')}: </StyledInputLabel>
                  </StyledGridItem>
                  <Grid item xs={12} md={10} xl={11}>
                    <CustomDatePicker
                      name="returnDt"
                      type="date"
                      id="returnDt"
                      width="30%"
                      style={{
                        demo: {
                          sx: {
                            paddingTop: '0px',
                          },
                        },
                      }}
                    />
                    {errors?.returnDt && (
                      <Box ref={errorReturnDtRef}>
                        <ErrorText id="error-returnDt">
                          {errors?.returnDt}
                        </ErrorText>
                      </Box>
                    )}
                  </Grid>
                </Grid>

                <Grid container spacing={{ xs: 1, sm: 2 }}>
                  <StyledGridItem item xs={12} md={2} xl={1}>
                    <StyledInputLabel>{t('totalFileOffer')}:</StyledInputLabel>
                  </StyledGridItem>
                  <Grid item xs={12} md={10} xl={11}>
                    <Grid container spacing={{ xs: 1, sm: 2 }}>
                      <Grid item xs={12} md={2} xl={1}>
                        <FormikTextField
                          name="totalFileOffer"
                          type="text"
                          fullWidth
                          inputProps={{
                            id: 'totalFileOffer',
                            value: initialValues.totalFileOffer,
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment
                                position="start"
                                disableTypography
                                sx={{ color: '#ccc' }}
                              >
                                $
                              </InputAdornment>
                            ),
                          }}
                          disabled
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={10}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                        }}
                      >
                        <StyledInputLabel>
                          {t('totalFileValue')}: {initialValues.totalFileValue}
                        </StyledInputLabel>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <ButtonGroupActions
                  errors={errors}
                  errorFileNameRef={errorFileNameRef}
                  whose={initialValues?.whose}
                  fileName={initialValues?.fileName}
                  fileId={fileId}
                  paperFile={initialValues?.paperFile}
                  setFormErrors={setFormErrors}
                />
                {/* {tab component} */}
                <MultiLineTabs onTabChange={handleTabChange}>
                  <LazyTab
                    id="fileInfo"
                    tabId="fileInfoTab"
                    label={t('fileInfo')}
                  >
                    <ContactTab
                      fileName={initialValues?.fileName}
                      setMainContactId={setMainContactId}
                      mainContactId={mainContactId}
                    />
                    {/* {rest of the file field} */}
                    <Divider
                      sx={{
                        width: '100%',
                        borderColor: '#434857',
                        marginBottom: '30px',
                        marginTop: '30px',
                      }}
                    />

                    <Box sx={{ width: '100%', marginTop: '0 !important' }}>
                      <Grid container spacing={{ xs: 1, sm: 2 }}>
                        <StyledGridItem item xs={12} md={2} xl={1}>
                          <StyledInputLabel>
                            {t('mmSuspense')}:{' '}
                          </StyledInputLabel>
                        </StyledGridItem>
                        <Grid item xs={12} md={10} xl={11}>
                          <Grid container spacing={{ xs: 1, sm: 1 }}>
                            <Grid item xs={12} md={2} xl={1}>
                              <AmountField
                                label={t('mmSuspense')}
                                name="mMSuspAmt"
                                isInteger={false}
                                precision={19}
                                scale={2}
                                formatAmount={true}
                                startAdornment="$"
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={12} md={10} xl={11}>
                              <FormikTextField
                                name="mMComment"
                                type="text"
                                fullWidth
                                inputProps={{
                                  id: 'mMComment',
                                }}
                                sx={{
                                  width: '100%',
                                  backgroundColor: '#434857',
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        <StyledGridItem item xs={12} md={2} xl={1}>
                          <StyledInputLabel>
                            {t('blackBart')}:{' '}
                          </StyledInputLabel>
                        </StyledGridItem>
                        <Grid item xs={12} md={10} xl={11}>
                          <Field
                            name="blackBart"
                            xsWidth="100%"
                            mdWidth="100%"
                            type="text"
                            inputProps={{
                              id: 'blackBart',
                              rows: 1,
                              maxRows: 10,
                            }}
                            component={SingleLineTextArea}
                          />
                        </Grid>

                        <StyledGridItem item xs={12} md={2} xl={1}>
                          <StyledInputLabel>
                            {t('currentTaxes')}:{' '}
                          </StyledInputLabel>
                        </StyledGridItem>
                        <Grid item xs={12} md={10} xl={11}>
                          <FormikTextField
                            name="currentTaxes"
                            sx={{
                              width: '100%',
                              backgroundColor: '#434857',
                            }}
                            type="text"
                            inputProps={{
                              id: 'currentTaxes',
                            }}
                          />
                        </Grid>

                        <StyledGridItem item xs={12} md={2} xl={1}>
                          <StyledInputLabel>
                            {t('txAppraisedValue')}:{' '}
                          </StyledInputLabel>
                        </StyledGridItem>
                        <Grid item xs={12} md={10} xl={11}>
                          <Grid container spacing={{ xs: 1, sm: 1 }}>
                            <Grid item xs={12} md={2} xl={1}>
                              <AmountField
                                label={'txAppraisedValue'}
                                name="apprValue"
                                isInteger={false}
                                precision={19}
                                scale={2}
                                formatAmount={true}
                                startAdornment="$"
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={12} md={10} xl={11}>
                              <FormikTextField
                                name="totalAppraisedValue"
                                sx={{
                                  width: '100%',
                                  backgroundColor: '#434857',
                                }}
                                type="text"
                                fullWidth
                                inputProps={{
                                  id: 'totalAppraisedValue',
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        <StyledGridItem item xs={12} md={2} xl={1}>
                          <StyledInputLabel>
                            {t('onlineCountyRecordsDt')}:{' '}
                          </StyledInputLabel>
                        </StyledGridItem>
                        <Grid item xs={12} md={10} xl={11}>
                          <CustomDatePicker
                            name="onlineCtyRecDt"
                            type="date"
                            id="onlineCtyRecDt"
                            width="30%"
                            style={{
                              demo: {
                                sx: {
                                  paddingTop: '0px',
                                },
                              },
                            }}
                          />
                          {errors?.onlineCtyRecDt && (
                            <Box ref={errorOnlineCtyRecDtRef}>
                              <ErrorText id="error-onlineCtyRecDt">
                                {errors?.onlineCtyRecDt}
                              </ErrorText>
                            </Box>
                          )}
                        </Grid>

                        <StyledGridItem item xs={12} md={2} xl={1}>
                          <StyledInputLabel>
                            {t('onlineResearchDt')}:{' '}
                          </StyledInputLabel>
                        </StyledGridItem>
                        <Grid item xs={12} md={10} xl={11}>
                          <CustomDatePicker
                            name="onlineResearchDt"
                            type="date"
                            id="onlineResearchDt"
                            width="30%"
                            style={{
                              demo: {
                                sx: {
                                  paddingTop: '0px',
                                },
                              },
                            }}
                          />
                          {errors?.onlineResearchDt && (
                            <Box ref={errorOnlineResearchDtRef}>
                              <ErrorText id="error-onlineResearchDt">
                                {errors?.onlineResearchDt}
                              </ErrorText>
                            </Box>
                          )}
                        </Grid>
                      </Grid>

                      <Box sx={{ width: '100%', marginTop: '20px' }}>
                        <Grid
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '20px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <Grid
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                            }}
                          >
                            <StyledInputLabel>
                              {t('okProbOnline')}:{' '}
                            </StyledInputLabel>
                            <Field
                              name="oKProbate"
                              inputProps={{ id: 'oKProbate' }}
                              type="checkbox"
                              as={Checkbox}
                              sx={{
                                color: 'white',
                              }}
                              size="small"
                              color="info"
                            />
                          </Grid>
                          <Grid
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                            }}
                          >
                            <StyledInputLabel>
                              {t('exxonMF')}:{' '}
                            </StyledInputLabel>
                            <Field
                              name="exxonMFCk"
                              inputProps={{ id: 'exxonMFCk' }}
                              type="checkbox"
                              as={Checkbox}
                              sx={{
                                color: 'white',
                              }}
                              size="small"
                              color="info"
                            />
                          </Grid>
                          <Grid
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                            }}
                          >
                            <StyledInputLabel>{t('kochMF')}: </StyledInputLabel>
                            <Field
                              name="kochMFCk"
                              inputProps={{ id: 'kochMFCk' }}
                              type="checkbox"
                              as={Checkbox}
                              sx={{
                                color: 'white',
                              }}
                              size="small"
                              color="info"
                            />
                          </Grid>
                          <Grid
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                            }}
                          >
                            <StyledInputLabel>
                              {t('texacoMF')}:{' '}
                            </StyledInputLabel>
                            <Field
                              name="texacoMFCk"
                              inputProps={{ id: 'texacoMFCk' }}
                              type="checkbox"
                              as={Checkbox}
                              sx={{
                                color: 'white',
                              }}
                              size="small"
                              color="info"
                            />
                          </Grid>
                          <Grid
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                            }}
                          >
                            <StyledInputLabel>{t('oxyMF')}: </StyledInputLabel>
                            <Field
                              name="oxyMFCk"
                              inputProps={{ id: 'oxyMFCk' }}
                              type="checkbox"
                              as={Checkbox}
                              sx={{
                                color: 'white',
                              }}
                              size="small"
                              color="info"
                            />
                          </Grid>
                          <Grid
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                            }}
                          >
                            <StyledInputLabel>
                              {t('okStateRec')}:{' '}
                            </StyledInputLabel>
                            <Field
                              name="oKStateRecCk"
                              inputProps={{ id: 'oKStateRecCk' }}
                              type="checkbox"
                              as={Checkbox}
                              sx={{
                                color: 'white',
                              }}
                              size="small"
                              color="info"
                            />
                          </Grid>
                          <Grid
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                            }}
                          >
                            <StyledInputLabel>
                              {t('pottCtyRec')}:{' '}
                            </StyledInputLabel>
                            <Field
                              name="pottCtyRecCk"
                              inputProps={{ id: 'pottCtyRecCk' }}
                              type="checkbox"
                              as={Checkbox}
                              sx={{
                                color: 'white',
                              }}
                              size="small"
                              color="info"
                            />
                          </Grid>
                          <Grid
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                            }}
                          >
                            <StyledInputLabel>
                              {t('okCtyRec')}:{' '}
                            </StyledInputLabel>
                            <Field
                              name="oKCtyRecCk"
                              inputProps={{ id: 'oKCtyRecCk' }}
                              type="checkbox"
                              as={Checkbox}
                              sx={{
                                color: 'white',
                              }}
                              size="small"
                              color="info"
                            />
                          </Grid>
                          <Grid
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                            }}
                          >
                            <StyledInputLabel>
                              {t('payneCty')}:{' '}
                            </StyledInputLabel>
                            <Field
                              name="payneCoCk"
                              inputProps={{ id: 'payneCoCk' }}
                              type="checkbox"
                              as={Checkbox}
                              sx={{
                                color: 'white',
                              }}
                              size="small"
                              color="info"
                            />
                          </Grid>
                          <Grid
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                            }}
                          >
                            <StyledInputLabel>
                              {t('pangaea')}:{' '}
                            </StyledInputLabel>
                            <Field
                              name="pangaeaCk"
                              inputProps={{ id: 'pangaeaCk' }}
                              type="checkbox"
                              as={Checkbox}
                              sx={{
                                color: 'white',
                              }}
                              size="small"
                              color="info"
                            />
                          </Grid>
                          <Grid
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                            }}
                          >
                            <StyledInputLabel>{t('txRec')}: </StyledInputLabel>
                            <Field
                              name="tXStateRecCk"
                              inputProps={{ id: 'tXStateRecCk' }}
                              type="checkbox"
                              as={Checkbox}
                              sx={{
                                color: 'white',
                              }}
                              size="small"
                              color="info"
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                    {/* {leagal section } */}
                    <Divider
                      sx={{
                        width: '100%',
                        borderColor: '#434857',
                        marginBottom: '30px',
                        marginTop: '30px',
                      }}
                    />

                    <Box sx={{ width: '100%', marginTop: '0 !important' }}>
                      <LazyTab>
                        <LegalTable
                          fileId={fileId}
                          fileName={initialValues.fileName}
                          isFileView={true}
                        />
                      </LazyTab>

                      <Grid container spacing={{ xs: 1, sm: 2 }}>
                        <StyledGridItem item xs={12} md={2} xl={1}>
                          <StyledInputLabel>
                            {t('notesOnLegals')}:
                          </StyledInputLabel>
                        </StyledGridItem>
                        <Grid item xs={12} md={10} xl={11}>
                          <Field
                            name="legalsDesc"
                            xsWidth="100%"
                            mdWidth="100%"
                            type="text"
                            inputProps={{ id: 'legalsDesc', rows: 4 }}
                            component={CustomTextArea}
                          />
                        </Grid>
                        <StyledGridItem item xs={12} md={2} lg={1}>
                          <StyledInputLabel>{t('state')}: </StyledInputLabel>
                        </StyledGridItem>
                        <Grid item xs={12} md={10} lg={11}>
                          <MultiSelect name="legalsState" id="legalState" />
                        </Grid>
                        <StyledGridItem item xs={12} md={2} lg={1}>
                          <StyledInputLabel>{t('county')}: </StyledInputLabel>
                        </StyledGridItem>
                        <Grid item xs={12} md={10} lg={11}>
                          <CountyMultiSelect
                            name="legalsCounty"
                            id="legalsCounty"
                            state={values?.legalsState}
                            setError={setError}
                            maxLength={255}
                          />
                          {error && (
                            <Box ref={errorLegalCountyRef}>
                              <ErrorText id="error-legalsCounty">
                                {error}
                              </ErrorText>
                            </Box>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                    {/* {rest of the file field} */}
                    <Divider
                      sx={{
                        width: '100%',
                        borderColor: '#434857',
                        marginBottom: '30px',
                        marginTop: '30px',
                      }}
                    />

                    <Box sx={{ width: '100%', marginTop: '0 !important' }}>
                      <Grid container spacing={{ xs: 1, sm: 2 }}>
                        <StyledGridItem item xs={2} md={2} lg={1}>
                          <StyledInputLabel>{t('dead')}: </StyledInputLabel>
                        </StyledGridItem>
                        <Grid item xs={10} md={10} lg={11}>
                          <Field
                            name="dead"
                            inputProps={{ id: 'dead' }}
                            type="checkbox"
                            as={Checkbox}
                            sx={{
                              color: 'white',
                            }}
                            size="small"
                            color="info"
                          />
                        </Grid>

                        <StyledGridItem item xs={12} md={2} lg={1}>
                          <StyledInputLabel>{t('boxNo')}: </StyledInputLabel>
                        </StyledGridItem>
                        <Grid item xs={12} md={10} lg={11}>
                          <FormikTextField
                            name="boxNo"
                            sx={{
                              width: '100%',
                              backgroundColor: '#434857',
                            }}
                            type="text"
                            inputProps={{
                              id: 'boxNo',
                              maxLength: 10,
                            }}
                          />
                        </Grid>

                        <StyledGridItem item xs={12} md={2} lg={1}>
                          <StyledInputLabel>{t('comment')}:</StyledInputLabel>
                        </StyledGridItem>
                        <Grid item xs={12} md={10} lg={11}>
                          <Field
                            name="comment6"
                            xsWidth="100%"
                            mdWidth="100%"
                            type="text"
                            inputProps={{ id: 'comment6', rows: 2 }}
                            component={CustomTextArea}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                    {/* {last updated date} */}
                    <Box sx={{ width: '100%' }} mt={2}>
                      <Grid container spacing={{ xs: 1, sm: 2 }}>
                        <StyledGridItem item xs={12} md={12}>
                          <StyledInputLabel>
                            {t('fileLastModifiedBy')}: {initialValues.modifyBy}{' '}
                            {t('at')}
                            &nbsp;
                            {formatDateTime(initialValues.modifyDt).toString()}
                          </StyledInputLabel>
                        </StyledGridItem>
                      </Grid>
                    </Box>
                  </LazyTab>
                  <LazyTab id="docs" tabId="docsTab" label={t('docs')}>
                    <DocumentTab fileId={fileId} isFileView={true} />
                  </LazyTab>
                  <LazyTab label={t('tasks')} id="tasks" tabId="tasksTab">
                    <LazyTaskTabContent
                      fileId={Number(fileId)}
                      contactId={null}
                      from="fileView"
                      city=""
                      deedId={null}
                      fileStatus={initialValues.fileStatus}
                    />
                  </LazyTab>
                  <LazyTab label={t('notes')} id="notes" tabId="notesTab">
                    <LazyNoteTabContent
                      fileId={Number(fileId)}
                      orderBy="dateCompleted,type"
                      order="desc"
                    />
                  </LazyTab>
                </MultiLineTabs>
              </Stack>
            )}
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EditFileForm;
