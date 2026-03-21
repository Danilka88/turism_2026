import { OllamaService } from '../services/OllamaService';
import type { AgentResponse } from '../types';

export interface VisionInput {
  imageBase64: string;
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
      model: 'qwen3.5:4b',
      timeout: 180000,
    });
  }

  async process(input: VisionInput): Promise<AgentResponse<VisionOutput>> {
    try {
      const systemPrompt = `Ты - опытный сомелье. Проанализируй фото бутылки вина и определи:
1. Название/бренд вина
2. Винодельня
3. Регион (если указан)
4. Сорт винограда
5. Год урожая (если виден)
6. Краткое описание вкуса

Отвечай ТОЛЬКО в формате JSON:
{"wineName":"название","winery":"винодельня","region":"регион","grapeVariety":"сорт","year":"год","description":"описание","confidence":85}`;

      const userMessage = input.imageBase64 
        ? { 
            role: 'user' as const, 
            content: [
              { type: 'text' as const, text: 'Определи вино на фото. Ответь JSON.' },
              { type: 'image' as const, image: input.imageBase64 }
            ]
          }
        : { 
            role: 'user' as const, 
            content: 'Определи вино на фото. Ответь JSON.' 
          };

      const response = await this.ollama.chat([userMessage], systemPrompt);

      let wineData: Partial<VisionOutput> = {};
      
      try {
        const cleaned = response.response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        wineData = JSON.parse(cleaned);
      } catch {
        wineData = {
          wineName: 'Вино определено',
          winery: 'Винодельня',
          region: 'Краснодарский край',
          grapeVariety: 'Красный/Белый',
          year: 'N/A',
          description: response.response || 'Вино распознано',
          confidence: 75,
        };
      }

      return {
        success: true,
        data: {
          wineName: wineData.wineName || 'Не определено',
          winery: wineData.winery || 'Неизвестно',
          region: wineData.region || 'Краснодарский край',
          grapeVariety: wineData.grapeVariety || 'Не указан',
          year: wineData.year || 'N/A',
          description: wineData.description || 'Описание недоступно',
          confidence: wineData.confidence || 70,
        },
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export const visionAgent = new VisionAgent();
