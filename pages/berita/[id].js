import { useRouter } from 'next/router';
import { useEffect, useState, useRef, useCallback } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// [Micro-Frontend] Memuat modul komentar secara terpisah (chunk dinamis)
// Ini mencegah kegagalan sistem komentar merusak seluruh halaman berita.
const Comments = dynamic(() => import('../../components/Comments'), {
  loading: () => <div className="animate-pulse bg-gray-100 h-32 rounded-xl mt-8"></div>,
  ssr: false,
});

function ArticleRenderer({ berita, onInView }) {
  const articleRef = useRef(null);
  const [fontSize, setFontSize] = useState('text-lg'); // text-base, text-lg, text-xl
  const [copied, setCopied] = useState(false);

  // Observer untuk mengubah URL bar secara halus (Infinite Scroll Update)
  useEffect(() => {
    if (!articleRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          onInView(berita.id);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(articleRef.current);
    return () => observer.disconnect();
  }, [berita.id, onInView]);

  if (!berita) return null;

  // Bersihkan konten dari tag HTML mentah seperti <img...>
  const rawContent = (berita.isi || '')
    .replace(/<img[^>]*>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();

  const paragraphs = rawContent
    ? rawContent.split('\n').map(p => p.trim()).filter(p => p.length > 20)
    : [];

  // Poin kunci ringkasan cepat
  const keyPoints = [
    berita.headline ? berita.headline.slice(0, 140) + '...' : 'Laporan terkini terkait peristiwa yang sedang berlangsung.',
    paragraphs[0] ? paragraphs[0].slice(0, 130) + '...' : 'Informasi telah diverifikasi dari sumber resmi terpercaya.',
    berita.sourceName ? `Liputan dihimpun secara langsung dari jaringan jurnalisme ${berita.sourceName}.` : 'Redaksi memperbarui laporan secara berkala seiring perkembangan informasi.'
  ];

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareToWhatsapp = () => {
    if (typeof window !== 'undefined') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(berita.judul + ' ' + window.location.href)}`, '_blank');
    }
  };

  const shareToTwitter = () => {
    if (typeof window !== 'undefined') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(berita.judul)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
    }
  };

  return (
    <article ref={articleRef} className="bg-white pb-24 border-b border-gray-200 mb-16 pt-8">
      {/* Header Artikel */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
              {berita.kategori || 'Berita Utama'}
            </span>
            <span className="text-emerald-700 bg-emerald-50 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Realtime
            </span>
          </div>

          {/* Utility: Font Size & Share */}
          <div className="flex items-center gap-2 text-xs text-gray-500 font-sans">
            <span className="text-[11px] font-medium mr-1 hidden sm:inline">Ukuran Teks:</span>
            <button
              onClick={() => setFontSize('text-base')}
              className={`px-2 py-1 border rounded text-xs font-semibold ${fontSize === 'text-base' ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
              title="Ukuran Normal"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('text-lg')}
              className={`px-2 py-1 border rounded text-sm font-semibold ${fontSize === 'text-lg' ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
              title="Ukuran Sedang"
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('text-xl')}
              className={`px-2 py-1 border rounded text-base font-semibold ${fontSize === 'text-xl' ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
              title="Ukuran Besar"
            >
              A++
            </button>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight text-gray-900 mb-6 leading-[1.15]">
          {berita.judul}
        </h1>

        {/* Info Penulis & Waktu */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-medium text-gray-500 mb-8 border-y border-gray-100 py-3">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 font-normal">Oleh:</span>
            <strong className="text-gray-900">{berita.author || berita.sourceName || 'Tim Redaksi'}</strong>
          </div>
          <span className="text-gray-300">•</span>
          <div>
            {new Date(berita.tanggal).toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span>{berita.waktuBaca || 3} menit baca</span>
          </div>
          {berita.views > 0 && (
            <>
              <span className="text-gray-300">•</span>
              <div className="text-gray-400">
                <span>{berita.views.toLocaleString('id-ID')} pembaca</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Foto Berita Utama */}
      {berita.gambar && (
        <div className="w-full max-w-5xl mx-auto mb-10 px-4">
          <div className="overflow-hidden rounded-2xl shadow-sm border border-gray-200">
            <img
              src={berita.gambar}
              alt={berita.judul}
              className="w-full h-auto max-h-[550px] object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&q=80';
              }}
            />
          </div>
          <p className="text-[11px] text-gray-400 font-sans italic mt-2 text-center">
            Dokumentasi liputan berita • Sumber: {berita.sourceName || 'Kanal Redaksi'}
          </p>
        </div>
      )}

      {/* Konten Utama & Kotak Poin Kunci */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Box Kilas Berita / Poin Kunci */}
        <div className="bg-neutral-50 border-l-4 border-gray-900 p-5 sm:p-6 rounded-r-xl mb-10 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
            <span>📌</span>
            <span>Kilas Berita / Poin Kunci:</span>
          </div>
          <ul className="space-y-2.5 text-sm text-gray-700 font-sans leading-relaxed">
            {keyPoints.map((point, pIdx) => (
              <li key={pIdx} className="flex items-start gap-2">
                <span className="text-gray-900 font-bold">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Lead Quote Headline */}
        {berita.headline && (
          <p className="font-serif text-xl sm:text-2xl text-gray-700 italic leading-relaxed mb-10 border-b border-gray-100 pb-8">
            "{berita.headline}"
          </p>
        )}

        {/* Paragraf Artikel */}
        <div className={`font-serif text-gray-800 leading-relaxed space-y-6 ${fontSize}`}>
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraf, index) => {
              if (index === 0) {
                // Drop Cap untuk paragraf pertama
                const firstChar = paragraf.charAt(0);
                const restText = paragraf.slice(1);
                return (
                  <p key={index} className="leading-relaxed">
                    <span className="float-left text-5xl sm:text-6xl font-black text-gray-900 pr-3 pt-1 font-serif leading-none">
                      {firstChar}
                    </span>
                    {restText}
                  </p>
                );
              }
              return (
                <p key={index} className="leading-relaxed">
                  {paragraf}
                </p>
              );
            })
          ) : (
            <p className="text-gray-600 italic">
              {rawContent || 'Rangkuman berita realtime sedang diproses redaksi.'}
            </p>
          )}
        </div>

        {/* Kartu Sumber Berita Resmi */}
        {berita.sourceUrl && (
          <div className="mt-12 bg-amber-50/60 border border-amber-200/80 p-6 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                <span>🛡️</span>
                <span>Sumber Resmi: {berita.sourceName || 'Kanal Berita'}</span>
              </div>
              <p className="text-xs text-amber-800/80 font-sans">
                Laporan ini dihimpun secara otomatis dari feed resmi {berita.sourceName || 'media terkait'}.
              </p>
            </div>
            <a
              href={berita.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm shrink-0"
            >
              <span>Buka di {berita.sourceName || 'Sumber Asli'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}

        {/* Bar Bagikan & Interaksi */}
        <div className="mt-12 border-t border-b border-gray-200 py-6 flex flex-wrap justify-between items-center gap-4">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Bagikan Artikel Ini:
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={shareToWhatsapp}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>WhatsApp</span>
            </button>
            <button
              onClick={shareToTwitter}
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>X (Twitter)</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors"
            >
              {copied ? '✓ Tersalin!' : 'Salin Tautan'}
            </button>
          </div>
        </div>

        {/* Micro-Frontend: Komentar */}
        <div className="mt-16 pt-8">
          <h3 className="font-serif text-2xl font-bold mb-6 text-gray-900">Diskusi Pembaca</h3>
          <Comments newsId={berita.id} />
        </div>
      </div>
    </article>
  );
}

export default function BeritaDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const fetchedIds = useRef(new Set());
  
  // Mengambil artikel utama (URL awal)
  useEffect(() => {
    if (!id || articles.length > 0) return;
    const fetchInitial = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/news/${id}`);
        const data = await res.json();
        setArticles([data]);
        fetchedIds.current.add(data.id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, [id, articles.length]);

  // Mengubah URL saat scroll
  const handleInView = useCallback((articleId) => {
    if (router.query.id !== articleId) {
      window.history.replaceState(null, '', `/berita/${articleId}`);
    }
  }, [router.query.id]);

  // Trigger untuk Infinite Scroll
  const loaderRef = useRef(null);
  useEffect(() => {
    if (loading || articles.length === 0) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loadingMore) {
        fetchMoreArticles();
      }
    }, { rootMargin: '400px' }); // Load sebelum pengguna benar-benar sampai bawah
    
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading, loadingMore, articles]);

  const fetchMoreArticles = async () => {
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/news?take=10`);
      const data = await res.json();
      const newsList = data.news || [];
      
      // Temukan 1 artikel yang belum dimuat sama sekali
      const unreadNews = newsList.find(n => !fetchedIds.current.has(n.id));
      
      if (unreadNews) {
        const detailRes = await fetch(`/api/news/${unreadNews.id}`);
        const detailData = await detailRes.json();
        setArticles(prev => [...prev, detailData]);
        fetchedIds.current.add(detailData.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading && articles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-serif italic text-gray-500">
        Memuat naskah...
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{articles[0]?.judul || 'Insight Berita'}</title>
        {articles[0] && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "NewsArticle",
                "headline": articles[0].judul,
                "image": [articles[0].gambar || "http://localhost:3000/images/news-placeholder.svg"],
                "datePublished": new Date(articles[0].tanggal).toISOString(),
                "dateModified": new Date(articles[0].tanggal).toISOString(),
                "author": [{
                  "@type": "Person",
                  "name": articles[0].author || articles[0].sourceName || "Redaksi Insight Berita",
                  "url": "http://localhost:3000"
                }]
              })
            }}
          />
        )}
      </Head>
      <div className="bg-white min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {articles.map((berita) => (
            <ArticleRenderer key={berita.id} berita={berita} onInView={handleInView} />
          ))}
          
          <div ref={loaderRef} className="py-20 flex justify-center items-center">
            {loadingMore && <span className="font-serif italic text-gray-400 text-lg">Menyiapkan bacaan selanjutnya...</span>}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}