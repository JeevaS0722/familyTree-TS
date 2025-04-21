// src/component/FamilyTree/components/EnhancedFamilyTree.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { FamilyTree as BaseFamilyTree } from '../index';
import InitialNodeDialog from './dialogs/InitialNodeDialog';
import EditDialog from './dialogs/EditDialog';
import { PersonData } from '../types/familyTree';
import { Contact, ContactApiResponse } from '../types/familyTreeExtended';
import {
  mapContactsToFamilyTree,
  contactToPersonData,
} from '../utils/contactMapper';
import { useLazyGetContactsByFileQuery } from '../../../store/Services/contactService';

interface EnhancedFamilyTreeProps {
  initialContactList?: Contact[];
  initialFamilyData?: PersonData | null;
  loading?: boolean;
}

const EnhancedFamilyTree: React.FC<EnhancedFamilyTreeProps> = ({
  initialContactList = [],
  initialFamilyData = null,
  loading: initialLoading = false,
}) => {
  // Get parameters from URL
  const { fileId } = useParams<{ fileId: string }>();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const filename = query.get('filename');
  const decodedFileName = filename ? decodeURIComponent(filename) : '';

  // State for contacts and loading
  const [contactsData, setContactsData] =
    useState<Contact[]>(initialContactList);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('deceased, lastName, firstName');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [showInitialDialog, setShowInitialDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [editParentMember, setEditParentMember] = useState<PersonData | null>(
    null
  );
  const [editRelationType, setEditRelationType] = useState<
    'partner' | 'child' | null
  >(null);

  // Family data state with proper type
  const [familyData, setFamilyData] = useState<PersonData | null>(
    initialFamilyData
  );
  const [familyDataForTree, setFamilyDataForTree] = useState<PersonData[]>([]);

  // RTK Query hook
  const [getContactsByFile, { data: contactsResponse, isFetching }] =
    useLazyGetContactsByFileQuery();

  // Initial fetch of contacts
  useEffect(() => {
    if (!fileId) {
      return;
    }

    setLoading(true);
    setError(null);

    void getContactsByFile({
      fileid: Number(fileId),
      sortBy: sortBy,
      sortOrder: sortOrder,
    })
      .unwrap()
      .then((response: ContactApiResponse) => {
        try {
          console.log('API Response:', response);

          if (response.data?.contact) {
            const contacts = response.data.contact;
            setContactsData(contacts);

            // Try to build a family tree from the contacts
            const builtFamilyTree = mapContactsToFamilyTree(
              response,
              fileId,
              decodedFileName
            );

            if (builtFamilyTree) {
              console.log(
                'Found root node based on relationship or filename:',
                builtFamilyTree
              );
              setFamilyData(builtFamilyTree);
              setFamilyDataForTree([builtFamilyTree]);
              setShowInitialDialog(false);
            } else {
              console.log(
                'No contact matching criteria found. Showing initial dialog.'
              );
              setShowInitialDialog(true);
            }
          } else {
            setContactsData([]);
            setShowInitialDialog(true);
          }
        } catch (err) {
          console.error('Error processing contact data:', err);
          setError('Error processing contact data');
          setShowInitialDialog(true);
        }
      })
      .catch(err => {
        console.error('Error fetching contacts:', err);
        setError('Failed to fetch contacts');
        setShowInitialDialog(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fileId, decodedFileName, sortBy, sortOrder, getContactsByFile]);

  // Update familyDataForTree when familyData changes
  useEffect(() => {
    if (familyData) {
      setFamilyDataForTree([familyData]);
    } else {
      setFamilyDataForTree([]);
    }
  }, [familyData]);

  // The refreshContacts function
  const refreshContacts = useCallback(async () => {
    if (!fileId) {
      return [];
    }

    console.log('Refreshing contacts...');
    setLoading(true);
    setError(null);

    try {
      const response = await getContactsByFile({
        fileid: Number(fileId),
        sortBy: sortBy,
        sortOrder: sortOrder,
      }).unwrap();

      if (response.data?.contact) {
        setContactsData(response.data.contact);
        setLoading(false);
        return response.data.contact;
      } else {
        console.warn('No contact data in response');
        setContactsData([]);
        setLoading(false);
        return [];
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to fetch contacts');
      setLoading(false);
      return [];
    }
  }, [fileId, sortBy, sortOrder, getContactsByFile]);

  // Handle initial node selection
  const handleInitialNodeSave = useCallback((person: PersonData) => {
    setFamilyData(person);
    setFamilyDataForTree([person]);
    setShowInitialDialog(false);
  }, []);

  // Open edit dialog for adding child
  const handleAddChild = useCallback((member: PersonData) => {
    setEditParentMember(member);
    setEditRelationType('child');
    setShowEditDialog(true);
  }, []);

  // Open edit dialog for adding partner
  const handleAddPartner = useCallback((member: PersonData) => {
    setEditParentMember(member);
    setEditRelationType('partner');
    setShowEditDialog(true);
  }, []);

  // Handle adding a new person from edit dialog
  const handleAddPerson = useCallback(
    (person: PersonData, relationshipType: 'partner' | 'child') => {
      if (!familyData || !editParentMember) {
        return;
      }

      console.log(
        'Adding person:',
        person,
        'with relationship:',
        relationshipType
      );

      // Create a deep copy of the family data
      const updatedData = JSON.parse(JSON.stringify(familyData)) as PersonData;

      // Find the parent member in the tree
      const findAndUpdateMember = (
        member: PersonData,
        targetId: string
      ): boolean => {
        if (member.id === targetId) {
          // Found the parent, update its relationships
          if (relationshipType === 'child') {
            if (!member.rels.children) {
              member.rels.children = [];
            }
            member.rels.children.push(person.id);

            // Set parent-child relationship
            if (member.data.gender === 'M') {
              person.rels.father = member.id;
            } else if (member.data.gender === 'F') {
              person.rels.mother = member.id;
            }
          } else if (relationshipType === 'partner') {
            if (!member.rels.spouses) {
              member.rels.spouses = [];
            }
            member.rels.spouses.push(person.id);

            // Set bidirectional partnership
            if (!person.rels.spouses) {
              person.rels.spouses = [];
            }
            person.rels.spouses.push(member.id);
          }
          return true;
        }

        // Check children recursively
        if (member.rels.children && member.rels.children.length > 0) {
          for (const childId of member.rels.children) {
            const childMember = findMemberById(updatedData, childId);
            if (childMember && findAndUpdateMember(childMember, targetId)) {
              return true;
            }
          }
        }

        return false;
      };

      // Find the member by ID helper function
      const findMemberById = (
        root: PersonData,
        id: string
      ): PersonData | null => {
        if (root.id === id) {
          return root;
        }

        if (root.rels.children) {
          for (const childId of root.rels.children) {
            // This is a simplified approach - in a real app, you'd have proper tree traversal
            // and track visited nodes to avoid circular references
            if (childId === id) {
              // We found the ID, but we need the actual object
              // In a real app, you'd have a map of all nodes or proper tree traversal
              return { id: childId } as PersonData; // Simplified
            }
          }
        }

        return null;
      };

      // Update the family tree
      findAndUpdateMember(updatedData, editParentMember.id);

      // Add the new person to the family data
      // In a real implementation, you'd use a more sophisticated approach to maintain the tree structure
      setFamilyData(prevData => {
        if (!prevData) {
          return updatedData;
        }

        // Here you would properly integrate the new person into the tree
        // This is a simplified approach
        return updatedData;
      });

      setShowEditDialog(false);
      setEditParentMember(null);
      setEditRelationType(null);
    },
    [familyData, editParentMember]
  );

  // Handle editing a person
  const handlePersonEdit = useCallback((person: PersonData) => {
    console.log('Edit person:', person);
    // In a real implementation, you'd open an edit dialog
    // For now, this is just a placeholder
  }, []);

  // Handle deleting a person
  const handlePersonDelete = useCallback(
    (personId: string) => {
      if (!familyData) {
        return;
      }

      console.log('Delete person:', personId);

      // Create a deep copy of the family data
      const updatedData = JSON.parse(JSON.stringify(familyData)) as PersonData;

      // Remove references to the deleted person
      // This is a simplified approach - in a real app, you'd have proper tree traversal
      const removeReferences = (member: PersonData) => {
        // Remove from children array
        if (member.rels.children) {
          member.rels.children = member.rels.children.filter(
            id => id !== personId
          );
        }

        // Remove from spouses array
        if (member.rels.spouses) {
          member.rels.spouses = member.rels.spouses.filter(
            id => id !== personId
          );
        }

        // Check children recursively
        if (member.rels.children) {
          for (const childId of member.rels.children) {
            const childMember = findMemberById(updatedData, childId);
            if (childMember) {
              removeReferences(childMember);
            }
          }
        }
      };

      // Find the member by ID helper function
      const findMemberById = (
        root: PersonData,
        id: string
      ): PersonData | null => {
        if (root.id === id) {
          return root;
        }

        if (root.rels.children) {
          for (const childId of root.rels.children) {
            // Simplified approach
            if (childId === id) {
              return { id: childId } as PersonData; // Simplified
            }
          }
        }

        return null;
      };

      // Update the family tree
      removeReferences(updatedData);

      // Update state
      setFamilyData(updatedData);
    },
    [familyData]
  );

  // Handle updating relationship type
  const handleUpdateRelationship = useCallback(
    (node: PersonData, newType: string) => {
      if (!familyData) {
        return;
      }

      console.log('Update relationship:', node.id, 'New type:', newType);

      // Create a deep copy of the family data
      const updatedData = JSON.parse(JSON.stringify(familyData)) as PersonData;

      // Find and update the relationship type
      const updateRelationshipType = (
        member: PersonData,
        targetId: string,
        newRelType: string
      ): boolean => {
        if (member.id === targetId) {
          member.data.relationshipType = newRelType;
          return true;
        }

        // Check children recursively
        if (member.rels.children && member.rels.children.length > 0) {
          for (const childId of member.rels.children) {
            const childMember = findMemberById(updatedData, childId);
            if (
              childMember &&
              updateRelationshipType(childMember, targetId, newRelType)
            ) {
              return true;
            }
          }
        }

        return false;
      };

      // Find the member by ID helper function
      const findMemberById = (
        root: PersonData,
        id: string
      ): PersonData | null => {
        if (root.id === id) {
          return root;
        }

        if (root.rels.children) {
          for (const childId of root.rels.children) {
            // Simplified approach
            if (childId === id) {
              return { id: childId } as PersonData; // Simplified
            }
          }
        }

        return null;
      };

      // Update the relationship type
      updateRelationshipType(updatedData, node.id, newType);

      // Update state
      setFamilyData(updatedData);
    },
    [familyData]
  );

  // Render loading state
  if (loading || isFetching) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box sx={{ p: 3, color: 'error.main' }}>
        <Typography variant="h6">Error</Typography>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Initial Node Dialog */}
      <InitialNodeDialog
        open={showInitialDialog}
        onClose={() => {
          if (familyData) {
            setShowInitialDialog(false);
          }
        }}
        onSave={handleInitialNodeSave}
        isFirstNode={true}
        contactList={contactsData}
        fileId={fileId}
      />

      {/* Edit Dialog */}
      <EditDialog
        open={showEditDialog}
        onClose={() => {
          setShowEditDialog(false);
          setEditParentMember(null);
          setEditRelationType(null);
        }}
        onSave={handleAddPerson}
        parentMember={editParentMember}
        contactList={contactsData}
        existingFamilyMembers={familyDataForTree}
        refreshContacts={refreshContacts}
        fileId={fileId}
      />

      {/* Family Tree */}
      <Box sx={{ width: '100%', height: '100%' }}>
        <BaseFamilyTree
          data={familyDataForTree}
          mainId={familyData?.id}
          onPersonClick={personId => console.log('Person clicked:', personId)}
          onPersonEdit={handlePersonEdit}
          onPersonAdd={person => console.log('Person added:', person)}
          onPersonDelete={handlePersonDelete}
          onAddChild={handleAddChild}
          onAddPartner={handleAddPartner}
          onUpdateRelationship={handleUpdateRelationship}
        />
      </Box>
    </>
  );
};

export default EnhancedFamilyTree;
