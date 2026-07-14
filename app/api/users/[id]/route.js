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

// PUT: super admin reset password pengguna lain (tanpa perlu tahu password lama)
export async function PUT(req, { params }) {
  const session = await requireSuperadmin();
  if (!session) return NextResponse.json({ error: 'Tidak diizinkan' }, { status: 403 });

  const { password } = await req.json();
  if (!password || password.length < 6) {
    return NextResponse.json({ error: 'Password baru minimal 6 karakter' }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 10);
  await db().execute({
    sql: 'UPDATE users SET password_hash = ? WHERE id = ?',
    args: [hash, params.id],
  });
  return NextResponse.json({ ok: true });
}

// DELETE: hapus akun pengguna - hanya super admin, tidak bisa hapus akun sendiri yang aktif
export async function DELETE(req, { params }) {
  const session = await requireSuperadmin();
  if (!session) return NextResponse.json({ error: 'Tidak diizinkan' }, { status: 403 });

  if (String(session.user.id) === String(params.id)) {
    return NextResponse.json(
      { error: 'Tidak bisa menghapus akun sendiri yang sedang aktif' },
      { status: 400 }
    );
  }

  await db().execute({ sql: 'DELETE FROM users WHERE id = ?', args: [params.id] });
  return NextResponse.json({ ok: true });
}
