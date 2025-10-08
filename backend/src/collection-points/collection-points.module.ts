import { Module } from '@nestjs/common';
import { CollectionPointsService } from './services/collection-points.service';
import { CollectionPointsController } from './controllers/collection-points.controller';

@Module({
  providers: [CollectionPointsService],
  controllers: [CollectionPointsController]
})
export class CollectionPointsModule {}
