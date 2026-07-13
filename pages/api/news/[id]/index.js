// pages/api/news/[id]/index.js
import prisma from '../../../../lib/prisma.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Ambil berita berdasarkan ID
    const berita = await prisma.news.findUnique({
      where: { id }
    });

    if (!berita) {
      return res.status(404).json({ error: 'Berita tidak ditemukan' });
    }

    res.status(200).json(berita);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}