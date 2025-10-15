import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ZodValidationPipe } from 'nestjs-zod';
import { CollectionPointsService } from '../services/collection-points.service';
import {
  CreateCollectionPointDto,
  UpdateCollectionPointDto,
  AddCategoryToCollectionPointDto,
} from '../dtos/collection-points.dto';

@Controller('collection-points')
@UseGuards(AuthGuard('jwt'))
export class CollectionPointsController {
  constructor(private readonly collectionPointsService: CollectionPointsService) {}

  @Post()
  create(@Body(new ZodValidationPipe()) createCollectionPointDto: CreateCollectionPointDto, @Req() req: any) {
    return this.collectionPointsService.create(createCollectionPointDto, req.user.id);
  }

  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ) {
    return this.collectionPointsService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectionPointsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe()) updateCollectionPointDto: UpdateCollectionPointDto,
    @Req() req: any
  ) {
    return this.collectionPointsService.update(id, updateCollectionPointDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.collectionPointsService.remove(id, req.user.id);
  }

  @Post(':id/categories')
  addCategory(
    @Param('id') id: string,
    @Body(new ZodValidationPipe()) addCategoryDto: AddCategoryToCollectionPointDto,
    @Req() req: any
  ) {
    return this.collectionPointsService.addCategory(id, addCategoryDto.categoryId, req.user.id);
  }

  @Delete(':id/categories/:categoryId')
  removeCategory(@Param('id') id: string, @Param('categoryId') categoryId: string, @Req() req: any) {
    return this.collectionPointsService.removeCategory(id, categoryId, req.user.id);
  }
}
