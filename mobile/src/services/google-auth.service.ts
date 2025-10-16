import * as WebBrowser from 'expo-web-browser'
import * as Linking from 'expo-linking'
import env from '@/src/config/env'

WebBrowser.maybeCompleteAuthSession()

const BACKEND_URL = env.apiUrl

export const googleAuthService = {
  async signInWithGoogle(): Promise<string> {
    try {
      const redirectUrl = Linking.createURL('/')
      const authUrl = `${BACKEND_URL}/auth/google?redirect_uri=${encodeURIComponent(redirectUrl)}`

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl)

      if (result.type === 'success') {
        const url = result.url
        const token = this.extractTokenFromUrl(url)

        if (!token) {
          throw new Error('Token não encontrado na URL de retorno')
        }

        return token
      } else if (result.type === 'cancel') {
        throw new Error('Login cancelado pelo usuário')
      } else {
        throw new Error('Falha no login com Google')
      }
    } catch (error) {
      console.error('Erro no login com Google:', error)
      throw error
    }
  },

  extractTokenFromUrl(url: string): string | null {
    const urlObj = new URL(url)
    const token = urlObj.searchParams.get('token')
    return token
  },
}
