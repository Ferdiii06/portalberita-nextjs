// components/BreakingTickerMarquee.js
import { useState } from 'react';
import Link from 'next/link';
import { useNews } from '../context/NewsContext';

export default function BreakingTickerMarquee() {
  const { news } = useNews();
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  // Ambil 8 berita terbaru untuk ticker
  const tickerItems = (news && news.length > 0)
    ? news.slice(0, 8)
    : [
        { id: '1', judul: 'Memuat rangkuman berita kilat nasional...', kategori: 'Berita' },
        { id: '2', judul: 'Pemerintah dorong digitalisasi dan transparansi data publik', kategori: 'Ekonomi' },
      ];

  return (
    <div className="bg-red-700 text-white border-b border-red-800 text-xs font-sans relative z-40 overflow-hidden flex items-stretch">
      {/* Badge KILAT Sticky di Kiri */}
      <div className="bg-red-800 px-3 sm:px-4 py-2 flex items-center gap-2 font-bold tracking-widest uppercase text-[11px] shrink-0 z-10 shadow-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        <span className="hidden sm:inline">BREAKING NEWS</span>
        <span className="sm:hidden">KILAT</span>
      </div>

      {/* Marquee Ticker Track */}
      <div className="ticker-wrap flex-grow flex items-center py-1.5 cursor-pointer">
        <div className="ticker-track flex items-center gap-8">
          {/* Loop set 1 */}
          {tickerItems.map((item, idx) => (
            <Link
              key={`ticker-1-${item.id || idx}`}
              href={`/berita/${item.id}`}
              className="inline-flex items-center gap-2 text-red-50 hover:text-white hover:underline transition-colors shrink-0"
            >
              <span className="bg-red-900/80 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wider text-red-200">
                {item.kategori || 'Warta'}
              </span>
              <span className="font-medium">{item.judul}</span>
              <span className="text-red-400 font-bold ml-4">/</span>
            </Link>
          ))}

          {/* Loop set 2 (duplikasi untuk efek infinite scroll tanpa celah) */}
          {tickerItems.map((item, idx) => (
            <Link
              key={`ticker-2-${item.id || idx}`}
              href={`/berita/${item.id}`}
              className="inline-flex items-center gap-2 text-red-50 hover:text-white hover:underline transition-colors shrink-0"
            >
              <span className="bg-red-900/80 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wider text-red-200">
                {item.kategori || 'Warta'}
              </span>
              <span className="font-medium">{item.judul}</span>
              <span className="text-red-400 font-bold ml-4">/</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Tombol Tutup di Kanan */}
      <button
        onClick={() => setVisible(false)}
        className="px-3 text-red-200 hover:text-white hover:bg-red-800 transition-colors flex items-center justify-center shrink-0"
        title="Tutup Bar Kilat"
        aria-label="Tutup"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
