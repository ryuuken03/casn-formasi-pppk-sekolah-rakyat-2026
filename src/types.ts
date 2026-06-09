export interface Persyaratan {
  id: string;
  nama: string;
  mandatory: number;
}

export interface FormasiData {
  id: string;
  instansi: string;
  nama_jabatan: string;
  lokasi_formasi: string;
  jenis_pengadaan: string;
  jenis_formasi: string;
  jumlah: number;
  usia_min: number;
  usia_max: number;
  persyaratan: Persyaratan[];
}

export interface InitialFilters {
  jabatan?: string;
  lokasi?: string;
  pengadaan?: string;
  formasi?: string;
}

export interface RawDataJson {
  data: FormasiData[];
}

export const TOGGLE_PENGADAAN_OPTIONS = [
  { label: 'PPPK Guru', value: 'PPPK Guru' },
  { label: 'PPPK Teknis', value: 'PPPK Teknis' },
] as const;

export const DEFAULT_PENGADAAN = 'PPPK Guru';

export const JAKARTA_CITIES = [
  'jakarta selatan',
  'jakarta timur',
  'jakarta pusat',
  'jakarta barat',
  'jakarta utara',
  'kepulauan seribu',
] as const;
