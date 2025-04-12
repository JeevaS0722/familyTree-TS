import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { open } from '../../../store/Reducers/snackbar';
import { severity } from '../../../interface/snackbar';
import { useLazyGetGeneratedDocSignedUrlQuery } from '../../../store/Services/docService';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useGetOnlyOfficePrintTokenMutation } from '../../../store/Services/documentService';
import CustomizedDocumentEditor from '../../../component/CommonDoumentEditor';
import Grid from '@mui/material/Grid/Grid';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import OverlayLoader from '../../../component/common/OverlayLoader';

interface LocationState {
  docId: number;
}

const DocumentView: React.FC = () => {
  const { t: et } = useTranslation('errors');

  const location = useLocation();
  const { docId } = (location.state as LocationState) || {};
  const [getSignedUrl] = useLazyGetGeneratedDocSignedUrlQuery();
  const dispatch = useAppDispatch();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [token, setToken] = useState('');
  const [getOnlyOfficeToken] = useGetOnlyOfficePrintTokenMutation();
  const navigate = useNavigate();
  const user = useAppSelector(state => state.user);

  const handleGetSignedUrl = async (docId: number) => {
    try {
      const response = await getSignedUrl({ docId });
      if ('data' in response) {
        if (response?.data?.success) {
          setUrl(response.data.data.url);
          const parsedUrl = new URL(response.data.data.url);

          // Get the pathname (the part after the domain name)
          const pathname = parsedUrl.pathname;

          // Extract the file name from the pathname
          const fileName = pathname.substring(pathname.lastIndexOf('/') + 1);
          setFileName(fileName);
          void getOnlyOfficeToken({
            id: Number(docId),
            type: 'doc',
            fileURL: response.data.data.url,
          })
            .then(({ data }) => {
              if (data?.data) {
                setToken(data?.data.onlyOfficeToken);
                setLoading(false);
              }
            })
            .catch(err => err);
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

  useEffect(() => {
    void handleGetSignedUrl(Number(docId));
  }, [docId]);

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
            {!loading && url ? (
              <>
                <Grid
                  container
                  sx={{
                    fontSize: '14px',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}
                >
                  <Grid item xs={12} sm={4}>
                    <Link
                      className="hover-link-span text-decoration-none"
                      id="goToFileView"
                      to="/document/report"
                    >
                      <KeyboardBackspaceIcon
                        sx={{
                          fontSize: '20px',
                        }}
                      />
                      Back to Table View
                    </Link>
                  </Grid>
                </Grid>
                <CustomizedDocumentEditor
                  id={docId}
                  fileName={fileName}
                  url={url}
                  userId={user.userId}
                  mode="edit"
                  token={token}
                  from="doc"
                  isSave={false}
                />
              </>
            ) : (
              <OverlayLoader open />
            )}
          </Box>
        </Box>
      </Stack>
    </Container>
  );
};

export default DocumentView;
