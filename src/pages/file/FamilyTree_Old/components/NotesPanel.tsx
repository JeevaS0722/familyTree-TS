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
  Tooltip,
  Alert,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import ExpandedNotesPanel from './ExpandedNotesPanel';
import {
  useLazyGetContactNoteListQuery,
  useAddContactNoteMutation,
} from '../../../../store/Services/noteService';
// import { open } from '../../../../store/Slices/snackbarSlice';
import { useDispatch } from 'react-redux';

// Define animations
const slideInAnimation = keyframes`
  from {
    height: 0;
    opacity: 0;
  }
  to {
    height: calc(100% - 34px);
    opacity: 1;
  }
`;

const slideOutAnimation = keyframes`
  from {
    height: calc(100% - 34px);
    opacity: 1;
  }
  to {
    height: 0;
    opacity: 0;
  }
`;

// Define interfaces for note data
export interface Note {
  id: string;
  type: string;
  content: string;
  createdBy: string;
  createdDate: string;
}

// API response interfaces
export interface ApiNote {
  noteId: number;
  type: string;
  notes: string;
  fromUserId: string;
  toUserId: string;
  dateCompleted: string;
  contactName: string;
}

export interface NotesApiResponse {
  rows: ApiNote[];
  count: number;
}

export interface AddNotePayload {
  contactId: string | number;
  type: string;
  memo: string;
  fileStatus?: string;
}

interface NotesPanelProps {
  contactId?: string | number | null;
  onClose: () => void;
}

// Styled components
const PanelContainer = styled(Box, {
  shouldForwardProp: prop => prop !== 'isOpen' && prop !== 'isClosing',
})<{ isOpen: boolean; isClosing: boolean }>(({ isOpen, isClosing }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: isOpen ? 'calc(100% - 34px)' : '0',
  backgroundColor: '#fff',
  borderBottomLeftRadius: '16px',
  borderBottomRightRadius: '16px',
  overflow: 'hidden',
  animation: isOpen
    ? isClosing
      ? `${slideOutAnimation} 0.3s ease-out forwards`
      : `${slideInAnimation} 0.3s ease-out forwards`
    : 'none',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 10,
}));

const TabContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  borderBottom: '1px solid #ddd',
  position: 'relative',
  backgroundColor: '#fff',
  zIndex: 1,
  padding: '4px 0',
  height: '36px',
}));

const TabButton = styled(Button)<{ active: boolean }>(({ active }) => ({
  flex: 1,
  borderRadius: 0,
  textTransform: 'none',
  fontWeight: active ? 700 : 400,
  backgroundColor: active ? '#f0f0f0' : 'transparent',
  padding: '2px 8px',
  fontSize: '12px',
  minHeight: '24px',
  '&:hover': {
    backgroundColor: active ? '#f0f0f0' : '#f5f5f5',
  },
}));

const NoteCard = styled(Box)(({ theme }) => ({
  padding: '8px',
  margin: '4px 8px',
  backgroundColor: '#f9f9f9',
  borderRadius: '6px',
  boxShadow: '0px 1px 2px rgba(0,0,0,0.1)',
}));

const CloseButtonContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 3,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
}));

// Actions container for close and expand buttons
const ActionsContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 3,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  padding: '3px',
  borderRadius: '12px',
  backgroundColor: 'rgba(240, 240, 240, 0.8)',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(230, 230, 230, 0.95)',
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.15)',
  },
}));

// Prominent down arrow SVG
const DownArrowSvg = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 10L12 15L17 10"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CompactFormRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '4px 10px',
  width: '100%',
  justifyContent: 'space-between',
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

const NotesPanel: React.FC<NotesPanelProps> = ({ contactId, onClose }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ type: 'Research', content: '' });
  const [isSaving, setIsSaving] = useState(false);
  const notesListRef = useRef<HTMLDivElement>(null);
  const [showTabs, setShowTabs] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [expandedViewOpen, setExpandedViewOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API hooks
  const [getContactNoteList, { data: notesData, isLoading, isFetching }] =
    useLazyGetContactNoteListQuery();
  const [addContactNote, { isLoading: isAddingNote }] =
    useAddContactNoteMutation();

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

  // Handle scroll behavior to hide/show tabs
  useEffect(() => {
    const handleScroll = () => {
      if (notesListRef.current) {
        const st = notesListRef.current.scrollTop;
        if (st > lastScrollTop && st > 25) {
          // Scrolling down
          setShowTabs(false);
        } else if (st < lastScrollTop || st < 20) {
          // Scrolling up or at top
          setShowTabs(true);
        }
        setLastScrollTop(st);
      }
    };

    const listElement = notesListRef.current;
    if (listElement) {
      listElement.addEventListener('scroll', handleScroll);
      return () => listElement.removeEventListener('scroll', handleScroll);
    }
  }, [lastScrollTop]);

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

  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before fully closing
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  // Switch to create note tab
  const handleCreateNote = () => {
    setActiveTab('create');
    setError(null);
  };

  // Switch back to list view
  const handleCancelCreate = () => {
    setActiveTab('list');
    setNewNote({ type: 'Research', content: '' });
    setError(null);
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
        // dispatch(
        //   open({
        //     severity: 'success',
        //     message: response.message || 'Note added successfully',
        //   })
        // );

        // Refresh notes list
        refreshNotes();

        // Reset and go back to list view
        setNewNote({ type: 'Research', content: '' });
        setActiveTab('list');
      } else {
        setError('Failed to add note');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      setError('Error saving note. Please try again.');
      // dispatch(
      //   open({
      //     severity: 'error',
      //     message: 'Failed to add note',
      //   })
      // );
    } finally {
      setIsSaving(false);
    }
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
      <PanelContainer isOpen={isOpen} isClosing={isClosing}>
        {/* Tabs with center actions (close and expand) */}
        {activeTab === 'list' ? (
          <TabContainer style={{ display: showTabs ? 'flex' : 'none' }}>
            <TabButton
              active={true}
              onClick={() => setActiveTab('list')}
              size="small"
            >
              Notes List
            </TabButton>
            <TabButton active={false} onClick={handleCreateNote} size="small">
              Create Note
            </TabButton>

            <ActionsContainer
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              sx={{ width: isHovered ? 'auto' : '30px' }}
            >
              {isHovered && (
                <Tooltip
                  title="Click to view notes in max view"
                  placement="top"
                  arrow
                >
                  <IconButton
                    size="small"
                    onClick={handleOpenExpandedView}
                    sx={{
                      p: 0,
                      width: '24px',
                      height: '24px',
                      color: '#1976d2',
                      backgroundColor: 'rgba(25, 118, 210, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.2)',
                      },
                    }}
                  >
                    <OpenInFullIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title="Close notes" placement="top" arrow>
                <IconButton
                  size="small"
                  onClick={handleClose}
                  sx={{
                    p: 0,
                    width: '24px',
                    height: '24px',
                    color: '#555',
                    backgroundColor: isHovered
                      ? 'rgba(0, 0, 0, 0.05)'
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <DownArrowSvg />
                </IconButton>
              </Tooltip>
            </ActionsContainer>
          </TabContainer>
        ) : (
          <Box
            sx={{
              display: 'flex',
              borderBottom: '1px solid #ddd',
              backgroundColor: '#f5f5f5',
              position: 'relative',
              minHeight: '36px',
              alignItems: 'center',
            }}
          >
            <CompactFormRow>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={!newNote.content.trim() || isSaving}
                  onClick={handleSaveNote}
                  sx={{
                    fontSize: '11px',
                    py: 0.5,
                    minHeight: '24px',
                    minWidth: '50px',
                  }}
                >
                  {isSaving ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    'Save'
                  )}
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleCancelCreate}
                  sx={{
                    fontSize: '11px',
                    py: 0.5,
                    minHeight: '24px',
                    minWidth: '50px',
                  }}
                >
                  Cancel
                </Button>
              </Box>

              {/* Moved to the right side */}
              <Select
                value={newNote.type}
                onChange={e =>
                  setNewNote(prev => ({ ...prev, type: e.target.value }))
                }
                size="small"
                displayEmpty
                sx={{
                  height: '24px',
                  fontSize: '11px',
                  minWidth: '100px',
                  '.MuiSelect-select': {
                    padding: '2px 8px',
                  },
                }}
              >
                {NOTE_TYPES.map(type => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </CompactFormRow>

            <ActionsContainer
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              sx={{ width: isHovered ? 'auto' : '30px' }}
            >
              {isHovered && (
                <Tooltip
                  title="Click to view notes in max view"
                  placement="top"
                  arrow
                >
                  <IconButton
                    size="small"
                    onClick={handleOpenExpandedView}
                    sx={{
                      p: 0,
                      width: '24px',
                      height: '24px',
                      color: '#1976d2',
                      backgroundColor: 'rgba(25, 118, 210, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.2)',
                      },
                    }}
                  >
                    <OpenInFullIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title="Close notes" placement="top" arrow>
                <IconButton
                  size="small"
                  onClick={handleClose}
                  sx={{
                    p: 0,
                    width: '24px',
                    height: '24px',
                    color: '#555',
                    backgroundColor: isHovered
                      ? 'rgba(0, 0, 0, 0.05)'
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <DownArrowSvg />
                </IconButton>
              </Tooltip>
            </ActionsContainer>
          </Box>
        )}

        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ mt: 1, mx: 1 }}>
            {error}
          </Alert>
        )}

        {/* Content area */}
        {activeTab === 'list' ? (
          <Box
            ref={notesListRef}
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 0.5,
              pb: 1,
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
                  p: 1,
                  color: '#666',
                  fontSize: '12px',
                }}
              >
                No notes found
              </Typography>
            ) : (
              notes.map(note => (
                <NoteCard key={note.id}>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ fontSize: '10px' }}
                  >
                    {note.type} • {note.createdDate} • {note.createdBy}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 0.5, fontSize: '11px' }}
                  >
                    {note.content}
                  </Typography>
                </NoteCard>
              ))
            )}
          </Box>
        ) : (
          <Box
            sx={{
              p: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              flex: 1,
              pb: 2, // Added more padding at the bottom to avoid cutting off
            }}
          >
            <TextField
              label="Enter note"
              multiline
              rows={3} // Reduced from 4 to 3 rows to avoid being cut off
              value={newNote.content}
              onChange={e =>
                setNewNote(prev => ({ ...prev, content: e.target.value }))
              }
              fullWidth
              variant="outlined"
              placeholder="Enter your note here..."
              size="small"
              InputProps={{
                style: { fontSize: '12px' },
              }}
              InputLabelProps={{
                style: { fontSize: '12px' },
              }}
              sx={{ mt: 1 }}
              error={!!error}
            />
          </Box>
        )}
      </PanelContainer>

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
