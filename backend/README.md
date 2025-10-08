<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


# Recolhe Já - Backend

API backend para a plataforma Recolhe Já - sistema de gestão de coleta seletiva e pontos de coleta.

## Descrição

Backend construído com [NestJS](https://github.com/nestjs/nest) framework TypeScript, utilizando PostgreSQL como banco de dados e Docker para containerização.

## Configuração do Projeto

### 1. Clonar o repositório
```bash
$ git clone <repository-url>
$ cd recolhe-ja/backend
```

### 2. Configurar variáveis de ambiente
```bash
# Copiar o arquivo de exemplo
$ cp .env.example .env

# Editar o arquivo .env com suas configurações
```

**Variáveis obrigatórias no `.env`:**
- `GOOGLE_CLIENT_ID` - ID do cliente OAuth Google
- `GOOGLE_CLIENT_SECRET` - Segredo do cliente OAuth Google
- `JWT_SECRET` - Chave secreta para JWT (usar um valor seguro em produção)

### 3. Instalar dependências
```bash
$ npm install
```

## Executando o projeto

### Com Docker (Recomendado)
```bash
# Subir todos os serviços (app + banco)
$ docker compose up -d

# Ver logs da aplicação
$ docker compose logs app

# Parar todos os serviços
$ docker compose down
```

### Desenvolvimento local
```bash
# Modo desenvolvimento
$ npm run start

# Modo watch (recarrega automaticamente)
$ npm run start:dev

# Modo produção
$ npm run start:prod
```
