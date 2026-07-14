import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import Providers from '@/components/Providers';
import './globals.css';

const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700', '800'],
});
const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata = {
  title: 'Laporan Capaian Program Puskesmas',
  description: 'Sistem pelaporan sasaran dan capaian program bulanan Puskesmas, terpadu satu pintu.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable}`}>
      <body className="font-body">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
