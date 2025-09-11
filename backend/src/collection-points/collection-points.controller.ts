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
import { CollectionPointsService } from './collection-points.service';
import type { CreateCollectionPointDto } from './collection-points.service';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const createCollectionPointSchema = z.object({
  name: z.string().min(2),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  address: z.string().min(5),
  acceptedCategories: z.array(z.string()).min(1),
  openingHours: z.string(),
  contact: z.string(),
});

const updateCollectionPointSchema = createCollectionPointSchema.partial();

@Controller('api/points')
export class CollectionPointsController {
  constructor(private collectionPointsService: CollectionPointsService) {}

  @Get()
  async getCollectionPoints(
    @Query('lat') lat?: string,
    @Query('lon') lon?: string,
    @Query('category') category?: string,
    @Query('radius') radius?: string,
  ) {
    const latNum = lat ? parseFloat(lat) : undefined;
    const lonNum = lon ? parseFloat(lon) : undefined;
    const radiusNum = radius ? parseInt(radius, 10) : undefined;

    return this.collectionPointsService.getCollectionPoints(
      latNum,
      lonNum,
      category,
      radiusNum,
    );
  }

  @Get(':id')
  async getCollectionPoint(@Param('id') id: string) {
    const point = await this.collectionPointsService.getCollectionPointById(id);
    
    if (!point) {
      throw new BadRequestException('Collection point not found');
    }

    return point;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ZodValidationPipe(createCollectionPointSchema))
  async createCollectionPoint(
    @Body() body: CreateCollectionPointDto,
    @Request() req,
  ) {
    return this.collectionPointsService.createCollectionPoint(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateCollectionPointSchema))
  async updateCollectionPoint(
    @Param('id') id: string,
    @Body() body: Partial<CreateCollectionPointDto>,
    @Request() req,
  ) {
    try {
      return await this.collectionPointsService.updateCollectionPoint(
        id,
        req.user.id,
        body,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCollectionPoint(@Param('id') id: string, @Request() req) {
    try {
      await this.collectionPointsService.deleteCollectionPoint(id, req.user.id);
      return { message: 'Collection point deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
