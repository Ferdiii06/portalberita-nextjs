// components/MicroDataBar.js
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MicroDataBar() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-neutral-900 text-neutral-300 border-b border-neutral-800 text-[11px] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap justify-between items-center gap-y-1">
        {/* Left: Kalender & Cuaca */}
        <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
          <div className="flex items-center gap-1.5 font-medium text-white tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{mounted ? currentTime : 'Memuat tanggal...'}</span>
            <span className="text-neutral-500 font-normal hidden md:inline">• Pon, 11 Rabiul Awal 1448 H</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-neutral-400 border-l border-neutral-800 pl-4">
            <span className="text-amber-400">⛅</span>
            <span>Jakarta <strong className="text-white font-semibold">31°C</strong> Cerah Berawan</span>
          </div>
        </div>

        {/* Right: Bursa & Kurs Keuangan */}
        <div className="flex items-center gap-4 text-[10px] sm:text-[11px] overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400 font-semibold uppercase tracking-wider">IHSG</span>
            <span className="text-emerald-400 font-mono font-medium">7.785,20</span>
            <span className="text-emerald-400 font-mono text-[9px]">▲ +0,42%</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 border-l border-neutral-800 pl-3">
            <span className="text-neutral-400 font-semibold uppercase tracking-wider">USD/IDR</span>
            <span className="text-rose-400 font-mono font-medium">16.240</span>
            <span className="text-rose-400 font-mono text-[9px]">▼ -0,15%</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 border-l border-neutral-800 pl-3">
            <span className="text-neutral-400 font-semibold uppercase tracking-wider">EUR/IDR</span>
            <span className="text-emerald-400 font-mono font-medium">17.650</span>
            <span className="text-emerald-400 font-mono text-[9px]">▲ +0,08%</span>
          </div>

          <div className="hidden xl:flex items-center gap-1.5 border-l border-neutral-800 pl-3">
            <span className="text-neutral-400 font-semibold uppercase tracking-wider">Emas</span>
            <span className="text-amber-300 font-mono font-medium">Rp1.420.000/g</span>
          </div>

          <div className="border-l border-neutral-800 pl-3 hidden lg:flex gap-3 text-neutral-400">
            <Link href="/about" className="hover:text-white transition-colors">Redaksi</Link>
            <Link href="/arsip" className="hover:text-white transition-colors">Arsip</Link>
            <Link href="/data-publik" className="hover:text-white transition-colors flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-ping"></span>
              <span className="font-semibold text-white">Data Publik</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
