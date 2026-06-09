import logo from '../assets/logo_kemensos.jpg';
import ThemeToggle from './ui/ThemeToggle';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  return (
    <>
      <div className="header-container">
        <img src={logo} alt="Logo Kemensos" className="header-logo" />
        <div className="header-content">
          <h1 className="header-title">Eksplorasi Data CASN 2026</h1>
          <p className="header-subtitle">Visualisasi Alternatif PPPK Guru &amp; Teknis - Kementerian Sosial (Bukan Situs Resmi).</p>
          <span className="header-disclaimer">
            *Situs ini hanya sebagai alat bantu visualisasi mandiri.
          </span>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </>
  );
};

export default Header;
