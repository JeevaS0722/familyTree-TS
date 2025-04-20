// src/components/FamilyTree/EditForm.tsx
import React, { useState, useEffect } from 'react';
import { PersonData } from '../../types/familyTree';
import { useTreeContext } from '../../context/TreeContext';
import { createNewPerson } from '../../utils/personHelper';

interface EditFormProps {
  person?: PersonData;
  relationType?: 'father' | 'mother' | 'spouse' | 'son' | 'daughter';
  isOpen: boolean;
  onClose: () => void;
  onSave: (person: PersonData) => void;
  onDelete?: (personId: string) => void;
}

const EditForm: React.FC<EditFormProps> = ({
  person,
  relationType,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const { state } = useTreeContext();
  const [formData, setFormData] = useState<Partial<PersonData['data']>>({
    gender: '',
    firstName: '',
    lastName: '',
    dOB: '',
    decDt: null,
    deceased: null,
    age: null,
    city: null,
    state: null,
    address: null,
    fileId: 0,
    heir: null,
    research_inheritance: null,
    is_new_notes: null,
  });
  const [otherParentId, setOtherParentId] = useState<string>('');
  const [availableParents, setAvailableParents] = useState<PersonData[]>([]);

  // Initialize form with person data or defaults for new relations
  useEffect(() => {
    if (person) {
      setFormData({ ...person.data });
    } else if (relationType) {
      // Set default gender based on relation type
      const gender =
        relationType === 'father' || relationType === 'son'
          ? 'M'
          : relationType === 'mother' || relationType === 'daughter'
            ? 'F'
            : '';
      setFormData({
        gender,
        firstName: '',
        lastName: '',
        dOB: '',
        decDt: null,
        deceased: null,
        age: null,
        city: null,
        state: null,
        address: null,
        fileId: 0,
        heir: null,
        research_inheritance: null,
        is_new_notes: null,
      });
    }
  }, [person, relationType]);

  // Find available parents for child relation
  useEffect(() => {
    if (relationType === 'son' || relationType === 'daughter') {
      // Get potential other parents (spouses of current person)
      const currentPerson = state.data.find(p => p.id === state.mainId);
      if (currentPerson && currentPerson.rels.spouses) {
        const spouses = currentPerson.rels.spouses
          .map(id => state.data.find(p => p.id === id))
          .filter(Boolean) as PersonData[];
        setAvailableParents(spouses);

        // Set default other parent to first spouse if available
        if (spouses.length > 0 && !otherParentId) {
          setOtherParentId(spouses[0].id);
        }
      }
    }
  }, [relationType, state.data, state.mainId, otherParentId]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Handle gender radio change
  const handleGenderChange = (gender: 'M' | 'F') => {
    setFormData(prev => ({ ...prev, gender }));
  };

  // Handle other parent selection
  const handleOtherParentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOtherParentId(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let updatedPerson: PersonData;

    if (person) {
      // Update existing person
      updatedPerson = {
        ...person,
        data: { ...person.data, ...formData },
      };
    } else {
      // Create new person
      updatedPerson = createNewPerson({
        data: formData as PersonData['data'],
        rels: {},
      });

      // Add relation data if creating a new relationship
      if (relationType) {
        updatedPerson._new_rel_data = {
          rel_type: relationType,
          label: `Add ${relationType.charAt(0).toUpperCase() + relationType.slice(1)}`,
        };

        // For child relations, store the other parent ID
        if (
          (relationType === 'son' || relationType === 'daughter') &&
          otherParentId
        ) {
          updatedPerson._new_rel_data.other_parent_id = otherParentId;
        }
      }
    }

    onSave(updatedPerson);
    onClose();
  };

  // Handle delete
  const handleDelete = () => {
    if (person && onDelete) {
      onDelete(person.id);
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="f3-edit-form-overlay">
      <div className="f3-edit-form">
        <button className="f3-edit-form-close" onClick={onClose}>
          ×
        </button>

        <h3>
          {person
            ? 'Edit Person'
            : `Add ${relationType?.charAt(0).toUpperCase() + relationType?.slice(1)}`}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="f3-form-section">
            <label>Gender</label>
            <div className="f3-radio-group">
              <label>
                <input
                  type="radio"
                  name="gender"
                  checked={formData.gender === 'M'}
                  onChange={() => handleGenderChange('M')}
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  checked={formData.gender === 'F'}
                  onChange={() => handleGenderChange('F')}
                />
                Female
              </label>
            </div>
          </div>

          <div className="f3-form-section">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName || ''}
              onChange={handleInputChange}
              placeholder="First Name"
            />
          </div>

          <div className="f3-form-section">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ''}
              onChange={handleInputChange}
              placeholder="Last Name"
            />
          </div>

          <div className="f3-form-section">
            <label>File ID</label>
            <input
              type="number"
              name="fileId"
              value={formData.fileId || 0}
              onChange={handleInputChange}
              placeholder="File ID"
            />
          </div>

          <div className="f3-form-section">
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={formData.age || ''}
              onChange={handleInputChange}
              placeholder="Age"
            />
          </div>

          <div className="f3-form-section">
            <label>Date of Birth</label>
            <input
              type="text"
              name="dOB"
              value={formData.dOB || ''}
              onChange={handleInputChange}
              placeholder="MM/DD/YYYY"
            />
          </div>

          <div className="f3-form-section">
            <label>
              <input
                type="checkbox"
                name="deceased"
                checked={!!formData.deceased}
                onChange={handleCheckboxChange}
              />
              Deceased
            </label>
          </div>

          {formData.deceased && (
            <div className="f3-form-section">
              <label>Date of Death</label>
              <input
                type="text"
                name="decDt"
                value={formData.decDt || ''}
                onChange={handleInputChange}
                placeholder="MM/DD/YYYY"
              />
            </div>
          )}

          <div className="f3-form-section">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city || ''}
              onChange={handleInputChange}
              placeholder="City"
            />
          </div>

          <div className="f3-form-section">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={formData.state || ''}
              onChange={handleInputChange}
              placeholder="State"
            />
          </div>

          <div className="f3-form-section">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
              placeholder="Address"
              rows={3}
            />
          </div>

          <div className="f3-form-section">
            <label>
              <input
                type="checkbox"
                name="heir"
                checked={!!formData.heir}
                onChange={handleCheckboxChange}
              />
              Heir
            </label>
          </div>

          <div className="f3-form-section">
            <label>
              <input
                type="checkbox"
                name="research_inheritance"
                checked={!!formData.research_inheritance}
                onChange={handleCheckboxChange}
              />
              Research Inheritance
            </label>
          </div>

          <div className="f3-form-section">
            <label>
              <input
                type="checkbox"
                name="is_new_notes"
                checked={!!formData.is_new_notes}
                onChange={handleCheckboxChange}
              />
              Has New Notes
            </label>
          </div>

          {(relationType === 'son' || relationType === 'daughter') &&
            availableParents.length > 0 && (
              <div className="f3-form-section">
                <label>Other Parent</label>
                <select
                  name="otherParent"
                  value={otherParentId}
                  onChange={handleOtherParentChange}
                >
                  {availableParents.map(parent => (
                    <option key={parent.id} value={parent.id}>
                      {parent.data.firstName} {parent.data.lastName}
                    </option>
                  ))}
                  <option value="_new">Add New Parent</option>
                </select>
              </div>
            )}

          <div className="f3-form-buttons">
            {person && onDelete && (
              <button
                type="button"
                className="f3-delete-btn"
                onClick={handleDelete}
              >
                Delete
              </button>
            )}
            <button type="button" className="f3-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="f3-submit-btn">
              {person ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditForm;
