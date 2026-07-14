'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import FilterBar from './FilterBar';
import DataTable from './DataTable';
import ComparisonChart from './ComparisonChart';
import DataFormModal from './DataFormModal';
import { NAMA_BULAN, daftarTahun } from '@/lib/constants';

// title: 'Sasaran / Target' atau 'Capaian'
// endpoint: '/api/sasaran' atau '/api/capaian'
// nilaiKey: 'nilai_target' atau 'nilai_capaian'
export default function ProgramTabBase({ title, endpoint, nilaiKey, editLabel }) {
  const { data: session } = useSession();
  const [programs, setPrograms] = useState([]);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [bulan, setBulan] = useState('');
  const [programId, setProgramId] = useState('');
  const [mode, setMode] = useState('bulanan');

  const [sasaranRows, setSasaranRows] = useState([]);
  const [capaianRows, setCapaianRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState(null);

  useEffect(() => {
    fetch('/api/programs').then((r) => r.json()).then(setPrograms);
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const params = new URLSearchParams();
      if (programId) params.set('program_id', programId);

      if (mode === 'bulanan') {
        params.set('tahun', tahun);
        if (bulan) params.set('bulan', bulan);
      } else {
        const tahunList = daftarTahun(6);
        params.set('tahun_dari', Math.min(...tahunList));
        params.set('tahun_sampai', Math.max(...tahunList));
      }

      const [sRes, cRes] = await Promise.all([
        fetch(`/api/sasaran?${params.toString()}`).then((r) => r.json()),
        fetch(`/api/capaian?${params.toString()}`).then((r) => r.json()),
      ]);
      setSasaranRows(sRes);
      setCapaianRows(cRes);
      setLoading(false);
    }
    load();
  }, [tahun, bulan, programId, mode]);

  // Gabungkan sasaran & capaian jadi satu baris per (program, bulan) atau per (program, tahun)
  const gabungan = useMemo(() => {
    const key = mode === 'bulanan' ? (r) => `${r.program_id}-${r.bulan}` : (r) => `${r.program_id}-${r.tahun}`;
    const map = new Map();

    for (const r of sasaranRows) {
      const k = key(r);
      map.set(k, {
        program_id: r.program_id, program_nama: r.program_nama,
        bulan: r.bulan, tahun: r.tahun, sasaran: 0, capaian: 0,
      });
    }
    for (const r of sasaranRows) {
      const k = key(r);
      const item = map.get(k);
      item.sasaran += r.nilai_target;
    }
    for (const r of capaianRows) {
      const k = key(r);
      if (!map.has(k)) {
        map.set(k, {
          program_id: r.program_id, program_nama: r.program_nama,
          bulan: r.bulan, tahun: r.tahun, sasaran: 0, capaian: 0,
        });
      }
      map.get(k).capaian += r.nilai_capaian;
    }

    let rows = Array.from(map.values());

    if (mode === 'tahunan') {
      // Tetap ditampilkan per program (tidak digabung jadi satu baris),
      // diurutkan per program lalu per tahun supaya tren tiap program terlihat berurutan
      rows.sort((a, b) => a.program_nama.localeCompare(b.program_nama) || a.tahun - b.tahun);
    } else {
      rows.sort((a, b) => a.program_nama.localeCompare(b.program_nama) || a.bulan - b.bulan);
    }

    return rows;
  }, [sasaranRows, capaianRows, mode]);

  const chartData = useMemo(() => {
    if (mode === 'tahunan') {
      return gabungan.map((r) => ({ label: String(r.tahun), sasaran: r.sasaran, capaian: r.capaian }));
    }
    // bulanan: kalau bulan spesifik dipilih, chart tetap tampilkan 12 bulan agar tren terlihat
    const perBulan = new Map();
    for (let b = 1; b <= 12; b++) perBulan.set(b, { label: NAMA_BULAN[b - 1], sasaran: 0, capaian: 0 });
    for (const r of sasaranRows) {
      perBulan.get(r.bulan).sasaran += r.nilai_target;
    }
    for (const r of capaianRows) {
      perBulan.get(r.bulan).capaian += r.nilai_capaian;
    }
    return Array.from(perBulan.values());
  }, [gabungan, mode, sasaranRows, capaianRows]);

  function canEdit(pid) {
    if (!session) return false;
    if (session.user.role === 'superadmin') return true;
    return session.user.role === 'pemegang_program' && Number(session.user.programId) === Number(pid);
  }

  function handleEdit(row) {
    const nilaiAwal = nilaiKey === 'nilai_target' ? row.sasaran : row.capaian;
    setEditRow({ ...row, nilaiAwal });
  }

  async function refreshAfterSave() {
    setEditRow(null);
    // trigger reload
    setBulan((b) => b);
    const params = new URLSearchParams();
    if (programId) params.set('program_id', programId);
    if (mode === 'bulanan') {
      params.set('tahun', tahun);
      if (bulan) params.set('bulan', bulan);
    } else {
      const tahunList = daftarTahun(6);
      params.set('tahun_dari', Math.min(...tahunList));
      params.set('tahun_sampai', Math.max(...tahunList));
    }
    const [sRes, cRes] = await Promise.all([
      fetch(`/api/sasaran?${params.toString()}`).then((r) => r.json()),
      fetch(`/api/capaian?${params.toString()}`).then((r) => r.json()),
    ]);
    setSasaranRows(sRes);
    setCapaianRows(cRes);
  }

  return (
    <div className="flex flex-col gap-4">
      <FilterBar
        programs={programs}
        tahun={tahun} setTahun={setTahun}
        bulan={bulan} setBulan={setBulan}
        programId={programId} setProgramId={setProgramId}
        mode={mode} setMode={setMode}
      />

      <ComparisonChart
        data={chartData}
        title={mode === 'bulanan' ? `Perbandingan bulanan — ${tahun}` : 'Perbandingan antar tahun'}
      />

      {loading ? (
        <div className="card p-8 text-center text-slate-500">Memuat data…</div>
      ) : (
        <DataTable
          rows={gabungan}
          showBulanKolom={mode === 'bulanan'}
          canEdit={mode === 'bulanan' ? canEdit : null}
          onEdit={handleEdit}
        />
      )}

      {editRow && (
        <DataFormModal
          endpoint={endpoint}
          label={editLabel}
          row={editRow}
          onClose={() => setEditRow(null)}
          onSaved={refreshAfterSave}
        />
      )}
    </div>
  );
}
