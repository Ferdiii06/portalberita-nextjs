import { createContext, useEffect, useState } from 'react';
export const NewsContext = createContext();
export function NewsProvider({ children }) {
  const [newsList, setNewsList] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('newsList');
    if (stored) setNewsList(JSON.parse(stored));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('newsList', JSON.stringify(newsList));
  }, [newsList]);

  const addNews = (item) => setNewsList(prev => [item, ...prev]);
  const deleteNews = (id) => setNewsList(prev => prev.filter(n => n.id !== id));

  return (
    <NewsContext.Provider value={{ newsList, addNews, deleteNews }}>
      {children}
    </NewsContext.Provider>
  );
}