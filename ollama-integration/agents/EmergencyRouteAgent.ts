import { BaseAgent } from './BaseAgent';
import type { AgentResponse, EmergencyRouteInput, EmergencyRouteOutput, EmergencyProblem } from '../types';

const SYSTEM_PROMPT = `Ты - туристический консультант. Найди альтернативы при проблемах. На русском. JSON.`;

const PROBLEMS: Record<EmergencyProblem, string> = {
  weather: 'Погода испортилась - крытые варианты',
  closed: 'Объект закрыт - альтернативы',
  crowded: 'Толпы - уединённые места',
  bored: 'Скучно - экстрим и необычное',
  traffic: 'Пробки - близкие варианты',
  budget: 'Хочу дёшево - бесплатные места',
};

export class EmergencyRouteAgent extends BaseAgent {
  constructor() {
    super({
      name: 'EmergencyRouteAgent',
      type: 'emergency_route',
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.7,
    });
  }

  async process(input: EmergencyRouteInput): Promise<AgentResponse<EmergencyRouteOutput>> {
    try {
      const prompt = this.buildPrompt(input);
      const { data } = await this.callOllamaStructured<EmergencyRouteOutput>(prompt, {
        alternatives: [{ location: { id: 'number', title: 'string', description: 'string' }, solution: 'string', distance: 'string', estimatedTime: 'string' }],
        advice: 'string',
      });

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private buildPrompt(input: EmergencyRouteInput): string {
    const problem = PROBLEMS[input.problem] || input.problem;
    const locs = input.allLocations.slice(0, 20).map(l => `- ${l.title}`).join('\n');
    return `Проблема: ${problem}\nМеста:\n${locs}\n\nJSON: {"alternatives":[],"advice":""}`;
  }
}

export const emergencyRouteAgent = new EmergencyRouteAgent();
