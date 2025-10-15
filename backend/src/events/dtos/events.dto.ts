import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  categoryIds: z.array(z.string().uuid()).optional(),
});

export const UpdateEventSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  lat: z.number().min(-90).max(90).optional(),
  lon: z.number().min(-180).max(180).optional(),
  startAt: z.string().datetime().optional(),
  endAt: z.string().datetime().optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
});

export class CreateEventDto extends createZodDto(CreateEventSchema) {}
export class UpdateEventDto extends createZodDto(UpdateEventSchema) {}
