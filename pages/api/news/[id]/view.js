// pages/api/news/[id]/view.js
import prisma from '../../../../lib/prisma.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const updated = await prisma.news.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    res.status(200).json({ 
      success: true, 
      views: updated.views 
    });
  } catch (error) {
    console.error('Error updating views:', error);
    res.status(500).json({ error: error.message });
  }
}