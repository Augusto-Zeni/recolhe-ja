# RecolheJá Backend

Backend da aplicação RecolheJá - Sistema para identificação de resíduos e gestão de pontos de coleta.

## 🚀 Tecnologias

- **Node.js** com **NestJS**
- **PostgreSQL** com **Prisma ORM**
- **JWT** para autenticação
- **Google Cloud Vision API** para classificação de imagens
- **Multer** para upload de arquivos

## 📋 Funcionalidades

### Autenticação
- ✅ Cadastro de usuários (`POST /api/auth/register`)
- ✅ Login (`POST /api/auth/login`)
- ✅ Autenticação JWT

### Classificação de Imagens
- ✅ Upload e classificação automática (`POST /api/items`)
- ✅ Histórico de uploads (`GET /api/items`)
- ✅ Detalhes de item (`GET /api/items/:id`)

### Pontos de Coleta
- ✅ Listar pontos próximos (`GET /api/points`)
- ✅ Criar pontos (`POST /api/points`)
- ✅ Atualizar pontos (`PUT /api/points/:id`)
- ✅ Deletar pontos (`DELETE /api/points/:id`)
- ✅ Filtros por categoria e distância

### Eventos
- ✅ Listar eventos (`GET /api/events`)
- ✅ Criar eventos (`POST /api/events`)
- ✅ Participar de eventos (`POST /api/events/:id/join`)
- ✅ Sair de eventos (`POST /api/events/:id/leave`)
- ✅ Gerenciar eventos próprios

### Perfil do Usuário
- ✅ Ver perfil (`GET /api/users/profile`)
- ✅ Atualizar perfil (`PUT /api/users/profile`)
- ✅ Estatísticas (`GET /api/users/stats`)

## 🛠️ Configuração

1. **Instalar dependências**
```bash
npm install
```

2. **Configurar variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

3. **Configurar banco de dados**
```bash
# Executar migrações
npm run db:migrate

# Popular com dados iniciais
npm run db:seed
```

4. **Executar aplicação**
```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## 📊 Endpoints da API

### Autenticação
```
POST /api/auth/register     # Criar conta
POST /api/auth/login        # Fazer login
```

### Itens (Classificação)
```
POST /api/items            # Upload e classificação
GET  /api/items            # Histórico (autenticado)
GET  /api/items/:id        # Detalhes do item
```

### Pontos de Coleta
```
GET    /api/points                    # Listar pontos
GET    /api/points/:id                # Detalhes do ponto
POST   /api/points                    # Criar ponto (autenticado)
PUT    /api/points/:id                # Atualizar ponto (autenticado)
DELETE /api/points/:id                # Deletar ponto (autenticado)
```

### Eventos
```
GET    /api/events                    # Listar eventos
GET    /api/events/:id                # Detalhes do evento
POST   /api/events                    # Criar evento (autenticado)
PUT    /api/events/:id                # Atualizar evento (autenticado)
DELETE /api/events/:id                # Deletar evento (autenticado)
POST   /api/events/:id/join           # Participar (autenticado)
POST   /api/events/:id/leave          # Sair (autenticado)
GET    /api/events/user/participations # Meus eventos (autenticado)
```

### Usuários
```
GET /api/users/profile      # Ver perfil (autenticado)
PUT /api/users/profile      # Atualizar perfil (autenticado)
GET /api/users/stats        # Estatísticas (autenticado)
```

## 🔒 Parâmetros de Query

### Filtros de Localização
```
?lat=-23.5505&lon=-46.6333&radius=5000  # Buscar em raio de 5km
?category=PLASTICO                       # Filtrar por categoria
```

### Paginação
```
?page=1&limit=20  # Página e limite de resultados
```

### Categorias de Resíduos
- `PLASTICO` - Materiais plásticos
- `PAPEL` - Papel e papelão
- `METAL` - Metais em geral
- `VIDRO` - Vidros e cristais
- `ORGANICO` - Resíduos orgânicos
- `ELETRONICO` - Equipamentos eletrônicos
- `OUTROS` - Outros materiais

## 🗄️ Estrutura do Banco

```sql
users                  # Usuários do sistema
items                  # Itens classificados
collection_points      # Pontos de coleta
events                 # Eventos de coleta
event_participants     # Participações em eventos
```

## 🔧 Scripts Úteis

```bash
npm run db:migrate     # Executar migrações
npm run db:generate    # Gerar cliente Prisma
npm run db:seed        # Popular banco com dados
npm run db:reset       # Resetar banco (cuidado!)
```

## 🌍 Variáveis de Ambiente

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/recolheja"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
GOOGLE_CLOUD_PROJECT_ID="your-project"
GOOGLE_CLOUD_KEY_FILE="path/to/key.json"
```

## 🚀 Deploy

A aplicação está configurada para deploy em plataformas como Heroku, Railway, ou DigitalOcean.

## 📝 Dados de Teste

Após executar `npm run db:seed`:

**Usuários:**
- `admin@recolheja.com` / `123456`
- `usuario@test.com` / `123456`

**Localização padrão:** São Paulo, SP
