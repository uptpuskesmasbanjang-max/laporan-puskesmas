# Laporan Capaian Program Puskesmas

Aplikasi web untuk mencatat **sasaran/target** dan **capaian** bulanan program
Puskesmas (Imunisasi, Ibu Hamil dan Ibu Bersalin, Bayi dan Balita, Kesehatan
Jiwa, dll), terpadu satu pintu untuk internal Puskesmas dan lintas sektor
kecamatan.

## Fitur

- **Tab Sasaran/Target** — lihat target tiap program per bulan/tahun, dalam
  bentuk tabel dan grafik. Filter tahun, bulan, dan program.
- **Tab Capaian** — sama seperti di atas, untuk data realisasi/capaian.
  Termasuk perbandingan **per bulan** (tren dalam satu tahun) dan
  **per tahun** (tren antar tahun).
- **Tab Login** — login untuk pemegang program, plus:
  - **Ganti password sendiri** — setiap pengguna yang login bisa mengganti
    passwordnya sendiri (wajib masukkan password lama).
  - **Kelola pengguna** (khusus super admin) — tambah akun pemegang
    program baru langsung dari aplikasi (tanpa perlu buka database),
    reset password pengguna lain, dan hapus akun.
- **Super admin**: mengelola daftar program (tambah/hapus), mengelola
  akun pengguna, dan bisa mengubah data sasaran & capaian program apa pun.
- **Pemegang program**: hanya bisa menginput/mengubah data untuk program
  yang menjadi tanggung jawabnya.
- Publik (tanpa login) tetap bisa **melihat** semua tabel dan grafik —
  cocok untuk dipakai lintas sektor kecamatan tanpa perlu akun.

## Teknologi

- **Next.js** (App Router) — framework aplikasi web
- **Turso** (libSQL, berbasis SQLite) — database
- **NextAuth.js** — autentikasi login
- **Recharts** — grafik/chart
- **Tailwind CSS** — styling
- **GitHub + Vercel** — penyimpanan kode & hosting/deploy

---

## 1. Siapkan database di Turso

1. Buat akun di https://turso.tech (gratis untuk skala kecil).
2. Install Turso CLI:
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```
3. Login:
   ```bash
   turso auth login
   ```
4. Buat database baru:
   ```bash
   turso db create puskesmas-report
   ```
5. Ambil URL koneksi database:
   ```bash
   turso db show puskesmas-report --url
   ```
   Simpan hasilnya, contoh: `libsql://puskesmas-report-namaorg.turso.io`
6. Buat auth token:
   ```bash
   turso db tokens create puskesmas-report
   ```
   Simpan hasilnya (token panjang).
7. Terapkan skema tabel:
   ```bash
   turso db shell puskesmas-report < schema.sql
   ```
   Perintah ini otomatis membuat tabel `programs`, `users`, `sasaran`,
   `capaian`, sekaligus mengisi beberapa contoh program.

## 2. Jalankan di komputer lokal (opsional, untuk uji coba dulu)

1. Install Node.js versi 18 ke atas dari https://nodejs.org
2. Masuk ke folder project, install dependency:
   ```bash
   npm install
   ```
3. Salin `.env.example` menjadi `.env.local`, lalu isi:
   ```
   TURSO_DATABASE_URL=libsql://puskesmas-report-namaorg.turso.io
   TURSO_AUTH_TOKEN=isi-token-dari-langkah-sebelumnya
   NEXTAUTH_SECRET=hasil-dari-perintah-di-bawah
   NEXTAUTH_URL=http://localhost:3000
   ```
   Generate `NEXTAUTH_SECRET` dengan:
   ```bash
   openssl rand -base64 32
   ```
4. Buat akun awal (super admin & contoh pemegang program):
   ```bash
   npm run seed
   ```
   Ini akan menampilkan username/password login pertama. Setelah login
   pertama kali, langsung buka tab **Akun → Ganti password** untuk
   mengganti password bawaan tersebut.
5. Jalankan aplikasi:
   ```bash
   npm run dev
   ```
   Buka http://localhost:3000

## 3. Unggah kode ke GitHub

1. Buat repository baru di https://github.com/new (misalnya bernama
   `laporan-puskesmas`), biarkan kosong (jangan centang "Add README").
2. Di folder project, jalankan:
   ```bash
   git init
   git add .
   git commit -m "Inisialisasi aplikasi laporan capaian Puskesmas"
   git branch -M main
   git remote add origin https://github.com/USERNAME/laporan-puskesmas.git
   git push -u origin main
   ```
   Ganti `USERNAME` dengan username GitHub Anda.

## 4. Deploy ke Vercel

1. Buat akun di https://vercel.com (bisa langsung login pakai akun GitHub).
2. Klik **Add New → Project**, pilih repository `laporan-puskesmas` yang
   baru diunggah.
3. Saat konfigurasi project, isi **Environment Variables** dengan nilai
   yang sama seperti di `.env.local`:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` → isi dengan URL Vercel Anda nanti, contoh
     `https://laporan-puskesmas.vercel.app` (bisa diedit lagi setelah
     deploy pertama selesai dan Anda tahu URL finalnya, lalu redeploy)
4. Klik **Deploy**, tunggu proses build selesai.
5. Setelah selesai, buka URL yang diberikan Vercel — aplikasi sudah bisa
   diakses secara online.

Setiap kali Anda melakukan `git push` ke branch `main`, Vercel otomatis
build ulang dan deploy versi terbaru.

## 5. Menambah pemegang program lain

Setelah login sebagai **super admin**:

- Tambahkan **program** baru lewat menu **Kelola daftar program** di tab Akun.
- Tambahkan **akun** pemegang program baru lewat menu **Kelola pengguna**
  di tab Akun — isi nama, username, password awal, pilih peran
  "Pemegang program", lalu pilih program yang dipegang. Pengguna baru
  langsung bisa login dan mengubah password awalnya sendiri lewat form
  **Ganti password** di tab Akun.
- Super admin juga bisa **reset password** pengguna lain atau **menghapus**
  akun dari menu yang sama, kalau pengguna lupa password atau sudah tidak
  aktif.

## Struktur data

- `programs` — daftar program (nama, satuan)
- `users` — akun login (super admin & pemegang program, terhubung ke
  salah satu program)
- `sasaran` — target per program, per tahun, per bulan
- `capaian` — realisasi per program, per tahun, per bulan

## Struktur folder

```
app/
  page.js                 halaman utama (tab Sasaran/Target, Capaian, Login)
  layout.js
  api/
    auth/[...nextauth]/   endpoint login (NextAuth)
    programs/              CRUD daftar program (super admin)
    sasaran/                data sasaran/target
    capaian/                data capaian
components/                komponen tampilan (tabel, chart, form, dll)
lib/                        koneksi database, auth, helper
schema.sql                  struktur tabel database
scripts/seed.js             pembuat akun awal
```
