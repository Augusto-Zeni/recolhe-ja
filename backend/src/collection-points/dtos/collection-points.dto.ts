import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createCollectionPointSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  lat: z.number().min(-90).max(90, 'Latitude deve estar entre -90 e 90'),
  lon: z.number().min(-180).max(180, 'Longitude deve estar entre -180 e 180'),
  address: z.string().min(1, 'Endereço é obrigatório'),
  contact: z.string().optional(),
  openingHours: z.string().optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
});

const updateCollectionPointSchema = createCollectionPointSchema.partial();

const addCategoryToCollectionPointSchema = z.object({
  categoryId: z.string().uuid('ID da categoria deve ser um UUID válido'),
});

export class CreateCollectionPointDto extends createZodDto(createCollectionPointSchema) {}
export class UpdateCollectionPointDto extends createZodDto(updateCollectionPointSchema) {}
export class AddCategoryToCollectionPointDto extends createZodDto(addCategoryToCollectionPointSchema) {}
