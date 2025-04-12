/* eslint-disable complexity */
import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  DuplicateDocumentListResponse,
  DuplicateFile,
} from '../../interface/document';
import StyledInputField from '../../component/common/CommonStyle';
import { useGetDuplicateDocumentListMutation } from '../../store/Services/documentService';

interface DuplicateDialogProps {
  open: boolean;
  localDuplicates: DuplicateFile[];
  dbDuplicates: DuplicateFile[];
  fileId: number;
  deedId?: number;
  onCancel: () => void;
  onDone: (updatedDuplicates: DuplicateFile[]) => void;
}

const DuplicateDialog: React.FC<DuplicateDialogProps> = ({
  open,
  localDuplicates,
  dbDuplicates,
  fileId,
  deedId,
  onDone,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // ✅ Detects small screens
  const isMediumScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const [updatedDuplicates, setUpdatedDuplicates] = useState<DuplicateFile[]>(
    []
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);

  const [getDuplicateDocumentList] = useGetDuplicateDocumentListMutation();

  useEffect(() => {
    setUpdatedDuplicates([...localDuplicates, ...dbDuplicates]);
  }, [localDuplicates, dbDuplicates]);

  const handleActionChange = (
    index: number,
    action: DuplicateFile['action']
  ) => {
    setUpdatedDuplicates(prevState =>
      prevState.map((file, i) =>
        i === index
          ? {
              ...file,
              action,
              isEditing: action === 'rename' ? true : false,
              newFileName:
                action === 'rename'
                  ? file.fileName.replace(`.${file.fileType}`, '')
                  : '',
            }
          : file
      )
    );
  };

  const handleRenameChange = (index: number, newFileName: string) => {
    setUpdatedDuplicates(prevState =>
      prevState.map((file, i) =>
        i === index ? { ...file, newFileName } : file
      )
    );
  };

  const handleCancelEdit = (index: number) => {
    setUpdatedDuplicates(prevState =>
      prevState.map((file, i) =>
        i === index
          ? {
              ...file,
              action: null,
              newFileName: '', // ✅ Reset filename
              isEditing: false, // ✅ Disable editing mode
              isError: false, // ✅ Clear error state
              errorMessage: '', // ✅ Clear error message
            }
          : file
      )
    );
  };

  const handleUpdateName = async (index: number) => {
    const fileToUpdate = updatedDuplicates[index];
    if (!fileToUpdate?.newFileName?.trim()) {
      return;
    }

    const newFullName = `${fileToUpdate.newFileName}.${fileToUpdate.fileType}`;

    // **Step 1: Local Duplicate Check**
    const isLocalDuplicate = updatedDuplicates.some(
      (file, i) =>
        i !== index && !file?.isRemoved && file.fileName === newFullName
    );

    if (isLocalDuplicate) {
      setUpdatedDuplicates(prevState =>
        prevState.map((file, i) =>
          i === index
            ? {
                ...file,
                isError: true,
                errorMessage: `"${newFullName}" already exists in local uploads.`,
              }
            : file
        )
      );
      return;
    }

    try {
      setCheckingDuplicate(true);

      // **Step 2: API Check for Duplicates**
      const response: DuplicateDocumentListResponse =
        await getDuplicateDocumentList({
          fileId: Number(fileId) || 0,
          deedId: Number(deedId) || 0,
          filenames: [newFullName],
        }).unwrap();

      if (response?.data?.duplicates?.length > 0) {
        setUpdatedDuplicates(prevState =>
          prevState.map((file, i) =>
            i === index
              ? {
                  ...file,

                  matchedIds: response?.data?.duplicates[0].matchedIds || [],
                  matchCount: response?.data?.duplicates[0].matchCount || 0,
                  matchType: response?.data?.duplicates[0].matchType || null,
                  multipleMatch:
                    response?.data?.duplicates[0].multipleMatch || false,
                  isError: true,
                  errorMessage: `"${newFullName}" already exists. Choose a different name.`,
                }
              : file
          )
        );
        return;
      }

      // **Step 3: Update Filename if No Duplicates Found**
      setUpdatedDuplicates(prevState =>
        prevState.map((file, i) =>
          i === index
            ? {
                ...file,
                fileName: newFullName,
                action: 'rename',
                newFileName: '',
                isEditing: false,
                isError: false,
                errorMessage: '',
                matchedIds: [],
                matchCount: 0,
                matchType: null,
                multipleMatch: false,
              }
            : file
        )
      );
    } catch (error) {
      setUpdatedDuplicates(prevState =>
        prevState.map((file, i) =>
          i === index
            ? {
                ...file,
                isError: true,
                errorMessage: 'Error checking duplicates. Try again.',
              }
            : file
        )
      );
    } finally {
      setCheckingDuplicate(false);
    }
  };

  const handleRemove = (index: number) => {
    const newState = updatedDuplicates.map((file, i) =>
      i === index
        ? {
            ...file,
            isRemoved: true,
            action: 'remove' as const,
          }
        : file
    );
    setUpdatedDuplicates(newState);
    const allRemoved = newState.every(file => file?.isRemoved);

    if (allRemoved) {
      onDone(newState); // ✅ Ensure we pass the updated state
    }
  };

  const handleCancel = () => {
    setShowConfirmation(true);
  };

  const handleConfirmRemoveAll = () => {
    const updated = updatedDuplicates.map(file => ({
      ...file,
      isRemoved: true,
      action: 'remove' as const,
    }));
    setShowConfirmation(false);
    onDone(updated);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const allResolved = updatedDuplicates.every(file => {
    return (
      (file.action === 'remove' ||
        file.action === 'override' ||
        (file.action === 'rename' &&
          !file?.isEditing &&
          file.orgFilename !== file.fileName)) &&
      !file?.isError // ✅ Only allow if there's no error
    );
  });

  const allRemoved = updatedDuplicates.every(file => file?.isRemoved);

  return (
    <>
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleCancel(); // Prevent closing when clicking the backdrop
          }
        }}
        maxWidth="md"
        fullWidth
        fullScreen={isSmallScreen} // ✅ Full-screen on mobile
      >
        <DialogTitle sx={{ color: 'white', borderBottom: '1px solid #ccc' }}>
          Resolve Duplicate Documents
          <IconButton
            disabled={allResolved}
            aria-label="close"
            onClick={handleCancel}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {allRemoved && updatedDuplicates.length > 0 ? (
            <Typography variant="h6" textAlign="center">
              All done! Ready for upload.
            </Typography>
          ) : (
            updatedDuplicates.map((file, index) => {
              const isFileStorage = file.storageType === 'file_storage';
              const isDeedStorage = file.storageType === 'deed_storage';

              const disableRenameOverride =
                file.multipleMatch && file.matchCount > 1;
              const showNote = file.multipleMatch;

              return (
                !file.isRemoved && (
                  <Box
                    key={`${file.fileName}-${index}`}
                    display="flex"
                    flexDirection="column"
                    mb={2}
                    pb={2}
                    borderBottom="1px solid #ccc"
                  >
                    <Grid
                      container
                      spacing={1}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Grid item xs={12} lg={file?.isEditing ? 9 : 8}>
                        {file?.isEditing ? (
                          <Box display="flex" alignItems="center">
                            <StyledInputField
                              value={file.newFileName || ''}
                              onChange={e =>
                                handleRenameChange(index, e.target.value)
                              }
                              size="small"
                              fullWidth
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: 'gray', ml: 1 }}
                            >
                              .{file.fileType}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body1">
                            {file.fileName}
                          </Typography>
                        )}
                      </Grid>
                      {!isMediumScreen && (
                        <>
                          <Grid item xs={12}>
                            {!checkingDuplicate &&
                              !file?.isError &&
                              showNote && (
                                <Typography variant="caption" color="error">
                                  This document name matches multiple records.
                                  Please rename or remove it.
                                </Typography>
                              )}
                          </Grid>
                          <Grid item xs={12}>
                            {!checkingDuplicate && file?.isError && (
                              <Typography variant="caption" color="error">
                                {file?.errorMessage || ''}
                              </Typography>
                            )}
                          </Grid>
                        </>
                      )}
                      <Grid
                        item
                        xs={12}
                        lg={file?.isEditing ? 3 : 4}
                        display="flex"
                        justifyContent="flex-end"
                        flexWrap="wrap"
                        gap={1}
                      >
                        {file?.isEditing ? (
                          <>
                            <Button
                              variant="outlined"
                              sx={{
                                backgroundColor: '#7cba77',
                                color: 'white',
                                position: 'relative',
                                '&:disabled': {
                                  backgroundColor: '#7cba77',
                                  opacity: 0.7,
                                  color: 'white',
                                },
                              }}
                              onClick={() => handleUpdateName(index)}
                              disabled={
                                !file.newFileName?.trim() || checkingDuplicate
                              }
                            >
                              {checkingDuplicate ? (
                                <>
                                  <CircularProgress
                                    size={20}
                                    sx={{
                                      color: 'white',
                                      position: 'absolute',
                                    }}
                                  />
                                  <span style={{ opacity: 0 }}>Update</span>
                                </>
                              ) : (
                                'Update'
                              )}
                            </Button>
                            <Button
                              variant="outlined"
                              disabled={checkingDuplicate}
                              onClick={() => handleCancelEdit(index)}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outlined"
                              onClick={() =>
                                handleActionChange(index, 'rename')
                              }
                              sx={{
                                backgroundColor:
                                  file.action === 'rename'
                                    ? '#7cba77'
                                    : 'transparent',
                                color:
                                  file.action === 'rename'
                                    ? 'white'
                                    : 'default',
                                '&:hover': {
                                  backgroundColor: '#7cba77',
                                  color: 'white',
                                },
                              }}
                            >
                              Rename
                            </Button>
                            {file.action !== 'rename' &&
                              (isFileStorage ||
                                (isDeedStorage &&
                                  file.matchType === 'same_deed' &&
                                  file.matchCount === 1)) && (
                                <Button
                                  variant="outlined"
                                  disabled={disableRenameOverride}
                                  onClick={() =>
                                    handleActionChange(index, 'override')
                                  }
                                  sx={{
                                    backgroundColor:
                                      file.action === 'override'
                                        ? '#7cba77'
                                        : 'transparent',
                                    color:
                                      file.action === 'override'
                                        ? 'white'
                                        : 'default',
                                    '&:hover': {
                                      backgroundColor: '#7cba77',
                                      color: 'white',
                                    },
                                  }}
                                >
                                  Override
                                </Button>
                              )}
                            <Button
                              variant="outlined"
                              onClick={() => handleRemove(index)}
                              sx={{
                                backgroundColor:
                                  file.action === 'remove'
                                    ? '#EA5B5E'
                                    : 'transparent',
                                color:
                                  file.action === 'remove'
                                    ? 'white'
                                    : 'default',
                                '&:hover': {
                                  backgroundColor: '#EA5B5E',
                                  color: 'white',
                                },
                              }}
                            >
                              Remove
                            </Button>
                          </>
                        )}
                      </Grid>
                    </Grid>
                    {isMediumScreen && (
                      <>
                        <Grid item xs={12}>
                          {!checkingDuplicate && !file?.isError && showNote && (
                            <Typography variant="caption" color="error">
                              This document name matches multiple records.
                              Please rename or remove it.
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12}>
                          {!checkingDuplicate && file?.isError && (
                            <Typography variant="caption" color="error">
                              {file?.errorMessage || ''}
                            </Typography>
                          )}
                        </Grid>
                      </>
                    )}
                  </Box>
                )
              );
            })
          )}
        </DialogContent>
        {updatedDuplicates.length > 0 && (
          <DialogActions>
            <Button onClick={handleCancel} variant="outlined" color="error">
              Cancel
            </Button>
            <Button
              onClick={() => onDone(updatedDuplicates)}
              variant="contained"
              sx={{
                backgroundColor: '#7cba77',
                color: 'white',
                '&:hover': { backgroundColor: '#7cba77' },
                '&:disabled': {
                  backgroundColor: '#7cba77',
                  opacity: 0.2,
                  color: 'white',
                },
              }}
              disabled={!allResolved || checkingDuplicate}
            >
              Done
            </Button>
          </DialogActions>
        )}
      </Dialog>
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onClose={handleCloseConfirmation}>
        <DialogTitle>Confirm Remove All</DialogTitle>
        <DialogContent>
          <Typography>
            Do you want to remove all duplicate documents?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRemoveAll}
            variant="contained"
            sx={{
              backgroundColor: '#EA5B5E', // 50% transparent red
              color: 'white',
              '&:hover': {
                backgroundColor: '#E32227', // Darker on hover
              },
            }}
          >
            Remove All
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DuplicateDialog;
