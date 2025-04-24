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
  const [getContactsByFile, { isFetching: isLoadingContacts }] =
    useLazyGetContactsByFileQuery();

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
  const [otherParentId, setOtherParentId] = useState<string | null>(null);
  const [isRefreshingContacts, setIsRefreshingContacts] = useState(false);

  // Get context from FamilyTree component
  const handleContextRef = useCallback((context: any) => {
    setTreeContext(context);
  }, []);

  // Initial fetch of contacts
  useEffect(() => {
    setLoading(true);
    void fetchContacts();
  }, [fileId, decodedFileName]);

  // Function to refresh contacts data (called after adding a new contact)
  const refreshContacts = async (): Promise<Contact[]> => {
    setIsRefreshingContacts(true);
    try {
      const response = await getContactsByFile({
        fileid: Number(fileId),
        sortBy: 'deceased, lastName, firstName',
        sortOrder: 'asc',
      }).unwrap();

      if (response.data?.contact) {
        const contacts = response.data.contact as unknown as Contact[];
        setContactsData(contacts);
        return contacts;
      }
      return [];
    } catch (error) {
      console.error('Error refreshing contacts:', error);
      return [];
    } finally {
      setIsRefreshingContacts(false);
    }
  };

  // Fetch contacts and build family tree
  const fetchContacts = async () => {
    try {
      const response = await getContactsByFile({
        fileid: Number(fileId),
        sortBy: 'deceased, lastName, firstName',
        sortOrder: 'asc',
      }).unwrap();

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
    } finally {
      setLoading(false);
    }
  };

  // Handle person add with enhanced logging and support for other parent
  const handlePersonAdd = useCallback(
    (personId: string, relationType: string, otherParentId?: string) => {
      console.log(
        'Person add requested:',
        personId,
        'Relation:',
        relationType,
        'Other parent:',
        otherParentId || 'None'
      );

      // Store all needed information in state
      setCurrentParentId(personId);
      setRelationshipType(relationType);
      setOtherParentId(otherParentId || null);

      // Show the dialog to complete the addition
      setShowAddDialog(true);
    },
    []
  );

  // Enhanced handleSaveNewMember function with better error handling
  const handleSaveNewMember = useCallback(
    (newPerson: PersonData) => {
      if (!currentParentId || !treeContext) {
        console.error('Cannot add member: missing parent ID or tree context');
        return;
      }

      try {
        console.log('Adding new person to tree:', {
          personId: newPerson.id,
          parentId: currentParentId,
          relationshipType,
          otherParentId: otherParentId || undefined,
        });

        // Use the context's addPerson method to add the new person
        treeContext.addPerson(
          newPerson,
          currentParentId,
          relationshipType,
          otherParentId || undefined
        );

        // Update local state to keep it in sync
        setFamilyData(prev => [...prev, newPerson]);

        // Close the dialog
        setShowAddDialog(false);

        // Reset related state
        setCurrentParentId(null);
        setRelationshipType(null);
        setOtherParentId(null);

        console.log('Successfully added new family member');
      } catch (error) {
        console.error('Error adding family member:', error);
        // You could add error handling UI feedback here
      }
    },
    [currentParentId, treeContext, otherParentId]
  );

  // Handle person delete with confirmation and better error handling
  const handlePersonDelete = useCallback(
    (personId: string) => {
      console.log(`Deleting person: ${personId}`);

      if (!treeContext) {
        console.error('Cannot delete: missing tree context');
        return;
      }

      try {
        // Use context method to remove the person
        treeContext.removePerson(personId);

        // Update local state to keep it in sync
        setFamilyData(prevData => prevData.filter(p => p.id !== personId));

        console.log(`Successfully deleted person: ${personId}`);
      } catch (error) {
        console.error(`Error deleting person ${personId}:`, error);
        // You could add error handling UI feedback here
      }
    },
    [treeContext]
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* Initial node dialog */}
      {showInitialDialog && (
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
      )}

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

      {/* Add Person Dialog with refreshContacts capability */}
      {showAddDialog && (
        <AddPersonDialog
          open={showAddDialog}
          onClose={() => {
            setShowAddDialog(false);
            setRelationshipType(null);
            setOtherParentId(null);
          }}
          onSave={handleSaveNewMember}
          contactList={contactsData}
          existingFamilyMembers={familyData}
          parentMember={familyData.find(m => m.id === currentParentId)}
          refreshContacts={refreshContacts}
          initialRelationshipType={relationshipType}
        />
      )}

      {/* Loading indicator - show for initial loading or when refreshing contacts */}
      {(loading || isLoadingContacts || isRefreshingContacts) && (
        <OverlayLoader open loadingText="Loading..." />
      )}
    </div>
  );
};

export default memo(App);
