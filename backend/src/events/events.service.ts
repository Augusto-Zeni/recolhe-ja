import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateEventDto {
  title: string;
  description: string;
  lat: number;
  lon: number;
  startAt: Date;
  endAt: Date;
  acceptedCategories: string[];
}

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async createEvent(userId: string, data: CreateEventDto) {
    return this.prisma.event.create({
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
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async getEvents(
    lat?: number,
    lon?: number,
    radius = 10000, // 10km default
    category?: string,
  ) {
    let whereClause = {
      endAt: {
        gte: new Date(), // Only future events
      },
    };

    if (category) {
      whereClause = {
        ...whereClause,
        acceptedCategories: {
          has: category,
        },
      };
    }

    const events = await this.prisma.event.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        startAt: 'asc',
      },
    });

    // If coordinates provided, calculate distance and filter by radius
    if (lat !== undefined && lon !== undefined) {
      const eventsWithDistance = events.map((event) => ({
        ...event,
        distance: this.calculateDistance(lat, lon, event.lat, event.lon),
      }));

      return eventsWithDistance
        .filter((event) => event.distance <= radius)
        .sort((a, b) => a.distance - b.distance);
    }

    return events;
  }

  async getEventById(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async updateEvent(
    id: string,
    userId: string,
    data: Partial<CreateEventDto>,
  ) {
    // Verify the user owns this event
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event || event.createdBy !== userId) {
      throw new Error('Event not found or access denied');
    }

    return this.prisma.event.update({
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
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async deleteEvent(id: string, userId: string) {
    // Verify the user owns this event
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event || event.createdBy !== userId) {
      throw new Error('Event not found or access denied');
    }

    return this.prisma.event.delete({
      where: { id },
    });
  }

  async joinEvent(eventId: string, userId: string) {
    // Check if user is already participating
    const existingParticipation = await this.prisma.eventParticipant.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });

    if (existingParticipation) {
      if (existingParticipation.status === 'CANCELADO') {
        // Reactivate participation
        return this.prisma.eventParticipant.update({
          where: { id: existingParticipation.id },
          data: { status: 'INSCRITO' },
          include: {
            event: {
              select: {
                id: true,
                title: true,
                startAt: true,
                endAt: true,
              },
            },
          },
        });
      }
      throw new Error('User is already participating in this event');
    }

    return this.prisma.eventParticipant.create({
      data: {
        eventId,
        userId,
        status: 'INSCRITO',
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            startAt: true,
            endAt: true,
          },
        },
      },
    });
  }

  async leaveEvent(eventId: string, userId: string) {
    const participation = await this.prisma.eventParticipant.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });

    if (!participation) {
      throw new Error('User is not participating in this event');
    }

    return this.prisma.eventParticipant.update({
      where: { id: participation.id },
      data: { status: 'CANCELADO' },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            startAt: true,
            endAt: true,
          },
        },
      },
    });
  }

  async getUserEvents(userId: string) {
    return this.prisma.eventParticipant.findMany({
      where: {
        userId,
        status: 'INSCRITO',
      },
      include: {
        event: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        event: {
          startAt: 'asc',
        },
      },
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
