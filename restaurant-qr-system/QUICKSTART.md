# ⚡ Quick Start - Restaurant QR System

## 🚀 Iniciar em 5 minutos

### Opção 1: Com Script (Recomendado)

```bash
# 1. Dê permissão ao script
chmod +x start.sh

# 2. Execute
./start.sh
```

Isso vai iniciar tanto backend quanto frontend automaticamente.

### Opção 2: Manual

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Opção 3: Com Docker (Inclui Banco de Dados)

```bash
# Inicie o PostgreSQL
docker-compose up -d

# Depois siga as instruções do Terminal 1 e 2 acima
```

---

## 📍 URLs

| Componente | URL |
|-----------|-----|
| Admin Login | http://localhost:3000/admin/login |
| Cliente App | http://localhost:3000 |
| Backend API | http://localhost:5000/api |
| Health Check | http://localhost:5000/health |

---

## 🔐 Primeira Vez - Criar Restaurante

1. Vá para **http://localhost:3000/admin/login**
2. Clique em **"Registre-se"**
3. Preencha:
   - Nome: `Restaurante Lisboa`
   - Email: `admin@lisboa.pt`
   - Senha: `senha123`
   - Cidade: `Lisboa`
4. Clique em **"Registrar"**

✅ Pronto! Você está no dashboard

---

## 🎯 Próximos Passos

### 1️⃣ Criar Mesas (Admin)
- Clique em **"+ Nova Mesa"**
- Digite o número (1, 2, 3...)
- QR Code é gerado automaticamente

### 2️⃣ Adicionar Cardápio (Admin)
- Clique na aba **"Cardápio"**
- Clique em **"+ Adicionar Prato"**
- Preencha: Nome, Preço, Categoria

### 3️⃣ Fazer Pedido (Cliente)
- Acesse **http://localhost:3000**
- Cole um QR code da mesa
- Informe seu nome
- Escolha pratos
- Pague e avalie

---

## 🧪 Testar com Dados de Exemplo

```bash
cd backend
npm run seed
```

Isso cria:
- ✅ 1 Restaurante
- ✅ 4 Mesas com QR codes
- ✅ 8 Itens de menu prontos

Credenciais:
- Email: `admin@lisboa.pt`
- Senha: `senha123`

---

## 🆘 Problemas Comuns

### Porta 3000 ou 5000 já está em uso?

**Frontend:**
```bash
PORT=3001 npm start
```

**Backend:**
```bash
PORT=5001 npm start
```

### Banco de dados não conecta?

Verifique `.env` no backend:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=restaurant_qr
DB_USER=postgres
DB_PASSWORD=password
```

### Frontend mostra página branca?

1. Abra **DevTools** (F12)
2. Verifique console para erros
3. Certifique-se que `REACT_APP_API_URL` está certo

---

## 💡 Dicas de Teste

1. **Teste com QR Copy/Paste**: No formulário de scanner, cole o QR code json
2. **Múltiplos Clientes**: Abra várias abas para simular mesas cheias
3. **Avaliações**: Veja se atualizam em tempo real no admin

---

## 📊 Estrutura do Projeto

```
restaurant-qr-system/
├── backend/          # API Node.js/Express
├── frontend/         # Aplicação React
├── docker-compose.yml # PostgreSQL
├── start.sh         # Script de inicialização
├── seed.js          # Dados de exemplo
├── README.md        # Documentação completa
├── TESTING.md       # Guia de testes
└── QUICKSTART.md    # Este arquivo
```

---

## 🔄 Próximos Passos

- ✅ Testar fluxo completo (cliente + admin)
- ✅ Personalizar design
- ✅ Configurar pagamentos reais
- ✅ Deploy em produção
- ✅ Adicionar NFC scanning

---

**Tudo funcionando? Parabéns! 🎉**

Documentação completa em [README.md](README.md)
Guia de testes detalhado em [TESTING.md](TESTING.md)
