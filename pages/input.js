import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { NewsContext } from '../context/NewsContext';

export default function InputBerita() {
  const { addNews } = useContext(NewsContext);
  const router = useRouter();
  const [form, setForm] = useState({ judul: '', tanggal: '', headline: '', isi: '', gambar: '' });
  const [preview, setPreview] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFile = e => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setForm(prev => ({ ...prev, gambar: url }));
      setPreview(url);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.judul || !form.tanggal || !form.headline || !form.isi) {
      alert('Semua field harus diisi!');
      return;
    }
    addNews({ id: Date.now(), ...form });
    // Redirect langsung ke halaman Arsip agar berita baru terlihat langsung
    router.push('/arsip');
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-black">Input Berita Baru</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Judul</label>
            <input name="judul" onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Masukkan judul berita" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Tanggal</label>
            <input name="tanggal" type="datetime-local" onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Headline</label>
            <input name="headline" onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ringkasan berita" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Isi Berita</label>
            <textarea name="isi" rows={6} onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Tulis isi lengkap berita" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Gambar</label>
            <input type="file" accept="image/*" onChange={handleFile}
              className="block w-full text-sm text-gray-600" />
            {preview && (
              <img src={preview} alt="Preview"
                className="mt-4 max-h-64 rounded-md object-cover" />
            )}
          </div>
          <button type="submit"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-black transition">
            Submit
          </button>
        </form>
      </main>
    </>
  );
}
