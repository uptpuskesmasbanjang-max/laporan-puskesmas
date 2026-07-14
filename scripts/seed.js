// Script untuk membuat akun awal (super admin & contoh pemegang program).
// Jalankan setelah schema.sql diterapkan: npm run seed
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');
const bcrypt = require('bcryptjs');

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const superadminPass = await bcrypt.hash('admin123', 10);
  await client.execute({
    sql: `INSERT OR IGNORE INTO users (username, password_hash, nama, role, program_id)
          VALUES (?, ?, ?, 'superadmin', NULL)`,
    args: ['admin', superadminPass, 'Administrator Puskesmas'],
  });

  const imunisasi = await client.execute({
    sql: `SELECT id FROM programs WHERE nama = 'Imunisasi'`,
  });
  if (imunisasi.rows[0]) {
    const pass = await bcrypt.hash('imunisasi123', 10);
    await client.execute({
      sql: `INSERT OR IGNORE INTO users (username, password_hash, nama, role, program_id)
            VALUES (?, ?, ?, 'pemegang_program', ?)`,
      args: ['pj_imunisasi', pass, 'PJ Program Imunisasi', imunisasi.rows[0].id],
    });
  }

  console.log('Seeding selesai.');
  console.log('Login super admin -> username: admin / password: admin123');
  console.log('Login pemegang program -> username: pj_imunisasi / password: imunisasi123');
  console.log('SEGERA GANTI PASSWORD INI setelah login pertama.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
