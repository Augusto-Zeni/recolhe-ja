import React, { createContext, useContext, useState, ReactNode } from 'react';
import { router } from 'expo-router';

/**
 * Enum que define todas as abas/telas principais da aplicação
 * Usado para tipagem segura e navegação programática
 */
export enum TabName {
  HOME = 'home',
  CLASSIFICATION = 'classification', 
  MAP = 'map',
  EVENTS = 'events',
  HISTORY = 'history',
  PROFILE = 'profile',
}

/**
 * Interface que define todos os dados e métodos disponíveis no contexto de navegação
 * Fornece uma API centralizada para gerenciar navegação entre telas
 */
export interface NavigationContextData {
  /** Aba/tela atualmente ativa */
  currentTab: TabName;
  /** Função para navegar programaticamente para uma aba específica */
  navigateToTab: (tab: TabName) => void;
  /** Função para navegar para a tela de login */
  navigateToLogin: () => void;
  /** Função para voltar na pilha de navegação */
  goBack: () => void;
  /** Função para navegar para tela inicial com reset da pilha */
  navigateToHome: () => void;
}

/**
 * Contexto React para gerenciar navegação globalmente
 * Centraliza a lógica de navegação para facilitar transições programáticas
 */
const NavigationContext = createContext<NavigationContextData>({} as NavigationContextData);

/**
 * Provider do contexto de navegação
 * 
 * Componente responsável por:
 * - Gerenciar estado da aba/tela atual
 * - Fornecer métodos padronizados de navegação
 * - Integrar com o Expo Router para roteamento
 * - Facilitar navegação programática entre telas
 * 
 * @param children - Componentes filhos que terão acesso ao contexto de navegação
 */
export function NavigationProvider({ children }: { children: ReactNode }) {
  /** Estado da aba atualmente ativa - padrão é HOME */
  const [currentTab, setCurrentTab] = useState<TabName>(TabName.HOME);

  /**
   * Navega programaticamente para uma aba específica
   * 
   * Atualiza tanto o estado local quanto executa a navegação real
   * usando o Expo Router para mudança de tela
   * 
   * @param tab - Nome da aba/tela de destino
   * 
   * @example
   * ```tsx
   * const { navigateToTab } = useNavigation();
   * navigateToTab(TabName.CLASSIFICATION);
   * ```
   */
  const navigateToTab = (tab: TabName) => {
    setCurrentTab(tab);
    router.push(`/(tabs)/${tab}`);
  };

  /**
   * Navega para a tela de login/cadastro
   * 
   * Usado principalmente quando:
   * - Usuário não está autenticado
   * - Token de autenticação expirou
   * - Usuário escolhe fazer logout
   */
  const navigateToLogin = () => {
    router.push('/login-sign-up');
  };

  /**
   * Navega para a tela inicial (Home)
   * 
   * Reset completo da pilha de navegação, útil para:
   * - Após login bem-sucedido
   * - Navegação para estado inicial da aplicação
   * - Reset após ações importantes
   */
  const navigateToHome = () => {
    setCurrentTab(TabName.HOME);
    router.replace('/(tabs)/home');
  };

  /**
   * Volta uma tela na pilha de navegação
   * 
   * Equivale ao botão "voltar" nativo do dispositivo
   * Usado em modais, formulários e fluxos secundários
   */
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        currentTab,
        navigateToTab,
        navigateToLogin,
        navigateToHome,
        goBack,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

/**
 * Hook customizado para acessar o contexto de navegação
 * 
 * Este hook deve ser usado em qualquer componente que precise:
 * - Navegar programaticamente entre telas
 * - Verificar qual tela está ativa
 * - Executar ações de navegação (voltar, ir para login, etc.)
 * 
 * @returns {NavigationContextData} Objeto com estado e métodos de navegação
 * @throws {Error} Lança erro se usado fora do NavigationProvider
 * 
 * @example
 * ```tsx
 * function HeaderComponent() {
 *   const { currentTab, navigateToTab, goBack } = useNavigation();
 *   
 *   return (
 *     <View>
 *       <Text>Tela Atual: {currentTab}</Text>
 *       <Button 
 *         title="Ir para Classificação" 
 *         onPress={() => navigateToTab(TabName.CLASSIFICATION)} 
 *       />
 *       <Button title="Voltar" onPress={goBack} />
 *     </View>
 *   );
 * }
 * ```
 */
export function useNavigation(): NavigationContextData {
  const context = useContext(NavigationContext);
  
  if (!context) {
    throw new Error('useNavigation deve ser usado dentro de um NavigationProvider');
  }
  
  return context;
}

/**
 * Utilitário para mapear nomes de abas para títulos legíveis
 * Usado para exibição em headers, breadcrumbs e interface do usuário
 */
export const TabTitles: Record<TabName, string> = {
  [TabName.HOME]: 'Início',
  [TabName.CLASSIFICATION]: 'Classificação',
  [TabName.MAP]: 'Pontos de Coleta',
  [TabName.EVENTS]: 'Eventos',
  [TabName.HISTORY]: 'Histórico',
  [TabName.PROFILE]: 'Perfil',
};

/**
 * Utilitário para mapear nomes de abas para ícones
 * Usado para exibição na barra de navegação inferior
 */
export const TabIcons: Record<TabName, string> = {
  [TabName.HOME]: 'home',
  [TabName.CLASSIFICATION]: 'camera',
  [TabName.MAP]: 'map',
  [TabName.EVENTS]: 'calendar',
  [TabName.HISTORY]: 'history',
  [TabName.PROFILE]: 'person',
};
