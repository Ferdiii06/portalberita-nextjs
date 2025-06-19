import { useContext } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import { NewsContext } from '../../context/NewsContext';

export default function BeritaDetail() {
  const { newsList } = useContext(NewsContext);
  const {
    query: { id },
  } = useRouter();

  const berita = newsList.find((x) => x.id.toString() === id);
  if (!berita)
    return (
      <>
        <Header />
        <p className="p-4">Berita tidak ditemukan.</p>
      </>
    );

  return (
    <>
      <Header />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4 text-primary">
          {berita.judul}
        </h1>
        {berita.gambar && (
          <img
            src={berita.gambar}
            alt={berita.judul}
            className="w-full mb-4 rounded"
          />
        )}
        <p className="text-gray-500 mb-2">
          {new Date(berita.tanggal).toLocaleString('id-ID')}
        </p>
        <p className="mb-4 font-semibold">{berita.headline}</p>
        <div className="prose">{berita.isi}</div>
      </main>
    </>
  );
}
