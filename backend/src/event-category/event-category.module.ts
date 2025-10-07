import { Module } from '@nestjs/common';
import { EventCategoryController } from './event-category.controller';
import { EventCategoryService } from './event-category.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EventCategoryController],
  providers: [EventCategoryService],
  exports: [EventCategoryService],
})
export class EventCategoryModule {}