// src/component/FamilyTree/components/card/ExpandedNotesPanel.tsx
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
import CloseIcon from '@mui/icons-material/Close';
import { Note, ApiNote, AddNotePayload } from '../../types/familyTreeExtended';

// This would be your real API service import
const useLazyGetContactNoteListQuery = () => {
  return [
    async (params: any) => {
      console.log('Fetching notes with params:', params);
      // Mock API call
      return Promise.resolve({
        rows: [] as ApiNote[],
        count: 0,
      });
    },
    { data: null, isLoading: false },
  ] as const;
};

const useAddContactNoteMutation = () => {
  return [
    async (data: AddNotePayload) => {
      console.log('Adding note with data:', data);
      // Mock API call
      return {
        unwrap: async () => ({
          success: true,
          message: 'Note added successfully',
        }),
      };
    },
    { isLoading: false },
  ] as const;
};

interface ExpandedNotesPanelProps {
  open: boolean;
  onClose: () => void;
  contactId?: string | number | null;
  initialNotes: Note[];
}

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
  const [tabValue, setTabValue] = useState(0);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [newNote, setNewNote] = useState({
    type: 'Research Update',
    content: '',
  });
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

  // Transform API notes
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
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
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
        console.log(response.message || 'Note added successfully');

        // Refresh notes list
        refreshNotes();

        // Reset form and switch tab
        setNewNote({ type: 'Research Update', content: '' });
        setTabValue(0);
      } else {
        setError('Failed to add note');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      setError('Error saving note. Please try again.');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
            }}
          >
            {contactId ? `Notes for Contact #${contactId}` : 'Notes'}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="notes panel tabs"
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
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
                <Box
                  key={note.id}
                  sx={{
                    p: 2,
                    my: 1,
                    bgcolor: '#f9f9f9',
                    borderRadius: 1,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
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
                        color:
                          note.type === 'Research Update'
                            ? 'primary.main'
                            : 'secondary.main',
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
                </Box>
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
                  setNewNote(prev => ({
                    ...prev,
                    type: e.target.value,
                  }))
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
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        {tabValue === 0 ? (
          <Button
            onClick={() => setTabValue(1)}
            variant="contained"
            color="primary"
            sx={{ px: 3 }}
          >
            Create New Note
          </Button>
        ) : (
          <>
            <Button
              onClick={() => setTabValue(0)}
              color="inherit"
              variant="outlined"
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveNote}
              variant="contained"
              color="primary"
              disabled={!newNote.content.trim() || isAddingNote}
              sx={{ px: 3 }}
            >
              {isAddingNote ? <CircularProgress size={24} /> : 'Save Note'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ExpandedNotesPanel;
