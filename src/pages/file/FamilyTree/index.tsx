/* eslint-disable complexity */
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { FamilyTree } from './components/FamilyTreeBuilder';
import { PersonData } from './components/FamilyTreeBuilder/types/familyTree';
import {
  useLazyGetContactDetailsQuery,
  useLazyGetFamilyTreeQuery,
  useEditFamilyTreeMutation,
  useUpdateContactDetailsMutation,
} from '../../../store/Services/familyTreeService';
import { useLocation, useParams } from 'react-router-dom';
import { Contact, ContactApiResponse } from './types';
import {
  mapContactsToFamilyTree,
  mapFamilyTreeAndContactToTree,
} from './utils/mapper';
import InitialNodeDialog from './components/InitialNodeDialog';
import AddPersonDialog from './components/EditDialog';
import OverlayLoader from '../../../component/common/OverlayLoader';
import ConfirmationDialog from './components/ConfirmationDialog';

const App: React.FC = () => {
  const isMounted = useRef(false);
  const { fileId } = useParams<{ fileId: string }>();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const filename = query.get('filename');
  const decodedFileName = filename ? decodeURIComponent(filename) : '';

  const [getContactsByFile, { isFetching: isLoadingContacts }] =
    useLazyGetContactDetailsQuery();
  const [getFamilyTree] = useLazyGetFamilyTreeQuery();
  const [editFamilyTree] = useEditFamilyTreeMutation();
  const [updateContactDetails] = useUpdateContactDetailsMutation();

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<string | null>(null);
  const [dialogProps, setDialogProps] = useState({
    title: '',
    content: '',
    dialogType: 'warning' as 'warning' | 'error' | 'info',
  });

  const handleContextRef = useCallback((context: any) => {
    setTreeContext(context);
  }, []);

  const fetchContacts = useCallback(async () => {
    try {
      const familyTreeResponse = await getFamilyTree({
        fileId: Number(fileId),
      }).unwrap();
      const response = await getContactsByFile({
        fileId: Number(fileId),
      }).unwrap();
      const contactData = response.data?.contact as unknown as Contact[];
      setContactsData(contactData || []);
      if (contactData) {
        if (familyTreeResponse?.data?.treeData) {
          // Map family data and match with contacts
          const mappedFamilyTree = mapFamilyTreeAndContactToTree(
            familyTreeResponse.data.treeData,
            contactData,
            fileId
          );

          if (mappedFamilyTree?.length > 0) {
            setFamilyData(mappedFamilyTree);
            setRootMember(mappedFamilyTree.find(member => member.main) || null);
            return;
          }
        }
        const builtFamilyTree = mapContactsToFamilyTree(
          response as unknown as ContactApiResponse,
          decodedFileName,
          fileId
        );

        if (builtFamilyTree) {
          setRootMember(builtFamilyTree);
          setFamilyData([builtFamilyTree]);
          setShowInitialDialog(false);
          return;
        }
        setShowInitialDialog(true);

        return;
      }
      setShowInitialDialog(true);
    } catch (err) {
      console.error('Error processing contact data:', err);
      setShowInitialDialog(true);
    } finally {
      isMounted.current = true;
      setLoading(false);
    }
  }, [decodedFileName, fileId, getContactsByFile, getFamilyTree]);

  useEffect(() => {
    setLoading(true);
    void fetchContacts();
    return () => {
      isMounted.current = false;
    };
  }, [fileId, decodedFileName, fetchContacts]);

  useEffect(() => {
    if (treeContext && contactsData.length > 0) {
      // Update the context with the latest contacts data
      treeContext.setContactsList(contactsData);
    }
  }, [contactsData, treeContext]);

  const updateFamilyTree = useCallback(
    async (action: string, memberId: string, updatedData: PersonData[]) => {
      let updateData = null;
      if (updatedData.length > 0) {
        updateData = updatedData.map(member => {
          return {
            id: member.id,
            main: member.main,
            isPhantom: member.isPhantom,
            rels: member.rels || {},
          };
        });
      }

      // Update API with the current family tree structure
      await editFamilyTree({
        fileId: Number(fileId),
        treeData: updateData,
      });
    },
    [fileId, editFamilyTree]
  );

  const refreshContacts = async (): Promise<Contact[]> => {
    try {
      const response = await getContactsByFile({
        fileId: Number(fileId),
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

  const updateGender = useCallback(
    async (contactId?: number, gender?: string | null) => {
      if (contactId && gender) {
        const selectedContact = contactsData.find(
          contactId => contactId === contactId
        );
        if (!selectedContact?.gender) {
          const formatedGender = gender === 'M' ? 'male' : 'female';
          try {
            await updateContactDetails({
              contactId: Number(contactId),
              gender: formatedGender,
            });
            void refreshContacts();
          } catch (error) {
            console.error('Error updating gender:');
          }
        }
      }
    },
    [updateContactDetails, contactsData]
  );

  const handleCreateInitialNode = useCallback(
    async (newMember: PersonData) => {
      setRootMember(newMember);
      setFamilyData([newMember]);
      setShowInitialDialog(false);
      void updateGender(newMember?.data?.contactId, newMember?.data?.gender);
    },
    [updateGender]
  );

  const handleSaveNewMember = useCallback(
    (newPerson: PersonData, type?: string) => {
      if (!currentParentId || !treeContext) {
        console.error('Cannot add member: missing parent ID or tree context');
        return;
      }
      console.log('Adding new family member:', newPerson);

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
        if (type === 'exsisting_contact') {
          void updateGender(
            newPerson?.data?.contactId,
            newPerson?.data?.gender
          );
        }
        setTimeout(() => {
          treeContext.updateMainId(currentParentId);
        }, 1000);
      } catch (error) {
        console.error('Error adding family member:', error);
      }
    },
    [
      currentParentId,
      treeContext,
      otherParentId,
      relationshipType,
      updateGender,
    ]
  );

  /**
   * Checks the various connection conditions for a person to determine if they can be deleted
   * Returns an object with the result and appropriate message
   */
  // const checkDeletionConditions = useCallback(
  //   (personId: string) => {
  //     if (!familyData || !treeContext) {
  //       return { canDelete: false, message: 'Cannot access family data' };
  //     }

  //     const person = familyData.find(p => p.id === personId);
  //     if (!person) {
  //       return { canDelete: false, message: 'Person not found' };
  //     }

  //     // Check if person has children
  //     const hasChildren =
  //       person.rels.children && person.rels.children.length > 0;

  //     if (hasChildren) {
  //       // Case 1: Person has children - warning
  //       return {
  //         canDelete: false,
  //         message: `${person.data.name} has children in the family tree. Please remove these connections first.`,
  //         dialogType: 'warning',
  //       };
  //     }

  //     // Check if person has spouses
  //     const hasSpouses = person.rels.spouses && person.rels.spouses.length > 0;

  //     if (!hasSpouses) {
  //       // Case 2: Person has no children and no spouse - can delete
  //       return { canDelete: true, message: '', dialogType: 'warning' };
  //     }

  //     // Person has spouse(s) but no children, check each spouse's connections
  //     for (const spouseId of person.rels.spouses || []) {
  //       const spouse = familyData.find(p => p.id === spouseId);
  //       if (!spouse) {
  //         continue;
  //       }

  //       // Check if spouse has other spouses besides this person
  //       const spouseHasOtherSpouses =
  //         spouse.rels.spouses &&
  //         spouse.rels.spouses.filter(id => id !== personId).length > 0;

  //       // Check if spouse has any children
  //       const spouseHasChildren =
  //         spouse.rels.children && spouse.rels.children.length > 0;

  //       // Check if spouse has children with current person
  //       let spouseHasChildrenWithPerson = false;
  //       if (spouseHasChildren && person.data.gender && spouse.data.gender) {
  //         const childrenWithPerson = familyData.filter(
  //           p =>
  //             spouse.rels.children?.includes(p.id) &&
  //             ((person.data.gender === 'M' && p.rels.father === personId) ||
  //               (person.data.gender === 'F' && p.rels.mother === personId))
  //         );
  //         spouseHasChildrenWithPerson = childrenWithPerson.length > 0;
  //       }

  //       // Case 3: Spouse has no other connections
  //       if (!spouseHasOtherSpouses && !spouseHasChildren) {
  //         return {
  //           canDelete: false,
  //           message: `${person.data.name} is connected to ${spouse.data.name}. Are you sure you want to delete this person?`,
  //           dialogType: 'warning',
  //         };
  //       }

  //       // Case 4: Spouse has children (not with this person)
  //       if (!spouseHasChildrenWithPerson && spouseHasChildren) {
  //         return {
  //           canDelete: false,
  //           message: `${person.data.name}'s spouse ${spouse.data.name} has children. Are you sure you want to delete this person?`,
  //           dialogType: 'warning',
  //         };
  //       }

  //       // Case 5: Spouse has children with this person
  //       if (spouseHasChildrenWithPerson) {
  //         return {
  //           canDelete: false,
  //           message: `${person.data.name} has children with ${spouse.data.name}. Please remove these connections first.`,
  //           dialogType: 'warning',
  //         };
  //       }

  //       // Case 6: Spouse has another spouse but no children with this person
  //       if (spouseHasOtherSpouses && !spouseHasChildrenWithPerson) {
  //         return { canDelete: true, message: '', dialogType: 'warning' };
  //       }
  //     }

  //     // Default - allow deletion
  //     return { canDelete: true, message: '', dialogType: 'warning' };
  //   },
  //   [familyData, treeContext]
  // );

  const handlePersonDelete = useCallback(
    (personId: string) => {
      if (!treeContext) {
        console.error('Cannot delete: missing tree context');
        return;
      }

      // const person = familyData.find(p => p.id === personId);
      // if (!person) {
      //   return;
      // }

      // setPersonToDelete(personId);

      // const result = checkDeletionConditions(personId);

      // if (result.message) {
      //   setDialogProps({
      //     title: result.canDelete ? 'Confirm Deletion' : 'Warning',
      //     content:
      //       result.message ||
      //       `Are you sure you want to delete ${person.data.name || 'this person'}? This action cannot be undone.`,
      //     dialogType: result.dialogType || 'warning',
      //   });
      // } else {
      //   setDialogProps({
      //     title: 'Confirm Deletion',
      //     content: `Are you sure you want to delete ${person.data.name || 'this person'}? This action cannot be undone.`,
      //     dialogType: 'warning',
      //   });
      // }

      // setDeleteDialogOpen(true);
      try {
        treeContext.removePerson(personToDelete);
        const updatedFamilyData = familyData.filter(
          p => p.id !== personToDelete
        );
        setFamilyData(updatedFamilyData);
        if (!updatedFamilyData.length) {
          setRootMember(null);
          setShowInitialDialog(true);
        }
      } catch (error) {
        console.error(`Error deleting person ${personToDelete}:`, error);
      } finally {
        setPersonToDelete(null);
        setDeleteDialogOpen(false);
      }
    },
    [treeContext, familyData]
  );

  // const performDelete = useCallback(() => {
  //   if (!personToDelete || !treeContext) {
  //     console.error('Cannot delete: missing person ID or tree context');
  //     return;
  //   }

  //   const result = checkDeletionConditions(personToDelete);

  //   if (result.canDelete) {
  //     try {
  //       treeContext.removePerson(personToDelete);
  //       const updatedFamilyData = familyData.filter(
  //         p => p.id !== personToDelete
  //       );
  //       setFamilyData(updatedFamilyData);
  //       if (!updatedFamilyData.length) {
  //         setRootMember(null);
  //         setShowInitialDialog(true);
  //       }
  //     } catch (error) {
  //       console.error(`Error deleting person ${personToDelete}:`, error);
  //     }
  //   }

  //   setPersonToDelete(null);
  //   setDeleteDialogOpen(false);
  // }, [personToDelete, treeContext, familyData, checkDeletionConditions]);

  const handleMemberChange = useCallback(
    (action: 'add' | 'remove', memberId: string, updatedData: PersonData[]) => {
      void updateFamilyTree(action, memberId, updatedData);
    },
    [updateFamilyTree]
  );

  return (
    <div className="family-tree-container">
      {showInitialDialog && (
        <InitialNodeDialog
          open={showInitialDialog}
          onClose={() => setShowInitialDialog(false)}
          onSave={handleCreateInitialNode}
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
          contactsList={contactsData}
          onMemberChange={handleMemberChange}
        />
      )}

      {showAddDialog && (
        <AddPersonDialog
          open={showAddDialog}
          onClose={() => {
            setShowAddDialog(false);
            setRelationshipType(null);
            setOtherParentId(null);
            setCurrentParentId(null);
          }}
          onSave={handleSaveNewMember}
          contactList={contactsData}
          existingFamilyMembers={familyData}
          parentMember={familyData.find(m => m.id === currentParentId)}
          refreshContacts={refreshContacts}
          initialRelationshipType={relationshipType}
        />
      )}

      {/* {deleteDialogOpen && (
        <ConfirmationDialog
          open={deleteDialogOpen}
          title={dialogProps.title}
          content={dialogProps.content}
          dialogType={dialogProps.dialogType}
          confirmText={dialogProps.dialogType === 'error' ? 'OK' : 'Delete'}
          cancelText="Cancel"
          onConfirm={performDelete}
          onCancel={() => setDeleteDialogOpen(false)}
        />
      )} */}
      {(loading || isLoadingContacts) && (
        <OverlayLoader open loadingText="Loading..." />
      )}
    </div>
  );
};

export default memo(App);
