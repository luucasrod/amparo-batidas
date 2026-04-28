import { randomBytes } from 'node:crypto';

function easypayBase() {
  return (process.env.EASYPAY_BASE_URL || 'https://api.test.easypay.pt/2.0').replace(/\/$/, '');
}

/**
 * Cria pagamento MB Way via Easypay (POST /single, method MBW).
 * @see https://docs.easypay.pt/pt/openapi/single-payment/single-post
 */
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const accountId = process.env.EASYPAY_ACCOUNT_ID;
  const apiKey = process.env.EASYPAY_API_KEY;
  const captureAccountId = process.env.EASYPAY_CAPTURE_ACCOUNT_ID || accountId;
  if (!accountId || !apiKey || !captureAccountId) {
    res
      .status(503)
      .json({ error: 'Easypay: define EASYPAY_ACCOUNT_ID, EASYPAY_API_KEY e (opcional) EASYPAY_CAPTURE_ACCOUNT_ID.' });
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
  let phone = String(body.phone || body.telemovel || '').replace(/\s+/g, '');
  if (phone.startsWith('+351')) phone = phone.slice(4);
  if (phone.startsWith('351')) phone = phone.slice(3);
  if (!nome || !bebida || !Number.isFinite(preco) || preco <= 0 || phone.length < 9) {
    res.status(400).json({ error: 'nome, bebida, preço e telemóvel PT válido são obrigatórios' });
    return;
  }
  const transactionKey = randomBytes(18).toString('base64url');
  const keyField = randomBytes(12).toString('hex');
  const payload = {
    type: 'sale',
    capture: {
      descriptive: `Amparo Batidas — ${bebida}`,
      transaction_key: transactionKey,
      account: { id: captureAccountId },
    },
    currency: 'EUR',
    value: preco,
    method: 'MBW',
    key: keyField,
    customer: {
      name: nome,
      phone,
      phone_indicative: '+351',
      language: 'PT',
    },
  };
  const url = `${easypayBase()}/single`;
  let ep;
  try {
    ep = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        AccountId: accountId,
        ApiKey: apiKey,
      },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    res.status(502).json({ error: 'Easypay indisponível', detail: String(e.message) });
    return;
  }
  const json = await ep.json().catch(() => ({}));
  if (!ep.ok) {
    res.status(ep.status).json({
      error: json.message || json.status || 'Easypay rejeitou o pedido',
      detail: json,
    });
    return;
  }
  const id = json.id;
  if (!id) {
    res.status(500).json({ error: 'Resposta Easypay sem id', detail: json });
    return;
  }
  res.status(200).json({
    paymentId: id,
    methodStatus: json.method?.status,
    descriptive: json.message,
  });
}
