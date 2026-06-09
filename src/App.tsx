import { useMemo, useState } from 'react';
import FormasiTable from './components/FormasiTable';
import StatistikData from './components/StatistikData';
import Header from './components/Header';
import ScrollToTop from './components/ui/ScrollToTop';
import rawData from './assets/data/data.json';
import { useTheme } from './hooks/useTheme';
import type { InitialFilters, RawDataJson } from './types';
import './index.css';

const typedRawData = rawData as RawDataJson;

function App() {
  const formasiData = useMemo(() => typedRawData.data, []);
  const [activeTab, setActiveTab] = useState<'daftar' | 'statistik'>('statistik');
  const [filterTrigger, setFilterTrigger] = useState<{ filters: InitialFilters, ts: number } | null>(null);
  const { theme, toggleTheme } = useTheme();

  const handleCardClick = (filters: InitialFilters) => {
    setFilterTrigger({ filters, ts: Date.now() });
    setActiveTab('daftar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <Header theme={theme} onToggleTheme={toggleTheme} />

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <a
            href="https://sscasn.bkn.go.id/daftar-formasi/"
            target="_blank"
            rel="noreferrer"
            className="action-btn source-link-btn"
          >
            Buka Sumber Referensi Asli (SSCASN BKN)
          </a>
        </div>

        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'daftar' ? 'active' : ''}`}
            onClick={() => setActiveTab('daftar')}
          >
            Daftar Formasi
          </button>
          <button
            className={`nav-tab ${activeTab === 'statistik' ? 'active' : ''}`}
            onClick={() => setActiveTab('statistik')}
          >
            Peta Sebaran
          </button>
        </div>
      </header>

      <main>
        {activeTab === 'daftar' ? (
          <FormasiTable data={formasiData} externalFilterTrigger={filterTrigger} />
        ) : (
          <StatistikData data={formasiData} theme={theme} onCardClick={handleCardClick} />
        )}
      </main>

      <ScrollToTop />
    </div>
  );
}

export default App;
