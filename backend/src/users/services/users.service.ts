import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { UpdateUserDto, UpdateProfileDto, ChangePasswordDto } from '../dtos/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async findAll(page = 1, limit = 10) {
    const [users, total] = await this.usersRepository.findAndCount({
      select: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findOneWithPassword(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto, currentUserId: string): Promise<User> {
    // Verificar se o usuário pode atualizar este perfil
    if (id !== currentUserId) {
      throw new ForbiddenException('Você não tem permissão para atualizar este usuário');
    }

    await this.findOne(id); // Verifica se o usuário existe

    // Verificar se o email já está em uso por outro usuário
    if (updateUserDto.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Email já está em uso');
      }
    }

    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto, currentUserId: string): Promise<User> {
    // Verificar se o usuário pode atualizar este perfil
    if (id !== currentUserId) {
      throw new ForbiddenException('Você não tem permissão para atualizar este perfil');
    }

    await this.usersRepository.update(id, updateProfileDto);
    return this.findOne(id);
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
    currentUserId: string
  ): Promise<{ message: string }> {
    // Verificar se o usuário pode alterar esta senha
    if (id !== currentUserId) {
      throw new ForbiddenException('Você não tem permissão para alterar a senha deste usuário');
    }

    const user = await this.findOneWithPassword(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar senha atual
    if (!user.passwordHash) {
      throw new BadRequestException('Usuário não possui senha definida (login via Google)');
    }

    const isCurrentPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Senha atual incorreta');
    }

    // Hash da nova senha
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(changePasswordDto.newPassword, saltRounds);

    await this.usersRepository.update(id, { passwordHash: newPasswordHash });

    return { message: 'Senha alterada com sucesso' };
  }

  async remove(id: string, currentUserId: string): Promise<{ message: string }> {
    // Verificar se o usuário pode excluir esta conta
    if (id !== currentUserId) {
      throw new ForbiddenException('Você não tem permissão para excluir este usuário');
    }

    await this.findOne(id); // Verifica se o usuário existe
    await this.usersRepository.delete(id);

    return { message: 'Conta excluída com sucesso' };
  }

  async getProfile(id: string): Promise<User> {
    return this.findOne(id);
  }

  async getUserStats(id: string) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.items', 'items')
      .leftJoinAndSelect('user.collectionPoints', 'collectionPoints')
      .leftJoinAndSelect('user.events', 'events')
      .leftJoinAndSelect('user.eventParticipants', 'eventParticipants')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      totalItems: user.items?.length || 0,
      totalCollectionPoints: user.collectionPoints?.length || 0,
      totalEvents: user.events?.length || 0,
      totalEventParticipations: user.eventParticipants?.length || 0,
    };
  }
}
