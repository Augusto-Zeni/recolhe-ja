import { Controller, Get } from '@nestjs/common';
import { CollectionPointCategoryService } from './collection-point-category.service';

@Controller('collection-point-category')
export class CollectionPointCategoryController {
  constructor(private readonly collectionPointCategoryService: CollectionPointCategoryService) {}

  @Get()
  findAll() {
    return this.collectionPointCategoryService.findAll();
  }
}