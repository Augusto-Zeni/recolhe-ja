import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async register(email: string, password: string, name: string): Promise<any> {
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 6);
    const user = this.usersRepository.create({
      email,
      passwordHash: hashedPassword,
      name,
    });

    return await this.usersRepository.save(user);
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };

    return { accessToken: this.jwtService.sign(payload) };
  }

  async validateOAuthLogin(googleId: string, email: string, firstName: string, lastName: string, photoUrl?: string): Promise<any> {
    let user = await this.usersRepository.findOne({ where: { googleId } });
    if (!user) {
      user = await this.usersRepository.findOne({ where: { email } });
      if (user) {
        user.googleId = googleId;
        if (photoUrl) {
          user.photoUrl = photoUrl;
        }
        user = await this.usersRepository.save(user);
      } else {
        const newUserData = {
          googleId,
          email,
          name: `${firstName} ${lastName}`,
          ...(photoUrl && { photoUrl }),
        };
        const newUser = this.usersRepository.create(newUserData);
        user = await this.usersRepository.save(newUser);
      }
    } else {
      // Atualizar a foto se mudou
      if (photoUrl && user.photoUrl !== photoUrl) {
        user.photoUrl = photoUrl;
        user = await this.usersRepository.save(user);
      }
    }
    const payload = { email: user.email, sub: user.id };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
