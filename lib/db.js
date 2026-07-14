import { createClient } from '@libsql/client';

let client;

// Satu koneksi Turso dipakai ulang selama server berjalan (hindari reconnect tiap request)
export function db() {
  if (!client) {
    if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
      throw new Error(
        'TURSO_DATABASE_URL dan TURSO_AUTH_TOKEN belum diatur. Cek file .env.local'
      );
    }
    client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return client;
}
