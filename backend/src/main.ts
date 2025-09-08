/**
 * @fileoverview Arquivo principal da aplicação RecolheJá Backend
 * @description Este arquivo configura e inicializa o servidor NestJS com todas as configurações globais
 * necessárias para o funcionamento da API do sistema de classificação de resíduos.
 * 
 * @author Equipe RecolheJá
 * @version 1.0.0
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

/**
 * Função principal que inicializa a aplicação NestJS
 * Configura middlewares globais, filtros de exceção, CORS e pipes de validação
 */
async function bootstrap() {
  // Cria a instância da aplicação NestJS com o módulo raiz
  const app = await NestFactory.create(AppModule);

  // Configuração do filtro global de exceções
  // Captura e trata todas as exceções não tratadas da aplicação
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  // Configuração do CORS (Cross-Origin Resource Sharing)
  // Permite que o frontend mobile acesse a API de diferentes origens
  app.enableCors({
    origin: true, // Permite todas as origens em desenvolvimento
    credentials: true, // Permite envio de cookies e headers de autenticação
  });

  // Configuração do pipe global de validação
  // Valida automaticamente os dados de entrada usando class-validator e DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Transforma automaticamente os tipos dos dados
      whitelist: true, // Remove propriedades não definidas nos DTOs
      forbidNonWhitelisted: true, // Retorna erro se propriedades não permitidas forem enviadas
    }),
  );

  // Define a porta do servidor (padrão 3000 ou a definida na variável de ambiente)
  const port = process.env.PORT || 3000;
  
  // Inicia o servidor na porta especificada
  await app.listen(port);
  
  console.log(`🚀 RecolheJá API está rodando na porta ${port}`);
  console.log(`📚 Documentação da API disponível em: http://localhost:${port}/docs`);
}

// Inicia a aplicação e trata erros de inicialização
bootstrap().catch((error) => {
  console.error('❌ Erro ao inicializar a aplicação:', error);
  process.exit(1);
});
