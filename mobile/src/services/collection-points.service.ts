import { api } from './api'

export interface CollectionPoint {
  id: string
  name: string
  lat: number
  lon: number
  address: string
  contact?: string
  openingHours?: string
  userId: string
  createdAt: string
  updatedAt: string
  collectionPointCategories?: CollectionPointCategory[]
}

export interface CollectionPointCategory {
  id: string
  collectionPointId: string
  categoryId: string
  category: Category
}

export interface Category {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface CollectionPointsResponse {
  items: CollectionPoint[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CreateCollectionPointDto {
  name: string
  lat: number
  lon: number
  address: string
  contact?: string
  openingHours?: string
  categoryIds?: string[]
}

export const collectionPointsService = {
  async getAll(page = 1, limit = 100): Promise<CollectionPointsResponse> {
    try {
      const response = await api.get<CollectionPointsResponse>('/collection-points', {
        params: { page, limit }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching collection points:', error)
      throw error
    }
  },

  async getById(id: string): Promise<CollectionPoint> {
    try {
      const response = await api.get<CollectionPoint>(`/collection-points/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching collection point ${id}:`, error)
      throw error
    }
  },

  async create(data: CreateCollectionPointDto): Promise<CollectionPoint> {
    try {
      const response = await api.post<CollectionPoint>('/collection-points', data)
      return response.data
    } catch (error) {
      console.error('Error creating collection point:', error)
      throw error
    }
  }
}
