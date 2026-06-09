import { useState, useEffect } from 'react';
import SearchableSelect from './ui/SearchableSelect';
import ToggleGroup from './ui/ToggleGroup';
import Modal from './ui/Modal';
import { TOGGLE_PENGADAAN_OPTIONS, DEFAULT_PENGADAAN } from '../types';

interface FilterToolbarProps {
  searchJabatan: string;
  setSearchJabatan: (val: string) => void;
  searchLokasi: string;
  setSearchLokasi: (val: string) => void;
  searchPengadaan: string;
  setSearchPengadaan: (val: string) => void;
  searchKebutuhan?: number | '';
  setSearchKebutuhan?: (val: number | '') => void;
  jabatanOptions: string[];
  lokasiOptions: string[];
  totalKuota: number;
  filteredCount: number;
  hasAnyFilter: boolean;
  resetFilters: () => void;
  /** If true, shows kebutuhan number input */
  showKebutuhanFilter?: boolean;
}

const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchJabatan, setSearchJabatan,
  searchLokasi, setSearchLokasi,
  searchPengadaan, setSearchPengadaan,
  searchKebutuhan, setSearchKebutuhan,
  jabatanOptions, lokasiOptions,
  totalKuota, filteredCount,
  hasAnyFilter, resetFilters,
  showKebutuhanFilter = false,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filterFormContent = (
    <>
      <div className="filter-group">
        <label>Cari Nama Jabatan</label>
        <SearchableSelect
          options={jabatanOptions}
          value={searchJabatan}
          onChange={setSearchJabatan}
          placeholder="Semua Jabatan"
        />
      </div>

      <div className="filter-group">
        <label>Cari Lokasi Formasi</label>
        <SearchableSelect
          options={lokasiOptions}
          value={searchLokasi}
          onChange={setSearchLokasi}
          placeholder="Semua Lokasi"
        />
      </div>

      {showKebutuhanFilter && setSearchKebutuhan && (
        <div className="filter-group">
          <label>Minimal Kebutuhan</label>
          <input
            type="number"
            className="premium-input"
            min="1"
            value={searchKebutuhan}
            onChange={(e) => setSearchKebutuhan(e.target.value ? parseInt(e.target.value) : '')}
            placeholder="Misal: 3"
          />
        </div>
      )}

      {hasAnyFilter && !isMobile && (
        <div className="filter-group" style={{ flex: '0 1 auto', minWidth: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <label style={{ visibility: 'hidden' }}>Reset</label>
          <button className="action-btn reset-filter-btn" onClick={resetFilters}>
            Reset Filter
          </button>
        </div>
      )}
      
      {isMobile && (
        <div className="modal-actions" style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
           <button className="action-btn" style={{ flex: 1, background: 'var(--primary)', color: '#fff', border: 'none' }} onClick={() => setShowFilters(false)}>
             Terapkan Filter
           </button>
           {hasAnyFilter && (
             <button className="action-btn reset-filter-btn" onClick={() => { resetFilters(); setShowFilters(false); }}>
               Reset
             </button>
           )}
        </div>
      )}
    </>
  );

  return (
    <>
      <div className="table-header-controls">
        <ToggleGroup
          options={[...TOGGLE_PENGADAAN_OPTIONS]}
          value={searchPengadaan || DEFAULT_PENGADAAN}
          onChange={(val) => { if (val) setSearchPengadaan(val); }}
          containerStyle={{ flexWrap: 'wrap' }}
          buttonStyle={{ padding: '0.5rem 1rem' }}
        />
        <button className="mobile-filter-btn" onClick={() => setShowFilters(!showFilters)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          Filter
        </button>
      </div>

      {isMobile ? (
        <Modal isOpen={showFilters} onClose={() => setShowFilters(false)} title="Filter Formasi">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filterFormContent}
          </div>
        </Modal>
      ) : (
        <div className="filter-section" style={{ alignItems: 'flex-end' }}>
          {filterFormContent}
        </div>
      )}

      {filteredCount > 0 && (
        <div className="total-kebutuhan-card">
          <span className="tk-label">Total Kebutuhan :</span>
          <span className="tk-value">{totalKuota.toLocaleString()} Orang</span>
        </div>
      )}

      {Boolean(searchJabatan || searchLokasi || searchKebutuhan) && (
        <div className="active-filters-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Filter Aktif:</span>
            <button className="source-link-btn" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', borderRadius: '999px', border: 'none', cursor: 'pointer' }} onClick={resetFilters}>
              Reset Semua ✖
            </button>
          </div>
          <ul className="active-filters-list">
            {searchJabatan && <li><span className="filter-label">Jabatan:</span> <span className="filter-value">{searchJabatan}</span></li>}
            {searchLokasi && <li><span className="filter-label">Lokasi:</span> <span className="filter-value">{searchLokasi}</span></li>}
            {searchKebutuhan && <li><span className="filter-label">Min. Kebutuhan:</span> <span className="filter-value">{searchKebutuhan}</span></li>}
          </ul>
        </div>
      )}
    </>
  );
};

export default FilterToolbar;
