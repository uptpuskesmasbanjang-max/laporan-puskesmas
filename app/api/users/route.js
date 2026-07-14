import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

async function requireSuperadmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'superadmin') return null;
  return session;
}

// GET: daftar seluruh pengguna - hanya super admin
export async function GET() {
  const session = await requireSuperadmin();
  if (!session) return NextResponse.json({ error: 'Tidak diizinkan' }, { status: 403 });

  const result = await db().execute(`
    SELECT u.id, u.username, u.nama, u.role, u.program_id, p.nama AS program_nama
    FROM users u LEFT JOIN programs p ON p.id = u.program_id
    ORDER BY u.role ASC, u.nama ASC
  `);
  return NextResponse.json(result.rows);
}

// POST: tambah pengguna baru (pemegang program atau super admin lain) - hanya super admin
export async function POST(req) {
  const session = await requireSuperadmin();
  if (!session) return NextResponse.json({ error: 'Tidak diizinkan' }, { status: 403 });

  const body = await req.json();
  const { username, password, nama, role, program_id } = body;

  if (!username || !password || !nama || !role) {
    return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });
  }
  if (!['superadmin', 'pemegang_program'].includes(role)) {
    return NextResponse.json({ error: 'Peran tidak valid' }, { status: 400 });
  }
  if (role === 'pemegang_program' && !program_id) {
    return NextResponse.json(
      { error: 'Pemegang program wajib dikaitkan dengan salah satu program' },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 10);
  try {
    const result = await db().execute({
      sql: `INSERT INTO users (username, password_hash, nama, role, program_id)
            VALUES (?, ?, ?, ?, ?)`,
      args: [
        username.trim(),
        hash,
        nama.trim(),
        role,
        role === 'pemegang_program' ? program_id : null,
      ],
    });
    return NextResponse.json({ id: Number(result.lastInsertRowid) }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Username sudah dipakai' }, { status: 409 });
  }
}
