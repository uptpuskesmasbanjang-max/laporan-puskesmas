'use client';

import { useState } from 'react';
import { NAMA_BULAN } from '@/lib/constants';

// endpoint: '/api/sasaran' atau '/api/capaian'
// row: { program_id, program_nama, tahun, bulan, sasaran|capaian, keterangan }
export default function DataFormModal({ endpoint, label, row, onClose, onSaved }) {
  const [nilai, setNilai] = useState(row.nilaiAwal ?? 0);
  const [keterangan, setKeterangan] = useState(row.keterangan ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function simpan() {
    setSaving(true);
    setError('');
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        program_id: row.program_id,
        tahun: row.tahun,
        bulan: row.bulan,
        nilai: Number(nilai),
        keterangan,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || 'Gagal menyimpan data');
      return;
    }
    onSaved();
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
      <div className="card w-full max-w-md p-6">
        <h3 className="font-display font-bold text-lg text-slate-800">
          {label} — {row.program_nama}
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          {NAMA_BULAN[row.bulan - 1]} {row.tahun}
        </p>

        <label className="text-xs font-semibold text-slate-500">Nilai {label.toLowerCase()}</label>
        <input
          type="number"
          className="input-field w-full mt-1 mb-3"
          value={nilai}
          onChange={(e) => setNilai(e.target.value)}
          min={0}
        />

        <label className="text-xs font-semibold text-slate-500">Keterangan (opsional)</label>
        <textarea
          className="input-field w-full mt-1 mb-3"
          rows={2}
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
        />

        {error && <p className="text-sm text-rose-600 mb-3">{error}</p>}

        <div className="flex justify-end gap-2">
          <button className="btn-secondary" onClick={onClose} disabled={saving}>Batal</button>
          <button className="btn-primary" onClick={simpan} disabled={saving}>
            {saving ? 'Menyimpan…' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}
