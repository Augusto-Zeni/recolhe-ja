# 🗂️ Recolhe Já - Docker Setup

Este projeto inclui backend (NestJS) e frontend (React Native/Expo) rodando via Docker.

## 🚀 Início Rápido

### Windows
```bash
.\start.bat
```

### Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

### Manual
```bash
docker-compose up --build -d
```

## 📋 Pré-requisitos

- Docker Desktop instalado e rodando
- Docker Compose (incluído no Docker Desktop)

## 🏗️ Arquitetura

### Serviços
- **PostgreSQL** (porta 5432) - Banco de dados principal
- **Redis** (porta 6379) - Cache (opcional)
- **Backend** (porta 3000) - API NestJS
- **Frontend** (portas 8081, 19006) - App Expo/React Native

### Rede
Todos os serviços rodam na rede `recolheja_network` e podem se comunicar usando os nomes dos serviços.

## 🔧 Configuração

### Variáveis de Ambiente
O arquivo `.env` no backend já está configurado para Docker:

```env
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/recolheja?schema=public"
JWT_SECRET="your-super-secret-jwt-key-here-change-in-production"
JWT_EXPIRES_IN="7d"
```

### Banco de Dados
- **Host:** postgres (interno) / localhost (externo)
- **Porta:** 5432
- **Usuário:** postgres
- **Senha:** postgres
- **Database:** recolheja

## 📱 Conectando ao App Mobile

### Opção 1: Expo Go (Recomendado)
1. Instale o Expo Go no seu celular
2. Execute `docker-compose logs frontend` para ver o QR code
3. Escaneie o QR code com o Expo Go

### Opção 2: Web
Acesse: http://localhost:19006

### Opção 3: Simulador
```bash
# Android
docker-compose exec frontend npx expo start --android

# iOS
docker-compose exec frontend npx expo start --ios
```

## 🔍 Comandos Úteis

```bash
# Ver logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Parar tudo
docker-compose down

# Rebuild e restart
docker-compose up --build -d

# Acessar container
docker-compose exec backend sh
docker-compose exec frontend sh

# Executar comandos no backend
docker-compose exec backend npm run db:migrate
docker-compose exec backend npx prisma studio

# Status dos serviços
docker-compose ps

# Remover volumes (CUIDADO: apaga dados do banco)
docker-compose down -v
```

## 🐛 Troubleshooting

### Backend não conecta no banco
```bash
docker-compose logs postgres
docker-compose exec backend npx prisma migrate status
```

### Frontend não carrega
```bash
docker-compose logs frontend
# Verificar se as portas estão disponíveis
netstat -an | findstr :8081
netstat -an | findstr :19006
```

### Resetar tudo
```bash
docker-compose down -v --remove-orphans
docker system prune -a
docker-compose up --build -d
```

## 🔒 Produção

Para produção, altere:
1. `JWT_SECRET` para uma chave segura
2. Senhas do PostgreSQL
3. `NODE_ENV=production`
4. Configure HTTPS/SSL
5. Use volumes externos para dados

## 📊 Monitoramento

### Health Checks
Todos os serviços têm health checks configurados:
- PostgreSQL: `pg_isready`
- Redis: `redis-cli ping`
- Backend: endpoint `/api/users/profile`

### URLs de Status
- Backend API: http://localhost:3000
- Health Check: http://localhost:3000/api/users/profile
- Expo Dev Tools: http://localhost:19002

## 🔗 Endpoints da API

- `GET /api/users/profile` - Perfil do usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/items` - Listar itens
- `GET /api/points` - Pontos de coleta
- `GET /api/events` - Eventos

Veja a documentação completa em: http://localhost:3000/api-docs (se configurado)
