# 🍽️ Restaurant QR System

Sistema completo de pedidos e pagamento por QR Code para restaurantes. Permite que clientes escaneem QR codes nas mesas, visualizem o menu, façam pedidos e paguem individualmente, além de automatizar avaliações do restaurante.

## 🎯 Funcionalidades

### Para Clientes
- ✅ Escanear QR Code da mesa
- ✅ Visualizar cardápio integrado
- ✅ Fazer pedidos diretamente pelo QR
- ✅ Marcar itens pessoais do pedido
- ✅ Dividir conta entre amigos (pagar apenas sua parte)
- ✅ Processar pagamento
- ✅ Avaliação automática após pagamento

### Para Restaurantes (Admin)
- ✅ Dashboard de gerenciamento
- ✅ Criar e gerenciar mesas com QR Codes
- ✅ Gerenciar cardápio
- ✅ Visualizar avaliações e estatísticas
- ✅ Autenticação segura

## 🏗️ Estrutura do Projeto

```
restaurant-qr-system/
├── backend/          # Node.js + Express API
│   ├── config/       # Configuração de banco de dados
│   ├── controllers/  # Lógica de negócio
│   ├── middleware/   # Autenticação e validação
│   ├── routes/       # Endpoints da API
│   ├── utils/        # Funções auxiliares (QR, JWT)
│   └── server.js     # Arquivo principal
├── frontend/         # React Web Application
│   ├── public/       # Assets estáticos
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── screens/       # Telas principais
│   │   ├── services/      # Chamadas de API
│   │   ├── store/         # Gerenciamento de estado (Zustand)
│   │   ├── styles/        # Estilos CSS
│   │   ├── App.js         # Componente raiz
│   │   └── index.js       # Ponto de entrada
│   └── package.json
└── README.md
```

## 🚀 Instalação e Setup

### Pré-requisitos
- Node.js (v14+)
- npm ou yarn
- PostgreSQL (para banco de dados)

### 1. Setup do Backend

```bash
cd backend

# Instalar dependências (já feito)
npm install

# Criar arquivo .env
cp .env.example .env

# Atualizar .env com suas configurações
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=restaurant_qr
# DB_USER=postgres
# DB_PASSWORD=seu_password

# Iniciar servidor
npm start
```

O backend estará disponível em `http://localhost:5000`

### 2. Setup do Frontend

```bash
cd frontend

# Instalar dependências (já feito)
npm install

# Criar arquivo .env
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Iniciar aplicação
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## 📝 Documentação da API

### Autenticação (Restaurant)

**POST** `/api/auth/register`
```json
{
  "name": "Meu Restaurante",
  "email": "admin@restaurant.com",
  "password": "senha123",
  "phone": "+351 912 345 678",
  "address": "Rua Principal, 123",
  "city": "Lisboa"
}
```

**POST** `/api/auth/login`
```json
{
  "email": "admin@restaurant.com",
  "password": "senha123"
}
```

**GET** `/api/auth/profile` (requer autenticação)

### Mesas

**POST** `/api/tables` (requer autenticação)
```json
{
  "table_number": 1,
  "capacity": 4
}
```

**GET** `/api/tables` (requer autenticação)

**POST** `/api/tables/scan` (público)
```json
{
  "qr_data": "{...}"
}
```

### Menu

**POST** `/api/menu` (requer autenticação)
```json
{
  "name": "Bacalhau à Brás",
  "description": "Bacalhau desfiado com batata palha",
  "price": 15.50,
  "category": "Peixe",
  "image_url": "https://..."
}
```

**GET** `/api/menu/:restaurantId` (público)

**GET** `/api/menu` (requer autenticação)

### Pedidos

**POST** `/api/orders`
```json
{
  "table_id": 1
}
```

**POST** `/api/orders/item`
```json
{
  "order_id": 1,
  "menu_item_id": 5,
  "customer_name": "João",
  "quantity": 2,
  "notes": "Sem cebola"
}
```

**GET** `/api/orders/:order_id`

**GET** `/api/orders/:order_id/:customer_name`

### Pagamentos

**POST** `/api/payments`
```json
{
  "order_id": 1,
  "customer_name": "João",
  "amount": 31.00,
  "payment_method": "cash"
}
```

**GET** `/api/payments/:order_id`

### Avaliações

**POST** `/api/ratings`
```json
{
  "order_id": 1,
  "customer_name": "João",
  "rating": 5,
  "comment": "Excelente comida!"
}
```

**GET** `/api/ratings/:restaurantId` (público)

**GET** `/api/ratings/auth/my-ratings` (requer autenticação)

## 🔒 Segurança

- ✅ Senhas hasheadas com bcryptjs
- ✅ JWT para autenticação
- ✅ Validação de entrada
- ✅ CORS configurado
- ✅ SQL seguro com prepared statements (pg library)

## 🧪 Testando o Sistema

### Fluxo Cliente
1. Acesse `http://localhost:3000`
2. Cole um QR code de teste no scanner (você pode gerar via admin)
3. Informe seu nome
4. Escolha itens do menu
5. Visualize seu resumo
6. Realize o pagamento
7. Deixe uma avaliação

### Fluxo Admin
1. Acesse `http://localhost:3000/admin/login`
2. Clique em "Registre-se"
3. Preencha os dados do restaurante
4. Acesse o dashboard
5. Crie mesas (QR codes são gerados automaticamente)
6. Adicione itens ao cardápio
7. Visualize avaliações em tempo real

## 📊 Diagrama de Fluxo

```
Cliente
  ↓
Escaneia QR Code
  ↓
Identifica Mesa & Cria Pedido
  ↓
Informa Nome
  ↓
Visualiza Menu & Faz Pedido
  ↓
Marca Seus Itens
  ↓
Calcula Sua Parte
  ↓
Realiza Pagamento
  ↓
Avaliação (⭐⭐⭐⭐⭐)
  ↓
Restaurante Recebe Rating Automático
```

## 🛠️ Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Hashing de senhas
- **QRCode** - Geração de QR codes
- **CORS** - Segurança cross-origin

### Frontend
- **React** - UI library
- **React Router** - Roteamento
- **Axios** - HTTP client
- **Zustand** - State management
- **CSS3** - Estilização responsiva

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- ✅ Desktop
- ✅ Tablet
- ✅ Mobile

## 🚀 Deploy

### Backend (Vercel, Render, etc)
```bash
# Preparar para produção
npm run build

# Variáveis de ambiente necessárias:
# DATABASE_URL (instead of separate DB_* vars)
# JWT_SECRET
# NODE_ENV=production
```

### Frontend (Vercel, Netlify, etc)
```bash
npm run build

# Variáveis de ambiente:
# REACT_APP_API_URL=https://seu-backend.com/api
```

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

## 📄 Licença

MIT License

---

**Desenvolvido com ❤️ para revolucionar o atendimento em restaurantes**
