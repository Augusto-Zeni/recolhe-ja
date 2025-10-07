import { Controller, Get } from '@nestjs/common';
import { CollectionPointService } from './collection-point.service';

@Controller('collection-point')
export class CollectionPointController {
  constructor(private readonly collectionPointService: CollectionPointService) {}

  @Get()
  findAll() {
    return this.collectionPointService.findAll();
  }
}