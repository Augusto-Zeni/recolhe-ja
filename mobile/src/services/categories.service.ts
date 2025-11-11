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

export const categoriesService = {
  async getAll(page = 1, limit = 100): Promise<CategoriesResponse> {
    try {
      const response = await api.get<CategoriesResponse>('/categories', {
        params: { page, limit }
      })
      return response.data
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
