import { insertOrderEasypay } from '../lib/orders.js';

function easypayBase() {
  return (process.env.EASYPAY_BASE_URL || 'https://api.test.easypay.pt/2.0').replace(/\/$/, '');
}

/**
 * Consulta Easypay GET /single?id= e, se pago, cria encomenda no Supabase (idempotente).
 */
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const accountId = process.env.EASYPAY_ACCOUNT_ID;
  const apiKey = process.env.EASYPAY_API_KEY;
  if (!accountId || !apiKey) {
    res.status(503).json({ error: 'Easypay não configurado' });
    return;
  }
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    res.status(400).json({ error: 'JSON inválido' });
    return;
  }
  const paymentId = String(body.payment_id || '').trim();
  const nome = (body.nome_cliente || body.nome || '').trim();
  const bebida = (body.bebida || '').trim();
  const preco = Number(body.preco);
  if (!paymentId || !nome || !bebida || !Number.isFinite(preco) || preco <= 0) {
    res.status(400).json({ error: 'payment_id, nome, bebida e preço são obrigatórios' });
    return;
  }
  const listUrl = `${easypayBase()}/single?id=${encodeURIComponent(paymentId)}&records_per_page=1`;
  let ep;
  try {
    ep = await fetch(listUrl, {
      headers: { AccountId: accountId, ApiKey: apiKey },
    });
  } catch (e) {
    res.status(502).json({ error: 'Easypay indisponível', detail: String(e.message) });
    return;
  }
  const json = await ep.json().catch(() => ({}));
  if (!ep.ok) {
    res.status(ep.status).json({ error: json.message || 'Erro Easypay', detail: json });
    return;
  }
  const row = Array.isArray(json.data) ? json.data[0] : null;
  if (!row) {
    res.status(404).json({ error: 'Pagamento não encontrado', detail: json });
    return;
  }
  const status = row.payment_status;
  const value = Number(row.value);
  if (status !== 'paid') {
    res.status(200).json({ paid: false, payment_status: status });
    return;
  }
  if (Math.abs(value - preco) > 0.02) {
    res.status(400).json({ error: 'Valor do pagamento não coincide com o pedido' });
    return;
  }
  const out = await insertOrderEasypay({
    nome,
    bebida,
    preco,
    easypayId: paymentId,
    metodo: 'mbway_easypay',
  });
  if (out.error) {
    res.status(500).json({ error: out.error });
    return;
  }
  res.status(200).json({
    paid: true,
    id: out.order.id,
    client_token: out.order.client_token,
    nome_cliente: out.order.nome_cliente,
    bebida: out.order.bebida,
    preco: out.order.preco,
    estado: out.order.estado,
  });
}
