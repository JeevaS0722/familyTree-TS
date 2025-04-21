// src/component/FamilyTree/components/card/NotesPanel.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  IconButton,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import ExpandedNotesPanel from './ExpandedNotesPanel';
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

interface NotesPanelProps {
  contactId?: string | number | null;
  onClose: () => void;
  className?: string;
  style?: React.CSSProperties;
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

const NotesPanel: React.FC<NotesPanelProps> = ({
  contactId,
  onClose,
  className,
  style,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({
    type: 'Research Update',
    content: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedViewOpen, setExpandedViewOpen] = useState(false);
  const notesListRef = useRef<HTMLDivElement>(null);

  // API hooks
  const [getContactNoteList, { data: notesData, isLoading }] =
    useLazyGetContactNoteListQuery();
  const [addContactNote] = useAddContactNoteMutation();

  // Fetch notes when the component mounts or contactId changes
  useEffect(() => {
    if (contactId) {
      void getContactNoteList({
        contactId: Number(contactId),
        orderBy: 'dateCompleted,dateCreated',
        order: 'desc',
      });
    }
  }, [contactId, getContactNoteList]);

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
  const handleTabChange = (
    _event: React.SyntheticEvent,
    tab: 'list' | 'create'
  ) => {
    setActiveTab(tab);
    setError(null);
  };

  // Refresh notes from API
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

    setIsSaving(true);
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

        // Reset and go back to list view
        setNewNote({ type: 'Research Update', content: '' });
        setActiveTab('list');
      } else {
        setError('Failed to add note');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      setError('Error saving note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel note creation
  const handleCancelCreate = () => {
    setActiveTab('list');
    setNewNote({ type: 'Research Update', content: '' });
    setError(null);
  };

  // Handle opening expanded view
  const handleOpenExpandedView = () => {
    setExpandedViewOpen(true);
  };

  // Handle closing expanded view with refresh
  const handleCloseExpandedView = () => {
    setExpandedViewOpen(false);
    refreshNotes();
  };

  return (
    <>
      <Box
        className={`notes-panel ${className || ''}`}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          borderRadius: '0 0 16px 16px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          ...style,
        }}
      >
        {/* Header Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(e, newValue) =>
                handleTabChange(e, newValue as 'list' | 'create')
              }
              aria-label="notes tabs"
              sx={{ flexGrow: 1 }}
            >
              <Tab value="list" label="Notes List" />
              <Tab value="create" label="Create Note" />
            </Tabs>
            <Box sx={{ display: 'flex', px: 1 }}>
              <IconButton
                size="small"
                onClick={handleOpenExpandedView}
                sx={{ mr: 1 }}
                title="Expanded View"
              >
                <OpenInFullIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={onClose} title="Close">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ mt: 1, mx: 1 }}>
            {error}
          </Alert>
        )}

        {/* Content Area */}
        {activeTab === 'list' ? (
          <Box
            ref={notesListRef}
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 1,
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : notes.length === 0 ? (
              <Typography
                sx={{
                  textAlign: 'center',
                  p: 2,
                  color: '#666',
                  fontSize: '12px',
                }}
              >
                No notes found
              </Typography>
            ) : (
              notes.map(note => (
                <Box
                  key={note.id}
                  sx={{
                    p: 1,
                    mb: 1,
                    bgcolor: '#f5f5f5',
                    borderRadius: 1,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ fontSize: '10px' }}
                    >
                      {note.type}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ fontSize: '10px' }}
                    >
                      {note.createdDate} • {note.createdBy}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 0.5 }} />
                  <Typography variant="body2" sx={{ fontSize: '11px' }}>
                    {note.content}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        ) : (
          <Box
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              flex: 1,
            }}
          >
            <FormControl fullWidth size="small">
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
                size="small"
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
              rows={4}
              value={newNote.content}
              onChange={e =>
                setNewNote(prev => ({ ...prev, content: e.target.value }))
              }
              fullWidth
              variant="outlined"
              placeholder="Enter your note here..."
              size="small"
              error={!!error}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
                mt: 'auto',
              }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={handleCancelCreate}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleSaveNote}
                disabled={isSaving || !newNote.content.trim()}
              >
                {isSaving ? <CircularProgress size={20} /> : 'Save'}
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* Expanded Notes Panel Dialog */}
      <ExpandedNotesPanel
        open={expandedViewOpen}
        onClose={handleCloseExpandedView}
        contactId={contactId}
        initialNotes={notes}
      />
    </>
  );
};

export default NotesPanel;
