import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const item = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado!`);
    }

    return item;
  }
}
