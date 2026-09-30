# 🏗️ Arquitetura - Restaurant QR System

## Visão Geral

Sistema de três camadas:
1. **Frontend** (React) - Interface do usuário
2. **Backend** (Node.js/Express) - API e lógica de negócio
3. **Database** (PostgreSQL) - Persistência de dados

```
┌─────────────────┐
│   Cliente Web   │
│  (React 19.3)   │
└────────┬────────┘
         │
    (HTTP/REST)
         │
┌────────▼────────┐         ┌──────────────────┐
│  Express API    │◄────────►│   PostgreSQL 15  │
│  (Node.js)      │         │                  │
│                 │         └──────────────────┘
│ - Auth (JWT)    │
│ - QR Code       │
│ - Orders        │
│ - Payments      │
│ - Ratings       │
└─────────────────┘
```

## 📁 Estrutura de Diretórios

### Backend
```
backend/
├── config/
│   ├── database.js      # Conexão PostgreSQL
│   └── init-db.js       # Schema criação
├── controllers/         # Lógica de negócio
│   ├── restaurantController.js
│   ├── tableController.js
│   ├── menuController.js
│   ├── orderController.js
│   ├── paymentController.js
│   └── ratingController.js
├── middleware/
│   └── auth.js          # JWT verificação
├── routes/              # Endpoints
│   ├── auth.js
│   ├── tables.js
│   ├── menu.js
│   ├── orders.js
│   ├── payments.js
│   └── ratings.js
├── utils/
│   ├── jwt.js           # Token & hash
│   └── qrcode.js        # QR geração
├── server.js            # Ponto de entrada
├── .env                 # Variáveis
└── package.json
```

### Frontend
```
frontend/
├── public/
│   └── index.html       # Template HTML
├── src/
│   ├── components/      # Componentes React
│   │   ├── QRScanner.js
│   │   ├── MenuList.js
│   │   ├── OrderSummary.js
│   │   └── RatingForm.js
│   ├── screens/         # Telas principais
│   │   ├── AdminLoginScreen.js
│   │   ├── AdminDashboardScreen.js
│   │   └── CustomerScreen.js
│   ├── services/        # API clients
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── tableService.js
│   │   ├── menuService.js
│   │   ├── orderService.js
│   │   ├── paymentService.js
│   │   └── ratingService.js
│   ├── store/           # Zustand state
│   │   └── useStore.js
│   ├── styles/          # CSS
│   │   ├── index.css
│   │   └── App.css
│   ├── App.js           # Componente raiz
│   └── index.js         # Entrada
├── .env
└── package.json
```

## 🗄️ Schema do Banco de Dados

### Tabelas

#### restaurants
```sql
id (PK) | name | email (UNIQUE) | password | phone | address | city | logo_url | created_at | updated_at
```

#### tables
```sql
id (PK) | restaurant_id (FK) | table_number | qr_code_data (UNIQUE) | capacity | is_active | created_at
```

#### menu_items
```sql
id (PK) | restaurant_id (FK) | name | description | price | category | image_url | is_available | created_at | updated_at
```

#### orders
```sql
id (PK) | table_id (FK) | restaurant_id (FK) | session_id (UNIQUE) | status | created_at | updated_at
```

#### order_items
```sql
id (PK) | order_id (FK) | menu_item_id (FK) | customer_name | quantity | price | notes | is_paid | created_at
```

#### payments
```sql
id (PK) | order_id (FK) | customer_name | amount | payment_method | status | created_at
```

#### ratings
```sql
id (PK) | restaurant_id (FK) | order_id (FK) | customer_name | rating (1-5) | comment | created_at
```

## 🔐 Autenticação & Autorização

### Fluxo de Auth

1. **Registro** → Senha hasheada com bcryptjs
2. **Login** → JWT gerado com ID do restaurante
3. **Requisição** → Token no header `Authorization: Bearer <token>`
4. **Middleware** → Valida e decodifica JWT
5. **Acesso** → Usuário é identificado

### Endpoints Públicos
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/tables/scan`
- GET `/api/menu/:restaurantId`
- GET `/api/ratings/:restaurantId`
- POST `/api/orders` (cria novo)
- POST `/api/orders/item` (qualquer cliente)
- POST `/api/payments` (qualquer cliente)
- POST `/api/ratings` (qualquer cliente)

### Endpoints Autenticados
- GET `/api/auth/profile`
- PUT `/api/auth/profile`
- POST `/api/tables`
- GET `/api/tables`
- POST `/api/menu`
- GET `/api/menu`
- PUT `/api/menu/:id`
- DELETE `/api/menu/:id`
- GET `/api/ratings/auth/my-ratings`

## 📡 Fluxo de Dados

### Cliente Fazendo Pedido

```
1. Cliente escaneia QR
   ↓
2. Frontend chama POST /api/tables/scan
   Backend retorna dados da mesa
   ↓
3. Frontend cria ordem: POST /api/orders
   Backend retorna order_id
   ↓
4. Cliente seleciona itens e adiciona
   Frontend chama POST /api/orders/item (múltiplas vezes)
   ↓
5. Cliente vê seu resumo
   Frontend chama GET /api/orders/:order_id/:customer_name
   ↓
6. Cliente paga
   Frontend chama POST /api/payments
   ↓
7. Cliente avalia
   Frontend chama POST /api/ratings
```

### Admin Gerenciando

```
1. Admin faz login
   Frontend chama POST /api/auth/login
   ↓
2. Dashboard carrega dados
   Frontend chama GET /api/tables, /api/menu, /api/ratings
   ↓
3. Admin cria mesa
   Frontend chama POST /api/tables
   Backend gera QR code
   ↓
4. Admin adiciona prato
   Frontend chama POST /api/menu
   ↓
5. Admin vê avaliações
   Frontend chama GET /api/ratings/auth/my-ratings
```

## 🔧 Configuração & Variáveis

### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=restaurant_qr
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=super_secret_key
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Escalabilidade

### Melhorias Futuras

**Curto Prazo:**
- [ ] Caching com Redis
- [ ] Rate limiting
- [ ] Validação de entrada robusta
- [ ] Testes automatizados
- [ ] CI/CD com GitHub Actions

**Médio Prazo:**
- [ ] Suporte NFC
- [ ] Pagamentos integrados (Stripe, PayPal)
- [ ] Notificações em tempo real (WebSocket)
- [ ] Sistema de delivery
- [ ] App mobile nativo (React Native)

**Longo Prazo:**
- [ ] Multi-restaurante (SaaS)
- [ ] Analytics avançado
- [ ] Recomendações com IA
- [ ] Integrações com POS
- [ ] Sistema de reservas

## 📊 Performance

### Otimizações Implementadas
- ✅ Connection pooling (pg)
- ✅ JWT (stateless)
- ✅ Lazy loading no frontend
- ✅ CSS moderno (sem framework pesado)

### Possíveis Melhorias
- [ ] GraphQL ao invés de REST
- [ ] Compressão de imagens
- [ ] CDN para assets
- [ ] Service Workers
- [ ] Code splitting

## 🔍 Monitoramento & Logs

### Recomendado Adicionar
- [ ] Winston ou Pino para logging
- [ ] Sentry para error tracking
- [ ] Datadog ou NewRelic para APM
- [ ] Health checks automáticos

## 🧪 Testes

### Tipos de Teste
```
- Unitários (Jest)
- Integração (Supertest)
- E2E (Cypress)
- Performance (K6)
```

### Cobertura Alvo
- Backend: 80%+
- Frontend: 60%+

## 📦 Deployment

### Opções

**Backend:**
- Vercel
- Render
- Railway
- Heroku
- AWS Lambda

**Frontend:**
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

**Database:**
- AWS RDS
- Supabase
- Railway
- Render

## 🔐 Segurança

### Implementado
- ✅ Senhas hasheadas (bcryptjs)
- ✅ JWT com expiração
- ✅ CORS configurado
- ✅ SQL Injection prevenido (prepared statements)

### Recomendado
- [ ] HTTPS/TLS
- [ ] Rate limiting
- [ ] Input validation completa
- [ ] OWASP Top 10 audit
- [ ] Penetration testing

## 📚 Referências

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io/)
- [QR Code Generator](https://qrcode.js.org/)

---

**Documentação de Arquitetura - v1.0**
