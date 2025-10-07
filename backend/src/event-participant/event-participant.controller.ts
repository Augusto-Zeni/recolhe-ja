import { Controller, Get } from '@nestjs/common';
import { EventParticipantService } from './event-participant.service';

@Controller('event-participant')
export class EventParticipantController {
  constructor(private readonly eventParticipantService: EventParticipantService) {}

  @Get()
  findAll() {
    return this.eventParticipantService.findAll();
  }
}