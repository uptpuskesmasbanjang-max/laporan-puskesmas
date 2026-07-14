'use client';

import { useState } from 'react';

export default function ChangePasswordForm() {
  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasi, setKonfirmasi] = useState('');
  const [error, setError] = useState('');
  const [sukses, setSukses] = useState('');
  const [saving, setSaving] = useState(false);

  async function simpan(e) {
    e.preventDefault();
    setError('');
    setSukses('');
    if (passwordBaru !== konfirmasi) {
      setError('Konfirmasi password baru tidak sama');
      return;
    }
    setSaving(true);
    const res = await fetch('/api/account/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passwordLama, passwordBaru }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || 'Gagal mengubah password');
      return;
    }
    setSukses('Password berhasil diubah');
    setPasswordLama('');
    setPasswordBaru('');
    setKonfirmasi('');
  }

  return (
    <form onSubmit={simpan} className="card p-4 flex flex-col gap-2">
      <h4 className="font-display font-bold text-sm text-slate-800">Ganti password</h4>
      <input
        type="password"
        placeholder="Password lama"
        className="input-field"
        value={passwordLama}
        onChange={(e) => setPasswordLama(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password baru (minimal 6 karakter)"
        className="input-field"
        value={passwordBaru}
        onChange={(e) => setPasswordBaru(e.target.value)}
        required
        minLength={6}
      />
      <input
        type="password"
        placeholder="Ulangi password baru"
        className="input-field"
        value={konfirmasi}
        onChange={(e) => setKonfirmasi(e.target.value)}
        required
      />
      {error && <p className="text-sm text-rose-600">{error}</p>}
      {sukses && <p className="text-sm text-teal-700">{sukses}</p>}
      <button className="btn-secondary" disabled={saving}>
        {saving ? 'Menyimpan…' : 'Simpan password baru'}
      </button>
    </form>
  );
}
