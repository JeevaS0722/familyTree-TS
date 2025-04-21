// src/component/FamilyTree/components/FamilyTree/Card/NotesPanel/NoteForm.tsx
import React from 'react';

interface NoteFormProps {
  cardWidth: number;
  newNote: { type: string; content: string };
  setNewNote: (note: { type: string; content: string }) => void;
  isSaving: boolean;
  error: string | null;
  onSave: () => void;
  onCancel: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({
  cardWidth,
  newNote,
  setNewNote,
  isSaving,
  error,
  onSave,
  onCancel,
}) => {
  return (
    <>
      <g transform="translate(10, 4)">
        <g transform="translate(0, 0)">
          <rect
            width={50}
            height={24}
            rx={4}
            ry={4}
            fill="#1976d2"
            onClick={onSave}
          />
          <text x={25} y={16} fontSize="11" fill="#FFFFFF" textAnchor="middle">
            {isSaving ? '...' : 'Save'}
          </text>
          <rect
            x={60}
            width={50}
            height={24}
            rx={4}
            ry={4}
            fill="transparent"
            stroke="#000"
            strokeWidth="1"
            onClick={onCancel}
          />
          <text x={85} y={16} fontSize="11" fill="#000" textAnchor="middle">
            Cancel
          </text>
        </g>
        <g transform={`translate(${cardWidth - 120}, 0)`}>
          <rect
            width={100}
            height={24}
            rx={4}
            ry={4}
            fill="#FFFFFF"
            stroke="#000"
            strokeWidth="1"
          />
          <text x={10} y={16} fontSize="11" fill="#000">
            {newNote.type}
          </text>
          <path
            d="M 0 0 L 4 4 L 8 0"
            transform="translate(85, 12) rotate(180)"
            fill="#333"
            onClick={() => console.log('Toggle note type')}
          />
        </g>
      </g>
      {error && (
        <text x={10} y={50} fontSize="12" fill="#d32f2f">
          {error}
        </text>
      )}
      <g transform="translate(10, 40)">
        <rect
          width={cardWidth - 20}
          height={60}
          rx={4}
          ry={4}
          fill="#FFFFFF"
          stroke="#000"
          strokeWidth="1"
        />
        <foreignObject x={5} y={5} width={cardWidth - 30} height={50}>
          <textarea
            value={newNote.content}
            onChange={e =>
              setNewNote(prev => ({ ...prev, content: e.target.value }))
            }
            placeholder="Enter your note here..."
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              fontSize: '12px',
              fontFamily: 'Roboto, sans-serif',
              resize: 'none',
            }}
          />
        </foreignObject>
      </g>
    </>
  );
};

export default React.memo(NoteForm);
