import { Module } from '@nestjs/common';
import { CollectionPointController } from './collection-point.controller';
import { CollectionPointService } from './collection-point.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CollectionPointController],
  providers: [CollectionPointService],
  exports: [CollectionPointService],
})
export class CollectionPointModule {}