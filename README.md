# SSCASN Sekolah Rakyat 2026

Visualisasi Data Eksplorasi CASN 2026 - Alternatif PPPK Guru & Teknis Sekolah Rakyat. 
Aplikasi ini dibangun menggunakan **React**, **TypeScript**, dan **Vite** untuk menampilkan persebaran formasi PPPK dalam bentuk tabel statistik dan peta interaktif.

## Prasyarat (Prerequisites)

Pastikan Anda sudah menginstal perangkat lunak berikut di sistem Anda:
- [Node.js](https://nodejs.org/) (disarankan versi 18 LTS ke atas)
- Git (Opsional, untuk clone repository)

## 🚀 Tutorial Instalasi Pertama Kali

Ikuti langkah-langkah di bawah ini untuk menginstal dan menjalankan proyek secara lokal:

1. **Clone Repository (Jika belum)**
   Buka terminal, lalu jalankan perintah berikut untuk mengunduh kode sumber proyek:
   ```bash
   git clone https://github.com/ryuuken03/casn-formasi-pppk-sekolah-rakyat-2026.git
   cd "casn-formasi-pppk-sekolah-rakyat-2026"
   ```
   *(Atau Anda bisa mengunduh file ZIP dari repository dan mengekstraknya, lalu buka folder tersebut di terminal).*

2. **Instalasi Dependensi**
   Instal semua paket dan library yang dibutuhkan menggunakan NPM:
   ```bash
   npm install
   ```

## 🛠️ Cara Menjalankan Aplikasi (Development Mode)

Untuk menjalankan proyek pada mode pengembangan (*development mode*):

```bash
npm run dev
```

Setelah perintah berhasil dijalankan, buka browser Anda dan akses: **http://localhost:5173/**. 
Setiap kali Anda mengubah kode sumber, halaman akan dimuat ulang secara otomatis (HMR).

## 📦 Cara Build & Run (Production Mode)

Jika Anda ingin melihat versi optimasi aplikasi seperti yang akan dijalankan di server publik (*production*):

1. **Build Proyek**
   Jalankan perintah build. Vite akan memproses semua *asset* dan mengompilasi TypeScript:
   ```bash
   npm run build
   ```
   *Hasil kompilasi akan tersimpan di dalam folder `dist/`.*

2. **Preview Hasil Build**
   Untuk meninjau langsung hasil kompilasi *production* tersebut secara lokal:
   ```bash
   npm run preview
   ```
   Aplikasi siap tayang sekarang bisa diakses melalui URL *localhost* yang tampil di terminal (biasanya **http://localhost:4173/**).

## 🌐 Deployment (Vercel)

Proyek ini menggunakan standar Vite sehingga sangat mudah di-*deploy* (misalnya menggunakan Vercel):
1. Hubungkan *repository* GitHub proyek ini ke akun [Vercel](https://vercel.com/) Anda.
2. Vercel akan secara otomatis mengenali aplikasi ini sebagai *Vite project*.
3. Pengaturan *Build Command* (`npm run build`) dan *Output Directory* (`dist`) akan diisi secara otomatis.
4. Klik **Deploy** dan aplikasi Anda akan *live*!

---

### Teknologi Utama yang Digunakan
- **Vite** - *Build tool* generasi baru yang sangat cepat
- **React 19 + TypeScript** - Pembuatan antarmuka pengguna dengan *type-safety*
- **React Leaflet** - Menampilkan peta interaktif (geospasial)
- **Vanilla CSS** - *Styling* khusus dengan *Modern CSS Variables* dan Tema Dinamis (Gelap/Terang)
