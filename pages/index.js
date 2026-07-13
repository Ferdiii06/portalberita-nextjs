// pages/index.js
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TrendingSection from '../components/TrendingSection';
import NewsCard from '../components/NewsCard';

const categories = [
  { id: 'semua', label: 'Semua', icon: '📰' },
  { id: 'Berita', label: 'Berita', icon: '📢' },
  { id: 'Teknologi', label: 'Teknologi', icon: '💻' },
  { id: 'Olahraga', label: 'Olahraga', icon: '⚽' },
  { id: 'Ekonomi', label: 'Ekonomi', icon: '💰' },
  { id: 'Hiburan', label: 'Hiburan', icon: '🎬' }
];

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');

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

  const fetchNews = async ({ forceRefresh = false } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/news?refresh=${forceRefresh ? 'true' : 'false'}`);
      const data = await res.json();
      setNews(Array.isArray(data.news) ? data.news : []);
    } catch (err) {
      setError(err.message || 'Gagal memuat berita terbaru');
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = news.filter((item) => {
    const matchCategory = selectedCategory === 'semua' || item.kategori === selectedCategory;
    const matchSearch = item.judul?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.headline?.toLowerCase().includes(searchQuery.toLowerCase());
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

      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Header />

        <main className="mx-auto max-w-7xl px-5 pb-16 pt-6 lg:px-8">
          <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
                  Berita utama • diperbarui otomatis
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                    Berita terkini dan terpercaya untuk pembaca Indonesia.
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-slate-600">
                    Temukan berita terbaru dari berbagai kategori, pantau perkembangan nasional, internasional, ekonomi, teknologi, olahraga, dan hiburan dalam satu tampilan yang bersih dan cepat.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Total Berita</p>
                    <p className="mt-4 text-3xl font-bold text-slate-950">{news.length}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Kategori aktif</p>
                    <p className="mt-4 text-3xl font-bold text-slate-950">{selectedCategory === 'semua' ? 'Semua' : selectedCategory}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Terakhir diperbarui</p>
                    <p className="mt-4 text-base font-semibold text-slate-800">{lastUpdated ?? 'Menunggu data'}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">Cari Berita</h2>
                    <p className="mt-1 text-sm text-slate-500">Gunakan kata kunci atau pilih kategori.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                    <label htmlFor="search" className="sr-only">Cari berita</label>
                    <input
                      id="search"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari judul atau ringkasan berita..."
                      className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Kategori</h3>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${selectedCategory === cat.id ? 'border-sky-600 bg-sky-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}>
                          {cat.icon} {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Fitur</p>
                    <ul className="mt-4 space-y-3 text-slate-700">
                      <li className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">1</span>
                        Berita otomatis diperbarui setiap menit.
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">2</span>
                        Tampilkan berita populer dan ringkasannya.
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">3</span>
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
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">Berita Terbaru</h2>
                <p className="mt-2 text-sm text-slate-500">Dapatkan berita terbaru berdasarkan kategori dan pencarian Anda.</p>
              </div>

              <button
                onClick={() => fetchNews({ forceRefresh: true })}
                className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                🔄 Muat ulang berita
              </button>
            </div>

            {error && (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-700 shadow-sm">
                Terjadi kesalahan saat memuat berita: {error}
              </div>
            )}

            {filteredNews.length === 0 ? (
              <div className="rounded-[30px] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">
                <p className="text-lg font-semibold text-slate-900">Belum ada berita yang sesuai.</p>
                <p className="mt-2">Coba ubah kategori atau gunakan kata kunci lain.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredNews.map((item) => (
                  <NewsCard key={item.id} news={item} />
                ))}
              </div>
            )}
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
