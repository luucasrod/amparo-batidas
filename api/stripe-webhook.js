import Stripe from 'stripe';
import { insertOrderFromStripeSession } from '../lib/orders.js';

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed');
    return;
  }
  const secret = process.env.STRIPE_SECRET_KEY;
  const wh = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !wh) {
    res.status(503).end('Config em falta');
    return;
  }
  const stripe = new Stripe(secret);
  const raw = await getRawBody(req);
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, wh);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    if (session.payment_status === 'paid' || session.status === 'complete') {
      const out = await insertOrderFromStripeSession(session);
      if (out.error) {
        console.error('insertOrderFromStripeSession', out.error);
      }
    }
  }
  res.status(200).json({ received: true });
}
