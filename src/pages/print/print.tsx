/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGetOnlyOfficePrintTokenMutation } from '../../store/Services/documentService';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid/Grid';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {
  useLazyPrintFileQuery,
  useLazyPrintDeedQuery,
} from '../../store/Services/fileService';
import { useAppSelector } from '../../store/hooks';
import CustomizedDocumentEditor from '../../component/CommonDoumentEditor';
import OverlayLoader from '../../component/common/OverlayLoader';

const Print: React.FC = () => {
  const [getOnlyOfficeToken] = useGetOnlyOfficePrintTokenMutation();
  const [printFile] = useLazyPrintFileQuery();
  const [printDeed] = useLazyPrintDeedQuery();
  const [token, setToken] = useState('');

  const location = useLocation();
  const { fileId, deedId } = location.state;
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const user = useAppSelector(state => state.user);

  const isFileDocument = location.state.fileId ? 'file' : 'deed';

  useEffect(() => {
    setLoading(true);
    if (fileId) {
      void printFile({
        fileId: Number(fileId),
      })
        .then(({ data }) => {
          if (data) {
            setUrl(data.fileURL);
            const parsedUrl = new URL(data.fileURL);

            // Get the pathname (the part after the domain name)
            const pathname = parsedUrl.pathname;

            // Extract the file name from the pathname
            const fileName = pathname.substring(pathname.lastIndexOf('/') + 1);
            setFileName(fileName);
            void getOnlyOfficeToken({
              id: Number(fileId),
              type: 'file',
              fileURL: data.fileURL,
            })
              .then(({ data }) => {
                if (data?.data) {
                  setToken(data?.data.onlyOfficeToken);
                  setLoading(false);
                }
              })
              .catch(err => err);
          }
        })
        .catch(err => err);
    }

    if (deedId) {
      void printDeed({
        deedId: Number(deedId),
      })
        .then(({ data }) => {
          if (data) {
            setUrl(data.fileURL);
            const parsedUrl = new URL(data.fileURL);

            const pathname = parsedUrl.pathname;

            const fileName = pathname.substring(pathname.lastIndexOf('/') + 1);
            setFileName(fileName);
            void getOnlyOfficeToken({
              id: Number(deedId),
              type: 'deed',
              fileURL: data.fileURL,
            })
              .then(({ data }) => {
                if (data?.data) {
                  setToken(data?.data.onlyOfficeToken);
                  setLoading(false);
                }
              })
              .catch(err => err);
          }
        })
        .catch(err => err);
    }
  }, []);

  const navigate = useNavigate();

  return (
    <Container component="main" fixed sx={{ marginTop: 2 }}>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <Box sx={{ width: '100%' }}>
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
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              {location.state.fileId && (
                <Grid item xs={12} sm={4}>
                  <Link
                    id="goToFileView"
                    className="hover-link-span text-decoration-none"
                    to={`/editfile/${Number(location.state?.fileId)}`}
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
              {location.state.deedId && (
                <Grid item xs={12} sm={4} sx={{ mt: { xs: 2, sm: 0 } }}>
                  <Box
                    display="flex"
                    justifyContent={{ xs: 'flex-start' }}
                    alignItems="center"
                  >
                    <Link
                      id="goToContactView"
                      className="hover-link-span text-decoration-none"
                      to={`/editdeed/${Number(location.state.deedId)}`}
                    >
                      <KeyboardBackspaceIcon
                        sx={{
                          fontSize: '20px',
                        }}
                      />
                      Go to Deed View
                    </Link>
                  </Box>
                </Grid>
              )}
            </Grid>

            {!loading && url ? (
              <CustomizedDocumentEditor
                id={fileId || deedId}
                fileName={fileName}
                url={url}
                userId={user.userId}
                mode="view"
                token={token}
                isSave={false}
                from={isFileDocument}
              />
            ) : (
              <OverlayLoader open />
            )}
          </Box>
        </Box>
      </Stack>
    </Container>
  );
};

export default Print;
