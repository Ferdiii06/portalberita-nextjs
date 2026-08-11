import Link from 'next/link';

export default function NewsCard({ news }) {
  const imageSrc = news?.gambar || '/images/news-placeholder.svg';

  return (
    <div className="group flex flex-col h-full">
      <Link href={`/berita/${news.id}`} className="block flex-grow">
        <div className="news-image-container relative aspect-[4/3] overflow-hidden bg-gray-50 rounded-xl mb-5">
          <img 
            src={imageSrc}
            alt={news?.judul || 'Berita'}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.src = '/images/news-placeholder.svg';
            }}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
            {news.kategori}
          </span>
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-3 leading-snug group-hover:text-gray-500 transition-colors">
            {news?.judul || 'Judul berita belum tersedia'}
          </h2>
          
          <p className="text-gray-500 text-sm line-clamp-3 mb-4 font-serif leading-relaxed">
            {news?.headline || 'Informasi ringkas artikel akan muncul di sini untuk memberikan konteks bacaan.'}
          </p>
        </div>
      </Link>
      
      <div className="mt-auto pt-4 flex items-center gap-3 text-[11px] uppercase tracking-widest font-semibold text-gray-400">
        <span>{new Date(news.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
        <span>{news?.author || 'Penulis'}</span>
      </div>
    </div>
  );
}
