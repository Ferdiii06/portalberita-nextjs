// pages/api/comments/index.js
import prisma from '../../../lib/prisma.js';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const { newsId } = req.query;
    
    if (!newsId) {
      return res.status(400).json({ error: 'newsId diperlukan' });
    }

    try {
      const comments = await prisma.comment.findMany({
        where: { 
          newsId: String(newsId),
          isApproved: true 
        },
        orderBy: { createdAt: 'desc' }
      });

      const total = await prisma.comment.count({
        where: { 
          newsId: String(newsId),
          isApproved: true 
        }
      });

      res.status(200).json({ comments, total });
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: error.message });
    }
  }

  else if (method === 'POST') {
    const { newsId, nama, email, isi } = req.body;

    if (!newsId || !nama || !isi) {
      return res.status(400).json({ 
        error: 'newsId, nama, dan isi komentar wajib diisi' 
      });
    }

    try {
      const news = await prisma.news.findUnique({
        where: { id: String(newsId) }
      });

      if (!news) {
        return res.status(404).json({ error: 'Berita tidak ditemukan' });
      }

      const comment = await prisma.comment.create({
        data: {
          newsId: String(newsId),
          nama: nama.trim(),
          email: email?.trim() || '',
          isi: isi.trim(),
          isApproved: true
        }
      });

      res.status(201).json({ 
        success: true, 
        comment,
        message: 'Komentar berhasil ditambahkan!' 
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ error: error.message });
    }
  }

  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${method} tidak diizinkan` });
  }
}