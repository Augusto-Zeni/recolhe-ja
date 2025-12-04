import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AiAnalysisService } from './ai-analysis.service';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Category])],
  providers: [AiAnalysisService],
  exports: [AiAnalysisService],
})
export class AiAnalysisModule {}
