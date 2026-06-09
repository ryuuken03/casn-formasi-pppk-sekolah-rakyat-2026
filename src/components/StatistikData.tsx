import { useMemo, useEffect } from 'react';
import MapVisualizer from './ui/MapVisualizer';
import FilterToolbar from './FilterToolbar';
import { useFormasiFilters } from '../hooks/useFormasiFilters';
import { DEFAULT_PENGADAAN } from '../types';
import type { FormasiData, InitialFilters } from '../types';

interface StatistikProps {
  data: FormasiData[];
  theme: 'light' | 'dark';
  onCardClick?: (filters: InitialFilters) => void;
}

const StatistikData: React.FC<StatistikProps> = ({ data, theme, onCardClick }) => {
  const {
    searchJabatan, setSearchJabatan,
    searchLokasi, setSearchLokasi,
    searchPengadaan, setSearchPengadaan,
    jabatanOptions,
    lokasiOptions,
    filteredData,
    totalKuota,
    hasAnyFilter
  } = useFormasiFilters(data);

  // Force default tab selection
  useEffect(() => {
    if (!searchPengadaan) {
      setSearchPengadaan(DEFAULT_PENGADAAN);
    }
  }, [searchPengadaan, setSearchPengadaan]);

  const handleReset = () => {
    const currentTab = searchPengadaan; // preserve tab
    setSearchJabatan('');
    setSearchLokasi('');
    setSearchPengadaan(currentTab);
  };

  // Aggregate filtered data by location for the MapVisualizer
  const mapStatsData = useMemo(() => {
    const agg = new Map<string, number>();
    for (const item of filteredData) {
      if (item.jumlah > 0) {
        const current = agg.get(item.lokasi_formasi) || 0;
        agg.set(item.lokasi_formasi, current + item.jumlah);
      }
    }
    return Array.from(agg.entries()).map(([name, total]) => ({ name, total }));
  }, [filteredData]);

  return (
    <div className="statistik-container">
      <FilterToolbar
        searchJabatan={searchJabatan}
        setSearchJabatan={setSearchJabatan}
        searchLokasi={searchLokasi}
        setSearchLokasi={setSearchLokasi}
        searchPengadaan={searchPengadaan}
        setSearchPengadaan={setSearchPengadaan}
        jabatanOptions={jabatanOptions}
        lokasiOptions={lokasiOptions}
        totalKuota={totalKuota}
        filteredCount={filteredData.length}
        hasAnyFilter={hasAnyFilter}
        resetFilters={handleReset}
      />

      <div className="statistik-content" style={{ marginTop: '1rem' }}>
        <MapVisualizer
          statsData={mapStatsData}
          theme={theme}
          activeFilterPengadaan={searchPengadaan}
          activeLokasi={searchLokasi}
          onRegionClick={(regionName) => {
            if (onCardClick) {
              onCardClick({
                jabatan: searchJabatan,
                lokasi: regionName,
                pengadaan: searchPengadaan,
              });
            }
          }}
        />
      </div>
    </div>
  );
};

export default StatistikData;
