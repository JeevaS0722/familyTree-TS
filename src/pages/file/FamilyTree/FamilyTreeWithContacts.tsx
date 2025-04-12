import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import ImprovedFamilyTree from './ImprovedFamilyTree';
import {
  Contact,
  ContactApiResponse,
  mapContactsToFamilyTree,
} from './contactToFamilyMapper';
import { FamilyMember } from './types';
import { useLazyGetContactsByFileQuery } from '../../../store/Services/contactService';

interface FamilyTreeWithContactsProps {
  initialContactList?: Contact[];
  initialFamilyData?: FamilyMember;
  loading?: boolean;
}

const FamilyTreeWithContacts: React.FC<FamilyTreeWithContactsProps> = ({
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

  // Lift the familyData state up to this component
  const [familyData, setFamilyData] = useState<FamilyMember | null>(() => {
    // If initialFamilyData is provided, use it
    if (initialFamilyData) {
      return initialFamilyData;
    }
    return null;
  });

  // RTK Query hook
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

  // Add this debugging useEffect to track changes to contactsData
  useEffect(() => {
    console.log('contactsData changed:', contactsData);
  }, [contactsData]);

  // The refreshContacts function now preserves familyData
  const refreshContacts = async () => {
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
  };

  // Create a wrapper around the ImprovedFamilyTree component
  const renderFamilyTree = () => {
    if (loading || isFetching) {
      // Show a loading indicator overlay INSIDE the tree instead of replacing it
      return (
        <Box position="relative" width="100%" height="100%">
          {/* Render the family tree with existing data */}
          <ImprovedFamilyTree
            initialFamilyData={familyData}
            contactList={contactsData}
            fileName={decodedFileName}
            startWithInitialDialog={showInitialDialog}
            refreshContacts={refreshContacts}
            // Pass setFamilyData as a prop
            onFamilyDataChange={setFamilyData}
            // Pass fileId to the component
            fileId={fileId ? Number(fileId) : undefined}
          />

          {/* Show a semi-transparent loading overlay */}
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
        </Box>
      );
    }

    // Error state
    if (error) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh',
          }}
        >
          <Typography color="error">{error}</Typography>
        </Box>
      );
    }

    // Normal render with current family data
    return (
      <ImprovedFamilyTree
        initialFamilyData={familyData}
        contactList={contactsData}
        fileName={decodedFileName}
        startWithInitialDialog={showInitialDialog}
        refreshContacts={refreshContacts}
        // Pass setFamilyData as a prop
        onFamilyDataChange={setFamilyData}
        // Pass fileId to the component
        fileId={fileId ? Number(fileId) : undefined}
      />
    );
  };

  return renderFamilyTree();
};

export default FamilyTreeWithContacts;
