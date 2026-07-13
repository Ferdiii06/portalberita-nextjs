// components/BreakingNewsBanner.js
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { NewsContext } from '../context/NewsContext';
// Hapus import react-icons dulu jika belum install
// import { FiZap, FiX } from 'react-icons/fi';

export default function BreakingNewsBanner() {
  // Gunakan useNews hook atau useContext
  const { breakingNews } = useContext(NewsContext) || { breakingNews: [] };
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (breakingNews.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % breakingNews.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [breakingNews]);

  if (!breakingNews || breakingNews.length === 0 || !isVisible) {
    return null;
  }

  const currentNews = breakingNews[currentIndex] || breakingNews[0];

  return (
    <div style={{
      background: 'linear-gradient(90deg, #dc2626, #b91c1c)',
      color: 'white',
      padding: '10px 20px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          background: 'white',
          color: '#dc2626',
          padding: '2px 10px',
          borderRadius: '4px',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          BREAKING
        </span>
        <Link href={`/berita/${currentNews.id}`} style={{ color: 'white', textDecoration: 'none' }}>
          <span style={{ fontWeight: '500' }}>
            {currentNews.title}
          </span>
        </Link>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          fontSize: '20px'
        }}
      >
        ✕
      </button>
    </div>
  );
}