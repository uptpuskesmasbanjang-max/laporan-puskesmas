import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET: daftar program - bisa diakses siapa saja (untuk filter di tab publik)
export async function GET() {
  const result = await db().execute(
    'SELECT * FROM programs ORDER BY urutan ASC, nama ASC'
  );
  return NextResponse.json(result.rows);
}

// POST: tambah program baru - hanya super admin
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'superadmin') {
    return NextResponse.json({ error: 'Tidak diizinkan' }, { status: 403 });
  }

  const body = await req.json();
  const { nama, satuan, urutan } = body;
  if (!nama || !nama.trim()) {
    return NextResponse.json({ error: 'Nama program wajib diisi' }, { status: 400 });
  }

  try {
    const result = await db().execute({
      sql: 'INSERT INTO programs (nama, satuan, urutan) VALUES (?, ?, ?)',
      args: [nama.trim(), satuan || 'orang', urutan || 0],
    });
    return NextResponse.json({ id: Number(result.lastInsertRowid) }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Nama program sudah ada' }, { status: 409 });
  }
}
