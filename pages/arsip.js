import { useContext } from 'react';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import { NewsContext } from '../context/NewsContext';

export default function Arsip() {
  const { newsList } = useContext(NewsContext);
  return (
    <>
      <Header />
      <main className="container mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {newsList.map((n) => (
          <NewsCard key={n.id} news={n} />
        ))}
      </main>
    </>
  );
}