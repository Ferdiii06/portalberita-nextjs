// pages/api/news/index.js
import prisma from '../../../lib/prisma.js';
import { fetchAllRssFeeds } from '../../../lib/rssFetcher.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const refresh = req.query.refresh === 'true' || req.query.refresh === '1';
    const take = Number(req.query.take) || 24;
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : undefined;

    const where = {};
    if (category && category !== 'semua') {
      where.kategori = category;
    }
    if (search) {
      where.OR = [
        { judul: { contains: search, mode: 'insensitive' } },
        { headline: { contains: search, mode: 'insensitive' } }
      ];
    }

    const news = await prisma.news.findMany({
      where,
      orderBy: { tanggal: 'desc' },
      take: Math.max(take, 6),
      include: {
        _count: { select: { comments: true } },
        comments: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (refresh || news.length < 6) {
      try {
        const refreshResult = await fetchAllRssFeeds({ persist: true });
        const refreshedNews = await prisma.news.findMany({
          orderBy: { tanggal: 'desc' },
          take: Math.max(take, 6),
          include: {
            _count: { select: { comments: true } },
            comments: {
              take: 1,
              orderBy: { createdAt: 'desc' }
            }
          }
        });

        return res.status(200).json({
          news: refreshedNews || [],
          total: refreshedNews.length,
          refreshResult,
          refreshedAt: new Date().toISOString()
        });
      } catch (refreshError) {
        console.error('Refresh failed:', refreshError);
      }
    }

    return res.status(200).json({
      news: news || [],
      total: news.length,
      refreshedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: error.message,
      news: []
    });
  }
}