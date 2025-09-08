import { Injectable } from '@nestjs/common';
// import { ImageAnnotatorClient } from '@google-cloud/vision';

export interface ClassificationResult {
  category: string;
  confidence: number;
  instruction: string;
}

@Injectable()
export class ImageClassificationService {
  // private client: ImageAnnotatorClient;

  constructor() {
    // Uncomment when Google Cloud credentials are configured
    // this.client = new ImageAnnotatorClient();
  }

  async classifyImage(imageBuffer: Buffer): Promise<ClassificationResult> {
    try {
      // For now, we'll use a mock classification
      // In production, uncomment the Google Vision API integration below
      
      return this.mockClassification();

      /* 
      // Google Vision API integration (uncomment when ready)
      const [result] = await this.client.labelDetection({
        image: { content: imageBuffer },
      });

      const labels = result.labelAnnotations || [];
      
      // Map Google Vision labels to waste categories
      const category = this.mapLabelsToWasteCategory(labels);
      const confidence = labels.length > 0 ? labels[0].score || 0 : 0;
      
      return {
        category,
        confidence,
        instruction: this.getInstructionForCategory(category),
      };
      */
    } catch (error) {
      console.error('Error classifying image:', error);
      return {
        category: 'DESCONHECIDO',
        confidence: 0,
        instruction: 'Não foi possível classificar este item. Consulte as orientações locais.',
      };
    }
  }

  private mockClassification(): ClassificationResult {
    // Mock classification for development
    const categories = [
      {
        category: 'PLASTICO',
        confidence: 0.85,
        instruction: 'Lixo RECICLÁVEL - Plástico PET. Limpe antes de descartar.',
      },
      {
        category: 'PAPEL',
        confidence: 0.92,
        instruction: 'Lixo RECICLÁVEL - Papel. Mantenha seco e limpo.',
      },
      {
        category: 'METAL',
        confidence: 0.78,
        instruction: 'Lixo RECICLÁVEL - Metal. Pode ser reciclado.',
      },
      {
        category: 'VIDRO',
        confidence: 0.88,
        instruction: 'Lixo RECICLÁVEL - Vidro. Cuidado ao manusear.',
      },
      {
        category: 'ORGANICO',
        confidence: 0.91,
        instruction: 'Lixo ORGÂNICO - Pode ser compostado.',
      },
      {
        category: 'ELETRONICO',
        confidence: 0.76,
        instruction: 'Lixo ELETRÔNICO - Procure pontos de coleta específicos.',
      },
    ];

    const randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex];
  }

  private mapLabelsToWasteCategory(labels: any[]): string {
    // Map Google Vision labels to waste categories
    const labelTexts = labels.map(label => label.description?.toLowerCase() || '');
    
    if (labelTexts.some(text => text.includes('bottle') || text.includes('plastic'))) {
      return 'PLASTICO';
    }
    if (labelTexts.some(text => text.includes('paper') || text.includes('book') || text.includes('document'))) {
      return 'PAPEL';
    }
    if (labelTexts.some(text => text.includes('metal') || text.includes('can') || text.includes('aluminum'))) {
      return 'METAL';
    }
    if (labelTexts.some(text => text.includes('glass') || text.includes('bottle'))) {
      return 'VIDRO';
    }
    if (labelTexts.some(text => text.includes('food') || text.includes('organic'))) {
      return 'ORGANICO';
    }
    if (labelTexts.some(text => text.includes('electronic') || text.includes('phone') || text.includes('computer'))) {
      return 'ELETRONICO';
    }

    return 'OUTROS';
  }

  private getInstructionForCategory(category: string): string {
    const instructions = {
      PLASTICO: 'Lixo RECICLÁVEL - Plástico. Limpe antes de descartar.',
      PAPEL: 'Lixo RECICLÁVEL - Papel. Mantenha seco e limpo.',
      METAL: 'Lixo RECICLÁVEL - Metal. Pode ser reciclado.',
      VIDRO: 'Lixo RECICLÁVEL - Vidro. Cuidado ao manusear.',
      ORGANICO: 'Lixo ORGÂNICO - Pode ser compostado.',
      ELETRONICO: 'Lixo ELETRÔNICO - Procure pontos de coleta específicos.',
      OUTROS: 'Consulte as orientações locais para descarte.',
    };

    return instructions[category] || instructions.OUTROS;
  }
}
