/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { CSSProperties, useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useDropzone, Accept } from 'react-dropzone';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import { styled, useTheme } from '@mui/material/styles';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import {
  useDeleteDocumentMutation,
  useGetDuplicateDocumentListMutation,
  useUploadDocumentDeedMutation,
  useUploadDocumentFileMutation,
} from '../../store/Services/documentService';
import Grid from '@mui/material/Grid/Grid';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { AxiosProgressEvent } from 'axios';
import useMediaQuery from '@mui/material/useMediaQuery';
import DuplicateDialog from './DuplicateCheckDialog';
import {
  DuplicateDocumentListResponse,
  DuplicateFile,
} from '../../interface/document';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

const allowedFileTypes: Accept = {
  'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    '.docx',
  ],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
    '.xlsx',
  ],
};

interface FileWithPreview extends File {
  preview: string;
  progress: number;
  error?: string;
  uniqueFileId: string;
  action: string | null;
  isUploaded?: boolean;
  fileName: string;
  relativePath: string;
  isRenamed?: boolean;
  isOverridden?: boolean;
  path: string;
  originalName: string;
  createdAtUnique: string;
}
interface MyDropzoneProps {
  fileId?: string | number | null;
  deedId?: string | number | null;
  isFileView?: boolean;
}
const MyDropzone: React.FC<MyDropzoneProps> = ({
  fileId,
  deedId,
  isFileView,
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [deleteDocument] = useDeleteDocumentMutation();
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [uploadedDocument, setUploadedDocument] = useState<{
    [key: string]: string | number;
  }>({});
  const [uploadFileDocument] = useUploadDocumentFileMutation();
  const [uploadDeedDocument] = useUploadDocumentDeedMutation();
  const [localDuplicates, setLocalDuplicates] = useState<any[]>([]);
  const [dbDuplicates, setDbDuplicates] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [getDuplicateDocumentList] = useGetDuplicateDocumentListMutation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showCross, setShowCross] = useState<{
    [key: string]: [boolean, boolean];
  }>({});
  const isValidFileType = (file: File) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    return Object.values(allowedFileTypes).some(types =>
      types.includes(`.${fileExtension}`)
    );
  };
  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: { file: File }[]) => {
      setIsLoading(true);
      const remainingUploadCount = 20 - files.length;

      // Prevent uploading more than the allowed files
      if (remainingUploadCount <= 0) {
        const rejectedFilesWithError = acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            error: 'You cannot upload any more files.',
            progress: 0,
            uniqueFileId: `${file.name}-${new Date().getTime()}`,
            createdAtUnique: `id-${file.name}-${new Date().getTime()}`,
          })
        );
        setFiles(prevFiles => [...prevFiles, ...rejectedFilesWithError]);
        return;
      }

      // Step 1: Slice valid files based on remaining upload count
      const validFiles = acceptedFiles.slice(0, remainingUploadCount);
      const rejectedFilesWithPreview = acceptedFiles
        .slice(remainingUploadCount)
        .map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            error: 'You cannot upload any more files.',
            progress: 0,
            uniqueFileId: `${file.name}-${new Date().getTime()}`,
            createdAtUnique: `id-${file.name}-${new Date().getTime()}`,
          })
        );

      // Step 2: Add previews and unique identifiers for valid files
      const filesWithPreview = validFiles.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          progress: 0,
          uniqueFileId: `${file.name}-${new Date().getTime()}`,
          createdAtUnique: `id-${file.name}-${new Date().getTime()}`,
        })
      );

      // Update state with rejected files and valid files
      setFiles(prevFiles => [
        ...prevFiles,
        ...filesWithPreview,
        ...rejectedFilesWithPreview,
      ]);
      const rejectedWithPreview = rejectedFiles.map(file => {
        let error: string = file.file.error;
        if (!isValidFileType(file.file)) {
          error = `You can't upload files of this type.`;
        }
        if (file.file.size > 256 * 1024 * 1024) {
          error = `File is too big ${(file.file.size / (1024 * 1024)).toFixed()}MiB. Max filesize: {{256}}MiB.`;
        }

        return Object.assign(file.file, {
          preview: URL.createObjectURL(file.file),
          progress: 0,
          error: error,
          uniqueFileId: `${file.file.name}-${new Date().getTime()}`,
          createdAtUnique: `id-${file.file.name}-${new Date().getTime()}`,
        });
      });

      setFiles(prevFiles => [...prevFiles, ...rejectedWithPreview]);
      // Step 3: Local duplicate check
      const filenames = [...filesWithPreview].map(file => file.name);

      // Exclude already uploaded files when checking for duplicates
      const existingFiles = files
        .filter(file => !file?.isUploaded) // Only include non-uploaded files
        .map(file => file.name);

      // Identify duplicates in `filesWithPreview` and `existingFiles`
      const localDuplicates = filenames.filter(
        (name, index) =>
          filenames.indexOf(name) !== index || existingFiles.includes(name)
      );

      // If local duplicates are found, set state and open the dialog
      if (localDuplicates.length > 0) {
        // Prepare local duplicates data for the dialog
        const localDuplicateDetails = localDuplicates.map(name => ({
          fileName: name, // Name of the duplicate file
          orgFilename: name, // Original file name
          fileType: name.split('.').pop() || '', // Extract file type from name
          action: null, // No action selected yet
          type: 'local', // Mark as a local duplicate
          isRemoved: false, // Initialize as not removed
          isEditing: false, // Initialize as not in editing mode
        }));

        setLocalDuplicates(localDuplicateDetails);
        setIsDialogOpen(true);
        return;
      }
      // Step 4: API call for database duplicate check
      try {
        const response: DuplicateDocumentListResponse =
          await getDuplicateDocumentList({
            fileId: Number(fileId) || 0,
            deedId: Number(deedId) || 0,
            filenames,
          }).unwrap();
        // If database duplicates are found, set state and open the dialog
        if (response?.data?.duplicates?.length > 0) {
          const data = response?.data?.duplicates || [];
          // Prepare database duplicates data for the dialog
          const dbDuplicateDetails: DuplicateFile[] = data.map((doc: any) => ({
            fileName: doc.fileName,
            orgFilename: doc.fileName,
            fileType: doc?.fileName?.split('.')?.pop() || '',
            action: null, // Default action
            type: 'db', // Mark as database duplicate
            deedId: doc.deedId || null,
            fileId: doc.fileId || null,
            isRemoved: false, // Initialize as not removed
            isEditing: false,
            ...doc,
          }));
          setDbDuplicates(dbDuplicateDetails);
          setIsDialogOpen(true);
        } else {
          // If no duplicates in DB, proceed with uploading files
          filesWithPreview.forEach(async file => {
            setUploadProgress(prev => ({
              ...prev,
              [file.uniqueFileId]: 0,
            }));

            if (file.size < 256 * 1024 * 1024) {
              await uploadFile(file);
            }
          });
        }
      } catch (error) {
        // console.error('Error checking duplicates in the database:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [files, getDuplicateDocumentList]
  );

  // Handle dialog "Done" action
  const handleDialogDone = (updateData: DuplicateFile[]) => {
    if (!updateData || updateData.length === 0) {
      return;
    }

    // **Step 1: Filter out files marked for deletion but keep already uploaded files**
    let filesToKeep = files.filter(file => {
      const isMarkedForRemoval = updateData.some(
        updatedFile =>
          updatedFile.isRemoved && updatedFile.orgFilename === file.name
      );

      // **Check if file is already uploaded using `uploadedDocument`**
      const isAlreadyUploaded =
        uploadedDocument[file.createdAtUnique] !== undefined;
      // **Skip removal if the file is already uploaded**
      return !isMarkedForRemoval || isAlreadyUploaded;
    });

    // **Step 2: Apply modifications (rename, override)**
    filesToKeep = filesToKeep.map(file => {
      const updatedFileData = updateData.find(
        updatedFile => updatedFile.orgFilename === file.name
      );
      if (updatedFileData) {
        return {
          ...file, // Preserve all existing properties
          name: updatedFileData.fileName, // Store new name
          isRenamed: updatedFileData.action === 'rename',
          isOverridden: updatedFileData.action === 'override',
          originalName: updatedFileData.orgFilename, // Keep track of original name
          action: updatedFileData.action, // Ensure action is passed to API
          path: file.path,
          preview: file.preview,
          lastModified: file.lastModified,
          size: file.size,
          type: file.type,
          webkitRelativePath: file.webkitRelativePath,
        };
      }

      return file; // Keep other files unchanged
    });

    // **Step 3: Update state with modified file list**
    setFiles(filesToKeep);

    // **Step 4: Reset duplicate states and close the dialog**
    setLocalDuplicates([]);
    setDbDuplicates([]);
    setIsDialogOpen(false);

    // **Step 5: Upload files (convert modified files into `File` instances if needed)**
    filesToKeep.forEach(async file => {
      if (
        !uploadedDocument[file.createdAtUnique] &&
        file.size < 256 * 1024 * 1024
      ) {
        let uploadFileData = file;

        // **Ensure renamed or overridden files retain all properties and correct size**
        if (file.isRenamed || file.isOverridden) {
          const fileBlob = await fetch(file.preview).then(res => res.blob());

          // ✅ Preserve all properties and create a new File-like object
          uploadFileData = Object.assign(
            new File([fileBlob], file.name, {
              type: file.type,
              lastModified: file.lastModified,
            }),
            {
              path: file.path,
              preview: file.preview,
              progress: file.progress,
              relativePath: file.relativePath,
              uniqueFileId: file.uniqueFileId,
              isRenamed: file.isRenamed,
              isOverridden: file.isOverridden,
              originalName: file.fileName,
              action: file.action, // Ensure action is passed to API
              fileName: file.name,
              createdAtUnique: file.createdAtUnique,
            }
          );
        }

        // **Set upload progress and upload the file**
        setUploadProgress(prev => ({
          ...prev,
          [file.uniqueFileId]: 0,
        }));
        await uploadFile(uploadFileData);
      }
    });
  };

  // Handle dialog "Cancel" action
  const handleDialogCancel = () => {
    // Reset local and database duplicates
    setLocalDuplicates([]);
    setDbDuplicates([]);
    setIsDialogOpen(false);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: allowedFileTypes,
    maxSize: 256 * 1024 * 1024,
  });

  const removeFile = async (file: FileWithPreview) => {
    setFiles(files.filter(f => f !== file));
    setShowCross(prev => {
      const showCross = { ...prev };
      delete showCross[file.uniqueFileId];
      return showCross;
    });
    setUploadProgress(prev => {
      const updatedProgress = { ...prev };
      delete updatedProgress[file.uniqueFileId];
      return updatedProgress;
    });
    const selectDocument = uploadedDocument[file.uniqueFileId];
    setUploadedDocument(prev => {
      const uploadedDocument = { ...prev };
      delete uploadedDocument[file.uniqueFileId];
      delete uploadedDocument[file.createdAtUnique];
      return uploadedDocument;
    });
    if (selectDocument) {
      return deleteDocument({
        id: Number(selectDocument),
        isFileDocument: isFileView,
      });
    }
  };

  const isImage = (file: File) => {
    return file.type.startsWith('image/');
  };

  const truncateFileName = (name: string, length: number) => {
    return name.length > length ? name.slice(0, length) + '...' : name;
  };

  const uploadFile = async (file: FileWithPreview) => {
    const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
      const total = progressEvent.total || 1;
      const progress = Math.round((progressEvent.loaded * 100) / total);
      setUploadProgress(prev => {
        return { ...prev, [file.uniqueFileId]: progress };
      });
    };
    const formData = new FormData();
    formData.append('file', file);
    formData.append('action', file.action || '');
    if (fileId && isFileView) {
      formData.append('fileId', String(fileId));
      await uploadFileDocument({
        formData: formData,
        onUploadProgress,
      })
        .then(data => {
          let hasError = false;
          if ('error' in data) {
            hasError = true;
          } else {
            setUploadedDocument(prevState => ({
              ...prevState,
              [file.uniqueFileId]: data.data?.data?.[0]?.doc_id,
              [file.createdAtUnique]: file.createdAtUnique,
            }));
          }
          setShowCross(prev => ({
            ...prev,
            [file.uniqueFileId]: [hasError, true],
          }));
        })
        .catch(err => err);
    }
    if (deedId) {
      formData.append('deedId', String(deedId));
      await uploadDeedDocument({ formData: formData, onUploadProgress })
        .then(data => {
          let hasError = false;
          if ('error' in data) {
            hasError = true;
          } else {
            setUploadedDocument(prevState => ({
              ...prevState,
              [file.uniqueFileId]: data.data?.data?.[0]?.doc_id,
              [file.createdAtUnique]: file.createdAtUnique,
            }));
          }
          setShowCross(prev => ({
            ...prev,
            [file.uniqueFileId]: [hasError, true],
          }));
        })
        .catch(err => err);
    }
  };

  const dropzoneContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    border: '2px dashed #cccccc',
    borderRadius: '5px',
    backgroundColor: '#fff',
    width: '100%',
    minHeight: '250px',
    maxHeight: 'auto',
  };

  const dropzoneStyle: CSSProperties = {
    textAlign: 'center',
    cursor: 'pointer',
    color: '#000',
    width: '100%',
    minHeight: '250px',
    maxHeight: 'auto',
  };

  const filesPreviewStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '10px',
    color: '#000',
    maxHeight: 'calc(100% - 40px)',
    overflowY: 'auto',
  };

  const fileItemStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '150px',
    height: '150px',
    margin: '10px',
    padding: '10px',
    border: '1px solid #cccccc',
    borderRadius: '5px',
    position: 'relative',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const fileInfoOverlayStyle: CSSProperties = {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    color: '#ffff',
    padding: '5px',
    textAlign: 'center',
    width: '100%',
    backgroundColor: '#eeeeee00',
  };

  const removeButtonStyle: CSSProperties = {
    position: 'absolute',
    top: '2px',
    right: '2px',
    background: 'transparent',
    border: 'none',
    color: '#aba9a9e6',
    cursor: 'pointer',
    zIndex: 10,
  };

  const iconStyle: CSSProperties = {
    fontSize: '1.5rem',
  };

  const imageStyle: CSSProperties = {
    width: '120px',
    height: '120px',
    marginBottom: '10px',
    cursor: 'default',
  };

  const otherFileStyle: CSSProperties = {
    width: '130px',
    height: '130px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    marginBottom: '10px',
    fontSize: '12px',
    textAlign: 'center',
    padding: '10px',
    boxSizing: 'border-box',
  };

  const InvalidFileItemStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '150px',
    height: '150px',
    margin: '10px',
    padding: '10px',
    border: `2px solid #f44336`,
    borderRadius: '15px',
    position: 'relative',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const inputStyle: CSSProperties = {
    top: 0,
    left: 0,
    width: '100%',

    opacity: 0,
    cursor: 'pointer',
  };

  return (
    <Box sx={dropzoneContainerStyle}>
      <Box {...getRootProps({ style: dropzoneStyle })}>
        <input {...getInputProps()} style={inputStyle} />
        {!files.length && (
          <Typography id="drop-drag-msg">
            Drag and Drop documents here to upload, or click here to browse for
            documents
          </Typography>
        )}
        <Box sx={filesPreviewStyle}>
          {files.map((file, index) => {
            return file.error ? (
              <Box
                key={index}
                sx={InvalidFileItemStyle}
                onClick={event => {
                  event.stopPropagation();
                  event.preventDefault();
                }}
              >
                {isImage(file) ? (
                  <img
                    src={(file as any).preview}
                    alt={file.name}
                    style={imageStyle}
                    id="error-img"
                  />
                ) : (
                  <Box sx={otherFileStyle}>
                    <Typography id="error-text-file">
                      {truncateFileName(file.name, 10)}
                    </Typography>

                    <br />
                    <Typography
                      sx={{ fontSize: '0.7rem', color: '#f44336' }}
                      id="error-msg-file"
                    >
                      {file.error}
                    </Typography>
                  </Box>
                )}
                <Box sx={fileInfoOverlayStyle}>
                  {isImage(file) && (
                    <Box
                      sx={{
                        opacity: 1,
                        backgroundColor: '#00000080',
                        transition: 'opacity 0.3s',
                        '&:hover': {
                          opacity: 1,
                        },
                      }}
                    >
                      <Typography id="img-error-text">
                        {truncateFileName(file.name, 20)}
                      </Typography>

                      <Typography
                        sx={{ fontSize: '0.7rem', color: '#f44336' }}
                        id="img-error-msg"
                      >
                        {file.error}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <IconButton
                  sx={removeButtonStyle}
                  onClick={event => {
                    event.stopPropagation();
                    event.preventDefault();
                    void removeFile(file);
                  }}
                  id="error-cross-button"
                >
                  <CancelIcon sx={iconStyle} />
                </IconButton>
              </Box>
            ) : (
              <Tooltip
                title={file.name}
                arrow
                key={index}
                onClick={event => {
                  event.stopPropagation();
                  event.preventDefault();
                }}
              >
                <Box key={index} sx={fileItemStyle}>
                  {isImage(file) ? (
                    <img
                      src={(file as any).preview}
                      alt={file.name}
                      style={imageStyle}
                      id="valid-img"
                    />
                  ) : (
                    <Box sx={otherFileStyle}>
                      <Typography id="text-file">
                        {truncateFileName(file.name, 10)}
                      </Typography>

                      <br />
                      <Typography id="file=size">
                        {(file.size / 1024).toFixed(2)} KB
                      </Typography>
                    </Box>
                  )}
                  <Box sx={fileInfoOverlayStyle}>
                    {isImage(file) && (
                      <Box
                        sx={{
                          opacity: isMobile ? 1 : 0,
                          backgroundColor: '#00000080',
                          transition: 'opacity 0.3s',
                          '&:hover': {
                            opacity: 1,
                          },
                        }}
                      >
                        <Typography id="img-name">
                          {truncateFileName(file.name, 10)}
                        </Typography>

                        <Typography id="img-size">
                          {(file.size / 1024).toFixed(2)} KB
                        </Typography>
                      </Box>
                    )}
                    {showCross[file.uniqueFileId]?.[1] ? (
                      <Typography
                        sx={{
                          width: '100%',
                          marginTop: '5px',
                          color: showCross[file.uniqueFileId]?.[0]
                            ? '#f44336'
                            : 'rgb(25, 151, 198)',
                          lineHeight: '0.5',
                        }}
                        id="success-msg"
                      >
                        {showCross[file.uniqueFileId]?.[0]
                          ? 'Fail'
                          : 'Uploaded'}
                      </Typography>
                    ) : (
                      <BorderLinearProgress
                        variant="determinate"
                        value={uploadProgress[file.uniqueFileId] || 0}
                        sx={{ width: '100%', marginTop: '5px' }}
                        id="progress-bar"
                      />
                    )}
                  </Box>
                  {showCross[file.uniqueFileId]?.[1] ? (
                    <IconButton
                      sx={removeButtonStyle}
                      onClick={event => {
                        event.stopPropagation();
                        event.preventDefault();
                        void removeFile(file);
                      }}
                      id="cross-button"
                    >
                      <CancelIcon sx={iconStyle} />
                    </IconButton>
                  ) : (
                    ''
                  )}
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </Box>
      {/* Duplicate dialog */}
      {isDialogOpen && (
        <DuplicateDialog
          fileId={Number(fileId) || 0}
          deedId={Number(deedId) || 0}
          open={isDialogOpen}
          localDuplicates={localDuplicates.map(file => ({
            ...file,
            type: 'local',
            action: null,
          }))}
          dbDuplicates={dbDuplicates.map(file => ({
            ...file,
            action: null,
          }))}
          onCancel={handleDialogCancel}
          onDone={updateData => handleDialogDone(updateData)}
        />
      )}
    </Box>
  );
};

const UploadDocument: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const fileId = searchParams.get('fileId')
    ? searchParams.get('fileId')
    : location.state.fileId;
  const deedId = searchParams.get('deedId');
  const isFileView = location.state.isFileView;

  return (
    <Container component="main" fixed sx={{ marginTop: 2 }}>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <Grid
          container
          sx={{
            mt: 2,
            fontSize: '14px',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          {isFileView && (
            <Grid item xs={12} sm={4}>
              <Link
                id="goToFileView"
                className="hover-link-span text-decoration-none"
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
          {!isFileView && (
            <Grid item xs={12} sm={4}>
              <Link
                id="goToDeedView"
                className="hover-link-span text-decoration-none"
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
        </Grid>
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Typography sx={{ marginTop: '30px' }} id="file-accept-msg">
            We accept the following file types for upload: images (.png, .jpg,
            .jpeg, .gif), PDFs (.pdf), Word documents (.doc, .docx), and Excel
            files (.xls, .xlsx).
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '20px',
            }}
          >
            <MyDropzone
              fileId={fileId}
              deedId={deedId}
              isFileView={isFileView}
            />
          </Box>
        </Box>
      </Stack>
    </Container>
  );
};

export default UploadDocument;
