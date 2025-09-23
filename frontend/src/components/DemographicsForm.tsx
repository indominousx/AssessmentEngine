import React, { useState, useEffect, useRef } from 'react';

// --- Helper Component: Animated Number for the Age Display ---
const AnimatedAgeDisplay = ({ finalAge }: { finalAge: number }) => {
  const [displayAge, setDisplayAge] = useState(0);

  useEffect(() => {
    // This effect creates the counting animation
    let currentAge = 0;
    const duration = 800; // Animation duration in milliseconds
    const stepTime = Math.max(10, duration / finalAge); // Calculate interval time

    const timer = setInterval(() => {
      currentAge += 1;
      setDisplayAge(currentAge);
      if (currentAge >= finalAge) {
        clearInterval(timer);
      }
    }, stepTime);

    // Cleanup function to clear the interval if the component unmounts
    return () => clearInterval(timer);
  }, [finalAge]);

  return <span style={styles.ageDisplay}>{displayAge}</span>;
};

// --- Helper Component: Custom Dropdown Menu ---
const CustomDropdown = ({ options, selectedValue, onSelect, placeholder }: {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Effect to handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} style={styles.dropdownContainer}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} style={styles.dropdownHeader}>
        {selectedValue || placeholder}
        <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
      </button>
      {isOpen && (
        <div style={styles.dropdownList}>
          {options.map(option => (
            <div key={option} onClick={() => handleSelect(option)} style={styles.dropdownItem}>
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main DemographicsForm Component ---
interface Props {
  onSubmit: (age: number, gender: string, status: string) => void;
  isLoading: boolean;
  onBack: () => void;
}

export const DemographicsForm = ({ onSubmit, isLoading, onBack }: Props) => {
  const [age, setAge] = useState('18'); // Default age
  const minAge = 15;
  const maxAge = 50;
  const [gender, setGender] = useState('');
  const [status, setStatus] = useState('Student');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (age && gender && !isLoading) {
      onSubmit(parseInt(age), gender, status);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <h1 style={styles.header}>Tell us a bit about yourself</h1>
        <p style={styles.subHeader}>This helps us personalize the experience for you.</p>
        <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
          {/* Age Selector */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Age *</label>
            <AnimatedAgeDisplay finalAge={parseInt(age) || 0} />
            <input
              type="range"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              min={minAge}
              max={maxAge}
              style={{
                ...styles.slider,
                background: `linear-gradient(90deg, #007bff ${(+age-minAge)/(maxAge-minAge)*100}%, #e0e0e0 ${(+age-minAge)/(maxAge-minAge)*100}%)`,
                outline: 'none',
                height: '6px',
                borderRadius: '5px',
                appearance: 'none',
              }}
            />
          </div>

          {/* Gender Selector */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Gender *</label>
            <CustomDropdown
              options={['Male', 'Female', 'Non-binary', 'Prefer not to say']}
              selectedValue={gender}
              onSelect={setGender}
              placeholder="Select your gender..."
            />
          </div>

          {/* Status Selector */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Current Status *</label>
            <CustomDropdown
              options={['Student', 'Working Professional', 'Job Seeker', 'Other']}
              selectedValue={status}
              onSelect={setStatus}
              placeholder="Select your current status..."
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '2.5rem' }}>
            <button type="button" onClick={onBack} style={styles.buttonSecondary}>
              Back
            </button>
            <button type="submit" disabled={isLoading || !gender} style={isLoading || !gender ? { ...styles.buttonPrimary, ...styles.buttonDisabled } : styles.buttonPrimary}>
              {isLoading ? 'Loading...' : 'Begin Assessment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- STYLES ---
// Using CSS-in-JS for a self-contained component.
// In a larger project, this would be in a separate CSS/SCSS file or a styled-component.
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e0f7fa 0%, #f0f4f7 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  card: {
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 87, 134, 0.1)',
    transition: 'transform 0.3s ease-in-out',
    margin: '20px',
  },
  header: {
    textAlign: 'center',
    color: '#005786',
    fontWeight: 600,
    fontSize: '2rem',
    margin: 0,
  },
  subHeader: {
    textAlign: 'center',
    color: '#5a7a8b',
    fontSize: '1rem',
    marginTop: '8px',
  },
  formGroup: {
    marginBottom: '1.75rem',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#333',
    fontWeight: 500,
  },
  ageDisplay: {
    display: 'block',
    textAlign: 'center',
    fontSize: '3rem',
    fontWeight: 700,
    color: '#007bff',
    marginBottom: '1rem',
  },
  slider: {
    width: '100%',
    cursor: 'pointer',
  },
  buttonPrimary: {
    padding: '12px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    flexGrow: 1,
    transition: 'background-color 0.2s, box-shadow 0.2s',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  buttonSecondary: {
    padding: '12px 20px',
    fontSize: '16px',
    backgroundColor: '#f8f9fa',
    color: '#333',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonDisabled: {
    backgroundColor: '#a0c7e4',
    cursor: 'not-allowed',
  },
  // --- Custom Dropdown Styles ---
  dropdownContainer: {
    position: 'relative',
  },
  dropdownHeader: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: '#fff',
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownList: {
    position: 'absolute',
    top: '110%',
    left: 0,
    width: '100%',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
    maxHeight: '200px',
    overflowY: 'auto',
  },
  dropdownItem: {
    padding: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};