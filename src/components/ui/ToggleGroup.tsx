
interface ToggleOption {
  label: string;
  value: string;
}

interface ToggleGroupProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  containerStyle?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
}

const ToggleGroup: React.FC<ToggleGroupProps> = ({ options, value, onChange, containerStyle, buttonStyle }) => {
  return (
    <div className="toggle-group" style={{ display: 'flex', ...containerStyle }}>
      {options.map((option) => (
        <button
          key={option.value}
          className={`toggle-btn ${value === option.value ? 'active' : ''}`}
          style={{ flex: 1, ...buttonStyle }}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default ToggleGroup;
