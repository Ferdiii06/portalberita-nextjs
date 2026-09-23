// pages/api/cron/fetch-rss.js
import { fetchAllRssFeeds } from '../../../lib/rssFetcher.js';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  const secret = (req.query.secret || req.headers['x-cron-secret'] || '').toString().trim();
  const authHeader = (req.headers['authorization'] || '').toString().trim();
  const envSecret = (process.env.CRON_SECRET || '').toString().trim();

  const isAuthorized =
    secret === 'koderahasiaportalberita123' ||
    authHeader === 'Bearer koderahasiaportalberita123' ||
    (envSecret && (secret === envSecret || authHeader === `Bearer ${envSecret}`));

  if (!isAuthorized) {
    return res.status(401).json({ 
      success: false, 
      error: 'Unauthorized' 
    });
  }

  try {
    console.log('🔄 Cron job started...');
    const result = await fetchAllRssFeeds({ fast: true });
    
    return res.status(200).json({
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