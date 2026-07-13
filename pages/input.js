import Link from 'next/link';
import Head from 'next/head';
import Header from '../components/Header';

export default function InputBerita() {
  return (
    <>
      <Head><title>Fitur Nonaktif - Portal Berita</title></Head>
      <Header />
      <main className="pt-28 pb-16 bg-slate-50 min-h-screen">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 text-center">
            <h1 className="text-3xl font-black text-dark mb-3">Fitur Penulisan Berita Nonaktif</h1>
            <p className="text-slate-500 mb-8">
              Situs ini difokuskan untuk menampilkan berita secara realtime, sehingga form penambahan berita sudah dihapus.
            </p>
            <Link href="/" className="inline-flex items-center justify-center bg-primary-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
