// lib/scraper.js
import axios from 'axios';
import * as cheerio from 'cheerio';

// Fungsi untuk scrape konten dari berbagai sumber
export async function scrapeFullContent(url, sourceName) {
  try {
    console.log(`🔍 Scraping: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
      },
      timeout: 15000
    });

    const $ = cheerio.load(response.data);
    let content = '';
    let images = [];
    let title = '';
    let author = '';
    let publishDate = '';

    // === KOMPAS.COM ===
    if (sourceName?.toLowerCase().includes('kompas')) {
      // Ambil judul
      title = $('h1.read__title').text().trim() || $('h1.title').text().trim();
      
      // Ambil penulis
      author = $('.read__author').text().trim() || $('.author-name').text().trim();
      
      // Ambil tanggal
      publishDate = $('.read__time').text().trim() || $('.date').text().trim();
      
      // Ambil konten
      $('.read__content p').each((i, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 20) {
          content += text + '\n\n';
        }
      });
      
      // Ambil gambar dari konten
      $('.read__content img').each((i, el) => {
        const imgSrc = $(el).attr('src') || $(el).attr('data-src');
        if (imgSrc && !imgSrc.includes('logo') && !imgSrc.includes('icon')) {
          images.push(imgSrc);
        }
      });
    }

    // === DETIK.COM ===
    if (sourceName?.toLowerCase().includes('detik')) {
      title = $('h1.detail__title').text().trim() || $('h1.title').text().trim();
      author = $('.detail__author').text().trim() || $('.author').text().trim();
      publishDate = $('.detail__date').text().trim() || $('.date').text().trim();
      
      $('.detail__body-text p, .detail__body p').each((i, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 20) {
          content += text + '\n\n';
        }
      });
      
      $('.detail__body-text img, .detail__body img').each((i, el) => {
        const imgSrc = $(el).attr('src') || $(el).attr('data-src');
        if (imgSrc && !imgSrc.includes('logo')) {
          images.push(imgSrc);
        }
      });
    }

    // === CNN INDONESIA ===
    if (sourceName?.toLowerCase().includes('cnn')) {
      title = $('h1.article-title').text().trim() || $('h1.title').text().trim();
      author = $('.author-name').text().trim() || $('.byline').text().trim();
      publishDate = $('.date').text().trim() || $('.publish-date').text().trim();
      
      $('.text-article p, .article-content p').each((i, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 20) {
          content += text + '\n\n';
        }
      });
      
      $('.text-article img, .article-content img').each((i, el) => {
        const imgSrc = $(el).attr('src') || $(el).attr('data-src');
        if (imgSrc && !imgSrc.includes('logo')) {
          images.push(imgSrc);
        }
      });
    }

    // === TEMPO.CO ===
    if (sourceName?.toLowerCase().includes('tempo')) {
      title = $('h1.article-title').text().trim() || $('h1.title').text().trim();
      author = $('.author-name').text().trim() || $('.byline').text().trim();
      publishDate = $('.date').text().trim() || $('.publish-date').text().trim();
      
      $('.article-content p, .detail-text p').each((i, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 20) {
          content += text + '\n\n';
        }
      });
      
      $('.article-content img, .detail-text img').each((i, el) => {
        const imgSrc = $(el).attr('src') || $(el).attr('data-src');
        if (imgSrc && !imgSrc.includes('logo')) {
          images.push(imgSrc);
        }
      });
    }

    // === LIPUTAN6 ===
    if (sourceName?.toLowerCase().includes('liputan6')) {
      title = $('h1.article-title').text().trim() || $('h1.title').text().trim();
      author = $('.author-name').text().trim() || $('.byline').text().trim();
      publishDate = $('.date').text().trim() || $('.publish-date').text().trim();
      
      $('.article-content p, .article-body p').each((i, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 20) {
          content += text + '\n\n';
        }
      });
      
      $('.article-content img, .article-body img').each((i, el) => {
        const imgSrc = $(el).attr('src') || $(el).attr('data-src');
        if (imgSrc && !imgSrc.includes('logo')) {
          images.push(imgSrc);
        }
      });
    }

    // === TRIBUNNEWS ===
    if (sourceName?.toLowerCase().includes('tribun')) {
      title = $('h1.article-title').text().trim() || $('h1.title').text().trim();
      author = $('.author-name').text().trim() || $('.byline').text().trim();
      publishDate = $('.date').text().trim() || $('.publish-date').text().trim();
      
      $('.article-content p, .txt-article p').each((i, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 20) {
          content += text + '\n\n';
        }
      });
      
      $('.article-content img, .txt-article img').each((i, el) => {
        const imgSrc = $(el).attr('src') || $(el).attr('data-src');
        if (imgSrc && !imgSrc.includes('logo')) {
          images.push(imgSrc);
        }
      });
    }

    // === REPUBLIKA ===
    if (sourceName?.toLowerCase().includes('republika')) {
      title = $('h1.article-title').text().trim() || $('h1.title').text().trim();
      author = $('.author-name').text().trim() || $('.byline').text().trim();
      publishDate = $('.date').text().trim() || $('.publish-date').text().trim();
      
      $('.article-content p, .detail-text p').each((i, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 20) {
          content += text + '\n\n';
        }
      });
      
      $('.article-content img, .detail-text img').each((i, el) => {
        const imgSrc = $(el).attr('src') || $(el).attr('data-src');
        if (imgSrc && !imgSrc.includes('logo')) {
          images.push(imgSrc);
        }
      });
    }

    // Jika konten kosong atau terlalu pendek
    if (!content || content.length < 100) {
      // Fallback: ambil semua paragraf
      $('p').each((i, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 50) {
          content += text + '\n\n';
        }
      });
    }

    // Bersihkan konten
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return {
      success: true,
      title: title || '',
      author: author || 'Unknown',
      publishDate: publishDate || '',
      content: content || 'Konten tidak tersedia. Baca di sumber asli.',
      images: images.slice(0, 5) // Ambil max 5 gambar
    };

  } catch (error) {
    console.error(`❌ Scraping error for ${url}:`, error.message);
    return {
      success: false,
      error: error.message,
      content: 'Gagal mengambil konten. Baca di sumber asli.'
    };
  }
}

// Fungsi untuk scrape dan update database
export async function fetchAndUpdateContent(beritaId, url, sourceName) {
  try {
    const result = await scrapeFullContent(url, sourceName);
    
    if (result.success && result.content) {
      const prisma = (await import('./prisma.js')).default;
      
      // Update database dengan konten lengkap
      await prisma.news.update({
        where: { id: beritaId },
        data: {
          isi: result.content,
          headline: result.content.slice(0, 300) || '',
          author: result.author || 'Unknown',
        }
      });
      
      console.log(`✅ Content updated for: ${result.title.slice(0, 50)}...`);
      return result;
    }
    
    return null;
  } catch (error) {
    console.error('Error updating content:', error);
    return null;
  }
}