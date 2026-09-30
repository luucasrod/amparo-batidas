#!/bin/bash

# Restaurant QR System - Supabase Connection Setup
# Este script ajuda a configurar a conexão com Supabase

echo "🍽️  Restaurant QR System - Configuração Supabase"
echo "=================================================="
echo ""

echo "✅ Projeto já criado no Supabase!"
echo "   ID: kyrkdtgrghqopbmhlwfj"
echo "   Nome: restaurant-qr-system"
echo "   Região: eu-west-1 (Ireland)"
echo ""

echo "📍 Passo 1: Pegar credenciais do Supabase"
echo "   1. Vá para: https://app.supabase.com"
echo "   2. Entre na organização: Cashy"
echo "   3. Selecione projeto: restaurant-qr-system"
echo "   4. Clique: Settings → Database"
echo "   5. Procure: Connection String / URI"
echo ""

echo "🔑 Passo 2: Copiar a connection string"
echo "   Deve parecer com:"
echo "   postgresql://postgres:YourPassword@db.kyrkdtgrghqopbmhlwfj.supabase.co:5432/postgres"
echo ""

read -p "Cole a connection string e pressione Enter: " CONNECTION_STRING

if [ -z "$CONNECTION_STRING" ]; then
    echo "❌ Connection string vazia!"
    exit 1
fi

echo ""
echo "💾 Passo 3: Salvando em .env..."

# Backup do .env atual
cp backend/.env backend/.env.bak

# Criar novo .env com DATABASE_URL
cat > backend/.env << EOF
DATABASE_URL=$CONNECTION_STRING
JWT_SECRET=super_secret_jwt_key_12345
NODE_ENV=production
PORT=5000
EOF

echo "✅ .env atualizado!"
echo ""

echo "📋 Arquivo .env:"
cat backend/.env

echo ""
echo "🚀 Passo 4: Testar conexão"
echo "   Execute: cd backend && npm start"
echo ""

echo "✨ Pronto! Sistema configurado com Supabase"
echo ""
echo "📍 URLs:"
echo "   API: http://localhost:5000"
echo "   Frontend: http://localhost:3000"
echo "   Supabase: https://app.supabase.com/project/kyrkdtgrghqopbmhlwfj"
echo ""
