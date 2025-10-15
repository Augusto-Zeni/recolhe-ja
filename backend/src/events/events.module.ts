import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './services/events.service';
import { EventsController } from './controllers/events.controller';
import { Event } from './entities/event.entity';
import { EventCategory } from './entities/event-category.entity';
import { EventParticipant } from './entities/event-participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventCategory, EventParticipant])],
  providers: [EventsService],
  controllers: [EventsController],
  exports: [EventsService],
})
export class EventsModule {}
