import Stripe from 'stripe';
import { insertOrderFromStripeSession, findOrderByStripeSessionId } from '../lib/orders.js';

/**
 * Chamar após redirect do Stripe (corrida com o webhook):
 * cria a encomenda se o webhook ainda não correu.
 */
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const q = req.query;
  const sessionId = q.session_id;
  if (!sessionId) {
    res.status(400).json({ error: 'session_id em falta' });
    return;
  }
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    res.status(503).json({ error: 'STRIPE_SECRET_KEY não configurada' });
    return;
  }
  const stripe = new Stripe(key);
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(String(sessionId));
  } catch (e) {
    res.status(400).json({ error: 'Sessão inválida' });
    return;
  }
  if (session.payment_status !== 'paid' && session.status !== 'complete') {
    res.status(400).json({ error: 'Pagamento ainda não confirmado' });
    return;
  }
  let { order, error: findErr } = await findOrderByStripeSessionId(String(sessionId));
  if (findErr) {
    res.status(500).json({ error: findErr });
    return;
  }
  if (!order) {
    const out = await insertOrderFromStripeSession(session);
    if (out.error) {
      res.status(500).json({ error: out.error });
      return;
    }
    order = out.order;
  }
  res.status(200).json({
    id: order.id,
    client_token: order.client_token,
    nome_cliente: order.nome_cliente,
    bebida: order.bebida,
    preco: order.preco,
    estado: order.estado,
  });
}
