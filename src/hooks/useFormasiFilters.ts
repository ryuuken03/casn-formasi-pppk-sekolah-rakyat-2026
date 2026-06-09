import { useState, useMemo, useEffect, useCallback } from 'react';
import type { FormasiData, InitialFilters } from '../types';

export type { FormasiData };

export function useFormasiFilters(data: FormasiData[], externalFilterTrigger?: { filters: InitialFilters, ts: number } | null) {
  const [searchJabatan, setSearchJabatan] = useState<string>('');
  const [searchLokasi, setSearchLokasi] = useState<string>('');
  const [searchPengadaan, setSearchPengadaan] = useState<string>('');
  const [searchKebutuhan, setSearchKebutuhan] = useState<number | ''>('');

  useEffect(() => {
    if (externalFilterTrigger) {
      const f = externalFilterTrigger.filters;
      setSearchJabatan(f.jabatan || '');
      setSearchLokasi(f.lokasi || '');
      setSearchPengadaan(f.pengadaan || '');
      setSearchKebutuhan('');
    }
  }, [externalFilterTrigger]);

  const jabatanOptions = useMemo(() => {
    const validData = searchPengadaan ? data.filter(d => d.jenis_pengadaan === searchPengadaan) : data;
    const unique = new Set(validData.map(item => item.nama_jabatan));
    return Array.from(unique).sort();
  }, [data, searchPengadaan]);

  const lokasiOptions = useMemo(() => {
    const validData = searchPengadaan ? data.filter(d => d.jenis_pengadaan === searchPengadaan) : data;
    const unique = new Set(validData.map(item => item.lokasi_formasi));
    return Array.from(unique).sort();
  }, [data, searchPengadaan]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchJabatan = searchJabatan === '' || item.nama_jabatan === searchJabatan;
      const matchLokasi = searchLokasi === '' || item.lokasi_formasi === searchLokasi;
      const matchPengadaan = searchPengadaan === '' || item.jenis_pengadaan === searchPengadaan;
      const matchKebutuhan = searchKebutuhan === '' || item.jumlah >= searchKebutuhan;
      return matchJabatan && matchLokasi && matchPengadaan && matchKebutuhan;
    });
  }, [data, searchJabatan, searchLokasi, searchPengadaan, searchKebutuhan]);

  const totalKuota = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.jumlah, 0);
  }, [filteredData]);

  const resetFilters = useCallback(() => {
    setSearchJabatan('');
    setSearchLokasi('');
    setSearchPengadaan('');
    setSearchKebutuhan('');
  }, []);

  const hasAnyFilter = useMemo(
    () => searchJabatan !== '' || searchLokasi !== '' || searchPengadaan !== '' || searchKebutuhan !== '',
    [searchJabatan, searchLokasi, searchPengadaan, searchKebutuhan]
  );

  return {
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
  };
}
