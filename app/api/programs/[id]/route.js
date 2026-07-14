import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// PUT: ubah data program - hanya super admin
export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'superadmin') {
    return NextResponse.json({ error: 'Tidak diizinkan' }, { status: 403 });
  }

  const body = await req.json();
  const { nama, satuan, urutan } = body;

  await db().execute({
    sql: 'UPDATE programs SET nama = ?, satuan = ?, urutan = ? WHERE id = ?',
    args: [nama, satuan || 'orang', urutan || 0, params.id],
  });
  return NextResponse.json({ ok: true });
}

// DELETE: hapus program - hanya super admin
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'superadmin') {
    return NextResponse.json({ error: 'Tidak diizinkan' }, { status: 403 });
  }

  await db().execute({ sql: 'DELETE FROM programs WHERE id = ?', args: [params.id] });
  return NextResponse.json({ ok: true });
}
