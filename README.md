# Recolhe Já

Sistema de gerenciamento de coleta de resíduos composto por um backend em NestJS e um aplicativo mobile em React Native com Expo.

## Estrutura do Projeto

```
recolhe-ja/
├── backend/           # API REST em NestJS
└── mobile/           # Aplicativo mobile em React Native (Expo)
```

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Docker](https://www.docker.com/get-started) e [Docker Compose](https://docs.docker.com/compose/)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (opcional, para executar o mobile)

## Configuração Inicial

### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd recolhe-ja
```

## Backend

O backend é uma API REST desenvolvida com NestJS e PostgreSQL.

### Configuração do Backend

#### 1. Navegue até a pasta do backend

```bash
cd backend
```

#### 2. Instale as dependências

```bash
npm install
```

#### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure as seguintes variáveis:

```env
# Database Configuration
DB_HOST=db
DB_PORT=5432
DB_USERNAME=user
DB_PASSWORD=password
DB_DATABASE=recolheja_db

# Application Environment
NODE_ENV=development

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# JWT Configuration
JWT_SECRET=your-jwt-secret-key-change-this-in-production

# Application Port
PORT=3000

# Host Configuration for Docker
HOST_UID=1001
HOST_GID=1001

# Ngrok Configuration (opcional, para expor a API publicamente)
NGROK_AUTHTOKEN=your-ngrok-authtoken-here
```

#### Variáveis Obrigatórias

As seguintes variáveis **devem** ser configuradas:

- **`GOOGLE_CLIENT_ID`** e **`GOOGLE_CLIENT_SECRET`**: Credenciais do Google OAuth. [Obtenha aqui](https://console.cloud.google.com/apis/credentials)
- **`JWT_SECRET`**: Chave secreta para geração de tokens JWT (use uma string aleatória e segura)

#### Variáveis Opcionais

- **`NGROK_AUTHTOKEN`**: Se você deseja expor a API publicamente para testes com o mobile em dispositivos físicos. [Obtenha aqui](https://dashboard.ngrok.com/get-started/your-authtoken)

### Executando o Backend com Docker

#### 1. Inicie os containers

```bash
docker-compose up -d
```

Isso irá iniciar:
- **db**: Banco de dados PostgreSQL
- **app**: API NestJS
- **ngrok**: Serviço de tunneling (se configurado)

#### 2. Verifique se os containers estão rodando

```bash
docker-compose ps
```

#### 3. Popule o banco de dados com as seeds

Execute o script de seed para popular o banco de dados com dados iniciais:

```bash
docker-compose exec app npm run seed
```

Ou, se preferir executar diretamente (sem Docker):

```bash
npm run seed
```

A API estará disponível em: `http://localhost:3000`

### Executando o Backend sem Docker (Desenvolvimento Local)

Se preferir executar sem Docker:

#### 1. Configure o PostgreSQL localmente

Instale o PostgreSQL e crie um banco de dados:

```sql
CREATE DATABASE recolheja_db;
```

#### 2. Atualize o `.env`

Ajuste as variáveis de conexão do banco:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=seu-usuario-postgres
DB_PASSWORD=sua-senha-postgres
DB_DATABASE=recolheja_db
```

#### 3. Execute a aplicação

```bash
# Modo desenvolvimento (com hot-reload)
npm run start:dev

# Modo produção
npm run build
npm run start:prod
```

#### 4. Popule o banco de dados

```bash
npm run seed
```

### Scripts Disponíveis no Backend

```bash
npm run start          # Inicia a aplicação
npm run start:dev      # Inicia em modo desenvolvimento (hot-reload)
npm run start:prod     # Inicia em modo produção
npm run build          # Compila o projeto
npm run seed           # Executa as seeds do banco de dados
npm run lint           # Executa o linter
npm run format         # Formata o código
```

## Mobile

O aplicativo mobile é desenvolvido com React Native usando Expo.

### Configuração do Mobile

#### 1. Navegue até a pasta do mobile

```bash
cd mobile
```

#### 2. Instale as dependências

```bash
npm install
```

#### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:

```env
# API Configuration
# URL da API para desenvolvimento local
EXPO_PUBLIC_API_URL=http://localhost:3000

# URL da API para staging
EXPO_PUBLIC_API_URL_STAGING=http://example:3000

# URL da API para produção
EXPO_PUBLIC_API_URL_PROD=https://api.example.com

# Google Maps API Key
GOOGLE_MAPS_API_KEY=your_api_key
```

#### Variáveis Obrigatórias

- **`EXPO_PUBLIC_API_URL`**: URL da API backend (ex: `http://localhost:3000` ou URL do ngrok)
- **`GOOGLE_MAPS_API_KEY`**: Chave da API do Google Maps. [Obtenha aqui](https://developers.google.com/maps/documentation/javascript/get-api-key)

**Importante**: Se você estiver testando em um dispositivo físico, não poderá usar `localhost`. Opções:

1. Use o IP local da sua máquina (ex: `http://192.168.1.100:3000`)
2. Use o ngrok para expor a API publicamente (ex: `https://abc123.ngrok.io`)

### Executando o Mobile

#### 1. Inicie o Expo

```bash
npm start
```

#### 2. Execute em um emulador ou dispositivo

```bash
# Android
npm run android

# iOS (apenas macOS)
npm run ios

# Web
npm run web
```

Você também pode escanear o QR code com o aplicativo **Expo Go** no seu dispositivo móvel.

### Scripts Disponíveis no Mobile

```bash
npm start              # Inicia o Expo
npm run android        # Abre no emulador Android
npm run ios            # Abre no simulador iOS
npm run web            # Abre no navegador
npm run lint           # Executa o linter
```

## Fluxo Completo de Inicialização

### Usando Docker (Recomendado)

```bash
# 1. Configure as variáveis de ambiente
cd backend
cp .env.example .env
# Edite o .env e configure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET e JWT_SECRET

# 2. Inicie o backend
docker-compose up -d

# 3. Aguarde os containers iniciarem e popule o banco
docker-compose exec app npm run seed

# 4. Configure o mobile
cd ../mobile
cp .env.example .env
# Edite o .env e configure EXPO_PUBLIC_API_URL e GOOGLE_MAPS_API_KEY

# 5. Instale dependências e inicie o mobile
npm install
npm start
```

### Desenvolvimento Local (Sem Docker)

```bash
# 1. Configure e inicie o backend
cd backend
cp .env.example .env
# Edite o .env (ajuste DB_HOST para localhost)
npm install
npm run start:dev
npm run seed

# 2. Configure e inicie o mobile
cd ../mobile
cp .env.example .env
# Edite o .env
npm install
npm start
```

## Troubleshooting

### Erro de Conexão com o Banco de Dados

- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Se usando Docker, verifique os logs: `docker-compose logs db`

### Erro ao Executar Seeds

- Certifique-se de que o banco de dados está rodando
- Verifique se as migrações foram executadas (se aplicável)
- Confira os logs de erro para identificar o problema

### Mobile Não Conecta com a API

- Verifique se a API está rodando (`http://localhost:3000`)
- Se estiver usando dispositivo físico, use o IP da máquina ou ngrok
- Confirme que `EXPO_PUBLIC_API_URL` está correto no `.env` do mobile

### Problemas com Google OAuth

- Verifique se `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` estão corretos
- Confirme que a URL de callback está registrada no Google Cloud Console
- Em desenvolvimento, adicione `http://localhost:3000` nas URLs autorizadas

## Documentação da API

Quando o backend estiver rodando, acesse a documentação Swagger em:

```
http://localhost:3000/api
```

## Tecnologias Utilizadas

### Backend
- NestJS
- TypeORM
- PostgreSQL
- Passport (Google OAuth, JWT)
- Docker

### Mobile
- React Native
- Expo
- React Navigation
- Axios
- React Native Maps

## Licença

Este projeto é privado e não possui licença pública.
