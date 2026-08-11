import Link from 'next/link';

export default function TrendingSection({ news }) {
  if (!news || news.length === 0) return null;

  const topNews = news[0];
  const sideNews = news.slice(1, 4);
  const topImage = topNews?.gambar || '/images/news-placeholder.svg';

  return (
    <div className="w-full pt-4">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Highlight */}
        <div className="lg:col-span-8 group">
          <Link href={`/berita/${topNews.id}`} className="block">
            <div className="news-image-container w-full bg-gray-50 mb-6 rounded-xl relative" style={{ aspectRatio: '16/9' }}>
              <img 
                src={topImage} 
                alt={topNews?.judul || 'Berita'} 
                loading="eager" 
                onError={(e) => { e.currentTarget.src = '/images/news-placeholder.svg'; }} 
                className="w-full h-full object-cover rounded-xl" 
              />
            </div>
            
            <div className="max-w-3xl mx-auto text-center lg:text-left">
              <span className="inline-block text-xs font-bold text-gray-900 uppercase tracking-widest mb-3 border-b border-gray-900 pb-1">
                {topNews.kategori}
              </span>
              <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-gray-600 transition-colors">
                {topNews?.judul || 'Judul berita belum tersedia'}
              </h3>
              
              <p className="text-gray-600 leading-relaxed text-lg mb-4 font-serif">
                {topNews?.headline || 'Keterangan ringkas berita akan ditampilkan di sini sebagai pengantar yang elegan untuk para pembaca.'}
              </p>
              
              <div className="flex items-center justify-center lg:justify-start text-gray-500 text-xs gap-3 uppercase tracking-wider font-semibold">
                <span>{new Date(topNews?.tanggal || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span>—</span>
                <span>Oleh {topNews?.author || 'Redaksi'}</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Side News */}
        <div className="lg:col-span-4 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-200 pt-8 lg:pt-0 lg:pl-10">
          <h3 className="font-serif text-xl italic text-gray-900 mb-6">Pilihan Editor</h3>
          
          <div className="flex flex-col gap-8 h-full">
            {sideNews.map(item => (
              <Link key={item.id} href={`/berita/${item.id}`} className="group flex flex-col">
                <div className="news-image-container w-full h-40 bg-gray-50 rounded-xl mb-4">
                  <img 
                    src={item?.gambar || '/images/news-placeholder.svg'} 
                    alt={item?.judul || 'Berita'} 
                    loading="lazy" 
                    onError={(e) => { e.currentTarget.src = '/images/news-placeholder.svg'; }} 
                    className="w-full h-full object-cover rounded-xl" 
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">{item.kategori}</span>
                  <h4 className="font-serif font-bold text-lg text-gray-900 leading-snug group-hover:text-gray-600 transition-colors mb-2">
                    {item?.judul || 'Judul berita belum tersedia'}
                  </h4>
                  <div className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mt-auto">
                    {new Date(item?.tanggal || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
