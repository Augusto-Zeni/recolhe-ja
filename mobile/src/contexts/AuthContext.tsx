import { ReactNode, createContext, useContext, useState } from 'react'

interface AuthContextData {
  isAuthenticated: boolean
  handleSetIsAuthentication: (isAuth: boolean) => void
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  function handleSetIsAuthentication(isAuth: boolean) {
    setIsAuthenticated(isAuth)
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      handleSetIsAuthentication
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
