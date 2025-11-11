import * as SecureStore from 'expo-secure-store'
import { api } from './api'

export interface User {
  id: string
  email: string
  name: string
  photoUrl?: string
}

export interface AuthResponse {
  accessToken: string
}

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'
const EXPIRY_KEY = 'auth_expiry'

const TOKEN_EXPIRY_MS = 60 * 60 * 1000 // 60 minutos

export const authService = {
  async getProfile(token?: string): Promise<User> {
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const response = await api.get<User>('/auth/profile', { headers })
    return response.data
  },

  async saveAuthData(token: string, user: User): Promise<void> {
    const expiryTime = Date.now() + TOKEN_EXPIRY_MS
    await SecureStore.setItemAsync(TOKEN_KEY, token)
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user))
    await SecureStore.setItemAsync(EXPIRY_KEY, expiryTime.toString())
  },

  async getStoredToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(TOKEN_KEY)
  },

  async getStoredUser(): Promise<User | null> {
    const userJson = await SecureStore.getItemAsync(USER_KEY)
    return userJson ? JSON.parse(userJson) : null
  },

  async isTokenValid(): Promise<boolean> {
    const expiryStr = await SecureStore.getItemAsync(EXPIRY_KEY)
    if (!expiryStr) return false

    const expiryTime = parseInt(expiryStr, 10)
    return Date.now() < expiryTime
  },

  async clearAuthData(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY)
    await SecureStore.deleteItemAsync(USER_KEY)
    await SecureStore.deleteItemAsync(EXPIRY_KEY)
  },

  async loadStoredAuth(): Promise<{ token: string; user: User } | null> {
    const token = await this.getStoredToken()
    const user = await this.getStoredUser()
    const isValid = await this.isTokenValid()

    if (!token || !user || !isValid) {
      await this.clearAuthData()
      return null
    }

    return { token, user }
  },
}
