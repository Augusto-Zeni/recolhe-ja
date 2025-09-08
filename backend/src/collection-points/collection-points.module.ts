import { Module } from '@nestjs/common';
import { CollectionPointsController } from './collection-points.controller';
import { CollectionPointsService } from './collection-points.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CollectionPointsController],
  providers: [CollectionPointsService],
})
export class CollectionPointsModule {}
