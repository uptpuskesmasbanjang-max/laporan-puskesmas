'use client';

export default function TabNav({ tabs, active, setActive }) {
  return (
    <nav className="flex gap-1 border-b border-slate-200 mb-6">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => setActive(t.key)}
          className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors
            ${active === t.key
              ? 'bg-white text-teal-700 border border-slate-200 border-b-white -mb-px'
              : 'text-slate-500 hover:text-teal-700'}`}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
