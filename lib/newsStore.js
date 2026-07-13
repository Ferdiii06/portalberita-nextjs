// lib/newsStore.js
import prisma from './prisma.js';
import { EventEmitter } from 'events';

// ===== EVENT EMITTER =====
const eventEmitter = new EventEmitter();

export function getEmitter() {
  return eventEmitter;
}

// ===== NEWS FUNCTIONS =====

export async function getAllNews(page = 1, limit = 20, category = null, search = null) {
  try {
    const skip = (page - 1) * limit;
    
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
    
    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { tanggal: 'desc' },
        skip,
        take: limit,
      }),
      prisma.news.count({ where })
    ]);
    
    return { 
      news: Array.isArray(news) ? news : [], 
      total: total || 0, 
      page, 
      limit 
    };
  } catch (error) {
    console.error('Error in getAllNews:', error);
    return { news: [], total: 0, page, limit };
  }
}

export async function getNewsById(id) {
  try {
    if (!id) return null;
    return await prisma.news.findUnique({
      where: { id }
    });
  } catch (error) {
    console.error('Error in getNewsById:', error);
    return null;
  }
}

export async function saveNews(data) {
  try {
    if (!data || !data.guid) {
      console.error('Invalid news data:', data);
      return null;
    }
    
    const existing = await prisma.news.findFirst({
      where: { guid: data.guid }
    });
    
    const newsData = {
      guid: data.guid,
      judul: data.judul || data.title || 'No Title',
      headline: data.headline || data.description || '',
      isi: data.isi || data.content || '',
      gambar: data.gambar || data.imageUrl || '',
      gallery: '[]',
      kategori: data.kategori || data.category || 'Berita',
      author: data.author || data.sourceName || 'Unknown',
      tanggal: data.tanggal || data.publishedAt || new Date(),
      waktuBaca: data.waktuBaca || Math.ceil((data.judul?.length || 100) / 500) || 1,
      sourceName: data.sourceName || data.sumber || 'Unknown',
      sourceUrl: data.sourceUrl || data.link || '',
    };
    
    if (existing) {
      return await prisma.news.update({
        where: { id: existing.id },
        data: newsData
      });
    }
    
    return await prisma.news.create({ data: newsData });
  } catch (error) {
    console.error('Error in saveNews:', error);
    return null;
  }
}

export async function getExistingNewsByGuid(guid) {
  try {
    if (!guid) return null;
    return await prisma.news.findFirst({
      where: { guid }
    });
  } catch (error) {
    console.error('Error in getExistingNewsByGuid:', error);
    return null;
  }
}

export async function incrementViews(id) {
  try {
    if (!id) return null;
    const news = await prisma.news.update({
      where: { id },
      data: { views: { increment: 1 } }
    });
    eventEmitter.emit('news:view', { id, views: news.views });
    return news;
  } catch (error) {
    console.error('Error in incrementViews:', error);
    return null;
  }
}

export async function getBreakingNews(limit = 5) {
  try {
    const breaking = await prisma.breakingNews.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit
    });
    return Array.isArray(breaking) ? breaking : [];
  } catch (error) {
    console.error('Error in getBreakingNews:', error);
    return [];
  }
}

export async function broadcastBreaking(data) {
  try {
    if (!data || !data.judul) {
      console.error('Invalid breaking news data');
      return null;
    }
    
    const breaking = await prisma.breakingNews.create({
      data: {
        judul: data.judul || data.title,
        newsId: data.newsId || null,
        createdAt: new Date(),
        expiresAt: data.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });
    
    eventEmitter.emit('news:breaking', breaking);
    return breaking;
  } catch (error) {
    console.error('Error in broadcastBreaking:', error);
    return null;
  }
}

export function broadcastNews(news) {
  if (news) {
    eventEmitter.emit('news:new', news);
  }
}

export async function getTrendingNews(limit = 5) {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const trending = await prisma.news.findMany({
      where: {
        tanggal: { gte: yesterday }
      },
      orderBy: { views: 'desc' },
      take: limit
    });
    return Array.isArray(trending) ? trending : [];
  } catch (error) {
    console.error('Error in getTrendingNews:', error);
    return [];
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.news.groupBy({
      by: ['kategori'],
      _count: {
        kategori: true
      }
    });
    
    return Array.isArray(categories) 
      ? categories.map(c => ({
          name: c.kategori,
          count: c._count.kategori
        }))
      : [];
  } catch (error) {
    console.error('Error in getCategories:', error);
    return [];
  }
}

export function broadcastComment(comment) {
  if (comment) {
    eventEmitter.emit('comment:new', comment);
  }
}