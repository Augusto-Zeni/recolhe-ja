import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createItemSchema = z.object({
  imageUrl: z.string().url('URL da imagem deve ser válida'),
  predictedCategoryId: z.string().uuid().optional(),
  confidence: z.number().min(0).max(1).optional(),
});

const updateItemSchema = z.object({
  imageUrl: z.string().url('URL da imagem deve ser válida').optional(),
  predictedCategoryId: z.string().uuid().optional(),
  confidence: z.number().min(0).max(1).optional(),
});

const uploadImageSchema = z.object({
  image: z.any(), // File will be handled by multer
});

const updatePredictionSchema = z.object({
  predictedCategoryId: z.string().uuid('ID da categoria deve ser um UUID válido'),
  confidence: z.number().min(0, 'Confidence deve ser no mínimo 0').max(1, 'Confidence deve ser no máximo 1'),
});

export class CreateItemDto extends createZodDto(createItemSchema) {}
export class UpdateItemDto extends createZodDto(updateItemSchema) {}
export class UploadImageDto extends createZodDto(uploadImageSchema) {}
export class UpdatePredictionDto extends createZodDto(updatePredictionSchema) {}
