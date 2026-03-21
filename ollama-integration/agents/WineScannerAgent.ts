import { BaseAgent } from './BaseAgent';
import type { AgentResponse, WineScannerInput, WineScannerOutput } from '../types';

const SYSTEM_PROMPT = `Ты - сомелье по винам Краснодарского края. Распознай вино и предложи маршрут. На русском. JSON.`;

const WINERIES = `Винодельни: Фанагория (ст. Натухаевская), Абрау-Дюрсо (озеро Абрау), Гай-Кодзор (Геленджик), Скалистый Берег (Абрау), Шато де Талю, Абрау-Любава`;

export class WineScannerAgent extends BaseAgent {
  constructor() {
    super({
      name: 'WineScannerAgent',
      type: 'wine_scanner',
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.6,
    });
  }

  async process(input: WineScannerInput): Promise<AgentResponse<WineScannerOutput>> {
    try {
      const prompt = this.buildPrompt(input);
      const { data } = await this.callOllamaStructured<WineScannerOutput>(prompt, {
        winery: { name: 'string', location: 'string', description: 'string', match: 'number' },
        wines: [{ name: 'string', type: 'string', description: 'string' }],
        nearbyLocations: [{ id: 'number', title: 'string', distance: 'string', description: 'string' }],
        tourRecommendation: 'string',
      });

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private buildPrompt(input: WineScannerInput): string {
    const info = [input.wineName, input.wineDescription, input.grapeVariety].filter(Boolean).join(', ');
    return `${WINERIES}\nВино: ${info}\n\nJSON: {"winery":{},"wines":[],"nearbyLocations":[],"tourRecommendation":""}`;
  }
}

export const wineScannerAgent = new WineScannerAgent();
