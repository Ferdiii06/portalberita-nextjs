import { useContext, useState } from 'react';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import Pagination from '../components/Pagination';
import { NewsContext } from '../context/NewsContext';

export default function Home() {
  const { newsList } = useContext(NewsContext);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filtered = newsList.filter(n =>
    n.judul.toLowerCase().includes(search.toLowerCase())
  );
  const total = Math.ceil(filtered.length / perPage);
  const slice = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <Header />
      {/* Hero Section */}
      <div className="hero-pattern bg-cover bg-center py-32 mb-12">
        <div className="container mx-auto text-center text-black px-4">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Selamat Datang di Portal Berita</h1>
          <p className="text-xl drop-shadow-md">Temukan berita terbaru di Portal Berita</p>
        </div>
      </div>
      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="flex justify-center mb-12">
          <input
            type="text"
            placeholder="Cari berita..."
            className="w-full max-w-lg p-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-primary"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        {/* Grid Berita */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {slice.map(news => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
        {/* Pagination */}
        {total > 1 && <Pagination page={page} total={total} onChange={setPage} />}
      </main>
    </>
  );
}