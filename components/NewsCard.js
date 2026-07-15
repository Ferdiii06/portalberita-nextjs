import Link from 'next/link';
import CategoryBadge from './CategoryBadge';

export default function NewsCard({ news }) {
  const imageSrc = news?.gambar || '/images/news-placeholder.svg';

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col h-full animate-slide-up">
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
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1.5">
            <i className="bx bx-calendar text-sm" aria-hidden="true" />
            {new Date(news.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span className="flex items-center gap-1.5">
            <i className="bx bx-time text-sm" aria-hidden="true" />
            {news.waktuBaca} min
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span className="flex items-center gap-1.5 text-slate-500">
            <i className="bx bx-comment text-sm" aria-hidden="true" />
            {news._count?.comments ?? 0}
          </span>
        </div>
        
        <Link href={`/berita/${news.id}`}>
          <h2 className="text-xl font-bold text-dark mb-3 line-clamp-2 hover:text-primary-600 transition-colors">
            {news?.judul || 'Judul berita belum tersedia'}
          </h2>
        </Link>
        
        <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-grow">
          {news?.headline || 'Informasi berita akan segera tersedia.'}
        </p>

        {news.comments?.[0] && (
          <div className="rounded-3xl bg-slate-50 px-4 py-3 mb-6 text-sm text-slate-600 border border-slate-100">
            <p className="font-semibold text-slate-800 line-clamp-1">Komentar terbaru:</p>
            <p className="line-clamp-2 mt-2">"{news.comments[0].isi}"</p>
            <p className="mt-2 text-xs text-slate-400">— {news.comments[0].nama}</p>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
          <span className="text-sm font-medium text-slate-700">{news?.author || 'Portal Berita'}</span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <i className="bx bx-show text-sm" aria-hidden="true" /> {news?.views || 0}
          </span>
        </div>
      </div>
    </div>
  );
}
