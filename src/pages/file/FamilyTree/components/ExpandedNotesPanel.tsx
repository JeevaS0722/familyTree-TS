import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  IconButton,
  Select,
  Tabs,
  Tab,
  Divider,
  AppBar,
  Toolbar,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';
import {
  useLazyGetContactNoteListQuery,
  useAddContactNoteMutation,
} from '../../../../store/Services/noteService';
import { Note, ApiNote, AddNotePayload } from './NotesPanel';

interface ExpandedNotesPanelProps {
  open: boolean;
  onClose: (refreshedNotes?: Note[]) => void;
  contactId?: string | number | null;
  initialNotes: Note[];
}

// Styled components
const NoteCard = styled(Box)(({ theme }) => ({
  padding: '12px',
  margin: '8px 0',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#f0f0f0',
    boxShadow: '0px 2px 4px rgba(0,0,0,0.15)',
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '12px',
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
  },
}));

// Note type options
const NOTE_TYPES = [
  'Research Update',
  'Call',
  'Email',
  'Meeting',
  'Task',
  'Offer Sent',
  'DC Ordered',
  'Other',
];

const ExpandedNotesPanel: React.FC<ExpandedNotesPanelProps> = ({
  open,
  onClose,
  contactId,
  initialNotes,
}) => {
  const dispatch = useDispatch();
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [newNote, setNewNote] = useState({ type: 'Research', content: '' });
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // API hooks
  const [getContactNoteList, { data: notesData, isLoading: isLoadingNotes }] =
    useLazyGetContactNoteListQuery();
  const [addContactNote, { isLoading: isAddingNote }] =
    useAddContactNoteMutation();

  // Fetch notes when the dialog opens
  useEffect(() => {
    if (open && contactId) {
      void getContactNoteList({
        contactId: Number(contactId),
        orderBy: 'dateCompleted,dateCreated',
        order: 'desc',
      });
    }
  }, [open, contactId, getContactNoteList]);

  // Transform API notes to our Note format when data is received
  useEffect(() => {
    if (notesData?.rows) {
      const transformedNotes: Note[] = notesData.rows.map(note => ({
        id: note.noteId.toString(),
        type: note.type,
        content: note.notes,
        createdBy: note.fromUserId,
        createdDate: new Date(note.dateCompleted).toISOString().split('T')[0],
      }));
      setNotes(transformedNotes);
    }
  }, [notesData]);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError(null);
  };

  // Refresh notes
  const refreshNotes = () => {
    if (contactId) {
      void getContactNoteList({
        contactId: Number(contactId),
        orderBy: 'dateCompleted,dateCreated',
        order: 'desc',
      });
    }
  };

  // Save new note using API
  const handleSaveNote = async () => {
    if (!newNote.content.trim()) {
      setError('Note content is required');
      return;
    }

    if (!contactId) {
      setError('Contact ID is missing');
      return;
    }

    setError(null);

    try {
      const notePayload: AddNotePayload = {
        contactId: contactId,
        type: newNote.type,
        memo: newNote.content,
      };

      const response = await addContactNote(notePayload).unwrap();

      if (response?.success) {
        // Success notification
        dispatch(
          open({
            severity: 'success',
            message: response.message || 'Note added successfully',
          })
        );

        // Refresh notes list
        refreshNotes();

        // Reset form and switch tab
        setNewNote({ type: 'Research', content: '' });
        setTabValue(0);
      } else {
        setError('Failed to add note');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      setError('Error saving note. Please try again.');
      dispatch(
        open({
          severity: 'error',
          message: 'Failed to add note',
        })
      );
    }
  };

  // Handle close with potential refresh
  const handleClose = () => {
    onClose();
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="expanded-notes-dialog-title"
    >
      <AppBar position="static" color="primary" elevation={4}>
        <Toolbar variant="dense" sx={{ minHeight: '48px' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontSize: '16px',
              fontWeight: 600,
              color: 'white',
            }}
          >
            {contactId ? `Notes for Contact #${contactId}` : 'Notes'}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <Box
          sx={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="notes panel tabs"
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '14px',
                py: 1.5,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                },
              },
              '& .MuiTabs-indicator': {
                height: 3,
              },
            }}
          >
            <Tab label="Notes List" />
            <Tab label="Create Note" />
          </Tabs>
        </Box>
      </AppBar>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mt: 1, mx: 2 }}>
          {error}
        </Alert>
      )}

      <DialogContent sx={{ p: 2 }}>
        {tabValue === 0 ? (
          // Notes List Tab
          <Box sx={{ maxHeight: '60vh', overflowY: 'auto', p: 1 }}>
            {isLoadingNotes ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : notes.length === 0 ? (
              <Typography
                sx={{
                  textAlign: 'center',
                  p: 2,
                  color: '#666',
                }}
              >
                No notes found
              </Typography>
            ) : (
              notes.map(note => (
                <NoteCard key={note.id}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: note.type === 'Research' ? '#1976d2' : '#e65100',
                      }}
                    >
                      {note.type}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {note.createdDate} • {note.createdBy}
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 1 }} />
                  <Typography variant="body2">{note.content}</Typography>
                </NoteCard>
              ))
            )}
          </Box>
        ) : (
          // Create Note Tab
          <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="note-type-label">Note Type</InputLabel>
              <Select
                labelId="note-type-label"
                value={newNote.type}
                label="Note Type"
                onChange={e =>
                  setNewNote(prev => ({ ...prev, type: e.target.value }))
                }
              >
                {NOTE_TYPES.map(type => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Note Content"
              multiline
              rows={5}
              value={newNote.content}
              onChange={e =>
                setNewNote(prev => ({ ...prev, content: e.target.value }))
              }
              fullWidth
              variant="outlined"
              placeholder="Enter your note here..."
              error={!!error}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          borderTop: '1px solid #ddd',
          backgroundColor: '#f5f5f5',
          boxShadow: '0 -2px 4px rgba(0,0,0,0.05)',
        }}
      >
        {tabValue === 0 ? (
          <Button
            onClick={() => setTabValue(1)}
            variant="contained"
            color="primary"
            sx={{
              fontWeight: 600,
              px: 3,
              py: 1,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            Create New Note
          </Button>
        ) : (
          <>
            <Button
              onClick={() => setTabValue(0)}
              color="inherit"
              variant="outlined"
              sx={{ mr: 1, fontWeight: 500 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveNote}
              variant="contained"
              color="primary"
              disabled={!newNote.content.trim() || isAddingNote}
              sx={{
                fontWeight: 600,
                px: 3,
                py: 1,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              {isAddingNote ? <CircularProgress size={24} /> : 'Save Note'}
            </Button>
          </>
        )}
      </DialogActions>
    </StyledDialog>
  );
};

export default ExpandedNotesPanel;
