import { BaseAgent } from './BaseAgent';
import type { AgentResponse, PersonalizationInput, PersonalizationOutput } from '../types';

const SYSTEM_PROMPT = `Ты - аналитик поведения пользователей. Проанализируй действия и дай рекомендации. На русском. JSON.`;

export class PersonalizationAgent extends BaseAgent {
  constructor() {
    super({
      name: 'PersonalizationAgent',
      type: 'personalization',
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.5,
    });
  }

  async process(input: PersonalizationInput): Promise<AgentResponse<PersonalizationOutput>> {
    try {
      const prompt = this.buildPrompt(input);
      const { data } = await this.callOllamaStructured<PersonalizationOutput>(prompt, {
        insights: 'array<string>',
        adjustedPreferences: { preferredCategories: 'array<string>', excludeCategories: 'array<string>', preferredCompanions: 'array<string>' },
        nextRecommendations: 'array<string>',
      });

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private buildPrompt(input: PersonalizationInput): string {
    const cats = input.userProfile.preferredCategories?.join(', ') || 'не указаны';
    const actions = input.recentActions.map(a => `- ${a.type}: место ${a.locationId}`).join('\n');
    return `Анализируй поведение.\nКатегории: ${cats}\nДействия:\n${actions}\n\nJSON: {"insights":[],"adjustedPreferences":{},"nextRecommendations":[]}`;
  }
}

export const personalizationAgent = new PersonalizationAgent();
