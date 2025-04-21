// src/component/FamilyTree/components/enhancedFamilyTree/EnhancedFamilyTreeWrapper.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { FamilyTree } from '../../index';
import { PersonData } from '../../types/familyTree';
import { Contact, ContactApiResponse } from '../../types/familyTreeExtended';
import {
  mapContactsToFamilyTree,
  contactToPersonData,
} from '../../utils/contactMapper';
import InitialNodeDialog from '../dialogs/InitialNodeDialog';
import EditDialog from '../dialogs/EditDialog';
import { useLazyGetContactsByFileQuery } from '../../../../store/Services/contactService';

interface EnhancedFamilyTreeWrapperProps {
  initialContactList?: Contact[];
  initialFamilyData?: PersonData | null;
  loading?: boolean;
}

/**
 * Enhanced Family Tree Wrapper
 * - Handles fetching contacts from API
 * - Root node selection logic
 * - Initial dialog when no root is automatically determined
 * - Provides add/edit/delete functionality
 */
const EnhancedFamilyTreeWrapper: React.FC<EnhancedFamilyTreeWrapperProps> = ({
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

  // UI state
  const [contactsData, setContactsData] =
    useState<Contact[]>(initialContactList);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);
  const [showInitialDialog, setShowInitialDialog] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [parentMember, setParentMember] = useState<PersonData | null>(null);

  // Sort parameters
  const [sortBy] = useState<string>('deceased, lastName, firstName');
  const [sortOrder] = useState<string>('asc');

  // Family tree data
  const [familyData, setFamilyData] = useState<PersonData | null>(
    initialFamilyData
  );
  const [mainId, setMainId] = useState<string | null>(
    initialFamilyData?.id || null
  );
  const [familyMembers, setFamilyMembers] = useState<PersonData[]>([]);

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

          // Store the raw contacts for autocomplete in dialogs
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
              // We successfully found a root based on the two checks
              console.log(
                'Found root node based on relationship or filename:',
                builtFamilyTree
              );
              setFamilyData(builtFamilyTree);
              setMainId(builtFamilyTree.id);
              setFamilyMembers([builtFamilyTree]);
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

  // Refresh contacts from API
  const refreshContacts = useCallback(async (): Promise<Contact[]> => {
    if (!fileId) {
      return [];
    }
    console.log('Refreshing contacts...');

    try {
      setLoading(true);
      const response = await getContactsByFile({
        fileid: Number(fileId),
        sortBy,
        sortOrder,
      }).unwrap();

      if (response.data?.contact) {
        const contacts = response.data.contact;
        setContactsData(contacts);
        return contacts;
      }
      return [];
    } catch (err) {
      console.error('Error refreshing contacts:', err);
      setError('Failed to refresh contacts');
      return [];
    } finally {
      setLoading(false);
    }
  }, [fileId, sortBy, sortOrder, getContactsByFile]);

  // Handle initial node selection
  const handleInitialNodeSave = useCallback((member: PersonData) => {
    setFamilyData(member);
    setMainId(member.id);
    setFamilyMembers([member]);
    setShowInitialDialog(false);
  }, []);

  // Handle adding a new family member
  const handleAddMember = useCallback(
    (newMember: PersonData, relationshipType: 'partner' | 'child') => {
      if (!parentMember || !familyData) {
        return;
      }

      console.log('Adding new member:', {
        newMember,
        relationshipType,
        parentMember,
      });

      // Create a deep copy of family members array
      const updatedMembers = [...familyMembers];

      // Add the new member to the array
      updatedMembers.push(newMember);

      // Update the parent member's relationships
      const parentIndex = updatedMembers.findIndex(
        m => m.id === parentMember.id
      );
      if (parentIndex !== -1) {
        if (relationshipType === 'partner') {
          // Add as partner
          if (!updatedMembers[parentIndex].rels.spouses) {
            updatedMembers[parentIndex].rels.spouses = [];
          }
          updatedMembers[parentIndex].rels.spouses.push(newMember.id);
        } else if (relationshipType === 'child') {
          // Add as child
          if (!updatedMembers[parentIndex].rels.children) {
            updatedMembers[parentIndex].rels.children = [];
          }
          updatedMembers[parentIndex].rels.children.push(newMember.id);
        }
      }

      // Update state
      setFamilyMembers(updatedMembers);
      setEditDialogOpen(false);
      setParentMember(null);
    },
    [parentMember, familyData, familyMembers]
  );

  // Handle person click for editing
  const handlePersonClick = useCallback(
    (personId: string) => {
      // Update the main ID
      setMainId(personId);

      // Find the person in the family members
      const person = familyMembers.find(m => m.id === personId);
      if (person) {
        setFamilyData(person);
      }
    },
    [familyMembers]
  );

  // Handle partner addition
  const handleAddPartner = useCallback((member: PersonData) => {
    setParentMember(member);
    setEditDialogOpen(true);
  }, []);

  // Handle child addition
  const handleAddChild = useCallback((member: PersonData) => {
    setParentMember(member);
    setEditDialogOpen(true);
  }, []);

  // Handle person editing
  const handlePersonEdit = useCallback(
    (person: PersonData) => {
      // Update the person in the family members
      const updatedMembers = familyMembers.map(m =>
        m.id === person.id ? { ...m, ...person } : m
      );

      setFamilyMembers(updatedMembers);

      // Update main data if needed
      if (person.id === mainId) {
        setFamilyData(person);
      }
    },
    [familyMembers, mainId]
  );

  // Handle person deletion
  const handlePersonDelete = useCallback(
    (personId: string) => {
      // Remove the person from family members
      const updatedMembers = familyMembers.filter(m => m.id !== personId);

      // Update all relationships
      updatedMembers.forEach(member => {
        // Remove from spouses
        if (member.rels.spouses) {
          member.rels.spouses = member.rels.spouses.filter(
            id => id !== personId
          );
        }

        // Remove from children
        if (member.rels.children) {
          member.rels.children = member.rels.children.filter(
            id => id !== personId
          );
        }

        // Clear father/mother if needed
        if (member.rels.father === personId) {
          member.rels.father = undefined;
        }
        if (member.rels.mother === personId) {
          member.rels.mother = undefined;
        }
      });

      setFamilyMembers(updatedMembers);

      // If we removed the main person, select another
      if (personId === mainId && updatedMembers.length > 0) {
        setMainId(updatedMembers[0].id);
        setFamilyData(updatedMembers[0]);
      }
    },
    [familyMembers, mainId]
  );

  // Handle relationship type updates
  const handleUpdateRelationship = useCallback(
    (node: PersonData, newType: string) => {
      console.log('Updating relationship type:', { node, newType });

      // Update the relationship type in family members
      const updatedMembers = familyMembers.map(m =>
        m.id === node.id
          ? {
              ...m,
              data: {
                ...m.data,
                relationshipType: newType,
              },
            }
          : m
      );

      setFamilyMembers(updatedMembers);

      // Update main data if needed
      if (node.id === mainId) {
        setFamilyData({
          ...familyData!,
          data: {
            ...familyData!.data,
            relationshipType: newType,
          },
        });
      }
    },
    [familyMembers, mainId, familyData]
  );

  // Loading state
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

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3, color: 'error.main' }}>
        <Typography variant="h6">Error</Typography>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  // Initial dialog
  if (showInitialDialog) {
    return (
      <InitialNodeDialog
        open={true}
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
    );
  }

  // Render family tree
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <FamilyTree
        data={familyMembers}
        mainId={mainId || undefined}
        onPersonClick={handlePersonClick}
        onPersonEdit={handlePersonEdit}
        onPersonAdd={handleAddChild}
        onPersonDelete={handlePersonDelete}
      />

      {/* Edit Dialog */}
      <EditDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setParentMember(null);
        }}
        onSave={handleAddMember}
        parentMember={parentMember}
        contactList={contactsData}
        existingFamilyMembers={familyMembers}
        refreshContacts={refreshContacts}
        fileId={fileId}
      />
    </Box>
  );
};

export default EnhancedFamilyTreeWrapper;
