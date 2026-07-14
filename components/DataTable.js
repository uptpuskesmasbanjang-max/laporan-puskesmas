'use client';

import { NAMA_BULAN, persen, statusPersen } from '@/lib/constants';

// rows: hasil gabungan sasaran+capaian per (program, bulan) atau per (program, tahun)
// periodType: 'bulan' | 'tahun' | null (null = tidak tampilkan kolom periode)
// canEdit(programId) -> boolean, onEdit(row) buka form edit
export default function DataTable({ rows, canEdit, onEdit, periodType = 'bulan' }) {
  if (!rows.length) {
    return (
      <div className="card p-8 text-center text-slate-500">
        Belum ada data untuk filter yang dipilih.
      </div>
    );
  }

  const labelKolom = periodType === 'tahun' ? 'Tahun' : periodType === 'bulan' ? 'Bulan' : null;

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-teal-50 text-teal-900 text-left">
            <th className="px-4 py-3 font-semibold">Program</th>
            {labelKolom && <th className="px-4 py-3 font-semibold">{labelKolom}</th>}
            <th className="px-4 py-3 font-semibold text-right">Sasaran</th>
            <th className="px-4 py-3 font-semibold text-right">Capaian</th>
            <th className="px-4 py-3 font-semibold text-right">%</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            {canEdit && <th className="px-4 py-3 font-semibold text-right">Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const p = persen(r.capaian, r.sasaran);
            const status = statusPersen(p);
            const editable = canEdit && canEdit(r.program_id);
            const periodValue = periodType === 'tahun' ? r.tahun : periodType === 'bulan' ? NAMA_BULAN[r.bulan - 1] : null;
            return (
              <tr key={`${r.program_id}-${r.bulan}-${r.tahun}`} className="border-t border-slate-100">
                <td className="px-4 py-3">{r.program_nama}</td>
                {labelKolom && <td className="px-4 py-3">{periodValue}</td>}
                <td className="px-4 py-3 text-right tabular-nums">{r.sasaran.toLocaleString('id-ID')}</td>
                <td className="px-4 py-3 text-right tabular-nums">{r.capaian.toLocaleString('id-ID')}</td>
                <td className="px-4 py-3 text-right tabular-nums font-semibold">{p}%</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>{status.label}</span>
                </td>
                {canEdit && (
                  <td className="px-4 py-3 text-right">
                    {editable ? (
                      <button className="btn-secondary !py-1 !px-3 text-xs" onClick={() => onEdit(r)}>
                        Input / Edit
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
