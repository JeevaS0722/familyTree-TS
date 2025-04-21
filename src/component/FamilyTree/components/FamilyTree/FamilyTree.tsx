/* eslint-disable max-depth */
/* eslint-disable complexity */
// src/components/FamilyTree/FamilyTree.tsx
import React, { useRef } from 'react';
import { PersonData } from '../../types/familyTree';
import { TreeProvider, useTreeContext } from '../../context/TreeContext';
import TreeView from './TreeView';
import ConfigPanel from './controls/ConfigPanel';
import SearchBar from './controls/SearchBar';
import EditForm from './EditForm';
import { migratePersonData } from '../../utils/dataMigration';
import './FamilyTree.css';

interface FamilyTreeProps {
  data: PersonData[];
  mainId?: string;
  onPersonClick?: (personId: string) => void;
  onPersonEdit?: (person: PersonData) => void;
  onPersonAdd?: (person: PersonData) => void;
  onPersonDelete?: (personId: string) => void;
}

interface FamilyTreeContentProps {
  onPersonClick?: (personId: string) => void;
  onPersonEdit?: (person: PersonData) => void;
  onPersonAdd?: (person: PersonData) => void;
  onPersonDelete?: (personId: string) => void;
}

const FamilyTreeContent: React.FC<FamilyTreeContentProps> = ({
  onPersonClick,
  onPersonEdit,
  onPersonAdd,
  onPersonDelete,
}) => {
  const { state, updateData, updateMainId, updateTree } = useTreeContext();
  const svgRef = useRef<SVGSVGElement>(null);
  const [editFormOpen, setEditFormOpen] = React.useState(false);
  const [currentPerson, setCurrentPerson] = React.useState<
    PersonData | undefined
  >(undefined);
  const [relationType, setRelationType] = React.useState<
    'father' | 'mother' | 'spouse' | 'son' | 'daughter' | undefined
  >(undefined);

  // Handle person click for editing
  const handlePersonEdit = (person: PersonData) => {
    setCurrentPerson(person);
    setRelationType(undefined);
    setEditFormOpen(true);
  };

  // Handle adding a new relation
  const handleAddRelation = (
    type: 'father' | 'mother' | 'spouse' | 'son' | 'daughter'
  ) => {
    setCurrentPerson(undefined);
    setRelationType(type);
    setEditFormOpen(true);
  };

  // Save person (new or edited)
  const handleSavePerson = (person: PersonData) => {
    const isNew = !currentPerson;

    if (isNew) {
      // Handle new person/relation
      if (person._new_rel_data && state.mainId) {
        // This is a new relation to the main person
        const updatedData = [...state.data];
        const mainPerson = updatedData.find(p => p.id === state.mainId);

        if (mainPerson) {
          // Update relationships based on relation type
          switch (person._new_rel_data.rel_type) {
            case 'father':
              mainPerson.rels.father = person.id;
              if (!person.rels.children) {
                person.rels.children = [];
              }
              person.rels.children.push(mainPerson.id);
              break;
            case 'mother':
              mainPerson.rels.mother = person.id;
              if (!person.rels.children) {
                person.rels.children = [];
              }
              person.rels.children.push(mainPerson.id);
              break;
            case 'spouse':
              if (!mainPerson.rels.spouses) {
                mainPerson.rels.spouses = [];
              }
              mainPerson.rels.spouses.push(person.id);
              if (!person.rels.spouses) {
                person.rels.spouses = [];
              }
              person.rels.spouses.push(mainPerson.id);
              break;
            case 'son':
            case 'daughter':
              if (!mainPerson.rels.children) {
                mainPerson.rels.children = [];
              }
              mainPerson.rels.children.push(person.id);
              person.rels.father =
                mainPerson.data.gender === 'M' ? mainPerson.id : undefined;
              person.rels.mother =
                mainPerson.data.gender === 'F' ? mainPerson.id : undefined;

              // Handle other parent if specified
              if (
                person._new_rel_data.other_parent_id &&
                person._new_rel_data.other_parent_id !== '_new'
              ) {
                const otherParent = updatedData.find(
                  p => p.id === person._new_rel_data!.other_parent_id
                );
                if (otherParent) {
                  if (otherParent.data.gender === 'M') {
                    person.rels.father = otherParent.id;
                  }
                  if (otherParent.data.gender === 'F') {
                    person.rels.mother = otherParent.id;
                  }
                  if (!otherParent.rels.children) {
                    otherParent.rels.children = [];
                  }
                  otherParent.rels.children.push(person.id);
                }
              }
              break;
          }
        }

        delete person._new_rel_data; // Remove temporary relation data
        updatedData.push(person);
        updateData(updatedData);
      }
    } else {
      // Handle updating existing person
      const updatedData = state.data.map(p =>
        p.id === person.id ? { ...p, data: { ...person.data } } : p
      );
      updateData(updatedData);
    }

    // Update the tree
    updateTree();
  };

  // Delete person
  const handleDeletePerson = (personId: string) => {
    // Check if deleting would disconnect the tree
    const updatedData = state.data.filter(p => p.id !== personId);

    // Update references in other people
    updatedData.forEach(person => {
      // Remove references to the deleted person
      if (person.rels.father === personId) {
        delete person.rels.father;
      }
      if (person.rels.mother === personId) {
        delete person.rels.mother;
      }
      if (person.rels.spouses) {
        person.rels.spouses = person.rels.spouses.filter(id => id !== personId);
      }
      if (person.rels.children) {
        person.rels.children = person.rels.children.filter(
          id => id !== personId
        );
      }
    });

    updateData(updatedData);

    // If we're deleting the main person, select another one
    if (state.mainId === personId && updatedData.length > 0) {
      updateMainId(updatedData[0].id);
    }

    // Update the tree
    updateTree();
  };

  return (
    <div className="f3 f3-cont">
      <TreeView
        svgRef={svgRef}
        onPersonEdit={handlePersonEdit}
        onPersonAdd={onPersonAdd}
      />
      <ConfigPanel />
      <SearchBar />

      {/* Add Relation Buttons (normally would be on the card) */}
      {state.mainId && (
        <div className="f3-add-relation-buttons">
          <button onClick={() => handleAddRelation('father')}>
            Add Father
          </button>
          <button onClick={() => handleAddRelation('mother')}>
            Add Mother
          </button>
          <button onClick={() => handleAddRelation('spouse')}>
            Add Spouse
          </button>
          <button onClick={() => handleAddRelation('son')}>Add Son</button>
          <button onClick={() => handleAddRelation('daughter')}>
            Add Daughter
          </button>
        </div>
      )}

      {/* Edit Form */}
      {editFormOpen && (
        <EditForm
          person={currentPerson}
          relationType={relationType}
          isOpen={editFormOpen}
          onClose={() => setEditFormOpen(false)}
          onSave={handleSavePerson}
          onDelete={handleDeletePerson}
        />
      )}
    </div>
  );
};

const FamilyTree: React.FC<FamilyTreeProps> = ({
  data,
  mainId,
  onPersonClick,
  onPersonEdit,
  onPersonAdd,
  onPersonDelete,
}) => {
  // Migrate data to new structure if needed
  const migratedData = migratePersonData(data);
  return (
    <TreeProvider initialData={migratedData} initialMainId={mainId}>
      <FamilyTreeContent
        onPersonAdd={onPersonAdd}
        onPersonClick={onPersonClick}
        onPersonEdit={onPersonEdit}
        onPersonDelete={onPersonDelete}
      />
    </TreeProvider>
  );
};

export default FamilyTree;
