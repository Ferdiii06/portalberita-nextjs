import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-10">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4 lg:gap-8">
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 text-2xl font-black text-white">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500 text-white">P</span>
              <span>Portal <span className="text-sky-400">Berita</span></span>
            </Link>
            <p className="max-w-sm leading-7 text-slate-400">
              Menyajikan berita terkini dari berbagai sumber terpercaya. Ikuti perkembangan nasional, internasional, ekonomi, teknologi, dan olahraga setiap hari.
            </p>
            <div className="flex items-center gap-3 text-sm">
              <a href="#" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-800 text-slate-300 transition hover:bg-sky-500 hover:text-white" aria-label="Facebook">
                F
              </a>
              <a href="#" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-800 text-slate-300 transition hover:bg-sky-500 hover:text-white" aria-label="Twitter">
                T
              </a>
              <a href="#" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-800 text-slate-300 transition hover:bg-sky-500 hover:text-white" aria-label="Instagram">
                I
              </a>
              <a href="#" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-800 text-slate-300 transition hover:bg-sky-500 hover:text-white" aria-label="YouTube">
                Y
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Kategori Populer</h3>
            <ul className="mt-6 space-y-3 text-slate-300">
              <li><Link href="#" className="transition hover:text-sky-400">Nasional</Link></li>
              <li><Link href="#" className="transition hover:text-sky-400">Internasional</Link></li>
              <li><Link href="#" className="transition hover:text-sky-400">Ekonomi</Link></li>
              <li><Link href="#" className="transition hover:text-sky-400">Teknologi</Link></li>
              <li><Link href="#" className="transition hover:text-sky-400">Olahraga</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Perusahaan</h3>
            <ul className="mt-6 space-y-3 text-slate-300">
              <li><Link href="/about" className="transition hover:text-sky-400">Tentang Kami</Link></li>
              <li><Link href="#" className="transition hover:text-sky-400">Redaksi</Link></li>
              <li><Link href="#" className="transition hover:text-sky-400">Pedoman Media Siber</Link></li>
              <li><Link href="#" className="transition hover:text-sky-400">Karir</Link></li>
              <li><Link href="#" className="transition hover:text-sky-400">Hubungi Kami</Link></li>
            </ul>
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