import Link from 'next/link';
import { useRef, useEffect } from 'react';
import CategoryBadge from './CategoryBadge';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TrendingSection({ news }) {
  const sectionRef = useRef(null);
  const mainRef = useRef(null);
  const sideRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    let ctx = gsap.context(() => {
      // Heading fade-up
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 88%',
            once: true,
          },
        });
      }

      // Main highlight: fade + scale-up
      if (mainRef.current) {
        gsap.from(mainRef.current, {
          opacity: 0,
          scale: 0.97,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: mainRef.current,
            start: 'top 85%',
            once: true,
          },
        });
      }

      // Side news: stagger slide from right
      if (sideRef.current) {
        const items = sideRef.current.querySelectorAll('.side-news-item');
        gsap.from(items, {
          opacity: 0,
          x: 50,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: sideRef.current,
            start: 'top 85%',
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (!news || news.length === 0) return null;

  const topNews = news[0];
  const sideNews = news.slice(1, 4);
  const topImage = topNews?.gambar || '/images/news-placeholder.svg';

  return (
    <section ref={sectionRef} className="mb-16">
      <div ref={headingRef} className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-dark tracking-tight">Berita <span className="text-primary-600">Terhangat</span></h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Highlight */}
        <div ref={mainRef} className="lg:col-span-2 group relative rounded-2xl overflow-hidden shadow-lg h-[400px] lg:h-[500px]">
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
              <span className="flex items-center gap-1.5">
                <i className="bx bx-user text-sm" aria-hidden="true" />
                {topNews?.author || 'Portal Berita'}
              </span>
              <span className="flex items-center gap-1.5">
                <i className="bx bx-calendar text-sm" aria-hidden="true" />
                {new Date(topNews?.tanggal || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Side News */}
        <div ref={sideRef} className="flex flex-col gap-6">
          {sideNews.map(item => (
            <div key={item.id} className="side-news-item flex gap-4 group">
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
                  <i className="bx bx-calendar text-sm" aria-hidden="true" />
                  {new Date(item?.tanggal || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

