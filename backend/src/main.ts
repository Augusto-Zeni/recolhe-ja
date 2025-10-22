import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Habilita CORS para permitir requisições do mobile
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Middleware para adicionar header que pula a tela de aviso do ngrok
  app.use((req, res, next) => {
    res.setHeader('ngrok-skip-browser-warning', 'true');
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('RecolheJá API')
    .setDescription('API RESTful para o sistema RecolheJá')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}

void bootstrap();
