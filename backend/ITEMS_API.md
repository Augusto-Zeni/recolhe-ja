# Items API

Esta API fornece operações CRUD completas para gerenciamento de itens (imagens) com predição de categoria automática.

## Autenticação

Todas as rotas requerem autenticação JWT. Inclua o token no header:
```
Authorization: Bearer <token>
```

## Endpoints

### Items CRUD

#### POST /items
Cria um novo item.

**Body:**
```json
{
  "imageUrl": "https://example.com/image.jpg",
  "predictedCategoryId": "uuid-da-categoria (opcional)",
  "confidence": 0.85
}
```

#### GET /items
Lista todos os itens do usuário logado com paginação.

**Query Parameters:**
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10)
- `userId`: ID do usuário (opcional, usa o logado por padrão)

#### GET /items/my-items
Lista especificamente os itens do usuário logado.

**Query Parameters:**
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10)

#### GET /items/:id
Busca um item específico por ID.

#### PATCH /items/:id
Atualiza um item. Apenas o criador pode editar.

**Body:** Campos opcionais do item.
```json
{
  "imageUrl": "https://example.com/new-image.jpg",
  "predictedCategoryId": "novo-uuid-categoria",
  "confidence": 0.92
}
```

#### DELETE /items/:id
Remove um item. Apenas o criador pode excluir.

### Predição de Categoria

#### PATCH /items/:id/prediction
Atualiza a predição de categoria de um item.

**Body:**
```json
{
  "predictedCategoryId": "uuid-da-categoria",
  "confidence": 0.95
}
```

### Estatísticas

#### GET /items/stats
Obtém estatísticas dos itens do usuário logado.

**Resposta:**
```json
{
  "total": 100,
  "categorized": 85,
  "uncategorized": 15,
  "highConfidence": 70
}
```

#### GET /items/all-stats
Obtém estatísticas globais de todos os itens (todos os usuários).

## Validações

- **imageUrl**: Obrigatório, deve ser uma URL válida
- **predictedCategoryId**: Opcional, deve ser um UUID válido se fornecido
- **confidence**: Opcional, número entre 0 e 1

## Permissões

- Qualquer usuário autenticado pode criar itens
- Usuários só podem visualizar seus próprios itens por padrão
- Apenas o criador do item pode editá-lo ou excluí-lo
- Apenas o criador pode atualizar predições

## Respostas

### Sucesso - Item Individual (200/201)
```json
{
  "id": "uuid",
  "userId": "uuid-do-usuario",
  "imageUrl": "https://example.com/image.jpg",
  "predictedCategoryId": "uuid-da-categoria",
  "confidence": 0.85,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "user": {
    "id": "uuid",
    "name": "Nome do Usuário",
    "email": "email@example.com"
  },
  "predictedCategory": {
    "id": "uuid",
    "name": "Nome da Categoria"
  }
}
```

### Lista com Paginação (200)
```json
{
  "items": [...],
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

### Estatísticas (200)
```json
{
  "total": 100,
  "categorized": 85,
  "uncategorized": 15,
  "highConfidence": 70
}
```

### Erros

- **400 Bad Request**: Dados inválidos (URL malformada, confidence fora do range)
- **401 Unauthorized**: Token não fornecido ou inválido
- **403 Forbidden**: Sem permissão para a operação
- **404 Not Found**: Item não encontrado

## Casos de Uso

### 1. Upload e Classificação de Imagem
```bash
# 1. Criar item com imagem
curl -X POST http://localhost:3000/items \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/recyclable-bottle.jpg"
  }'

# 2. Atualizar com predição da IA
curl -X PATCH http://localhost:3000/items/{id}/prediction \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "predictedCategoryId": "plastic-category-uuid",
    "confidence": 0.92
  }'
```

### 2. Visualizar Progresso do Usuário
```bash
# Ver estatísticas pessoais
curl -X GET "http://localhost:3000/items/stats" \
  -H "Authorization: Bearer your-token"

# Listar itens recentes
curl -X GET "http://localhost:3000/items/my-items?limit=5" \
  -H "Authorization: Bearer your-token"
```

### 3. Gerenciamento de Items
```bash
# Atualizar imagem
curl -X PATCH http://localhost:3000/items/{id} \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/better-quality-image.jpg"
  }'

# Remover item
curl -X DELETE http://localhost:3000/items/{id} \
  -H "Authorization: Bearer your-token"
```

## Integração com Machine Learning

A API está preparada para integração com sistemas de ML:

1. **Upload**: Usuário faz upload da imagem
2. **Processamento**: Sistema de ML analisa a imagem
3. **Predição**: API recebe categoria predita e confidence score
4. **Feedback**: Usuário pode corrigir predições incorretas

## Métricas e Analytics

- **Taxa de Categorização**: `categorized / total`
- **Qualidade das Predições**: Items com `confidence >= 0.8`
- **Engagement**: Itens criados por período
- **Accuracy**: Predições não corrigidas pelo usuário
