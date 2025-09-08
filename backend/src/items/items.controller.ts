import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
  Query,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ItemsService } from './items.service';
import { ImageClassificationService } from './image-classification.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('api/items')
export class ItemsController {
  constructor(
    private itemsService: ItemsService,
    private imageClassificationService: ImageClassificationService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(new BadRequestException('Only image files are allowed'), false);
        } else {
          cb(null, true);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async classifyImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    // Classify the image
    const classification = await this.imageClassificationService.classifyImage(
      file.buffer || require('fs').readFileSync(file.path),
    );

    // Get user ID if authenticated
    let userId = null;
    try {
      // Try to extract user from JWT token if present
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        // For now, we'll make this endpoint work without authentication
        // but if a valid token is provided, we'll use the user ID
        userId = req.user?.id || null;
      }
    } catch (error) {
      // Continue without user ID if token is invalid
      userId = null;
    }

    // Save the item to database
    const item = await this.itemsService.createItem(
      userId,
      file.filename || file.originalname,
      classification.category,
      classification.confidence,
    );

    return {
      id: item.id,
      predicted_category: classification.category,
      confidence: classification.confidence,
      instruction: classification.instruction,
      image_url: `/uploads/${file.filename}`,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserItems(
    @Request() req,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    const userId = req.user.id;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    return this.itemsService.getUserItems(userId, pageNum, limitNum);
  }

  @Get(':id')
  async getItem(@Param('id') id: string) {
    const item = await this.itemsService.getItemById(id);
    
    if (!item) {
      throw new BadRequestException('Item not found');
    }

    return item;
  }
}
