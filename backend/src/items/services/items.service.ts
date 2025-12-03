import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../entities/item.entity';
import { CreateItemDto, UpdateItemDto } from '../dtos/items.dto';
import { AiAnalysisService } from '../../ai-analysis/ai-analysis.service';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    private aiAnalysisService: AiAnalysisService,
  ) {}

  async create(createItemDto: CreateItemDto, userId: string) {
    const item = this.itemRepository.create({
      ...createItemDto,
      userId,
    });

    const savedItem = await this.itemRepository.save(item);
    return this.findOne(savedItem.id);
  }

  async createFromUpload(file: Express.Multer.File, userId: string) {
    if (!file) {
      throw new Error('Nenhum arquivo foi enviado');
    }

    // Construir a URL da imagem
    // Em produção, você pode usar um serviço de armazenamento como S3, Cloudinary, etc.
    // Por enquanto, usaremos o caminho local
    const imageUrl = `${process.env.API_URL || 'http://localhost:3000'}/uploads/${file.filename}`;

    const item = this.itemRepository.create({
      imageUrl,
      userId,
    });

    const savedItem = await this.itemRepository.save(item);
    return this.findOne(savedItem.id);
  }

  async analyzeImageWithAI(file: Express.Multer.File, userId: string) {
    if (!file) {
      throw new Error('Nenhum arquivo foi enviado');
    }

    // Construir a URL da imagem
    const imageUrl = `${process.env.API_URL || 'http://localhost:3000'}/uploads/${file.filename}`;

    // Analisar a imagem com o Gemini AI
    const analysisResult = await this.aiAnalysisService.analyzeImage(
      file.buffer,
      file.mimetype
    );

    // Criar o item com as informações da análise
    const item = this.itemRepository.create({
      imageUrl,
      userId,
      predictedCategoryId: analysisResult.categoryId,
      confidence: analysisResult.confidence,
    });

    const savedItem = await this.itemRepository.save(item);

    // Retornar o item com informações adicionais da análise
    return {
      ...await this.findOne(savedItem.id),
      analysisDetails: {
        objectName: analysisResult.objectName,
        description: analysisResult.description,
      },
    };
  }

  async findAll(page = 1, limit = 10, userId?: string) {
    const queryBuilder = this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.user', 'user')
      .leftJoinAndSelect('item.predictedCategory', 'predictedCategory')
      .orderBy('item.createdAt', 'DESC');

    if (userId) {
      queryBuilder.where('item.userId = :userId', { userId });
    }

    const [items, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ['user', 'predictedCategory'],
    });

    if (!item) {
      throw new NotFoundException('Item não encontrado');
    }

    return item;
  }

  async findByUserId(userId: string, page = 1, limit = 10) {
    return this.findAll(page, limit, userId);
  }

  async update(id: string, updateItemDto: UpdateItemDto, userId: string) {
    const item = await this.findOne(id);

    // Verificar se o usuário é o criador do item
    if (item.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para editar este item');
    }

    await this.itemRepository.update(id, updateItemDto);
    return this.findOne(id);
  }

  async remove(id: string, userId: string) {
    const item = await this.findOne(id);

    // Verificar se o usuário é o criador do item
    if (item.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para excluir este item');
    }

    await this.itemRepository.delete(id);
    return { message: 'Item removido com sucesso' };
  }

  async updatePrediction(id: string, predictedCategoryId: string, confidence: number, userId: string) {
    const item = await this.findOne(id);

    // Verificar se o usuário é o criador do item
    if (item.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para atualizar este item');
    }

    await this.itemRepository.update(id, {
      predictedCategoryId,
      confidence,
    });

    return this.findOne(id);
  }

  async getStats(userId?: string) {
    const queryBuilder = this.itemRepository.createQueryBuilder('item');

    if (userId) {
      queryBuilder.where('item.userId = :userId', { userId });
    }

    const total = await queryBuilder.getCount();

    const categorized = await queryBuilder.andWhere('item.predictedCategoryId IS NOT NULL').getCount();

    const highConfidence = await queryBuilder
      .andWhere('item.confidence >= :confidence', { confidence: 0.8 })
      .getCount();

    return {
      total,
      categorized,
      highConfidence,
      uncategorized: total - categorized,
    };
  }
}
