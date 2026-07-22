import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useNews } from '../context/NewsContext';
import ThemeToggleButton from './ThemeToggleButton';

// PENTING: daftar ini harus sama persis (id & urutan) dengan `categories`
// di pages/index.js, karena keduanya memakai key query URL yang sama
// ("kategori") sebagai satu-satunya sumber kebenaran untuk memfilter berita.
const CATEGORIES = [
  { id: 'semua', label: 'Semua', icon: 'bx-grid-alt' },
  { id: 'Berita', label: 'Berita', icon: 'bx-news' },
  { id: 'Teknologi', label: 'Teknologi', icon: 'bx-desktop' },
  { id: 'Olahraga', label: 'Olahraga', icon: 'bx-trophy' },
  { id: 'Ekonomi', label: 'Ekonomi', icon: 'bx-bar-chart' },
  { id: 'Hiburan', label: 'Hiburan', icon: 'bx-film' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryMobileOpen, setCategoryMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);
  const router = useRouter();
  const { breakingNews, news } = useNews();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handle = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setOpen(false);
        setSearchOpen(false);
        setNotificationOpen(false);
        setCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  useEffect(() => {
    if (router.pathname === '/' && typeof router.query.search === 'string') {
      setSearchQuery(router.query.search);
    }
  }, [router.pathname, router.query.search]);

  // Auto-close semua panel setiap kali route/query berubah
  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
    setNotificationOpen(false);
    setCategoryOpen(false);
    setCategoryMobileOpen(false);
  }, [router.pathname, router.query.kategori]);

  const menu = [
    { label: 'Beranda', href: '/' },
    { label: 'Arsip', href: '/arsip' },
    { label: 'Tentang', href: '/about' },
  ];

  const notifications = breakingNews.length > 0 ? breakingNews.slice(0, 3) : news.slice(0, 3);
  const notificationCount = notifications.length;

  // "semua" adalah default kalau query kategori kosong/tidak valid —
  // sama seperti default selectedCategory di index.js
  const activeCategory =
    typeof router.query.kategori === 'string' && CATEGORIES.some((c) => c.id === router.query.kategori)
      ? router.query.kategori
      : 'semua';

  const goToCategory = (id) => {
    const nextQuery = { ...router.query };
    if (id === 'semua') {
      delete nextQuery.kategori;
    } else {
      nextQuery.kategori = id;
    }
    router.push({ pathname: '/', query: nextQuery }, undefined, { shallow: true });
    setCategoryOpen(false);
    setCategoryMobileOpen(false);
    setOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    router.push({ pathname: '/', query: query ? { search: query } : {} });
    setSearchOpen(false);
    setNotificationOpen(false);
    setOpen(false);
  };

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 transition duration-300 ${
        scrolled ? 'bg-slate-950/95 shadow-sm backdrop-blur-xl' : 'bg-slate-950/80'
      } border-b border-white/10`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-3 text-xl font-black text-white">
          <span>
            Insight <span className="text-sky-400">News</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-white/70">
          <Link
            href="/"
            className={`transition duration-200 hover:text-white ${router.pathname === '/' && activeCategory === 'semua' ? 'text-sky-400' : ''}`}
          >
            Beranda
          </Link>

          {/* Tombol Kategori dengan dropdown */}
          <button
            type="button"
            onClick={() => {
              setCategoryOpen((o) => !o);
              setSearchOpen(false);
              setNotificationOpen(false);
            }}
            aria-expanded={categoryOpen}
            aria-haspopup="menu"
            className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 transition duration-200 ${
              categoryOpen || activeCategory !== 'semua'
                ? 'border-white/30 text-white'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            Kategori
            <i className={`bx bx-chevron-down text-base transition-transform duration-200 ${categoryOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>

          {menu.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition duration-200 hover:text-white ${router.pathname === item.href ? 'text-sky-400' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggleButton />
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/80 text-lg transition hover:border-white/20 hover:text-white"
            aria-label="Cari"
            onClick={() => {
              setSearchOpen((o) => !o);
              setNotificationOpen(false);
              setCategoryOpen(false);
            }}
            aria-expanded={searchOpen}
          >
            <i className="bx bx-search text-lg" aria-hidden="true" />
          </button>

          <button
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500 text-white text-lg transition hover:bg-sky-600"
            aria-label="Notifikasi"
            onClick={() => {
              setNotificationOpen((o) => !o);
              setSearchOpen(false);
              setCategoryOpen(false);
            }}
            aria-expanded={notificationOpen}
          >
            <i className="bx bx-bell text-lg" aria-hidden="true" />
            {notificationCount > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-semibold text-white">
                {notificationCount}
              </span>
            )}
          </button>
        </div>

        {/* Tombol hamburger mobile */}
        <div className="relative lg:hidden">
          <button
            onClick={() => setOpen((o) => !o)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/80 text-xl transition hover:border-white/20 hover:text-white"
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <i className="bx bx-x text-xl" aria-hidden="true" /> : <i className="bx bx-menu text-xl" aria-hidden="true" />}
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-72 rounded-3xl border border-white/10 bg-slate-900 p-4 shadow-2xl">
              <div className="space-y-3">
                <div className="px-4 py-3">
                  <ThemeToggleButton />
                </div>

                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-base font-medium text-white/80 transition hover:bg-white/5"
                >
                  Beranda
                </Link>

                {/* Accordion Kategori versi mobile */}
                <div className="rounded-2xl border border-white/10 bg-white/5">
                  <button
                    type="button"
                    onClick={() => setCategoryMobileOpen((o) => !o)}
                    aria-expanded={categoryMobileOpen}
                    className="flex w-full items-center justify-between px-4 py-3 text-base font-medium text-white/80"
                  >
                    Kategori
                    <i className={`bx bx-chevron-down text-lg transition-transform duration-200 ${categoryMobileOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>

                  {categoryMobileOpen && (
                    <div className="flex flex-wrap gap-2 px-4 pb-4">
                      {CATEGORIES.map((cat) => (
                        <CategoryPill
                          key={cat.id}
                          icon={cat.icon}
                          label={cat.label}
                          active={activeCategory === cat.id}
                          onClick={() => goToCategory(cat.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {menu.slice(1).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-base font-medium text-white/80 transition hover:bg-white/5"
                  >
                    {item.label}
                  </Link>
                ))}

                <button
                  onClick={() => {
                    setSearchOpen((o) => !o);
                    setNotificationOpen(false);
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-medium text-white/80 transition hover:bg-white/10"
                >
                  <i className="bx bx-search inline-block mr-2 h-4 w-4" aria-hidden="true" />
                  Cari
                </button>
                <button
                  onClick={() => {
                    setNotificationOpen((o) => !o);
                    setSearchOpen(false);
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-medium text-white/80 transition hover:bg-white/10"
                >
                  <i className="bx bx-bell inline-block mr-2 h-4 w-4" aria-hidden="true" />
                  Notifikasi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Panel dropdown Kategori versi desktop */}
      {categoryOpen && (
        <div className="hidden border-t border-white/10 bg-slate-950/95 px-5 py-4 shadow-sm backdrop-blur-xl lg:block">
          <div className="mx-auto max-w-7xl">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-white/40">Kategori</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <CategoryPill
                  key={cat.id}
                  icon={cat.icon}
                  label={cat.label}
                  active={activeCategory === cat.id}
                  onClick={() => goToCategory(cat.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="border-t border-white/10 bg-slate-950/90 px-5 py-4 shadow-sm backdrop-blur-xl">
          <form onSubmit={handleSearch} className="mx-auto flex max-w-7xl items-center gap-3">
            <label htmlFor="navbar-search" className="sr-only">Cari berita</label>
            <input
              id="navbar-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul atau headline..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            />
            <button type="submit" className="inline-flex h-11 items-center justify-center rounded-2xl bg-sky-500 px-5 text-sm font-semibold text-white transition hover:bg-sky-600">
              Cari
            </button>
          </form>
        </div>
      )}

      {notificationOpen && (
        <div className="border-t border-white/10 bg-slate-950/90 px-5 py-4 shadow-sm backdrop-blur-xl">
          <div className="mx-auto max-w-7xl space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Notifikasi</p>
              <span className="text-xs text-white/50">{notificationCount} item</span>
            </div>
            {notificationCount === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                Tidak ada notifikasi baru saat ini.
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((item) => (
                  <Link
                    key={item.id}
                    href={`/berita/${item.id}`}
                    className="block rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 transition hover:border-sky-400/40 hover:bg-sky-400/10"
                    onClick={() => setNotificationOpen(false)}
                  >
                    <p className="font-semibold text-white line-clamp-1">{item.judul}</p>
                    <p className="mt-1 text-xs text-white/50">{item.kategori || 'Umum'}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// Komponen pill kategori, dipakai bareng di versi desktop & mobile.
// Style-nya sengaja disamakan dengan pill kategori di sidebar kanan index.js.
function CategoryPill({ icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition ${
        active
          ? 'border-cyan-400 bg-cyan-500 text-white'
          : 'border-white/15 bg-white/10 text-slate-200 hover:border-white/25 hover:bg-white/15'
      }`}
    >
      <i className={`bx ${icon} text-base`} aria-hidden="true" />
      {label}
    </button>
  );
}