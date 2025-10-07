import { Controller, Get } from '@nestjs/common';
import { EventCategoryService } from './event-category.service';

@Controller('event-category')
export class EventCategoryController {
  constructor(private readonly eventCategoryService: EventCategoryService) {}

  @Get()
  findAll() {
    return this.eventCategoryService.findAll();
  }
}