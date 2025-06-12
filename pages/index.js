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
  },
  // Tambahkan berita lain di sini
];

export default function Home() {
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
        <h1><i className="fas fa-newspaper"></i> Berita Terkini</h1>
        <div className="berita-terbaru">
          {beritaDummy.map(berita => (
            <article className="berita-item" key={berita.id}>
              <img src={berita.gambar} alt="Gambar Berita" />
              <h2>
                <Link href={`/berita/${berita.id}`}>{berita.judul}</Link>
              </h2>
              <div className="meta-info">
                <span><i className="far fa-user"></i> {berita.pengirim}</span>
                <span><i className="far fa-calendar-alt"></i> {new Date(berita.tanggal).toLocaleString('id-ID')}</span>
                <span><i className="far fa-folder"></i> {berita.kategori}</span>
              </div>
              <div className="headline">
                <p>{berita.headline}</p>
              </div>
              <Link href={`/berita/${berita.id}`} className="read-more">Baca selengkapnya...</Link>
            </article>
          ))}
        </div>
        <div className="more-news">
          <Link href="/arsip" className="btn-more"><i className="fas fa-book-open"></i> Lihat Arsip Berita</Link>
        </div>
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