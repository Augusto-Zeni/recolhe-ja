# RecicleJá Mobile App

Um aplicativo mobile para classificação de resíduos e localização de pontos de coleta, desenvolvido com React Native e Expo.

## 📱 Funcionalidades Implementadas

### 🔐 Autenticação
- Login e cadastro de usuários
- Gerenciamento de estado de autenticação
- Interface baseada nos protótipos fornecidos

### 🏠 Tela Principal (Home)
- Dashboard com ações principais
- Acesso rápido para classificação de resíduos
- Links para pontos de coleta e eventos
- Navegação para histórico e perfil

### 📸 Classificação de Resíduos
- Interface para captura/seleção de fotos
- Simulação de classificação automática
- Exibição de resultados com confiança
- Redirecionamento para pontos de coleta

### 🗺️ Mapa de Pontos de Coleta
- Lista de pontos de coleta próximos
- Filtros por categoria de resíduo
- Informações detalhadas dos pontos
- Simulação de navegação e contato

### 📅 Eventos de Coleta
- Lista de eventos próximos
- Funcionalidade de participação
- Abas para eventos próximos e participando
- Criação de novos eventos (placeholder)

### 📊 Histórico
- Lista de itens classificados
- Estatísticas de uso
- Redirecionamento para pontos específicos
- Funcionalidade de exclusão

### 👤 Perfil do Usuário
- Visualização e edição de dados pessoais
- Estatísticas de impacto ambiental
- Configurações e logout
- Avatar com iniciais do usuário

## 🎨 Design System

### Cores
- **Verde Principal**: `#50AB49` - Botões primários e elementos de destaque
- **Verde Claro**: `#E6F6E9` - Fundos e elementos secundários
- **Branco**: `#F6FBF7` - Fundo principal
- **Cinza**: `#4A4A4A`, `#9AA29A`, `#CFCFCF` - Textos e elementos neutros

### Tipografia
- **Poppins** em diferentes pesos (200, 300, 400, 500, 700)
- Hierarquia clara de títulos e textos

### Componentes Reutilizáveis
- `Button`: Botões com variantes primary/secondary
- `Input`: Campos de texto padronizados
- `Text`: Componente de texto base

## 🏗️ Arquitetura

### Estrutura de Pastas
```
mobile/
├── app/                     # Telas da aplicação
│   ├── _layout.tsx         # Layout principal
│   ├── login-sign-up/      # Autenticação
│   ├── home/               # Tela principal
│   ├── classification/     # Classificação de resíduos
│   ├── map/                # Pontos de coleta
│   ├── events/             # Eventos
│   ├── history/            # Histórico
│   └── profile/            # Perfil do usuário
├── src/
│   ├── components/         # Componentes reutilizáveis
│   ├── contexts/           # Contextos React
│   ├── navigation/         # Sistema de navegação
│   └── styles/             # Estilos globais
└── assets/                 # Imagens e recursos
```

### Contextos
- **AuthContext**: Gerenciamento de autenticação
- **NavigationContext**: Sistema de navegação simples

## 🚀 Como Executar

1. **Pré-requisitos**:
   - Node.js 18+
   - Expo CLI
   - Expo Go app (para teste em dispositivo)

2. **Instalação**:
   ```bash
   cd mobile
   npm install
   ```

3. **Execução**:
   ```bash
   npm start
   ```

4. **Teste**:
   - Escaneie o QR code com Expo Go
   - Ou execute no simulador iOS/Android

## 🔧 Tecnologias Utilizadas

- **React Native** com Expo
- **TypeScript** para tipagem
- **React Navigation** (Context API)
- **Expo Image** para manipulação de imagens
- **Google Fonts** (Poppins)

## 📋 Próximos Passos

### Integrações Pendentes
- [ ] Expo Camera para captura de fotos
- [ ] Expo Image Picker para galeria
- [ ] React Native Maps para mapas
- [ ] Expo Location para geolocalização
- [ ] AsyncStorage para persistência local

### Funcionalidades a Implementar
- [ ] API de classificação de imagens (Google Vision AI)
- [ ] Integração com backend Node.js
- [ ] Notificações push
- [ ] Compartilhamento social
- [ ] Sistema de gamificação
- [ ] Modo offline

### Melhorias de UX/UI
- [ ] Animações de transição
- [ ] Loading states aprimorados
- [ ] Feedback visual melhorado
- [ ] Acessibilidade
- [ ] Temas claro/escuro

## 🎯 Objetivos Atendidos

✅ **Interface baseada nos protótipos fornecidos**
✅ **Sistema de autenticação funcional**
✅ **Navegação entre telas implementada**
✅ **Componentes reutilizáveis criados**
✅ **Estrutura escalável e organizada**
✅ **Design system consistente**
✅ **Funcionalidades principais simuladas**

## 📝 Notas Técnicas

- O app está estruturado para fácil integração com APIs reais
- Mock data é usado para demonstração das funcionalidades
- A navegação usa Context API para simplicidade
- Todos os componentes são tipados com TypeScript
- Estrutura preparada para testes unitários futuros

---

**Desenvolvido como parte do projeto RecolheJá** 🌱♻️
