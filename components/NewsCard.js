import Link from 'next/link';
import { useRef, useEffect } from 'react';
import CategoryBadge from './CategoryBadge';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function NewsCard({ news }) {
  const cardRef = useRef(null);
  const imageSrc = news?.gambar || '/images/news-placeholder.svg';

  useEffect(() => {
    if (!cardRef.current) return;
    let ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
          once: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={cardRef} className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-700 transition-all duration-300 flex flex-col h-full">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={imageSrc}
          alt={news?.judul || 'Berita'}
          loading="eager"
          decoding="async"
          onError={(e) => {
            e.currentTarget.src = '/images/news-placeholder.svg';
          }}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <CategoryBadge category={news.kategori} />
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <span className="flex items-center gap-1.5">
            <i className="bx bx-calendar text-sm" aria-hidden="true" />
            {new Date(news.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span className="flex items-center gap-1.5">
            <i className="bx bx-time text-sm" aria-hidden="true" />
            {news.waktuBaca} min
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <i className="bx bx-comment text-sm" aria-hidden="true" />
            {news._count?.comments ?? 0}
          </span>
        </div>
        
        <Link href={`/berita/${news.id}`}>
          <h2 className="text-xl font-bold text-dark dark:text-white mb-3 line-clamp-2 hover:text-primary-600 transition-colors">
            {news?.judul || 'Judul berita belum tersedia'}
          </h2>
        </Link>
        
        <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3 mb-4 flex-grow">
          {news?.headline || 'Informasi berita akan segera tersedia.'}
        </p>

        {news.comments?.[0] && (
          <div className="rounded-3xl bg-slate-50 dark:bg-slate-700/50 px-4 py-3 mb-6 text-sm text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
            <p className="font-semibold text-slate-800 dark:text-white line-clamp-1">Komentar terbaru:</p>
            <p className="line-clamp-2 mt-2">"{news.comments[0].isi}"</p>
            <p className="mt-2 text-xs text-slate-400">— {news.comments[0].nama}</p>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{news?.author || 'Portal Berita'}</span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <i className="bx bx-show text-sm" aria-hidden="true" /> {news?.views || 0}
          </span>
        </div>
      </div>
    </div>
  );
}
