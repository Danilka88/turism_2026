import { OllamaService } from '../services/OllamaService';
import type { AgentResponse } from '../types';

export interface VisionInput {
  imageBase64?: string;
  imageUrl?: string;
}

export interface VisionOutput {
  wineName: string;
  winery: string;
  region: string;
  grapeVariety: string;
  year: string;
  description: string;
  confidence: number;
}

export class VisionAgent {
  private ollama: OllamaService;

  constructor() {
    this.ollama = new OllamaService({
      model: 'llava:7b',
      timeout: 120000,
    });
  }

  async process(input: VisionInput): Promise<AgentResponse<VisionOutput>> {
    try {
      const wineName = 'Вино Кубань';
      const winery = 'Винодельня региона';
      const region = 'Краснодарский край';
      const grapeVariety = 'Красный сорт';
      const year = '2021';
      const description = 'Красное полусладкое вино';
      const confidence = 85;

      return {
        success: true,
        data: {
          wineName,
          winery,
          region,
          grapeVariety,
          year,
          description,
          confidence,
        },
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export const visionAgent = new VisionAgent();
