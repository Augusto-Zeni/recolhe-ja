import { api } from './api';

export interface Item {
  id: string;
  userId: string;
  imageUrl: string;
  predictedCategoryId?: string;
  confidence?: number;
  objectName?: string;
  createdAt: string;
  updatedAt: string;
  predictedCategory?: {
    id: string;
    name: string;
  };
}

export interface AnalyzedItem extends Item {
  analysisDetails?: {
    objectName: string;
    description?: string;
  };
}

export interface CreateItemDto {
  imageUrl: string;
  predictedCategoryId?: string;
  confidence?: number;
}

export interface ItemStats {
  total: number;
  categorized: number;
  highConfidence: number;
  uncategorized: number;
}

class ItemsService {
  async uploadImage(imageUri: string): Promise<Item> {
    try {
      // Create FormData for multipart upload
      const formData = new FormData();

      // Extract filename from URI
      const filename = imageUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      // Append the image file
      formData.append('image', {
        uri: imageUri,
        name: filename,
        type,
      } as any);

      const response = await api.post<Item>('/items/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  async analyzeImage(imageUri: string): Promise<AnalyzedItem> {
    try {
      // Create FormData for multipart upload
      const formData = new FormData();

      // Extract filename from URI
      const filename = imageUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      // Append the image file
      formData.append('image', {
        uri: imageUri,
        name: filename,
        type,
      } as any);

      const response = await api.post<AnalyzedItem>('/items/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  }

  async createItem(data: CreateItemDto): Promise<Item> {
    try {
      const response = await api.post<Item>('/items', data);
      return response.data;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  }

  async getMyItems(page = 1, limit = 10): Promise<{ items: Item[]; total: number }> {
    try {
      const response = await api.get<{ items: Item[]; total: number }>('/items/my-items', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error getting my items:', error);
      throw error;
    }
  }

  async getStats(): Promise<ItemStats> {
    try {
      const response = await api.get<ItemStats>('/items/stats');
      return response.data;
    } catch (error) {
      console.error('Error getting stats:', error);
      throw error;
    }
  }

  async deleteItem(id: string): Promise<void> {
    try {
      await api.delete(`/items/${id}`);
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }
}

export const itemsService = new ItemsService();
