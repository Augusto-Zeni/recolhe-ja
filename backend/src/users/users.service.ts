import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            items: true,
            createdCollectionPoints: true,
            createdEvents: true,
            eventParticipations: {
              where: { status: 'INSCRITO' },
            },
          },
        },
      },
    });
  }

  async updateUserProfile(
    userId: string,
    data: { name?: string; avatar?: string },
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    });
  }

  async getUserStats(userId: string) {
    const [
      totalItems,
      totalCollectionPoints,
      totalEvents,
      totalParticipations,
      recentItems,
    ] = await Promise.all([
      this.prisma.item.count({ where: { userId } }),
      this.prisma.collectionPoint.count({ where: { createdBy: userId } }),
      this.prisma.event.count({ where: { createdBy: userId } }),
      this.prisma.eventParticipant.count({
        where: { userId, status: 'INSCRITO' },
      }),
      this.prisma.item.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          predictedCategory: true,
          confidence: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      totalItems,
      totalCollectionPoints,
      totalEvents,
      totalParticipations,
      recentItems,
    };
  }
}
