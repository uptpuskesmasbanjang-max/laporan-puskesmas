'use client';

import { useEffect, useState } from 'react';

export default function UserManager({ onBack }) {
  const [users, setUsers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [username, setUsername] = useState('');
  const [nama, setNama] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('pemegang_program');
  const [programId, setProgramId] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [resetFor, setResetFor] = useState(null);
  const [resetPassword, setResetPassword] = useState('');

  function load() {
    fetch('/api/users').then((r) => r.json()).then(setUsers);
    fetch('/api/programs').then((r) => r.json()).then(setPrograms);
  }

  useEffect(load, []);

  async function tambah(e) {
    e.preventDefault();
    setError('');
    if (role === 'pemegang_program' && !programId) {
      setError('Pilih program yang akan dipegang pengguna ini');
      return;
    }
    setSaving(true);
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, nama, role, program_id: programId || null }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || 'Gagal menambah pengguna');
      return;
    }
    setUsername('');
    setNama('');
    setPassword('');
    setProgramId('');
    setRole('pemegang_program');
    load();
  }

  async function hapus(id) {
    if (!confirm('Hapus akun pengguna ini?')) return;
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      alert(body.error || 'Gagal menghapus pengguna');
      return;
    }
    load();
  }

  async function simpanReset(id) {
    if (resetPassword.length < 6) {
      setError('Password baru minimal 6 karakter');
      return;
    }
    setError('');
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: resetPassword }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || 'Gagal mereset password');
      return;
    }
    setResetFor(null);
    setResetPassword('');
  }

  return (
    <div className="flex flex-col gap-4 max-w-3xl">
      <button className="text-sm text-teal-700 self-start" onClick={onBack}>← Kembali</button>

      <div className="card p-6">
        <h3 className="font-display font-bold text-lg text-slate-800 mb-1">Tambah pengguna</h3>
        <p className="text-sm text-slate-500 mb-4">
          Buat akun untuk pemegang program baru, atau super admin lain.
        </p>

        <form onSubmit={tambah} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs font-semibold text-slate-500">Nama lengkap</label>
            <input className="input-field w-full mt-1" value={nama} onChange={(e) => setNama(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Username</label>
            <input className="input-field w-full mt-1" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Password awal</label>
            <input
              type="password"
              className="input-field w-full mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Peran</label>
            <select className="input-field w-full mt-1" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="pemegang_program">Pemegang program</option>
              <option value="superadmin">Super admin</option>
            </select>
          </div>
          {role === 'pemegang_program' && (
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-500">Program yang dipegang</label>
              <select className="input-field w-full mt-1" value={programId} onChange={(e) => setProgramId(e.target.value)}>
                <option value="">— Pilih program —</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>{p.nama}</option>
                ))}
              </select>
            </div>
          )}
          <div className="sm:col-span-2">
            <button className="btn-primary" disabled={saving}>
              {saving ? 'Menyimpan…' : 'Tambah pengguna'}
            </button>
          </div>
        </form>

        {error && <p className="text-sm text-rose-600 mb-3">{error}</p>}

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="py-2">Nama</th>
              <th className="py-2">Username</th>
              <th className="py-2">Peran</th>
              <th className="py-2">Program</th>
              <th className="py-2 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-100 align-top">
                <td className="py-2">{u.nama}</td>
                <td className="py-2">{u.username}</td>
                <td className="py-2">{u.role === 'superadmin' ? 'Super admin' : 'Pemegang program'}</td>
                <td className="py-2 text-slate-500">{u.program_nama || '—'}</td>
                <td className="py-2 text-right">
                  {resetFor === u.id ? (
                    <div className="flex items-center gap-1 justify-end">
                      <input
                        type="password"
                        placeholder="Password baru"
                        className="input-field !py-1 text-xs w-28"
                        value={resetPassword}
                        onChange={(e) => setResetPassword(e.target.value)}
                      />
                      <button className="text-teal-700 text-xs font-semibold" onClick={() => simpanReset(u.id)}>
                        Simpan
                      </button>
                      <button
                        className="text-slate-400 text-xs"
                        onClick={() => { setResetFor(null); setResetPassword(''); }}
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3 justify-end">
                      <button className="text-teal-700 text-xs font-semibold" onClick={() => setResetFor(u.id)}>
                        Reset password
                      </button>
                      <button className="text-rose-600 text-xs font-semibold" onClick={() => hapus(u.id)}>
                        Hapus
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
