# Feature: Análise de Imagem com Google Gemini AI

## Descrição

Esta feature implementa análise inteligente de imagens usando o Google Gemini AI para identificar automaticamente objetos recicláveis e classificá-los nas categorias apropriadas cadastradas no banco de dados.

## Funcionalidades

Quando o usuário tira uma foto através do aplicativo mobile:
1. A imagem é enviada para o backend
2. O Google Gemini AI analisa a imagem e identifica o objeto
3. O sistema classifica o objeto em uma das categorias recicláveis cadastradas
4. Retorna o nome do objeto, categoria e nível de confiança da classificação
5. Salva a informação no banco de dados vinculada ao usuário

## Categorias Suportadas

O sistema classifica objetos nas seguintes categorias (definidas no seed do banco):
- Plástico
- Papel
- Metal
- Vidro
- Orgânico
- Eletrônicos
- Pilhas e Baterias
- Óleo de Cozinha
- Roupas e Têxteis
- Medicamentos

## Configuração

### Backend

1. **Instalar dependência**:
   ```bash
   cd backend
   npm install @google/generative-ai
   ```

2. **Configurar variável de ambiente**:
   Adicione a chave da API do Gemini no arquivo `.env`:
   ```env
   GEMINI_API_KEY=sua-chave-api-aqui
   ```

3. **Obter chave da API**:
   - Acesse [Google AI Studio](https://ai.google.dev/gemini-api/docs)
   - Crie uma conta e gere uma API key
   - Cole a chave no arquivo `.env`

### Mobile

Não há configuração adicional necessária no mobile. A integração já está implementada.

## Como Usar

### Usuário Final

1. Abra o aplicativo mobile
2. Navegue até a tela de câmera
3. Tire uma foto do objeto reciclável
4. Aguarde a análise (alguns segundos)
5. Visualize o resultado com:
   - Nome do objeto identificado
   - Categoria de reciclagem
   - Nível de confiança da classificação (0-100%)

### Desenvolvedor - Endpoint da API

**POST** `/items/analyze`

**Headers**:
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Body**:
- `image`: arquivo de imagem (JPG, PNG, GIF, WEBP)

**Resposta**:
```json
{
  "id": "uuid",
  "userId": "uuid",
  "imageUrl": "http://localhost:3000/uploads/image-123.jpg",
  "predictedCategoryId": "uuid",
  "confidence": 0.95,
  "createdAt": "2025-12-03T...",
  "updatedAt": "2025-12-03T...",
  "predictedCategory": {
    "id": "uuid",
    "name": "Plástico"
  },
  "analysisDetails": {
    "objectName": "Garrafa PET",
    "description": "Garrafa de plástico transparente tipo PET, comumente usada para bebidas"
  }
}
```

## Arquitetura

### Backend

**Novos arquivos criados**:

1. `backend/src/ai-analysis/ai-analysis.service.ts`
   - Serviço responsável pela comunicação com o Google Gemini AI
   - Processa a imagem e retorna a classificação
   - Implementa lógica de matching de categorias com sinônimos

2. `backend/src/ai-analysis/ai-analysis.module.ts`
   - Módulo NestJS para o serviço de análise de IA

**Arquivos modificados**:

1. `backend/src/items/items.module.ts`
   - Importa o AiAnalysisModule

2. `backend/src/items/services/items.service.ts`
   - Adiciona método `analyzeImageWithAI()`

3. `backend/src/items/controllers/items.controller.ts`
   - Adiciona endpoint POST `/items/analyze`

4. `backend/src/app.module.ts`
   - Registra o AiAnalysisModule

5. `backend/.env.example`
   - Adiciona variável `GEMINI_API_KEY`

### Mobile

**Arquivos modificados**:

1. `mobile/src/services/items.service.ts`
   - Adiciona interface `AnalyzedItem`
   - Adiciona método `analyzeImage()`

2. `mobile/app/camera/index.tsx`
   - Atualiza função `takePicture()` para usar análise de IA
   - Exibe resultado da análise em Alert

## Detalhes Técnicos

### Processamento de Imagem

- O backend usa `memoryStorage()` do Multer para manter a imagem em memória
- A imagem é convertida para Base64 antes de enviar ao Gemini
- Após análise, a imagem é salva em disco na pasta `./uploads`

### Matching de Categorias

O sistema implementa três níveis de matching:
1. **Match exato**: Compara nome retornado pelo Gemini com categorias do banco
2. **Match por substring**: Busca categorias que contenham o nome retornado
3. **Match por sinônimos**: Usa dicionário de sinônimos para termos comuns

### Modelo Gemini

- Modelo utilizado: `gemini-2.0-flash-exp`
- Suporta imagens: JPG, JPEG, PNG, GIF, WEBP
- Limite de tamanho: 5MB
- Resposta estruturada em JSON

## Benefícios

1. **Experiência do Usuário**:
   - Classificação automática sem necessidade de conhecimento prévio
   - Feedback imediato sobre o tipo de resíduo

2. **Precisão**:
   - Utiliza modelo de IA de última geração
   - Confiança medida em porcentagem

3. **Escalabilidade**:
   - Fácil adicionar novas categorias
   - Sistema de sinônimos expansível

4. **Rastreabilidade**:
   - Todas as análises são salvas no banco de dados
   - Histórico completo de itens do usuário

## Possíveis Melhorias Futuras

1. Adicionar cache de análises para imagens similares
2. Implementar feedback do usuário para melhorar classificações
3. Suporte para análise em lote (múltiplas imagens)
4. Integração com serviços de armazenamento cloud (S3, Cloudinary)
5. Dashboard de estatísticas de classificações
6. Machine Learning local para reduzir custos de API

## Referências

- [Google Gemini API Documentation](https://ai.google.dev/gemini-api/docs/image-understanding)
- [@google/generative-ai NPM Package](https://www.npmjs.com/package/@google/generative-ai)
- [Image Understanding Guide](https://developers.google.com/learn/pathways/solution-ai-gemini-images)
