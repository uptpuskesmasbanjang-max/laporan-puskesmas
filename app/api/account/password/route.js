import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// PUT: ganti password akun sendiri (wajib tahu password lama)
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 });
  }

  const { passwordLama, passwordBaru } = await req.json();
  if (!passwordLama || !passwordBaru) {
    return NextResponse.json({ error: 'Password lama dan baru wajib diisi' }, { status: 400 });
  }
  if (passwordBaru.length < 6) {
    return NextResponse.json({ error: 'Password baru minimal 6 karakter' }, { status: 400 });
  }

  const result = await db().execute({
    sql: 'SELECT * FROM users WHERE username = ?',
    args: [session.user.username],
  });
  const user = result.rows[0];
  if (!user) {
    return NextResponse.json({ error: 'Akun tidak ditemukan' }, { status: 404 });
  }

  const valid = await bcrypt.compare(passwordLama, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: 'Password lama salah' }, { status: 400 });
  }

  const hash = await bcrypt.hash(passwordBaru, 10);
  await db().execute({
    sql: 'UPDATE users SET password_hash = ? WHERE id = ?',
    args: [hash, user.id],
  });

  return NextResponse.json({ ok: true });
}
