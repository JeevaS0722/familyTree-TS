// src/component/FamilyTree/components/FamilyTreeContainer.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { FamilyTree } from '../index';
import { PersonData } from '../types/familyTree';
import {
  Contact,
  ContactApiResponse,
  EnhancedPersonData,
} from '../types/familyTreeExtended';
import {
  mapContactsToFamilyTree,
  contactToPersonData,
} from '../utils/contactMapper';
import InitialNodeDialog from './dialogs/InitialNodeDialog';

// Import RTK Query hooks - these would be properly imported from your store
// This is a placeholder that would need to be replaced with your actual service imports
const useLazyGetContactsByFileQuery = () => {
  // Mock implementation - replace with your actual RTK Query hook
  return [
    async (params: any) => {
      // This is where you'd call your actual API
      console.log('Fetching contacts with params:', params);
      return { unwrap: async () => ({ success: true, data: { contact: [] } }) };
    },
    { data: null, isFetching: false },
  ] as const;
};

interface FamilyTreeContainerProps {
  initialContactList?: Contact[];
  initialFamilyData?: PersonData;
  loading?: boolean;
}

const FamilyTreeContainer: React.FC<FamilyTreeContainerProps> = ({
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

  // State for contacts and loading state
  const [contactsData, setContactsData] =
    useState<Contact[]>(initialContactList);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('deceased, lastName, firstName');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [showInitialDialog, setShowInitialDialog] = useState<boolean>(false);

  // Family data state
  const [familyData, setFamilyData] = useState<PersonData | null>(() => {
    // If initialFamilyData is provided, use it
    if (initialFamilyData) {
      return initialFamilyData;
    }
    return null;
  });

  // RTK Query hook - replace with your actual implementation
  const [getContactsByFile, { data: contactsResponse, isFetching }] =
    useLazyGetContactsByFileQuery();

  // Initial fetch of contacts
  useEffect(() => {
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

            // Try to build a family tree from the contacts using only our two specific checks
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

  // The refreshContacts function
  const refreshContacts = useCallback(async () => {
    console.log('Refreshing contacts...');
    console.log('Current familyData before refresh:', familyData);

    // Set loading without unmounting the tree component
    setLoading(true);
    setError(null);

    try {
      const response = await getContactsByFile({
        fileid: Number(fileId),
        sortBy: sortBy,
        sortOrder: sortOrder,
      }).unwrap();

      console.log('Refresh API Response:', response);

      if (response.data?.contact) {
        // Update the contacts data
        setContactsData(response.data.contact);
        console.log(
          'Updated contactsData with fresh data:',
          response.data.contact
        );

        // Finish loading
        setLoading(false);
        return response.data.contact;
      } else {
        console.warn('No contact data in response');
        setContactsData([]);

        // Finish loading
        setLoading(false);
        return [];
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to fetch contacts');

      // Finish loading
      setLoading(false);
      return [];
    }
  }, [fileId, sortBy, sortOrder, getContactsByFile]);

  // Handle initial node selection
  const handleInitialNodeSave = useCallback((person: PersonData) => {
    setFamilyData(person);
    setShowInitialDialog(false);
  }, []);

  // Handle editing a person
  const handlePersonEdit = useCallback(
    (person: PersonData) => {
      if (!familyData) {
        return;
      }

      // Create a deep copy of the family data
      const updatedData = JSON.parse(JSON.stringify(familyData)) as PersonData;

      // Find and update the person in the tree
      // This is a simplified version - in a real app, you'd have logic to traverse the tree
      if (updatedData.id === person.id) {
        Object.assign(updatedData, person);
      }

      setFamilyData(updatedData);
    },
    [familyData]
  );

  // Handle adding a new person
  const handlePersonAdd = useCallback(
    (person: PersonData) => {
      if (!familyData) {
        return;
      }

      // Create a deep copy of the family data
      const updatedData = JSON.parse(JSON.stringify(familyData)) as PersonData;

      // Add the new person as a child or partner based on their relationship
      // This is a simplified version - in a real app, you'd have more complex logic
      if (person.data.relationshipType === 'Child') {
        if (!updatedData.rels.children) {
          updatedData.rels.children = [];
        }
        updatedData.rels.children.push(person.id);
      } else if (person.data.relationshipType === 'Partner') {
        if (!updatedData.rels.spouses) {
          updatedData.rels.spouses = [];
        }
        updatedData.rels.spouses.push(person.id);
      }

      setFamilyData(updatedData);
    },
    [familyData]
  );

  // Handle deleting a person
  const handlePersonDelete = useCallback(
    (personId: string) => {
      if (!familyData) {
        return;
      }

      // Create a deep copy of the family data
      const updatedData = JSON.parse(JSON.stringify(familyData)) as PersonData;

      // Remove the person from children or spouses arrays
      // This is a simplified version - in a real app, you'd have logic to traverse the tree
      if (updatedData.rels.children) {
        updatedData.rels.children = updatedData.rels.children.filter(
          id => id !== personId
        );
      }
      if (updatedData.rels.spouses) {
        updatedData.rels.spouses = updatedData.rels.spouses.filter(
          id => id !== personId
        );
      }

      setFamilyData(updatedData);
    },
    [familyData]
  );

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

  if (error) {
    return (
      <Box sx={{ p: 3, color: 'error.main' }}>
        <Typography variant="h6">Error</Typography>
        <Typography>{error}</Typography>
      </Box>
    );
  }

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

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <FamilyTree
        data={familyData ? [familyData] : []}
        mainId={familyData?.id}
        onPersonClick={personId => console.log('Person clicked:', personId)}
        onPersonEdit={handlePersonEdit}
        onPersonAdd={handlePersonAdd}
        onPersonDelete={handlePersonDelete}
      />
    </Box>
  );
};

export default FamilyTreeContainer;
