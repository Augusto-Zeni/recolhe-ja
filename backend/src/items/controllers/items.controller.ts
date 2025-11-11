import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ZodValidationPipe } from 'nestjs-zod';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ItemsService } from '../services/items.service';
import { CreateItemDto, UpdateItemDto, UpdatePredictionDto } from '../dtos/items.dto';

@Controller('items')
@UseGuards(AuthGuard('jwt'))
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Apenas arquivos de imagem são permitidos!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    return this.itemsService.createFromUpload(file, req.user.id);
  }

  @Post()
  create(@Body(new ZodValidationPipe()) createItemDto: CreateItemDto, @Req() req: any) {
    return this.itemsService.create(createItemDto, req.user.id);
  }

  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('userId') userId?: string,
    @Req() req?: any
  ) {
    // Se userId não for fornecido, usar o do usuário logado
    const targetUserId = userId || req.user.id;
    return this.itemsService.findAll(page, limit, targetUserId);
  }

  @Get('my-items')
  findMyItems(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Req() req?: any
  ) {
    return this.itemsService.findByUserId(req.user.id, page, limit);
  }

  @Get('stats')
  getStats(@Req() req: any) {
    return this.itemsService.getStats(req.user.id);
  }

  @Get('all-stats')
  getAllStats() {
    return this.itemsService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(new ZodValidationPipe()) updateItemDto: UpdateItemDto, @Req() req: any) {
    return this.itemsService.update(id, updateItemDto, req.user.id);
  }

  @Patch(':id/prediction')
  updatePrediction(
    @Param('id') id: string,
    @Body(new ZodValidationPipe()) updatePredictionDto: UpdatePredictionDto,
    @Req() req: any
  ) {
    return this.itemsService.updatePrediction(
      id,
      updatePredictionDto.predictedCategoryId,
      updatePredictionDto.confidence,
      req.user.id
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.itemsService.remove(id, req.user.id);
  }
}
