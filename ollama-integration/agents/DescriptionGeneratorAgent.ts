import { BaseAgent } from './BaseAgent';
import type { AgentResponse, DescriptionGeneratorInput, DescriptionGeneratorOutput } from '../types';

const SYSTEM_PROMPT = `Ты - копирайтер-путешественник. Создай привлекательные описания мест. На русском. JSON.`;

export class DescriptionGeneratorAgent extends BaseAgent {
  constructor() {
    super({
      name: 'DescriptionGeneratorAgent',
      type: 'description_generator',
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.8,
    });
  }

  async process(input: DescriptionGeneratorInput): Promise<AgentResponse<DescriptionGeneratorOutput>> {
    try {
      const prompt = this.buildPrompt(input);
      const { data } = await this.callOllamaStructured<DescriptionGeneratorOutput>(prompt, {
        title: 'string',
        shortDescription: 'string',
        extendedDescription: 'string',
        tags: 'array<string>',
        matchText: 'string',
        activityDescriptions: [{ id: 'string', name: 'string', description: 'string' }],
        foodDescriptions: [{ id: 'string', name: 'string', description: 'string' }],
      });

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private buildPrompt(input: DescriptionGeneratorInput): string {
    const tone = input.tone || 'casual';
    const loc = input.location;
    return `Создай описание места в стиле ${tone}.\nНазвание: ${loc?.title || '?'}\nОписание: ${loc?.description || '?'}\n\nJSON: {"title":"","shortDescription":"","extendedDescription":"","tags":[],"matchText":"","activityDescriptions":[],"foodDescriptions":[]}`;
  }
}

export const descriptionGeneratorAgent = new DescriptionGeneratorAgent();
