import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionPointsService } from './services/collection-points.service';
import { CollectionPointsController } from './controllers/collection-points.controller';
import { CollectionPoint } from './entities/collection-point.entity';
import { CollectionPointCategory } from './entities/collection-point-category.entity';
import { Category } from 'src/categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CollectionPoint, CollectionPointCategory, Category])],
  providers: [CollectionPointsService],
  controllers: [CollectionPointsController],
  exports: [CollectionPointsService],
})
export class CollectionPointsModule {}
