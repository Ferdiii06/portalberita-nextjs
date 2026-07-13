// pages/api/cron/fetch-rss.js
import { fetchAllRssFeeds } from '../../../lib/rssFetcher.js';

export default async function handler(req, res) {
  const secret = req.query.secret || req.headers['x-cron-secret'];
  
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ 
      success: false, 
      error: 'Unauthorized' 
    });
  }
  
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    console.log('🔄 Cron job started...');
    const result = await fetchAllRssFeeds();
    
    res.status(200).json({
      success: true,
      ...result,
      message: 'RSS fetch completed successfully'
    });
  } catch (error) {
    console.error('❌ Cron job error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}