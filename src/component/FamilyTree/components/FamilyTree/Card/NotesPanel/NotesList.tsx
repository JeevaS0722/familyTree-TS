// src/component/FamilyTree/components/FamilyTree/Card/NotesPanel/NotesList.tsx
import React from 'react';
import { Note } from '../types';

interface NotesListProps {
  notes: Note[];
  cardWidth: number;
  isLoading: boolean;
}

const NotesList: React.FC<NotesListProps> = ({
  notes,
  cardWidth,
  isLoading,
}) => {
  return (
    <g transform="translate(10, 40)">
      {isLoading ? (
        <text x={cardWidth / 2 - 10} y={20} fontSize="12" fill="#666">
          Loading...
        </text>
      ) : notes.length === 0 ? (
        <text x={cardWidth / 2 - 10} y={20} fontSize="12" fill="#666">
          No notes found
        </text>
      ) : (
        notes.map((note, index) => (
          <g key={note.id} transform={`translate(0, ${index * 40})`}>
            <rect
              width={cardWidth - 20}
              height={36}
              rx={6}
              ry={6}
              fill="#f9f9f9"
              stroke="#EEEEEE"
              strokeWidth="1"
            />
            <text x={5} y={12} fontSize="10" fill="#666666">
              {note.type} • {note.createdDate} • {note.createdBy}
            </text>
            <text x={5} y={28} fontSize="11" fill="#000000">
              {note.content.length > 30
                ? `${note.content.substring(0, 27)}...`
                : note.content}
            </text>
          </g>
        ))
      )}
    </g>
  );
};

export default React.memo(NotesList);
