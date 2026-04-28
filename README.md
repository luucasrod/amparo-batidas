# Amparo Batidas

App de encomendas para levantamento na calçada (extensão de praia do Amparo).

## O que foi acrescentado

- **Branding**: cores (#2B4A2B, #E8603C, #C4A882, #F5F0E8), fontes **Fraunces** + **Syne**, tom “Então você encontrou!”.
- **Fotos**: `public/images/` — ficheiros `maracuja.jpg`, `manga.jpg`, `morango.jpg`, `coco.jpg` (se faltarem, aparece fallback com gradiente).
- **Supabase**: tabela `orders` (ver `supabase/schema.sql`) + acesso **só** via **service role** nas funções Vercel (o browser não vê a service key).
- **Stripe Checkout**: `POST /api/stripe-checkout` → redirecionamento; `POST /api/stripe-webhook` cria o pedido; `GET /api/complete-order` trata a corrida com o redirect.
- **MB Way (Easypay)**: `POST /api/easypay-create` e `POST /api/easypay-sync` (consulta o estado e cria a encomenda quando `payment_status` = `paid`). Ajusta cabeçalhos e corpo se o backoffice Easypay exigir outro formato.
- **Cliente — ecrã de espera**: polling a `GET /api/order-status` a cada 10s; quando o estado passa a `pronto`, o timer esconde-se e mostra “Vem buscar, [nome]!”.
- **Receção**: `public/admin.html` — introduz o mesmo `ADMIN_TOKEN` que está na Vercel; lista pedidos (refresh ~2s) e atualiza estados.

## Desenvolvimento local

- Só front estático: `npm install` e `npm run dev` (abre a pasta `public` — **não** há `/api`).
- Com APIs: `npm run dev:vercel` (requer [Vercel CLI](https://vercel.com/docs/cli) e um ficheiro `.env` local com as variáveis de `.env.example`).

## Deploy (Vercel)

1. Importa o repositório; **Root** com `api/`, `lib/`, `public/`, `vercel.json`, `package.json`.
2. Cola as variáveis (ver `.env.example`) no painel **Settings → Environment Variables** (não há automação para isso).
3. **Stripe Webhook**: URL `https://<teu-dominio>/api/stripe-webhook`, evento `checkout.session.completed`, copia o `whsec_` para `STRIPE_WEBHOOK_SECRET`.
4. **Supabase SQL**: executa `supabase/schema.sql`. No **Database → Replication**, confirma que a tabela `orders` está na publicação Realtime (para futuras extensões; o painel atual usa a API, não o Realtime no browser).
5. Coloca as fotos em `public/images/`.

## Estrutura

```
├── api/                 # Vercel Serverless (Node, ESM)
├── lib/                 # Supabase + lógica de encomendas
├── public/
│   ├── index.html
│   ├── admin.html
│   └── images/
├── supabase/schema.sql
└── vercel.json
```

## Rotas API

| Método / caminho            | Uso |
|----------------------------|-----|
| `POST /api/stripe-checkout` | Cria sessão Checkout |
| `POST /api/stripe-webhook`  | Confirma pagamento e insere encomenda |
| `GET /api/complete-order?session_id=` | Pós-redirect Stripe |
| `GET /api/order-status`     | Cliente: `id` + `token` |
| `GET/PATCH /api/admin-orders` | Header `Authorization: Bearer <ADMIN_TOKEN>` |
| `POST /api/easypay-create` | Inicia MB Way |
| `POST /api/easypay-sync`   | Verifica se está pago e cria encomenda |

## Nota sobre o disco A:

Se o projecto estiver num disco com escrita bloqueada, copia esta pasta para `C:\` ou outro sítio com permissões e abre aí no Cursor, ou copia **só** o conteúdo de `C:\Users\syann\Desktop\amparo-batidas-patch\` para a raiz do repositório `amparo-batidas` (sobrescrevendo ficheiros antigos).
