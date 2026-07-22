import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TrendingSection from '../components/TrendingSection';
import NewsCard from '../components/NewsCard';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const categories = [
  { id: 'semua', label: 'Semua' },
  { id: 'Berita', label: 'Berita' },
  { id: 'Teknologi', label: 'Teknologi' },
  { id: 'Olahraga', label: 'Olahraga' },
  { id: 'Ekonomi', label: 'Ekonomi' },
  { id: 'Hiburan', label: 'Hiburan' }
];

function CategoryIcon({ id }) {
  switch (id) {
    case 'semua':
      return <i className="bx bx-grid-alt mr-2 text-slate-600 dark:text-slate-400" aria-hidden="true" />;
    case 'Berita':
      return <i className="bx bx-news mr-2 text-slate-600 dark:text-slate-400" aria-hidden="true" />;
    case 'Teknologi':
      return <i className="bx bx-desktop mr-2 text-slate-600 dark:text-slate-400" aria-hidden="true" />;
    case 'Olahraga':
      return <i className="bx bx-trophy mr-2 text-slate-600 dark:text-slate-400" aria-hidden="true" />;
    case 'Ekonomi':
      return <i className="bx bx-bar-chart mr-2 text-slate-600 dark:text-slate-400" aria-hidden="true" />;
    case 'Hiburan':
      return <i className="bx bx-film mr-2 text-slate-600 dark:text-slate-400" aria-hidden="true" />;
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4 text-slate-600 dark:text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
  }
}

export default function Home() {
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [totalNews, setTotalNews] = useState(0);
  const [visibleCount, setVisibleCount] = useState(20);

  // GSAP refs
  const heroTitleRef = useRef(null);
  const heroDescRef = useRef(null);
  const heroStatsRef = useRef(null);
  const heroSearchRef = useRef(null);
  const newsSectionRef = useRef(null);

  useEffect(() => {
    const { search } = router.query;
    if (typeof search === 'string') {
      setSearchQuery(search);
    } else {
      setSearchQuery('');
    }
  }, [router.query.search]);

  // Sinkronkan kategori terpilih dengan query "kategori" di URL.
  // Ini membuat dropdown Kategori di navbar (Header.js) dan pill kategori
  // di sidebar sama-sama mengacu ke satu sumber kebenaran: router.query.kategori
  useEffect(() => {
    const { kategori } = router.query;
    if (typeof kategori === 'string' && categories.some((c) => c.id === kategori)) {
      setSelectedCategory(kategori);
    } else if (!kategori) {
      setSelectedCategory('semua');
    }
  }, [router.query.kategori]);

  useEffect(() => {
    fetchNews({ forceRefresh: true });

    const interval = setInterval(() => {
      fetchNews({ forceRefresh: false });
    }, 60000);

    const eventSource = new EventSource('/api/stream');
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'comment:new') {
          setNews((prevNews) => prevNews.map((item) => {
            if (item.id !== data.data.newsId) return item;
            return {
              ...item,
              _count: {
                ...item._count,
                comments: (item._count?.comments ?? 0) + 1
              },
              comments: [data.data, ...(item.comments ?? []).slice(0, 1)]
            };
          }));
        }
      } catch (err) {
        console.error('Error parsing SSE event:', err);
      }
    };

    return () => {
      clearInterval(interval);
      eventSource.close();
    };
  }, []);

  // GSAP Hero entrance animation
  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (heroTitleRef.current) {
        tl.from(heroTitleRef.current, { opacity: 0, y: 40, duration: 0.8 });
      }
      if (heroDescRef.current) {
        tl.from(heroDescRef.current, { opacity: 0, y: 30, duration: 0.7 }, '-=0.5');
      }
      if (heroStatsRef.current) {
        const statCards = heroStatsRef.current.children;
        tl.from(statCards, { opacity: 0, y: 30, duration: 0.6, stagger: 0.12 }, '-=0.4');
      }
      if (heroSearchRef.current) {
        tl.from(heroSearchRef.current, { opacity: 0, x: 50, duration: 0.8 }, '-=0.6');
      }
    });
    return () => ctx.revert();
  }, []);

  // GSAP ScrollTrigger for "Berita Terbaru" heading
  useEffect(() => {
    if (!newsSectionRef.current) return;
    let ctx = gsap.context(() => {
      gsap.from(newsSectionRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: newsSectionRef.current,
          start: 'top 88%',
          once: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  const fetchNews = async ({ forceRefresh = false, take = 100 } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (forceRefresh) params.set('refresh', 'true');
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (selectedCategory !== 'semua') params.set('category', selectedCategory);
      // request up to `take` news items for the listing (server expects `take`)
      params.set('take', String(take));

      const res = await fetch(`/api/news?${params.toString()}`);
      const data = await res.json();
      const list = Array.isArray(data.news) ? data.news : [];
      setNews(list);
      setTotalNews(typeof data.total === 'number' ? data.total : list.length);
    } catch (err) {
      setError(err.message || 'Gagal memuat berita terbaru');
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;

    // Debounce: Tunggu 500ms setelah pengetikan berhenti sebelum request API
    const delayDebounceFn = setTimeout(() => {
      fetchNews({ forceRefresh: false });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedCategory, router.isReady]);

  // Pilih kategori dari sidebar: update state lokal + URL query sekaligus,
  // supaya dropdown di navbar (yang membaca router.query.kategori) tetap sinkron.
  const handleSelectCategory = (id) => {
    setSelectedCategory(id);
    const nextQuery = { ...router.query };
    if (id === 'semua') {
      delete nextQuery.kategori;
    } else {
      nextQuery.kategori = id;
    }
    router.push({ pathname: '/', query: nextQuery }, undefined, { shallow: true });
  };

  const filteredNews = news.filter((item) => {
    const matchCategory = selectedCategory === 'semua' || item.kategori === selectedCategory;

    if (!searchQuery.trim()) return matchCategory;
    const query = searchQuery.toLowerCase();
    const matchSearch = item.judul?.toLowerCase().includes(query) ||
      item.headline?.toLowerCase().includes(query);
    return matchCategory && matchSearch;
  });

  const topNews = filteredNews[0] || null;
  const latestNews = filteredNews.slice(1);
  const lastUpdated = news[0]?.tanggal ? new Date(news[0].tanggal).toLocaleString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : null;

  return (
    <>
      <Head>
        <title>Portal Berita - Berita Terkini Indonesia</title>
        <meta name="description" content="Portal berita terkini dari berbagai sumber terpercaya" />
      </Head>

      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
        <Header />

        <main className="flex-grow w-full mx-auto max-w-7xl px-5 pb-16 pt-6 lg:px-8">
          <section className="relative isolate overflow-hidden rounded-[32px] border border-white/10 bg-slate-950 p-6 text-white shadow-[0_30px_90px_rgba(15,23,42,0.35)] sm:p-8">
            {/* Foto background hero. Ganti /images/hero-newsroom.jpg dengan file foto
                yang sudah kamu simpan di folder public/images/ */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/hero-newsroom.jpg')" }}
              aria-hidden="true"
            />
            {/* Overlay gelap solid supaya teks & kartu tetap terbaca di atas foto */}
            <div className="absolute inset-0 bg-slate-950/75" aria-hidden="true" />
            <div className="news-hero-pattern absolute inset-0 opacity-20" />
            <div className="absolute -right-10 top-[-60px] h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute bottom-[-40px] left-[-20px] h-56 w-56 rounded-full bg-sky-500/15 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-100 backdrop-blur">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
                  Berita utama • diperbarui otomatis
                </div>
                <div className="space-y-4">
                  <h1 ref={heroTitleRef} className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                    Berita terkini dan terpercaya untuk pembaca Indonesia.
                  </h1>
                  <p ref={heroDescRef} className="max-w-2xl text-base leading-8 text-slate-200">
                    Temukan berita terbaru dari berbagai kategori, pantau perkembangan nasional, internasional, ekonomi, teknologi, olahraga, dan hiburan dalam satu tampilan yang bersih dan cepat.
                  </p>
                </div>

                <div ref={heroStatsRef} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Total Berita</p>
                    <p className="mt-4 text-3xl font-bold text-white">{news.length}</p>
                  </div>
                  <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Kategori aktif</p>
                    <p className="mt-4 text-3xl font-bold text-white">{selectedCategory === 'semua' ? 'Semua' : selectedCategory}</p>
                  </div>
                  <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Terakhir diperbarui</p>
                    <p className="mt-4 text-base font-semibold text-slate-100">{lastUpdated ?? 'Menunggu data'}</p>
                  </div>
                </div>
              </div>

              <div ref={heroSearchRef} className="rounded-[28px] border border-white/15 bg-slate-900/60 p-6 shadow-lg backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Cari Berita</h2>
                    <p className="mt-1 text-sm text-slate-300">Gunakan kata kunci atau pilih kategori.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-3xl border border-cyan-400/30 bg-cyan-500/15 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100">Sorotan Hari Ini</p>
                    <p className="mt-2 text-sm font-semibold text-white">Peristiwa penting, opini, dan update nasional dalam satu layar.</p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-sm">
                    <label htmlFor="search" className="sr-only">Cari berita</label>
                    <input
                      id="search"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari judul atau ringkasan berita..."
                      className="w-full bg-transparent text-white outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Kategori</h3>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleSelectCategory(cat.id)}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${selectedCategory === cat.id ? 'border-cyan-400 bg-cyan-500 text-white' : 'border-white/15 bg-white/10 text-slate-200 hover:border-white/25 hover:bg-white/15'}`}>
                          <CategoryIcon id={cat.id} /> {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Fitur</p>
                    <ul className="mt-4 space-y-3 text-slate-200">
                      <li className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-100">1</span>
                        Berita otomatis diperbarui setiap menit.
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-100">2</span>
                        Tampilkan berita populer dan ringkasannya.
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-100">3</span>
                        Mode pencarian cepat untuk setiap judul dan headline.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <TrendingSection news={news.slice(0, 4)} />
          </section>

          <section className="mt-10">
            <div ref={newsSectionRef} className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Berita Terbaru</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Dapatkan berita terbaru berdasarkan kategori dan pencarian Anda.</p>
              </div>

              <button
                onClick={() => fetchNews({ forceRefresh: true, take: 100 })}
                className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                <i className="bx bx-refresh mr-2" aria-hidden="true" /> Muat ulang berita
              </button>
            </div>

            {error && (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-700 shadow-sm dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30">
                Terjadi kesalahan saat memuat berita: {error}
              </div>
            )}

            {filteredNews.length === 0 ? (
              <div className="rounded-[30px] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
                <p className="text-lg font-semibold text-slate-900 dark:text-white">Belum ada berita yang sesuai.</p>
                <p className="mt-2">Coba ubah kategori atau gunakan kata kunci lain.</p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">Menampilkan {Math.min(filteredNews.length, visibleCount)} dari {totalNews} berita</div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredNews.slice(0, visibleCount).map((item) => (
                    <NewsCard key={item.id} news={item} />
                  ))}
                </div>

                {filteredNews.length > visibleCount && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => {
                        if (visibleCount === 20) setVisibleCount(50);
                        else if (visibleCount === 50) setVisibleCount(100);
                        else setVisibleCount(filteredNews.length);
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700"
                    >
                      {`Muat lebih banyak (${Math.min(visibleCount, filteredNews.length)}/${totalNews})`}
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}