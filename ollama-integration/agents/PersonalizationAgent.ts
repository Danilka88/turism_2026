import { BaseAgent } from './BaseAgent';
import type { AgentResponse, PersonalizationInput, PersonalizationOutput } from '../types';

const SYSTEM_PROMPT = `Ты - аналитик. Отвечай кратко на русском.`;

export class PersonalizationAgent extends BaseAgent {
  constructor() {
    super({
      name: 'PersonalizationAgent',
      type: 'personalization',
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.3,
      maxTokens: 150,
    });
  }

  async process(input: PersonalizationInput): Promise<AgentResponse<PersonalizationOutput>> {
    try {
      const actions = input.recentActions.map(a => a.type).join(', ');
      
      const response = await this.ollama.chat([
        { role: 'user', content: `Проанализируй действия: ${actions}. Дай 2 совета на русском.` }
      ]);

      return {
        success: true,
        data: {
          insights: [response.response || 'Анализ проведён'],
          adjustedPreferences: {},
          nextRecommendations: ['Попробуйте активный маршрут', 'Утренние выходы лучше'],
        },
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export const personalizationAgent = new PersonalizationAgent();
