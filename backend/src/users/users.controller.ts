import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  avatar: z.string().url().optional(),
});

type UpdateProfileDto = z.infer<typeof updateProfileSchema>;

@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    return this.usersService.getUserProfile(req.user.id);
  }

  @Put('profile')
  @UsePipes(new ZodValidationPipe(updateProfileSchema))
  async updateProfile(@Body() body: UpdateProfileDto, @Request() req) {
    return this.usersService.updateUserProfile(req.user.id, body);
  }

  @Get('stats')
  async getStats(@Request() req) {
    return this.usersService.getUserStats(req.user.id);
  }
}
