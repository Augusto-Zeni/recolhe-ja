# RecolheJá Mobile App

Aplicativo mobile desenvolvido com React Native e Expo para classificação automática de resíduos usando inteligência artificial.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades](#funcionalidades)
- [Instalação e Configuração](#instalação-e-configuração)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Fluxo de Navegação](#fluxo-de-navegação)
- [Componentes](#componentes)
- [Contextos](#contextos)
- [Integração com API](#integração-com-api)
- [Styling](#styling)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Build e Deploy](#build-e-deploy)
- [Troubleshooting](#troubleshooting)

## 🎯 Sobre o Projeto

O **RecolheJá** é um aplicativo mobile que utiliza inteligência artificial para ajudar usuários a identificar e descartar corretamente diferentes tipos de resíduos através de uma simples foto.

### Objetivo
Facilitar o descarte consciente de resíduos, promovendo a sustentabilidade e educação ambiental através de uma interface intuitiva e funcional.

### Público-alvo
- Pessoas interessadas em descarte consciente
- Comunidades que promovem sustentabilidade  
- Usuários que querem aprender sobre reciclagem

## 🚀 Tecnologias Utilizadas

### Frontend Framework
- **[React Native](https://reactnative.dev/)** - Framework para desenvolvimento mobile
- **[Expo](https://expo.dev/)** - Plataforma de desenvolvimento e deploy
- **[TypeScript](https://www.typescriptlang.org/)** - Linguagem com tipagem estática

### Navigation & State
- **[Expo Router](https://docs.expo.dev/router/introduction/)** - Roteamento file-based
- **[React Context API](https://react.dev/reference/react/useContext)** - Gerenciamento de estado global

### UI & Styling
- **[React Native StyleSheet](https://reactnative.dev/docs/stylesheet)** - Estilização nativa
- **Design System customizado** - Componentes reutilizáveis

### Device Features
- **[Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)** - Captura de fotos
- **[Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)** - Geolocalização
- **[Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)** - Seleção de imagens

### Development Tools
- **[ESLint](https://eslint.org/)** - Linting de código
- **Metro Bundler** - Bundler do React Native

## ✨ Funcionalidades

### 🔐 Autenticação
- Sistema de login e cadastro
- Persistência de sessão
- Proteção de rotas privadas
- Logout seguro

### 📸 Classificação de Resíduos
- Captura de foto via câmera
- Upload de imagem da galeria
- Classificação automática usando IA
- Instruções de descarte personalizadas
- Histórico de classificações

### 🗺️ Pontos de Coleta
- Mapa interativo com pontos próximos
- Filtros por tipo de resíduo
- Informações detalhadas (horários, contato)
- Navegação para o local

### 📅 Eventos Comunitários
- Lista de eventos de coleta
- Inscrição em eventos
- Filtros geográficos
- Sistema de participação

### 📊 Histórico Pessoal
- Registro de todas as classificações
- Estatísticas de uso
- Busca por categoria
- Progresso ambiental

### 👤 Perfil do Usuário
- Informações pessoais
- Configurações do app
- Estatísticas de uso
- Opções de privacidade

## ⚙️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Expo CLI
- Android Studio (Android) ou Xcode (iOS)
- Dispositivo físico ou emulador

### 1. Instalação
```bash
# Clone o repositório
git clone <repository-url>
cd recolhe-ja/mobile

# Instale as dependências
npm install

# Instale o Expo CLI globalmente (se não tiver)
npm install -g @expo/cli
```

### 2. Configuração
```bash
# Configure as variáveis de ambiente
cp .env.example .env.local

# Variáveis obrigatórias
API_BASE_URL=http://localhost:3000/api  # URL da API backend
```

### 3. Execução
```bash
# Desenvolvimento com Expo
npm start

# Específico para plataforma
npm run android  # Android
npm run ios       # iOS (macOS apenas)
npm run web       # Web (experimental)
```

## 📁 Estrutura do Projeto

```
mobile/
├── app/                     # App Router (Expo Router)
│   ├── _layout.tsx         # Layout raiz com contextos
│   ├── index.tsx           # Tela inicial (redirect)
│   ├── (tabs)/             # Navegação em tabs
│   │   ├── _layout.tsx     # Layout das tabs
│   │   ├── home.tsx        # Tela inicial
│   │   ├── classification.tsx
│   │   ├── map.tsx
│   │   ├── events.tsx
│   │   ├── history.tsx
│   │   └── profile.tsx
│   └── login-sign-up/      # Autenticação
│       └── index.tsx
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── Button/
│   │   ├── InputText/
│   │   └── Text/
│   ├── contexts/           # Contextos globais
│   │   ├── AuthContext.tsx
│   │   └── NavigationContext.tsx
│   ├── services/           # Integração com API
│   │   └── api.ts
│   ├── types/              # Definições de tipos
│   │   └── index.ts
│   └── styles/             # Estilização global
│       ├── colors.ts
│       └── globalStyles.ts
├── assets/                 # Recursos estáticos
│   ├── Logo.png
│   └── Logo.svg
└── package.json
```

## 🧭 Fluxo de Navegação

### Estrutura de Navegação
```
App
├── AuthStack (não autenticado)
│   └── Login/SignUp
└── MainTabs (autenticado)
    ├── Home (index)
    ├── Classification
    ├── Map
    ├── Events  
    ├── History
    └── Profile
```

### Proteção de Rotas
- **Rotas Públicas**: Login, Cadastro
- **Rotas Privadas**: Todas as abas principais
- **Redirect automático** baseado no estado de autenticação

### Navegação Programática
```typescript
// Usando NavigationContext
const { navigateToTab } = useNavigation();
navigateToTab('classification');

// Usando Expo Router
import { router } from 'expo-router';
router.push('/classification');
```

## 🧩 Componentes

### Design System

#### Button Component
Botão reutilizável com variantes visuais:
```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
}
```

**Uso:**
```tsx
<Button 
  title="Classificar Resíduo" 
  onPress={handleClassify}
  variant="primary"
/>
```

#### InputText Component
Campo de entrada com validação:
```typescript
interface InputTextProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  leftIcon?: string;
}
```

**Uso:**
```tsx
<InputText
  placeholder="E-mail"
  value={email}
  onChangeText={setEmail}
  error={emailError}
  leftIcon="email"
/>
```

#### Text Component
Texto estilizado com variantes tipográficas:
```typescript
interface TextProps {
  children: React.ReactNode;
  variant?: 'heading' | 'subtitle' | 'body' | 'caption';
  color?: string;
  align?: 'left' | 'center' | 'right';
}
```

**Uso:**
```tsx
<Text variant="heading" align="center">
  Bem-vindo ao RecolheJá
</Text>
```

## 🔄 Contextos

### AuthContext
Gerencia estado de autenticação global:

```typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
```

**Funcionalidades:**
- Login/logout de usuários
- Persistência de token JWT
- Estado de carregamento
- Dados do usuário autenticado

### NavigationContext
Facilita navegação entre telas:

```typescript
interface NavigationContextType {
  navigateToTab: (tab: TabName) => void;
  currentTab: TabName;
  navigateToLogin: () => void;
  goBack: () => void;
}
```

**Funcionalidades:**
- Navegação programática entre tabs
- Controle de estado da aba atual
- Navegação para autenticação
- Voltar na pilha de navegação

## 🌐 Integração com API

### Configuração do Cliente HTTP
```typescript
// src/services/api.ts
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});
```

### Interceptadores
```typescript
// Request interceptor - adiciona token de autenticação
apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - trata erros globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado, redirecionar para login
      logout();
    }
    return Promise.reject(error);
  }
);
```

### Endpoints Principais
```typescript
// Autenticação
export const authAPI = {
  login: (email: string, password: string) => 
    apiClient.post('/auth/login', { email, password }),
  
  register: (userData: RegisterData) => 
    apiClient.post('/auth/register', userData),
};

// Classificação
export const itemsAPI = {
  classify: (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return apiClient.post('/items', formData);
  },
  
  getHistory: () => apiClient.get('/items'),
};

// Pontos de coleta
export const collectionPointsAPI = {
  getNearby: (lat: number, lon: number, radius?: number) => 
    apiClient.get('/collection-points', { 
      params: { lat, lon, radius } 
    }),
};

// Eventos
export const eventsAPI = {
  getAll: () => apiClient.get('/events'),
  join: (eventId: string) => apiClient.post(`/events/${eventId}/join`),
  leave: (eventId: string) => apiClient.delete(`/events/${eventId}/leave`),
};
```

## 🎨 Styling

### Sistema de Cores
```typescript
// src/styles/colors.ts
export const colors = {
  // Cores principais
  primary: '#2E7D32',      // Verde principal
  primaryDark: '#1B5E20',  // Verde escuro
  secondary: '#FFC107',     // Amarelo de destaque
  
  // Cores de estado
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Cores neutras
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  
  // Categorias de resíduos
  plastic: '#E3F2FD',
  paper: '#FFF3E0',
  metal: '#E8F5E8',
  glass: '#F3E5F5',
  organic: '#E0F2F1',
  electronic: '#FFF8E1',
};
```

### Estilos Globais
```typescript
// src/styles/globalStyles.ts
export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.surface,
  },
});
```

### Responsive Design
```typescript
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const responsive = {
  // Breakpoints
  isSmallScreen: width < 360,
  isMediumScreen: width >= 360 && width < 768,
  isLargeScreen: width >= 768,
  
  // Funções utilitárias
  scale: (size: number) => (width / 320) * size,
  verticalScale: (size: number) => (height / 568) * size,
  moderateScale: (size: number, factor = 0.5) => 
    size + (responsive.scale(size) - size) * factor,
};
```

## 📜 Scripts Disponíveis

### Desenvolvimento
```bash
npm start              # Inicia Expo dev server
npm run android        # Executa no Android
npm run ios           # Executa no iOS
npm run web           # Executa no navegador
```

### Build
```bash
npm run build         # Build para produção
npm run build:android # Build APK Android
npm run build:ios     # Build iOS
```

### Qualidade de Código
```bash
npm run lint          # Executa ESLint
npm run lint:fix      # Corrige problemas automáticos
npm run type-check    # Verifica tipos TypeScript
```

### Testes
```bash
npm test              # Executa testes
npm run test:watch    # Executa testes em modo watch
npm run test:coverage # Gera relatório de cobertura
```

## 📱 Build e Deploy

### Android APK
```bash
# Build de desenvolvimento
expo build:android

# Build de produção
expo build:android --release-channel production
```

### iOS App Store
```bash
# Build para TestFlight
expo build:ios

# Upload automático
expo upload:ios
```

### Expo App Store
```bash
# Publicar no Expo
expo publish

# Publicar em canal específico
expo publish --release-channel staging
```

### Configurações de Build
```json
// app.json
{
  "expo": {
    "name": "RecolheJá",
    "slug": "recolhe-ja",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#2E7D32"
    },
    "android": {
      "package": "com.recolheja.app",
      "versionCode": 1
    },
    "ios": {
      "bundleIdentifier": "com.recolheja.app",
      "buildNumber": "1"
    }
  }
}
```

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Erro de Metro Bundler
```bash
# Limpar cache do Metro
npx react-native start --reset-cache

# Ou com Expo
expo start -c
```

#### 2. Problemas de Permissão (Android)
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

#### 3. Erro de Conexão com API
```bash
# Verificar se a API está rodando
curl http://localhost:3000/api/health

# Para emulador Android, usar IP da máquina
# Substituir localhost por 10.0.2.2 (emulador) ou IP real
```

#### 4. Problemas de TypeScript
```bash
# Regenerar tipos
npm run type-check

# Limpar cache do TypeScript
rm -rf node_modules/.cache
```

### Debugging

#### React Native Debugger
```bash
# Instalar ferramenta de debug
npm install -g react-native-debugger

# Executar
react-native-debugger
```

#### Flipper (Facebook)
```bash
# Instalar Flipper desktop
# Disponível em: https://fbflipper.com/

# Adicionar plugins:
# - Network
# - Databases
# - Shared Preferences
```

#### Logs em Tempo Real
```bash
# Android
npx react-native log-android

# iOS  
npx react-native log-ios

# Expo
expo logs
```

## 🚀 Performance

### Otimizações Implementadas

#### 1. Lazy Loading de Imagens
```typescript
import { Image } from 'expo-image';

<Image
  source={{ uri: imageUrl }}
  placeholder={require('../assets/placeholder.png')}
  transition={200}
  cachePolicy="memory-disk"
/>
```

#### 2. Memoização de Componentes
```typescript
import React, { memo } from 'react';

export const ExpensiveComponent = memo(({ data }) => {
  // Componente só re-renderiza se data mudar
  return <View>{/* ... */}</View>;
});
```

#### 3. Virtualização de Listas
```typescript
import { FlatList } from 'react-native';

<FlatList
  data={items}
  renderItem={renderItem}
  getItemLayout={getItemLayout}  // Para performance
  removeClippedSubviews={true}   // Remove itens fora da tela
  maxToRenderPerBatch={10}       // Limita renderização por batch
/>
```

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).

---

**Desenvolvido com ❤️ pela Equipe RecolheJá** 🌱♻️

Para dúvidas ou sugestões, abra uma [issue](../../issues) no repositório.
