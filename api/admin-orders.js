import { getSupabase } from '../lib/supabase-server.js';

function assertAdmin(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return false;
  const token = auth.slice(7);
  return token === process.env.ADMIN_TOKEN;
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  if (!assertAdmin(req)) {
    res.status(401).json({ error: 'Não autorizado' });
    return;
  }
  if (!process.env.SUPABASE_URL) {
    res.status(503).json({ error: 'Supabase não configurado' });
    return;
  }
  const supabase = getSupabase();
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('orders')
      .select('id, nome_cliente, bebida, preco, estado, metodo_pagamento, criado_em')
      .order('criado_em', { ascending: false })
      .limit(100);
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json({ orders: data || [] });
    return;
  }
  if (req.method === 'PATCH') {
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch {
      res.status(400).json({ error: 'JSON inválido' });
      return;
    }
    const id = body.id;
    const estado = body.estado;
    if (!id || !estado) {
      res.status(400).json({ error: 'id e estado são obrigatórios' });
      return;
    }
    if (!['pendente', 'preparando', 'pronto'].includes(estado)) {
      res.status(400).json({ error: 'estado inválido' });
      return;
    }
    const { data, error } = await supabase
      .from('orders')
      .update({ estado })
      .eq('id', id)
      .select('id, estado')
      .single();
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json({ order: data });
    return;
  }
  res.status(405).json({ error: 'Method not allowed' });
}
