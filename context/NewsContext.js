// context/NewsContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Buat Context
const NewsContext = createContext();

// Export Context untuk digunakan di komponen lain
export { NewsContext };

// Provider component
export function NewsProvider({ children }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [breakingNews, setBreakingNews] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState('semua');
  const [search, setSearch] = useState('');

  // Fetch berita awal
  const fetchNews = async (page = 1, cat = category, searchTerm = search) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/news', {
        params: { 
          page, 
          limit: 20, 
          category: cat, 
          search: searchTerm 
        }
      });
      
      if (response.data) {
        setNews(response.data.news || []);
        setTotal(response.data.total || 0);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err.response?.data?.error || err.message || 'Gagal memuat berita');
      setNews([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Setup SSE
  useEffect(() => {
    fetchNews();

    if (typeof window !== 'undefined' && window.EventSource) {
      const eventSource = new EventSource('/api/stream');
      
      eventSource.onopen = () => {
        console.log('SSE connection opened');
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'news:new':
              setNews(prev => {
                const exists = prev.some(item => item.id === data.data.id);
                if (exists) return prev;
                return [data.data, ...prev];
              });
              setTotal(prev => prev + 1);
              break;
              
            case 'news:breaking':
              setBreakingNews(prev => {
                const exists = prev.some(item => item.id === data.data.id);
                if (exists) return prev;
                return [data.data, ...prev.slice(0, 4)];
              });
              break;
              
            case 'news:view':
              setNews(prev => 
                prev.map(item => 
                  item.id === data.data.id 
                    ? { ...item, views: data.data.views }
                    : item
                )
              );
              break;
              
            case 'breaking:initial':
              setBreakingNews(data.data || []);
              break;
          }
        } catch (err) {
          console.error('Error parsing SSE data:', err);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  }, []);

  useEffect(() => {
    fetchNews(1, category, search);
  }, [category, search]);

  const changePage = (page) => {
    fetchNews(page, category, search);
  };

  const value = {
    news,
    loading,
    error,
    total,
    currentPage,
    category,
    search,
    breakingNews,
    setCategory,
    setSearch,
    changePage,
    fetchNews,
    refreshNews: () => fetchNews(currentPage, category, search)
  };

  return (
    <NewsContext.Provider value={value}>
      {children}
    </NewsContext.Provider>
  );
}

// Custom hook untuk menggunakan NewsContext
export function useNews() {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within NewsProvider');
  }
  return context;
}