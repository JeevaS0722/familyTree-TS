// src/components/FamilyTree/ImprovedFamilyTree.tsx - Updated with fileId support
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Box, useTheme } from '@mui/material';

// Import components
import FamilyCard from './components/FamilyCard';
import TreeConnectors from './components/TreeConnectors';
import ControlPanel from './components/ControlPanel';
import EditDialog from './components/EditDialog';
import InitialNodeDialog from './components/InitialNodeDialog';

// Import types and utilities
import {
  FamilyMember,
  NodePosition,
  CARD_WIDTH,
  CARD_HEIGHT,
  VERTICAL_SPACING,
  HORIZONTAL_SPACING,
  PARTNER_SPACING,
} from './types';
import {
  findMemberById,
  updateMemberById,
  getAllMembers,
  calculateOptimalTreeLayout,
} from './treeUtils';
import { Contact } from './contactToFamilyMapper';

interface ImprovedFamilyTreeProps {
  initialFamilyData?: FamilyMember | null;
  contactList?: Contact[];
  startWithInitialDialog?: boolean;
  fileName?: string;
  refreshContacts?: () => Promise<Contact[]>;
  // Added props for fileId and updating family data
  fileId?: number | string;
  onFamilyDataChange?: (data: FamilyMember | null) => void;
}

/**
 * ImprovedFamilyTree component with optimized layout algorithms
 * based on insights from BALKANGraph/FamilyTreeJS
 */
const ImprovedFamilyTree: React.FC<ImprovedFamilyTreeProps> = ({
  initialFamilyData,
  contactList = [],
  startWithInitialDialog = false,
  fileName = '',
  refreshContacts = async () => [],
  // New props
  fileId,
  onFamilyDataChange,
}) => {
  const theme = useTheme();
  // *** MODIFIED: Use local state but synchronize with parent ***
  const [familyData, setFamilyDataLocal] = useState<FamilyMember | null>(
    initialFamilyData
  );

  // Only show initial dialog if we don't have familyData and not using fileName
  const [initialNodeDialogOpen, setInitialNodeDialogOpen] = useState(
    startWithInitialDialog || (!initialFamilyData && !fileName)
  );

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [parentMember, setParentMember] = useState<FamilyMember | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Pan and zoom states
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [autoFit, setAutoFit] = useState(true);
  const [animated, setAnimated] = useState(false);

  // Viewport dimensions
  const [containerWidth, setContainerWidth] = useState(1000);
  const [containerHeight, setContainerHeight] = useState(700);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const setFamilyData = (
    newData:
      | FamilyMember
      | null
      | ((prev: FamilyMember | null) => FamilyMember | null)
  ) => {
    // Handle both direct value and function updates
    if (typeof newData === 'function') {
      setFamilyDataLocal(prev => {
        const updatedData = newData(prev);
        // Also update parent state if the callback is provided
        if (onFamilyDataChange) {
          onFamilyDataChange(updatedData);
        }
        return updatedData;
      });
    } else {
      setFamilyDataLocal(newData);
      // Also update parent state if the callback is provided
      if (onFamilyDataChange) {
        onFamilyDataChange(newData);
      }
    }
  };

  useEffect(() => {
    if (initialFamilyData) {
      console.log('Updating local familyData from parent:', initialFamilyData);
      setFamilyDataLocal(initialFamilyData);
    }
  }, [initialFamilyData]);

  // If initialFamilyData changes and is not null, update our state
  useEffect(() => {
    if (initialFamilyData && !startWithInitialDialog) {
      setFamilyData(initialFamilyData);
      setInitialNodeDialogOpen(false);
    }
  }, [initialFamilyData, startWithInitialDialog]);

  // Get all existing family members for filtering autocomplete
  const allFamilyMembers = useMemo(() => {
    if (!familyData) {
      return [];
    }
    return getAllMembers(familyData);
  }, [familyData]);

  // Calculate optimal node positions using improved algorithm
  const calculatedPositions = useMemo(() => {
    if (!familyData) {
      return {};
    }
    // Get optimized layout from the algorithm
    return calculateOptimalTreeLayout(familyData, containerWidth);
  }, [familyData, containerWidth, forceUpdate]);

  // Update container dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        setContainerHeight(containerRef.current.offsetHeight);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Animation effect when nodes change
  useEffect(() => {
    if (animated) {
      // Reset animation flag after animation completes
      const timer = setTimeout(() => {
        setAnimated(false);
        // Force a re-render to update node positions after animation
        setForceUpdate(prev => prev + 1);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [animated]);

  // Also add a useEffect to debug when familyData changes
  useEffect(() => {
    if (familyData) {
      console.log('familyData changed:', familyData);
      console.log('All members:', getAllMembers(familyData));

      // Force a refresh of calculated positions whenever familyData changes
      setForceUpdate(prev => prev + 1);
    }
  }, [familyData]);

  // Auto-fit the tree when it changes
  useEffect(() => {
    if (autoFit && Object.keys(calculatedPositions).length > 0) {
      const fitToScreen = () => {
        const allNodes = Object.values(calculatedPositions);
        if (allNodes.length === 0) {
          return;
        }

        // Find the tree boundaries
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        allNodes.forEach(node => {
          minX = Math.min(minX, node.x);
          minY = Math.min(minY, node.y);
          maxX = Math.max(maxX, node.x + CARD_WIDTH);
          maxY = Math.max(maxY, node.y + CARD_HEIGHT);
        });

        // Calculate padding
        const padding = 50;
        const treeWidth = maxX - minX + 2 * padding;
        const treeHeight = maxY - minY + 2 * padding;

        // Calculate scale to fit the container
        const scaleX = containerWidth / treeWidth;
        const scaleY = containerHeight / treeHeight;
        const newScale = Math.min(scaleX, scaleY, 1); // Cap at 1 to prevent too much zooming in

        // Center the tree
        const centerX = (containerWidth - treeWidth * newScale) / 2;
        const centerY = (containerHeight - treeHeight * newScale) / 2;

        // Set the new scale and translation
        setScale(newScale);
        setTranslate({
          x: centerX - minX * newScale + padding * newScale,
          y: centerY - minY * newScale + padding * newScale,
        });
      };

      // Wait for layout to stabilize
      const timer = setTimeout(fitToScreen, 100);
      return () => clearTimeout(timer);
    }
  }, [calculatedPositions, containerWidth, containerHeight, autoFit]);

  // Track actual node positions from rendered DOM
  const [nodePositions, setNodePositions] = useState<
    Record<string, NodePosition>
  >({});

  const handleNodePositionChange = (id: string, rect: DOMRect) => {
    if (contentRef.current) {
      const containerRect = contentRef.current.getBoundingClientRect();

      setNodePositions(prev => {
        const existing = prev[id];
        const newX = (rect.left - containerRect.left) / scale;
        const newY = (rect.top - containerRect.top) / scale;

        // Only update if position significantly changed
        if (
          !existing ||
          Math.abs(existing.x - newX) > 1 ||
          Math.abs(existing.y - newY) > 1
        ) {
          return {
            ...prev,
            [id]: {
              id,
              x: newX,
              y: newY,
              width: rect.width / scale,
              height: rect.height / scale,
            },
          };
        }
        return prev;
      });
    }
  };

  const handleAddMember = (
    newMember: FamilyMember,
    relationshipType: 'partner' | 'child'
  ) => {
    // Enhanced logging to track the issue
    console.log('handleAddMember called with:', {
      newMember,
      relationshipType,
      parentMember,
    });

    if (!familyData) {
      console.error("Missing familyData, can't add new member");
      return;
    }

    // Ensure fileId is added to the new member if it doesn't already have one
    if (fileId && !newMember.fileId) {
      newMember.fileId = fileId;
    }

    if (!parentMember) {
      console.error("Missing parentMember, can't add new member");
      // CRITICAL FIX: If no parentMember is set, but we're trying to add to the root node
      // This case can happen if parentMember wasn't properly set
      if (relationshipType && newMember && familyData) {
        console.log('Attempting to add to root node as fallback...');
        // Create a deep copy of familyData
        const updatedData = structuredClone(familyData);

        if (relationshipType === 'partner') {
          // Add partner logic
          if (!updatedData.partners) {
            updatedData.partners = [];
          }

          // Add bidirectional relationship
          newMember.isPartnerOf = updatedData.id;
          updatedData.partners.push(newMember);
          console.log(
            'Added partner to root partners array:',
            updatedData.partners
          );

          // If this is the first partner, also set it as the main partner
          if (!updatedData.partner) {
            updatedData.partner = newMember;
            // Ensure bidirectional relationship
            newMember.partner = updatedData;
            console.log('Also set as main partner on root');
          }
        } else {
          // Add child logic for root
          if (!updatedData.children) {
            updatedData.children = [];
          }

          // Set parent reference for the child
          newMember.parentId = updatedData.id;

          // Add the child to the array
          updatedData.children.push(newMember);
          console.log(
            'Added child to root children array:',
            updatedData.children
          );
        }

        console.log('Updated root data structure:', updatedData);

        // Update the UI state
        setFamilyData(updatedData);
        setEditDialogOpen(false);
        setParentMember(null);

        // Force UI update
        setAutoFit(true);
        setAnimated(true);
        setForceUpdate(prev => prev + 1);
        return;
      }
      return;
    }

    // The rest of handleAddMember stays the same...
    // Create a deep copy of familyData to avoid reference issues
    const updatedData = structuredClone(familyData);

    // Find the parent member in the data structure
    const parentInData = findMemberById(updatedData, parentMember.id);

    if (!parentInData) {
      console.error(
        'Parent member not found in data structure: ',
        parentMember.id
      );
      return;
    }

    console.log('Found parent in data:', parentInData);

    if (relationshipType === 'partner') {
      // Add partner logic
      if (!parentInData.partners) {
        parentInData.partners = [];
      }

      // Add bidirectional relationship
      newMember.isPartnerOf = parentInData.id;
      parentInData.partners.push(newMember);
      console.log('Added partner to partners array:', parentInData.partners);

      // If this is the first partner, also set it as the main partner
      if (!parentInData.partner) {
        parentInData.partner = newMember;
        // Ensure bidirectional relationship
        newMember.partner = parentInData;
        console.log('Also set as main partner');
      }
    } else {
      // Add child logic
      // Initialize children as an array if it doesn't exist or isn't an array
      if (!parentInData.children) {
        parentInData.children = [];
        console.log('Initialized children array');
      } else if (!Array.isArray(parentInData.children)) {
        // Convert object children to array if needed
        const childrenArray = Object.values(parentInData.children).flat();
        parentInData.children = childrenArray;
        console.log('Converted children object to array');
      }

      // Set parent reference for the child
      newMember.parentId = parentInData.id;

      // Add the child to the array
      parentInData.children.push(newMember);
      console.log('Added child to children array:', parentInData.children);

      // Also update the partner relationship if parent has a partner
      if (parentInData.partner) {
        // Update childrenRefs for the partner
        if (!parentInData.partner.childrenRefs) {
          parentInData.partner.childrenRefs = [];
        }
        parentInData.partner.childrenRefs.push(newMember.id);
        console.log('Updated partner childrenRefs');
      }
    }

    console.log('Updated data structure:', updatedData);

    // Update the UI state
    setFamilyData(updatedData);
    setEditDialogOpen(false);
    setParentMember(null);

    // Force UI update
    // Reset autoFit to true to center the view with the new member
    setAutoFit(true);
    // Trigger animation for smooth transition
    setAnimated(true);
    // Force a refresh of calculated positions
    setForceUpdate(prev => prev + 1);
  };

  // Handlers for adding partner/child
  const handleAddPartner = (member: FamilyMember) => {
    setParentMember(member);
    setEditDialogOpen(true);
  };

  const handleAddChild = (member: FamilyMember) => {
    setParentMember(member);
    setEditDialogOpen(true);
  };

  const handleEdit = (member: FamilyMember) => {
    // Placeholder for edit functionality
    console.log('Edit member:', member);
  };

  const handleDeleteMember = (memberId: string) => {
    if (!familyData) {
      return;
    }

    // Create a deep copy of familyData
    const updatedData = structuredClone(familyData);

    // Helper function to recursively remove a member by ID
    const removeMember = (
      tree: FamilyMember,
      idToRemove: string
    ): FamilyMember | null => {
      // If this is the node to remove and it's the root
      if (tree.id === idToRemove) {
        return null; // Remove the entire tree if it's the root
      }

      // Check and filter children
      if (Array.isArray(tree.children) && tree.children.length > 0) {
        tree.children = tree.children
          .filter(child => child.id !== idToRemove)
          .map(child => {
            const updatedChild = removeMember(child, idToRemove);
            return updatedChild ? updatedChild : child;
          })
          .filter(Boolean);
      }

      // Check and filter partners
      if (Array.isArray(tree.partners) && tree.partners.length > 0) {
        tree.partners = tree.partners
          .filter(partner => partner.id !== idToRemove)
          .map(partner => {
            const updatedPartner = removeMember(partner, idToRemove);
            return updatedPartner ? updatedPartner : partner;
          })
          .filter(Boolean);
      }

      // Check main partner if it exists
      if (tree.partner && tree.partner.id === idToRemove) {
        tree.partner = undefined;
      }

      return tree;
    };

    // Root can't be deleted this way, so check if it's the root first
    if (updatedData.id === memberId) {
      // Can't delete the root node through this method
      console.warn('Cannot delete the root node');
      return;
    }

    // Remove the member from the tree
    const newTree = removeMember(updatedData, memberId);

    if (newTree) {
      console.log('Updated tree after deletion:', newTree);
      setFamilyData(newTree);

      // Reset autoFit to true to center the view after deletion
      setAutoFit(true);
      // Trigger animation for smooth transition
      setAnimated(true);
      // Force a refresh of calculated positions
      setForceUpdate(prev => prev + 1);
    }
  };

  const handleUpdateRelationship = (member: FamilyMember, newType: string) => {
    if (!familyData) {
      return;
    }

    console.log(
      'Updating relationship type for:',
      member.id,
      'New type:',
      newType
    );

    // Create a deep copy of familyData
    const updatedData = structuredClone(familyData);

    // Helper function to recursively find and update a member's relationship type
    const updateMemberRelationship = (
      tree: FamilyMember,
      idToUpdate: string,
      newRelationshipType: string
    ): boolean => {
      // If this is the node to update
      if (tree.id === idToUpdate) {
        tree.relationshipType = newRelationshipType;
        return true;
      }

      // Check children
      if (Array.isArray(tree.children) && tree.children.length > 0) {
        for (const child of tree.children) {
          if (
            updateMemberRelationship(child, idToUpdate, newRelationshipType)
          ) {
            return true;
          }
        }
      }

      // Check partner
      if (tree.partner && tree.partner.id === idToUpdate) {
        tree.partner.relationshipType = newRelationshipType;
        return true;
      }

      // Check multiple partners
      if (Array.isArray(tree.partners) && tree.partners.length > 0) {
        for (const partner of tree.partners) {
          if (partner.id === idToUpdate) {
            partner.relationshipType = newRelationshipType;
            return true;
          }

          // Check partner's children if they exist
          if (Array.isArray(partner.children) && partner.children.length > 0) {
            for (const child of partner.children) {
              if (
                updateMemberRelationship(child, idToUpdate, newRelationshipType)
              ) {
                return true;
              }
            }
          }
        }
      }

      return false;
    };

    // Update the relationship type
    updateMemberRelationship(updatedData, member.id, newType);

    // Update the family data
    setFamilyData(updatedData);
    // Trigger animation for smooth transition
    setAnimated(true);
    // Force a refresh of calculated positions
    setForceUpdate(prev => prev + 1);
  };

  // Handle initial node creation
  const handleInitialNodeSave = (newMember: FamilyMember) => {
    // Ensure fileId is added to the initial node
    if (fileId && !newMember.fileId) {
      newMember.fileId = fileId;
    }

    setFamilyData(newMember);
    setInitialNodeDialogOpen(false);
  };

  // Add a method to rebuild the tree
  const handleRebuildTree = () => {
    setFamilyData(null);
    setInitialNodeDialogOpen(true);
    // Reset other states as needed
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    setAutoFit(true);
  };

  // Pan and zoom handlers - remaining code unchanged
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) {
      return;
    } // Only left mouse button

    setIsDragging(true);
    setDragStart({
      x: e.clientX - translate.x,
      y: e.clientY - translate.y,
    });

    // Turn off auto-fit when user starts dragging
    setAutoFit(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return;
    }

    setTranslate({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (newScale: number) => {
    setScale(newScale);
    // Turn off auto-fit when user manually zooms
    setAutoFit(false);
  };

  const handleResetView = () => {
    setAutoFit(true);
  };

  // Only show InitialNodeDialog if needed (no initialFamilyData AND no fileName)
  if (initialNodeDialogOpen) {
    return (
      <InitialNodeDialog
        open={true}
        onClose={() => {
          if (!familyData) {
            // Don't allow closing if there's no family data yet
            return;
          }
          setInitialNodeDialogOpen(false);
        }}
        onSave={handleInitialNodeSave}
        isFirstNode={true}
        contactList={contactList}
      />
    );
  }

  // Render the family tree
  return (
    <Box
      sx={{
        p: 4,
        bgcolor: theme.palette.mode === 'dark' ? '#171A25' : '#f5f5f5',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        ref={containerRef}
        sx={{
          position: 'relative',
          width: '100%',
          height: 700,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          boxShadow: theme.shadows[2],
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <Box
          ref={contentRef}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
            transformOrigin: '0 0',
            transition: animated ? 'all 0.5s ease-in-out' : 'none',
          }}
        >
          {/* Tree connectors */}
          {familyData && (
            <TreeConnectors
              nodePositions={nodePositions}
              familyData={familyData}
              calculatedPositions={calculatedPositions}
              scale={scale}
            />
          )}

          {/* Render all members with optimized positioning */}
          {familyData &&
            getAllMembers(familyData).map(member => {
              const position = calculatedPositions[member.id];
              console.log(
                'Rendering member:',
                member.id,
                'at position:',
                position
              );
              if (!position) {
                console.warn(`No position calculated for member: ${member.id}`);
                return null;
              }

              return (
                <FamilyCard
                  key={member.id}
                  member={member}
                  onAddChild={handleAddChild}
                  onAddPartner={handleAddPartner}
                  onEdit={handleEdit}
                  onDelete={handleDeleteMember}
                  onUpdateRelationship={handleUpdateRelationship}
                  position={position}
                  onPositionChange={handleNodePositionChange}
                  scale={scale}
                />
              );
            })}
        </Box>

        {/* Controls Panel */}
        <ControlPanel
          scale={scale}
          onZoom={setScale}
          onReset={() => setAutoFit(true)}
          onRebuild={handleRebuildTree}
          autoFit={autoFit}
          isDragging={false}
        />
      </Box>

      {/* EditDialog for adding members - now with contact list and existing members */}
      <EditDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setParentMember(null);
        }}
        onSave={handleAddMember}
        parentMember={parentMember}
        contactList={contactList}
        existingFamilyMembers={allFamilyMembers}
        refreshContacts={refreshContacts}
      />
    </Box>
  );
};

export default ImprovedFamilyTree;
