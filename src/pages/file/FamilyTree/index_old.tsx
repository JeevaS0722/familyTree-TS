/* eslint-disable complexity */
/* eslint-disable max-depth */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { FamilyTree } from '../../../component/FamilyTree';
import { PersonData } from '../../../component/FamilyTree/types/familyTree';
import { useLazyGetContactsByFileQuery } from '../../../store/Services/contactService';
import { Contact, ContactApiResponse } from './types';
import { Box, CircularProgress } from '@mui/material';
import { mapContactsToFamilyTree } from './utils/mapper';
import InitialNodeDialog from './components/InitialNodeDialog';
import EditDialog from './components/EditDialog';

const App: React.FC = () => {
  // Get parameters from URL
  const { fileId } = useParams<{ fileId: string }>();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const filename = query.get('filename');
  const decodedFileName = filename ? decodeURIComponent(filename) : '';
  const [contactsData, setContactsData] = useState<Contact[]>([]);
  const [familyData, setFamilyData] = useState<PersonData[]>([]);
  const [rootMember, setRootMember] = useState<PersonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showInitialDialog, setShowInitialDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [currentPerson, setCurrentPerson] = useState<PersonData | null>(null);

  // RTK Query hook
  const [getContactsByFile, { data: contactsResponse, isFetching, isLoading }] =
    useLazyGetContactsByFileQuery();

  // Initial fetch of contacts
  useEffect(() => {
    setLoading(true);
    void getContactsByFile({
      fileid: Number(fileId),
      sortBy: 'deceased, lastName, firstName',
      sortOrder: 'asc',
    })
      .unwrap()
      .then(response => {
        try {
          console.log('API Response:', response);

          // Store the raw contacts for autocomplete in dialogs
          if (response.data?.contact) {
            // Cast through unknown first to satisfy TypeScript when types don't overlap sufficiently
            const contacts = response.data.contact as unknown as Contact[]; // Assert type to match state
            setContactsData(contacts);

            // Try to build a family tree from the contacts using only our two specific checks
            const builtFamilyTree = mapContactsToFamilyTree(
              response as unknown as ContactApiResponse, // Cast to the expected type
              decodedFileName,
              fileId
            );

            if (builtFamilyTree) {
              // We successfully found a root based on the two checks
              console.log(
                'Found root node based on relationship or filename:',
                builtFamilyTree
              );
              setRootMember(builtFamilyTree);
              setFamilyData([builtFamilyTree]);
              setShowInitialDialog(false);
            } else {
              // Neither check succeeded - show the initial dialog
              console.log(
                'No contact matching criteria found. Showing initial dialog.'
              );
              setShowInitialDialog(true);
            }
          } else {
            // No contacts - definitely show initial dialog
            setContactsData([]);
            setShowInitialDialog(true);
          }
        } catch (err) {
          console.error('Error processing contact data:', err);
          setShowInitialDialog(true);
        }
      })
      .catch(err => {
        console.error('Error fetching contacts:', err);
        setShowInitialDialog(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fileId, decodedFileName]);

  // The refreshContacts function now preserves familyData
  const refreshContacts = async () => {
    console.log('Refreshing contacts...');
    console.log('Current familyData before refresh:', familyData);

    // Set loading without unmounting the tree component
    setLoading(true);

    try {
      const response = await getContactsByFile({
        fileid: Number(fileId),
        sortBy: 'deceased, lastName, firstName',
        sortOrder: 'asc',
      }).unwrap();

      console.log('Refresh API Response:', response);

      if (response.data?.contact) {
        // Update the contacts data
        setContactsData(response.data.contact as unknown as Contact[]);
        console.log(
          'Updated contactsData with fresh data:',
          response.data.contact
        );

        // Finish loading
        setLoading(false);
        return response.data.contact as unknown as Contact[];
      } else {
        console.warn('No contact data in response');
        setContactsData([]);

        // Finish loading
        setLoading(false);
        return [];
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);

      // Finish loading
      setLoading(false);
      return [];
    }
  };

  // Handle person click
  const handlePersonClick = (personId: string) => {
    console.log(`Person clicked: ${personId}`);
  };

  // Handle person edit
  const handlePersonEdit = (person: PersonData) => {
    console.log('Person edited:', person);

    // Update the person in the data
    const updatedData = familyData.map(p =>
      p.id === person.id ? { ...p, data: { ...person.data } } : p
    );

    setFamilyData(updatedData);
  };

  // Handle person add
  const handlePersonAdd = (person: PersonData) => {
    console.log('Person added:', person);
    setCurrentPerson(person.data);
    setShowEditDialog(true);
  };

  // Handle person delete
  const handlePersonDelete = (personId: string) => {
    console.log(`Person deleted: ${personId}`);

    // Remove the person from the data
    setFamilyData(familyData.filter(p => p.id !== personId));
  };

  const handleRootmemberAdd = (newRootMember: PersonData) => {
    console.log('Root member add:', newRootMember);
    setShowInitialDialog(false);
    setFamilyData([newRootMember]);
    setRootMember(newRootMember);
  };

  // Helper function to process relationships
  const processRelationship = (
    parentMember: PersonData,
    newNode: PersonData,
    relType: 'partner' | 'child',
    updatedData: PersonData[]
  ) => {
    // HANDLE PARTNER/SPOUSE RELATIONSHIP
    if (relType === 'partner') {
      console.log('Processing PARTNER relationship');

      // Set up bidirectional spouse relationships
      if (!parentMember.rels.spouses) {
        parentMember.rels.spouses = [];
      }

      console.log('Parent spouses before:', parentMember.rels.spouses);

      if (!parentMember.rels.spouses.includes(newNode.id)) {
        parentMember.rels.spouses.push(newNode.id);
      }

      console.log('Parent spouses after:', parentMember.rels.spouses);

      if (!newNode.rels.spouses) {
        newNode.rels.spouses = [];
      }

      console.log('New node spouses before:', newNode.rels.spouses);

      if (!newNode.rels.spouses.includes(parentMember.id)) {
        newNode.rels.spouses.push(parentMember.id);
      }

      console.log('New node spouses after:', newNode.rels.spouses);

      // Set relationship type for display
      newNode.relation_type = 'Partner';

      // Process children relationships if needed
      if (parentMember.rels.children && parentMember.rels.children.length > 0) {
        console.log(
          'Parent has children, checking if new node should be their parent'
        );

        parentMember.rels.children.forEach(childId => {
          const childNode = updatedData.find(node => node.id === childId);
          if (childNode) {
            // Add parent relationship based on gender
            if (parentMember.data.gender === 'M' && !childNode.rels.mother) {
              if (newNode.data.gender === 'F') {
                console.log(
                  `Setting ${newNode.id} as mother of child ${childId}`
                );
                childNode.rels.mother = newNode.id;

                // Add child to new node's children
                if (!newNode.rels.children) {
                  newNode.rels.children = [];
                }
                if (!newNode.rels.children.includes(childId)) {
                  newNode.rels.children.push(childId);
                }
              }
            } else if (
              parentMember.data.gender === 'F' &&
              !childNode.rels.father
            ) {
              if (newNode.data.gender === 'M') {
                console.log(
                  `Setting ${newNode.id} as father of child ${childId}`
                );
                childNode.rels.father = newNode.id;

                // Add child to new node's children
                if (!newNode.rels.children) {
                  newNode.rels.children = [];
                }
                if (!newNode.rels.children.includes(childId)) {
                  newNode.rels.children.push(childId);
                }
              }
            }
          }
        });
      }
    }
    // HANDLE CHILD RELATIONSHIP
    else if (relType === 'child') {
      console.log('Processing CHILD relationship');

      // Add child to parent's children array
      if (!parentMember.rels.children) {
        parentMember.rels.children = [];
      }

      console.log('Parent children before:', parentMember.rels.children);

      if (!parentMember.rels.children.includes(newNode.id)) {
        parentMember.rels.children.push(newNode.id);
      }

      console.log('Parent children after:', parentMember.rels.children);

      // Set parent reference based on gender
      if (parentMember.data.gender === 'M') {
        console.log(`Setting father of ${newNode.id} to ${parentMember.id}`);
        newNode.rels.father = parentMember.id;
      } else if (parentMember.data.gender === 'F') {
        console.log(`Setting mother of ${newNode.id} to ${parentMember.id}`);
        newNode.rels.mother = parentMember.id;
      }

      // Set relationship type for display
      newNode.relation_type = 'Child';

      // Handle other parent
      processOtherParent(parentMember, newNode, updatedData);
    }
  };

  // Helper function to process the other parent relationship
  const processOtherParent = (
    parentMember: PersonData,
    newNode: PersonData,
    updatedData: PersonData[]
  ) => {
    // Check if new node has _new_rel_data with other_parent_id
    if (newNode._new_rel_data && newNode._new_rel_data.other_parent_id) {
      console.log('Processing specified other parent from _new_rel_data');
      const otherParentId = newNode._new_rel_data.other_parent_id;

      // Only process if it's not "_new" (which would mean "Add New Parent")
      if (otherParentId !== '_new') {
        const otherParent = updatedData.find(p => p.id === otherParentId);

        if (otherParent) {
          console.log('Found other parent:', otherParent);

          // Set the other parent based on gender
          if (otherParent.data.gender === 'M') {
            console.log(`Setting father of ${newNode.id} to ${otherParent.id}`);
            newNode.rels.father = otherParent.id;
          } else if (otherParent.data.gender === 'F') {
            console.log(`Setting mother of ${newNode.id} to ${otherParent.id}`);
            newNode.rels.mother = otherParent.id;
          }

          // Add child to other parent's children
          if (!otherParent.rels.children) {
            otherParent.rels.children = [];
          }

          console.log(
            'Other parent children before:',
            otherParent.rels.children
          );

          if (!otherParent.rels.children.includes(newNode.id)) {
            otherParent.rels.children.push(newNode.id);
          }

          console.log(
            'Other parent children after:',
            otherParent.rels.children
          );

          // Ensure spouses relationship is set up between parents
          ensureSpouseRelationship(parentMember, otherParent);
        } else {
          console.error(
            `Other parent with ID ${otherParentId} not found in family data`
          );
        }
      }

      // Remove temporary data
      delete newNode._new_rel_data;
    }
    // If no specific other parent was selected but parent has spouses
    else if (
      parentMember.rels.spouses &&
      parentMember.rels.spouses.length > 0
    ) {
      console.log('Using first spouse as other parent');

      // If the parent has spouses, we can assume the first spouse is the other parent
      const otherParentId = parentMember.rels.spouses[0];
      const otherParent = updatedData.find(p => p.id === otherParentId);

      if (otherParent) {
        console.log('Found other parent from spouses:', otherParent);

        // Set the other parent based on gender
        if (otherParent.data.gender === 'M' && !newNode.rels.father) {
          console.log(`Setting father of ${newNode.id} to ${otherParent.id}`);
          newNode.rels.father = otherParent.id;
        } else if (otherParent.data.gender === 'F' && !newNode.rels.mother) {
          console.log(`Setting mother of ${newNode.id} to ${otherParent.id}`);
          newNode.rels.mother = otherParent.id;
        }

        // Add child to other parent's children
        if (!otherParent.rels.children) {
          otherParent.rels.children = [];
        }

        console.log('Other parent children before:', otherParent.rels.children);

        if (!otherParent.rels.children.includes(newNode.id)) {
          otherParent.rels.children.push(newNode.id);
        }

        console.log('Other parent children after:', otherParent.rels.children);
      } else {
        console.error(
          `First spouse with ID ${otherParentId} not found in family data`
        );
      }
    }
  };

  // Helper function to ensure spouse relationship is bi-directional
  const ensureSpouseRelationship = (
    person1: PersonData,
    person2: PersonData
  ) => {
    // Add spouse relationship from person1 to person2
    if (!person1.rels.spouses) {
      person1.rels.spouses = [];
    }

    console.log(`${person1.id} spouses before:`, person1.rels.spouses);

    if (!person1.rels.spouses.includes(person2.id)) {
      person1.rels.spouses.push(person2.id);
    }

    console.log(`${person1.id} spouses after:`, person1.rels.spouses);

    // Add spouse relationship from person2 to person1
    if (!person2.rels.spouses) {
      person2.rels.spouses = [];
    }

    console.log(`${person2.id} spouses before:`, person2.rels.spouses);

    if (!person2.rels.spouses.includes(person1.id)) {
      person2.rels.spouses.push(person1.id);
    }

    console.log(`${person2.id} spouses after:`, person2.rels.spouses);
  };

  // Update the handleAddNewNode function to ensure rels object is initialized
  const handleAddNewNode = (
    newNode: PersonData,
    relationshipType: 'partner' | 'child'
  ) => {
    console.log('New node added:', newNode);
    console.log('Relationship type:', relationshipType);
    console.log('Current person ID:', currentPerson?.id);

    // If we don't have relationship type data, try to infer from the node or default to partner
    let relType = relationshipType;
    if (!relType) {
      if (
        newNode.relation_type?.toLowerCase().includes('child') ||
        newNode._new_rel_data?.rel_type === 'son' ||
        newNode._new_rel_data?.rel_type === 'daughter'
      ) {
        relType = 'child';
      } else {
        relType = 'partner';
      }
      console.log('Inferred relationship type:', relType);
    }

    // Ensure the newNode has rels initialized
    if (!newNode.rels) {
      newNode.rels = {};
    }

    setFamilyData(prevData => {
      const updatedData = [...prevData];

      // Debug available IDs to help diagnose the parent lookup
      console.log(
        'Available IDs in family data:',
        updatedData.map(d => d.id).join(', ')
      );

      // Add direct ID comparison as a fallback
      const parentMember = currentPerson
        ? updatedData.find(member => {
            // Ensure string comparison for IDs
            const memberId = String(member.id);
            const currentId = String(currentPerson.id);
            console.log(
              `Comparing ${memberId} with ${currentId}: ${memberId === currentId}`
            );
            return memberId === currentId;
          })
        : null;

      if (!parentMember && currentPerson) {
        console.error(
          'Parent member not found in family data! Adding it first...'
        );
        // If parent isn't found (but should be), add it to the data first
        updatedData.push(currentPerson);

        // Now try to find it again
        const refetchedParent = updatedData.find(
          member => String(member.id) === String(currentPerson.id)
        );
        console.log('Re-fetched parent after adding:', refetchedParent);

        if (refetchedParent) {
          // Now continue with the parent we found
          processRelationship(refetchedParent, newNode, relType, updatedData);
        } else {
          console.error('Still could not find parent even after adding it!');
        }
      } else if (parentMember) {
        console.log('Found parent member:', parentMember);
        processRelationship(parentMember, newNode, relType, updatedData);
      } else {
        console.error('No current person set, cannot establish relationship');
      }

      // Clear temporary properties
      newNode.to_add = false;

      // Log the final state of the node
      console.log('New node after processing:', newNode);

      // Add the new node to the array and return
      return [...updatedData, newNode];
    });

    setShowEditDialog(false);
  };

  if (showInitialDialog) {
    return (
      <InitialNodeDialog
        open={showInitialDialog}
        onClose={() => setShowInitialDialog(false)}
        onSave={handleRootmemberAdd}
        isFirstNode={familyData.length === 0}
        contactList={contactsData}
      />
    );
  }

  return (
    <Box position="relative" width="100%" height="100%">
      {!showEditDialog && familyData?.length > 0 && (
        <FamilyTree
          data={familyData}
          mainId={rootMember?.id || ''}
          onPersonClick={handlePersonClick}
          onPersonEdit={handlePersonEdit}
          onPersonAdd={handlePersonAdd}
          onPersonDelete={handlePersonDelete}
        />
      )}
      {(loading || isFetching) && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor="rgba(0,0,0,0.6)"
          zIndex={1000}
        >
          <CircularProgress style={{ color: '#FFFFFF' }} />
        </Box>
      )}
      <EditDialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onSave={handleAddNewNode}
        existingFamilyMembers={familyData}
        parentMember={currentPerson}
        refreshContacts={refreshContacts}
        contactList={contactsData}
      />
    </Box>
  );
};

export default App;
