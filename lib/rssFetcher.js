// lib/rssFetcher.js
import { parseString } from 'xml2js';
import { promisify } from 'util';
import axios from 'axios';
import { getEnabledSources } from './rssSources.js';
import prisma from './prisma.js';
import { getEmitter } from './newsStore.js';

const parseXml = promisify(parseString);
let isFetching = false;

// Fungsi untuk extract gambar dari berbagai format RSS
function extractImage(item) {
  // 1. Cek enclosure (biasanya untuk podcast/video)
  if (item.enclosure && item.enclosure[0] && item.enclosure[0].$.url) {
    return item.enclosure[0].$.url;
  }
  
  // 2. Cek media:content
  if (item['media:content'] && item['media:content'][0] && item['media:content'][0].$.url) {
    return item['media:content'][0].$.url;
  }
  
  // 3. Cek media:thumbnail
  if (item['media:thumbnail'] && item['media:thumbnail'][0] && item['media:thumbnail'][0].$.url) {
    return item['media:thumbnail'][0].$.url;
  }
  
  // 4. Cek image di description (tag img)
  const description = item.description?.[0] || item['content:encoded']?.[0] || '';
  const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
  if (imgMatch) {
    return imgMatch[1];
  }
  
  // 5. Cek gambar dari feed image
  if (item.image && item.image[0] && item.image[0].url) {
    return item.image[0].url[0];
  }
  
  return null;
}

export async function fetchRssFeed(source) {
  try {
    console.log(`📡 Fetching RSS from ${source.name} (${source.url})...`);
    
    const response = await axios.get(source.url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml',
      }
    });

    const result = await parseXml(response.data);
    const items = result.rss?.channel?.[0]?.item || [];
    
    let newCount = 0;
    let updatedCount = 0;
    
    for (const item of items) {
      try {
        let guid = item.guid?.[0];
        if (typeof guid === 'object' && guid !== null) {
          guid = guid._ || guid.$?.isPermaLink || '';
        } else if (!guid) {
          guid = item.link?.[0] || '';
        }
        
        if (!guid) continue;
        
        const existing = await prisma.news.findFirst({
          where: { guid: String(guid) }
        });
        
        const judul = item.title?.[0]?.replace(/<[^>]*>/g, '').trim() || 'No Title';
        const link = item.link?.[0] || '';
        const description = item.description?.[0] || item['content:encoded']?.[0] || '';
        const pubDate = item.pubDate?.[0] ? new Date(item.pubDate[0]) : new Date();
        
        // Extract image dengan fungsi baru
        const imageUrl = extractImage(item);
        
        // Clean description
        const cleanDescription = description
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 300);
        
        const newsData = {
          guid: String(guid),
          judul: judul,
          headline: cleanDescription || judul,
          isi: description || '',
          gambar: imageUrl || '',
          gallery: '[]',
          kategori: source.category || 'Berita',
          author: source.name || 'Unknown',
          tanggal: pubDate,
          waktuBaca: Math.ceil(judul.length / 500) || 1,
          sourceName: source.name,
          sourceUrl: link || source.sourceUrl || '',
        };
        
        if (!existing) {
          await prisma.news.create({ data: newsData });
          newCount++;
          
          const emitter = getEmitter();
          if (emitter) {
            emitter.emit('news:new', { ...newsData, id: 'temp' });
          }
          
          console.log(`✅ New: ${judul.slice(0, 50)}... (Image: ${imageUrl ? '✅' : '❌'})`);
        } else {
          const needsUpdate = 
            existing.judul !== judul ||
            existing.headline !== cleanDescription ||
            existing.gambar !== imageUrl;
          
          if (needsUpdate) {
            await prisma.news.update({
              where: { id: existing.id },
              data: {
                judul,
                headline: cleanDescription,
                isi: description,
                gambar: imageUrl || existing.gambar,
                sourceUrl: link || existing.sourceUrl,
              }
            });
            updatedCount++;
            console.log(`🔄 Updated: ${judul.slice(0, 50)}...`);
          }
        }
      } catch (itemError) {
        console.error('Error processing item:', itemError.message);
      }
    }
    
    return { source: source.name, newCount, updatedCount };
  } catch (error) {
    console.error(`❌ Error fetching RSS from ${source.name}:`, error.message);
    return { source: source.name, error: error.message, newCount: 0, updatedCount: 0 };
  }
}

export async function fetchAllRssFeeds() {
  if (isFetching) {
    console.log('⏳ Already fetching RSS feeds, skipping...');
    return { message: 'Already running' };
  }
  
  isFetching = true;
  console.log(`🔄 Starting RSS fetch at ${new Date().toISOString()}`);
  
  try {
    const sources = getEnabledSources();
    const results = [];
    
    for (const source of sources) {
      const result = await fetchRssFeed(source);
      results.push(result);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    const totalNew = results.reduce((sum, r) => sum + (r.newCount || 0), 0);
    const totalUpdated = results.reduce((sum, r) => sum + (r.updatedCount || 0), 0);
    
    console.log(`✅ RSS fetch complete: ${totalNew} new, ${totalUpdated} updated`);
    
    return {
      success: true,
      timestamp: new Date().toISOString(),
      totalNew,
      totalUpdated,
      details: results
    };
  } catch (error) {
    console.error('❌ Error in fetchAllRssFeeds:', error);
    return { success: false, error: error.message };
  } finally {
    isFetching = false;
  }
}