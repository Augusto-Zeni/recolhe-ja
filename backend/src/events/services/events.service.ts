import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { EventCategory } from '../entities/event-category.entity';
import { EventParticipant } from '../entities/event-participant.entity';
import { CreateEventDto, UpdateEventDto } from '../dtos/events.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventCategory)
    private readonly eventCategoryRepository: Repository<EventCategory>,
    @InjectRepository(EventParticipant)
    private readonly eventParticipantRepository: Repository<EventParticipant>
  ) {}

  async create(createEventDto: CreateEventDto, userId: string) {
    const { categoryIds, ...eventData } = createEventDto;

    // Validate start and end dates
    const startDate = new Date(createEventDto.startAt);
    const endDate = new Date(createEventDto.endAt);

    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    if (startDate <= new Date()) {
      throw new BadRequestException('Start date must be in the future');
    }

    const event = this.eventRepository.create({
      ...eventData,
      startAt: startDate,
      endAt: endDate,
      userId,
    });

    const savedEvent = await this.eventRepository.save(event);

    // Add categories if provided
    if (categoryIds && categoryIds.length > 0) {
      const eventCategories = categoryIds.map((categoryId) =>
        this.eventCategoryRepository.create({
          eventId: savedEvent.id,
          categoryId,
        })
      );
      await this.eventCategoryRepository.save(eventCategories);
    }

    return this.findOne(savedEvent.id);
  }

  async findAll(page = 1, limit = 10) {
    const [events, total] = await this.eventRepository.findAndCount({
      relations: ['user', 'eventCategories', 'eventCategories.category', 'eventParticipants'],
      skip: (page - 1) * limit,
      take: limit,
      order: { startAt: 'ASC' },
    });

    // Add participant count to each event
    const eventsWithCount = events.map(event => ({
      ...event,
      participantsCount: event.eventParticipants?.length || 0,
    }));

    return {
      data: eventsWithCount,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['user', 'eventCategories', 'eventCategories.category', 'eventParticipants'],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return {
      ...event,
      participantsCount: event.eventParticipants?.length || 0,
    };
  }

  async update(id: string, updateEventDto: UpdateEventDto, userId: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    // Check if user owns the event
    if (event.userId !== userId) {
      throw new BadRequestException('You can only update your own events');
    }

    const { categoryIds, ...eventData } = updateEventDto;

    // Validate dates if provided
    const startAt = updateEventDto.startAt ? new Date(updateEventDto.startAt) : event.startAt;
    const endAt = updateEventDto.endAt ? new Date(updateEventDto.endAt) : event.endAt;

    if (startAt >= endAt) {
      throw new BadRequestException('Start date must be before end date');
    }

    // Update event data
    Object.assign(event, {
      ...eventData,
      ...(updateEventDto.startAt && { startAt }),
      ...(updateEventDto.endAt && { endAt }),
    });

    await this.eventRepository.save(event);

    // Update categories if provided
    if (categoryIds !== undefined) {
      // Remove existing categories
      await this.eventCategoryRepository.delete({ eventId: id });

      // Add new categories
      if (categoryIds.length > 0) {
        const eventCategories = categoryIds.map((categoryId) =>
          this.eventCategoryRepository.create({
            eventId: id,
            categoryId,
          })
        );
        await this.eventCategoryRepository.save(eventCategories);
      }
    }

    return this.findOne(id);
  }

  async remove(id: string, userId: string) {
    const event = await this.findOne(id);

    // Check if user owns the event
    if (event.userId !== userId) {
      throw new BadRequestException('You can only delete your own events');
    }

    await this.eventRepository.remove(event);
    return { message: 'Event deleted successfully' };
  }

  async findByUser(userId: string, page = 1, limit = 10) {
    const [events, total] = await this.eventRepository.findAndCount({
      where: { userId },
      relations: ['eventCategories', 'eventCategories.category'],
      skip: (page - 1) * limit,
      take: limit,
      order: { startAt: 'ASC' },
    });

    return {
      data: events,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async subscribe(eventId: string, userId: string) {
    // Verify if event exists
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    // Check if event has already ended
    const now = new Date();
    if (event.endAt <= now) {
      throw new BadRequestException('Cannot subscribe to an event that has already ended');
    }

    // Check if user is already subscribed
    const existingParticipant = await this.eventParticipantRepository.findOne({
      where: { eventId, userId },
    });

    if (existingParticipant) {
      throw new BadRequestException('You are already subscribed to this event');
    }

    // Create participant
    const participant = this.eventParticipantRepository.create({
      eventId,
      userId,
      status: 'confirmed',
    });

    await this.eventParticipantRepository.save(participant);

    return this.findOne(eventId);
  }

  async unsubscribe(eventId: string, userId: string) {
    // Verify if event exists
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    // Check if user is subscribed
    const participant = await this.eventParticipantRepository.findOne({
      where: { eventId, userId },
    });

    if (!participant) {
      throw new BadRequestException('You are not subscribed to this event');
    }

    // Remove participant
    await this.eventParticipantRepository.remove(participant);

    return this.findOne(eventId);
  }

  async isUserSubscribed(eventId: string, userId: string): Promise<boolean> {
    const participant = await this.eventParticipantRepository.findOne({
      where: { eventId, userId },
    });

    return !!participant;
  }
}
