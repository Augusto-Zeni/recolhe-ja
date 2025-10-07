import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CollectionPointCategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.collectionPointCategory.findMany();
  }
}