import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { ImageClassificationService } from './image-classification.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ItemsController],
  providers: [ItemsService, ImageClassificationService],
})
export class ItemsModule {}
