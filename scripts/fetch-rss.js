// scripts/fetch-rss.js
import { fetchAllRssFeeds } from '../lib/rssFetcher.js';

async function run() {
  console.log('Running RSS fetch...');
  const result = await fetchAllRssFeeds();
  console.log('Result:', result);
}

run().catch(console.error);