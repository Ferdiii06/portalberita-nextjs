// pages/api/stream.js
import { getEmitter, getBreakingNews } from '../../lib/newsStore.js';

export default async function handler(req, res) {
  // Set headers untuk SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  // Kirim breaking news terbaru saat koneksi
  try {
    const breakingNews = await getBreakingNews(3);
    if (breakingNews && breakingNews.length > 0) {
      res.write(`data: ${JSON.stringify({ 
        type: 'breaking:initial', 
        data: breakingNews 
      })}\n\n`);
    }
  } catch (error) {
    console.error('Error sending initial breaking news:', error);
  }

  const emitter = getEmitter();
  
  const sendEvent = (data) => {
    try {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (error) {
      console.error('Error sending event:', error);
    }
  };

  // Listen untuk berbagai event
  const onNewNews = (news) => {
    sendEvent({ type: 'news:new', data: news });
  };
  
  const onBreaking = (breaking) => {
    sendEvent({ type: 'news:breaking', data: breaking });
  };
  
  const onView = (data) => {
    sendEvent({ type: 'news:view', data });
  };

  // Event komentar
  const onComment = (comment) => {
    sendEvent({ type: 'comment:new', data: comment });
  };

  // Register event listeners
  emitter.on('news:new', onNewNews);
  emitter.on('news:breaking', onBreaking);
  emitter.on('news:view', onView);
  emitter.on('comment:new', onComment);

  // Cleanup saat koneksi ditutup
  req.on('close', () => {
    emitter.off('news:new', onNewNews);
    emitter.off('news:breaking', onBreaking);
    emitter.off('news:view', onView);
    emitter.off('comment:new', onComment);
    res.end();
  });
}