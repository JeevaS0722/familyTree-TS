import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { DocumentEditor } from '@onlyoffice/document-editor-react';
import { DocumentEditorProps } from '../interface/common';
import { OnlyOfficeDocumentType } from '../utils/constants';
import { useGetUserQuery } from '../store/Services/userService';
import { useAppSelector } from '../store/hooks';
import Typography from '@mui/material/Typography';
import OverlayLoader from './common/OverlayLoader';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import useWindowDimensions from '../hooks/useWindowDimensions';
const documentServerUrl = process.env
  .REACT_APP_ONLY_OFFICE_SERVER_URL as string;
const CustomizedDocumentEditor: React.FC<DocumentEditorProps> = ({
  fileName,
  id,
  url,
  mode,
  token,
  from,
  isSave = false,
}) => {
  useGetUserQuery('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { width, height } = useWindowDimensions();
  const [isServerDown, setIsServerDown] = useState(false);
  const [loading, setLoading] = useState(true);
  const { userId, fullName } = useAppSelector(state => state.user);
  const fileType = fileName.split('.').pop() || '';
  const documentType = fileType
    ? OnlyOfficeDocumentType[fileType as keyof typeof OnlyOfficeDocumentType] ||
      'word'
    : 'word';
  let callbackObj = {};
  let dimensions = {};
  if (isSave) {
    callbackObj = {
      callbackUrl: `${process.env.REACT_APP_API_BASE_URL}/document/only-office/callback?id=${id}&from=${from}&userId=${userId}`,
    };
  }
  if (isMobile) {
    dimensions = {
      height: `${height - 190}px`,
      width: `${width - 40}px`,
    };
  } else {
    dimensions = {
      height: `${height - 190}px`,
    };
  }
  const handleReady = () => {
    setIsServerDown(false);
    setLoading(false);
  };
  const handleLoadError = () => {
    setIsServerDown(true);
    setLoading(false);
  };
  return (
    <Box
      sx={{
        width: '100%',
        justifyContent: 'center',
        marginTop: '10px',
      }}
    >
      <Box>
        {loading && <OverlayLoader open />}
        {isServerDown ? (
          <Typography
            sx={{
              textAlign: 'center',
            }}
          >
            The document Editor server is currently unavailable. Please try
            again later.
          </Typography>
        ) : (
          <DocumentEditor
            id="docxEditor"
            documentServerUrl={documentServerUrl}
            config={{
              document: {
                fileType: fileType,
                title: fileName,
                url: url,
                permissions: {
                  chat: false,
                  comment: false,
                  copy: false,
                  deleteCommentAuthorOnly: false,
                  download: !isSave,
                  edit: !!isSave,
                  editCommentAuthorOnly: false,
                  fillForms: false,
                  modifyContentControl: false,
                  print: true,
                  protect: false,
                  review: false,
                },
              },
              editorConfig: {
                user: {
                  name: fullName || '',
                  id: userId || '',
                },
                mode: isSave ? 'edit' : mode || 'view',
                customization: {
                  forcesave: isSave,
                  autosave: false,
                },
                ...callbackObj,
              },
              documentType: documentType,
              token: token,
              type: isMobile ? 'mobile' : 'desktop',
              ...dimensions,
            }}
            events_onAppReady={() => handleReady()}
            onLoadComponentError={() => handleLoadError()}
          />
        )}
      </Box>
    </Box>
  );
};

export default CustomizedDocumentEditor;
