import { api } from './api'

export interface Event {
  id: string
  title: string
  description: string
  lat: number
  lon: number
  startAt: string
  endAt: string
  userId: string
  createdAt: string
  updatedAt: string
  eventCategories?: EventCategory[]
  eventParticipants?: EventParticipant[]
  user?: User
}

export interface EventCategory {
  id: string
  eventId: string
  categoryId: string
  category: Category
}

export interface EventParticipant {
  id: string
  eventId: string
  userId: string
  user?: User
}

export interface Category {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  email: string
}

export interface EventsResponse {
  items: Event[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Backend response structure
interface BackendEventsResponse {
  data: Event[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface CreateEventDto {
  title: string
  description: string
  lat: number
  lon: number
  startAt: string
  endAt: string
  categoryIds?: string[]
}

export interface UpdateEventDto {
  title?: string
  description?: string
  lat?: number
  lon?: number
  startAt?: string
  endAt?: string
  categoryIds?: string[]
}

export const eventsService = {
  async getAll(page = 1, limit = 100): Promise<EventsResponse> {
    try {
      const response = await api.get<BackendEventsResponse>('/events', {
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
      console.error('Error fetching events:', error)
      throw error
    }
  },

  async getById(id: string): Promise<Event> {
    try {
      const response = await api.get<Event>(`/events/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error)
      throw error
    }
  },

  async getMyEvents(page = 1, limit = 100): Promise<EventsResponse> {
    try {
      const response = await api.get<BackendEventsResponse>('/events/my-events', {
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
      console.error('Error fetching my events:', error)
      throw error
    }
  },

  async create(data: CreateEventDto): Promise<Event> {
    try {
      const response = await api.post<Event>('/events', data)
      return response.data
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  },

  async update(id: string, data: UpdateEventDto): Promise<Event> {
    try {
      const response = await api.patch<Event>(`/events/${id}`, data)
      return response.data
    } catch (error) {
      console.error(`Error updating event ${id}:`, error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/events/${id}`)
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error)
      throw error
    }
  }
}
