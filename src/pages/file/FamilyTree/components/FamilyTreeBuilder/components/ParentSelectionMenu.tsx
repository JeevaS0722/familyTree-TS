// src/pages/file/FamilyTree/components/FamilyTreeBuilder/components/ParentSelectionMenu.tsx
import React, { useEffect, useState } from 'react';
import { TreeNode } from '../types/familyTree';

interface ParentOption {
  id: string;
  name: string;
  isCurrentSpouse: boolean;
}

interface ParentSelectionMenuProps {
  node: TreeNode;
  relationType: 'son' | 'daughter';
  position: { x: number; y: number };
  onSelect: (relationType: string, otherParentId?: string) => void;
  onClose: () => void;
  existingFamilyMembers: TreeNode[];
}

const ParentSelectionMenu: React.FC<ParentSelectionMenuProps> = ({
  node,
  relationType,
  position,
  onSelect,
  onClose,
  existingFamilyMembers,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [parentOptions, setParentOptions] = useState<ParentOption[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const options: ParentOption[] = [];

    const spouseIds = node.data.rels.spouses || [];

    spouseIds.forEach(spouseId => {
      const spouse = existingFamilyMembers.find(m => m.data.id === spouseId);
      if (spouse) {
        options.push({
          id: spouse.data.id,
          name: spouse.data.data.name || 'Unknown',
          isCurrentSpouse: true,
        });
      }
    });

    setParentOptions(options);
  }, [node, existingFamilyMembers]);

  const menuStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x + 180}px`,
    top: `${position.y - 100}px`,
    width: '280px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    padding: '15px',
    zIndex: 1100,
    transform: isOpen ? 'scale(1)' : 'scale(0.8)',
    opacity: isOpen ? 1 : 0,
    transition: 'transform 0.3s, opacity 0.3s',
  };

  const handleOptionSelect = (otherParentId?: string) => {
    onSelect(relationType, otherParentId);
  };

  return (
    <div className="parent-selection-menu" style={menuStyle}>
      <div
        style={{
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: '10px',
          textAlign: 'center',
        }}
      >
        Add {relationType} with:
      </div>

      {parentOptions.length > 0 ? (
        parentOptions.map(option => (
          <div
            key={option.id}
            style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#f5f5f5',
              marginBottom: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            }}
            onClick={() => handleOptionSelect(option.id)}
          >
            With {option.name} {option.isCurrentSpouse ? '(Current)' : '(Ex)'}
          </div>
        ))
      ) : (
        <div
          style={{
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: '#f5f5f5',
            marginBottom: '8px',
            color: '#666',
            textAlign: 'center',
          }}
        >
          No spouses found
        </div>
      )}

      <div
        style={{
          padding: '12px',
          borderRadius: '8px',
          backgroundColor: '#f5f5f5',
          marginBottom: '8px',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          '&:hover': {
            backgroundColor: '#e0e0e0',
          },
        }}
        onClick={() => handleOptionSelect()}
      >
        Single Parent
      </div>

      <div
        style={{
          padding: '12px',
          borderRadius: '8px',
          backgroundColor: '#f44336',
          color: 'white',
          cursor: 'pointer',
          textAlign: 'center',
          marginTop: '10px',
          '&:hover': {
            backgroundColor: '#d32f2f',
          },
        }}
        onClick={onClose}
      >
        Cancel
      </div>
    </div>
  );
};

export default ParentSelectionMenu;
