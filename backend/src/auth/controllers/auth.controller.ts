import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ZodValidationPipe } from 'nestjs-zod';
import { RegisterDto, LoginDto } from '../dtos/auth.dto';
import { Response } from 'express';
import { GoogleOAuthGuard } from '../guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body(new ZodValidationPipe()) registerDto: RegisterDto) {
    return this.authService.register(registerDto.email, registerDto.password, registerDto.name);
  }

  @Post('login')
  async login(@Body(new ZodValidationPipe()) loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {
    // Passport intercepta e redireciona para o Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const result = await this.authService.validateOAuthLogin(
      req.user.googleId,
      req.user.email,
      req.user.firstName,
      req.user.lastName,
      req.user.photoUrl
    );

    // Recupera o redirect_uri do state parameter
    let redirectUri = 'recolheja://';
    try {
      if (req.query.state) {
        const stateData = JSON.parse(Buffer.from(req.query.state as string, 'base64').toString());
        redirectUri = stateData.redirect_uri || redirectUri;
      }
    } catch (error) {
      console.error('❌ Erro ao decodificar state parameter:', error);
    }

    const redirectUrl = `${redirectUri}?token=${result.accessToken}`;

    res.setHeader('ngrok-skip-browser-warning', 'true');
    res.redirect(redirectUrl);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
