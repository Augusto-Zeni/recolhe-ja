import { api } from './api'

export interface Category {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface CategoriesResponse {
  items: Category[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Backend response structure
interface BackendCategoriesResponse {
  data: Category[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const categoriesService = {
  async getAll(page = 1, limit = 100): Promise<CategoriesResponse> {
    try {
      const response = await api.get<BackendCategoriesResponse>('/categories', {
        params: { page, limit }
      })

      // Map backend response to frontend structure
      return {
        items: response.data.data,
        total: response.data.meta.total,
        page: response.data.meta.page,
        limit: response.data.meta.limit,
        totalPages: response.data.meta.totalPages
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },

  async getById(id: string): Promise<Category> {
    try {
      const response = await api.get<Category>(`/categories/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error)
      throw error
    }
  }
}
