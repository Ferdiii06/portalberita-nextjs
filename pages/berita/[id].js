// pages/berita/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Comments from '../../components/Comments'; 

export default function BeritaDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scraping, setScraping] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBerita();
      incrementViews();
    }
  }, [id]);

  const fetchBerita = async () => {
    try {
      const res = await fetch(`/api/news/${id}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setBerita(data);
      
      // Jika konten kurang dari 500 karakter dan ada sourceUrl, scrape konten lengkap
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
        // Refresh data
        const updated = await fetch(`/api/news/${id}`);
        const data = await updated.json();
        setBerita(data);
      }
    } catch (err) {
      console.error('Scrape error:', err);
    } finally {
      setScraping(false);
    }
  };

  const incrementViews = async () => {
    try {
      await fetch(`/api/news/${id}/view`, { method: 'POST' });
    } catch (err) {
      console.error('Error incrementing views:', err);
    }
  };

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
        <h1>😅 Berita tidak ditemukan</h1>
        <Link href="/" style={styles.backButton}>Kembali ke Beranda</Link>
      </div>
    );
  }

  // Format konten menjadi paragraf
  const paragraphs = berita.isi?.split('\n').filter(p => p.trim().length > 0) || [];

  return (
    <>
      <Head>
        <title>{berita.judul} - Portal Berita</title>
        <meta name="description" content={berita.headline} />
      </Head>

      <div style={styles.container}>
        <Link href="/" style={styles.backLink}>← Kembali ke Beranda</Link>
        
        <article style={styles.article}>
          <div style={styles.articleHeader}>
            <span style={styles.articleCategory}>{berita.kategori || 'Umum'}</span>
            <h1 style={styles.articleTitle}>{berita.judul}</h1>
            <div style={styles.articleMeta}>
              <span>✍️ {berita.author || berita.sourceName || 'Unknown'}</span>
              <span>•</span>
              <span>📅 {new Date(berita.tanggal).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
              <span>•</span>
              <span>🕐 {berita.waktuBaca || 1} menit baca</span>
            </div>
          </div>

          {berita.gambar && berita.gambar !== '' && (
  <div style={styles.articleImageWrapper}>
    <img 
      src={berita.gambar} 
      alt={berita.judul}
      style={styles.articleImage}
      onError={(e) => {
        e.target.style.display = 'none';
        // Tampilkan placeholder
        const parent = e.target.parentElement;
        parent.innerHTML = `
          <div style="
            width: 100%; 
            height: 300px; 
            background: #f1f5f9; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            font-size: 64px;
            border-radius: 8px;
          ">📰</div>
        `;
      }}
    />
  </div>
)}

          <div style={styles.articleContent}>
            {scraping && (
              <div style={styles.scrapingNotice}>
                <span>🔄 Mengambil konten lengkap...</span>
              </div>
            )}
            
            {berita.headline && (
              <p style={styles.articleHeadline}>{berita.headline}</p>
            )}
            
            <div style={styles.articleBody}>
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
              <p style={styles.articleSource}>
                📌 Sumber: {berita.sourceUrl ? (
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
              <p style={styles.articleViews}>👁️ {berita.views || 0} kali dibaca</p>
            </div>
          </div>

          {/* Tombol ke sumber asli */}
          {berita.sourceUrl && (
            <div style={{ padding: '0 28px 28px' }}>
              <a 
                href={berita.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
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
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#1d4ed8';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#2563eb';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                📖 Baca Selengkapnya di {berita.sourceName || 'Sumber Asli'}
              </a>
            </div>
          )}
        </article>
      </div>
      <Comments newsId={berita.id} />
    </>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    minHeight: '100vh',
    background: '#f5f7fa'
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
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    overflow: 'hidden',
    border: '1px solid #f1f5f9'
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
    color: '#0f172a',
    lineHeight: 1.3,
    marginBottom: '12px'
  },
  articleMeta: {
    display: 'flex',
    gap: '8px',
    fontSize: '14px',
    color: '#94a3b8',
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
    background: '#f0f9ff',
    color: '#0369a1',
    padding: '10px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    textAlign: 'center'
  },
  articleHeadline: {
    fontSize: '18px',
    color: '#475569',
    lineHeight: 1.7,
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '2px solid #f1f5f9'
  },
  articleBody: {
    color: '#334155',
    lineHeight: 1.8
  },
  articleParagraph: {
    marginBottom: '16px',
    fontSize: '16px',
    textAlign: 'justify'
  },
  articleFooter: {
    padding: '16px 28px 12px',
    borderTop: '1px solid #f1f5f9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    fontSize: '14px',
    color: '#94a3b8'
  },
  articleSource: {
    color: '#475569'
  },
  articleViews: {
    color: '#94a3b8'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#f5f7fa',
    gap: '12px'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
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
    background: '#f5f7fa',
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
};