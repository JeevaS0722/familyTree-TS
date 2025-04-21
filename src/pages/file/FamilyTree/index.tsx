import React, { useState } from 'react';
import { FamilyTree } from '../../../component/FamilyTree';
import { PersonData } from '../../../component/FamilyTree/types/familyTree';

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
  const [familyData, setFamilyData] = useState<PersonData[]>(sampleFamilyData);

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

    // Add the new person to the data
    setFamilyData([...familyData, person]);
  };

  // Handle person delete
  const handlePersonDelete = (personId: string) => {
    console.log(`Person deleted: ${personId}`);

    // Remove the person from the data
    setFamilyData(familyData.filter(p => p.id !== personId));
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <FamilyTree
        data={familyData}
        mainId="1"
        onPersonClick={handlePersonClick}
        onPersonEdit={handlePersonEdit}
        onPersonAdd={handlePersonAdd}
        onPersonDelete={handlePersonDelete}
      />
    </div>
  );
};

export default App;
