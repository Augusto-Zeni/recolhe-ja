import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    // Check if category name already exists
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new BadRequestException('Category name already exists');
    }

    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async findAll(page = 1, limit = 10) {
    const [categories, total] = await this.categoryRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
    });

    return {
      data: categories,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['items', 'collectionPointCategories', 'eventCategories'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    // Check if new name already exists (if name is being updated)
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name },
      });

      if (existingCategory) {
        throw new BadRequestException('Category name already exists');
      }
    }

    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    // Check if category is being used
    const categoryWithRelations = await this.categoryRepository.findOne({
      where: { id },
      relations: ['items', 'collectionPointCategories', 'eventCategories'],
    });

    if (
      categoryWithRelations &&
      (categoryWithRelations.items.length > 0 ||
        categoryWithRelations.collectionPointCategories.length > 0 ||
        categoryWithRelations.eventCategories.length > 0)
    ) {
      throw new BadRequestException('Cannot delete category that is being used by items, collection points, or events');
    }

    await this.categoryRepository.remove(category);
    return { message: 'Category deleted successfully' };
  }

  async search(query: string, page = 1, limit = 10) {
    const [categories, total] = await this.categoryRepository
      .createQueryBuilder('category')
      .where('LOWER(category.name) LIKE LOWER(:query)', { query: `%${query}%` })
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('category.name', 'ASC')
      .getManyAndCount();

    return {
      data: categories,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        query,
      },
    };
  }
}