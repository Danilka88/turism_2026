import { BaseAgent } from './BaseAgent';
import type { AgentResponse, EmergencyRouteInput, EmergencyRouteOutput, EmergencyProblem } from '../types';

const SYSTEM_PROMPT = `Ты - туристический консультант. Отвечай кратко на русском.`;

export class EmergencyRouteAgent extends BaseAgent {
  constructor() {
    super({
      name: 'EmergencyRouteAgent',
      type: 'emergency_route',
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.3,
      maxTokens: 150,
    });
  }

  async process(input: EmergencyRouteInput): Promise<AgentResponse<EmergencyRouteOutput>> {
    try {
      const problemMap: Record<EmergencyProblem, string> = {
        weather: 'погода',
        closed: 'закрыто',
        crowded: 'толпы',
        bored: 'скучно',
        traffic: 'пробки',
        budget: 'бюджет',
      };

      const problem = problemMap[input.problem] || 'общая проблема';
      
      const response = await this.ollama.chat([
        { role: 'user', content: `Проблема: ${problem}. Дай 2-3 альтернативы на русском.` }
      ]);

      const firstLocation = input.allLocations[0] || {
        id: 1,
        title: 'Альтернативное место',
        description: 'Рекомендуемое место',
        match: 80,
        matchText: 'Альтернатива',
        tags: [],
        lat: 44.5,
        lng: 38.5,
        img: '',
        videos: [],
        foodOptions: [],
        activities: [],
      };

      return {
        success: true,
        data: {
          alternatives: [{
            location: firstLocation,
            solution: response.response || 'Альтернатива найдена',
            distance: '2 км',
            estimatedTime: '10 мин',
          }],
          advice: `Не переживайте! Мы нашли решение.`,
        },
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export const emergencyRouteAgent = new EmergencyRouteAgent();
