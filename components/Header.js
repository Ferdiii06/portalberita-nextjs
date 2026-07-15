import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useNews } from '../context/NewsContext';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
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

  const menu = [
    { label: 'Beranda', href: '/' },
    { label: 'Kategori', href: '/#kategori' },
    { label: 'Arsip', href: '/arsip' },
    { label: 'Tentang', href: '/about' }
  ];

  const notifications = breakingNews.length > 0 ? breakingNews.slice(0, 3) : news.slice(0, 3);
  const notificationCount = notifications.length;

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    router.push({ pathname: '/', query: query ? { search: query } : {} });
    setSearchOpen(false);
    setNotificationOpen(false);
    setOpen(false);
  };

  return (
    <header ref={headerRef} className={`sticky top-0 z-50 transition duration-300 ${scrolled ? 'bg-white/95 shadow-sm backdrop-blur-xl' : 'bg-transparent'} border-b border-slate-200/80`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-3 text-xl font-black text-slate-950">
          <span>
            Insight <span className="text-sky-600">News</span>
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
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 text-lg transition hover:border-slate-300 hover:text-slate-950"
            aria-label="Cari"
            onClick={() => {
              setSearchOpen((open) => !open);
              setNotificationOpen(false);
            }}
            aria-expanded={searchOpen}
          >
            <i className="bx bx-search text-lg" aria-hidden="true" />
          </button>

          <button
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-600 text-white text-lg transition hover:bg-sky-700"
            aria-label="Notifikasi"
            onClick={() => {
              setNotificationOpen((open) => !open);
              setSearchOpen(false);
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

        <div className="relative md:hidden">
          <button
            onClick={() => setOpen((o) => !o)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 text-xl transition hover:border-slate-300 hover:text-slate-950"
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? (
              <i className="bx bx-x text-xl" aria-hidden="true" />
            ) : (
              <i className="bx bx-menu text-xl" aria-hidden="true" />
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-64 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl">
              <div className="space-y-3">
                {menu.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-100">
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    setSearchOpen((open) => !open);
                    setNotificationOpen(false);
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <i className="bx bx-search inline-block mr-2 h-4 w-4 text-slate-700" aria-hidden="true" />
                  Cari
                </button>
                <button
                  onClick={() => {
                    setNotificationOpen((open) => !open);
                    setSearchOpen(false);
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <i className="bx bx-bell inline-block mr-2 h-4 w-4 text-slate-700" aria-hidden="true" />
                  Notifikasi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-slate-200 bg-white/90 px-5 py-4 shadow-sm backdrop-blur-xl md:block">
          <form onSubmit={handleSearch} className="mx-auto flex max-w-7xl items-center gap-3">
            <label htmlFor="navbar-search" className="sr-only">Cari berita</label>
            <input
              id="navbar-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul atau headline..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
            <button type="submit" className="inline-flex h-11 items-center justify-center rounded-2xl bg-sky-600 px-5 text-sm font-semibold text-white transition hover:bg-sky-700">
              Cari
            </button>
          </form>
        </div>
      )}

      {notificationOpen && (
        <div className="border-t border-slate-200 bg-white/90 px-5 py-4 shadow-sm backdrop-blur-xl md:block">
          <div className="mx-auto max-w-7xl space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Notifikasi</p>
              <span className="text-xs text-slate-500">{notificationCount} item</span>
            </div>
            {notificationCount === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Tidak ada notifikasi baru saat ini.
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((item) => (
                  <Link
                    key={item.id}
                    href={`/berita/${item.id}`}
                    className="block rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 transition hover:border-sky-300 hover:bg-sky-50"
                    onClick={() => setNotificationOpen(false)}
                  >
                    <p className="font-semibold text-slate-900 line-clamp-1">{item.judul}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.kategori || 'Umum'}</p>
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
