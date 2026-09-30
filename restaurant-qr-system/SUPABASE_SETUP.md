# 🚀 Supabase Setup - Restaurant QR System

## ✅ Projeto Criado!

**Projeto ID**: `kyrkdtgrghqopbmhlwfj`  
**Nome**: `restaurant-qr-system`  
**Região**: `eu-west-1` (Ireland)  
**Status**: ✅ ACTIVE_HEALTHY

## 📍 Acessar Supabase

1. Vá para: https://app.supabase.com
2. Selecione organização: **Cashy**
3. Projeto: **restaurant-qr-system**
4. Clique em **Settings** → **Database**

## 🔑 Pegar Credenciais de Conexão

### Método 1: Connection String (Mais Fácil)
1. Em Settings → Database
2. Procure por "Connection string"
3. Selecione "URI"
4. Copie a string completa (parece com: `postgresql://postgres:...@db.*.supabase.co:5432/postgres`)

### Método 2: Dados Individuais
Em Settings → Database, você encontrará:
- **Host**: `db.kyrkdtgrghqopbmhlwfj.supabase.co`
- **Port**: `5432`
- **Database**: `postgres`
- **User**: `postgres`
- **Password**: [clique em "Reveal" para ver]

## ⚙️ Configurar Backend

### Opção 1: Connection String (Recomendado)

1. Copie a connection string do Supabase
2. No backend, atualize `.env`:

```env
DATABASE_URL=postgresql://postgres:seu_password@db.kyrkdtgrghqopbmhlwfj.supabase.co:5432/postgres
JWT_SECRET=super_secret_jwt_key_12345
NODE_ENV=production
PORT=5000
```

3. Modifique `backend/config/database.js`:

```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
```

### Opção 2: Variáveis Individuais

```env
DB_HOST=db.kyrkdtgrghqopbmhlwfj.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=seu_password
JWT_SECRET=super_secret_jwt_key_12345
NODE_ENV=production
PORT=5000
```

## 📦 Tabelas Criadas

✅ Todas as 7 tabelas estão criadas e prontas:

```sql
- restaurants (gerenciamento de restaurantes)
- tables (mesas com QR codes)
- menu_items (itens do cardápio)
- orders (pedidos)
- order_items (itens dos pedidos)
- payments (pagamentos)
- ratings (avaliações)
```

## 🧪 Testar Conexão

```bash
cd backend

# Atualize .env com credenciais do Supabase
npm start
```

Você deve ver:
```
✅ Server running on port 5000
📍 API available at http://localhost:5000
✅ Database connected to Supabase
```

## 🌐 Frontend (Sem Mudanças)

O frontend continua igual:

```bash
cd frontend
npm start
```

## 📊 Monitorar Banco de Dados

1. Vá para: https://app.supabase.com/project/kyrkdtgrghqopbmhlwfj
2. Clique em **SQL Editor** para executar queries
3. Clique em **Table Editor** para ver dados
4. Clique em **Logs** para ver erros

## 🚀 Deploy com Supabase

### Backend (Vercel)
1. Conecte GitHub a Vercel
2. Defina variáveis de ambiente:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`

### Frontend (Vercel/Netlify)
```env
REACT_APP_API_URL=https://seu-backend-vercel.com/api
```

## 💡 Dicas

- 🔒 **Segurança**: Nunca committe credenciais no Git
- 📱 **Backup**: Supabase faz backup automático
- ⚡ **Performance**: Índices já estão criados nas FKs
- 🌍 **Geo**: Dados em Ireland (EU-WEST-1), máxima velocidade em Portugal

## 🆘 Troubleshooting

### "Connection refused"
- Verifique se host está correto
- Certifique-se de estar usando porta 5432
- Supabase pode estar em manutenção (raro)

### "Invalid password"
- Clique "Reveal" em Settings → Database para copiar exato
- Espaços ou caracteres especiais precisam estar no .env

### "SSL certificate problem"
- Use `ssl: { rejectUnauthorized: false }` na conexão (como no exemplo acima)

## 📞 Próximos Passos

1. ✅ Conectar backend ao Supabase
2. ✅ Testar fluxo completo
3. ⏭️ Fazer seed de dados de teste
4. ⏭️ Deploy em produção

---

**Status**: ✅ Supabase Pronto & Banco de Dados Criado!
