import React, { memo, useCallback, useEffect, useState } from 'react';
import { FamilyTree } from './components/FamilyTreeBuilder';
import { PersonData } from './components/FamilyTreeBuilder/types/familyTree';
import { useLazyGetContactsByFileQuery } from '../../../store/Services/contactService';
import { useLocation, useParams } from 'react-router-dom';
import { Contact, ContactApiResponse } from './types';
import { mapContactsToFamilyTree } from './utils/mapper';
import InitialNodeDialog from './components/InitialNodeDialog';
import AddPersonDialog from './components/EditDialog';
import OverlayLoader from '../../../component/common/OverlayLoader';

const App: React.FC = () => {
  // query params
  const { fileId } = useParams<{ fileId: string }>();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const filename = query.get('filename');
  const decodedFileName = filename ? decodeURIComponent(filename) : '';

  // RTK Query hook
  const [getContactsByFile] = useLazyGetContactsByFileQuery();

  // states
  const [treeContext, setTreeContext] = useState<any>(null);
  const [contactsData, setContactsData] = useState<Contact[]>([]);
  const [familyData, setFamilyData] = useState<PersonData[]>([]);
  const [rootMember, setRootMember] = useState<PersonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showInitialDialog, setShowInitialDialog] = useState<boolean>(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [relationshipType, setRelationshipType] = useState<string | null>(null);

  // Get context from FamilyTree component
  const handleContextRef = useCallback((context: any) => {
    setTreeContext(context);
  }, []);

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

  // Handle person add
  const handlePersonAdd = useCallback(
    (personId: string, relationType: string) => {
      console.log('Person added:', personId);
      console.log('Relation type:', relationType);
      setCurrentParentId(personId);
      setRelationshipType(relationType);
      setShowAddDialog(true);
    },
    []
  );

  // Enhanced handleSaveNewMember function
  const handleSaveNewMember = useCallback(
    (newPerson: PersonData, relationshipType: 'partner' | 'child') => {
      if (!currentParentId || !treeContext) {
        console.error(
          'Cannot add new member: Missing parent ID or tree context'
        );
        return;
      }

      try {
        console.log(
          'Adding new member:',
          newPerson,
          'as',
          relationshipType,
          'to',
          currentParentId
        );

        // Validate the data
        if (!newPerson.data.gender) {
          console.warn('New person has no gender specified, defaulting to "M"');
          newPerson.data.gender = 'M';
        }

        // Get parent info to do additional validation
        const parent = familyData.find(p => p.id === currentParentId);

        if (parent && relationshipType === 'child') {
          // Set up appropriate parent-child relationship
          const parentGender = parent.data.gender;

          if (parentGender === 'M') {
            newPerson.rels.father = currentParentId;
          } else if (parentGender === 'F') {
            newPerson.rels.mother = currentParentId;
          }
        }

        // Use the context method to add the person
        treeContext.addPerson(newPerson, currentParentId, relationshipType);

        // Update local state to keep it in sync - this prevents having to refetch data
        setFamilyData(prev => {
          // Find if the person already exists by ID
          const personExists = prev.some(p => p.id === newPerson.id);

          if (personExists) {
            // Update the existing person
            return prev.map(p =>
              p.id === newPerson.id ? { ...p, ...newPerson } : p
            );
          }

          // Add new person
          return [...prev, newPerson];
        });

        // Close the dialog
        setShowAddDialog(false);
      } catch (error) {
        console.error('Error adding new family member:', error);
        // Handle error - could show an error message to the user
      }
    },
    [currentParentId, treeContext, familyData]
  );

  // Handle person delete
  const handlePersonDelete = useCallback(
    (personId: string) => {
      console.log(`Person deleted: ${personId}`);

      if (treeContext) {
        // Use context method to remove the person
        treeContext.removePerson(personId);

        // Update local state to keep it in sync
        setFamilyData(prevData => prevData.filter(p => p.id !== personId));
      }
    },
    [treeContext]
  );
  console.log('Rendering App component with family data:');

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* intial node dialog */}
      <InitialNodeDialog
        open={showInitialDialog}
        onClose={() => setShowInitialDialog(false)}
        onSave={newMember => {
          setRootMember(newMember);
          setFamilyData([newMember]);
          setShowInitialDialog(false);
        }}
        contactList={contactsData}
        isFirstNode={familyData.length === 0}
      />

      {/* Family Tree component */}
      {familyData?.length > 0 && (
        <FamilyTree
          contextRef={handleContextRef}
          data={familyData}
          mainId={rootMember?.id}
          onPersonAdd={handlePersonAdd}
          onPersonDelete={handlePersonDelete}
        />
      )}
      {/* Add Person Dialog */}
      <AddPersonDialog
        open={showAddDialog}
        onClose={() => {
          setShowAddDialog(false);
          setRelationshipType(null); // Reset on close
        }}
        onSave={handleSaveNewMember}
        contactList={contactsData}
        existingFamilyMembers={familyData}
        initialRelationshipType={relationshipType} // Pass to dialog
        parentMember={familyData.find(m => m.id === currentParentId)}
      />
      {/* Loading indicator */}
      {loading && <OverlayLoader open loadingText="Loading..." />}
    </div>
  );
};

export default memo(App);
