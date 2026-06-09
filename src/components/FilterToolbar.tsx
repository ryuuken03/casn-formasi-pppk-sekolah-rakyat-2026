import { useState } from 'react';
import SearchableSelect from './ui/SearchableSelect';
import ToggleGroup from './ui/ToggleGroup';
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

      <div className={`filter-section ${showFilters ? 'show' : ''}`} style={{ alignItems: 'flex-end' }}>
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

        {hasAnyFilter && (
          <div className="filter-group" style={{ flex: '0 1 auto', minWidth: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <label style={{ visibility: 'hidden' }}>Reset</label>
            <button className="action-btn reset-filter-btn" onClick={resetFilters}>
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {filteredCount > 0 && (
        <div className="total-kebutuhan-card">
          <span className="tk-label">Total Kebutuhan :</span>
          <span className="tk-value">{totalKuota.toLocaleString()} Orang</span>
        </div>
      )}
    </>
  );
};

export default FilterToolbar;
