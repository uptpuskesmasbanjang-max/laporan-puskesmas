import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// table: 'sasaran' | 'capaian', kolomNilai: 'nilai_target' | 'nilai_capaian'
export function buatHandler(table, kolomNilai) {
  async function GET(req) {
    const { searchParams } = new URL(req.url);
    const tahun = searchParams.get('tahun');
    const tahunDari = searchParams.get('tahun_dari'); // untuk perbandingan antar tahun
    const tahunSampai = searchParams.get('tahun_sampai');
    const bulan = searchParams.get('bulan'); // opsional, kosong = semua bulan tahun itu
    const programId = searchParams.get('program_id'); // opsional

    let sql = `SELECT d.*, p.nama AS program_nama, p.satuan AS program_satuan
               FROM ${table} d JOIN programs p ON p.id = d.program_id WHERE `;
    const args = [];

    if (tahunDari && tahunSampai) {
      sql += 'd.tahun BETWEEN ? AND ?';
      args.push(Number(tahunDari), Number(tahunSampai));
    } else {
      sql += 'd.tahun = ?';
      args.push(Number(tahun));
    }

    if (bulan) {
      sql += ' AND d.bulan = ?';
      args.push(Number(bulan));
    }
    if (programId) {
      sql += ' AND d.program_id = ?';
      args.push(Number(programId));
    }
    sql += ' ORDER BY p.urutan ASC, d.bulan ASC';

    const result = await db().execute({ sql, args });
    return NextResponse.json(result.rows);
  }

  async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 });
    }

    const body = await req.json();
    const { program_id, tahun, bulan, nilai, keterangan } = body;

    if (!program_id || !tahun || !bulan) {
      return NextResponse.json({ error: 'Program, tahun, dan bulan wajib diisi' }, { status: 400 });
    }

    const isSuperadmin = session.user.role === 'superadmin';
    const isPemilikProgram =
      session.user.role === 'pemegang_program' && Number(session.user.programId) === Number(program_id);

    if (!isSuperadmin && !isPemilikProgram) {
      return NextResponse.json(
        { error: 'Anda hanya bisa mengubah data program yang Anda pegang' },
        { status: 403 }
      );
    }

    await db().execute({
      sql: `INSERT INTO ${table} (program_id, tahun, bulan, ${kolomNilai}, keterangan, updated_by)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(program_id, tahun, bulan)
            DO UPDATE SET ${kolomNilai} = excluded.${kolomNilai},
                          keterangan = excluded.keterangan,
                          updated_by = excluded.updated_by,
                          updated_at = datetime('now')`,
      args: [program_id, tahun, bulan, nilai || 0, keterangan || null, session.user.username],
    });

    return NextResponse.json({ ok: true });
  }

  return { GET, POST };
}
