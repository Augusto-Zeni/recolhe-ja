#!/bin/bash

echo "🚀 Iniciando Recolhe Já - Backend e Frontend"
echo "=============================================="

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Construir e iniciar todos os serviços
echo "🏗️  Construindo e iniciando serviços..."
docker-compose up --build -d

# Aguardar os serviços ficarem prontos
echo "⏳ Aguardando serviços ficarem prontos..."
sleep 10

# Executar migrations do Prisma
echo "🔧 Executando migrations do banco de dados..."
docker-compose exec backend npx prisma migrate dev --name init

# Gerar cliente Prisma
echo "📦 Gerando cliente Prisma..."
docker-compose exec backend npx prisma generate

# Mostrar status dos serviços
echo "📊 Status dos serviços:"
docker-compose ps

echo ""
echo "✅ Aplicação iniciada com sucesso!"
echo ""
echo "🔗 URLs disponíveis:"
echo "   Backend API: http://localhost:3000"
echo "   Frontend (Expo): http://localhost:19006"
echo "   PostgreSQL: localhost:5432"
echo "   Redis: localhost:6379"
echo ""
echo "📱 Para conectar no app mobile:"
echo "   1. Abra o Expo Go no seu celular"
echo "   2. Escaneie o QR code que aparecerá nos logs"
echo "   3. Ou acesse: exp://192.168.x.x:8081"
echo ""
echo "📋 Comandos úteis:"
echo "   docker-compose logs -f backend     # Ver logs do backend"
echo "   docker-compose logs -f frontend    # Ver logs do frontend"
echo "   docker-compose down                # Parar todos os serviços"
echo "   docker-compose up -d               # Iniciar todos os serviços"
