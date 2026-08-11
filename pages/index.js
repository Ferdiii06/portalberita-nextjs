import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TrendingSection from '../components/TrendingSection';
import NewsCard from '../components/NewsCard';

const categories = [
  { id: 'semua', label: 'Semua' },
  { id: 'Berita', label: 'Berita' },
  { id: 'Teknologi', label: 'Teknologi' },
  { id: 'Olahraga', label: 'Olahraga' },
  { id: 'Ekonomi', label: 'Ekonomi' },
  { id: 'Hiburan', label: 'Hiburan' }
];

export default function Home() {
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [totalNews, setTotalNews] = useState(0);
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    const { search } = router.query;
    if (typeof search === 'string') {
      setSearchQuery(search);
    } else {
      setSearchQuery('');
    }
  }, [router.query.search]);

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


  const fetchNews = async ({ forceRefresh = false, take = 100 } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (forceRefresh) params.set('refresh', 'true');
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (selectedCategory !== 'semua') params.set('category', selectedCategory);
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
    const delayDebounceFn = setTimeout(() => {
      fetchNews({ forceRefresh: false });
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedCategory, router.isReady]);

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

  return (
    <>
      <Head>
        <title>JurnalPagi - Editorial & Berita Terkini</title>
        <meta name="description" content="Bacaan elegan dengan berita terpercaya" />
      </Head>

      <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
        <Header />

        <main className="flex-grow w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-20">
          
          <section className="mb-20">
            <TrendingSection news={news.slice(0, 4)} />
          </section>

          <section className="mt-8 border-t border-gray-200 pt-16">
            <div className="mb-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Bacaan Terkini</h2>
              <p className="text-gray-500 font-serif italic text-lg">Liputan mendalam, opini, dan cerita yang paling banyak dibicarakan hari ini.</p>
              
              {/* Category Filter Pills */}
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                 {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.id)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors border ${
                        selectedCategory === cat.id 
                          ? 'border-gray-900 bg-gray-900 text-white' 
                          : 'border-gray-200 text-gray-500 hover:border-gray-400'
                      }`}
                    >
                      {cat.label}
                    </button>
                 ))}
              </div>
            </div>

            {error && (
              <div className="border border-red-200 bg-red-50 p-4 text-red-700 mb-6 font-medium text-center">
                Gagal memuat: {error}
              </div>
            )}

            {filteredNews.length === 0 ? (
              <div className="py-20 text-center text-gray-400">
                <p className="font-serif italic text-xl">Tidak ada tulisan yang ditemukan.</p>
              </div>
            ) : (
              <>
                <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                  {filteredNews.slice(0, visibleCount).map((item) => (
                    <NewsCard key={item.id} news={item} />
                  ))}
                </div>

                {filteredNews.length > visibleCount && (
                  <div className="mt-16 flex justify-center">
                    <button
                      onClick={() => {
                        if (visibleCount === 20) setVisibleCount(50);
                        else if (visibleCount === 50) setVisibleCount(100);
                        else setVisibleCount(filteredNews.length);
                      }}
                      className="border-b border-gray-900 text-gray-900 px-2 py-1 text-sm font-bold hover:text-gray-500 hover:border-gray-500 transition-colors uppercase tracking-widest"
                    >
                      Muat Tulisan Lainnya
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