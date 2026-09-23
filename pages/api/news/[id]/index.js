// pages/api/news/[id]/index.js
import prisma from '../../../../lib/prisma.js';
import { scrapeFullContent } from '../../../../lib/scraper.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const berita = await prisma.news.findUnique({
      where: { id }
    });

    if (!berita) {
      return res.status(404).json({ error: 'Berita tidak ditemukan' });
    }

    // Jika isi masih berupa cuplikan pendek (< 400 karakter) dan memiliki sourceUrl asli:
    // Tarik konten artikel berita lengkap secara real-time dari sumbernya!
    if (berita.sourceUrl && (!berita.isi || berita.isi.length < 400)) {
      try {
        const scraped = await scrapeFullContent(berita.sourceUrl, berita.sourceName || '');
        if (scraped && scraped.success && scraped.content && scraped.content.length > 250) {
          const updated = await prisma.news.update({
            where: { id: berita.id },
            data: {
              isi: scraped.content,
              author: (scraped.author && scraped.author !== 'Unknown') ? scraped.author : berita.author,
              waktuBaca: Math.max(1, Math.ceil(scraped.content.length / 600))
            }
          });
          return res.status(200).json(updated);
        }
      } catch (scrapeErr) {
        console.warn('Realtime enrichment failed, fallback to snippet:', scrapeErr.message);
      }
    }

    return res.status(200).json(berita);
  } catch (error) {
    console.error('Error in news detail API:', error);
    return res.status(500).json({ error: error.message });
  }
}