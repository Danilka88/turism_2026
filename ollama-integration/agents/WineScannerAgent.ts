import { BaseAgent } from './BaseAgent';
import type { AgentResponse, WineScannerInput, WineScannerOutput } from '../types';

const SYSTEM_PROMPT = `Ты - сомелье. Отвечай кратко на русском.`;

export class WineScannerAgent extends BaseAgent {
  constructor() {
    super({
      name: 'WineScannerAgent',
      type: 'wine_scanner',
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.3,
      maxTokens: 150,
    });
  }

  async process(input: WineScannerInput): Promise<AgentResponse<WineScannerOutput>> {
    try {
      const wineInfo = input.wineName || input.wineDescription || 'Вино';
      
      const response = await this.ollama.chat([
        { role: 'user', content: `Рекомендуй винодельню для "${wineInfo}" в Краснодарском крае. Кратко на русском.` }
      ]);

      return {
        success: true,
        data: {
          winery: {
            name: response.response?.split('\n')[0] || 'Винодельня Кубани',
            location: 'Краснодарский край',
            description: response.response || 'Рекомендуем посетить',
            match: 85,
          },
          wines: [{
            name: wineInfo,
            type: 'Красное/Белое',
            description: 'Рекомендовано сомелье',
          }],
          nearbyLocations: [],
          tourRecommendation: 'Дегустация + экскурсия',
        },
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export const wineScannerAgent = new WineScannerAgent();
