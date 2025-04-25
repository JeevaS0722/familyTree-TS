/* eslint-disable max-depth */
/* eslint-disable complexity */
// src/components/FamilyTree/FamilyTree.tsx
import React, { memo, useEffect, useRef } from 'react';
import { PersonData } from '../types/familyTree';
import { TreeProvider, useTreeContext } from '../context/TreeContext';
import TreeView from './TreeView';
import SearchBar from './controls/SearchBar';
import './FamilyTree.css';

interface FamilyTreeProps {
  data: PersonData[];
  mainId?: string;
  onPersonAdd?: (personId: string, relationType: string) => void;
  onPersonDelete?: (personId: string) => void;
  contextRef?: (context: any) => void;
}

interface FamilyTreeContentProps {
  onPersonAdd?: (personId: string, relationType: string) => void;
  onPersonDelete?: (personId: string) => void;
}

const FamilyTreeContent: React.FC<FamilyTreeContentProps> = ({
  onPersonAdd,
  onPersonDelete,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  return (
    <div className="f3 f3-cont">
      <TreeView
        svgRef={svgRef}
        onPersonAdd={onPersonAdd}
        onPersonDelete={onPersonDelete}
      />
      <SearchBar />
    </div>
  );
};

const ContextBridge: React.FC<{
  contextRef?: (context: any) => void;
}> = ({ contextRef }) => {
  const context = useTreeContext();

  useEffect(() => {
    if (contextRef) {
      contextRef(context);
    }
  }, [contextRef]);

  return null;
};

const FamilyTree: React.FC<FamilyTreeProps> = ({
  data,
  mainId,
  onPersonAdd,
  onPersonDelete,
  contextRef,
}) => {
  return (
    <TreeProvider initialData={data} initialMainId={mainId}>
      {contextRef && <ContextBridge contextRef={contextRef} />}
      <FamilyTreeContent
        onPersonAdd={onPersonAdd}
        onPersonDelete={onPersonDelete}
      />
    </TreeProvider>
  );
};

export default memo(FamilyTree);
