import { useAuth } from '@/src/contexts/AuthContext'
import { useRouter, useSegments } from 'expo-router'
import React, { ReactNode, useEffect } from 'react'

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    // Rotas que requerem autenticação (começam com "home")
    const inProtectedRoute = segments[0] === 'home'

    // Rota de autenticação
    const inAuthRoute = segments[0] === 'register'

    // Rota especial do sitemap (pode ser acessada independente de auth)
    const inSitemapRoute = segments[0] === '_sitemap'

    const undefinedRoute = segments[0] === undefined

    if (!isAuthenticated && undefinedRoute) {
      router.replace('/register')
    } else if (isAuthenticated && (inAuthRoute || undefinedRoute)) {
      // Usuário logado tentando acessar login - redireciona para map
      router.replace('/home/map')
    } else if (!isAuthenticated && inProtectedRoute) {
      // Usuário não logado tentando acessar área protegida - redireciona para login
      router.replace('/register')
    } else if (!isAuthenticated && !inAuthRoute && !inSitemapRoute) {
      // Usuário não logado em rota indefinida - redireciona para login
      router.replace('/register')
    }
  }, [segments, isAuthenticated, router])

  // Tela de loading enquanto verifica autenticação
  // if (loading) {
    // return (
    //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.black200 }}>
    //     <ActivityIndicator size="large" color={colors.gray100} />
    //   </View>
    // )
  // }

  return <>{children}</>
}
