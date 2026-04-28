import { getSupabase, randomToken } from './supabase-server.js';

/**
 * Cria encomenda a partir de um Stripe Checkout session (pago).
 * Idempotente por stripe_session_id.
 */
export async function insertOrderFromStripeSession(session) {
  const supabase = getSupabase();
  const sid = session.id;
  const meta = session.metadata || {};
  const nome = (meta.nome_cliente || '').trim();
  const bebida = (meta.bebida || '').trim();
  const preco = parseFloat(String(meta.preco || '0'), 10);
  const metodo = meta.metodo_pagamento || 'cartao_stripe';
  if (!nome || !bebida || preco <= 0) {
    return { error: 'metadata_incompleta' };
  }
  const { data: existing } = await supabase
    .from('orders')
    .select('id, client_token, nome_cliente, bebida, preco, estado, metodo_pagamento, criado_em, stripe_session_id')
    .eq('stripe_session_id', sid)
    .maybeSingle();
  if (existing) {
    return { order: existing, created: false };
  }
  const client_token = randomToken();
  const row = {
    nome_cliente: nome,
    bebida,
    preco,
    metodo_pagamento: metodo,
    estado: 'pendente',
    client_token,
    stripe_session_id: sid,
  };
  const { data, error } = await supabase
    .from('orders')
    .insert(row)
    .select('id, client_token, stripe_session_id, estado, nome_cliente, bebida, preco, metodo_pagamento, criado_em')
    .single();
  if (error) return { error: error.message };
  return { order: data, created: true };
}

export async function findOrderByStripeSessionId(sessionId) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('orders')
    .select('id, client_token, nome_cliente, bebida, preco, estado, metodo_pagamento, criado_em, stripe_session_id')
    .eq('stripe_session_id', sessionId)
    .maybeSingle();
  if (error) return { error: error.message };
  return { order: data || null };
}

export async function getOrderByIdAndToken(id, token) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('orders')
    .select('id, nome_cliente, bebida, preco, estado, metodo_pagamento, criado_em')
    .eq('id', id)
    .eq('client_token', token)
    .maybeSingle();
  if (error) return { error: error.message };
  return { order: data || null };
}

/**
 * Easypay: encomenda já paga (webhook) ou cria-se ao iniciar o pagamento; aqui: insert após confirmação
 */
export async function insertOrderEasypay({
  nome,
  bebida,
  preco,
  easypayId,
  metodo = 'mbway',
}) {
  const supabase = getSupabase();
  if (!easypayId) return { error: 'missing_easypay_id' };
  const { data: existing } = await supabase
    .from('orders')
    .select('id, client_token, nome_cliente, bebida, preco, estado, metodo_pagamento, criado_em, easypay_payment_id')
    .eq('easypay_payment_id', easypayId)
    .maybeSingle();
  if (existing) return { order: existing, created: false };
  const client_token = randomToken();
  const { data, error } = await supabase
    .from('orders')
    .    insert({
      nome_cliente: nome,
      bebida,
      preco,
      metodo_pagamento: metodo,
      estado: 'pendente',
      client_token,
      easypay_payment_id: easypayId,
    })
    .select('id, client_token, estado, nome_cliente, bebida, preco')
    .single();
  if (error) return { error: error.message };
  return { order: data, created: true };
}
