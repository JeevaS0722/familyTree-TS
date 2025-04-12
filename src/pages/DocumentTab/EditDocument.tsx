import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  useGetOnlyOfficeTokenMutation,
  useLazyGetDocumentQuery,
} from '../../store/Services/documentService';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid/Grid';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ReactToPrint from 'react-to-print';
import Button from '@mui/material/Button/Button';
import { Document } from '../../interface/document';
import CustomizedDocumentEditor from '../../component/CommonDoumentEditor';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import Typography from '@mui/material/Typography';
import CustomSpinner from '../../component/common/CustomSpinner';
import { useTranslation } from 'react-i18next';
import OverlayLoader from '../../component/common/OverlayLoader';
import CircularProgress from '@mui/material/CircularProgress';

import { open } from '../../store/Reducers/snackbar';
import { severity } from '../../interface/snackbar';

const EditDocument: React.FC = () => {
  const { doc_id } = useParams();
  const user = useAppSelector(state => state.user);
  const { t: ct } = useTranslation('common');
  const location = useLocation();

  // Create a URLSearchParams object to extract query parameters
  const searchParams = new URLSearchParams(location.search);

  // Get specific query parameters
  const type = searchParams.get('type') as string;
  const from = searchParams.get('from') as string;
  const deedId = searchParams.get('deedId') as string;
  const fileId = searchParams.get('fileId') as string;
  const dispatch = useAppDispatch();

  const [getOnlyOfficeToken] = useGetOnlyOfficeTokenMutation();
  const [getDocument, { isFetching }] = useLazyGetDocumentQuery();
  const [token, setToken] = useState('');
  const [imageLoading, setImageLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [docLoading, setDocLoading] = useState(true);

  const [document, setDocument] = useState<Document>();
  useEffect(() => {
    if (doc_id) {
      void getDocument({ id: Number(doc_id), type: type })
        .then(({ data }) => {
          setDocument(data?.data?.document as Document);
          void getOnlyOfficeToken({
            id: Number(doc_id),
            isFileDocument: type === 'file',
            isEditor: true,
          })
            .then(({ data }) => {
              if (data?.data) {
                setToken(data?.data.onlyOfficeToken);
                setLoading(false);
              }
            })
            .catch(err => err);
        })
        .catch(err => err);
    }
  }, [doc_id]);

  const isFileDocument = document && document.fileId ? 'file' : 'deed';

  const fileTypes = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
  };

  const componentRef = useRef<HTMLDivElement>(null);

  const isImageFile = (fileName: string) => {
    const ext = fileName
      .slice(((fileName.lastIndexOf('.') - 1) >>> 0) + 2)
      .toLowerCase();
    return fileTypes['image/*'].includes(`.${ext}`);
  };

  const isImage = document ? isImageFile(document.fileName) : false;

  const handleImageLoad = () => {
    setImageLoading(false); // Hide loader when image has loaded
  };

  const handleDownload = async () => {
    const id = doc_id;
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
      setDocLoading(true);
      const documentResponse = await getDocument({
        id: Number(id),
        type: type,
        action: 'download',
      }).unwrap();

      if (
        documentResponse?.data?.document &&
        documentResponse?.data?.document?.fileFullpath
      ) {
        const { fileFullpath } = documentResponse.data.document;
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
      setDocLoading(false);
    }
  };

  return (
    <Container component="main" fixed sx={{ marginTop: 2 }}>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <Box sx={{ width: '100%' }}>
          {!loading ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Grid
                container
                sx={{
                  fontSize: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {from === 'file' && (
                  <Grid item>
                    <Link
                      className="hover-link-span text-decoration-none"
                      id="goToFileView"
                      to={`/editfile/${Number(fileId)}?tab=docs`}
                    >
                      <KeyboardBackspaceIcon
                        sx={{
                          fontSize: '20px',
                        }}
                      />
                      Go to File View
                    </Link>
                  </Grid>
                )}
                {from !== 'file' && (
                  <Grid item>
                    <Link
                      className="hover-link-span text-decoration-none"
                      id="goToFileView"
                      to={`/editdeed/${Number(deedId)}?tab=docs`}
                    >
                      <KeyboardBackspaceIcon
                        sx={{
                          fontSize: '20px',
                        }}
                      />
                      Go to Deed View
                    </Link>
                  </Grid>
                )}
                <Grid item>
                  <Box display="flex" gap={2}>
                    {isImage && (
                      <ReactToPrint
                        trigger={() => (
                          <Button
                            variant="outlined"
                            sx={{
                              '&:disabled': {
                                opacity: 0.2,
                                cursor: 'not-allowed',
                                borderColor: '#1997c6',
                                color: '#fff',
                              },
                              display: imageLoading ? 'none' : 'unset',
                            }}
                            disabled={imageLoading}
                          >
                            Print
                          </Button>
                        )}
                        content={() => componentRef.current}
                      />
                    )}
                    <Button
                      variant="outlined"
                      onClick={() => handleDownload()}
                      sx={{
                        '&:disabled': {
                          opacity: 0.2,
                          cursor: 'not-allowed',
                          borderColor: '#1997c6',
                          color: '#fff',
                        },
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      disabled={isFetching && docLoading}
                    >
                      Download
                      {isFetching && docLoading && (
                        <CircularProgress
                          size={16}
                          sx={{ ml: 1, color: 'inherit' }}
                        />
                      )}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
              {document && (
                <Box sx={{ width: '100%' }}>
                  {isImage ? (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: 2,
                      }}
                    >
                      {imageLoading && ( // Show loader while image is loading
                        <Typography
                          variant="body2"
                          color="white"
                          sx={{ my: 2 }}
                        >
                          <CustomSpinner loadingText={ct('fetchingData')} />
                        </Typography>
                      )}
                      <Box ref={componentRef}>
                        <img
                          src={document.fileFullpath}
                          alt={document.fileName}
                          width="100%"
                          className={
                            imageLoading ? 'display-none' : 'display-block'
                          }
                          onLoad={handleImageLoad} // Set loading to false when image is loaded
                        />
                      </Box>
                    </Box>
                  ) : (
                    <CustomizedDocumentEditor
                      id={Number(document.id)}
                      fileName={document.fileName}
                      url={document.fileFullpath}
                      userId={user.userId}
                      mode="edit"
                      token={token}
                      from={isFileDocument}
                      isSave={true}
                    />
                  )}
                </Box>
              )}
            </Box>
          ) : (
            <OverlayLoader open />
          )}
        </Box>
      </Stack>
    </Container>
  );
};

export default EditDocument;
