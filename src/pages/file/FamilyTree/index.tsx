// src/components/FamilyTreeExample.tsx
import React, { useState } from 'react';
import FamilyTreeComponent from '../../../component/family-chart/wrapper/FamilyTreeComponent';
import { Datum } from '../../../component/family-chart/types';
import '../../../component/family-chart/styles/family-chart.css';
import sampleFamilyData from './data/sampleData';

// FamilyTree Component
const FamilyTreeExample: React.FC = () => {
  const [familyData] = useState<Datum[]>(sampleFamilyData);

  const handlePersonClick = (person: Datum) => {
    console.log('Selected person:', person);
  };

  return (
    <div className="family-tree-container">
      <h2>Family Tree Example</h2>

      {/* The Family Tree component */}
      <FamilyTreeComponent
        data={familyData}
        main_id_history={['0']}
        main_id="0"
        width="100vw"
        height="100vh"
        node_separation={1000}
        level_separation={600}
        onPersonClick={handlePersonClick}
        svgMode={true}
      />
    </div>
  );
};

export default FamilyTreeExample;
