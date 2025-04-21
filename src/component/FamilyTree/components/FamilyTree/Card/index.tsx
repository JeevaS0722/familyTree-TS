// src/component/FamilyTree/components/FamilyTree/Card/index.tsx
import React, { useRef, useCallback, useState } from 'react';
import { useNodeAnimation } from '../../../hooks/useNodeAnimation';
import { CardProps } from './types';
import RelationshipBadge from './RelationshipBadge';
import CardHeader from './CardHeader';
import CardBody from './CardBody';
import BottomBar from './BottomBar';
import NotesPanel from './NotesPanel';

const Card: React.FC<CardProps> = ({
  node,
  cardDimensions,
  showMiniTree,
  transitionTime,
  treeData,
  initialRender = false,
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
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState({
    type: 'Research Update',
    content: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animation hook - pass initialRender flag
  useNodeAnimation(cardRef, node, transitionTime, treeData, initialRender);

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

  const handleSaveNote = useCallback(() => {
    // Mock implementation - replace with actual API call
    if (!newNote.content.trim()) {
      setError('Note content is required');
      return;
    }

    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      const newNoteWithId = {
        id: Date.now().toString(),
        type: newNote.type,
        content: newNote.content,
        createdBy: 'Current User',
        createdDate: new Date().toISOString().split('T')[0],
      };

      setNotes([newNoteWithId, ...notes]);
      setNewNote({ type: 'Research Update', content: '' });
      setActiveTab('list');
      setIsSaving(false);
    }, 500);
  }, [newNote, notes]);

  const handleCancelCreate = useCallback(() => {
    setActiveTab('list');
    setNewNote({ type: 'Research Update', content: '' });
    setError(null);
  }, []);

  // Prepare data
  const colors =
    node.data.data.gender === 'M'
      ? {
          primary: 'var(--male-primary-color)',
          secondary: 'var(--male-secondary-color)',
        }
      : {
          primary: 'var(--female-primary-color)',
          secondary: 'var(--female-secondary-color)',
        };

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
      {showNotesPanel && (
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
          isLoading={false}
        />
      )}
    </g>
  );
};

export default React.memo(Card);
