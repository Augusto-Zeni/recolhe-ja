import { Module } from '@nestjs/common';
import { EventParticipantController } from './event-participant.controller';
import { EventParticipantService } from './event-participant.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EventParticipantController],
  providers: [EventParticipantService],
  exports: [EventParticipantService],
})
export class EventParticipantModule {}