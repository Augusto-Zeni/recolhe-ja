import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(6).max(255),
});

export class RegisterDto extends createZodDto(registerSchema) {}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255),
});

export class LoginDto extends createZodDto(loginSchema) {}
