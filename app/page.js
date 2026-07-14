'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import TabNav from '@/components/TabNav';
import SasaranTab from '@/components/SasaranTab';
import CapaianTab from '@/components/CapaianTab';
import LoginTab from '@/components/LoginTab';
import ProgramManager from '@/components/ProgramManager';
import UserManager from '@/components/UserManager';

export default function HomePage() {
  const { data: session } = useSession();
  const [active, setActive] = useState('sasaran');
  const [subView, setSubView] = useState(null); // null | 'kelola-program' | 'kelola-pengguna'

  const tabs = [
    { key: 'sasaran', label: 'Sasaran / Target' },
    { key: 'capaian', label: 'Capaian' },
    { key: 'login', label: session ? 'Akun' : 'Login' },
  ];

  return (
    <main className="min-h-screen">
      <header className="bg-teal-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <p className="text-teal-100 text-xs font-semibold tracking-wide uppercase">Puskesmas</p>
            <h1 className="font-display font-extrabold text-xl">Laporan Capaian Program Bulanan</h1>
          </div>
          {session && (
            <div className="text-right text-sm">
              <p className="font-semibold">{session.user.name}</p>
              <p className="text-teal-100 text-xs">
                {session.user.role === 'superadmin' ? 'Super Admin' : 'Pemegang Program'}
              </p>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {subView === 'kelola-program' && (
          <ProgramManager onBack={() => setSubView(null)} />
        )}
        {subView === 'kelola-pengguna' && (
          <UserManager onBack={() => setSubView(null)} />
        )}

        {!subView && (
          <>
            <TabNav tabs={tabs} active={active} setActive={setActive} />
            {active === 'sasaran' && <SasaranTab />}
            {active === 'capaian' && <CapaianTab />}
            {active === 'login' && (
              <LoginTab
                onGotoKelolaProgram={() => setSubView('kelola-program')}
                onGotoKelolaPengguna={() => setSubView('kelola-pengguna')}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
