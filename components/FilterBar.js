'use client';

import { NAMA_BULAN, daftarTahun } from '@/lib/constants';

export default function FilterBar({
  programs,
  tahun, setTahun,
  bulan, setBulan,
  programId, setProgramId,
  mode, setMode, // 'bulanan' | 'tahunan'
}) {
  return (
    <div className="card p-4 flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-500">Tampilan</label>
        <div className="flex rounded-lg border border-slate-300 overflow-hidden text-sm">
          <button
            onClick={() => setMode('bulanan')}
            className={`px-3 py-1.5 ${mode === 'bulanan' ? 'bg-teal-700 text-white' : 'bg-white text-slate-600'}`}
          >
            Per bulan
          </button>
          <button
            onClick={() => setMode('tahunan')}
            className={`px-3 py-1.5 ${mode === 'tahunan' ? 'bg-teal-700 text-white' : 'bg-white text-slate-600'}`}
          >
            Per tahun
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-500">Tahun</label>
        <select className="input-field" value={tahun} onChange={(e) => setTahun(Number(e.target.value))}>
          {daftarTahun(6).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {mode === 'bulanan' && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-500">Bulan</label>
          <select
            className="input-field"
            value={bulan}
            onChange={(e) => setBulan(e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">Semua bulan</option>
            {NAMA_BULAN.map((nama, i) => (
              <option key={i} value={i + 1}>{nama}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-500">Program</label>
        <select
          className="input-field min-w-[220px]"
          value={programId}
          onChange={(e) => setProgramId(e.target.value)}
        >
          <option value="">Semua program</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>{p.nama}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
