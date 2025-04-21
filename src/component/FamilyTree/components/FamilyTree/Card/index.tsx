// src/component/FamilyTree/components/FamilyTree/Card/index.tsx
import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useNodeAnimation } from '../../../hooks/useNodeAnimation';
import { CardProps } from './types';
import RelationshipBadge from './RelationshipBadge';
import CardHeader from './CardHeader';
import CardBody from './CardBody';
import BottomBar from './BottomBar';
import NotesPanel from './NotesPanel';
import {
  useLazyGetContactNoteListQuery,
  useAddContactNoteMutation,
} from '../../../../../store/Services/noteService';

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

const Card: React.FC<CardProps> = ({
  node,
  cardDimensions,
  showMiniTree,
  transitionTime,
  treeData,
  onClick,
  onEdit,
  onMouseEnter,
  onMouseLeave,
  onAddChild,
  onAddPartner,
  onDelete,
  onUpdateRelationship,
}) => {
  const cardRef = useRef<SVGGElement>(null);

  // UI state
  const [showRelationDropdown, setShowRelationDropdown] = useState(false);
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [headerHovered, setHeaderHovered] = useState(false);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [notesPanelClosing, setNotesPanelClosing] = useState(false);
  const [arrowRotated, setArrowRotated] = useState(false);
  const [badgeHovered, setBadgeHovered] = useState(false);

  // Notes state
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({
    type: 'Research Update',
    content: '',
  });
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API hooks
  const [getContactNoteList, { data: notesData, isLoading }] =
    useLazyGetContactNoteListQuery();
  const [addContactNote] = useAddContactNoteMutation();

  // Animation hook
  useNodeAnimation(cardRef, node, transitionTime, treeData);

  // Fetch notes
  useEffect(() => {
    if (showNotesPanel && node.data.data.contactId) {
      getContactNoteList({
        contactId: Number(node.data.data.contactId),
        orderBy: 'dateCompleted,dateCreated',
        order: 'desc',
      });
    }
  }, [showNotesPanel, node.data.data.contactId, getContactNoteList]);

  // Transform API notes
  useEffect(() => {
    if (notesData?.rows) {
      const transformedNotes = notesData.rows.map(note => ({
        id: note.noteId.toString(),
        type: note.type,
        content: note.notes,
        createdBy: note.fromUserId,
        createdDate: new Date(note.dateCompleted).toISOString().split('T')[0],
      }));
      setNotes(transformedNotes);
    }
  }, [notesData]);

  // Event handlers
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(node);
    }
  }, [onClick, node]);

  const handleEditClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onEdit) {
        onEdit(node);
      }
    },
    [onEdit, node]
  );

  const handleAddClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onAddPartner) {
        onAddPartner(node);
      }
    },
    [onAddPartner, node]
  );

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDelete) {
        onDelete(node.data.id);
      }
    },
    [onDelete, node]
  );

  const handleRelationshipSelect = useCallback(
    (relationship: string) => {
      if (onUpdateRelationship) {
        onUpdateRelationship(node, relationship);
      }
      setShowRelationDropdown(false);
    },
    [onUpdateRelationship, node]
  );

  const handleMouseEnter = useCallback(() => {
    if (!node.data.main && onMouseEnter) {
      onMouseEnter(node);
    }
  }, [node, onMouseEnter]);

  const handleMouseLeave = useCallback(() => {
    if (!node.data.main && onMouseLeave) {
      onMouseLeave(node);
    }
  }, [node, onMouseLeave]);

  const toggleNotesPanel = useCallback(() => {
    if (showNotesPanel) {
      setNotesPanelClosing(true);
      setArrowRotated(false);
      setTimeout(() => {
        setShowNotesPanel(false);
        setNotesPanelClosing(false);
      }, 300);
    } else {
      setShowNotesPanel(true);
      setArrowRotated(true);
    }
  }, [showNotesPanel]);

  const handleSaveNote = async () => {
    if (!newNote.content.trim()) {
      setError('Note content is required');
      return;
    }
    if (!node.data.data.contactId) {
      setError('Contact ID is missing');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const notePayload = {
        contactId: node.data.data.contactId,
        type: newNote.type,
        memo: newNote.content,
      };
      const response = await addContactNote(notePayload).unwrap();
      if (response?.success) {
        getContactNoteList({
          contactId: Number(node.data.data.contactId),
          orderBy: 'dateCompleted,dateCreated',
          order: 'desc',
        });
        setNewNote({ type: 'Research Update', content: '' });
        setActiveTab('list');
      } else {
        setError('Failed to add note');
      }
    } catch (err) {
      setError('Error saving note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelCreate = () => {
    setActiveTab('list');
    setNewNote({ type: 'Research Update', content: '' });
    setError(null);
  };

  // Gender colors
  const getGenderColors = () => {
    if (node.data.data.gender === 'M') {
      return {
        primary: 'var(--male-primary-color)',
        secondary: 'var(--male-secondary-color)',
      };
    }
    return {
      primary: 'var(--female-primary-color)',
      secondary: 'var(--female-secondary-color)',
    };
  };

  // Prepare data
  const colors = getGenderColors();
  const isDeceased = !!node.data.data.deceased;
  const hasNotes = !!node.data.data.is_new_notes;
  const showCountyOfDeath =
    node.data.data.countyOfDeath &&
    (!node.data.data.address || node.data.data.deceased);
  const contactId = node.data.data.contactId;
  const fileId = node.data.data.fileId;
  const offerAmount = node.data.data.offerAmount || '$0.00';

  return (
    <g
      ref={cardRef}
      className={`card_cont ${node.data.main ? 'card-main' : ''} ${isDeceased ? 'card-deceased' : ''}`}
      transform={`translate(${node.x}, ${node.y})`}
      style={{ opacity: 0 }}
      data-id={node.data.id}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Relationship Badge */}
      <RelationshipBadge
        node={node}
        isDeceased={isDeceased}
        position={{
          x: -cardDimensions.w / 2 + 15,
          y: -cardDimensions.h / 2 - 23,
        }}
        showRelationDropdown={showRelationDropdown}
        setShowRelationDropdown={setShowRelationDropdown}
        badgeHovered={badgeHovered}
        setBadgeHovered={setBadgeHovered}
        onRelationshipSelect={handleRelationshipSelect}
      />

      {/* Main Card */}
      <g
        className={`card ${node.data.data.gender === 'M' ? 'card-male' : 'card-female'}`}
        transform={`translate(${-cardDimensions.w / 2}, ${-cardDimensions.h / 2})`}
      >
        <g className="card-inner" clipPath="url(#card_clip)">
          {/* Card Outline */}
          <rect
            width={cardDimensions.w}
            height={cardDimensions.h}
            rx={20}
            ry={20}
            className={`card-outline ${node.data.main ? 'card-main-outline' : ''}`}
            stroke={
              isDeceased
                ? 'var(--deceased-border-color)'
                : 'rgba(255, 255, 255, 0.2)'
            }
            strokeWidth={isDeceased ? 3 : 1}
            fill="none"
          />

          {/* Header */}
          <CardHeader
            node={node}
            cardDimensions={cardDimensions}
            isDeceased={isDeceased}
            headerHovered={headerHovered}
            setHeaderHovered={setHeaderHovered}
            onCardClick={handleClick}
            onAddClick={handleAddClick}
            onDeleteClick={handleDeleteClick}
          />

          {/* Body */}
          <CardBody
            node={node}
            cardDimensions={cardDimensions}
            colors={colors}
            isDeceased={isDeceased}
            showCountyOfDeath={showCountyOfDeath}
            hasNotes={hasNotes}
            contactId={contactId}
            fileId={fileId}
            offerAmount={offerAmount}
            showOfferPopup={showOfferPopup}
            setShowOfferPopup={setShowOfferPopup}
          />

          {/* Bottom Bar */}
          <BottomBar
            cardDimensions={cardDimensions}
            arrowRotated={arrowRotated}
            notesPanelClosing={notesPanelClosing}
            toggleNotesPanel={toggleNotesPanel}
          />
        </g>
      </g>

      {/* Notes Panel */}
      <NotesPanel
        node={node}
        cardDimensions={cardDimensions}
        showNotesPanel={showNotesPanel}
        notesPanelClosing={notesPanelClosing}
        toggleNotesPanel={toggleNotesPanel}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notes={notes}
        newNote={newNote}
        setNewNote={setNewNote}
        isSaving={isSaving}
        error={error}
        onSaveNote={handleSaveNote}
        onCancelCreate={handleCancelCreate}
        isLoading={isLoading}
      />
    </g>
  );
};

export default React.memo(Card);
