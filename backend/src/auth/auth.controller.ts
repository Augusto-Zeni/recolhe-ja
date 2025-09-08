import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type RegisterDto = z.infer<typeof registerSchema>;
type LoginDto = z.infer<typeof loginSchema>;

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(@Body() body: RegisterDto) {
    const user = await this.authService.register(
      body.name,
      body.email,
      body.password,
    );
    return this.authService.login(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
