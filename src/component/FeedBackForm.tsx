import React, { useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import StyledInputField, {
  CustomInputLabel,
  ErrorText,
} from './common/CommonStyle';
import { feedbackSchema } from '../schemas/feedback';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { CustomSelectField } from './CustomizedSelectComponent';
import { useDropzone } from 'react-dropzone';
import { useCreateJiraTicketMutation } from '../store/Services/commonService';
import Typography from '@mui/material/Typography';
import CancelIcon from '@mui/icons-material/Cancel';
import { Close } from '@mui/icons-material';
import { useAppDispatch } from '../store/hooks';
import { severity } from '../interface/snackbar';
import { open } from '../store/Reducers/snackbar';
import { useTranslation } from 'react-i18next';
import { CustomTextArea } from './CommonComponent';

interface JiraTicketFormProps {
  openModel: boolean;
  onClose: () => void;
}

interface FormValues {
  title: string;
  description: string;
  priority: string;
  issueType: string;
  attachments: File[];
}

// MyDropzone component for file upload
const MyDropzone: React.FC<{
  onDrop: (files: File[]) => void;
  onErrorChange: (hasErrors: boolean) => void;
  setFieldValue: (field: string, value: File[]) => void;
}> = ({ onDrop, onErrorChange, setFieldValue }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<number, string>>({});
  const { t } = useTranslation('common');

  const MAX_FILE_SIZE = 256 * 1024 * 1024; // 256MB
  const imageTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/tiff',
    'image/svg+xml',
  ];

  const updateErrors = (newErrors: Record<number, string>) => {
    setErrors(prev => ({ ...prev, ...newErrors }));
    onErrorChange(Object.keys(newErrors).length > 0);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      const newErrors: Record<number, string> = {};

      acceptedFiles.forEach((file, index) => {
        if (file.size > MAX_FILE_SIZE) {
          newErrors[index + files.length] =
            `File is too big ${(file.size / (1024 * 1024)).toFixed()}MiB. Max filesize: {{256}}MiB.`;
        }
      });

      setFiles(prev => [...prev, ...acceptedFiles]);
      setErrors(prev => ({ ...prev, ...newErrors }));
      updateErrors(newErrors);
      onDrop(acceptedFiles);
    },
  });

  const handleRemoveFile = (index: number) => {
    setFiles(prev => {
      const updatedFiles = prev.filter((_, i) => i !== index);
      setFieldValue('attachments', updatedFiles); // Update Formik's state
      return updatedFiles;
    });
    setErrors(prev => {
      const updatedErrors = { ...prev };
      delete updatedErrors[index];
      updateErrors(updatedErrors);
      return updatedErrors;
    });
  };
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box
      {...getRootProps()}
      sx={{
        border: '2px dashed #ccc',
        padding: '10px',
        textAlign: 'center',
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: '100%',
        minHeight: '200px',
        maxHeight: 'auto',
      }}
    >
      <input
        {...getInputProps()}
        style={{
          display: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: 0,
          cursor: 'pointer',
        }}
      />

      <Typography variant="body1" gutterBottom sx={{ color: '#000000' }}>
        {t('dragDrop')}
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ color: '#000000' }}>
        {t('attachmentInfo')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'row',
          gap: '16px',
          marginTop: '10px',
          width: '100%',
          color: '#000',
          maxHeight: 'calc(100% - 40px)',
        }}
      >
        {files.map((file, index) => (
          <Tooltip key={index} title={file.name} arrow>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '150px',
                height: '150px',
                border: errors[index] ? `1px solid #f44336` : '1px solid #ccc',
                borderRadius: '5px',
                backgroundColor: '#fff',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                padding: '10px',
              }}
            >
              {errors[index] ? (
                imageTypes.includes(file.type) ? (
                  <>
                    <Box
                      component="img"
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <Box
                      sx={{
                        opacity: isSmallScreen ? 1 : 0,
                        backgroundColor: '#00000080',
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        right: '0',
                        transition: 'opacity 0.3s',
                      }}
                    >
                      <Typography id="img-name" sx={{ color: '#FFFF' }}>
                        {file.name}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      width: '130px',
                      height: '130px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f0f0f0',
                      fontSize: '12px',
                      textAlign: 'center',
                      padding: '10px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="error"
                      sx={{
                        textAlign: 'center',
                        padding: '10px',
                        wordBreak: 'break-word',
                      }}
                    >
                      <Typography id="text-file" sx={{ color: '#000000' }}>
                        {file.name}
                      </Typography>
                      {errors[index]}
                    </Typography>
                  </Box>
                )
              ) : imageTypes.includes(file.type) ? (
                <>
                  <Box
                    component="img"
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <Box
                    sx={{
                      opacity: isSmallScreen ? 1 : 0,
                      backgroundColor: '#00000080',
                      position: 'absolute',
                      height: 'auto',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      transition: 'opacity 0.3s',
                    }}
                  >
                    <Typography id="img-name" sx={{ color: '#FFFF' }}>
                      {file.name}
                    </Typography>
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    width: '130px',
                    height: '130px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f0f0f0',
                    fontSize: '12px',
                    textAlign: 'center',
                    padding: '10px',
                    boxSizing: 'border-box',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: 'center',
                      padding: '10px',
                      wordBreak: 'break-word',
                      color: '#000000',
                    }}
                  >
                    {file.name}
                  </Typography>
                </Box>
              )}
              <IconButton
                onClick={event => {
                  event.stopPropagation();
                  event.preventDefault();
                  handleRemoveFile(index);
                }}
                sx={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  background: 'transparent',
                  border: 'none',
                  color: '#aba9a9e6',
                  cursor: 'pointer',
                }}
              >
                <CancelIcon sx={{ fontSize: '1.5rem' }} />
              </IconButton>
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};
const JiraTicketForm: React.FC<JiraTicketFormProps> = ({
  openModel,
  onClose,
}) => {
  const theme = useTheme();
  const { t } = useTranslation('common');

  const dispatch = useAppDispatch();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [hasFileErrors, setHasFileErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state
  const errorTitleRef = React.useRef<HTMLDivElement>(null);
  const errorDescriptionRef = React.useRef<HTMLDivElement>(null);
  const errorFileRef = React.useRef<HTMLDivElement>(null);

  const initialValues: FormValues = {
    title: '',
    description: '',
    priority: 'High',
    issueType: 'Bug',
    attachments: [],
  };
  const priorityOption = [
    { key: 'High', value: 'High' },
    { key: 'Highest', value: 'Highest' },
    { key: 'Low', value: 'Low' },
    { key: 'Lowest', value: 'Lowest' },
    { key: 'Medium', value: 'Medium' },
  ];

  const issueTypeOption = [
    { key: 'Bug', value: 'Bug' },
    { key: 'Manual Change', value: 'Manual Change' },
    { key: 'Manual Report', value: 'Manual Report' },
    { key: 'Feature Request', value: 'Feature Request' },
  ];
  const [createJiraTicket] = useCreateJiraTicketMutation();

  const scrollToError = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  const handleValidationErrors = (errors: {
    title: string;
    description: string;
  }) => {
    if (errors.title && errorTitleRef.current) {
      scrollToError(errorTitleRef);
    } else if (errors.description && errorDescriptionRef.current) {
      scrollToError(errorDescriptionRef);
    }
  };
  const handleSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    try {
      if (!hasFileErrors) {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('issueType', values.issueType);
        if (values.issueType !== 'Feature Request') {
          formData.append('priority', values.priority);
        }

        if (values.attachments) {
          values.attachments.forEach(file =>
            formData.append('attachments', file)
          );
        }
        const response = await createJiraTicket({ formData: formData });
        if ('data' in response) {
          if (response?.data?.success) {
            dispatch(
              open({
                severity: severity.success,
                message: response?.data?.message,
              })
            );
            onClose();
            resetForm(); // Reset form after submission
          }
        }
      } else {
        errorFileRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    } catch (error) {
      dispatch(
        open({
          severity: severity.error,
          message:
            'An Unexpected Error Occurred During the Submitting of Report',
        })
      );
    } finally {
      setIsSubmitting(false); // Re-enable the button
    }
  };

  return (
    <Dialog
      open={openModel}
      fullWidth
      fullScreen={isSmallScreen}
      PaperProps={{
        sx: {
          maxWidth: isSmallScreen ? '100%' : 'none', // Ensure full width for mobile
          width: isSmallScreen ? '100%' : '80%',
          height: isSmallScreen ? '100%' : '80%',
          position: 'relative', // Enables absolute positioning inside the dialog
          flexDirection: 'column',
        },
      }}
    >
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 2,
          backgroundColor: 'background.paper',
        }}
      >
        <DialogTitle sx={{ color: '#FFFF', fontSize: '1.7rem' }}>
          Report Issue
        </DialogTitle>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: isSmallScreen ? '16px' : '0px',
            right: isSmallScreen ? '16px' : '0px',
          }}
        >
          <Close sx={{ color: '#FFFF' }} />
        </IconButton>
      </Box>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={feedbackSchema(t)}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ values, setFieldValue, errors, validateForm }) => (
          <Form>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  <CustomInputLabel sx={{ color: '#FFFF', fontSize: '1.0rem' }}>
                    Issue Type:
                  </CustomInputLabel>
                  <Field
                    name="issueType"
                    inputProps={{ id: 'issueType' }}
                    as={CustomSelectField}
                    options={issueTypeOption}
                    hasEmptyValue={false}
                    labelKey="value"
                    additionalStyle={{
                      width: { xs: '100%' },
                    }}
                  />
                </Grid>
                {values.issueType !== 'Feature Request' && (
                  <Grid item xs={12} sm={3}>
                    <CustomInputLabel
                      sx={{ color: '#FFFF', fontSize: '1.0rem' }}
                    >
                      Priority:
                    </CustomInputLabel>
                    <Field
                      name="priority"
                      inputProps={{ id: 'priority' }}
                      as={CustomSelectField}
                      options={priorityOption}
                      hasEmptyValue={false}
                      labelKey="value"
                      additionalStyle={{
                        width: { xs: '100%' },
                      }}
                    />
                  </Grid>
                )}
                <Grid item xs={12} ref={errorTitleRef}>
                  <CustomInputLabel sx={{ color: '#FFFF', fontSize: '1.0rem' }}>
                    Summary:*
                  </CustomInputLabel>
                  <Field
                    name="title"
                    type="text"
                    inputProps={{ id: 'title' }}
                    fullWidth
                    as={StyledInputField}
                  />
                  {errors?.title && (
                    <ErrorText id="error-title">{errors.title}</ErrorText>
                  )}
                </Grid>
                <Grid item xs={12} ref={errorDescriptionRef}>
                  <CustomInputLabel sx={{ color: '#FFFF', fontSize: '1.0rem' }}>
                    Description:*
                  </CustomInputLabel>

                  <Field
                    name="description"
                    xsWidth="100%"
                    mdWidth="100%"
                    inputProps={{ id: 'description', rows: 8 }}
                    component={CustomTextArea}
                  />
                  {errors?.description && (
                    <ErrorText id="error-description">
                      {errors.description}
                    </ErrorText>
                  )}
                  <Typography sx={{ fontSize: '0.9rem' }}>
                    {t('desInfo')}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <CustomInputLabel sx={{ color: '#FFFF', fontSize: '1.0rem' }}>
                    Attachments:
                  </CustomInputLabel>
                  <MyDropzone
                    onDrop={droppedFiles =>
                      setFieldValue('attachments', [
                        ...values.attachments,
                        ...droppedFiles,
                      ])
                    }
                    onErrorChange={setHasFileErrors}
                    setFieldValue={setFieldValue}
                  />
                  {hasFileErrors && (
                    <ErrorText id="error-invalid_file" ref={errorFileRef}>
                      {t('invalidFile')}
                    </ErrorText>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <Box
              sx={{
                position: 'sticky',
                bottom: 0,
                zIndex: 2,
                backgroundColor: 'background.paper',
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <Button
                onClick={onClose}
                disabled={isSubmitting}
                variant="outlined"
                sx={{
                  margin: '5px',
                  '&:disabled': {
                    opacity: 0.2,
                    cursor: 'not-allowed',
                    backgroundColor: '#1997c6',
                    color: '#fff',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="outlined"
                sx={{
                  margin: '5px',
                  '&:disabled': {
                    opacity: 0.2,
                    cursor: 'not-allowed',
                    backgroundColor: '#1997c6',
                    color: '#fff',
                  },
                }}
                onClick={async () => {
                  const errors = await validateForm();
                  if (Object.keys(errors).length > 0) {
                    handleValidationErrors(
                      errors as {
                        title: string;
                        description: string;
                      }
                    );
                  } else {
                    document
                      .querySelector('form')
                      ?.dispatchEvent(
                        new Event('submit', { cancelable: true, bubbles: true })
                      );
                  }
                }}
              >
                Submit Ticket
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default JiraTicketForm;
