# RecolheJá - Sistema Completo de Classificação de Resíduos

> Aplicativo mobile e API backend para classificação automática de resíduos usando inteligência artificial.

## 🌟 Visão Geral

O **RecolheJá** é uma solução completa que combina aplicativo mobile e API backend para facilitar o descarte consciente de resíduos através de classificação automática por IA.

### 🎯 Objetivo Principal
Promover a sustentabilidade e educação ambiental oferecendo uma ferramenta simples e intuitiva para identificação e descarte correto de diferentes tipos de resíduos.

### ✨ Principais Funcionalidades
- 📸 **Classificação automática** de resíduos por foto usando IA
- 🗺️ **Pontos de coleta** próximos com filtros por categoria  
- 📅 **Eventos comunitários** de coleta com sistema de participação
- 📊 **Histórico pessoal** de classificações e estatísticas
- 🔐 **Sistema de autenticação** completo e seguro
- 📱 **Interface responsiva** e intuitiva

## 📁 Estrutura do Projeto

```
recolhe-ja/
├── backend/                 # API REST com NestJS
│   ├── src/
│   │   ├── auth/           # Autenticação JWT
│   │   ├── users/          # Gerenciamento de usuários
│   │   ├── items/          # Classificação de resíduos
│   │   ├── collection-points/ # Pontos de coleta
│   │   ├── events/         # Eventos comunitários
│   │   └── prisma/         # ORM e banco de dados
│   ├── prisma/
│   │   ├── schema.prisma   # Schema do banco
│   │   └── migrations/     # Migrações
│   └── uploads/            # Armazenamento de imagens
├── mobile/                 # App React Native/Expo
│   ├── app/               # Navegação (Expo Router)
│   │   ├── (tabs)/        # Telas principais
│   │   └── login-sign-up/ # Autenticação
│   └── src/
│       ├── components/    # Componentes reutilizáveis
│       ├── contexts/      # Estados globais
│       └── styles/        # Design system
└── docs/                  # Documentação
```

## 🚀 Tecnologias Utilizadas

### Backend (API)
- **NestJS** - Framework Node.js escalável
- **TypeScript** - Linguagem com tipagem estática
- **Prisma ORM** - Acesso ao banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação stateless
- **Google Cloud Vision** - IA para classificação
- **Multer** - Upload de arquivos

### Mobile (App)
- **React Native** - Framework mobile multiplataforma
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **Expo Router** - Navegação file-based
- **Context API** - Gerenciamento de estado
- **Expo Camera/Image Picker** - Funcionalidades do dispositivo

## 🔧 Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- PostgreSQL 13+
- Expo CLI
- Android Studio ou Xcode (para desenvolvimento mobile)

### 1. Backend Setup
```bash
# Navegar para pasta do backend
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# Executar migrações do banco
npm run db:migrate

# Iniciar servidor de desenvolvimento
npm run start:dev
```

### 2. Mobile Setup
```bash
# Navegar para pasta do mobile
cd mobile

# Instalar dependências
npm install

# Configurar URL da API
# Editar src/services/api.ts com a URL do backend

# Iniciar aplicativo
npm start
```

### 3. Variáveis de Ambiente

#### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/recolheja"
JWT_SECRET="seu-jwt-secret-super-seguro"
JWT_EXPIRES_IN="7d"
PORT=3000
GOOGLE_APPLICATION_CREDENTIALS="/path/to/credentials.json"
```

#### Mobile
```env
API_BASE_URL="http://localhost:3000/api"
```

## 🏗️ Arquitetura do Sistema

### Backend - Arquitetura Modular

```mermaid
graph TB
    Client[Mobile App] -->|HTTP/REST| Gateway[API Gateway]
    Gateway --> Auth[Auth Module]
    Gateway --> Items[Items Module]
    Gateway --> Points[Collection Points]
    Gateway --> Events[Events Module]
    
    Auth --> DB[(PostgreSQL)]
    Items --> DB
    Items --> AI[Google Vision AI]
    Points --> DB
    Events --> DB
    
    Items --> Storage[File Storage]
```

#### Módulos Backend:
- **Auth Module**: JWT, bcrypt, guards, strategies
- **Users Module**: CRUD de usuários, perfis
- **Items Module**: Upload, classificação IA, histórico
- **Collection Points**: CRUD, busca geográfica
- **Events Module**: CRUD, sistema de participação
- **Prisma Module**: ORM, conexões, migrations

### Mobile - Arquitetura de Contextos

```mermaid
graph TB
    App[App Root] --> Auth[AuthProvider]
    Auth --> Nav[NavigationProvider]
    Nav --> Tabs[Tab Navigation]
    
    Tabs --> Home[Home Screen]
    Tabs --> Class[Classification]
    Tabs --> Map[Map Screen]
    Tabs --> Events[Events Screen]
    Tabs --> History[History Screen]
    Tabs --> Profile[Profile Screen]
    
    Auth -.->|Global State| Home
    Auth -.->|Global State| Class
    Nav -.->|Navigation| Map
```

#### Componentes Mobile:
- **AuthContext**: Estado de autenticação global
- **NavigationContext**: Navegação programática
- **Design System**: Button, Input, Text components
- **Screens**: 6 telas principais + autenticação

## 📊 Fluxo de Dados

### 1. Classificação de Resíduos
```
Mobile App → Upload Image → Backend API → Google Vision AI → Classification Result → Database → Mobile App
```

### 2. Autenticação
```
Mobile Login → Backend Validation → JWT Generation → Token Storage → Authenticated Requests
```

### 3. Pontos de Coleta
```
Mobile Location → Backend Query → Geographic Filter → Database Search → Results → Map Display
```

## 🔐 Segurança

### Backend
- **JWT Authentication** com expiração configurável
- **bcrypt** para hash de senhas (salt rounds: 10)
- **Guards** para proteção de rotas
- **Validation pipes** para sanitização de dados
- **CORS** configurado para origins específicos

### Mobile
- **Secure token storage** (futuro: SecureStore)
- **Request interceptors** para auto-logout em 401
- **Input validation** em formulários
- **Error boundaries** para captura de erros

## 📱 Funcionalidades Detalhadas

### 🔍 Classificação de Resíduos
- **Upload**: Câmera ou galeria
- **Processamento**: Google Cloud Vision AI
- **Categorias**: 6 tipos (Plástico, Papel, Metal, Vidro, Orgânico, Eletrônico)
- **Instruções**: Orientações específicas de descarte
- **Histórico**: Armazenamento de todas as classificações

### 🗺️ Pontos de Coleta
- **Mapa interativo** com pontos próximos
- **Filtros** por categoria de resíduo
- **Busca geográfica** por raio configurável
- **Informações completas**: endereço, horários, contato
- **Navegação** integrada para o local

### 📅 Eventos Comunitários
- **Lista** de eventos próximos
- **Inscrição/cancelamento** com um toque
- **Filtros** geográficos e por categoria
- **Detalhes** completos com localização
- **Contador** de participantes

### 📊 Dashboard Pessoal
- **Estatísticas** de uso pessoal
- **Histórico** completo de classificações
- **Progresso** ambiental
- **Filtros** por categoria e período

## 🧪 Testes e Qualidade

### Backend
```bash
npm run test:api      # Testes de integração da API
npm run lint          # ESLint para qualidade de código
npm run format        # Prettier para formatação
```

### Mobile
```bash
npm run lint          # ESLint para React Native
npm run type-check    # Verificação de tipos TypeScript
```

### Padrões de Código
- **TypeScript** obrigatório em ambos os projetos
- **ESLint + Prettier** para formatação consistente
- **Conventional Commits** para mensagens padronizadas
- **JSDoc** para documentação de funções

## 📈 Performance

### Backend
- **Prisma ORM** com queries otimizadas
- **Connection pooling** para banco de dados
- **Compression middleware** para respostas HTTP
- **Rate limiting** para proteção contra abuso

### Mobile
- **Image optimization** com cache
- **Lazy loading** de componentes
- **FlatList virtualization** para listas grandes
- **Memory management** para imagens

## 🚀 Deploy

### Backend - Docker
```bash
# Build da imagem
docker build -t recolheja-api .

# Run com docker-compose
docker-compose up -d
```

### Mobile - Expo
```bash
# Build para Android
expo build:android

# Build para iOS
expo build:ios

# Publicar no Expo
expo publish
```

## 🔮 Roadmap Futuro

### Funcionalidades Planejadas
- [ ] **Gamificação** com pontos e conquistas
- [ ] **Chat comunitário** para eventos
- [ ] **Notificações push** para eventos próximos
- [ ] **Offline mode** para funcionalidades básicas
- [ ] **Integração com APIs** de coleta municipais
- [ ] **Relatórios** de impacto ambiental
- [ ] **Compartilhamento social** de conquistas

### Melhorias Técnicas
- [ ] **CI/CD pipeline** automatizado
- [ ] **Testes unitários** completos
- [ ] **Cache Redis** para performance
- [ ] **CDN** para armazenamento de imagens
- [ ] **Monitoring** com métricas detalhadas
- [ ] **i18n** para internacionalização

## 📞 Suporte e Contribuição

### Como Contribuir
1. Fork o repositório
2. Crie uma branch para sua feature
3. Implemente com testes
4. Faça pull request com descrição detalhada

### Reportar Issues
- Use o [GitHub Issues](../../issues) para bugs
- Forneça reprodução detalhada
- Inclua logs e capturas de tela

### Contato
- **Email**: equipe@recolheja.com
- **Discord**: [Servidor da Comunidade]
- **Documentation**: [Wiki do Projeto](../../wiki)

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

**Desenvolvido com 💚 para um mundo mais sustentável** 🌱♻️

**RecolheJá Team** | 2024
