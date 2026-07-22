import { useContext, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import { NewsContext } from '../context/NewsContext';
import CategoryBadge from '../components/CategoryBadge';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Arsip() {
  const { news, loading, error } = useContext(NewsContext);
  const headingRef = useRef(null);
  const tableRef = useRef(null);

  // GSAP: Heading entrance
  useEffect(() => {
    if (!headingRef.current) return;
    let ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
      });
    });
    return () => ctx.revert();
  }, []);

  // GSAP: Table rows stagger on load
  useEffect(() => {
    if (!tableRef.current || loading) return;
    let ctx = gsap.context(() => {
      const rows = tableRef.current.querySelectorAll('tbody tr');
      if (rows.length) {
        gsap.from(rows, {
          opacity: 0,
          x: -40,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.06,
          scrollTrigger: {
            trigger: tableRef.current,
            start: 'top 85%',
            once: true,
          },
        });
      }
    });
    return () => ctx.revert();
  }, [loading, news]);

  return (
    <>
      <Head>
        <title>Arsip Berita - Portal Berita</title>
      </Head>
      <Header />
      
      <main className="pt-28 pb-16 min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-6 lg:px-12">
          
          <div ref={headingRef} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Manajemen Arsip</h1>
              <p className="text-slate-500 dark:text-slate-400">Kelola semua artikel berita yang telah dipublikasikan.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
            <div className="overflow-x-auto">
              <table ref={tableRef} className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="p-5">Judul Artikel</th>
                    <th className="p-5">Kategori</th>
                    <th className="p-5">Tanggal</th>
                    <th className="p-5">Stats</th>
                    <th className="p-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {news.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <img src={item.gambar || '/images/news-placeholder.svg'} alt="" className="w-16 h-12 rounded object-cover shrink-0" />
                          <div>
                            <Link href={`/berita/${item.id}`} className="font-bold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-1">
                              {item.judul}
                            </Link>
                            <span className="text-xs text-slate-400 dark:text-slate-500">Oleh: {item.author || 'Redaksi'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <CategoryBadge category={item.kategori} />
                      </td>
                      <td className="p-5 text-slate-500 dark:text-slate-400 text-sm">
                        {item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-' }
                      </td>
                      <td className="p-5 text-slate-500 dark:text-slate-400 text-sm">
                        {item.views ?? 0} Views
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/berita/${item.id}`} className="p-2 text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors bg-slate-100 dark:bg-slate-700 hover:bg-primary-50 dark:hover:bg-slate-600 rounded-lg" aria-label="Lihat detail berita">
                              <i className="bx bx-link text-sm" aria-hidden="true" />
                            </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {news.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-10 text-center text-slate-500 dark:text-slate-400">
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
