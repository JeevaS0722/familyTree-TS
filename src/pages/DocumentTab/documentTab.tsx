/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
  useDeleteDocumentMutation,
  useLazyGetDocumentsQuery,
  useRenameDocumentMutation,
  useLazyGetDocumentQuery,
} from '../../store/Services/documentService';
import { DeedsStorage, FilesStorage } from '../../interface/document';
import IconButton from '@mui/material/IconButton/IconButton';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import CustomModel from '../../component/common/CustomModal';
import { useAppDispatch } from '../../store/hooks';
import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';
import CustomEditModel from '../../component/common/CustomEditModel';
import deleteImg from '../../assets/images/delete.png'; // Import the image correctly
import renameImg from '../../assets/images/rename.png';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import useDateTime from '../../hooks/useDateTime';
import { getFileExtension, removeFileType } from '../../utils/GeneralUtil';
import DownloadIcon from '@mui/icons-material/DownloadForOfflineTwoTone';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { CircularProgress } from '@mui/material';

interface DocumentTabProps {
  fileId?: number | string;
  deedId?: number;
  isFileView?: boolean;
}

const DocumentTab: React.FC<DocumentTabProps> = ({
  fileId,
  deedId,
  isFileView,
}) => {
  const { t } = useTranslation('document');
  const from = isFileView ? 'file' : 'deed';
  const [getDocuments, { isLoading, isFetching }] = useLazyGetDocumentsQuery();
  const [deleteDocument] = useDeleteDocumentMutation();
  const [renameDocument] = useRenameDocumentMutation();
  const dispatch = useAppDispatch();

  const [documents, setDocuments] = useState<FilesStorage[]>();
  const [deedDocuments, setDeedDocuments] = useState<DeedsStorage[]>();
  const [isFileDocument, setIsFileDocument] = useState(true);

  const [openModel, setOpenModel] = React.useState(false);
  const handleOpen = () => setOpenModel(true);
  const handleClose = () => setOpenModel(false);
  const [selectDocument, setSelectDocument] = useState<
    FilesStorage | DeedsStorage | null
  >();
  const [fileName, setFileName] = useState<string>('');
  const [extension, setExtension] = useState<string>('');

  const [openEditModel, setOpenEditModel] = React.useState(false);
  const handleEditOpen = () => setOpenEditModel(true);
  const handleEditClose = () => {
    setOpenEditModel(false);
    setFileName('');
    setExtension('');
    setOpenEditModel(false);
    setSelectDocument(null);
    setIsFileDocument(true);
    setLoading(false);
  };
  const theme = useTheme(); // Get the theme object
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Check if the view is mobile
  const { formatDateTime } = useDateTime();
  const [loading, setLoading] = useState(false);
  const [getDocument] = useLazyGetDocumentQuery();
  const [confirmAllDelete, setConfirmAllDelete] = useState(false);
  useEffect(() => {
    void getDocuments({
      fileId: Number(fileId),
    })
      .then(({ data }) => {
        if (data?.data?.file_documents) {
          setDocuments(data.data.file_documents);
        }
        if (data?.data?.deed_documents) {
          setDocuments(data.data.file_documents);
          setDeedDocuments(data.data.deed_documents);
        }
      })
      .catch(err => err);
  }, [fileId]);

  const refreshDocuments = () => {
    void getDocuments({
      fileId: Number(fileId),
      deedId: isFileView ? '' : Number(deedId),
    })
      .then(({ data }) => {
        if (data?.data?.file_documents) {
          setDocuments(data.data.file_documents);
          setDeedDocuments(data.data.deed_documents);
        }
      })
      .catch(err => {
        return err;
      });
  };

  const handleDelete = async () => {
    try {
      if (!selectDocument) {
        return;
      }

      const response = isFileDocument
        ? await deleteDocument({
            id: Number(selectDocument.id),
            isFileDocument: isFileDocument,
            deleteAll: false, // ✅ Initial delete attempt without bulk delete
          }).unwrap()
        : await deleteDocument({
            id: Number(selectDocument.id),
          }).unwrap();
      dispatch(
        open({
          severity: severity.success,
          message: 'Document Deleted Successfully',
        })
      );
      setOpenModel(false);
      setSelectDocument(null);
      setIsFileDocument(true);
      refreshDocuments();
    } catch (error) {
      // ✅ Detect duplicate match scenario
      if (
        error?.data?.message === 'The Document matches more than one entry.'
      ) {
        setOpenModel(false);
        setConfirmAllDelete(true); // ✅ Open confirmation modal for bulk delete
      } else {
        setOpenModel(false);
        setSelectDocument(null);
        setIsFileDocument(true);
        refreshDocuments();
        dispatch(
          open({
            severity: severity.error,
            message: 'An unexpected error occurred',
          })
        );
      }
    }
  };

  const handleConfirmAllDelete = async () => {
    try {
      const response = await deleteDocument({
        id: Number(selectDocument?.id),
        isFileDocument: isFileDocument,
        deleteAll: true, // ✅ Confirm bulk delete
      });

      if ('data' in response) {
        if (response?.data?.success) {
          dispatch(
            open({
              severity: severity.success,
              message: response?.data?.message,
            })
          );
          setOpenModel(false);
          setSelectDocument(null);
          setIsFileDocument(true);
          setConfirmAllDelete(false);
          refreshDocuments(); // ✅ Fetch updated document list
        }
      }
    } catch {
      setOpenModel(false);
      setSelectDocument(null);
      setIsFileDocument(true);
      setConfirmAllDelete(false);
      refreshDocuments();
      dispatch(
        open({
          severity: severity.error,
          message: 'Failed to delete all matching documents.',
        })
      );
    }
  };

  const handleRename = async (newName: string) => {
    if (!selectDocument) {
      dispatch(
        open({
          severity: severity.error,
          message: 'No document selected for renaming.',
        })
      );
      return;
    }
    try {
      setLoading(true);
      const response = await renameDocument({
        id: Number(selectDocument.id),
        isFileDocument: isFileDocument,
        fileName: newName,
      }).unwrap();
      // Handle successful rename
      dispatch(
        open({
          severity: severity.success,
          message: response.message,
        })
      );
      setOpenEditModel(false);
      setSelectDocument(null);
      setIsFileDocument(true);

      // Fetch updated documents
      const documentResponse = await getDocuments({
        fileId: Number(fileId),
        deedId: isFileView ? '' : Number(deedId),
      }).unwrap();

      // Update documents in state
      if (documentResponse.data?.file_documents) {
        setDocuments(documentResponse.data.file_documents);
        setDeedDocuments(documentResponse.data.deed_documents);
      }
    } catch (error) {
      // ✅ Check if the error response contains a duplicate file message (statusCode 400)
      if (error?.status === 400 && error?.data?.message) {
        dispatch(
          open({
            severity: severity.error,
            message: error?.data?.message, // Show the error message from API
          })
        );
      } else {
        setOpenEditModel(false);
        setSelectDocument(null);
        setIsFileDocument(true);
        dispatch(
          open({
            severity: severity.error,
            message: 'An error occurred while renaming the document.',
          })
        );
      }
      setLoading(false);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleDownload = async (id: number, type: string) => {
    if (!id) {
      dispatch(
        open({
          severity: severity.error,
          message: 'No document selected for download.',
        })
      );
      return;
    }
    try {
      setLoading(true);
      const documentResponse = await getDocument({
        id: Number(id),
        type: type,
        action: 'download',
      }).unwrap();

      if (
        documentResponse?.data?.document &&
        documentResponse?.data?.document?.fileFullpath
      ) {
        dispatch(
          open({
            severity: severity.success,
            message: 'Download started...',
          })
        );
        const { fileFullpath } = documentResponse.data.document;

        // Simply redirect the browser:
        window.location.href = fileFullpath;
      } else {
        dispatch(
          open({
            severity: severity.error,
            message: 'An error occurred while downloading the document.',
          })
        );
      }
    } catch (error) {
      dispatch(
        open({
          severity: severity.error,
          message: 'An error occurred while downloading the document.',
        })
      );
    } finally {
      setLoading(false);
    }
  };
  const navigate = useNavigate();

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={3}
    >
      <Box sx={{ width: '100%' }}>
        <Grid container alignItems="center" sx={{ mt: 2 }}>
          <Grid item xs={12} md={12}>
            <Button
              id="upload-document-button"
              variant="outlined"
              onClick={() => {
                isFileView
                  ? navigate(`/dragdrop?fileId=${fileId}`, {
                      state: { isFileView: true },
                    })
                  : navigate(`/dragdrop?deedId=${deedId}`, {
                      state: { fileId: fileId, isFileView: false },
                    });
              }}
            >
              {t('upload')}
            </Button>
          </Grid>
          {(isLoading || isFetching) && (
            <Typography
              color="white"
              mt={2}
              mb={2}
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {t('fetching')}
              <CircularProgress
                size={20}
                sx={{ color: 'white', marginLeft: '10px' }}
              />
            </Typography>
          )}
          {!documents?.length && !deedDocuments?.length && !isFetching && (
            <Box>
              <Typography color="white" mt={2} mb={2} id="noDocsMsg">
                {t('noDocsMsg')}
              </Typography>
            </Box>
          )}

          {documents && documents?.length > 0 && (
            <Grid
              item
              xs={12}
              md={12}
              sx={{
                marginTop: '15px',
                marginBottom: '10px',
              }}
            >
              <Typography component="h5" id="documents-list-title">
                {t('documentDirectory')}
              </Typography>
            </Grid>
          )}

          <Grid container>
            {documents &&
              documents?.length > 0 &&
              documents.map((doc, index) => {
                return isMobile ? (
                  <>
                    <Grid
                      container
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        paddingTop: 0,
                        paddingBottom: 0,
                        height: { xs: 'auto', md: isMobile ? '50px' : '25px' },
                      }}
                      direction="row"
                    >
                      <Grid
                        item
                        xs={1}
                        md={1}
                        sx={{
                          display: 'flex',
                          justifyContent: { xs: 'start', md: 'start' },
                        }}
                      >
                        <IconButton
                          edge="start"
                          color="inherit"
                          aria-label="arrow"
                          id="file-document-list-icon"
                        >
                          <ArrowRightIcon sx={{ color: '#d2d3d6' }} />
                        </IconButton>
                      </Grid>
                      <Grid
                        item
                        xs={11}
                        md={5} // Occupies 6 columns on desktop
                        sx={{
                          display: 'flex',
                          justifyContent: { xs: 'start', md: 'start' },
                          marginBottom: { xs: '0px', md: '0px' },
                        }}
                      >
                        <Typography
                          sx={{
                            wordWrap: 'break-word', // Allows long words to be broken and wrapped to the next line
                            whiteSpace: 'normal', // Ensures whitespace is handled normally, allowing breaks
                            overflowWrap: 'break-word', // Alternative to 'wordWrap', more universally supported
                            width: '100%',
                          }}
                          id="file-document-name"
                        >
                          <Link
                            to={`/edit-document/${doc.id}?type=file&fileId=${fileId || ''}&deedId=${deedId || ''}&from=${from}`}
                            state={{
                              fileId: fileId,
                              deedId: deedId,
                              document: doc,
                              from: from,
                            }}
                            className="hover-link"
                          >
                            {doc.fileName}
                          </Link>
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        md={1}
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          maxWidth: { md: '3%' },
                          marginRight: '15px',
                          marginLeft: '15px',
                        }}
                      >
                        <IconButton
                          edge="start"
                          color="inherit"
                          aria-label="delete"
                          onClick={() => {
                            setSelectDocument(doc);
                            setIsFileDocument(true);
                            handleOpen();
                          }}
                          id="delete-file-document-icon"
                        >
                          <Tooltip title={t('delete')}>
                            <img
                              src={deleteImg}
                              alt="Delete"
                              width="20px"
                              height="20px"
                            />
                          </Tooltip>
                        </IconButton>
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        md={1}
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          maxWidth: { md: '3%' },
                          marginRight: '15px',
                        }}
                      >
                        <IconButton
                          edge="start"
                          color="inherit"
                          onClick={() => {
                            setSelectDocument(doc);
                            setIsFileDocument(true);
                            setFileName(removeFileType(doc.fileName || ''));
                            setExtension(getFileExtension(doc.fileName || ''));
                            handleEditOpen();
                          }}
                          id="rename-file-document-icon"
                        >
                          <Tooltip title={t('renameDocument')}>
                            <img
                              src={renameImg}
                              alt="Rename"
                              width="20px"
                              height="20px"
                            />
                          </Tooltip>
                        </IconButton>
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        md={1}
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          maxWidth: { md: '3%' },
                          marginRight: '15px',
                        }}
                      >
                        <IconButton
                          edge="start"
                          color="inherit"
                          onClick={() => handleDownload(doc.id, 'file')}
                          id="download-file-document-icon"
                        >
                          <Tooltip title={t('download')}>
                            <DownloadIcon sx={{ color: '#E2E3E6' }} />
                          </Tooltip>
                        </IconButton>
                      </Grid>
                      <Grid
                        item
                        xs={1}
                        md={4} // Occupies 3 columns on desktop
                        sx={{
                          display: 'flex',
                          justifyContent: { xs: 'center', md: 'start' }, // Centered in mobile, left-aligned in desktop
                          marginBottom: { xs: '0px', md: '0px' },
                          maxWidth: { md: '14%', xs: '100%' },
                        }}
                      >
                        <Typography noWrap id="file-document-date">
                          {formatDateTime(doc.updatedAt).toString()}
                        </Typography>
                      </Grid>
                    </Grid>
                    {isMobile && (
                      <Divider
                        sx={{
                          width: '100%',
                          borderColor: '#434857',
                        }}
                      />
                    )}
                  </>
                ) : (
                  <Grid
                    container
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      paddingTop: 0,
                      paddingBottom: 0,
                      height: { xs: 'auto', md: isMobile ? '50px' : '25px' },
                    }}
                    direction="row"
                  >
                    <Grid
                      item
                      xs={2}
                      md={1}
                      sx={{
                        display: 'flex',
                        justifyContent: { xs: 'start', md: 'start' },
                        maxWidth: { md: '3%' },
                      }}
                    >
                      <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="arrow"
                        id="file-document-list-icon"
                      >
                        <ArrowRightIcon sx={{ color: '#d2d3d6' }} />
                      </IconButton>
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      md={1}
                      sx={{
                        display: 'flex',
                        justifyContent: 'start',
                        maxWidth: { md: '3%' },
                      }}
                    >
                      <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="delete"
                        onClick={() => {
                          setSelectDocument(doc);
                          setIsFileDocument(true);
                          handleOpen();
                        }}
                        id="delete-file-document-icon"
                      >
                        <Tooltip title={t('delete')}>
                          <img
                            src={deleteImg}
                            alt="Delete"
                            width="20px"
                            height="20px"
                          />
                        </Tooltip>
                      </IconButton>
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      md={1}
                      sx={{
                        display: 'flex',
                        justifyContent: 'start',
                        cursor: 'pointer',
                        maxWidth: { md: '3%' },
                      }}
                    >
                      <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => {
                          setSelectDocument(doc);
                          setIsFileDocument(true);
                          setFileName(removeFileType(doc.fileName || ''));
                          setExtension(getFileExtension(doc.fileName || ''));
                          handleEditOpen();
                        }}
                        id="rename-file-document-icon"
                      >
                        <Tooltip title={t('renameDocument')}>
                          <img
                            src={renameImg}
                            alt="Rename"
                            width="20px"
                            height="20px"
                          />
                        </Tooltip>
                      </IconButton>
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      md={1}
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        maxWidth: { md: '3%' },
                        marginRight: '15px',
                      }}
                    >
                      <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => handleDownload(doc.id, 'file')}
                        id="download-file-document-icon"
                      >
                        <Tooltip title={t('download')}>
                          <DownloadIcon sx={{ color: '#E2E3E6' }} />
                        </Tooltip>
                      </IconButton>
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      md={4} // Occupies 3 columns on desktop
                      sx={{
                        display: 'flex',
                        justifyContent: { xs: 'start', md: 'start' }, // Centered in mobile, left-aligned in desktop
                        marginBottom: { xs: '0px', md: '0px' },
                        maxWidth: { md: '180px', xs: '100%' },
                      }}
                    >
                      <Typography noWrap id="file-document-date">
                        {formatDateTime(doc.updatedAt).toString()}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={5} // Occupies 6 columns on desktop
                      sx={{
                        display: 'flex',
                        justifyContent: { xs: 'start', md: 'start' },
                        marginBottom: { xs: '10px', md: '0px' },
                      }}
                    >
                      <Typography noWrap id="file-document-name">
                        <Link
                          className="hover-link"
                          to={`/edit-document/${doc.id}?type=file&fileId=${fileId || ''}&deedId=${deedId || ''}&from=${from}`}
                          state={{
                            fileId: fileId,
                            deedId: deedId,
                            document: doc,
                            from: from,
                          }}
                        >
                          {doc.fileName}
                        </Link>
                      </Typography>
                    </Grid>
                  </Grid>
                );
              })}
          </Grid>

          <Grid container mt={2}>
            {deedDocuments &&
              deedDocuments?.length > 0 &&
              deedDocuments.map((doc, index) => {
                return isMobile ? (
                  <>
                    <Grid
                      container
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        paddingTop: 0,
                        paddingBottom: 0,
                        height: { xs: 'auto', md: isMobile ? '50px' : '25px' },
                      }}
                      direction="row"
                    >
                      <Grid
                        item
                        xs={1}
                        md={1}
                        sx={{
                          display: 'flex',
                          justifyContent: { xs: 'start', md: 'start' },
                        }}
                      >
                        <IconButton
                          edge="start"
                          color="inherit"
                          aria-label="arrow"
                          id="deed-document-list-icon"
                        >
                          <ArrowRightIcon sx={{ color: '#d2d3d6' }} />
                        </IconButton>
                      </Grid>
                      <Grid
                        item
                        xs={11}
                        md={5} // Occupies 6 columns on desktop
                        sx={{
                          display: 'flex',
                          justifyContent: { xs: 'start', md: 'start' },
                          marginBottom: { xs: '0px', md: '0px' },
                        }}
                      >
                        <Typography
                          sx={{
                            wordWrap: 'break-word', // Allows long words to be broken and wrapped to the next line
                            whiteSpace: 'normal', // Ensures whitespace is handled normally, allowing breaks
                            overflowWrap: 'break-word', // Alternative to 'wordWrap', more universally supported
                            width: '100%',
                          }}
                          id="deed-document-name"
                        >
                          <Link
                            to={`/edit-document/${doc.id}?type=deed&fileId=${fileId || ''}&deedId=${deedId || ''}&from=${from}`}
                            state={{
                              fileId: fileId,
                              deedId: deedId,
                              document: doc,
                              from: from,
                            }}
                            className="hover-link"
                          >
                            {doc.fileName}
                          </Link>
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        md={1}
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          maxWidth: { md: '3%' },
                          marginRight: '15px',
                          marginLeft: '15px',
                        }}
                      >
                        <IconButton
                          edge="start"
                          color="inherit"
                          aria-label="delete"
                          onClick={() => {
                            setSelectDocument(doc);
                            setIsFileDocument(false);
                            handleOpen();
                          }}
                          id="delete-deed-document-icon"
                        >
                          <Tooltip title={t('delete')}>
                            <img
                              src={deleteImg}
                              alt="Delete"
                              width="20px"
                              height="20px"
                            />
                          </Tooltip>
                        </IconButton>
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        md={1}
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          maxWidth: { md: '3%' },
                          marginRight: '15px',
                        }}
                      >
                        <IconButton
                          edge="start"
                          color="inherit"
                          onClick={() => {
                            setSelectDocument(doc);
                            setIsFileDocument(false);
                            setFileName(removeFileType(doc.fileName || ''));
                            setExtension(getFileExtension(doc.fileName || ''));
                            handleEditOpen();
                          }}
                          id="rename-file-document-icon"
                        >
                          <Tooltip title={t('renameDocument')}>
                            <img
                              src={renameImg}
                              alt="Rename"
                              width="20px"
                              height="20px"
                            />
                          </Tooltip>
                        </IconButton>
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        md={1}
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          maxWidth: { md: '3%' },
                          marginRight: '15px',
                        }}
                      >
                        <IconButton
                          edge="start"
                          color="inherit"
                          onClick={() => handleDownload(doc.id, 'deed')}
                          id="download-deed-document-icon"
                        >
                          <Tooltip title={t('download')}>
                            <DownloadIcon sx={{ color: '#E2E3E6' }} />
                          </Tooltip>
                        </IconButton>
                      </Grid>
                      <Grid
                        item
                        xs={1}
                        md={4} // Occupies 3 columns on desktop
                        sx={{
                          display: 'flex',
                          justifyContent: { xs: 'center', md: 'start' }, // Centered in mobile, left-aligned in desktop
                          marginBottom: { xs: '0px', md: '0px' },
                          maxWidth: { md: '14%', xs: '100%' },
                        }}
                      >
                        <Typography noWrap id="deed-document-date">
                          {formatDateTime(doc.updatedAt).toString()}
                        </Typography>
                      </Grid>
                    </Grid>
                    {isMobile && (
                      <Divider
                        sx={{
                          width: '100%',
                          borderColor: '#434857',
                        }}
                      />
                    )}
                  </>
                ) : (
                  <Grid
                    container
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      paddingTop: 0,
                      paddingBottom: 0,
                      height: { xs: 'auto', md: isMobile ? '50px' : '25px' },
                    }}
                    direction="row"
                  >
                    <Grid
                      item
                      xs={2}
                      md={1}
                      sx={{
                        display: 'flex',
                        justifyContent: { xs: 'start', md: 'start' },
                        maxWidth: { md: '3%' },
                      }}
                    >
                      <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="arrow"
                        id="deed-document-list-icon"
                      >
                        <ArrowRightIcon sx={{ color: '#d2d3d6' }} />
                      </IconButton>
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      md={1}
                      sx={{
                        display: 'flex',
                        justifyContent: 'start',
                        maxWidth: { md: '3%' },
                      }}
                    >
                      <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="delete"
                        onClick={() => {
                          setSelectDocument(doc);
                          setIsFileDocument(false);
                          handleOpen();
                        }}
                        id="delete-deed-document-icon"
                      >
                        <Tooltip title={t('delete')}>
                          <img
                            src={deleteImg}
                            alt="Delete"
                            width="20px"
                            height="20px"
                          />
                        </Tooltip>
                      </IconButton>
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      md={1}
                      sx={{
                        display: 'flex',
                        justifyContent: 'start',
                        cursor: 'pointer',
                        maxWidth: { md: '3%' },
                      }}
                    >
                      <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => {
                          setSelectDocument(doc);
                          setIsFileDocument(false);
                          setFileName(removeFileType(doc.fileName || ''));
                          setExtension(getFileExtension(doc.fileName || ''));
                          handleEditOpen();
                        }}
                        id="rename-deed-document-icon"
                      >
                        <Tooltip title={t('renameDocument')}>
                          <img
                            src={renameImg}
                            alt="Rename"
                            width="20px"
                            height="20px"
                          />
                        </Tooltip>
                      </IconButton>
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      md={1}
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        maxWidth: { md: '3%' },
                        marginRight: '15px',
                      }}
                    >
                      <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => handleDownload(doc.id, 'deed')}
                        id="download-deed-document-icon"
                      >
                        <Tooltip title={t('download')}>
                          <DownloadIcon sx={{ color: '#E2E3E6' }} />
                        </Tooltip>
                      </IconButton>
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      md={4}
                      sx={{
                        display: 'flex',
                        justifyContent: { xs: 'start', md: 'start' }, // Centered in mobile, left-aligned in desktop
                        marginBottom: { xs: '0px', md: '0px' },
                        maxWidth: { md: '180px', xs: '100%' },
                      }}
                    >
                      <Typography noWrap id="deed-document-date">
                        {formatDateTime(doc.updatedAt).toString()}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={5} // Occupies 6 columns on desktop
                      sx={{
                        display: 'flex',
                        justifyContent: { xs: 'start', md: 'start' },
                        marginBottom: { xs: '10px', md: '0px' },
                      }}
                    >
                      <Typography noWrap id="deed-document-name">
                        <Link
                          to={`/edit-document/${doc.id}?type=deed&fileId=${fileId || ''}&deedId=${deedId || ''}&from=${from}`}
                          state={{
                            fileId: fileId,
                            deedId: deedId,
                            document: doc,
                            from: from,
                          }}
                          className="hover-link"
                        >
                          {doc.fileName}
                        </Link>
                      </Typography>
                    </Grid>
                  </Grid>
                );
              })}
          </Grid>
        </Grid>
      </Box>
      {selectDocument && openModel && (
        <CustomModel
          open={openModel}
          handleClose={handleClose}
          handleDelete={handleDelete}
          modalHeader={t('delete')}
          modalTitle={t('deleteMsg')}
          modalButtonLabel={t('delete')}
        />
      )}

      {selectDocument && confirmAllDelete && (
        <CustomModel
          open={confirmAllDelete}
          handleClose={() => setConfirmAllDelete(false)}
          handleDelete={handleConfirmAllDelete}
          modalHeader="Confirm Delete All"
          modalTitle="This document is being displayed more than once in this file. Do you want to delete all?"
          modalButtonLabel="Yes, Delete All"
        />
      )}

      {selectDocument && (
        <CustomEditModel
          open={openEditModel}
          handleClose={handleEditClose}
          handleUpdate={handleRename}
          modalHeader={t('renameDocument')}
          modalButtonLabel={t('save')}
          fileName={fileName}
          loading={loading}
          extension={extension}
        />
      )}
    </Stack>
  );
};

export default DocumentTab;
