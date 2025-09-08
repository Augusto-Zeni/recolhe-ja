import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async createItem(
    userId: string | null,
    imageUrl: string,
    predictedCategory: string,
    confidence: number,
  ) {
    return this.prisma.item.create({
      data: {
        userId,
        imageUrl,
        predictedCategory,
        confidence,
      },
    });
  }

  async getUserItems(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.item.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.item.count({
        where: { userId },
      }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getItemById(id: string) {
    return this.prisma.item.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
