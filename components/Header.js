import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useNews } from '../context/NewsContext';

const CATEGORIES = [
  { id: 'semua', label: 'Terbaru' },
  { id: 'Berita', label: 'Berita Utama' },
  { id: 'Teknologi', label: 'Teknologi' },
  { id: 'Olahraga', label: 'Olahraga' },
  { id: 'Ekonomi', label: 'Ekonomi' },
  { id: 'Hiburan', label: 'Hiburan' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === '/' && typeof router.query.search === 'string') {
      setSearchQuery(router.query.search);
    }
  }, [router.pathname, router.query.search]);

  useEffect(() => {
    setOpen(false);
  }, [router.pathname, router.query.kategori]);

  const activeCategory =
    typeof router.query.kategori === 'string' && CATEGORIES.some((c) => c.id === router.query.kategori)
      ? router.query.kategori
      : 'semua';

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    router.push({ pathname: '/', query: query ? { search: query } : {} });
    setOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top utility bar */}
      <div className="hidden sm:block border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center text-[11px] font-medium text-gray-500 uppercase tracking-widest">
          <div>{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-gray-900 transition-colors">Tentang Redaksi</Link>
            <Link href="/arsip" className="hover:text-gray-900 transition-colors">Arsip Digital</Link>
          </div>
        </div>
      </div>

      {/* Main header (Logo & Search) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <Link href="/" className="flex flex-col items-center md:items-start">
          <div className="text-4xl lg:text-5xl font-serif font-black tracking-tight text-gray-900">
            INSIGHT<span className="font-light italic text-gray-400">BERITA</span>
          </div>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex w-full max-w-sm">
          <form onSubmit={handleSearch} className="w-full flex items-center border-b border-gray-300 pb-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Telusuri artikel..."
              className="w-full bg-transparent border-none text-sm focus:outline-none text-gray-900 placeholder-gray-400 font-serif italic"
            />
            <button type="submit" className="text-gray-400 hover:text-gray-900 transition-colors p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden absolute right-4 top-8">
          <button onClick={() => setOpen(!open)} className="text-gray-900 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-100">
          <ul className="flex justify-center space-x-12 py-4">
            {CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={cat.id === 'semua' ? '/' : `/?kategori=${cat.id}`}
                  className={`text-sm font-semibold tracking-wide transition-colors ${
                    activeCategory === cat.id 
                      ? 'text-gray-900 border-b-2 border-gray-900 pb-1' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg">
          <div className="p-4 border-b border-gray-100">
            <form onSubmit={handleSearch} className="flex border border-gray-200 rounded-md overflow-hidden">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Telusuri artikel..."
                className="w-full px-4 py-3 text-sm focus:outline-none font-serif"
              />
            </form>
          </div>
          <ul className="flex flex-col py-2">
            {CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={cat.id === 'semua' ? '/' : `/?kategori=${cat.id}`}
                  className={`block px-6 py-4 text-sm font-medium ${
                    activeCategory === cat.id ? 'text-gray-900 bg-gray-50 border-l-4 border-gray-900' : 'text-gray-600'
                  }`}
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}