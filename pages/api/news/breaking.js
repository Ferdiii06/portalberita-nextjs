import { broadcastBreaking } from '../../../lib/newsStore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const data = await broadcastBreaking(req.body);
  res.status(200).json({ ok: true, data });
}