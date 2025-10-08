import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createUserSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(6).max(255),
});

export class CreateUserDto extends createZodDto(createUserSchema) {}

const updateUserSchema = z.object({
  name: z.string().min(3).max(255).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).max(255).optional(),
});

export class UpdateUserDto extends createZodDto(updateUserSchema) {}