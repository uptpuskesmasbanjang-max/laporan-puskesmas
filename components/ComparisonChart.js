'use client';

import {
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';

// data: [{ label: 'Jan', sasaran: 100, capaian: 80 }, ...]
export default function ComparisonChart({ data, title }) {
  return (
    <div className="card p-4">
      <h3 className="font-display font-bold text-slate-800 mb-3">{title}</h3>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#475569' }} />
          <YAxis tick={{ fontSize: 12, fill: '#475569' }} />
          <Tooltip
            contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="sasaran" name="Sasaran" fill="#99d5c9" radius={[6, 6, 0, 0]} barSize={28} />
          <Bar dataKey="capaian" name="Capaian" fill="#0f766e" radius={[6, 6, 0, 0]} barSize={28} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
