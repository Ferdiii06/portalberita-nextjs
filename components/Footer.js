import Link from 'next/link';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// supaya link di footer benar-benar mengarah ke filter yang valid.
const popularCategories = [
  { id: 'Berita', label: 'Berita' },
  { id: 'Teknologi', label: 'Teknologi' },
  { id: 'Olahraga', label: 'Olahraga' },
  { id: 'Ekonomi', label: 'Ekonomi' },
  { id: 'Hiburan', label: 'Hiburan' },
];

const socialLinks = [
  { label: 'Facebook', href: '#', icon: 'bxl-facebook' },
  { label: 'Twitter / X', href: '#', icon: 'bxl-twitter' },
  { label: 'Instagram', href: '#', icon: 'bxl-instagram' },
  { label: 'YouTube', href: '#', icon: 'bxl-youtube' },
];

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    if (!footerRef.current) return;
    let ctx = gsap.context(() => {
      const cols = footerRef.current.querySelectorAll('.footer-col');
      if (cols.length) {
        gsap.from(cols, {
          opacity: 0,
          y: 40,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            once: true,
          },
        });
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-slate-950 text-slate-300 pt-16 pb-10 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4 lg:gap-8">
          <div className="footer-col space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 text-2xl font-black text-white">
              <span>Insight <span className="text-sky-400">News</span></span>
            </Link>
            <p className="max-w-sm leading-7 text-slate-400">
              Menyajikan berita terkini dari berbagai sumber terpercaya. Ikuti perkembangan nasional, internasional, ekonomi, teknologi, dan olahraga setiap hari.
            </p>
          </div>

          <div className="footer-col">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Kategori Populer</h3>
            <ul className="mt-6 space-y-3 text-slate-300">
              {popularCategories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/?kategori=${cat.id}`} className="transition hover:text-sky-400">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Perusahaan</h3>
            <ul className="mt-6 space-y-3 text-slate-300">
              <li><Link href="/about" className="transition hover:text-sky-400">Tentang Kami</Link></li>
              <li><Link href="#" className="transition hover:text-sky-400">Redaksi</Link></li>
              <li><Link href="#" className="transition hover:text-sky-400">Pedoman Media Siber</Link></li>
              <li><Link href="#" className="transition hover:text-sky-400">Karir</Link></li>
              <li><Link href="#" className="transition hover:text-sky-400">Hubungi Kami</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Ikuti Kami</h3>
            <p className="mt-6 text-sm leading-6 text-slate-400">
              Update berita tercepat ada di media sosial kami.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-800/60 text-slate-300 transition hover:border-sky-400 hover:text-sky-400"
                >
                  <i className={`bx ${social.icon} text-lg`} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800/70 pt-8 text-sm text-slate-500">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} Insight News. Semua hak dilindungi.</p>
            <p className="max-w-xl leading-6">Berita terkini setiap saat. Ikuti kami untuk update cepat dan ringkas.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}