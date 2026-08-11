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
  const paragraphs = berita.isi?.split('\n').filter(p => p.trim().length > 0) || [];

  return (
    <article ref={articleRef} className="bg-white pb-20 border-b border-gray-200 mb-16 pt-10">
       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
         <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 block">
            {berita.kategori || 'Berita Utama'}
         </span>
         <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight text-gray-900 mb-6 leading-[1.1]">
           {berita.judul}
         </h1>
         <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-10">
           <span>{new Date(berita.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
           <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
           <span>Oleh {berita.author || berita.sourceName || 'Redaksi'}</span>
         </div>
       </div>

       {berita.gambar && (
         <div className="w-full max-w-6xl mx-auto mb-10 px-4">
            <img src={berita.gambar} alt={berita.judul} className="w-full h-auto max-h-[650px] object-cover rounded-xl" />
         </div>
       )}

       <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
         {berita.headline && (
            <p className="font-serif text-xl md:text-2xl text-gray-600 italic leading-relaxed mb-12">
              "{berita.headline}"
            </p>
         )}
         
         <div className="prose prose-lg prose-gray font-serif text-gray-800 leading-relaxed max-w-none">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraf, index) => <p key={index} className="mb-8">{paragraf}</p>)
            ) : (
              <p>{berita.isi || 'Konten tidak tersedia.'}</p>
            )}
         </div>

         {/* Micro-Frontend: Komentar */}
         <div className="mt-16 pt-8 border-t border-gray-200">
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