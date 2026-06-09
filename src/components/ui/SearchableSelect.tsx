import { useState, useRef, useEffect, useMemo } from 'react';

interface SearchableSelectProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef(value);

  // Keep valueRef in sync
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm(valueRef.current); // use ref to avoid re-subscribing
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // stable — no re-subscribe on value change

  const filteredOptions = useMemo(
    () => options.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase())),
    [options, searchTerm]
  );

  return (
    <div className="searchable-select-wrapper" ref={wrapperRef}>
      <input
        type="text"
        className="premium-select search-input"
        placeholder={placeholder}
        value={isOpen ? searchTerm : (value || '')}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          setIsOpen(true);
          setSearchTerm(''); // Clear text when focusing to easily see all options
        }}
      />
      
      {isOpen && (
        <ul className="select-dropdown">
          <li 
            className={`select-option ${value === '' ? 'selected' : ''}`}
            onClick={() => {
              onChange('');
              setIsOpen(false);
            }}
          >
            {placeholder}
          </li>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <li 
                key={opt} 
                className={`select-option ${value === opt ? 'selected' : ''}`}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
              >
                {opt}
              </li>
            ))
          ) : (
            <li className="select-option disabled">Tidak ditemukan</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelect;
