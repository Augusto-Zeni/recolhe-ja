import { useAuth } from '@/src/contexts/AuthContext'
import { useRouter, useSegments } from 'expo-router'
import React, { ReactNode, useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { colors } from '@/src/styles/colors'

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    const inProtectedRoute = segments[0] === 'home'
    const inAuthRoute = segments[0] === 'register'
    const inSitemapRoute = segments[0] === '_sitemap'
    const undefinedRoute = segments[0] === undefined

    if (!isAuthenticated && undefinedRoute) {
      router.replace('/register')
    } else if (isAuthenticated && (inAuthRoute || undefinedRoute)) {
      router.replace('/home/map')
    } else if (!isAuthenticated && inProtectedRoute) {
      router.replace('/register')
    } else if (!isAuthenticated && !inAuthRoute && !inSitemapRoute) {
      router.replace('/register')
    }
  }, [segments, isAuthenticated, router, loading])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.green100 }}>
        <ActivityIndicator size="large" color={colors.green200} />
      </View>
    )
  }

  return <>{children}</>
}
