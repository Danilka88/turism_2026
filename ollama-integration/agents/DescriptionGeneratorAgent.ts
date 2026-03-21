import { BaseAgent } from './BaseAgent';
import type { AgentResponse, DescriptionGeneratorInput, DescriptionGeneratorOutput } from '../types';

const SYSTEM_PROMPT = `Ты - копирайтер. Отвечай кратко на русском.`;

export class DescriptionGeneratorAgent extends BaseAgent {
  constructor() {
    super({
      name: 'DescriptionGeneratorAgent',
      type: 'description_generator',
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.5,
      maxTokens: 150,
    });
  }

  async process(input: DescriptionGeneratorInput): Promise<AgentResponse<DescriptionGeneratorOutput>> {
    try {
      const title = input.location?.title || 'Место';
      const tone = input.tone || 'casual';
      
      const response = await this.ollama.chat([
        { role: 'user', content: `Опиши "${title}" кратко, ${tone} стиль, на русском.` }
      ]);

      return {
        success: true,
        data: {
          title: title,
          shortDescription: response.response?.slice(0, 100) || 'Отличное место',
          extendedDescription: response.response || 'Замечательное место для посещения',
          tags: ['путешествия', 'Кубань'],
          matchText: 'Рекомендуем посетить',
          activityDescriptions: ['Осмотр достопримечательностей'],
          foodDescriptions: ['Местная кухня'],
        },
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export const descriptionGeneratorAgent = new DescriptionGeneratorAgent();
