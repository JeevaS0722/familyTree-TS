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

// Sample family tree data
const sampleFamilyData: PersonData[] = [
  {
    id: '0',
    rels: {
      spouses: ['8c92765f-92d3-4120-90dd-85a28302504c'],
      father: '0c09cfa0-5e7c-4073-8beb-94f6c69ada19',
      mother: '0fa5c6bc-5b58-40f5-a07e-d787e26d8b56',
      children: [
        'ce2fcb9a-6058-4326-b56a-aced35168561',
        'f626d086-e2d6-4722-b4f3-ca4f15b109ab',
      ],
    },
    data: {
      'first name': 'Agnus',
      'last name': '',
      birthday: '1970',
      avatar:
        'https://static8.depositphotos.com/1009634/988/v/950/depositphotos_9883921-stock-illustration-no-user-profile-picture.jpg',
      gender: 'M',
    },
  },
  {
    id: '8c92765f-92d3-4120-90dd-85a28302504c',
    data: {
      gender: 'F',
      'first name': 'Andrea',
      'last name': '',
      birthday: '',
      avatar: '',
    },
    rels: {
      spouses: ['0'],
      children: [
        'ce2fcb9a-6058-4326-b56a-aced35168561',
        'f626d086-e2d6-4722-b4f3-ca4f15b109ab',
      ],
      father: 'd8897e67-db7c-4b72-ae7c-69aae266b140',
      mother: '9397093b-30bb-420b-966f-62596b58447f',
    },
  },
  {
    id: '0c09cfa0-5e7c-4073-8beb-94f6c69ada19',
    data: {
      gender: 'M',
      'first name': 'Zen',
      'last name': '',
      birthday: '',
      avatar: '',
    },
    rels: {
      children: ['0'],
      spouses: ['0fa5c6bc-5b58-40f5-a07e-d787e26d8b56'],
    },
  },
  {
    id: '0fa5c6bc-5b58-40f5-a07e-d787e26d8b56',
    data: {
      gender: 'F',
      'first name': 'Zebra',
      'last name': '',
      birthday: '',
      avatar: '',
    },
    rels: {
      spouses: ['0c09cfa0-5e7c-4073-8beb-94f6c69ada19'],
      children: ['0'],
      father: '12a9bddf-855a-4583-a695-c73fa8c0e9b2',
      mother: 'bd56a527-b613-474d-9f38-fcac0aae218b',
    },
  },
  {
    id: 'ce2fcb9a-6058-4326-b56a-aced35168561',
    data: {
      gender: 'M',
      'first name': 'Ben',
      'last name': '',
      birthday: '',
      avatar: '',
    },
    rels: {
      mother: '8c92765f-92d3-4120-90dd-85a28302504c',
      father: '0',
      spouses: ['b4e33c68-20a7-47ba-9dcc-1168a07d5b52'],
      children: [
        'eabd40c9-4518-4485-af5e-e4bc3ffd27fb',
        '240a3f71-c921-42d7-8a13-dec5e1acc4fd',
      ],
    },
  },
  {
    id: 'f626d086-e2d6-4722-b4f3-ca4f15b109ab',
    data: {
      gender: 'F',
      'first name': 'Becky',
      'last name': '',
      birthday: '',
      avatar: '',
    },
    rels: {
      mother: '8c92765f-92d3-4120-90dd-85a28302504c',
      father: '0',
    },
  },
  {
    id: 'eabd40c9-4518-4485-af5e-e4bc3ffd27fb',
    data: {
      gender: 'M',
      'first name': 'Carlos',
      'last name': '',
      birthday: '',
      avatar: '',
    },
    rels: {
      mother: 'b4e33c68-20a7-47ba-9dcc-1168a07d5b52',
      father: 'ce2fcb9a-6058-4326-b56a-aced35168561',
    },
  },
  {
    id: 'b4e33c68-20a7-47ba-9dcc-1168a07d5b52',
    data: {
      gender: 'F',
      'first name': 'Branka',
      'last name': '',
      birthday: '',
      avatar: '',
    },
    rels: {
      spouses: ['ce2fcb9a-6058-4326-b56a-aced35168561'],
      children: [
        'eabd40c9-4518-4485-af5e-e4bc3ffd27fb',
        '240a3f71-c921-42d7-8a13-dec5e1acc4fd',
      ],
    },
  },
  {
    id: '240a3f71-c921-42d7-8a13-dec5e1acc4fd',
    data: {
      gender: 'F',
      'first name': 'Carla',
      'last name': '',
      birthday: '',
      avatar: '',
    },
    rels: {
      mother: 'b4e33c68-20a7-47ba-9dcc-1168a07d5b52',
      father: 'ce2fcb9a-6058-4326-b56a-aced35168561',
    },
  },
  {
    id: '12a9bddf-855a-4583-a695-c73fa8c0e9b2',
    data: {
      gender: 'M',
      'first name': 'Yvo',
      'last name': '',
      birthday: '',
      avatar: '',
    },
    rels: {
      children: ['0fa5c6bc-5b58-40f5-a07e-d787e26d8b56'],
      spouses: ['bd56a527-b613-474d-9f38-fcac0aae218b'],
    },
  },
  {
    id: 'bd56a527-b613-474d-9f38-fcac0aae218b',
    data: {
      gender: 'F',
      'first name': 'Yva',
      'last name': '',
      birthday: '',
      avatar: '',
    },
    rels: {
      spouses: ['12a9bddf-855a-4583-a695-c73fa8c0e9b2'],
      children: ['0fa5c6bc-5b58-40f5-a07e-d787e26d8b56'],
    },
  },
  {
    id: 'd8897e67-db7c-4b72-ae7c-69aae266b140',
    data: {
      gender: 'M',
      'first name': 'Zadro',
      'last name': '',
      birthday: '',
      avatar: '',
    },
    rels: {
      children: ['8c92765f-92d3-4120-90dd-85a28302504c'],
      spouses: ['9397093b-30bb-420b-966f-62596b58447f'],
    },
  },
  {
    id: '9397093b-30bb-420b-966f-62596b58447f',
    data: {
      gender: 'F',
      'first name': 'Zadra',
      'last name': '',
      birthday: '',
      avatar: '',
    },
    rels: {
      spouses: ['d8897e67-db7c-4b72-ae7c-69aae266b140'],
      children: ['8c92765f-92d3-4120-90dd-85a28302504c'],
    },
  },
];

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
    setCurrentPerson(person);
    setShowEditDialog(true);
    // Add the new person to the data
    // setFamilyData([...familyData, person]);
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

  const handleAddNewNode = (newNode: PersonData) => {
    console.log('New node added:', newNode);
    setFamilyData(prevData => [...prevData, newNode]);
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
      {familyData?.length > 0 && (
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
        // onSave={(updatedPerson: PersonData) => {
        //   setFamilyData(prevData =>
        //     prevData.map(p => (p.id === updatedPerson.id ? updatedPerson : p))
        //   );
        //   setShowEditDialog(false);
        // }}
        existingFamilyMembers={familyData}
        parentMember={currentPerson}
        refreshContacts={refreshContacts}
        contactList={contactsData}
      />
    </Box>
  );
};

export default App;
