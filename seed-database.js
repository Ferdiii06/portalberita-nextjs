// seed-database.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Seeding database portal berita...');
    
    // Hapus semua data
    await prisma.news.deleteMany();
    console.log('✅ Data lama dihapus');
    
    // Data berita sesuai struktur database
    const berita = [
      {
        guid: 'news-1',
        judul: 'BREAKING: Indonesia Juara Piala Asia 2024',
        headline: 'Timnas Indonesia berhasil meraih kemenangan bersejarah di ajang Piala Asia setelah mengalahkan Jepang di final dengan skor 2-1.',
        isi: 'Pertandingan final berlangsung di Stadion Utama Gelora Bung Karno. Indonesia unggul lebih dulu melalui gol Marselino Ferdinan pada menit ke-35. Jepang menyamakan kedudukan di menit ke-70, namun gol penentu kemenangan dicetak oleh Rafael Struick di menit ke-90+3. Kemenangan ini menjadi sejarah pertama bagi Indonesia di Piala Asia.',
        gambar: 'https://via.placeholder.com/800x400/ff0000/ffffff?text=Indonesia+Juara',
        gallery: '[]',
        kategori: 'Olahraga',
        author: 'Tim Redaksi',
        tanggal: new Date(),
        waktuBaca: 3,
        views: 1250,
        sourceName: 'Kompas.com',
        sourceUrl: 'https://kompas.com'
      },
      {
        guid: 'news-2',
        judul: 'AI Generatif Mengubah Dunia Pendidikan',
        headline: 'Perkembangan AI generatif seperti ChatGPT mulai digunakan dalam dunia pendidikan untuk membantu proses belajar mengajar.',
        isi: 'Kementerian Pendidikan dan Kebudayaan meluncurkan program pilot penggunaan AI di 100 sekolah di seluruh Indonesia. Program ini bertujuan untuk meningkatkan efektivitas pembelajaran dan personalisasi materi sesuai kebutuhan siswa.',
        gambar: 'https://via.placeholder.com/800x400/0066ff/ffffff?text=AI+Pendidikan',
        gallery: '[]',
        kategori: 'Teknologi',
        author: 'Tim Redaksi',
        tanggal: new Date(Date.now() - 1000 * 60 * 15),
        waktuBaca: 4,
        views: 890,
        sourceName: 'Detik.com',
        sourceUrl: 'https://detik.com'
      },
      {
        guid: 'news-3',
        judul: 'Ekonomi Digital Tumbuh 15% di Kuartal III',
        headline: 'Pertumbuhan ekonomi digital Indonesia menunjukkan tren positif dengan peningkatan transaksi mencapai 15% dibandingkan kuartal sebelumnya.',
        isi: 'Bank Indonesia melaporkan bahwa transaksi digital di Indonesia mencapai Rp 500 triliun selama kuartal III tahun ini. Pertumbuhan ini didorong oleh meningkatnya penggunaan e-commerce dan dompet digital di masyarakat.',
        gambar: 'https://via.placeholder.com/800x400/00cc66/ffffff?text=Ekonomi+Digital',
        gallery: '[]',
        kategori: 'Ekonomi',
        author: 'Tim Redaksi',
        tanggal: new Date(Date.now() - 1000 * 60 * 30),
        waktuBaca: 5,
        views: 567,
        sourceName: 'CNN Indonesia',
        sourceUrl: 'https://cnnindonesia.com'
      },
      {
        guid: 'news-4',
        judul: 'Film Horor Indonesia Tembus 8 Juta Penonton',
        headline: 'Film horor produksi Indonesia berhasil menembus angka 8 juta penonton dalam waktu 3 minggu penayangan.',
        isi: 'Film dengan judul "Dunia Hantu" ini menjadi fenomena di kalangan pecinta film horor. Cerita yang diangkat dari kisah nyata dan efek visual yang memukau menjadi daya tarik utama film ini.',
        gambar: 'https://via.placeholder.com/800x400/cc00ff/ffffff?text=Film+Horor',
        gallery: '[]',
        kategori: 'Hiburan',
        author: 'Tim Redaksi',
        tanggal: new Date(Date.now() - 1000 * 60 * 45),
        waktuBaca: 3,
        views: 234,
        sourceName: 'Liputan6.com',
        sourceUrl: 'https://liputan6.com'
      },
      {
        guid: 'news-5',
        judul: 'Gempa Bumi 6.1 SR Guncang Lombok',
        headline: 'Gempa bumi berkekuatan 6.1 SR mengguncang Pulau Lombok dan sekitarnya, tidak ada korban jiwa dilaporkan.',
        isi: 'Badan Meteorologi Klimatologi dan Geofisika (BMKG) melaporkan gempa terjadi pada pukul 08.15 WIB dengan kedalaman 10 km. Gempa dirasakan hingga ke Bali dan Sumbawa. Masyarakat diimbau untuk tetap waspada terhadap gempa susulan.',
        gambar: 'https://via.placeholder.com/800x400/ff6600/ffffff?text=Gempa+Lombok',
        gallery: '[]',
        kategori: 'Berita',
        author: 'Tim Redaksi',
        tanggal: new Date(Date.now() - 1000 * 60 * 60),
        waktuBaca: 2,
        views: 4321,
        sourceName: 'Tempo.co',
        sourceUrl: 'https://tempo.co'
      },
      {
        guid: 'news-6',
        judul: 'Program Makan Siang Gratis Resmi Diluncurkan',
        headline: 'Pemerintah resmi meluncurkan program makan siang gratis untuk pelajar di seluruh Indonesia.',
        isi: 'Program ini merupakan bagian dari upaya pemerintah untuk meningkatkan gizi anak-anak Indonesia. Target awal adalah 20 juta pelajar dari tingkat SD hingga SMA akan menerima manfaat program ini.',
        gambar: 'https://via.placeholder.com/800x400/33ccff/ffffff?text=Makan+Siang+Gratis',
        gallery: '[]',
        kategori: 'Berita',
        author: 'Tim Redaksi',
        tanggal: new Date(Date.now() - 1000 * 60 * 90),
        waktuBaca: 3,
        views: 3456,
        sourceName: 'Kompas.com',
        sourceUrl: 'https://kompas.com'
      },
      {
        guid: 'news-7',
        judul: 'Apple Luncurkan iPhone 16 dengan AI Terbaru',
        headline: 'Apple secara resmi meluncurkan iPhone 16 dengan fitur AI terbaru yang mampu menerjemahkan secara real-time.',
        isi: 'iPhone 16 hadir dengan prosesor A18 Bionic yang dilengkapi Neural Engine terbaru. Fitur unggulan lainnya adalah kemampuan menerjemahkan percakapan secara real-time dalam 50 bahasa dan fitur editing foto berbasis AI.',
        gambar: 'https://via.placeholder.com/800x400/999999/ffffff?text=iPhone+16',
        gallery: '[]',
        kategori: 'Teknologi',
        author: 'Tim Redaksi',
        tanggal: new Date(Date.now() - 1000 * 60 * 120),
        waktuBaca: 4,
        views: 789,
        sourceName: 'Detik.com',
        sourceUrl: 'https://detik.com'
      },
      {
        guid: 'news-8',
        judul: 'Timnas Indonesia Kalahkan Malaysia 3-0',
        headline: 'Timnas Indonesia berhasil mengalahkan Malaysia dengan skor 3-0 di laga persahabatan internasional.',
        isi: 'Tiga gol Indonesia dicetak oleh Witan Sulaeman (menit 23), Egy Maulana Vikri (menit 45+2), dan Ramadhan Sananta (menit 78). Kemenangan ini menjadi modal penting menjelang kualifikasi Piala Dunia.',
        gambar: 'https://via.placeholder.com/800x400/00ccff/ffffff?text=Indonesia+Vs+Malaysia',
        gallery: '[]',
        kategori: 'Olahraga',
        author: 'Tim Redaksi',
        tanggal: new Date(Date.now() - 1000 * 60 * 150),
        waktuBaca: 2,
        views: 2100,
        sourceName: 'CNN Indonesia',
        sourceUrl: 'https://cnnindonesia.com'
      }
    ];
    
    console.log(`📝 Menambahkan ${berita.length} berita...`);
    
    for (const item of berita) {
      await prisma.news.create({ data: item });
      console.log(`✅ ${item.judul.slice(0, 40)}...`);
    }
    
    const count = await prisma.news.count();
    console.log(`✅ Selesai! Total ${count} berita di database.`);
    console.log('🚀 Silakan buka http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();