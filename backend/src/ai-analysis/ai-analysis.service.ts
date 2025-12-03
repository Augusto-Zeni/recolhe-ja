import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';

export interface ImageAnalysisResult {
  objectName: string;
  categoryId: string;
  categoryName: string;
  confidence: number;
  description?: string;
}

@Injectable()
export class AiAnalysisService {
  private genAI: GoogleGenerativeAI;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY não está configurada nas variáveis de ambiente');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async analyzeImage(imageBuffer: Buffer, mimeType: string): Promise<ImageAnalysisResult> {
    try {
      // Buscar todas as categorias do banco de dados
      const categories = await this.categoryRepository.find();
      const categoryNames = categories.map(cat => cat.name).join(', ');

      // Criar prompt para o Gemini
      const prompt = `Analise esta imagem e identifique o objeto principal que deve ser descartado ou reciclado.

Categorias disponíveis: ${categoryNames}

Por favor, retorne APENAS um objeto JSON válido com a seguinte estrutura (sem markdown, sem texto adicional):
{
  "objectName": "nome do objeto identificado",
  "categoryName": "nome exato de UMA categoria da lista acima que melhor se aplica",
  "confidence": número entre 0 e 1 representando a confiança na classificação,
  "description": "breve descrição do objeto e por que foi classificado nesta categoria"
}

IMPORTANTE:
- Use EXATAMENTE um dos nomes de categoria da lista fornecida
- Retorne APENAS o objeto JSON, sem formatação markdown ou texto adicional
- O campo confidence deve ser um número decimal entre 0 e 1`;

      // Configurar o modelo Gemini
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      // Preparar a imagem para envio
      const imagePart = {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType: mimeType,
        },
      };

      // Enviar para o Gemini
      const result = await model.generateContent([prompt, imagePart]);
      const response = result.response;
      const text = response.text();

      // Parsear a resposta JSON
      let analysisData;
      try {
        // Remover possíveis markdown code blocks
        const cleanedText = text.replace(/```json\s*|\s*```/g, '').trim();
        analysisData = JSON.parse(cleanedText);
      } catch (parseError) {
        throw new Error(`Erro ao parsear resposta do Gemini: ${text}`);
      }

      // Validar e encontrar a categoria correspondente
      const category = categories.find(
        cat => cat.name.toLowerCase() === analysisData.categoryName.toLowerCase()
      );

      if (!category) {
        // Se não encontrar exata, tentar encontrar a mais similar
        const similarCategory = this.findMostSimilarCategory(analysisData.categoryName, categories);
        if (!similarCategory) {
          throw new Error(`Categoria "${analysisData.categoryName}" não encontrada no banco de dados`);
        }

        return {
          objectName: analysisData.objectName,
          categoryId: similarCategory.id,
          categoryName: similarCategory.name,
          confidence: analysisData.confidence * 0.9, // Reduz um pouco a confiança por não ser match exato
          description: analysisData.description,
        };
      }

      return {
        objectName: analysisData.objectName,
        categoryId: category.id,
        categoryName: category.name,
        confidence: analysisData.confidence,
        description: analysisData.description,
      };

    } catch (error) {
      console.error('Erro ao analisar imagem com Gemini:', error);
      throw new InternalServerErrorException(
        `Erro ao analisar imagem: ${error.message}`
      );
    }
  }

  private findMostSimilarCategory(categoryName: string, categories: Category[]): Category | null {
    const normalizedName = categoryName.toLowerCase().trim();

    // Tentar encontrar por substring
    for (const category of categories) {
      const normalizedCategoryName = category.name.toLowerCase().trim();
      if (normalizedCategoryName.includes(normalizedName) || normalizedName.includes(normalizedCategoryName)) {
        return category;
      }
    }

    // Mapeamento de sinônimos comuns
    const synonymMap: { [key: string]: string[] } = {
      'plástico': ['plastico', 'plastic', 'pvc', 'pet'],
      'papel': ['cardboard', 'papelão', 'papelao', 'cartolina'],
      'metal': ['alumínio', 'aluminio', 'aço', 'aco', 'ferro', 'lata'],
      'vidro': ['glass', 'cristal'],
      'orgânico': ['organico', 'organic', 'compostável', 'compostavel', 'biodegradável', 'biodegradavel'],
      'eletrônicos': ['eletronicos', 'eletrônico', 'eletronico', 'electronic', 'e-waste'],
      'pilhas e baterias': ['pilha', 'bateria', 'battery', 'pilhas', 'baterias'],
      'óleo de cozinha': ['oleo', 'óleo', 'cooking oil', 'oil'],
      'roupas e têxteis': ['roupa', 'tecido', 'textil', 'têxtil', 'textile', 'clothing'],
      'medicamentos': ['medicamento', 'remedio', 'remédio', 'medicine', 'farmaco', 'fármaco'],
    };

    // Buscar usando sinônimos
    for (const [mainCategory, synonyms] of Object.entries(synonymMap)) {
      if (synonyms.some(syn => normalizedName.includes(syn))) {
        const category = categories.find(cat => cat.name.toLowerCase() === mainCategory.toLowerCase());
        if (category) return category;
      }
    }

    return null;
  }
}
