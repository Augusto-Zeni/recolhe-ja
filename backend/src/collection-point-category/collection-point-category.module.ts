import { Module } from '@nestjs/common';
import { CollectionPointCategoryController } from './collection-point-category.controller';
import { CollectionPointCategoryService } from './collection-point-category.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CollectionPointCategoryController],
  providers: [CollectionPointCategoryService],
  exports: [CollectionPointCategoryService],
})
export class CollectionPointCategoryModule {}