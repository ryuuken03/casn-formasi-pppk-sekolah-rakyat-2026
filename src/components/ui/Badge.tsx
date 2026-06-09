
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success';
  style?: React.CSSProperties;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', style }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          background: 'rgba(16, 185, 129, 0.2)',
          color: '#34d399',
          borderColor: 'rgba(16, 185, 129, 0.3)',
        };
      case 'primary':
      default:
        return {}; // Uses default .badge styles from index.css
    }
  };

  return (
    <span 
      className="badge" 
      style={{ 
        fontSize: '0.7rem', 
        padding: '0.2rem 0.6rem',
        ...getVariantStyles(),
        ...style 
      }}
    >
      {children}
    </span>
  );
};

export default Badge;
