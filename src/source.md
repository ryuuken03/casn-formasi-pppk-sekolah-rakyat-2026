# Analisis API Rekrutmen

**Endpoint:** `https://api-rekrutmen.bkn.go.id/portal/api/spf`
**Method:** `GET`
**Response Type:** `JSON`

## Struktur Response
API mengembalikan objek JSON dengan struktur utama sebagai berikut:

- `status` (Integer): Status HTTP dari response (misal: 200).
- `error` (Boolean): Status error, `false` jika berhasil.
- `message` (String): Pesan hasil request, misal "success".
- `data` (Array of Object): Kumpulan data formasi yang tersedia.

## Struktur Data (`data`)
Setiap elemen di dalam array `data` memiliki atribut berikut:

- `id` (String): UUID dari formasi.
- `nama_event` (String): Nama event (misal: "Seleksi CASN Sekolah Rakyat 2026").
- `instansi` (String): Nama instansi penyelenggara (misal: "Kementerian Sosial").
- `jenis_pengadaan` (String): Jenis pengadaan formasi (misal: "PPPK Guru").
- `jenis_formasi` (String): Jenis formasi (misal: "UMUM").
- `periode` (Integer): Periode formasi.
- `jabatan_kode` (String): Kode jabatan.
- `nama_jabatan` (String): Nama jabatan yang ditawarkan.
- `group_pendidikan` (String/Null): Grup jenjang pendidikan.
- `nama_pendidikan` (String/Null): Nama jurusan/pendidikan.
- `lokasi_formasi` (String): Lokasi penempatan formasi.
- `is_disabilitas` (String): Flag apakah formasi ditujukan untuk disabilitas ("1" atau "0").
- `jumlah` (Integer): Jumlah kuota/posisi yang tersedia.
- `usia_min` (Integer): Syarat usia minimal pelamar.
- `usia_max` (Integer): Syarat usia maksimal pelamar.
- `jobdesc` (String/Null): Deskripsi pekerjaan.
- `penghasilan_min` (String/Null): Rentang gaji minimal.
- `penghasilan_max` (String/Null): Rentang gaji maksimal.
- `persyaratan` (Array of Object): Kumpulan persyaratan berkas/administrasi, dengan setiap objek berisi:
  - `id` (String): UUID persyaratan.
  - `nama` (String): Deskripsi/nama persyaratan.
  - `mandatory` (Integer): Apakah wajib dipenuhi (`1` berarti wajib).
