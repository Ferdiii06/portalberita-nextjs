import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useState, useEffect } from 'react';

// Data simulasi harga sembako
const hargaSembako = [
  { nama: 'Sen', Beras: 14000, Telur: 27000, Gula: 16000 },
  { nama: 'Sel', Beras: 14200, Telur: 26500, Gula: 16000 },
  { nama: 'Rab', Beras: 14500, Telur: 26000, Gula: 16500 },
  { nama: 'Kam', Beras: 14400, Telur: 27500, Gula: 16500 },
  { nama: 'Jum', Beras: 14600, Telur: 28000, Gula: 17000 },
  { nama: 'Sab', Beras: 14800, Telur: 28500, Gula: 17200 },
  { nama: 'Min', Beras: 15000, Telur: 29000, Gula: 17500 },
];

// Data simulasi sentimen publik
const sentimenPublik = [
  { isu: 'Ekonomi', Positif: 45, Negatif: 55 },
  { isu: 'Politik', Positif: 30, Negatif: 70 },
  { isu: 'Sosial', Positif: 65, Negatif: 35 },
  { isu: 'Teknologi', Positif: 80, Negatif: 20 },
  { isu: 'Lingkungan', Positif: 50, Negatif: 50 },
];

export default function DataPublik() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard Data Publik - Insight Berita</title>
        <meta name="description" content="Visualisasi data real-time untuk transparansi publik" />
      </Head>

      <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
        <Header />

        <main className="flex-grow w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-20">
          <div className="border-b border-gray-900 pb-4 mb-12">
             <h1 className="text-4xl lg:text-5xl font-serif font-black tracking-tight text-gray-900 mb-4">
               Data<span className="font-light italic text-gray-400">Publik</span>
             </h1>
             <p className="text-gray-500 font-serif italic text-lg max-w-3xl">
               Inisiatif keterbukaan data dari Insight Berita. Jelajahi tren harga kebutuhan pokok dan sentimen masyarakat secara real-time.
             </p>
          </div>

          {mounted ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Chart 1: Garis Harga Sembako */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 className="font-serif font-bold text-xl text-gray-900 mb-2">Tren Harga Sembako (Rp)</h3>
                <p className="text-sm text-gray-500 mb-6">Pergerakan harga beras, telur, dan gula selama seminggu terakhir.</p>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={hargaSembako} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="nama" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                      <Line type="monotone" dataKey="Beras" stroke="#111827" strokeWidth={3} dot={{r:4}} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Telur" stroke="#ef4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="Gula" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Bar Sentimen Publik */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 className="font-serif font-bold text-xl text-gray-900 mb-2">Sentimen Isu Nasional (%)</h3>
                <p className="text-sm text-gray-500 mb-6">Perbandingan sentimen positif vs negatif pada perbincangan publik bulan ini.</p>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sentimenPublik} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="isu" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                      <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar dataKey="Positif" fill="#111827" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Negatif" fill="#9ca3af" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 font-serif italic">
              Memuat visualisasi data...
            </div>
          )}

          <div className="mt-12 p-8 bg-gray-900 text-white rounded-2xl text-center">
            <h2 className="text-2xl font-serif font-bold mb-3">Unduh Laporan Lengkap</h2>
            <p className="text-gray-400 text-sm mb-6 max-w-xl mx-auto">
              Dapatkan dataset mentah dan analisis mendalam dari tim jurnalisme data kami (format CSV/PDF). Tersedia eksklusif untuk pelanggan korporat.
            </p>
            <button className="bg-white text-gray-900 px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
              Minta Akses Data
            </button>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
