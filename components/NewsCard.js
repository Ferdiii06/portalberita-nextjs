import { useContext } from 'react';
import Link from 'next/link';
import { NewsContext } from '../context/NewsContext';

export default function NewsCard({ news }) {
  const { deleteNews } = useContext(NewsContext);
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col">
      {news.gambar && <img src={news.gambar} alt={news.judul} className="w-full h-40 object-cover rounded mb-4" />}
      <h2 className="text-xl font-semibold mb-2 text-primary">{news.judul}</h2>
      <p className="text-gray-500 text-sm mb-2">{new Date(news.tanggal).toLocaleString('id-ID')}</p>
      <p className="flex-grow text-gray-700 mb-4">{news.headline}</p>
      <div className="flex space-x-2">
        <Link href={`/berita/${news.id}`} className="flex-grow bg-primary text-white py-2 px-4 rounded hover:bg-secondary text-center">Baca Selengkapnya</Link>
        <button onClick={() => deleteNews(news.id)} className="bg-danger text-white py-2 px-4 rounded hover:opacity-80">Hapus</button>
      </div>
    </div>
  );
}
