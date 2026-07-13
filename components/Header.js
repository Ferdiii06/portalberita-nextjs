import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiMenu, FiX, FiSearch, FiBell } from 'react-icons/fi';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const menu = [
    { label: 'Beranda', href: '/' },
    { label: 'Kategori', href: '/#kategori' },
    { label: 'Arsip', href: '/arsip' },
    { label: 'Tentang', href: '/about' }
  ];

  return (
    <header className={`sticky top-0 z-50 transition duration-300 ${scrolled ? 'bg-white/95 shadow-sm backdrop-blur-xl' : 'bg-transparent'} border-b border-slate-200/80`}> 
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-3 text-xl font-black text-slate-950">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">P</span>
          <span>
            Portal <span className="text-sky-600">Berita</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-700">
          {menu.map((item) => (
            <Link key={item.href} href={item.href} className={`transition duration-200 hover:text-slate-950 ${router.pathname === item.href ? 'text-sky-600' : ''}`}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:text-slate-950">
            <FiSearch size={18} />
          </button>
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-600 text-white transition hover:bg-sky-700">
            <FiBell size={18} />
          </button>
        </div>

        <div ref={ref} className="relative md:hidden">
          <button onClick={() => setOpen((o) => !o)} className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:text-slate-950" aria-label="Menu">
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-64 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl">
              <div className="space-y-3">
                {menu.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-100">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
