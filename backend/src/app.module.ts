import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { EventsModule } from './events/events.module';
import { CategoryModule } from './category/category.module';
import { CollectionPointModule } from './collection-point/collection-point.module';
import { EventParticipantModule } from './event-participant/event-participant.module';
import { EventCategoryModule } from './event-category/event-category.module';
import { CollectionPointCategoryModule } from './collection-point-category/collection-point-category.module';


@Module({
  imports: [
    PrismaModule,
    UsersModule,
    ItemsModule,
    EventsModule,
    CategoryModule,
    CollectionPointModule,
    EventParticipantModule,
    EventCategoryModule,
    CollectionPointCategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
