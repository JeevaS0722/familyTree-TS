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
        console.log(
          'Updating gender for contactId:',
          contactId,
          'gender:',
          gender
        );
        const selectedContact = contactsData.find(
          c => c.contactID === contactId
        );
        console.log('Selected contact:', selectedContact);
        if (!selectedContact?.gender) {
          const formatedGender = gender === 'M' ? 'male' : 'female';
          console.log('Updating gender to:', formatedGender);
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

        // Set focus back to the parent node
        // setTimeout(() => {
        //   treeContext.updateMainId(currentParentId);
        // }, 1000);
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

  const checkDeletionConditions = useCallback(
    (personId: string) => {
      if (!familyData || !treeContext) {
        return {
          canDelete: false,
          message: 'Cannot access family data',
          dialogType: 'error',
        };
      }

      const person = familyData.find(p => p.id === personId);
      console.log('Checking deletion conditions for person:', personId, person);
      if (!person) {
        return {
          canDelete: false,
          message: 'Person not found',
          dialogType: 'error',
        };
      }

      const personName = person.data.name || 'This person';

      // SCENARIO 1: Main node with connections
      // if (person.main && familyData.length > 1) {
      //   const hasAnyRelationships =
      //     (person.rels.children && person.rels.children.length > 0) ||
      //     (person.rels.spouses && person.rels.spouses.length > 0) ||
      //     person.rels.father ||
      //     person.rels.mother;

      //   if (hasAnyRelationships) {
      //     return {
      //       canDelete: false,
      //       message: `${personName} is the main person in this family tree. Please make another person the main person before deleting.`,
      //       dialogType: 'error',
      //     };
      //   }
      // }

      // SCENARIO 2: Has children (block deletion)
      if (person.rels.children && person.rels.children.length > 0) {
        return {
          canDelete: false,
          message: `${personName} has children in the family tree. Please remove these connections first.`,
          dialogType: 'error',
        };
      }

      // SCENARIO 3: Is the critical parent for other nodes
      // Check if person is the only parent for any children
      const fatherOf = familyData.filter(p => p.rels.father === personId);
      const motherOf = familyData.filter(p => p.rels.mother === personId);

      if (fatherOf.length > 0) {
        const fatherOnlyChildren = fatherOf.filter(child => !child.rels.mother);
        if (fatherOnlyChildren.length > 0) {
          return {
            canDelete: false,
            message: `${personName} is the only parent of ${fatherOnlyChildren.length} ${fatherOnlyChildren.length === 1 ? 'child' : 'children'}. Please add another parent or remove these connections first.`,
            dialogType: 'error',
          };
        }
      }

      if (motherOf.length > 0) {
        const motherOnlyChildren = motherOf.filter(child => !child.rels.father);
        if (motherOnlyChildren.length > 0) {
          return {
            canDelete: false,
            message: `${personName} is the only parent of ${motherOnlyChildren.length} ${motherOnlyChildren.length === 1 ? 'child' : 'children'}. Please add another parent or remove these connections first.`,
            dialogType: 'error',
          };
        }
      }

      // SCENARIO 4: Is the only child of a parent (could disconnect branches)
      if (person.rels.father || person.rels.mother) {
        const father = person.rels.father
          ? familyData.find(p => p.id === person.rels.father)
          : null;
        const mother = person.rels.mother
          ? familyData.find(p => p.id === person.rels.mother)
          : null;

        // Check if person is the only connection between two family branches
        if (father && mother) {
          const isOnlyChildOfBothParents =
            (!father.rels.children || father.rels.children.length === 1) &&
            (!mother.rels.children || mother.rels.children.length === 1);

          // Only link between father's family and mother's family
          if (
            isOnlyChildOfBothParents &&
            (!father.rels.spouses ||
              !father.rels.spouses.includes(mother.id)) &&
            (!mother.rels.spouses || !mother.rels.spouses.includes(father.id))
          ) {
            return {
              canDelete: false,
              message: `${personName} is the only connection between two family branches. Deleting would disconnect parts of the family tree.`,
              dialogType: 'error',
            };
          }
        }

        // Check if person is the only child of either parent
        if (
          father &&
          father.rels.children &&
          father.rels.children.length === 1
        ) {
          // If father has no other connections (spouses)
          if (!father.rels.spouses || father.rels.spouses.length === 0) {
            return {
              canDelete: false,
              message: `${personName} is the only child of ${father.data.name}. Deleting would leave a disconnected person in the tree.`,
              dialogType: 'error',
            };
          }
        }

        if (
          mother &&
          mother.rels.children &&
          mother.rels.children.length === 1
        ) {
          // If mother has no other connections (spouses)
          if (!mother.rels.spouses || mother.rels.spouses.length === 0) {
            return {
              canDelete: false,
              message: `${personName} is the only child of ${mother.data.name}. Deleting would leave a disconnected person in the tree.`,
              dialogType: 'error',
            };
          }
        }
      }

      // SCENARIO 5: Spouse relationships (various cases)
      // Check if person has spouses
      const hasSpouses = person.rels.spouses && person.rels.spouses.length > 0;

      if (!hasSpouses) {
        // No spouse, no children - safe to delete
        return {
          canDelete: true,
          message: `Are you sure you want to delete ${personName}? This action cannot be undone.`,
          dialogType: 'warning',
        };
      }

      // Check each spouse relationship
      for (const spouseId of person.rels.spouses || []) {
        const spouse = familyData.find(p => p.id === spouseId);
        if (!spouse) {
          continue;
        }

        // Check if spouse has other spouses besides this person
        const spouseHasOtherSpouses =
          spouse.rels.spouses &&
          spouse.rels.spouses.filter(id => id !== personId).length > 0;

        // Check if spouse has any children
        const spouseHasChildren =
          spouse.rels.children && spouse.rels.children.length > 0;

        // Check if spouse has children with current person
        let spouseHasChildrenWithPerson = false;
        if (spouseHasChildren && person.data.gender && spouse.data.gender) {
          const childrenWithPerson = familyData.filter(
            p =>
              spouse.rels.children?.includes(p.id) &&
              ((person.data.gender === 'M' && p.rels.father === personId) ||
                (person.data.gender === 'F' && p.rels.mother === personId))
          );
          spouseHasChildrenWithPerson = childrenWithPerson.length > 0;
        }

        // If spouse has children with this person - block deletion
        if (spouseHasChildrenWithPerson) {
          return {
            canDelete: false,
            message: `${personName} has children with ${spouse.data.name}. Please remove these connections first.`,
            dialogType: 'error',
          };
        }

        // If spouse would be left isolated after deletion - warn or block
        if (!spouseHasOtherSpouses && !spouseHasChildren) {
          // Spouse has no other connections - would leave isolated node
          if (
            (!spouse.rels.father && !spouse.rels.mother) ||
            spouse.isPhantom
          ) {
            // If spouse is a phantom node or has no parents - allow with warning
            return {
              canDelete: true,
              message: `${personName} is ${spouse.data.name}'s only connection. ${spouse.data.name} may become isolated in the tree. Continue?`,
              dialogType: 'warning',
            };
          } else {
            // Spouse has parents - warn but allow
            return {
              canDelete: true,
              message: `${personName} is connected to ${spouse.data.name}. Are you sure you want to delete?`,
              dialogType: 'warning',
            };
          }
        }

        // Spouse has children (not with this person) - warn but allow
        if (!spouseHasChildrenWithPerson && spouseHasChildren) {
          return {
            canDelete: true,
            message: `${spouse.data.name} has children, but not with ${personName}. Are you sure you want to delete?`,
            dialogType: 'warning',
          };
        }

        // Spouse has other spouses - warn but allow
        if (spouseHasOtherSpouses) {
          return {
            canDelete: true,
            message: `${spouse.data.name} has other connections. Are you sure you want to delete ${personName}?`,
            dialogType: 'warning',
          };
        }
      }

      // If we reach here, there are no blocking conditions
      return {
        canDelete: true,
        message: `Are you sure you want to delete ${personName}? This action cannot be undone.`,
        dialogType: 'warning',
      };
    },
    [familyData, treeContext]
  );

  const handlePersonDelete = useCallback(
    (personId: string) => {
      if (!treeContext) {
        console.error('Cannot delete: missing tree context');
        return;
      }
      console.log('Deleting person with ID:', personId);
      setPersonToDelete(personId);
      const result = checkDeletionConditions(personId);
      setDialogProps({
        title: result.canDelete ? 'Delete Person' : 'Warning',
        content: result.message,
        dialogType: result.dialogType,
      });
      setDeleteDialogOpen(true);
    },
    [treeContext]
  );

  const performDelete = useCallback(() => {
    if (!personToDelete || !treeContext) {
      console.error('Cannot delete: missing person ID or tree context');
      return;
    }

    const result = checkDeletionConditions(personToDelete);

    if (result.canDelete) {
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
      }
    }
    setPersonToDelete(null);
    setDeleteDialogOpen(false);
  }, [personToDelete, treeContext, familyData, checkDeletionConditions]);

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
      {deleteDialogOpen && (
        <ConfirmationDialog
          open={deleteDialogOpen}
          title={dialogProps.title}
          content={dialogProps.content}
          dialogType={dialogProps.dialogType}
          confirmText={dialogProps.dialogType === 'error' ? 'OK' : 'Delete'}
          cancelText="Cancel"
          onConfirm={performDelete}
          onCancel={() => {
            setDeleteDialogOpen(false);
            setPersonToDelete(null);
          }}
        />
      )}
      {(loading || isLoadingContacts) && (
        <OverlayLoader open loadingText="Loading..." />
      )}
    </div>
  );
};

export default memo(App);
