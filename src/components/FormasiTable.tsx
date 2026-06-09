import { useState, useEffect, useCallback } from 'react';
import Modal from './ui/Modal';
import Badge from './ui/Badge';
import PaginationControls from './ui/PaginationControls';
import FilterToolbar from './FilterToolbar';
import { usePagination } from '../hooks/usePagination';
import { useFormasiFilters } from '../hooks/useFormasiFilters';
import { DEFAULT_PENGADAAN } from '../types';
import type { FormasiData, Persyaratan, InitialFilters } from '../types';

interface TableProps {
  data: FormasiData[];
  externalFilterTrigger?: { filters: InitialFilters, ts: number } | null;
}

const FormasiTable: React.FC<TableProps> = ({ data, externalFilterTrigger }) => {
  const [selectedPersyaratan, setSelectedPersyaratan] = useState<Persyaratan[] | null>(null);
  const [modalTitle, setModalTitle] = useState<string>('');

  const {
    searchJabatan, setSearchJabatan,
    searchLokasi, setSearchLokasi,
    searchPengadaan, setSearchPengadaan,
    searchKebutuhan, setSearchKebutuhan,
    jabatanOptions,
    lokasiOptions,
    filteredData,
    totalKuota,
    resetFilters,
    hasAnyFilter
  } = useFormasiFilters(data, externalFilterTrigger);

  const {
    currentPage,
    totalPages,
    currentData,
    nextPage,
    prevPage,
  } = usePagination(filteredData, 10, [searchJabatan, searchLokasi, searchPengadaan, searchKebutuhan]);

  const openModal = useCallback((formasi: FormasiData) => {
    setSelectedPersyaratan(formasi.persyaratan);
    setModalTitle(`Persyaratan: ${formasi.nama_jabatan}`);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedPersyaratan(null);
  }, []);

  // Force default tab selection
  useEffect(() => {
    if (!searchPengadaan) {
      setSearchPengadaan(DEFAULT_PENGADAAN);
    }
  }, [searchPengadaan, setSearchPengadaan]);

  return (
    <div className="table-container">
      <FilterToolbar
        searchJabatan={searchJabatan}
        setSearchJabatan={setSearchJabatan}
        searchLokasi={searchLokasi}
        setSearchLokasi={setSearchLokasi}
        searchPengadaan={searchPengadaan}
        setSearchPengadaan={setSearchPengadaan}
        searchKebutuhan={searchKebutuhan}
        setSearchKebutuhan={setSearchKebutuhan}
        jabatanOptions={jabatanOptions}
        lokasiOptions={lokasiOptions}
        totalKuota={totalKuota}
        filteredCount={filteredData.length}
        hasAnyFilter={hasAnyFilter}
        resetFilters={resetFilters}
        showKebutuhanFilter
      />

      <div className="table-wrapper desktop-table-wrapper">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Nama Jabatan</th>
              <th>Lokasi</th>
              <th>Jenis Pengadaan</th>
              <th>Jenis Formasi</th>
              <th className="text-center">Kebutuhan</th>
              <th className="text-center">Usia</th>
              <th className="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <tr key={item.id}>
                  <td className="font-medium">{item.nama_jabatan}</td>
                  <td>{item.lokasi_formasi}</td>
                  <td><Badge>{item.jenis_pengadaan}</Badge></td>
                  <td><Badge variant="success">{item.jenis_formasi}</Badge></td>
                  <td className="text-center">{item.jumlah}</td>
                  <td className="text-center">{item.usia_min} - {item.usia_max} Thn</td>
                  <td className="text-center">
                    <button className="action-btn" onClick={() => openModal(item)}>
                      Lihat Syarat
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center empty-state">
                  Data tidak ditemukan berdasarkan filter yang dipilih.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mobile-cards-wrapper">
        {currentData.length > 0 ? (
          currentData.map((item) => (
            <div className="mobile-formasi-card" key={`mobile-${item.id}`}>
              <div className="mfc-row-1">
                <div className="mfc-jabatan">{item.nama_jabatan}</div>
                <div className="mfc-chips">
                  <Badge>{item.jenis_pengadaan}</Badge>
                  <Badge variant="success">{item.jenis_formasi}</Badge>
                </div>
              </div>
              <div className="mfc-row-2">
                <div className="mfc-lokasi">{item.lokasi_formasi}</div>
                <div className="mfc-details">
                  Kebutuhan: <strong>{item.jumlah} Orang</strong> &bull; Usia: <strong>{item.usia_min}-{item.usia_max} Thn</strong>
                </div>
              </div>
              <div className="mfc-row-3">
                <button className="action-btn mfc-action-btn" onClick={() => openModal(item)}>
                  Lihat Syarat
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center empty-state" style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px' }}>
            Data tidak ditemukan berdasarkan filter yang dipilih.
          </div>
        )}
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredData.length}
        itemsPerPage={10}
        onNext={nextPage}
        onPrev={prevPage}
      />

      <Modal isOpen={selectedPersyaratan !== null} onClose={closeModal} title={modalTitle}>
        <ul className="requirements-list">
          {selectedPersyaratan?.map((req) => (
            <li key={req.id}>
              <span className="req-status">{req.mandatory === 1 ? 'Wajib' : 'Opsional'}</span>
              <p>{req.nama}</p>
            </li>
          ))}
          {selectedPersyaratan?.length === 0 && (
            <p className="text-muted text-center">Tidak ada persyaratan khusus.</p>
          )}
        </ul>
      </Modal>
    </div>
  );
};

export default FormasiTable;
