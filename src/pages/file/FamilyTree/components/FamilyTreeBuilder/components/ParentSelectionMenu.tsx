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

  // Open the menu with animation after mounting
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Generate parent options based on the node's relationships with enhanced logging
  useEffect(() => {
    const options: ParentOption[] = [];

    // Find all spouses (current and ex)
    const spouseIds = node.data.rels.spouses || [];

    console.log(`Finding spouses for node ${node.data.id}:`, spouseIds);

    spouseIds.forEach(spouseId => {
      const spouse = existingFamilyMembers.find(m => m.data.id === spouseId);
      if (spouse) {
        console.log(
          `Found spouse: ${spouse.data.id} - ${spouse.data.data.name || 'Unknown'}`
        );
        options.push({
          id: spouse.data.id,
          name: spouse.data.data.name || 'Unknown',
          isCurrentSpouse: true, // Could distinguish current vs ex in a real implementation
        });
      } else {
        console.log(`Spouse with ID ${spouseId} not found in family members`);
      }
    });

    setParentOptions(options);
    console.log(`Total parent options found: ${options.length}`);
  }, [node, existingFamilyMembers]);

  // Menu styling
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

  // Handle option selection with logging
  const handleOptionSelect = (otherParentId?: string) => {
    console.log(
      `Selected ${relationType} with${otherParentId ? ' other parent: ' + otherParentId : 'out other parent'}`
    );
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

      {/* Options for adding with each spouse */}
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

      {/* Single parent option */}
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

      {/* Cancel button */}
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
