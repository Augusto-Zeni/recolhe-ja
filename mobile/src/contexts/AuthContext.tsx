import { ReactNode, createContext, useContext, useState, useEffect } from 'react'
import { authService, User } from '@/src/services/auth.service'

interface AuthContextData {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  loading: boolean
  signIn: (token: string) => Promise<void>
  signOut: () => Promise<void>
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    loadStoredAuth()
  }, [])

  async function loadStoredAuth() {
    try {
      setLoading(true)
      const storedAuth = await authService.loadStoredAuth()

      if (storedAuth) {
        setToken(storedAuth.token)
        setUser(storedAuth.user)
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Erro ao carregar autenticação:', error)
      await authService.clearAuthData()
    } finally {
      setLoading(false)
    }
  }

  async function signIn(accessToken: string) {
    try {
      setLoading(true)
      setToken(accessToken)

      const userProfile = await authService.getProfile(accessToken)

      await authService.saveAuthData(accessToken, userProfile)

      setUser(userProfile)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      await authService.clearAuthData()
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function signOut() {
    try {
      setLoading(true)
      await authService.clearAuthData()
      setToken(null)
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
