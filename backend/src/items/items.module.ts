import { Module } from '@nestjs/common';
import { ItemsService } from './services/items.service';
import { ItemsController } from './controllers/items.controller';

@Module({
  providers: [ItemsService],
  controllers: [ItemsController]
})
export class ItemsModule {}
