// test-setup.js
import { fetchAllRssFeeds } from './lib/rssFetcher.js';

async function test() {
  console.log('Testing RSS Fetcher...');
  try {
    const result = await fetchAllRssFeeds();
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

test();