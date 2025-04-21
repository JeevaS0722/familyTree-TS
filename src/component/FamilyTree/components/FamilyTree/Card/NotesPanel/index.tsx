// src/component/FamilyTree/components/FamilyTree/Card/NotesPanel/index.tsx
import React from 'react';
import { NotesPanelProps } from '../types';
import NotesList from './NotesList';
import NoteForm from './NoteForm';

const NotesPanel: React.FC<NotesPanelProps> = ({
  node,
  cardDimensions,
  showNotesPanel,
  notesPanelClosing,
  toggleNotesPanel,
  activeTab,
  setActiveTab,
  notes,
  newNote,
  setNewNote,
  isSaving,
  error,
  onSaveNote,
  onCancelCreate,
  isLoading,
}) => {
  if (!showNotesPanel) {
    return null;
  }

  return (
    <g
      className={`notes-panel ${notesPanelClosing ? 'closing' : 'open'}`}
      transform={`translate(${-cardDimensions.w / 2}, ${cardDimensions.h / 2 + 18})`}
    >
      <rect
        width={cardDimensions.w}
        height={120}
        fill="#FFFFFF"
        stroke="#CCCCCC"
        strokeWidth="1"
        rx={16}
        ry={16}
      />

      <rect width={cardDimensions.w} height={36} fill="#FFFFFF" />
      <g transform="translate(0, 4)">
        <rect
          width={cardDimensions.w / 2}
          height={28}
          fill={activeTab === 'list' ? '#f0f0f0' : 'transparent'}
          onClick={() => setActiveTab('list')}
        />
        <text
          x={cardDimensions.w / 4}
          y={20}
          fontSize="12"
          fontWeight={activeTab === 'list' ? '700' : '400'}
          fill="#000"
          textAnchor="middle"
        >
          Notes List
        </text>
        <rect
          x={cardDimensions.w / 2}
          width={cardDimensions.w / 2}
          height={28}
          fill={activeTab === 'create' ? '#f0f0f0' : 'transparent'}
          onClick={() => setActiveTab('create')}
        />
        <text
          x={(cardDimensions.w * 3) / 4}
          y={20}
          fontSize="12"
          fontWeight={activeTab === 'create' ? '700' : '400'}
          fill="#000"
          textAnchor="middle"
        >
          Create Note
        </text>
      </g>

      <g transform={`translate(${cardDimensions.w / 2}, 10)`}>
        <g style={{ cursor: 'pointer' }} onClick={toggleNotesPanel}>
          <circle r="10" fill="#F0F0F0" />
          <path d="M -6 0 L 6 0" stroke="#000000" strokeWidth="2" fill="none" />
        </g>
      </g>

      {activeTab === 'list' ? (
        <NotesList
          notes={notes}
          cardWidth={cardDimensions.w}
          isLoading={isLoading}
        />
      ) : (
        <NoteForm
          cardWidth={cardDimensions.w}
          newNote={newNote}
          setNewNote={setNewNote}
          isSaving={isSaving}
          error={error}
          onSave={onSaveNote}
          onCancel={onCancelCreate}
        />
      )}
    </g>
  );
};

export default React.memo(NotesPanel);
