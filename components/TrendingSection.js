import Link from 'next/link';
import CategoryBadge from './CategoryBadge';

export default function TrendingSection({ news }) {
  if (!news || news.length === 0) return null;

  const topNews = news[0];
  const sideNews = news.slice(1, 4);
  const topImage = topNews?.gambar || '/images/news-placeholder.svg';

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-dark tracking-tight">Berita <span className="text-primary-600">Terhangat</span></h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Highlight */}
        <div className="lg:col-span-2 group relative rounded-2xl overflow-hidden shadow-lg h-[400px] lg:h-[500px]">
          <img src={topImage} alt={topNews?.judul || 'Berita'} loading="eager" decoding="async" onError={(e) => { e.currentTarget.src = '/images/news-placeholder.svg'; }} className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-8 w-full">
            <div className="mb-4">
              <CategoryBadge category={topNews.kategori} />
            </div>
            <Link href={`/berita/${topNews.id}`}>
              <h3 className="text-2xl lg:text-4xl font-bold text-white mb-4 leading-tight hover:underline decoration-primary-500 underline-offset-4">
                {topNews?.judul || 'Judul berita belum tersedia'}
              </h3>
            </Link>
            <div className="flex items-center text-slate-300 text-sm gap-4">
              <span className="flex items-center gap-1.5">👤 {topNews?.author || 'Portal Berita'}</span>
              <span className="flex items-center gap-1.5">📅 {new Date(topNews?.tanggal || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Side News */}
        <div className="flex flex-col gap-6">
          {sideNews.map(item => (
            <div key={item.id} className="flex gap-4 group">
              <div className="w-32 h-24 shrink-0 rounded-xl overflow-hidden relative">
                <img src={item?.gambar || '/images/news-placeholder.svg'} alt={item?.judul || 'Berita'} loading="eager" decoding="async" onError={(e) => { e.currentTarget.src = '/images/news-placeholder.svg'; }} className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="mb-1">
                  <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">{item.kategori}</span>
                </div>
                <Link href={`/berita/${item.id}`}>
                  <h4 className="font-bold text-dark leading-snug line-clamp-2 hover:text-primary-600 transition-colors">
                    {item?.judul || 'Judul berita belum tersedia'}
                  </h4>
                </Link>
                <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  📅 {new Date(item?.tanggal || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
