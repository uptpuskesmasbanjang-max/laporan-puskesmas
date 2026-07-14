'use client';

import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import ChangePasswordForm from './ChangePasswordForm';

export default function LoginTab({ onGotoKelolaProgram, onGotoKelolaPengguna }) {
  const { data: session, status } = useSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', { username, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError('Username atau password salah');
    }
  }

  if (status === 'loading') {
    return <div className="card p-8 text-center text-slate-500">Memuat…</div>;
  }

  if (session) {
    return (
      <div className="flex flex-col gap-4 max-w-md">
        <div className="card p-6">
          <p className="text-sm text-slate-500">Masuk sebagai</p>
          <h3 className="font-display font-bold text-lg text-slate-800 mb-1">{session.user.name}</h3>
          <p className="text-sm text-teal-700 mb-4">
            {session.user.role === 'superadmin' ? 'Super Admin' : 'Pemegang Program'}
          </p>

          {session.user.role === 'superadmin' && (
            <div className="flex flex-col gap-2 mb-4">
              <button className="btn-secondary w-full" onClick={onGotoKelolaProgram}>
                Kelola daftar program
              </button>
              <button className="btn-secondary w-full" onClick={onGotoKelolaPengguna}>
                Kelola pengguna
              </button>
            </div>
          )}

          <p className="text-sm text-slate-600 mb-4">
            {session.user.role === 'superadmin'
              ? 'Anda dapat menambah program, menambah pengguna, dan mengubah data seluruh program.'
              : 'Anda dapat mengisi dan mengubah data sasaran & capaian untuk program yang Anda pegang, di tab Sasaran/Target dan Capaian.'}
          </p>

          <button className="btn-primary w-full" onClick={() => signOut({ redirect: false })}>
            Keluar
          </button>
        </div>

        <ChangePasswordForm />
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin} className="card p-6 max-w-sm flex flex-col gap-3">
      <h3 className="font-display font-bold text-lg text-slate-800">Login pemegang program</h3>
      <p className="text-sm text-slate-500 -mt-2">
        Untuk mengisi atau mengubah data sasaran dan capaian program.
      </p>

      <div>
        <label className="text-xs font-semibold text-slate-500">Username</label>
        <input className="input-field w-full mt-1" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500">Password</label>
        <input type="password" className="input-field w-full mt-1" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button className="btn-primary" disabled={loading}>
        {loading ? 'Memproses…' : 'Masuk'}
      </button>
    </form>
  );
}
