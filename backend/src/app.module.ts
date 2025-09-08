import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { CollectionPointsModule } from './collection-points/collection-points.module';
import { EventsModule } from './events/events.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

// Legacy controller - can be removed after migration
import { CreateAccountController } from './controllers/create-account.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ItemsModule,
    CollectionPointsModule,
    EventsModule,
  ],
  controllers: [CreateAccountController], // Legacy - can be removed
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}