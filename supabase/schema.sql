-- Amparo Batidas — colar e executar no SQL Editor (Supabase)

create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  nome_cliente text not null,
  bebida text not null,
  preco decimal(10,2) not null,
  estado text not null default 'pendente'
    check (estado in ('pendente', 'preparando', 'pronto')),
  metodo_pagamento text,
  client_token text not null unique,
  stripe_session_id text unique,
  easypay_payment_id text,
  criado_em timestamptz not null default now()
);

create index if not exists idx_orders_criado on public.orders (criado_em desc);
create index if not exists idx_orders_estado on public.orders (estado);

alter table public.orders enable row level security;

-- Aceder aos dados só via Vercel + SUPABASE_SERVICE_ROLE_KEY.
-- (Opcional) em Supabase: Database → Replication — inclui public.orders na publicação Realtime

comment on table public.orders is 'Pedidos Amparo Batidas';
