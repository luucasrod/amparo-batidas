#!/bin/bash

echo "🍽️  Restaurant QR System - Iniciando..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Checar se Docker está instalado (opcional)
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker não encontrado. Certifique-se de ter PostgreSQL rodando em localhost:5432${NC}"
fi

# Iniciar Backend
echo -e "${GREEN}📍 Iniciando Backend...${NC}"
cd backend
npm start &
BACKEND_PID=$!

sleep 3

# Iniciar Frontend
echo -e "${GREEN}📍 Iniciando Frontend...${NC}"
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}✅ Sistema iniciado!${NC}"
echo ""
echo "📊 Backend:  http://localhost:5000"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo -e "${YELLOW}Admin Login:${NC}     http://localhost:3000/admin/login"
echo -e "${YELLOW}Cliente App:${NC}      http://localhost:3000"
echo ""
echo "Pressione Ctrl+C para parar o sistema"
echo ""

# Wait for both processes
wait
