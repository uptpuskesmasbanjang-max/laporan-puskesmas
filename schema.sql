-- Skema database untuk Turso (libSQL / SQLite)
-- Jalankan dengan: turso db shell nama-db < schema.sql

CREATE TABLE IF NOT EXISTS programs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama TEXT NOT NULL UNIQUE,
  satuan TEXT DEFAULT 'orang',
  urutan INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  nama TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('superadmin','pemegang_program')),
  program_id INTEGER REFERENCES programs(id),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sasaran (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  program_id INTEGER NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  tahun INTEGER NOT NULL,
  bulan INTEGER NOT NULL CHECK (bulan BETWEEN 1 AND 12),
  nilai_target REAL NOT NULL DEFAULT 0,
  keterangan TEXT,
  updated_by TEXT,
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(program_id, tahun, bulan)
);

CREATE TABLE IF NOT EXISTS capaian (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  program_id INTEGER NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  tahun INTEGER NOT NULL,
  bulan INTEGER NOT NULL CHECK (bulan BETWEEN 1 AND 12),
  nilai_capaian REAL NOT NULL DEFAULT 0,
  keterangan TEXT,
  updated_by TEXT,
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(program_id, tahun, bulan)
);

-- Contoh data awal program (boleh diubah lewat menu Kelola Program sebagai super admin)
INSERT OR IGNORE INTO programs (nama, satuan, urutan) VALUES
  ('Imunisasi', 'anak', 1),
  ('Ibu Hamil dan Ibu Bersalin', 'orang', 2),
  ('Bayi dan Balita', 'anak', 3),
  ('Kesehatan Jiwa', 'orang', 4),
  ('Gizi Masyarakat', 'orang', 5),
  ('TB Paru', 'orang', 6);
