// fetch-news.js
import { fetchAllRssFeeds } from './lib/rssFetcher.js';

async function fetchNews() {
  console.log('🚀 Starting manual RSS fetch...\n');
  
  try {
    const result = await fetchAllRssFeeds();
    console.log('\n📊 Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fetchNews();