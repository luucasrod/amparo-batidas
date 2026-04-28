import { getOrderByIdAndToken } from '../lib/orders.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const id = req.query.id;
  const token = req.query.token;
  if (!id || !token) {
    res.status(400).json({ error: 'id e token são obrigatórios' });
    return;
  }
  const { order, error } = await getOrderByIdAndToken(String(id), String(token));
  if (error) {
    res.status(500).json({ error });
    return;
  }
  if (!order) {
    res.status(404).json({ error: 'Não encontrado' });
    return;
  }
  res.status(200).json({ order });
}
