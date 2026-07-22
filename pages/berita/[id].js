// pages/berita/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Comments from '../../components/Comments';
import { useTheme } from '../../context/ThemeContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function BeritaDetail() {
  const router = useRouter();
  const { id } = router.query;
  const beritaId = Array.isArray(id) ? id[0] : id;
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scraping, setScraping] = useState(false);
  const { theme } = useTheme();

  // GSAP refs
  const articleHeaderRef = useRef(null);
  const articleImageRef = useRef(null);
  const articleBodyRef = useRef(null);
  const commentsRef = useRef(null);

  useEffect(() => {
    if (beritaId) {
      fetchBerita(beritaId);
      incrementViews(beritaId);
    }
  }, [beritaId]);

  const fetchBerita = async (newsId) => {
    try {
      const res = await fetch(`/api/news/${newsId}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setBerita(data);
      
      if (data.isi && data.isi.length < 500 && data.sourceUrl) {
        await scrapeContent(data.id, data.sourceUrl, data.sourceName);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const scrapeContent = async (beritaId, url, sourceName) => {
    setScraping(true);
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: beritaId, url, sourceName })
      });
      
      const result = await res.json();
      if (result.success) {
        const updated = await fetch(`/api/news/${beritaId}`);
        const data = await updated.json();
        setBerita(data);
      }
    } catch (err) {
      console.error('Scrape error:', err);
    } finally {
      setScraping(false);
    }
  };

  const incrementViews = async (newsId) => {
    try {
      await fetch(`/api/news/${newsId}/view`, { method: 'POST' });
    } catch (err) {
      console.error('Error incrementing views:', err);
    }
  };

  // GSAP: article entrance after data loads
  useEffect(() => {
    if (!berita || loading) return;
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Article header: badge + title + meta stagger
      if (articleHeaderRef.current) {
        const children = articleHeaderRef.current.children;
        tl.from(children, { opacity: 0, y: 30, duration: 0.6, stagger: 0.1 });
      }

      // Image scale-in
      if (articleImageRef.current) {
        tl.from(articleImageRef.current, { opacity: 0, scale: 0.97, duration: 0.7 }, '-=0.3');
      }

      // Body paragraphs stagger
      if (articleBodyRef.current) {
        const paras = articleBodyRef.current.querySelectorAll('p');
        if (paras.length > 0) {
          gsap.from(paras, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: 'power2.out',
            stagger: 0.05,
            scrollTrigger: {
              trigger: articleBodyRef.current,
              start: 'top 85%',
              once: true,
            },
          });
        }
      }

      // Comments section fade-in
      if (commentsRef.current) {
        gsap.from(commentsRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: commentsRef.current,
            start: 'top 88%',
            once: true,
          },
        });
      }
    });

    return () => ctx.revert();
  }, [berita, loading]);


  const styles = getStyles(theme);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p>Memuat berita...</p>
      </div>
    );
  }

  if (error || !berita) {
    return (
      <div style={styles.errorContainer}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i className="bx bx-error-circle" style={{ fontSize: '32px' }}></i> Berita tidak ditemukan</h1>
        <Link href="/" style={styles.backButton}>Kembali ke Beranda</Link>
      </div>
    );
  }

  const paragraphs = berita.isi?.split('\n').filter(p => p.trim().length > 0) || [];

  return (
    <>
      <Head>
        <title>{berita.judul} - Portal Berita</title>
        <meta name="description" content={berita.headline} />
      </Head>
      <div style={styles.pageWrapper}>
        <Header />
        <main style={styles.container}>
          <Link href="/" style={{ ...styles.backLink, display: 'flex', alignItems: 'center', gap: '6px' }}><i className="bx bx-arrow-back"></i> Kembali ke Beranda</Link>
          
          <article style={styles.article}>
            <div ref={articleHeaderRef} style={styles.articleHeader}>
              <span style={styles.articleCategory}>{berita.kategori || 'Umum'}</span>
              <h1 style={styles.articleTitle}>{berita.judul}</h1>
              <div style={styles.articleMeta}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i className="bx bx-user"></i> {berita.author || berita.sourceName || 'Unknown'}</span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i className="bx bx-calendar"></i> {new Date(berita.tanggal).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i className="bx bx-time-five"></i> {berita.waktuBaca || 1} menit baca</span>
              </div>
            </div>

            {berita.gambar && berita.gambar !== '' && (
              <div ref={articleImageRef} style={styles.articleImageWrapper}>
                <img 
                  src={berita.gambar} 
                  alt={berita.judul}
                  style={styles.articleImage}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const parent = e.target.parentElement;
                    parent.innerHTML = `<div style="width:100%;height:300px;background:${theme === 'dark' ? '#334155' : '#f1f5f9'};display:flex;align-items:center;justify-content:center;font-size:64px;border-radius:8px;color:#94a3b8;"><i class="bx bx-image"></i></div>`;
                  }}
                />
              </div>
            )}

            <div style={styles.articleContent}>
              {scraping && (
                <div style={styles.scrapingNotice}>
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><i className="bx bx-loader-alt bx-spin"></i> Mengambil konten lengkap...</span>
                </div>
              )}
              
              {berita.headline && (
                <p style={styles.articleHeadline}>{berita.headline}</p>
              )}
              
              <div ref={articleBodyRef} style={styles.articleBody}>
                {paragraphs.length > 0 ? (
                  paragraphs.map((paragraf, index) => (
                    <p key={index} style={styles.articleParagraph}>{paragraf}</p>
                  ))
                ) : (
                  <p style={styles.articleParagraph}>{berita.isi || 'Konten tidak tersedia.'}</p>
                )}
              </div>
            </div>

            <div style={styles.articleFooter}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                <p style={{ ...styles.articleSource, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="bx bx-link"></i> Sumber: {berita.sourceUrl ? (
                    <a 
                      href={berita.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#2563eb', fontWeight: 600 }}
                    >
                      {berita.sourceName || 'Baca selengkapnya'}
                    </a>
                  ) : (
                    berita.sourceName || 'Unknown'
                  )}
                </p>
                <p style={{ ...styles.articleViews, display: 'flex', alignItems: 'center', gap: '6px' }}><i className="bx bx-show"></i> {berita.views || 0} kali dibaca</p>
              </div>
            </div>
            {berita.sourceUrl && (
              <div style={{ padding: '0 28px 28px' }}>
                <a 
                  href={berita.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...styles.readMoreButton, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <i className="bx bx-book-open" style={{ fontSize: '18px' }}></i> Baca Selengkapnya di {berita.sourceName || 'Sumber Asli'}
                </a>
              </div>
            )}
          </article>
          <div ref={commentsRef}><Comments newsId={berita.id} /></div>
        </main>
        <Footer />
      </div>
    </>
  );
}

const getStyles = (theme) => ({
  pageWrapper: {
    background: theme === 'dark' ? '#0f172a' : '#f5f7fa',
    minHeight: '100vh',
    color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  backLink: {
    display: 'inline-block',
    color: '#2563eb',
    textDecoration: 'none',
    marginBottom: '20px',
    fontWeight: 500,
    fontSize: '15px'
  },
  article: {
    background: theme === 'dark' ? '#1e293b' : 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    overflow: 'hidden',
    border: `1px solid ${theme === 'dark' ? '#334155' : '#f1f5f9'}`
  },
  articleHeader: {
    padding: '28px 28px 16px'
  },
  articleCategory: {
    display: 'inline-block',
    background: '#eff6ff',
    color: '#2563eb',
    padding: '4px 14px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
    marginBottom: '12px'
  },
  articleTitle: {
    fontSize: '28px',
    fontWeight: 700,
    color: theme === 'dark' ? 'white' : '#0f172a',
    lineHeight: 1.3,
    marginBottom: '12px'
  },
  articleMeta: {
    display: 'flex',
    gap: '8px',
    fontSize: '14px',
    color: theme === 'dark' ? '#94a3b8' : '#64748b',
    flexWrap: 'wrap'
  },
  articleImageWrapper: {
    padding: '0 28px',
    marginBottom: '16px'
  },
  articleImage: {
    width: '100%',
    maxHeight: '450px',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  articleContent: {
    padding: '0 28px'
  },
  scrapingNotice: {
    background: theme === 'dark' ? '#0c4a6e' : '#f0f9ff',
    color: theme === 'dark' ? '#bae6fd' : '#0369a1',
    padding: '10px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    textAlign: 'center'
  },
  articleHeadline: {
    fontSize: '18px',
    color: theme === 'dark' ? '#cbd5e1' : '#475569',
    lineHeight: 1.7,
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: `2px solid ${theme === 'dark' ? '#334155' : '#f1f5f9'}`
  },
  articleBody: {
    color: theme === 'dark' ? '#e2e8f0' : '#334155',
    lineHeight: 1.8
  },
  articleParagraph: {
    marginBottom: '16px',
    fontSize: '16px',
    textAlign: 'justify'
  },
  articleFooter: {
    padding: '16px 28px 12px',
    borderTop: `1px solid ${theme === 'dark' ? '#334155' : '#f1f5f9'}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    fontSize: '14px',
    color: theme === 'dark' ? '#94a3b8' : '#64748b'
  },
  articleSource: {
    color: theme === 'dark' ? '#cbd5e1' : '#475569'
  },
  articleViews: {
    color: theme === 'dark' ? '#94a3b8' : '#64748b'
  },
  readMoreButton: {
    display: 'inline-block',
    padding: '12px 28px',
    background: '#2563eb',
    color: 'white',
    borderRadius: '10px',
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'all 0.3s',
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
    width: '100%',
    textAlign: 'center'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: theme === 'dark' ? '#0f172a' : '#f5f7fa',
    gap: '12px'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: `4px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
    borderTop: '4px solid #2563eb',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '12px',
    background: theme === 'dark' ? '#0f172a' : '#f5f7fa',
    padding: '20px'
  },
  backButton: {
    padding: '10px 24px',
    background: '#2563eb',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 500
  }
});