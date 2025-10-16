import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CollectionPoint } from '../entities/collection-point.entity';
import { CollectionPointCategory } from '../entities/collection-point-category.entity';
import { Category } from 'src/categories/entities/category.entity';
import { CreateCollectionPointDto, UpdateCollectionPointDto } from '../dtos/collection-points.dto';

@Injectable()
export class CollectionPointsService {
  constructor(
    @InjectRepository(CollectionPoint)
    private collectionPointRepository: Repository<CollectionPoint>,
    @InjectRepository(CollectionPointCategory)
    private collectionPointCategoryRepository: Repository<CollectionPointCategory>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {}

  async create(createCollectionPointDto: CreateCollectionPointDto, userId: string) {
    const { categoryIds, ...collectionPointData } = createCollectionPointDto;

    // Criar o ponto de coleta
    const collectionPoint = this.collectionPointRepository.create({
      ...collectionPointData,
      userId,
    });

    const savedCollectionPoint = await this.collectionPointRepository.save(collectionPoint);

    // Se categorias foram fornecidas, adicionar associações
    if (categoryIds && categoryIds.length > 0) {
      await this.addCategoriesToCollectionPoint(savedCollectionPoint.id, categoryIds);
    }

    return this.findOne(savedCollectionPoint.id);
  }

  async findAll(page = 1, limit = 10) {
    const [items, total] = await this.collectionPointRepository.findAndCount({
      relations: ['user', 'collectionPointCategories', 'collectionPointCategories.category'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const collectionPoint = await this.collectionPointRepository.findOne({
      where: { id },
      relations: ['user', 'collectionPointCategories', 'collectionPointCategories.category'],
    });

    if (!collectionPoint) {
      throw new NotFoundException('Ponto de coleta não encontrado');
    }

    return collectionPoint;
  }

  async update(id: string, updateCollectionPointDto: UpdateCollectionPointDto, userId: string) {
    const collectionPoint = await this.findOne(id);

    // Verificar se o usuário é o criador do ponto de coleta
    if (collectionPoint.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para editar este ponto de coleta');
    }

    const { categoryIds, ...updateData } = updateCollectionPointDto;

    // Atualizar dados básicos do ponto de coleta
    await this.collectionPointRepository.update(id, updateData);

    // Se categorias foram fornecidas, atualizar associações
    if (categoryIds) {
      // Remover associações existentes
      await this.collectionPointCategoryRepository.delete({ collectionPointId: id });

      // Adicionar novas associações
      if (categoryIds.length > 0) {
        await this.addCategoriesToCollectionPoint(id, categoryIds);
      }
    }

    return this.findOne(id);
  }

  async remove(id: string, userId: string) {
    const collectionPoint = await this.findOne(id);

    // Verificar se o usuário é o criador do ponto de coleta
    if (collectionPoint.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para excluir este ponto de coleta');
    }

    // Remover associações de categorias
    await this.collectionPointCategoryRepository.delete({ collectionPointId: id });

    // Remover o ponto de coleta
    await this.collectionPointRepository.delete(id);

    return { message: 'Ponto de coleta removido com sucesso' };
  }

  async addCategory(collectionPointId: string, categoryId: string, userId: string) {
    const collectionPoint = await this.findOne(collectionPointId);

    // Verificar se o usuário é o criador do ponto de coleta
    if (collectionPoint.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para modificar este ponto de coleta');
    }

    // Verificar se a categoria existe
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    // Verificar se a associação já existe
    const existingAssociation = await this.collectionPointCategoryRepository.findOne({
      where: { collectionPointId, categoryId },
    });

    if (existingAssociation) {
      throw new BadRequestException('Categoria já está associada ao ponto de coleta');
    }

    // Criar a associação
    const association = this.collectionPointCategoryRepository.create({
      collectionPointId,
      categoryId,
    });

    await this.collectionPointCategoryRepository.save(association);

    return this.findOne(collectionPointId);
  }

  async removeCategory(collectionPointId: string, categoryId: string, userId: string) {
    const collectionPoint = await this.findOne(collectionPointId);

    // Verificar se o usuário é o criador do ponto de coleta
    if (collectionPoint.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para modificar este ponto de coleta');
    }

    const result = await this.collectionPointCategoryRepository.delete({
      collectionPointId,
      categoryId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Associação não encontrada');
    }

    return this.findOne(collectionPointId);
  }

  private async addCategoriesToCollectionPoint(collectionPointId: string, categoryIds: string[]) {
    // Verificar se todas as categorias existem
    const categories = await this.categoryRepository.findBy({ id: In(categoryIds) });
    if (categories.length !== categoryIds.length) {
      throw new BadRequestException('Uma ou mais categorias não foram encontradas');
    }

    // Criar associações
    const associations = categoryIds.map((categoryId) =>
      this.collectionPointCategoryRepository.create({
        collectionPointId,
        categoryId,
      })
    );

    await this.collectionPointCategoryRepository.save(associations);
  }
}
