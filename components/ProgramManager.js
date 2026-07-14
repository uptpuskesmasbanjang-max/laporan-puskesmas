'use client';

import { useEffect, useState } from 'react';

export default function ProgramManager({ onBack }) {
  const [programs, setPrograms] = useState([]);
  const [nama, setNama] = useState('');
  const [satuan, setSatuan] = useState('orang');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function load() {
    fetch('/api/programs').then((r) => r.json()).then(setPrograms);
  }

  useEffect(load, []);

  async function tambah(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const res = await fetch('/api/programs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama, satuan, urutan: programs.length + 1 }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || 'Gagal menambah program');
      return;
    }
    setNama('');
    load();
  }

  async function hapus(id) {
    if (!confirm('Hapus program ini? Semua data sasaran & capaian terkait juga akan terhapus.')) return;
    await fetch(`/api/programs/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <button className="text-sm text-teal-700 self-start" onClick={onBack}>← Kembali</button>

      <div className="card p-6">
        <h3 className="font-display font-bold text-lg text-slate-800 mb-3">Kelola daftar program</h3>

        <form onSubmit={tambah} className="flex flex-wrap items-end gap-2 mb-4">
          <div className="flex-1 min-w-[180px]">
            <label className="text-xs font-semibold text-slate-500">Nama program baru</label>
            <input className="input-field w-full mt-1" value={nama} onChange={(e) => setNama(e.target.value)} required />
          </div>
          <div className="w-32">
            <label className="text-xs font-semibold text-slate-500">Satuan</label>
            <input className="input-field w-full mt-1" value={satuan} onChange={(e) => setSatuan(e.target.value)} />
          </div>
          <button className="btn-primary" disabled={saving}>{saving ? 'Menyimpan…' : 'Tambah'}</button>
        </form>

        {error && <p className="text-sm text-rose-600 mb-3">{error}</p>}

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="py-2">Nama program</th>
              <th className="py-2">Satuan</th>
              <th className="py-2 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((p) => (
              <tr key={p.id} className="border-b border-slate-100">
                <td className="py-2">{p.nama}</td>
                <td className="py-2 text-slate-500">{p.satuan}</td>
                <td className="py-2 text-right">
                  <button className="text-rose-600 text-xs font-semibold" onClick={() => hapus(p.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
