import Link from 'next/link';

const popularCategories = [
  { id: 'Berita', label: 'Berita' },
  { id: 'Teknologi', label: 'Teknologi' },
  { id: 'Olahraga', label: 'Olahraga' },
  { id: 'Ekonomi', label: 'Ekonomi' },
  { id: 'Hiburan', label: 'Hiburan' },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-10 text-gray-900 mt-10">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4 lg:gap-8">
          <div className="space-y-6 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-1 text-2xl font-serif font-black tracking-tight">
              INSIGHT<span className="font-light italic text-gray-500">BERITA</span>
            </Link>
            <p className="max-w-sm leading-relaxed text-gray-500 text-sm font-serif">
              Menyajikan liputan mendalam, tajuk rencana, dan cerita yang paling banyak dibicarakan. Jurnalisme berkelas untuk pembaca modern.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 mb-6 border-b border-gray-900 pb-2 inline-block">Kategori</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              {popularCategories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/?kategori=${cat.id}`} className="transition-colors hover:text-gray-900 font-medium">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 mb-6 border-b border-gray-900 pb-2 inline-block">Perusahaan</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/about" className="transition-colors hover:text-gray-900 font-medium">Tentang Redaksi</Link></li>
              <li><Link href="#" className="transition-colors hover:text-gray-900 font-medium">Pedoman Media Siber</Link></li>
              <li><Link href="#" className="transition-colors hover:text-gray-900 font-medium">Karir</Link></li>
              <li><Link href="#" className="transition-colors hover:text-gray-900 font-medium">Hubungi Kami</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900 mb-6 border-b border-gray-900 pb-2 inline-block">Newsletter</h3>
            <p className="text-sm leading-relaxed text-gray-500 mb-4 font-serif">
              Dapatkan ringkasan berita pilihan editor langsung ke kotak masuk surel Anda.
            </p>
            <form className="flex border-b border-gray-300 pb-1">
              <input 
                type="email" 
                placeholder="Alamat surel Anda" 
                className="w-full bg-transparent text-sm focus:outline-none text-gray-900 placeholder-gray-400 font-serif italic"
              />
              <button type="button" className="text-gray-900 text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition-colors">
                Daftar
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
          <p>© {new Date().getFullYear()} INSIGHTBERITA. Hak Cipta Dilindungi.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900 transition-colors">Twitter</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Instagram</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
}