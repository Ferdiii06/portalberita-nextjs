// pages/api/scrape.js
import { fetchAndUpdateContent } from '../../lib/scraper.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, url, sourceName } = req.body;

  if (!id || !url) {
    return res.status(400).json({ error: 'Missing id or url' });
  }

  try {
    const result = await fetchAndUpdateContent(id, url, sourceName);
    
    if (result) {
      res.status(200).json({ 
        success: true, 
        message: 'Content scraped successfully',
        content: result.content
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to scrape content' 
      });
    }
  } catch (error) {
    console.error('Scrape API error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}