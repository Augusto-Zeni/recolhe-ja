/**
 * @fileoverview Módulo raiz da aplicação RecolheJá
 * @description Define a estrutura principal da aplicação, importando todos os módulos necessários
 * e configurando middlewares globais. Este é o ponto de entrada da aplicação NestJS.
 * 
 * @author Equipe RecolheJá
 * @version 1.0.0
 */

import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// Módulos do sistema
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { CollectionPointsModule } from './collection-points/collection-points.module';
import { EventsModule } from './events/events.module';

// Middlewares
import { LoggerMiddleware } from './common/middleware/logger.middleware';

// Controladores legados (podem ser removidos após migração completa)
import { CreateAccountController } from './controllers/create-account.controller';

/**
 * Módulo raiz da aplicação RecolheJá
 * 
 * Este módulo configura:
 * - Variáveis de ambiente globais
 * - Servir arquivos estáticos (uploads de imagens)
 * - Todos os módulos funcionais da aplicação
 * - Middleware de logging para todas as rotas
 */
@Module({
  imports: [
    // Configuração global de variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true, // Torna o ConfigService disponível em toda a aplicação
    }),
    
    // Configuração para servir arquivos estáticos (imagens de upload)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Pasta onde os arquivos são armazenados
      serveRoot: '/uploads', // Rota pública para acessar os arquivos
    }),
    
    // Módulos funcionais da aplicação
    PrismaModule,           // Acesso ao banco de dados
    AuthModule,             // Autenticação e autorização
    UsersModule,            // Gerenciamento de usuários
    ItemsModule,            // Classificação de resíduos
    CollectionPointsModule, // Pontos de coleta
    EventsModule,           // Eventos de coleta
  ],
  
  // Controladores legados (serão removidos em versões futuras)
  controllers: [CreateAccountController],
  
  providers: [],
})
export class AppModule {
  /**
   * Configura middlewares globais da aplicação
   * @param consumer - Consumer para aplicar middlewares
   */
  configure(consumer: MiddlewareConsumer) {
    // Aplica o middleware de logging em todas as rotas
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}