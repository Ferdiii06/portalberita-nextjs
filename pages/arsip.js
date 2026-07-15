import { useContext } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import { NewsContext } from '../context/NewsContext';
import CategoryBadge from '../components/CategoryBadge';

export default function Arsip() {
  const { news, loading, error } = useContext(NewsContext);

  return (
    <>
      <Head>
        <title>Arsip Berita - Portal Berita</title>
      </Head>
      <Header />
      
      <main className="pt-28 pb-16 min-h-screen bg-slate-50">
        <div className="container mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black text-dark mb-2">Manajemen Arsip</h1>
              <p className="text-slate-500">Kelola semua artikel berita yang telah dipublikasikan.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-sm font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-5">Judul Artikel</th>
                    <th className="p-5">Kategori</th>
                    <th className="p-5">Tanggal</th>
                    <th className="p-5">Stats</th>
                    <th className="p-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {news.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <img src={item.gambar || 'https://via.placeholder.com/150'} alt="" className="w-16 h-12 rounded object-cover shrink-0" />
                          <div>
                            <Link href={`/berita/${item.id}`} className="font-bold text-dark hover:text-primary-600 transition-colors line-clamp-1">
                              {item.judul}
                            </Link>
                            <span className="text-xs text-slate-400">Oleh: {item.author || 'Redaksi'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <CategoryBadge category={item.kategori} />
                      </td>
                      <td className="p-5 text-slate-500 text-sm">
                        {item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-' }
                      </td>
                      <td className="p-5 text-slate-500 text-sm">
                        {item.views ?? 0} Views
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/berita/${item.id}`} className="p-2 text-slate-400 hover:text-primary-600 transition-colors bg-slate-100 hover:bg-primary-50 rounded-lg" aria-label="Lihat detail berita">
                            ↗
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {news.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-10 text-center text-slate-500">
                        Belum ada berita yang diterbitkan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}