import React, { useState, useRef, useEffect } from 'react';
import sortIcon from '../../asset/icon/sort-icon.png';
import './SortDropdown.css';

const SortDropdown = ({ onSortChange }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Sort');
  const dropdownRef = useRef(null);

  const options = [
    { label: 'Title A-Z', value: 'title-asc' },
    { label: 'Title Z-A', value: 'title-desc' },
    { label: 'Newest', value: 'date-newest' },
    { label: 'Oldest', value: 'date-oldest' },
  ];

  const handleOptionClick = (option) => {
    setSelectedOption(option.label);
    onSortChange(option.value);
    setShowOptions(false);
  };

  const handleDocumentClick = (event) => {
    if (showOptions && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [showOptions]);

  return (
    <div className="sort-dropdown" ref={dropdownRef}>
      <button onClick={() => setShowOptions(!showOptions)} className="sort-button">
        {selectedOption}
        <img src={sortIcon} alt="Sort" className="sort-icon" />
      </button>
      {showOptions && (
        <ul className="sort-options">
          {options.map((option) => (
            <li key={option.value} onClick={() => handleOptionClick(option)}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SortDropdown;
