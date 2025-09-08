import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Interface que define a estrutura dos dados do usuário autenticado
 * Contém as informações básicas retornadas pela API após login/registro
 */
export interface User {
  /** ID único do usuário no sistema */
  id: string;
  /** Nome completo do usuário */
  name: string;
  /** E-mail do usuário (único no sistema) */
  email: string;
}

/**
 * Interface que define todos os dados e métodos disponíveis no contexto de autenticação
 * Fornece uma API consistente para gerenciar o estado de autenticação em toda a aplicação
 */
export interface AuthContextData {
  /** Dados do usuário atualmente autenticado, null se não estiver logado */
  user: User | null;
  /** Indica se há uma operação de autenticação em andamento */
  isLoading: boolean;
  /** Função para autenticar um usuário com email e senha */
  login: (email: string, password: string) => Promise<void>;
  /** Função para registrar um novo usuário no sistema */
  register: (name: string, email: string, password: string) => Promise<void>;
  /** Função para fazer logout do usuário atual */
  logout: () => Promise<void>;
}

/**
 * Contexto React para gerenciar o estado de autenticação globalmente
 * Permite que qualquer componente da aplicação acesse e modifique o estado de autenticação
 */
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

/**
 * Provider do contexto de autenticação
 * 
 * Componente responsável por:
 * - Gerenciar o estado global de autenticação
 * - Fornecer métodos para login, registro e logout
 * - Fazer a comunicação com a API backend
 * - Persistir dados de autenticação (implementação futura)
 * 
 * @param children - Componentes filhos que terão acesso ao contexto
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  /** Estado do usuário autenticado - null indica que não há usuário logado */
  const [user, setUser] = useState<User | null>(null);
  
  /** Estado de carregamento para mostrar indicadores durante operações assíncronas */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Autentica um usuário no sistema
   * 
   * Processo:
   * 1. Envia credenciais para API backend
   * 2. Valida resposta e dados retornados
   * 3. Armazena dados do usuário no estado
   * 4. TODO: Salvar token JWT para requisições futuras
   * 
   * @param email - E-mail do usuário
   * @param password - Senha do usuário
   * @throws {Error} Lança erro se credenciais forem inválidas ou houver falha na comunicação
   */
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Faz requisição POST para endpoint de login da API
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data = await response.json();
      
      // TODO: Implementar persistência do token JWT usando AsyncStorage ou SecureStore
      // await SecureStore.setItemAsync('authToken', data.token);
      
      // Atualiza estado com dados do usuário autenticado
      setUser(data.user);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Registra um novo usuário no sistema
   * 
   * Processo:
   * 1. Envia dados de registro para API backend
   * 2. Valida resposta e cria conta do usuário
   * 3. Automaticamente autentica o usuário após registro
   * 4. TODO: Salvar token JWT para requisições futuras
   * 
   * @param name - Nome completo do usuário
   * @param email - E-mail do usuário (deve ser único)
   * @param password - Senha do usuário
   * @throws {Error} Lança erro se dados forem inválidos ou e-mail já existir
   */
  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Faz requisição POST para endpoint de registro da API
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error('Erro ao criar conta');
      }

      const data = await response.json();
      
      // TODO: Implementar persistência do token JWT
      // await SecureStore.setItemAsync('authToken', data.token);
      
      // Atualiza estado com dados do novo usuário
      setUser(data.user);
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Remove a autenticação do usuário atual
   * 
   * Processo:
   * 1. Limpa estado do usuário
   * 2. TODO: Remove token JWT do armazenamento local
   * 3. TODO: Invalida token no servidor (opcional)
   * 
   * @throws {Error} Lança erro se houver falha na operação de logout
   */
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // TODO: Remover token do armazenamento seguro
      // await SecureStore.deleteItemAsync('authToken');
      
      // TODO: Opcionalmente invalidar token no servidor
      // await fetch('http://localhost:3000/api/auth/logout', { method: 'POST' });
      
      // Limpa estado do usuário
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // TODO: Implementar useEffect para restaurar autenticação na inicialização
  // useEffect(() => {
  //   const restoreAuth = async () => {
  //     try {
  //       const token = await SecureStore.getItemAsync('authToken');
  //       if (token) {
  //         // Validar token com a API e restaurar dados do usuário
  //         const response = await fetch('http://localhost:3000/api/auth/me', {
  //           headers: { Authorization: `Bearer ${token}` }
  //         });
  //         if (response.ok) {
  //           const userData = await response.json();
  //           setUser(userData);
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Erro ao restaurar autenticação:', error);
  //     }
  //   };
  //   restoreAuth();
  // }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook customizado para acessar o contexto de autenticação
 * 
 * Este hook deve ser usado em qualquer componente que precise:
 * - Verificar se há um usuário autenticado
 * - Realizar operações de login/logout/registro
 * - Acessar dados do usuário atual
 * - Verificar estado de carregamento de operações
 * 
 * @returns {AuthContextData} Objeto com dados e métodos de autenticação
 * @throws {Error} Lança erro se usado fora do AuthProvider
 * 
 * @example
 * ```tsx
 * function LoginScreen() {
 *   const { login, isLoading, user } = useAuth();
 *   
 *   const handleLogin = async () => {
 *     try {
 *       await login(email, password);
 *       // Usuário autenticado com sucesso
 *     } catch (error) {
 *       // Tratar erro de autenticação
 *     }
 *   };
 * }
 * ```
 */
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}
