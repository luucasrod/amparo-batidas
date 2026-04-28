import Stripe from 'stripe';
import { randomBytes } from 'node:crypto';

function siteUrl(req) {
  const fromEnv = process.env.SITE_URL || process.env.VERCEL_URL;
  if (fromEnv) {
    const u = fromEnv.startsWith('http') ? fromEnv : `https://${fromEnv}`;
    return u.replace(/\/$/, '');
  }
  return 'http://localhost:3000';
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    res.status(503).json({ error: 'STRIPE_SECRET_KEY não configurada' });
    return;
  }
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    res.status(400).json({ error: 'JSON inválido' });
    return;
  }
  const nome = (body.nome_cliente || body.nome || '').trim();
  const bebida = (body.bebida || '').trim();
  const preco = Number(body.preco);
  if (!nome || !bebida || !Number.isFinite(preco) || preco <= 0) {
    res.status(400).json({ error: 'nome, bebida e preço são obrigatórios' });
    return;
  }
  const stripe = new Stripe(secret);
  const base = siteUrl(req);
  const ref = randomBytes(16).toString('base64url');
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    client_reference_id: ref,
    success_url: `${base}/?payment=stripe&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/?payment=cancel`,
    metadata: {
      nome_cliente: nome,
      bebida,
      preco: String(preco),
      metodo_pagamento: 'cartao_stripe',
    },
    line_items: [
      {
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(preco * 100),
          product_data: {
            name: `Amparo Batidas — ${bebida}`,
            description: `Levantamento na calçada — ${nome}`,
          },
        },
        quantity: 1,
      },
    ],
  });
  res.status(200).json({ url: session.url, sessionId: session.id });
}
