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
  const { fileId } = useParams<{ fileId: string }>();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const filename = query.get('filename');
  const decodedFileName = filename ? decodeURIComponent(filename) : '';

  const [getContactsByFile, { isFetching: isLoadingContacts }] =
    useLazyGetContactsByFileQuery();

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

  const handleContextRef = useCallback((context: any) => {
    setTreeContext(context);
  }, []);

  useEffect(() => {
    setLoading(true);
    void fetchContacts();
  }, [fileId, decodedFileName]);

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

  const fetchContacts = async () => {
    try {
      const response = await getContactsByFile({
        fileid: Number(fileId),
        sortBy: 'deceased, lastName, firstName',
        sortOrder: 'asc',
      }).unwrap();

      if (response.data?.contact) {
        const contacts = response.data.contact as unknown as Contact[];
        setContactsData(contacts);

        const builtFamilyTree = mapContactsToFamilyTree(
          response as unknown as ContactApiResponse,
          decodedFileName,
          fileId
        );

        if (builtFamilyTree) {
          setRootMember(builtFamilyTree);
          setFamilyData([builtFamilyTree]);
          setShowInitialDialog(false);
        } else {
          setShowInitialDialog(true);
        }
      } else {
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

  const handlePersonAdd = useCallback(
    (personId: string, relationType: string, otherParentId?: string) => {
      setCurrentParentId(personId);
      setRelationshipType(relationType);
      setOtherParentId(otherParentId || null);

      setShowAddDialog(true);
    },
    []
  );

  const handleSaveNewMember = useCallback(
    (newPerson: PersonData) => {
      if (!currentParentId || !treeContext) {
        console.error('Cannot add member: missing parent ID or tree context');
        return;
      }

      try {
        treeContext.addPerson(
          newPerson,
          currentParentId,
          relationshipType,
          otherParentId || undefined
        );

        setFamilyData(prev => [...prev, newPerson]);

        setShowAddDialog(false);

        setCurrentParentId(null);
        setRelationshipType(null);
        setOtherParentId(null);

        setTimeout(() => {
          treeContext.updateMainId(currentParentId);
        }, 1000);
      } catch (error) {
        console.error('Error adding family member:', error);
      }
    },
    [currentParentId, treeContext, otherParentId]
  );

  const handlePersonDelete = useCallback(
    (personId: string) => {
      if (!treeContext) {
        console.error('Cannot delete: missing tree context');
        return;
      }

      try {
        treeContext.removePerson(personId);

        setFamilyData(prevData => prevData.filter(p => p.id !== personId));
      } catch (error) {
        console.error(`Error deleting person ${personId}:`, error);
      }
    },
    [treeContext]
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
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

      {familyData?.length > 0 && (
        <FamilyTree
          contextRef={handleContextRef}
          data={familyData}
          mainId={rootMember?.id}
          onPersonAdd={handlePersonAdd}
          onPersonDelete={handlePersonDelete}
        />
      )}

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

      {(loading || isLoadingContacts || isRefreshingContacts) && (
        <OverlayLoader open loadingText="Loading..." />
      )}
    </div>
  );
};

export default memo(App);
