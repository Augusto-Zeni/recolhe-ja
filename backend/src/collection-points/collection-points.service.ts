import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateCollectionPointDto {
  name: string;
  lat: number;
  lon: number;
  address: string;
  acceptedCategories: string[];
  openingHours: string;
  contact: string;
}

@Injectable()
export class CollectionPointsService {
  constructor(private prisma: PrismaService) {}

  async createCollectionPoint(
    userId: string,
    data: CreateCollectionPointDto,
  ) {
    return this.prisma.collectionPoint.create({
      data: {
        ...data,
        createdBy: userId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getCollectionPoints(
    lat?: number,
    lon?: number,
    category?: string,
    radius = 10000, // 10km default
  ) {
    let whereClause = {};

    if (category) {
      whereClause = {
        acceptedCategories: {
          has: category,
        },
      };
    }

    const points = await this.prisma.collectionPoint.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // If coordinates provided, calculate distance and filter by radius
    if (lat !== undefined && lon !== undefined) {
      const pointsWithDistance = points.map((point) => ({
        ...point,
        distance: this.calculateDistance(lat, lon, point.lat, point.lon),
      }));

      return pointsWithDistance
        .filter((point) => point.distance <= radius)
        .sort((a, b) => a.distance - b.distance);
    }

    return points;
  }

  async getCollectionPointById(id: string) {
    return this.prisma.collectionPoint.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async updateCollectionPoint(
    id: string,
    userId: string,
    data: Partial<CreateCollectionPointDto>,
  ) {
    // Verify the user owns this collection point
    const point = await this.prisma.collectionPoint.findUnique({
      where: { id },
    });

    if (!point || point.createdBy !== userId) {
      throw new Error('Collection point not found or access denied');
    }

    return this.prisma.collectionPoint.update({
      where: { id },
      data,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async deleteCollectionPoint(id: string, userId: string) {
    // Verify the user owns this collection point
    const point = await this.prisma.collectionPoint.findUnique({
      where: { id },
    });

    if (!point || point.createdBy !== userId) {
      throw new Error('Collection point not found or access denied');
    }

    return this.prisma.collectionPoint.delete({
      where: { id },
    });
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    // Haversine formula to calculate distance between two points
    const R = 6371000; // Earth's radius in meters
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance);
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
