## Descrição

Projeto criado com [Nest](https://github.com/nestjs/nest) e SQLite.

## Setup
Na pasta do backend:

```bash
# instalar dependencias
$ npm install

# executar o server em modo dev(com logs)
$ npm run start:dev

# executar o server normal 
$ npm run start
```

## DB
- Por usar o SQLite os dados de desenv são salvos no arquivo dev.db 
- alterações do banco são feitas no schema.prisma


*OBS.:* após alterações no banco, deve ser rodado o migration do prisma:

```bash
$ npx prisma migrate dev --name descricao_da_mudanca
```

## Gerenciador do banco
```bash
$ npx prisma studio
```