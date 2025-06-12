import { useRouter } from 'next/router';
import Link from 'next/link';

const beritaDummy = [
  {
    id: 1,
    judul: 'Judul Berita 1',
    gambar: '/uploads/6814fca1d5a21.jpg',
    pengirim: 'Admin',
    tanggal: '2025-06-10T10:00:00',
    kategori: 'Tekno',
    headline: 'Ini adalah ringkasan/headline berita 1...',
    isi: 'Isi lengkap berita 1...',
  },
  // Tambahkan berita lain di sini
];

export default function BeritaDetail() {
  const router = useRouter();
  const { id } = router.query;
  const berita = beritaDummy.find(b => b.id === Number(id));

  if (!berita) return <p>Berita tidak ditemukan.</p>;

  return (
    <>
      <header>
        <div className="header-container">
          <div className="logo">
            <h1><i className="fas fa-newspaper"></i> Portal Berita</h1>
          </div>
          <nav>
            <ul>
              <li><Link href="/"><i className="fas fa-home"></i> Home</Link></li>
              <li><Link href="/arsip"><i className="fas fa-archive"></i> Arsip</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="container">
        <article className="berita-detail">
          <h1>{berita.judul}</h1>
          <div className="meta-info">
            <span><i className="far fa-user"></i> {berita.pengirim}</span>
            <span><i className="far fa-calendar-alt"></i> {new Date(berita.tanggal).toLocaleString('id-ID')}</span>
            <span><i className="far fa-folder"></i> {berita.kategori}</span>
          </div>
          <div className="berita-gambar-container">
            <img src={berita.gambar} alt={berita.judul} className="berita-gambar" />
          </div>
          <div className="headline">
            <p><strong>{berita.headline}</strong></p>
          </div>
          <div className="content">
            <p>{berita.isi}</p>
          </div>
          <div className="actions">
            <Link href="/arsip" className="btn-back"><i className="fas fa-arrow-left"></i> Kembali ke Arsip</Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-info">
          <h3><i className="fas fa-newspaper"></i> Portal Berita</h3>
          <p>Menyajikan berita terkini dan terpercaya</p>
        </div>
        <div className="footer-links">
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/arsip">Arsip Berita</Link></li>
          </ul>
        </div>
        <div className="footer-copyright">
          <p>&copy; 2025 Portal Berita by Ferdii06. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}