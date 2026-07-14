export const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export function daftarTahun(rentang = 5) {
  const now = new Date().getFullYear();
  const tahun = [];
  for (let i = 0; i < rentang; i++) tahun.push(now - i);
  return tahun;
}

export function persen(capaian, target) {
  if (!target || target <= 0) return 0;
  return Math.round((capaian / target) * 1000) / 10;
}

export function statusPersen(p) {
  if (p >= 100) return { label: 'Tercapai', color: 'bg-teal-600 text-white' };
  if (p >= 75) return { label: 'Mendekati', color: 'bg-amber-500 text-white' };
  return { label: 'Belum tercapai', color: 'bg-rose-500 text-white' };
}
