# RecolheJá Backend API

API REST desenvolvida com NestJS para o sistema de classificação de resíduos e gerenciamento de pontos de coleta.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura)
- [Instalação e Configuração](#instalação-e-configuração)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Documentação da API](#documentação-da-api)
- [Banco de Dados](#banco-de-dados)
- [Autenticação](#autenticação)
- [Funcionalidades](#funcionalidades)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Deploy](#deploy)

## 🎯 Sobre o Projeto

O RecolheJá Backend é uma API REST que fornece todos os serviços necessários para o funcionamento do aplicativo mobile de classificação de resíduos. A API oferece:

- **Classificação automática de resíduos** usando IA (Google Cloud Vision)
- **Gerenciamento de usuários** com autenticação JWT
- **Sistema de pontos de coleta** com filtros por categoria
- **Eventos de coleta comunitária** com sistema de participação
- **Histórico de classificações** por usuário
- **Upload e processamento de imagens**

## 🚀 Tecnologias Utilizadas

### Core
- **[NestJS](https://nestjs.com/)** - Framework Node.js para APIs escaláveis
- **[TypeScript](https://www.typescriptlang.org/)** - Linguagem com tipagem estática
- **[Prisma](https://www.prisma.io/)** - ORM moderno para Node.js
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional

### Autenticação & Segurança
- **[Passport.js](http://www.passportjs.org/)** - Middleware de autenticação
- **[JWT](https://jwt.io/)** - Tokens de autenticação
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** - Hash de senhas

### Processamento de Imagens
- **[Google Cloud Vision](https://cloud.google.com/vision)** - IA para classificação de imagens
- **[Multer](https://www.npmjs.com/package/multer)** - Upload de arquivos

### Validação & Documentação
- **[Zod](https://zod.dev/)** - Schema validation
- **[Class Validator](https://github.com/typestack/class-validator)** - Validação de DTOs
- **[OpenAPI/Swagger](https://swagger.io/)** - Documentação da API

## 🏗️ Arquitetura

A aplicação segue os princípios de arquitetura modular do NestJS:

```
src/
├── auth/                 # Módulo de autenticação
├── users/               # Gerenciamento de usuários
├── items/               # Classificação de resíduos
├── collection-points/   # Pontos de coleta
├── events/              # Eventos de coleta
├── prisma/              # Configuração do Prisma
├── common/              # Utilitários compartilhados
│   ├── filters/         # Filtros de exceção
│   └── middleware/      # Middlewares globais
└── pipes/               # Pipes de validação
```

### Padrões Utilizados
- **Repository Pattern** - Através do Prisma ORM
- **Dependency Injection** - Sistema nativo do NestJS
- **Guard Pattern** - Para autenticação e autorização
- **Decorator Pattern** - Para validação e metadados
- **Filter Pattern** - Para tratamento de exceções

## ⚙️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- PostgreSQL 13+
- npm ou yarn

### 1. Clonagem e Instalação
```bash
# Clone o repositório
git clone <repository-url>
cd recolhe-ja/backend

# Instale as dependências
npm install
```

### 2. Configuração do Banco de Dados
```bash
# Configure as variáveis de ambiente
cp .env.example .env

# Execute as migrações
npm run db:migrate

# Popule o banco com dados iniciais
npm run db:seed
```

### 3. Inicialização
```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## 📁 Estrutura do Projeto

### Módulos Principais

#### 🔐 Auth Module (`/auth`)
- **AuthService**: Validação de credenciais e geração de JWT
- **AuthController**: Endpoints de login e registro
- **Guards**: Proteção de rotas autenticadas
- **Strategies**: Estratégias JWT e Local do Passport

#### 👥 Users Module (`/users`)
- **UsersService**: CRUD de usuários
- **UsersController**: Endpoints de gerenciamento de usuários

#### 📸 Items Module (`/items`)
- **ItemsService**: Gerenciamento de itens classificados
- **ItemsController**: Upload e classificação de imagens
- **ImageClassificationService**: IA para classificação automática

#### 📍 Collection Points Module (`/collection-points`)
- **CollectionPointsService**: CRUD de pontos de coleta
- **CollectionPointsController**: Endpoints com filtros geográficos

#### 📅 Events Module (`/events`)
- **EventsService**: Gerenciamento de eventos
- **EventsController**: CRUD e sistema de participação

#### 🗄️ Prisma Module (`/prisma`)
- **PrismaService**: Cliente do banco de dados
- **Schema**: Definições do modelo de dados

## 📖 Documentação da API

### Endpoints Principais

#### Autenticação
```http
POST /api/auth/register
POST /api/auth/login
```

#### Classificação de Resíduos
```http
POST /api/items              # Upload e classificação
GET  /api/items              # Histórico do usuário
GET  /api/items/:id          # Detalhes do item
```

#### Pontos de Coleta
```http
GET  /api/collection-points  # Lista com filtros
POST /api/collection-points  # Criar ponto (admin)
GET  /api/collection-points/:id
```

#### Eventos
```http
GET  /api/events             # Lista de eventos
POST /api/events             # Criar evento
POST /api/events/:id/join    # Participar
DELETE /api/events/:id/leave # Sair
```

### Parâmetros de Consulta Comuns
- `lat` & `lon`: Coordenadas para busca geográfica
- `radius`: Raio de busca em km (padrão: 10km)
- `category`: Filtro por categoria de resíduo
- `limit` & `offset`: Paginação

### Formato de Resposta
```json
{
  "success": true,
  "data": {...},
  "message": "Operação realizada com sucesso"
}
```

### Códigos de Status
- `200` - Sucesso
- `201` - Criado
- `400` - Dados inválidos
- `401` - Não autenticado
- `403` - Não autorizado
- `404` - Não encontrado
- `500` - Erro interno

## 🗃️ Banco de Dados

### Modelo de Dados

#### Users (Usuários)
```sql
- id: String (UUID)
- name: String
- email: String (unique)
- passwordHash: String
- avatar: String?
- createdAt: DateTime
```

#### Items (Itens Classificados)
```sql
- id: String (UUID)
- userId: String? (FK)
- imageUrl: String
- predictedCategory: String
- confidence: Float
- createdAt: DateTime
```

#### Collection Points (Pontos de Coleta)
```sql
- id: String (UUID)
- name: String
- lat: Float
- lon: Float
- address: String
- acceptedCategories: String[]
- openingHours: String
- contact: String?
- createdBy: String (FK)
```

#### Events (Eventos)
```sql
- id: String (UUID)
- title: String
- description: String
- lat: Float
- lon: Float
- startAt: DateTime
- endAt: DateTime
- acceptedCategories: String[]
- createdBy: String (FK)
```

#### Event Participants (Participantes)
```sql
- id: String (UUID)
- eventId: String (FK)
- userId: String (FK)
- status: Enum (INSCRITO, CANCELADO)
```

### Relacionamentos
- **User** 1:N **Items**
- **User** 1:N **Collection Points**
- **User** 1:N **Events**
- **Event** N:M **Users** (através de Event Participants)

## 🔒 Autenticação

### JWT (JSON Web Tokens)
- **Algoritmo**: HS256
- **Expiração**: 7 dias (configurável)
- **Payload**: `{ sub: userId, email: userEmail }`

### Proteção de Rotas
```typescript
@UseGuards(JwtAuthGuard)
@Get('protected-route')
async protectedRoute(@Req() req) {
  // req.user contém os dados do usuário autenticado
}
```

### Headers Obrigatórios
```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

## ✨ Funcionalidades

### 1. Classificação Automática de Resíduos
- Upload de imagens via multipart/form-data
- Processamento com Google Cloud Vision AI
- Classificação em 6 categorias: PLASTICO, PAPEL, METAL, VIDRO, ORGANICO, ELETRONICO
- Instruções personalizadas de descarte
- Fallback com classificação mock para desenvolvimento

### 2. Sistema de Pontos de Coleta
- CRUD completo de pontos de coleta
- Busca geográfica por proximidade
- Filtros por categoria de resíduo aceito
- Informações detalhadas (horários, contato, endereço)

### 3. Eventos Comunitários
- Criação de eventos de coleta
- Sistema de inscrição/cancelamento
- Filtros geográficos e por categoria
- Contadores de participantes

### 4. Histórico de Usuário
- Registro de todas as classificações
- Estatísticas de uso pessoal
- Busca e filtros por categoria
- Exportação de dados (futuro)

### 5. Sistema de Upload
- Validação de tipos de arquivo (JPG, PNG, WEBP)
- Limite de tamanho configurável
- Armazenamento local com servir estático
- Geração de URLs públicas

## 📜 Scripts Disponíveis

### Desenvolvimento
```bash
npm run start:dev     # Inicia com hot-reload
npm run start:debug   # Inicia com debugger
```

### Produção
```bash
npm run build         # Compila TypeScript
npm run start:prod    # Inicia versão compilada
```

### Banco de Dados
```bash
npm run db:migrate    # Executa migrações
npm run db:generate   # Gera cliente Prisma
npm run db:seed       # Popula dados iniciais
npm run db:reset      # Reseta banco (cuidado!)
```

### Testes
```bash
npm run test:api      # Testa endpoints da API
npm run lint          # Executa ESLint
npm run format        # Formata código com Prettier
```

## 🌍 Variáveis de Ambiente

### Obrigatórias
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/recolheja"

# JWT
JWT_SECRET="seu-jwt-secret-muito-seguro"
JWT_EXPIRES_IN="7d"

# App
PORT=3000
NODE_ENV="development"
```

### Opcionais
```env
# Google Cloud Vision (para IA)
GOOGLE_APPLICATION_CREDENTIALS="/path/to/credentials.json"

# Upload
MAX_FILE_SIZE=5242880  # 5MB
UPLOAD_PATH="./uploads"

# CORS
CORS_ORIGIN="*"
```

## 🚀 Deploy

### Docker
```bash
# Build da imagem
docker build -t recolheja-api .

# Execução
docker run -p 3000:3000 recolheja-api
```

### Docker Compose
```bash
# Sobe toda a stack (API + PostgreSQL)
docker-compose up -d
```

### Heroku
```bash
# Login no Heroku
heroku login

# Criar app
heroku create recolheja-api

# Adicionar PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main
```

### Variáveis de Produção
```bash
# Configurar variáveis no Heroku
heroku config:set JWT_SECRET=seu-secret-producao
heroku config:set NODE_ENV=production
```

## 🔧 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com banco**
   ```bash
   # Verifique se o PostgreSQL está rodando
   sudo service postgresql status
   
   # Teste a conexão
   psql -U postgres -d recolheja
   ```

2. **Erro na classificação de imagens**
   ```bash
   # Verificar se as credenciais do Google Cloud estão configuradas
   echo $GOOGLE_APPLICATION_CREDENTIALS
   ```

3. **Erro de CORS**
   ```bash
   # Configurar origem permitida
   export CORS_ORIGIN="http://localhost:19006"  # Expo dev server
   ```

## 📝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Padrões de Código
- Use TypeScript para tipagem estrita
- Siga os padrões do ESLint/Prettier
- Escreva testes para novas funcionalidades
- Documente APIs com JSDoc
- Use commits semânticos

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).

---

**Desenvolvido pela Equipe RecolheJá** 🌱♻️

Para mais informações, consulte a [documentação completa da API](./api-docs.yaml) ou acesse `/api-docs` quando o servidor estiver rodando.
