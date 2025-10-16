import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import env from '@/src/config/env'

const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('auth_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('auth_token')
      await SecureStore.deleteItemAsync('auth_user')
      await SecureStore.deleteItemAsync('auth_expiry')
    }
    return Promise.reject(error)
  }
)

export { api }
