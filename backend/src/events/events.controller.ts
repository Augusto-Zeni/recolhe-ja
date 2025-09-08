import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  BadRequestException,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EventsService, CreateEventDto } from './events.service';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const createEventSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  startAt: z.string().transform((str) => new Date(str)),
  endAt: z.string().transform((str) => new Date(str)),
  acceptedCategories: z.array(z.string()).min(1),
});

const updateEventSchema = createEventSchema.partial();

@Controller('api/events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  async getEvents(
    @Query('lat') lat?: string,
    @Query('lon') lon?: string,
    @Query('radius') radius?: string,
    @Query('category') category?: string,
  ) {
    const latNum = lat ? parseFloat(lat) : undefined;
    const lonNum = lon ? parseFloat(lon) : undefined;
    const radiusNum = radius ? parseInt(radius, 10) : undefined;

    return this.eventsService.getEvents(latNum, lonNum, radiusNum, category);
  }

  @Get(':id')
  async getEvent(@Param('id') id: string) {
    const event = await this.eventsService.getEventById(id);
    
    if (!event) {
      throw new BadRequestException('Event not found');
    }

    return event;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ZodValidationPipe(createEventSchema))
  async createEvent(@Body() body: CreateEventDto, @Request() req) {
    // Validate dates
    if (body.startAt >= body.endAt) {
      throw new BadRequestException('End date must be after start date');
    }

    if (body.startAt < new Date()) {
      throw new BadRequestException('Start date must be in the future');
    }

    return this.eventsService.createEvent(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateEventSchema))
  async updateEvent(
    @Param('id') id: string,
    @Body() body: Partial<CreateEventDto>,
    @Request() req,
  ) {
    // Validate dates if provided
    if (body.startAt && body.endAt && body.startAt >= body.endAt) {
      throw new BadRequestException('End date must be after start date');
    }

    try {
      return await this.eventsService.updateEvent(id, req.user.id, body);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteEvent(@Param('id') id: string, @Request() req) {
    try {
      await this.eventsService.deleteEvent(id, req.user.id);
      return { message: 'Event deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  async joinEvent(@Param('id') eventId: string, @Request() req) {
    try {
      return await this.eventsService.joinEvent(eventId, req.user.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/leave')
  async leaveEvent(@Param('id') eventId: string, @Request() req) {
    try {
      return await this.eventsService.leaveEvent(eventId, req.user.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/participations')
  async getUserEvents(@Request() req) {
    return this.eventsService.getUserEvents(req.user.id);
  }
}
