// src/components/FamilyTree/controls/SearchBar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useTreeContext } from '../../context/TreeContext';
import { PersonData } from '../../types/familyTree';

interface SearchBarProps {
  onSelectPerson?: (personId: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelectPerson }) => {
  const { state, updateMainId } = useTreeContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<PersonData[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  useEffect(() => {
    if (!searchTerm || !state.data.length) {
      setSearchResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = state.data.filter(person => {
      const firstName = person.data['first name']?.toLowerCase() || '';
      const lastName = person.data['last name']?.toLowerCase() || '';
      const fullName = `${firstName} ${lastName}`;

      return (
        firstName.includes(term) ||
        lastName.includes(term) ||
        fullName.includes(term)
      );
    });

    setSearchResults(results.slice(0, 10));
  }, [searchTerm, state.data]);

  const handleSelectPerson = (person: PersonData) => {
    setSearchTerm('');
    setSearchResults([]);

    if (onSelectPerson) {
      onSelectPerson(person.id);
    } else {
      updateMainId(person.id);
    }
  };

  return (
    <div className={`f3-search-bar ${isExpanded ? 'expanded' : ''}`}>
      <button className="f3-search-toggle" onClick={toggleExpand}>
        {isExpanded ? (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        )}
      </button>

      <div className="f3-search-input-container">
        <input
          ref={inputRef}
          type="text"
          className="f3-search-input"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearchChange}
        />

        {searchResults.length > 0 && (
          <div className="f3-search-results">
            {searchResults.map(person => (
              <div
                key={person.id}
                className="f3-search-result-item"
                onClick={() => handleSelectPerson(person)}
              >
                <div
                  className={`f3-result-gender-indicator ${person.data.gender === 'M' ? 'male' : 'female'}`}
                />
                <span>{person.data.name || ''}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
