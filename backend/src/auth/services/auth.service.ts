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
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name: string): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      passwordHash: hashedPassword,
      name,
    });
    await this.usersRepository.save(user);
    return { message: 'User registered successfully' };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
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

  async validateUserById(userId: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  async validateOAuthLogin(
    googleId: string,
    email: string,
    firstName: string,
    lastName: string,
  ): Promise<any> {
    let user = await this.usersRepository.findOne({ where: { googleId } });
    if (!user) {
      user = await this.usersRepository.findOne({ where: { email } });
      if (user) {
        user.googleId = googleId;
        await this.usersRepository.save(user);
      } else {
        user = this.usersRepository.create({
          googleId,
          email,
          name: `${firstName} ${lastName}`,
        });
        await this.usersRepository.save(user);
      }
    }
    const payload = { email: user.email, sub: user.id };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
