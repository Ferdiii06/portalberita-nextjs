import Header from '../components/Header';
export default function About() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4 text-black">Tentang Portal Berita</h1>
        <p className="mb-4">
          Portal Berita adalah platform front-end modern yang dibangun menggunakan Next.js dan Tailwind CSS.
          Kami menyajikan berita terkini secara cepat, ringan, dan responsif tanpa memerlukan backend server.
          Dengan antarmuka yang intuitif, pengguna dapat membaca, mencari, dan mengunggah berita lengkap dengan gambar.
          Fitur unggulan kami meliputi upload gambar dengan preview langsung, pagination dinamis, serta penyimpanan data di localStorage,
          sehingga memastikan pengalaman yang lancar di berbagai perangkat dan kondisi koneksi.
        </p>
        <p>
          Dikembangkan oleh Ferdii06 pada tahun {new Date().getFullYear()}, Portal Berita bertujuan menjadi solusi
          front-end yang mudah digunakan, cepat, dan profesional untuk publikasi serta manajemen konten berita.
        </p>
      </main>
    </>
  );
}
